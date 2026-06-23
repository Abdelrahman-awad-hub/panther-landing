export interface Client {
  id: string
  name: string
  category: string
}

export const clients: Client[] = [
  { id: 'brand-1', name: 'Cairo Closet',  category: 'Fashion' },
  { id: 'brand-2', name: 'Delta Stores',  category: 'Electronics' },
  { id: 'brand-3', name: 'Nile Naturals', category: 'Beauty' },
  { id: 'brand-4', name: 'Memphis Gear',  category: 'Sports' },
  { id: 'brand-5', name: 'Sphinx Home',   category: 'Home & Living' },
  { id: 'brand-6', name: 'Luxor Kids',    category: 'Kids' },
  { id: 'brand-7', name: 'Sahara Supply', category: 'B2B' },
  { id: 'brand-8', name: 'Alex Apparel',  category: 'Fashion' },
]
