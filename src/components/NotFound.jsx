import React from 'react'
import { Link } from 'react-router-dom'
import { Home, AlertTriangle } from 'lucide-react'

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-md">
        {/* أيقونة الخطأ */}
        <div className="mb-8">
          <div className="relative inline-block">
            <div className="h-32 w-32 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle size={64} className="text-red-500" />
            </div>
            <div className="absolute -top-2 -right-2 h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">404</span>
            </div>
          </div>
        </div>

        {/* رسالة الخطأ */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          الصفحة غير موجودة
        </h1>
        
        <p className="text-gray-600 mb-8">
          عذراً، الصفحة التي تبحث عنها غير موجودة أو قد تم نقلها.
          يمكنك العودة إلى الصفحة الرئيسية أو استخدام البحث للعثور على ما تحتاجه.
        </p>

        {/* خيارات التنقل */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/dashboard"
            className="btn-primary flex items-center justify-center"
          >
            <Home size={18} className="ml-2" />
            العودة للرئيسية
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            الرجوع للخلف
          </button>
        </div>

        {/* روابط سريعة */}
        <div className="mt-12">
          <p className="text-gray-500 mb-4">روابط سريعة:</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { to: '/dashboard', label: 'لوحة التحكم' },
              { to: '/cycles', label: 'الدورات' },
              { to: '/sales', label: 'المبيعات' },
              { to: '/inventory', label: 'المخزون' },
            ].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* معلومات الاتصال */}
        <div className="mt-12 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            إذا استمرت المشكلة، يرجى الاتصال بالدعم الفني:
          </p>
          <p className="text-gray-700 font-medium mt-1">
            support@douajny.com | 920000000
          </p>
        </div>
      </div>
    </div>
  )
}

export default NotFound
