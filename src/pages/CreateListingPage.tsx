import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload, X, Plus, MapPin } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Textarea } from '../components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Label } from '../components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { Checkbox } from '../components/ui/checkbox'
import { useLanguage } from '../contexts/LanguageContext'
import { blink } from '../lib/blink'
import toast from 'react-hot-toast'

const propertyFeatures = {
  en: [
    'Parking Included', 'Gym Access', 'Pool', 'Concierge', 'City Views',
    'Modern Kitchen', 'Hardwood Floors', 'In-Unit Laundry', 'Balcony',
    'Pet Friendly', 'Fireplace', 'Garden', 'Garage', 'Rooftop Access',
    'Security System', 'Air Conditioning', 'Heating', 'Dishwasher',
    'Walk-in Closet', 'Storage Unit'
  ],
  ar: [
    'موقف سيارات مشمول', 'صالة رياضية', 'مسبح', 'خدمة الكونسيرج', 'إطلالة على المدينة',
    'مطبخ عصري', 'أرضيات خشبية', 'غسالة في الوحدة', 'شرفة',
    'مسموح بالحيوانات الأليفة', 'مدفأة', 'حديقة', 'جراج', 'الوصول إلى السطح',
    'نظام أمني', 'تكييف هواء', 'تدفئة', 'غسالة أطباق',
    'خزانة ملابس واسعة', 'وحدة تخزين'
  ]
}

export default function CreateListingPage() {
  const navigate = useNavigate()
  const { t, language, isRTL } = useLanguage()
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
    })
    return unsubscribe
  }, [])
  
  const [formData, setFormData] = useState({
    title: '',
    titleAr: '',
    description: '',
    descriptionAr: '',
    price: '',
    propertyType: '',
    category: '',
    bedrooms: '',
    bathrooms: '',
    squareFeet: '',
    address: '',
    addressAr: '',
    city: '',
    cityAr: '',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    features: [] as string[]
  })
  
  const [images, setImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleFeatureToggle = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length + images.length > 10) {
      toast.error(language === 'ar' 
        ? 'يمكنك رفع 10 صور كحد أقصى'
        : 'You can upload a maximum of 10 images'
      )
      return
    }

    setImages(prev => [...prev, ...files])
    
    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreviews(prev => [...prev, e.target?.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
    setImagePreviews(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (!user) {
        toast.error(language === 'ar' 
          ? 'يرجى تسجيل الدخول أولاً'
          : 'Please sign in first'
        )
        return
      }

      if (!formData.title || !formData.price || !formData.propertyType || !formData.category) {
        toast.error(language === 'ar' 
          ? 'يرجى ملء جميع الحقول المطلوبة'
          : 'Please fill in all required fields'
        )
        return
      }

      // Upload images to storage
      const imageUrls: string[] = []
      for (const image of images) {
        try {
          const { publicUrl } = await blink.storage.upload(
            image,
            `properties/${user.id}/${Date.now()}-${image.name}`,
            { upsert: true }
          )
          imageUrls.push(publicUrl)
        } catch (error) {
          console.error('Error uploading image:', error)
        }
      }

      // Create property record
      const propertyData = {
        id: `prop_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        user_id: user.id,
        title: formData.title,
        title_ar: formData.titleAr || null,
        description: formData.description || null,
        description_ar: formData.descriptionAr || null,
        price: parseInt(formData.price),
        property_type: formData.propertyType,
        category: formData.category,
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
        bathrooms: formData.bathrooms ? parseFloat(formData.bathrooms) : null,
        square_feet: formData.squareFeet ? parseInt(formData.squareFeet) : null,
        address: formData.address || null,
        address_ar: formData.addressAr || null,
        city: formData.city || null,
        city_ar: formData.cityAr || null,
        contact_name: formData.contactName || null,
        contact_phone: formData.contactPhone || null,
        contact_email: formData.contactEmail || null,
        features: JSON.stringify(formData.features),
        images: JSON.stringify(imageUrls),
        featured: 0,
        status: 'active'
      }

      await blink.db.properties.create(propertyData)
      
      toast.success(language === 'ar' 
        ? 'تم نشر العقار بنجاح!'
        : 'Property listed successfully!'
      )
      
      navigate('/')
    } catch (error) {
      console.error('Error creating listing:', error)
      toast.error(language === 'ar' 
        ? 'حدث خطأ أثناء إنشاء الإعلان'
        : 'Error creating listing'
      )
    } finally {
      setLoading(false)
    }
  }

  const currentFeatures = propertyFeatures[language]

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {language === 'ar' ? 'تسجيل الدخول مطلوب' : 'Sign In Required'}
            </h1>
            <p className="text-gray-600 mb-6">
              {language === 'ar' 
                ? 'يرجى تسجيل الدخول لإنشاء إعلان عقاري'
                : 'Please sign in to create a property listing'
              }
            </p>
            <Button onClick={() => blink.auth.login()}>
              {language === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {language === 'ar' ? 'إنشاء إعلان جديد' : 'Create New Listing'}
          </h1>
          <p className="text-gray-600 mt-2">
            {language === 'ar' 
              ? 'املأ التفاصيل أدناه لإدراج عقارك في شيل'
              : 'Fill out the details below to list your property on Sheel'
            }
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>
                {language === 'ar' ? 'المعلومات الأساسية' : 'Basic Information'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">
                    {t('form.title')} (English) *
                  </Label>
                  <Input
                    id="title"
                    placeholder="e.g., Modern Downtown Apartment"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="titleAr">
                    {t('form.title')} (العربية) *
                  </Label>
                  <Input
                    id="titleAr"
                    placeholder="مثال: شقة عصرية في وسط المدينة"
                    value={formData.titleAr}
                    onChange={(e) => handleInputChange('titleAr', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="description">
                    {t('form.description')} (English)
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your property..."
                    rows={4}
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="descriptionAr">
                    {t('form.description')} (العربية)
                  </Label>
                  <Textarea
                    id="descriptionAr"
                    placeholder="اوصف عقارك..."
                    rows={4}
                    value={formData.descriptionAr}
                    onChange={(e) => handleInputChange('descriptionAr', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="propertyType">
                    {language === 'ar' ? 'نوع العقار' : 'Property Type'} *
                  </Label>
                  <Select value={formData.propertyType} onValueChange={(value) => handleInputChange('propertyType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder={language === 'ar' ? 'اختر النوع' : 'Select type'} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sale">{t('property.for.sale')}</SelectItem>
                      <SelectItem value="rent">{t('property.for.rent')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="category">
                    {language === 'ar' ? 'الفئة' : 'Category'} *
                  </Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder={language === 'ar' ? 'اختر الفئة' : 'Select category'} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="house">{t('property.house')}</SelectItem>
                      <SelectItem value="apartment">{t('property.apartment')}</SelectItem>
                      <SelectItem value="condo">{t('property.condo')}</SelectItem>
                      <SelectItem value="townhouse">{t('property.townhouse')}</SelectItem>
                      <SelectItem value="land">{t('property.land')}</SelectItem>
                      <SelectItem value="commercial">{t('property.commercial')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="price">
                    {t('form.price')} (SAR) *
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder={language === 'ar' ? 'أدخل السعر' : 'Enter price'}
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Property Details */}
          <Card>
            <CardHeader>
              <CardTitle>
                {language === 'ar' ? 'تفاصيل العقار' : 'Property Details'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="bedrooms">{t('form.bedrooms')}</Label>
                  <Input
                    id="bedrooms"
                    type="number"
                    placeholder={language === 'ar' ? 'عدد غرف النوم' : 'Number of bedrooms'}
                    value={formData.bedrooms}
                    onChange={(e) => handleInputChange('bedrooms', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="bathrooms">{t('form.bathrooms')}</Label>
                  <Input
                    id="bathrooms"
                    type="number"
                    step="0.5"
                    placeholder={language === 'ar' ? 'عدد دورات المياه' : 'Number of bathrooms'}
                    value={formData.bathrooms}
                    onChange={(e) => handleInputChange('bathrooms', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="squareFeet">{t('form.sqft')}</Label>
                  <Input
                    id="squareFeet"
                    type="number"
                    placeholder={language === 'ar' ? 'المساحة الإجمالية' : 'Total square footage'}
                    value={formData.squareFeet}
                    onChange={(e) => handleInputChange('squareFeet', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location */}
          <Card>
            <CardHeader>
              <CardTitle>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5" />
                  <span>{t('property.location')}</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="address">
                    {t('form.address')} (English)
                  </Label>
                  <Input
                    id="address"
                    placeholder="123 Main Street"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="addressAr">
                    {t('form.address')} (العربية)
                  </Label>
                  <Input
                    id="addressAr"
                    placeholder="شارع الرئيسي 123"
                    value={formData.addressAr}
                    onChange={(e) => handleInputChange('addressAr', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">
                    {t('form.city')} (English)
                  </Label>
                  <Input
                    id="city"
                    placeholder="Dubai"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="cityAr">
                    {t('form.city')} (العربية)
                  </Label>
                  <Input
                    id="cityAr"
                    placeholder="دبي"
                    value={formData.cityAr}
                    onChange={(e) => handleInputChange('cityAr', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle>
                {language === 'ar' ? 'صور العقار' : 'Property Images'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">
                  {language === 'ar' 
                    ? 'ارفع حتى 10 صور عالية الجودة لعقارك'
                    : 'Upload up to 10 high-quality images of your property'
                  }
                </p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <Button type="button" variant="outline" asChild>
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <Plus className="h-4 w-4 mr-2" />
                    {language === 'ar' ? 'إضافة صور' : 'Add Images'}
                  </label>
                </Button>
              </div>

              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Features */}
          <Card>
            <CardHeader>
              <CardTitle>
                {language === 'ar' ? 'المميزات والخدمات' : 'Features & Amenities'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {currentFeatures.map((feature, index) => (
                  <div key={feature} className="flex items-center space-x-2">
                    <Checkbox
                      id={feature}
                      checked={formData.features.includes(feature)}
                      onCheckedChange={() => handleFeatureToggle(feature)}
                    />
                    <Label htmlFor={feature} className="text-sm">
                      {feature}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>
                {language === 'ar' ? 'معلومات الاتصال' : 'Contact Information'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="contactName">
                    {language === 'ar' ? 'اسم جهة الاتصال' : 'Contact Name'}
                  </Label>
                  <Input
                    id="contactName"
                    placeholder={language === 'ar' ? 'اسمك' : 'Your name'}
                    value={formData.contactName}
                    onChange={(e) => handleInputChange('contactName', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="contactPhone">{t('form.phone')}</Label>
                  <Input
                    id="contactPhone"
                    placeholder="+966 55 123 4567"
                    value={formData.contactPhone}
                    onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="contactEmail">{t('form.email')}</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.contactEmail}
                    onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className={`flex justify-end space-x-4 ${isRTL ? 'space-x-reverse' : ''}`}>
            <Button type="button" variant="outline" onClick={() => navigate('/')}>
              {t('form.cancel')}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading 
                ? (language === 'ar' ? 'جاري النشر...' : 'Publishing...')
                : t('form.submit')
              }
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}