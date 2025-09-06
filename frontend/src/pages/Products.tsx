import { useState } from 'react';
import {
  Plus,
  Filter,
  Search,
  MapPin,
  Clock,
  Star,
  Edit3,
  Trash2,
  Eye,
  MoreVertical
} from 'lucide-react';


const mockProducts = [
  {
    id: 1,
    product_type_id: 101,
    title: "Baker's Surprise Box",
    description: "Assorted pastries, breads, and desserts from today's baking",
    image_url: "/baker-box.jpg",
    original_price: 24.99,
    discounted_price: 7.99,
    quantity_available: 8,
    pickup_start: "16:00",
    pickup_end: "18:00",
    available_until: "2023-06-15T23:59:00Z",
    rate: 4.7,
    categories: ["Bakery", "Sweet", "Vegetarian"],
    shop: {
      name: "Bakery Delight",
      address: "123 Main St",
      city: "New York"
    }
  },
  {
    id: 2,
    product_type_id: 102,
    title: "Sushi Platter Surprise",
    description: "Fresh sushi and sashimi selection from today's preparation",
    image_url: "/sushi-box.jpg",
    original_price: 35.99,
    discounted_price: 12.99,
    quantity_available: 3,
    pickup_start: "19:00",
    pickup_end: "21:00",
    available_until: "2023-06-15T22:00:00Z",
    rate: 4.5,
    categories: ["Japanese", "Seafood", "Healthy"],
    shop: {
      name: "Bakery Delight",
      address: "123 Main St",
      city: "New York"
    }
  },
  {
    id: 3,
    product_type_id: 103,
    title: "Vegetarian Lunch Box",
    description: "Fresh salads, sandwiches and healthy options from our daily menu",
    image_url: "/veg-box.jpg",
    original_price: 18.99,
    discounted_price: 6.99,
    quantity_available: 12,
    pickup_start: "14:00",
    pickup_end: "16:00",
    available_until: "2023-06-15T20:00:00Z",
    rate: 4.8,
    categories: ["Vegetarian", "Healthy", "Salads"],
    shop: {
      name: "Bakery Delight",
      address: "123 Main St",
      city: "New York"
    }
  },
  {
    id: 4,
    product_type_id: 104,
    title: "Cafe Pastry Collection",
    description: "Assorted croissants, muffins and cookies from our cafe",
    image_url: "/cafe-box.jpg",
    original_price: 20.99,
    discounted_price: 6.99,
    quantity_available: 0,
    pickup_start: "17:00",
    pickup_end: "19:00",
    available_until: "2023-06-15T21:00:00Z",
    rate: 4.6,
    categories: ["Bakery", "Sweet", "Cafe"],
    shop: {
      name: "Bakery Delight",
      address: "123 Main St",
      city: "New York"
    }
  }
];

const ProductsPage = () => {
  const [products, setProducts] = useState(mockProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');


  const categories = ["All", "Bakery", "Sweet", "Vegetarian", "Japanese", "Seafood", "Healthy", "Salads", "Cafe"];

  const handleDelete = (id:string|number) => {
    setProducts(products.filter(product => product.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Products</h1>
          <p className="text-gray-600">Manage your surplus food packages</p>
        </div>
        <button className="mt-4 md:mt-0 flex items-center bg-primaryColor hover:bg-primaryColor-dark text-white font-medium py-2 px-4 rounded-lg">
          <Plus size={18} className="mr-2" />
          Add New Product
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primaryColor"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-4">
            <select 
              className="bg-white border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:border-primaryColor"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="soldout">Sold Out</option>
            </select>
            
            <select 
              className="bg-white border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:border-primaryColor"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              {categories.map(category => (
                <option key={category} value={category.toLowerCase()}>
                  {category}
                </option>
              ))}
            </select>
            
            <button className="flex items-center border border-gray-300 rounded-lg py-2 px-4 text-gray-700">
              <Filter size={18} className="mr-2" />
              More Filters
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <div key={product.id} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="relative">
              <div className="h-48 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">Product Image</span>
              </div>
            
              <div className="absolute top-4 right-4 bg-white rounded-full py-1 px-2 flex items-center shadow">
                <Star size={14} className="text-yellow-400 fill-current" />
                <span className="text-sm font-medium ml-1">{product.rate}</span>
              </div>
              
              {product.quantity_available === 0 && (
                <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                  <span className="text-white font-bold text-xl bg-red-500 py-1 px-3 rounded-lg">SOLD OUT</span>
                </div>
              )}
            </div>
            
            <div className="p-4">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-bold text-gray-800">{product.title}</h3>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreVertical size={18} />
                </button>
              </div>
              
              <p className="text-gray-600 mt-2 text-sm">{product.description}</p>
              
              <div className="flex flex-wrap gap-2 mt-3">
                {product.categories.map(category => (
                  <span 
                    key={category} 
                    className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                  >
                    {category}
                  </span>
                ))}
              </div>
              
              <div className="flex items-center mt-4">
                <MapPin size={14} className="text-gray-400" />
                <span className="text-sm text-gray-600 ml-2">{product.shop.address}, {product.shop.city}</span>
              </div>
              
              <div className="flex items-center mt-2">
                <Clock size={14} className="text-gray-400" />
                <span className="text-sm text-gray-600 ml-2">
                  Pickup: {product.pickup_start} - {product.pickup_end}
                </span>
              </div>
              
              <div className="flex justify-between items-center mt-4">
                <div>
                  <span className="text-sm text-gray-500 line-through">${product.original_price}</span>
                  <span className="text-lg font-bold text-primaryColor ml-2">${product.discounted_price}</span>
                </div>
                <div className="text-sm text-gray-600">
                  <span className={product.quantity_available > 0 ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                    {product.quantity_available > 0 ? `${product.quantity_available} available` : "Sold out"}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 px-4 py-3 flex justify-between">
              <button 
                className="text-red-500 hover:text-red-700 flex items-center"
                onClick={() => handleDelete(product.id)}
              >
                <Trash2 size={16} className="mr-1" />
                Delete
              </button>
              
              <div className="flex gap-2">
                <button className="text-gray-600 hover:text-gray-800 flex items-center">
                  <Eye size={16} className="mr-1" />
                  View
                </button>
                <button className="text-primaryColor hover:text-primaryColor-dark flex items-center">
                  <Edit3 size={16} className="mr-1" />
                  Edit
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="bg-white rounded-lg shadow p-8 text-center mt-8">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Search size={32} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-medium text-gray-800 mb-2">No products found</h3>
          <p className="text-gray-600 mb-4">
            Try adjusting your search or filter to find what you're looking for.
          </p>
          <button 
            className="text-primaryColor hover:text-primaryColor-dark font-medium"
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
              setCategoryFilter('all');
            }}
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;