import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Edit, Trash2, Eye, MoreHorizontal, Home, Users, TrendingUp } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { useLanguage } from '../contexts/LanguageContext'
import toast from 'react-hot-toast'

// Mock data for user's properties
const mockUserProperties = [
  {
    id: '1',
    title: 'Modern Downtown Apartment',
    titleAr: 'شقة عصرية في وسط المدينة',
    price: 450000,
    propertyType: 'sale',
    category: 'apartment',
    status: 'active',
    views: 245,
    inquiries: 12,
    createdAt: '2024-01-15',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop'
  },
  {
    id: '2',
    title: 'Cozy Family Home',
    titleAr: 'منزل عائلي مريح',
    price: 2800,
    propertyType: 'rent',
    category: 'house',
    status: 'active',
    views: 189,
    inquiries: 8,
    createdAt: '2024-01-10',
    image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=300&fit=crop'
  },
  {
    id: '3',
    title: 'Commercial Office Space',
    titleAr: 'مساحة مكتبية تجارية',
    price: 850000,
    propertyType: 'sale',
    category: 'commercial',
    status: 'sold',
    views: 156,
    inquiries: 15,
    createdAt: '2024-01-05',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop'
  }
]

export default function DashboardPage() {
  const { t, language, isRTL } = useLanguage()
  const [properties, setProperties] = useState(mockUserProperties)

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'sold':
        return 'bg-blue-100 text-blue-800'
      case 'rented':
        return 'bg-purple-100 text-purple-800'
      case 'inactive':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    const statusMap = {
      active: language === 'ar' ? 'نشط' : 'Active',
      sold: language === 'ar' ? 'مباع' : 'Sold',
      rented: language === 'ar' ? 'مؤجر' : 'Rented',
      inactive: language === 'ar' ? 'غير نشط' : 'Inactive'
    }
    return statusMap[status as keyof typeof statusMap] || status
  }

  const handleDeleteProperty = (propertyId: string) => {
    setProperties(prev => prev.filter(p => p.id !== propertyId))
    toast.success(language === 'ar' ? 'تم حذف العقار بنجاح' : 'Property deleted successfully')
  }

  const totalViews = properties.reduce((sum, p) => sum + p.views, 0)
  const totalInquiries = properties.reduce((sum, p) => sum + p.inquiries, 0)
  const activeListings = properties.filter(p => p.status === 'active').length

  const getPropertyTitle = (property: any) => {
    return language === 'ar' ? property.titleAr : property.title
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t('dashboard.title')}</h1>
            <p className="text-gray-600 mt-2">{t('dashboard.subtitle')}</p>
          </div>
          <Button asChild>
            <Link to="/create">
              <Plus className="h-4 w-4 mr-2" />
              {t('dashboard.new.listing')}
            </Link>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('dashboard.active.listings')}</CardTitle>
              <Home className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeListings}</div>
              <p className="text-xs text-muted-foreground">
                {properties.length - activeListings} {language === 'ar' ? 'غير نشط' : 'inactive'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('dashboard.total.views')}</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalViews.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {language === 'ar' ? 'عبر جميع الإعلانات' : 'Across all listings'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('dashboard.inquiries')}</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalInquiries}</div>
              <p className="text-xs text-muted-foreground">
                {language === 'ar' ? 'مشترين/مستأجرين محتملين' : 'Potential buyers/renters'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Properties Table */}
        <Card>
          <CardHeader>
            <CardTitle>
              {language === 'ar' ? 'عقاراتك' : 'Your Properties'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">
                  {language === 'ar' ? 'الكل' : 'All'} ({properties.length})
                </TabsTrigger>
                <TabsTrigger value="active">
                  {language === 'ar' ? 'نشط' : 'Active'} ({activeListings})
                </TabsTrigger>
                <TabsTrigger value="sold">
                  {language === 'ar' ? 'مباع' : 'Sold'} ({properties.filter(p => p.status === 'sold').length})
                </TabsTrigger>
                <TabsTrigger value="inactive">
                  {language === 'ar' ? 'غير نشط' : 'Inactive'} ({properties.filter(p => p.status === 'inactive').length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-6">
                <PropertyTable 
                  properties={properties} 
                  onDelete={handleDeleteProperty}
                  language={language}
                  t={t}
                  formatPrice={formatPrice}
                  getStatusColor={getStatusColor}
                  getStatusText={getStatusText}
                  getPropertyTitle={getPropertyTitle}
                />
              </TabsContent>

              <TabsContent value="active" className="mt-6">
                <PropertyTable 
                  properties={properties.filter(p => p.status === 'active')} 
                  onDelete={handleDeleteProperty}
                  language={language}
                  t={t}
                  formatPrice={formatPrice}
                  getStatusColor={getStatusColor}
                  getStatusText={getStatusText}
                  getPropertyTitle={getPropertyTitle}
                />
              </TabsContent>

              <TabsContent value="sold" className="mt-6">
                <PropertyTable 
                  properties={properties.filter(p => p.status === 'sold')} 
                  onDelete={handleDeleteProperty}
                  language={language}
                  t={t}
                  formatPrice={formatPrice}
                  getStatusColor={getStatusColor}
                  getStatusText={getStatusText}
                  getPropertyTitle={getPropertyTitle}
                />
              </TabsContent>

              <TabsContent value="inactive" className="mt-6">
                <PropertyTable 
                  properties={properties.filter(p => p.status === 'inactive')} 
                  onDelete={handleDeleteProperty}
                  language={language}
                  t={t}
                  formatPrice={formatPrice}
                  getStatusColor={getStatusColor}
                  getStatusText={getStatusText}
                  getPropertyTitle={getPropertyTitle}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

interface PropertyTableProps {
  properties: typeof mockUserProperties
  onDelete: (id: string) => void
  language: string
  t: (key: string) => string
  formatPrice: (price: number, type: string) => string
  getStatusColor: (status: string) => string
  getStatusText: (status: string) => string
  getPropertyTitle: (property: any) => string
}

function PropertyTable({ 
  properties, 
  onDelete, 
  language, 
  t, 
  formatPrice, 
  getStatusColor, 
  getStatusText,
  getPropertyTitle 
}: PropertyTableProps) {
  if (properties.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">
          {language === 'ar' 
            ? 'لا توجد عقارات في هذه الفئة'
            : 'No properties found in this category.'
          }
        </p>
        <Button asChild>
          <Link to="/create">
            {language === 'ar' ? 'إنشاء أول إعلان' : 'Create Your First Listing'}
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{language === 'ar' ? 'العقار' : 'Property'}</TableHead>
          <TableHead>{language === 'ar' ? 'النوع' : 'Type'}</TableHead>
          <TableHead>{t('property.price')}</TableHead>
          <TableHead>{language === 'ar' ? 'الحالة' : 'Status'}</TableHead>
          <TableHead>{language === 'ar' ? 'المشاهدات' : 'Views'}</TableHead>
          <TableHead>{t('dashboard.inquiries')}</TableHead>
          <TableHead>{language === 'ar' ? 'تاريخ الإدراج' : 'Listed'}</TableHead>
          <TableHead className="text-right">{language === 'ar' ? 'الإجراءات' : 'Actions'}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {properties.map((property) => (
          <TableRow key={property.id}>
            <TableCell>
              <div className="flex items-center space-x-3">
                <img
                  src={property.image}
                  alt={getPropertyTitle(property)}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div>
                  <p className="font-medium">{getPropertyTitle(property)}</p>
                  <p className="text-sm text-gray-600 capitalize">
                    {t(`property.${property.category}`)}
                  </p>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <Badge variant="outline" className="capitalize">
                {property.propertyType === 'sale' ? t('property.for.sale') : t('property.for.rent')}
              </Badge>
            </TableCell>
            <TableCell className="font-medium">
              {formatPrice(property.price, property.propertyType)}
            </TableCell>
            <TableCell>
              <Badge className={`capitalize ${getStatusColor(property.status)}`}>
                {getStatusText(property.status)}
              </Badge>
            </TableCell>
            <TableCell>{property.views}</TableCell>
            <TableCell>{property.inquiries}</TableCell>
            <TableCell>{new Date(property.createdAt).toLocaleDateString()}</TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link to={`/property/${property.id}`}>
                      <Eye className="mr-2 h-4 w-4" />
                      {t('common.view')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Edit className="mr-2 h-4 w-4" />
                    {t('common.edit')}
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="text-red-600"
                    onClick={() => onDelete(property.id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    {t('common.delete')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}