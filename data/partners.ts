export interface Partner {
  id: string
  name: string
  type: 'operational' | 'strategic' | 'technology'
}

export const partners: Partner[] = [
  { id: 'p1', name: 'EgyptPost',           type: 'operational' },
  { id: 'p2', name: 'Cairo Logistics Hub', type: 'operational' },
  { id: 'p3', name: 'Delta Warehousing',   type: 'strategic' },
  { id: 'p4', name: 'PayTech Egypt',       type: 'technology' },
  { id: 'p5', name: 'Gulf Express',        type: 'strategic' },
  { id: 'p6', name: 'AlexPort Services',   type: 'operational' },
]
