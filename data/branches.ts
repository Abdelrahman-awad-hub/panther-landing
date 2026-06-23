export interface Branch {
  id: string
  city: string
  cityAr: string
  address: string
  addressAr: string
  phone: string
  areas: string[]
  areasAr: string[]
  isHQ?: boolean
}

export const branches: Branch[] = [
  {
    id: 'cairo',
    city: 'Cairo', cityAr: 'القاهرة',
    address: 'Nasr City, Cairo', addressAr: 'مدينة نصر، القاهرة',
    phone: '+20 2 XXXX XXXX',
    areas:   ['Nasr City','Heliopolis','New Cairo','Maadi','Zamalek','Downtown','Shubra','El Obour'],
    areasAr: ['مدينة نصر','مصر الجديدة','القاهرة الجديدة','المعادي','الزمالك','وسط البلد','شبرا','العبور'],
    isHQ: true,
  },
  {
    id: 'giza',
    city: 'Giza', cityAr: 'الجيزة',
    address: 'Dokki, Giza', addressAr: 'الدقي، الجيزة',
    phone: '+20 2 XXXX XXXX',
    areas:   ['Dokki','6th of October','Sheikh Zayed','Haram','Faisal','Imbaba'],
    areasAr: ['الدقي','السادس من أكتوبر','الشيخ زايد','الهرم','فيصل','إمبابة'],
  },
  {
    id: 'alexandria',
    city: 'Alexandria', cityAr: 'الإسكندرية',
    address: 'Smouha, Alexandria', addressAr: 'سموحة، الإسكندرية',
    phone: '+20 3 XXXX XXXX',
    areas:   ['Smouha','Roushdi','Agami','Borg El Arab','Miami','Sidi Bishr'],
    areasAr: ['سموحة','رشدي','العجمي','برج العرب','ميامي','سيدي بشر'],
  },
  {
    id: 'mansoura',
    city: 'Mansoura', cityAr: 'المنصورة',
    address: 'City Center, Mansoura', addressAr: 'وسط المدينة، المنصورة',
    phone: '+20 50 XXXX XXXX',
    areas:   ['Mansoura','Talkha','Sherbin','Mit Ghamr'],
    areasAr: ['المنصورة','طلخا','شربين','ميت غمر'],
  },
  {
    id: 'tanta',
    city: 'Tanta', cityAr: 'طنطا',
    address: 'El Geish Street, Tanta', addressAr: 'شارع الجيش، طنطا',
    phone: '+20 40 XXXX XXXX',
    areas:   ['Tanta','Kafr El Zayat','Samannoud','Basyoun'],
    areasAr: ['طنطا','كفر الزيات','سمنود','بسيون'],
  },
  {
    id: 'assiut',
    city: 'Assiut', cityAr: 'أسيوط',
    address: 'New Assiut, Assiut', addressAr: 'أسيوط الجديدة، أسيوط',
    phone: '+20 88 XXXX XXXX',
    areas:   ['Assiut','Abnub','El Qusiya','Sohag'],
    areasAr: ['أسيوط','أبنوب','القوصية','سوهاج'],
  },
]
