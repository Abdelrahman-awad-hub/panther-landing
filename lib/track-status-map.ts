/**
 * Maps Panther Express raw shipment statuses into a small set of friendly,
 * customer-facing stages. Internal/operational statuses are hidden entirely.
 *
 * The `statusHistory` API returns `status_en` / `status_ar` *text* (no
 * `status_id`), and the Arabic spelling varies (e.g. "طلب بيك اب" vs
 * "طلب بيك أب"). So matching is done on NORMALIZED status text, with an
 * optional `status_id` accepted for robustness/future webhook reuse.
 */

export type Stage =
  | 'PICKED_UP'
  | 'IN_TRANSIT'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'RESCHEDULED'
  | 'FAILED'
  | 'PARTIAL'
  | 'RETURNED'
  | 'CANCELLED'
  | 'REPLACEMENT'
  | 'HIDDEN'

export type StageCategory = 'progress' | 'exception' | 'hidden'

/** The ordered happy-path milestones shown in the stepper. */
export const PROGRESS_STAGES = [
  'PICKED_UP',
  'IN_TRANSIT',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
] as const

interface StageDef {
  category: Exclude<StageCategory, 'hidden'>
  ids: number[]
  ar: string[]
  en: string[]
}

const STAGE_DEFS: Record<Exclude<Stage, 'HIDDEN'>, StageDef> = {
  PICKED_UP: {
    category: 'progress',
    ids: [1, 2, 28, 330],
    ar: ['طلب بيك أب', 'تم استلام البيك أب', 'تخصيص البيك أب'],
    en: ['pickup request', 'pickup received', 'pickup assignment', 'picked up'],
  },
  IN_TRANSIT: {
    category: 'progress',
    ids: [3, 16, 26, 29, 125, 400, 450, 115],
    ar: [
      'تم الاستلام في المخزن',
      'في الطريق للمخزن',
      'في الطريق إلي الفرع',
      'تم الاستلام في المخزن (اعادة تشغيل)',
      'استلام في الفرع',
      'توجيه إلى منطقة التوزيع',
      'توجيه من منطقة التوزيع',
      'استلام انتجريشن',
    ],
    en: [
      'received in warehouse',
      'on the way to warehouse',
      'on the way to branch',
      'received at branch',
      'routing to distribution area',
      'routing from distribution area',
      'integration receipt',
      'in transit',
    ],
  },
  OUT_FOR_DELIVERY: {
    category: 'progress',
    ids: [4],
    ar: ['قيد التوصيل'],
    en: ['out for delivery', 'in delivery'],
  },
  DELIVERED: {
    category: 'progress',
    ids: [5],
    ar: ['تسليم ناجح'],
    en: ['delivered', 'successful delivery', 'delivery success'],
  },
  RESCHEDULED: {
    category: 'exception',
    ids: [6],
    ar: ['شحنة مؤجلة'],
    en: ['time scheduled', 'postponed', 'rescheduled'],
  },
  FAILED: {
    category: 'exception',
    ids: [13, 25],
    ar: ['فشل التسليم', 'رفض الاستلام والدفع'],
    en: ['delivery failed', 'refused receipt and payment'],
  },
  PARTIAL: {
    category: 'exception',
    ids: [18],
    ar: ['تسليم جزئي'],
    en: ['partial delivery', 'partially delivered'],
  },
  RETURNED: {
    category: 'exception',
    ids: [14, 27, 7, 8, 20, 24, 105],
    ar: [
      'تم الارتجاع للراسل',
      'في الطريق للراسل',
      'تم الارتجاع للمخزن',
      'تقفيل مرتجع',
      'مرتجع و تم دفع الشحن',
      'طرد مرتجع',
      'مرتجعات انتجريشن',
    ],
    en: [
      'returned to sender',
      'on the way to sender',
      'returned to warehouse',
      'return closed',
      'returned and shipping paid',
      'returned parcel',
      'integration returns',
    ],
  },
  CANCELLED: {
    category: 'exception',
    ids: [19],
    ar: ['شحنة ملغاه', 'شحنة ملغاة'],
    en: ['cancelled', 'canceled'],
  },
  REPLACEMENT: {
    category: 'exception',
    ids: [17, 22],
    ar: ['استبدال', 'مرتجع استبدال'],
    en: ['replacement', 'return replacement'],
  },
}

/** Internal codes explicitly hidden from customers (documented for clarity). */
export const HIDDEN_STATUS_IDS = [100, 110, 120, 135, 21, 23]

// ── Normalization ──────────────────────────────────────────────────────────

function normAr(s: string): string {
  return s
    .replace(/[ً-ْـ]/g, '') // diacritics + tatweel
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/\s+/g, ' ')
    .trim()
}

function normEn(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

// Build reverse lookup tables once.
const ID_TO_STAGE = new Map<number, Stage>()
const AR_TO_STAGE = new Map<string, Stage>()
const EN_TO_STAGE = new Map<string, Stage>()

for (const [stage, def] of Object.entries(STAGE_DEFS) as [Stage, StageDef][]) {
  def.ids.forEach((id) => ID_TO_STAGE.set(id, stage))
  def.ar.forEach((label) => AR_TO_STAGE.set(normAr(label), stage))
  def.en.forEach((label) => EN_TO_STAGE.set(normEn(label), stage))
}

const CATEGORY_OF: Record<Stage, StageCategory> = (() => {
  const out = { HIDDEN: 'hidden' } as Record<Stage, StageCategory>
  for (const [stage, def] of Object.entries(STAGE_DEFS) as [Stage, StageDef][]) {
    out[stage] = def.category
  }
  return out
})()

// ── Public API ───────────────────────────────────────────────────────────────

export interface RawStatusEvent {
  status_id?: string | number
  status_ar?: string
  status_en?: string
}

/** Resolve a single raw status to a customer-facing stage. */
export function resolveStage(event: RawStatusEvent): Stage {
  if (event.status_id != null && event.status_id !== '') {
    const id = Number(event.status_id)
    if (!Number.isNaN(id)) {
      if (HIDDEN_STATUS_IDS.includes(id)) return 'HIDDEN'
      const byId = ID_TO_STAGE.get(id)
      if (byId) return byId
    }
  }
  if (event.status_ar) {
    const byAr = AR_TO_STAGE.get(normAr(event.status_ar))
    if (byAr) return byAr
  }
  if (event.status_en) {
    const byEn = EN_TO_STAGE.get(normEn(event.status_en))
    if (byEn) return byEn
  }
  return 'HIDDEN'
}

export function stageCategory(stage: Stage): StageCategory {
  return CATEGORY_OF[stage]
}

export function isExceptionStage(stage: Stage): boolean {
  return CATEGORY_OF[stage] === 'exception'
}

/** 1-based position of a progress stage, or 0 if not a progress stage. */
export function progressOrder(stage: Stage): number {
  const i = (PROGRESS_STAGES as readonly Stage[]).indexOf(stage)
  return i === -1 ? 0 : i + 1
}

/**
 * How "far along / terminal" a stage is. Used as a tiebreaker when timestamps
 * are equal or unparseable, and to pick the current stage robustly regardless
 * of the source row order (which Panther's public page does not guarantee).
 * Higher = more advanced / more terminal.
 */
const STAGE_RANK: Record<Stage, number> = {
  HIDDEN: 0,
  PICKED_UP: 1,
  IN_TRANSIT: 2,
  OUT_FOR_DELIVERY: 3,
  RESCHEDULED: 4,
  FAILED: 4,
  PARTIAL: 5,
  REPLACEMENT: 5,
  RETURNED: 6,
  CANCELLED: 6,
  DELIVERED: 7,
}

export function stageRank(stage: Stage): number {
  return STAGE_RANK[stage]
}
