import { useState, useEffect } from 'react'
import { Search, MapPin, Home, Building, TrendingUp, Users, Star } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Card, CardContent } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { useLanguage } from '../contexts/LanguageContext'
import { blink, type Property } from '../lib/blink'

export default function HomePage() {
  const { t, language, isRTL } = useLanguage()
  const [searchQuery, setSearchQuery] = useState('')
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      if (!state.isLoading) {
        loadProperties()
      }
    })
    return unsubscribe
  }, [])

  const loadProperties = async () => {
    try {
      setLoading(true)
      const result = await blink.db.properties.list({
        where: { status: 'active' },
        orderBy: { created_at: 'desc' },
        limit: 8
      })
      setProperties(result)
    } catch (error) {
      console.error('Error loading properties:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price: number, type: string) => {
    const formatter = new Intl.NumberFormat(language === 'ar' ? 'ar-SA' : 'en-US')
    if (type === 'rent') {
      return language === 'ar' 
        ? `${formatter.format(price)} ريال/شهر`
        : `SAR ${formatter.format(price)}/month`
    }
    return language === 'ar' 
      ? `${formatter.format(price)} ريال`
      : `SAR ${formatter.format(price)}`
  }

  const getPropertyTitle = (property: Property) => {
    return language === 'ar' && property.title_ar ? property.title_ar : property.title
  }

  const getPropertyLocation = (property: Property) => {
    const city = language === 'ar' && property.city_ar ? property.city_ar : property.city
    const address = language === 'ar' && property.address_ar ? property.address_ar : property.address
    return city || address || 'Location not specified'
  }

  const getPropertyImage = (property: Property) => {
    try {
      if (property.images) {
        const images = typeof property.images === 'string' ? JSON.parse(property.images) : property.images
        if (Array.isArray(images) && images.length > 0) {
          return images[0]
        }
      }
    } catch (error) {
      console.error('Error parsing property images:', error)
    }
    
    // Default images based on category
    const defaultImages = {
      apartment: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop',
      house: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&h=400&fit=crop',
      condo: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop',
      commercial: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop',
      townhouse: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=400&fit=crop',
      land: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&h=400&fit=crop'
    }
    return defaultImages[property.category] || defaultImages.apartment
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              {t('hero.title')}
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              {t('hero.subtitle')}
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-4 bg-white rounded-lg p-2 shadow-lg">
                <div className="flex-1 relative">
                  <Search className={`absolute top-3 h-5 w-5 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} />
                  <Input
                    type="text"
                    placeholder={t('hero.search.placeholder')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`border-0 focus:ring-0 text-gray-900 ${isRTL ? 'pr-10' : 'pl-10'}`}
                  />
                </div>
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  {t('hero.search.button')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <Home className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">{properties.length}+</h3>
              <p className="text-gray-600">
                {language === 'ar' ? 'عقار متاح' : 'Properties Available'}
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">850+</h3>
              <p className="text-gray-600">
                {language === 'ar' ? 'عميل راضي' : 'Happy Clients'}
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
                <Star className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">4.9</h3>
              <p className="text-gray-600">
                {language === 'ar' ? 'تقييم العملاء' : 'Customer Rating'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {language === 'ar' ? 'العقارات المميزة' : 'Featured Properties'}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {language === 'ar' 
                ? 'اكتشف مجموعة مختارة من أفضل العقارات المتاحة للبيع والإيجار'
                : 'Discover our handpicked selection of the finest properties available for sale and rent'
              }
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="w-full h-48 bg-gray-200 animate-pulse"></div>
                  <CardContent className="p-4">
                    <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded animate-pulse mb-3 w-3/4"></div>
                    <div className="h-6 bg-gray-200 rounded animate-pulse mb-3 w-1/2"></div>
                    <div className="flex space-x-4">
                      <div className="h-3 bg-gray-200 rounded animate-pulse w-16"></div>
                      <div className="h-3 bg-gray-200 rounded animate-pulse w-16"></div>
                      <div className="h-3 bg-gray-200 rounded animate-pulse w-16"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : properties.length === 0 ? (
            <div className="text-center py-12">
              <Home className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {language === 'ar' ? 'لا توجد عقارات متاحة' : 'No Properties Available'}
              </h3>
              <p className="text-gray-600 mb-6">
                {language === 'ar' 
                  ? 'كن أول من يضيف عقار إلى المنصة'
                  : 'Be the first to add a property to the platform'
                }
              </p>
              <Button asChild>
                <a href="/create">
                  {language === 'ar' ? 'إضافة عقار' : 'Add Property'}
                </a>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {properties.map((property) => (
                <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="relative">
                    <img
                      src={getPropertyImage(property)}
                      alt={getPropertyTitle(property)}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className={`${property.property_type === 'sale' ? 'bg-green-600' : 'bg-blue-600'} text-white`}>
                        {property.property_type === 'sale' ? t('property.for.sale') : t('property.for.rent')}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                      {getPropertyTitle(property)}
                    </h3>
                    <div className="flex items-center text-gray-600 mb-3">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="text-sm">{getPropertyLocation(property)}</span>
                    </div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl font-bold text-blue-600">
                        {formatPrice(property.price, property.property_type)}
                      </span>
                    </div>
                    {property.bedrooms && property.bedrooms > 0 && (
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>{property.bedrooms} {t('property.bedrooms')}</span>
                        <span>{property.bathrooms} {t('property.bathrooms')}</span>
                        {property.square_feet && <span>{property.square_feet} {t('property.sqft')}</span>}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Button size="lg" variant="outline">
              {language === 'ar' ? 'عرض جميع العقارات' : 'View All Properties'}
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {language === 'ar' ? 'هل لديك عقار للبيع أو الإيجار؟' : 'Have a Property to Sell or Rent?'}
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            {language === 'ar' 
              ? 'انضم إلى آلاف المالكين الذين يثقون في شيل لتسويق عقاراتهم'
              : 'Join thousands of property owners who trust Sheel to market their properties'
            }
          </p>
          <Button size="lg" variant="secondary" asChild>
            <a href="/create">
              {t('nav.create')}
            </a>
          </Button>
        </div>
      </section>
    </div>
  )
}