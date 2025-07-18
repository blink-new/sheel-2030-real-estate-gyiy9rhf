import { createClient } from '@blinkdotnew/sdk'

export const blink = createClient({
  projectId: 'sheel-2030-real-estate-gyiy9rhf',
  authRequired: true
})

export interface Property {
  id: string
  user_id: string
  title: string
  title_ar?: string
  description?: string
  description_ar?: string
  price: number
  property_type: 'sale' | 'rent'
  category: 'house' | 'apartment' | 'condo' | 'townhouse' | 'land' | 'commercial'
  bedrooms?: number
  bathrooms?: number
  square_feet?: number
  address?: string
  address_ar?: string
  city?: string
  city_ar?: string
  contact_name?: string
  contact_phone?: string
  contact_email?: string
  features?: string[]
  images?: string[]
  featured?: boolean
  status?: 'active' | 'sold' | 'rented' | 'inactive'
  created_at?: string
  updated_at?: string
}