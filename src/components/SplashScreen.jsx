import React, { useEffect } from 'react'
import { Loader2 } from 'lucide-react'

const SplashScreen = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex flex-col items-center justify-center">
      <div className="text-center">
        {/* أيقونة التطبيق */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="h-32 w-32 bg-gradient-to-br from-blue-600 to-green-500 rounded-2xl flex items-center justify-center shadow-2xl">
              <span className="text-white text-4xl font-bold">د</span>
            </div>
            <div className="absolute -bottom-2 -left-2 h-12 w-12 bg-orange-500 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white font-bold">🐔</span>
            </div>
          </div>
        </div>
        
        {/* اسم التطبيق */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          دواجني
        </h1>
        <p className="text-lg text-gray-600 mb-2">تطبيق إدارة مزارع الدواجن</p>
        
        {/* وصف التطبيق */}
        <div className="max-w-md mx-auto mt-8 p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">👨‍💻 المطور</h2>
          <p className="text-gray-600 mb-4">
            تطوير: فريق دواجني التقني
          </p>
          <p className="text-gray-600 mb-4">
            الإصدار: 1.0.0
          </p>
          <p className="text-sm text-gray-500">
            يعمل دون اتصال بالإنترنت • نسخة احتياطية تلقائية • إدارة شاملة
          </p>
        </div>
        
        {/* مؤشر التحميل */}
        <div className="mt-12 flex flex-col items-center">
          <Loader2 className="h-8 w-8 text-blue-600 animate-spin mb-4" />
          <p className="text-gray-500">جاري تحميل التطبيق...</p>
          <div className="mt-4 w-64 bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full w-3/4 animate-pulse"></div>
          </div>
        </div>
        
        {/* الميزات السريعة */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl">
          {[
            { icon: '📊', text: 'لوحة تحكم' },
            { icon: '🐔', text: 'إدارة الدورات' },
            { icon: '💰', text: 'المبيعات' },
            { icon: '📦', text: 'المخزون' },
            { icon: '👥', text: 'الموظفين' },
            { icon: '📈', text: 'تقارير' },
          ].map((item, index) => (
            <div key={index} className="bg-white/50 p-3 rounded-lg backdrop-blur-sm">
              <div className="text-2xl mb-1">{item.icon}</div>
              <p className="text-sm text-gray-600">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* حقوق النشر */}
      <div className="absolute bottom-6 text-center">
        <p className="text-gray-400 text-sm">
          © 2024 دواجني. جميع الحقوق محفوظة.
        </p>
        <p className="text-gray-400 text-xs mt-1">
          نظام إدارة مزارع الدواجن المتكامل
        </p>
      </div>
    </div>
  )
}

export default SplashScreen
