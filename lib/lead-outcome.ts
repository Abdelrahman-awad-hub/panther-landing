import { z } from 'zod'

export const LEAD_OUTCOMES = [
  'contacted', 'qualified', 'meeting_booked', 'account_created',
  'first_shipment', 'activated_customer', 'not_quality', 'lost', 'contracted',
] as const

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
  clientId: z.string().max(200).optional().default(''),
  sessionId: z.string().max(200).optional().default(''),
  // Retained for backward compatibility with existing sheet payloads.
  marketingConsent: z.boolean().optional().default(true),
  submittedAt: z.iso.datetime().optional(),
  occurredAt: z.iso.datetime().optional(),
})

export type LeadOutcomeUpdate = z.infer<typeof LeadOutcomeUpdateSchema>

export const META_OUTCOME_EVENTS = {
  contacted: ['Contact'],
  qualified: ['QualifiedLead'],
  meeting_booked: ['Schedule'],
  account_created: ['CompleteRegistration'],
  first_shipment: ['PantherFirstShipment'],
  activated_customer: ['PantherActivatedCustomer'],
  not_quality: ['PantherDisqualifiedLead'],
  lost: ['PantherLostLead'],
  // A contracted merchant necessarily passed qualification. Sending both
  // milestones keeps the funnel complete if sales moves directly to won.
  contracted: ['QualifiedLead', 'CompleteRegistration'],
} as const satisfies Record<LeadOutcomeUpdate['outcome'], readonly string[]>

export const GA4_OUTCOME_EVENTS = {
  contacted: 'lead_contacted',
  qualified: 'qualified_lead',
  meeting_booked: 'meeting_booked',
  account_created: 'account_created',
  first_shipment: 'first_shipment',
  activated_customer: 'activated_customer',
  not_quality: 'disqualified_lead',
  lost: 'lost_lead',
  contracted: 'contracted_lead',
} as const satisfies Record<LeadOutcomeUpdate['outcome'], string>
