import { z } from 'zod'
import type { Stage, StageCategory } from '@/lib/track-status-map'

/** Client → /api/track request. Waybills look like "WY154830", "TS879292". */
export const TrackRequestSchema = z.object({
  waybill: z
    .string()
    .trim()
    .min(3)
    .max(40)
    .regex(/^[A-Za-z0-9_-]+$/, 'Invalid waybill'),
})

export type TrackRequest = z.infer<typeof TrackRequestSchema>

/** A single raw event from Panther `statusHistory`. */
export const RawPantherEventSchema = z.object({
  waybill: z.string().optional(),
  date_created: z.string().optional().default(''),
  status_id: z.union([z.string(), z.number()]).optional(),
  status_ar: z.string().optional().default(''),
  status_en: z.string().optional().default(''),
  reason_ar: z.string().optional().default(''),
  reason_en: z.string().optional().default(''),
  scheduled_date: z.string().optional().default(''),
})

export const PantherHistoryResponseSchema = z.object({
  response: z.array(RawPantherEventSchema),
})

export type RawPantherEvent = z.infer<typeof RawPantherEventSchema>

/** A normalized, customer-facing event returned to the browser. */
export interface TrackEvent {
  stage: Stage
  /** Display-ready date string as rendered by the source (shown verbatim). */
  date: string
  noteEn: string
  noteAr: string
}

/** Successful /api/track response shape. */
export interface TrackResult {
  waybill: string
  currentStage: Stage
  category: StageCategory
  /** Furthest happy-path milestone reached, 0–4. Drives the stepper. */
  furthestProgressOrder: number
  events: TrackEvent[]
}
