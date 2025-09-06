import { useState } from 'react';
import { 
  Package, 
  ShoppingBag, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Clock,
  MoreHorizontal,
  ChevronDown,
} from 'lucide-react';

const mockData = {
  shop: {
    id: 1,
    name: "Bakery Delight",
    image_url: "/bakery.jpg",
    description: "Fresh baked goods daily",
    address: "123 Main St",
    city: 1,
    country: 1,
    user_id: 1
  },
  stats: {
    totalRevenue: 2458.32,
    totalOrders: 148,
    activeProducts: 12,
    newCustomers: 32
  },
  recentOrders: [
    {
      id: 1001,
      user_id: 501,
      sarqyt_id: 201,
      shop_id: 1,
      quantity: 2,
      total_price: 15.98,
      status: "completed",
      payment_method: "card",
      payment_status: "paid",
      pickup_code: "A3B7",
      created_at: "2023-06-15T10:30:00Z"
    },
    {
      id: 1002,
      user_id: 502,
      sarqyt_id: 202,
      shop_id: 1,
      quantity: 1,
      total_price: 8.99,
      status: "pending",
      payment_method: "cash",
      payment_status: "unpaid",
      pickup_code: "B2C8",
      created_at: "2023-06-15T09:15:00Z"
    },
    {
      id: 1003,
      user_id: 503,
      sarqyt_id: 203,
      shop_id: 1,
      quantity: 3,
      total_price: 24.97,
      status: "completed",
      payment_method: "card",
      payment_status: "paid",
      pickup_code: "D5E1",
      created_at: "2023-06-14T16:45:00Z"
    },
    {
      id: 1004,
      user_id: 504,
      sarqyt_id: 204,
      shop_id: 1,
      quantity: 1,
      total_price: 7.50,
      status: "cancelled",
      payment_method: "card",
      payment_status: "refunded",
      pickup_code: "F9G2",
      created_at: "2023-06-14T14:20:00Z"
    }
  ],
  popularProducts: [
    {
      id: 201,
      product_type_id: 101,
      name: "Assorted Pastries Box",
      original_price: 12.99,
      discounted_price: 7.99,
      quantity_available: 8,
      orders_count: 42,
      revenue: 335.58
    },
    {
      id: 202,
      product_type_id: 102,
      name: "Fresh Bread Bundle",
      original_price: 9.99,
      discounted_price: 5.99,
      quantity_available: 15,
      orders_count: 38,
      revenue: 227.62
    },
    {
      id: 203,
      product_type_id: 103,
      name: "Dessert Surprise",
      original_price: 15.99,
      discounted_price: 8.99,
      quantity_available: 5,
      orders_count: 29,
      revenue: 260.71
    }
  ]
};

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState('week');

  const statusColors = {
    completed: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    cancelled: 'bg-red-100 text-red-800'
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Seller Dashboard</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <select 
              className="appearance-none bg-white border border-gray-300 rounded-lg py-2 px-4 pr-8 leading-tight focus:outline-none focus:border-primaryColor"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <ChevronDown size={16} />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-blue-100 text-blue-600">
              <DollarSign size={20} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${mockData.stats.totalRevenue}</p>
            </div>
          </div>
          <div className="flex items-center mt-2">
            <TrendingUp size={14} className="text-green-500" />
            <span className="text-xs text-green-500 ml-1">12.3%</span>
            <span className="text-xs text-gray-500 ml-2">from last week</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-green-100 text-green-600">
              <ShoppingBag size={20} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{mockData.stats.totalOrders}</p>
            </div>
          </div>
          <div className="flex items-center mt-2">
            <TrendingUp size={14} className="text-green-500" />
            <span className="text-xs text-green-500 ml-1">8.5%</span>
            <span className="text-xs text-gray-500 ml-2">from last week</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-purple-100 text-purple-600">
              <Package size={20} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Products</p>
              <p className="text-2xl font-bold text-gray-900">{mockData.stats.activeProducts}</p>
            </div>
          </div>
          <div className="flex items-center mt-2">
            <TrendingUp size={14} className="text-green-500" />
            <span className="text-xs text-green-500 ml-1">2.1%</span>
            <span className="text-xs text-gray-500 ml-2">from last week</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-orange-100 text-orange-600">
              <Users size={20} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">New Customers</p>
              <p className="text-2xl font-bold text-gray-900">{mockData.stats.newCustomers}</p>
            </div>
          </div>
          <div className="flex items-center mt-2">
            <TrendingUp size={14} className="text-green-500" />
            <span className="text-xs text-green-500 ml-1">5.7%</span>
            <span className="text-xs text-gray-500 ml-2">from last week</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-800">Recent Orders</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {mockData.recentOrders.map((order) => (
              <div key={order.id} className="p-6 flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Order #{order.id}</p>
                  <p className="text-sm text-gray-500">
                    ${order.total_price} • {order.quantity} item{order.quantity > 1 ? 's' : ''}
                  </p>
                  <div className="flex items-center mt-1">
                    <Clock size={14} className="text-gray-400" />
                    <span className="text-xs text-gray-500 ml-1">
                      {new Date(order.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status as keyof typeof statusColors]}`}>
                    {order.status}
                  </span>
                  <button className="ml-4 text-gray-400 hover:text-gray-600">
                    <MoreHorizontal size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-gray-200 text-center">
            <button className="text-primaryColor hover:text-primaryColor-dark font-medium">
              View all orders
            </button>
          </div>
        </div>

        {/* Popular Products */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-800">Popular Products</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {mockData.popularProducts.map((product) => (
              <div key={product.id} className="p-6">
                <div className="flex justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-500">
                      <span className="line-through">${product.original_price}</span> • 
                      <span className="text-primaryColor ml-1">${product.discounted_price}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{product.orders_count} orders</p>
                    <p className="text-sm text-gray-500">${product.revenue} revenue</p>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primaryColor h-2 rounded-full" 
                      style={{ width: `${(product.quantity_available / 20) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {product.quantity_available} available
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-gray-200 text-center">
            <button className="text-primaryColor hover:text-primaryColor-dark font-medium">
              Manage products
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;