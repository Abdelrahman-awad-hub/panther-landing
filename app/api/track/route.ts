import { NextRequest, NextResponse } from 'next/server'
import { env } from '@/lib/env'
import {
  TrackRequestSchema,
  type TrackEvent,
  type TrackResult,
} from '@/lib/track-schema'
import {
  resolveStage,
  stageCategory,
  progressOrder,
  stageRank,
  type Stage,
} from '@/lib/track-status-map'

/**
 * No API credentials are available, so we read Panther's PUBLIC tracking page
 * (index.php?action=search&waybill=…) and parse the status table it renders.
 *
 * The page returns a <tbody> of rows shaped "# | waybill | status(ar) | date".
 * An unknown waybill renders a single row containing "لا يوجد بيانات لهذا الرقم".
 *
 * NOTE: this is HTML scraping of an undocumented page — it is intentionally
 * tolerant (matches by trailing columns) but will need updating if Panther
 * changes their markup. A real API key remains the robust long-term path.
 */

const EMPTY_MARKER = 'لا يوجد بيانات'

function decodeEntities(s: string): string {
  return s
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#3[09];|&#x27;|&apos;/g, "'")
}

function stripTags(html: string): string {
  return decodeEntities(html.replace(/<[^>]*>/g, ' '))
    .replace(/\s+/g, ' ')
    .trim()
}

interface ScrapedRow {
  status: string
  date: string
}

/** Pull the status rows out of the public tracking page HTML. */
function parseRows(html: string): { rows: ScrapedRow[]; empty: boolean } {
  const tbody = html.match(/<tbody[^>]*>([\s\S]*?)<\/tbody>/i)?.[1] ?? ''
  if (!tbody) return { rows: [], empty: false }

  const trs = [...tbody.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)].map((m) => m[1])
  const rows: ScrapedRow[] = []
  let empty = false

  for (const tr of trs) {
    const cells = [...tr.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)].map((c) =>
      stripTags(c[1]),
    )
    const joined = cells.join(' ')
    if (joined.includes(EMPTY_MARKER)) {
      empty = true
      continue
    }
    // Columns are "# | waybill | status | date" — read from the end so an
    // extra/missing leading "#" column doesn't shift our fields.
    if (cells.length < 2) continue
    const status = cells[cells.length - 2]
    const date = cells[cells.length - 1]
    if (!status) continue
    rows.push({ status, date })
  }

  return { rows, empty }
}

/**
 * Parse Panther's date strings to epoch ms (NaN if unparseable). Seen formats:
 *   "27/6/2026 05:22 PM"  (D/M/YYYY, 1–2 digit, 12-hour AM/PM — Egyptian)
 *   "2023-09-17 17:04:01" (ISO-ish, 24-hour)
 */
function parseDate(raw: string): number {
  const v = (raw || '').trim()
  if (!v) return NaN

  // ISO-ish "YYYY-MM-DD[ T]HH:MM[:SS]"
  const iso = v.match(/^(\d{4})-(\d{1,2})-(\d{1,2})(?:[ T]+(\d{1,2}):(\d{2})(?::(\d{2}))?)?/)
  if (iso) {
    const [, y, mo, d, h = '0', mi = '0', s = '0'] = iso
    return Date.UTC(+y, +mo - 1, +d, +h, +mi, +s)
  }

  // "D/M/YYYY[ HH:MM[ AM|PM]]" (day-first)
  const dmy = v.match(
    /^(\d{1,2})[/-](\d{1,2})[/-](\d{4})(?:[ T]+(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM|am|pm)?)?/,
  )
  if (dmy) {
    const [, d, mo, y, hRaw = '0', mi = '0', s = '0', ap] = dmy
    let h = +hRaw
    const meridiem = ap?.toUpperCase()
    if (meridiem === 'PM' && h < 12) h += 12
    if (meridiem === 'AM' && h === 12) h = 0
    return Date.UTC(+y, +mo - 1, +d, h, +mi, +s)
  }

  return NaN
}

interface MappedEvent {
  stage: Stage
  date: string
}

/**
 * Order events oldest→newest. Panther's page row order is NOT reliably
 * chronological, so we sort by parsed date, falling back to stage rank when
 * timestamps are equal or unparseable (e.g. a shipment whose statuses all
 * share one timestamp). This makes the "current" stage robust.
 */
function chronoSort(a: MappedEvent, b: MappedEvent): number {
  const da = parseDate(a.date)
  const db = parseDate(b.date)
  if (!Number.isNaN(da) && !Number.isNaN(db) && da !== db) return da - db
  return stageRank(a.stage) - stageRank(b.stage)
}

function normalize(waybill: string, rows: ScrapedRow[]): TrackResult {
  const mapped: MappedEvent[] = rows
    .map((r) => ({ stage: resolveStage({ status_ar: r.status }), date: r.date }))
    .filter((r) => r.stage !== 'HIDDEN')

  const sorted = [...mapped].sort(chronoSort) // oldest → newest

  // Collapse consecutive same-stage events (distinct raw statuses can map to
  // one friendly stage, e.g. Pickup Request + Pickup Received → "Picked Up").
  // Keep the most recent date in each run.
  const collapsed: MappedEvent[] = []
  for (const ev of sorted) {
    const prev = collapsed[collapsed.length - 1]
    if (prev && prev.stage === ev.stage) prev.date = ev.date
    else collapsed.push({ ...ev })
  }

  const events: TrackEvent[] = collapsed
    .map((r) => ({ stage: r.stage, date: r.date, noteEn: '', noteAr: '' }))
    .reverse() // newest first for display

  const current: Stage = collapsed[collapsed.length - 1]?.stage ?? 'IN_TRANSIT'
  const furthestProgressOrder = collapsed.reduce(
    (max, r) => Math.max(max, progressOrder(r.stage)),
    0,
  )

  return {
    waybill,
    currentStage: current,
    category: stageCategory(current),
    furthestProgressOrder,
    events,
  }
}

export async function POST(request: NextRequest) {
  let parsed
  try {
    parsed = TrackRequestSchema.safeParse(await request.json())
  } catch {
    return NextResponse.json({ error: 'invalid' }, { status: 400 })
  }
  if (!parsed.success) {
    return NextResponse.json({ error: 'invalid' }, { status: 400 })
  }

  const waybill = parsed.data.waybill
  const url = `${env.panther.apiBaseUrl}/index.php?action=search&waybill=${encodeURIComponent(waybill)}`

  let upstream: Response
  try {
    upstream = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (PantherTrack)' },
      cache: 'no-store',
    })
  } catch (err) {
    console.error('[track] upstream fetch failed:', err)
    return NextResponse.json({ error: 'server' }, { status: 502 })
  }

  if (upstream.status === 429) {
    return NextResponse.json({ error: 'rate_limited' }, { status: 429 })
  }
  if (!upstream.ok) {
    console.error('[track] upstream status', upstream.status)
    return NextResponse.json({ error: 'server' }, { status: 502 })
  }

  const html = await upstream.text()
  const { rows, empty } = parseRows(html)

  if (empty || rows.length === 0) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 })
  }

  const normalized = normalize(waybill, rows)
  if (normalized.events.length === 0) {
    // Rows existed but were all internal/unmapped statuses.
    return NextResponse.json({ error: 'not_found' }, { status: 404 })
  }

  return NextResponse.json(normalized)
}
