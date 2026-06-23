export interface Service {
  id: string
  iconName: string
  titleKey: string
  descKey: string
}

export const services: Service[] = [
  { id: 'shipment-creation', iconName: 'Package',    titleKey: 'item0Title', descKey: 'item0Desc' },
  { id: 'bulk-upload',       iconName: 'Upload',     titleKey: 'item1Title', descKey: 'item1Desc' },
  { id: 'tracking',          iconName: 'MapPin',     titleKey: 'item2Title', descKey: 'item2Desc' },
  { id: 'saved-customers',   iconName: 'Users',      titleKey: 'item3Title', descKey: 'item3Desc' },
  { id: 'label-printing',    iconName: 'Printer',    titleKey: 'item4Title', descKey: 'item4Desc' },
  { id: 'pricing',           iconName: 'DollarSign', titleKey: 'item5Title', descKey: 'item5Desc' },
  { id: 'coverage',          iconName: 'Globe',      titleKey: 'item6Title', descKey: 'item6Desc' },
  { id: 'cod-performance',   iconName: 'BarChart2',  titleKey: 'item7Title', descKey: 'item7Desc' },
]
