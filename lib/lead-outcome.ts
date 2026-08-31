import { z } from 'zod'

export const LEAD_OUTCOMES = ['qualified', 'not_quality', 'contracted'] as const

export const LeadOutcomeUpdateSchema = z.object({
  leadId: z.string().uuid(),
  phone: z
    .string()
    .min(1)
    .regex(/^(\+20|0020|0)?1[0125][0-9]{8,10}$/, 'Invalid Egyptian phone number'),
  outcome: z.enum(LEAD_OUTCOMES),
  outcomeReason: z.string().trim().max(250).optional().default(''),
  landingUrl: z.string().url().or(z.literal('')).optional().default(''),
  fbclid: z.string().max(500).optional().default(''),
  fbp: z.string().max(500).optional().default(''),
  // Retained for backward compatibility with existing sheet payloads.
  marketingConsent: z.boolean().optional().default(true),
  submittedAt: z.iso.datetime().optional(),
  occurredAt: z.iso.datetime().optional(),
})

export type LeadOutcomeUpdate = z.infer<typeof LeadOutcomeUpdateSchema>

export const META_OUTCOME_EVENTS = {
  qualified: ['QualifiedLead'],
  not_quality: ['PantherDisqualifiedLead'],
  // A contracted merchant necessarily passed qualification. Sending both
  // milestones keeps the funnel complete if sales moves directly to won.
  contracted: ['QualifiedLead', 'CompleteRegistration'],
} as const satisfies Record<LeadOutcomeUpdate['outcome'], readonly string[]>
