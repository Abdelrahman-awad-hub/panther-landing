export interface Client {
  id: string
  name: string
  category: string
  logo?: string
}

export const clients: Client[] = [
  { id: 'nevo',    name: 'Nevo Pharm',     category: 'Nutritional Supplements',   logo: '/brands/nevo.jpg' },
  { id: 'gorrilla', name: 'Gorrilla',       category: 'Apparel & Sportswear',      logo: '/brands/gorrilla.jpg' },
  { id: 'tadabor', name: 'تدبر',            category: "Bookseller's Shop",         logo: '/brands/tadapor.jpg' },
  { id: 'marven',  name: 'Marven Stores',  category: 'Footwear Brand',            logo: '/brands/marven.png' },
  { id: 'sparko',  name: 'Sparko',         category: 'Accessories',               logo: '/brands/sparko.png' },
  { id: 'beautiful', name: "It's Beautiful", category: 'Cosmetics & Fragrances' },
  { id: 'firstorder', name: 'One Bond', category: 'Cosmetics',              logo: '/brands/oneBond2.jpg' },
  { id: 'garden',  name: 'Garden Store',   category: 'Beauty & Personal Care' },
  { id: 'point',   name: 'Point Chemical', category: 'Automotive Spare Parts',    logo: '/brands/point.jpg' },
]
