import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Edit, Trash2, Eye, MoreHorizontal, TrendingUp, Home, Users } from 'lucide-react'
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

// Mock data for user's properties
const mockUserProperties = [
  {
    id: '1',
    title: 'Modern Downtown Apartment',
    price: 450000,
    propertyType: 'buy',
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
    price: 850000,
    propertyType: 'buy',
    category: 'commercial',
    status: 'sold',
    views: 156,
    inquiries: 15,
    createdAt: '2024-01-05',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop'
  }
]

export default function Dashboard() {
  const [properties, setProperties] = useState(mockUserProperties)

  const formatPrice = (price: number, type: string) => {
    if (type === 'rent') {
      return `$${price.toLocaleString()}/month`
    }
    return `$${price.toLocaleString()}`
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

  const handleDeleteProperty = (propertyId: string) => {
    setProperties(prev => prev.filter(p => p.id !== propertyId))
  }

  const totalViews = properties.reduce((sum, p) => sum + p.views, 0)
  const totalInquiries = properties.reduce((sum, p) => sum + p.inquiries, 0)
  const activeListings = properties.filter(p => p.status === 'active').length

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage your property listings and track performance</p>
          </div>
          <Button asChild>
            <Link to="/create">
              <Plus className="h-4 w-4 mr-2" />
              New Listing
            </Link>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
              <Home className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeListings}</div>
              <p className="text-xs text-muted-foreground">
                {properties.length - activeListings} inactive
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalViews.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Across all listings
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inquiries</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalInquiries}</div>
              <p className="text-xs text-muted-foreground">
                Potential buyers/renters
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Properties Table */}
        <Card>
          <CardHeader>
            <CardTitle>Your Properties</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All ({properties.length})</TabsTrigger>
                <TabsTrigger value="active">Active ({activeListings})</TabsTrigger>
                <TabsTrigger value="sold">Sold ({properties.filter(p => p.status === 'sold').length})</TabsTrigger>
                <TabsTrigger value="inactive">Inactive ({properties.filter(p => p.status === 'inactive').length})</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-6">
                <PropertyTable properties={properties} onDelete={handleDeleteProperty} />
              </TabsContent>

              <TabsContent value="active" className="mt-6">
                <PropertyTable 
                  properties={properties.filter(p => p.status === 'active')} 
                  onDelete={handleDeleteProperty} 
                />
              </TabsContent>

              <TabsContent value="sold" className="mt-6">
                <PropertyTable 
                  properties={properties.filter(p => p.status === 'sold')} 
                  onDelete={handleDeleteProperty} 
                />
              </TabsContent>

              <TabsContent value="inactive" className="mt-6">
                <PropertyTable 
                  properties={properties.filter(p => p.status === 'inactive')} 
                  onDelete={handleDeleteProperty} 
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
}

function PropertyTable({ properties, onDelete }: PropertyTableProps) {
  const formatPrice = (price: number, type: string) => {
    if (type === 'rent') {
      return `$${price.toLocaleString()}/month`
    }
    return `$${price.toLocaleString()}`
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

  if (properties.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">No properties found in this category.</p>
        <Button asChild>
          <Link to="/create">Create Your First Listing</Link>
        </Button>
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Property</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Views</TableHead>
          <TableHead>Inquiries</TableHead>
          <TableHead>Listed</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {properties.map((property) => (
          <TableRow key={property.id}>
            <TableCell>
              <div className="flex items-center space-x-3">
                <img
                  src={property.image}
                  alt={property.title}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div>
                  <p className="font-medium">{property.title}</p>
                  <p className="text-sm text-gray-600 capitalize">{property.category}</p>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <Badge variant="outline" className="capitalize">
                For {property.propertyType}
              </Badge>
            </TableCell>
            <TableCell className="font-medium">
              {formatPrice(property.price, property.propertyType)}
            </TableCell>
            <TableCell>
              <Badge className={`capitalize ${getStatusColor(property.status)}`}>
                {property.status}
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
                      View
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="text-red-600"
                    onClick={() => onDelete(property.id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
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