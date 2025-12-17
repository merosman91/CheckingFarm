import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  Home, 
  Layers, 
  Package, 
  Heart, 
  DollarSign, 
  Calendar, 
  ShoppingCart, 
  Users, 
  BarChart2, 
  Settings,
  Menu,
  X,
  Bell,
  User
} from 'lucide-react'

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  const menuItems = [
    { path: '/dashboard', icon: Home, label: 'لوحة التحكم' },
    { path: '/cycles', icon: Layers, label: 'إدارة الدورات' },
    { path: '/inventory', icon: Package, label: 'إدارة المخزون' },
    { path: '/health', icon: Heart, label: 'إدارة الصحة' },
    { path: '/financial', icon: DollarSign, label: 'الشؤون المالية' },
    { path: '/daily-records', icon: Calendar, label: 'السجلات اليومية' },
    { path: '/sales', icon: ShoppingCart, label: 'إدارة المبيعات' },
    { path: '/employees', icon: Users, label: 'إدارة الموظفين' },
    { path: '/reports', icon: BarChart2, label: 'التقارير' },
    { path: '/settings', icon: Settings, label: 'الإعدادات' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* شريط التنقل العلوي */}
      <nav className="bg-white shadow-md fixed top-0 right-0 left-0 z-50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 lg:hidden"
              >
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              
              <div className="flex items-center mr-4">
                <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">د</span>
                </div>
                <span className="mr-3 text-xl font-bold text-gray-800">دواجني</span>
              </div>
            </div>

            <div className="flex items-center space-x-4 space-x-reverse">
              <button className="relative p-2 text-gray-400 hover:text-gray-500">
                <Bell size={22} />
                <span className="absolute top-1 left-1 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>
              
              <div className="flex items-center space-x-3 space-x-reverse">
                <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <User size={20} className="text-gray-600" />
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-700">مدير المزرعة</p>
                  <p className="text-xs text-gray-500">Admin</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* الشريط الجانبي */}
      <aside className={`fixed right-0 top-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-40 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="h-16 flex items-center px-6 border-b">
          <h2 className="text-lg font-semibold text-gray-800">القائمة الرئيسية</h2>
        </div>
        
        <nav className="mt-6 px-4">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-3 mb-2 rounded-lg transition duration-200 ${
                location.pathname === item.path
                  ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon size={20} className="ml-3" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800 font-medium">إحصائيات اليوم</p>
            <p className="text-xs text-blue-600 mt-1">3 مهام معلقة</p>
          </div>
        </div>
      </aside>

      {/* المحتوى الرئيسي */}
      <main className={`pt-16 pr-0 lg:pr-64 min-h-screen transition-all duration-300 ${sidebarOpen ? 'blur-sm lg:blur-0' : ''}`}>
        <div className="p-4 md:p-6">
          {children}
        </div>
      </main>

      {/* زر القائمة المتنقلة */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}

export default Layout
