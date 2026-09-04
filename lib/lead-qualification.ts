export const VOLUME_CATEGORIES = [
  'under150',
  '150_499',
  '500_999',
  '1000_2999',
  '3000_5000',
  '5001_10000',
  'over10000',
] as const

export type VolumeCategory = (typeof VOLUME_CATEGORIES)[number]
export type WarehouseInterest = 'yes' | 'no' | 'not_applicable'
export type LeadQualification =
  | 'below_minimum'
  | 'qualified_pickup'
  | 'qualified_warehouse'
  | 'pickup_unavailable'
  | 'pending'

export function isCairoOrGiza(city: string) {
  return city === 'Cairo' || city === 'Giza'
}

export function isAtLeast3000(volumeCategory: string) {
  return ['3000_5000', '5001_10000', 'over10000'].includes(volumeCategory)
}

export function needsWarehouseQuestion(city: string, volumeCategory: string) {
  return Boolean(city && volumeCategory && !isCairoOrGiza(city) && !isAtLeast3000(volumeCategory) && volumeCategory !== 'under150')
}

export function classifyLead(input: {
  city?: string
  volumeCategory?: string
  warehouseInterest?: string
}): LeadQualification {
  const { city = '', volumeCategory = '', warehouseInterest = '' } = input
  if (!city || !volumeCategory) return 'pending'
  if (volumeCategory === 'under150') return 'below_minimum'
  if (isCairoOrGiza(city) || isAtLeast3000(volumeCategory)) return 'qualified_pickup'
  if (warehouseInterest === 'yes') return 'qualified_warehouse'
  if (warehouseInterest === 'no') return 'pickup_unavailable'
  return 'pending'
}
