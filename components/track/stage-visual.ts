import {
  Package,
  Truck,
  MapPin,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Undo2,
  XCircle,
  RefreshCw,
  type LucideIcon,
} from 'lucide-react'
import type { Stage } from '@/lib/track-status-map'

export const STAGE_ICON: Record<Stage, LucideIcon> = {
  PICKED_UP: Package,
  IN_TRANSIT: Truck,
  OUT_FOR_DELIVERY: MapPin,
  DELIVERED: CheckCircle2,
  RESCHEDULED: Clock,
  FAILED: AlertTriangle,
  PARTIAL: AlertTriangle,
  RETURNED: Undo2,
  CANCELLED: XCircle,
  REPLACEMENT: RefreshCw,
  HIDDEN: Package,
}

export type Tone = 'success' | 'active' | 'warning' | 'danger' | 'muted'

export function stageTone(stage: Stage): Tone {
  switch (stage) {
    case 'DELIVERED':
      return 'success'
    case 'FAILED':
    case 'CANCELLED':
    case 'RETURNED':
      return 'danger'
    case 'RESCHEDULED':
    case 'PARTIAL':
    case 'REPLACEMENT':
      return 'warning'
    default:
      return 'active'
  }
}

export interface ToneClasses {
  text: string
  bg: string
  ring: string
  dot: string
}

export const TONE_CLASSES: Record<Tone, ToneClasses> = {
  success: {
    text: 'text-emerald-600',
    bg: 'bg-emerald-50',
    ring: 'ring-emerald-200',
    dot: 'bg-emerald-500',
  },
  active: {
    text: 'text-panther-red',
    bg: 'bg-panther-red/10',
    ring: 'ring-panther-red/25',
    dot: 'bg-panther-red',
  },
  warning: {
    text: 'text-amber-600',
    bg: 'bg-amber-50',
    ring: 'ring-amber-200',
    dot: 'bg-amber-500',
  },
  danger: {
    text: 'text-red-600',
    bg: 'bg-red-50',
    ring: 'ring-red-200',
    dot: 'bg-red-500',
  },
  muted: {
    text: 'text-gray-400',
    bg: 'bg-gray-100',
    ring: 'ring-gray-200',
    dot: 'bg-gray-300',
  },
}
