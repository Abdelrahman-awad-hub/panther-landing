import { z } from 'zod'

export const LeadSubmissionSchema = z.object({
  leadId: z.string().uuid(),
  brandName: z.string().min(1),
  phone: z
    .string()
    .min(1)
    .regex(/^(\+20|0020|0)?1[0125][0-9]{8,10}$/, 'Invalid Egyptian phone number'),
  city: z.string().min(1),
  volumeCategory: z.enum(['300', '1000', '5000', '5000plus']),
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
  fbp:         z.string().max(500).optional().default(''),
  ttp:         z.string().max(500).optional().default(''),
  marketingConsent: z.boolean().optional().default(false),
  formSource:  z.string().max(50).optional().default('section'),
  locale:      z.enum(['ar', 'en']).optional().default('en'),
  userAgent:   z.string().optional().default(''),
  submittedAt: z.string().optional(),
  website_confirm: z.string().max(0).optional(),
})

export type LeadSubmission = z.infer<typeof LeadSubmissionSchema>
export type LeadSubmissionInput = z.input<typeof LeadSubmissionSchema>
