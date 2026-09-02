import { z } from 'zod'
import { VOLUME_CATEGORIES } from './lead-qualification'

export const LeadSubmissionSchema = z.object({
  leadId: z.string().uuid(),
  brandName: z.string().min(1),
  phone: z
    .string()
    .min(1)
    .regex(/^(\+20|0020|0)?1[0125][0-9]{8,10}$/, 'Invalid Egyptian phone number'),
  city: z.string().min(1),
  volumeCategory: z.enum(VOLUME_CATEGORIES),
  warehouseInterest: z.enum(['yes', 'no', 'not_applicable']).optional().default('not_applicable'),
  leadQualification: z.enum([
    'below_minimum', 'qualified_pickup', 'qualified_warehouse', 'pickup_unavailable', 'pending',
  ]).optional().default('pending'),
  socialLink:  z.union([z.string().url(), z.literal('')]).optional(),
  websiteUrl:  z.union([z.string().url(), z.literal('')]).optional(),
  referrerUrl: z.string().optional().default(''),
  landingUrl:  z.string().optional().default(''),
  utmSource:   z.string().optional().default(''),
  utmMedium:   z.string().optional().default(''),
  utmCampaign: z.string().optional().default(''),
  utmTerm:     z.string().optional().default(''),
  utmContent:  z.string().optional().default(''),
  gclid:       z.string().max(200).optional().default(''),
  fbclid:      z.string().max(500).optional().default(''),
  ttclid:      z.string().max(500).optional().default(''),
  firstTouchReferrerUrl: z.string().max(2000).optional().default(''),
  firstTouchLandingUrl: z.string().max(2000).optional().default(''),
  firstTouchUtmSource: z.string().max(500).optional().default(''),
  firstTouchUtmMedium: z.string().max(500).optional().default(''),
  firstTouchUtmCampaign: z.string().max(500).optional().default(''),
  firstTouchUtmTerm: z.string().max(500).optional().default(''),
  firstTouchUtmContent: z.string().max(500).optional().default(''),
  firstTouchGclid: z.string().max(500).optional().default(''),
  firstTouchFbclid: z.string().max(500).optional().default(''),
  firstTouchTtclid: z.string().max(500).optional().default(''),
  lastTouchReferrerUrl: z.string().max(2000).optional().default(''),
  lastTouchLandingUrl: z.string().max(2000).optional().default(''),
  lastTouchUtmSource: z.string().max(500).optional().default(''),
  lastTouchUtmMedium: z.string().max(500).optional().default(''),
  lastTouchUtmCampaign: z.string().max(500).optional().default(''),
  lastTouchUtmTerm: z.string().max(500).optional().default(''),
  lastTouchUtmContent: z.string().max(500).optional().default(''),
  lastTouchGclid: z.string().max(500).optional().default(''),
  lastTouchFbclid: z.string().max(500).optional().default(''),
  lastTouchTtclid: z.string().max(500).optional().default(''),
  clientId: z.string().max(200).optional().default(''),
  sessionId: z.string().max(200).optional().default(''),
  fbp:         z.string().max(500).optional().default(''),
  ttp:         z.string().max(500).optional().default(''),
  // Retained for sheet compatibility; this landing now tracks automatically.
  marketingConsent: z.boolean().optional().default(true),
  formSource:  z.string().max(50).optional().default('section'),
  locale:      z.enum(['ar', 'en']).optional().default('en'),
  userAgent:   z.string().optional().default(''),
  clientIp:    z.string().max(100).optional().default(''),
  submittedAt: z.string().optional(),
  website_confirm: z.string().max(0).optional(),
})

export type LeadSubmission = z.infer<typeof LeadSubmissionSchema>
export type LeadSubmissionInput = z.input<typeof LeadSubmissionSchema>
