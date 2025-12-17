import React from 'react'

const SplashScreen = () => {
  // دالة مساعدة لعرض الأيقونات
  const Icon = ({ name, className = "w-5 h-5", ...props }) => (
    <img 
      src={`/icons/${name}.svg`} 
      alt={name}
      className={className}
      {...props}
    />
  )

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
              <Icon name="chicken" className="w-6 h-6 text-white" />
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
          <div className="flex items-center justify-center mb-4">
            <Icon name="code" className="w-6 h-6 text-blue-600 ml-2" />
            <h2 className="text-xl font-semibold text-gray-800">المطور</h2>
          </div>
          <p className="text-gray-600 mb-4">
            تطوير: فريق دواجني التقني
          </p>
          <div className="flex items-center mb-4">
            <Icon name="tag" className="w-4 h-4 text-gray-500 ml-2" />
            <p className="text-gray-600">الإصدار: 1.0.0</p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center">
              <Icon name="wifi-off" className="w-4 h-4 text-green-500 ml-2" />
              <p className="text-sm text-gray-500">يعمل دون اتصال بالإنترنت</p>
            </div>
            <div className="flex items-center">
              <Icon name="database" className="w-4 h-4 text-blue-500 ml-2" />
              <p className="text-sm text-gray-500">نسخة احتياطية تلقائية</p>
            </div>
            <div className="flex items-center">
              <Icon name="settings" className="w-4 h-4 text-purple-500 ml-2" />
              <p className="text-sm text-gray-500">إدارة شاملة</p>
            </div>
          </div>
        </div>
        
        {/* مؤشر التحميل */}
        <div className="mt-12 flex flex-col items-center">
          <Icon name="loader-2" className="h-8 w-8 text-blue-600 animate-spin mb-4" />
          <p className="text-gray-500">جاري تحميل التطبيق...</p>
          <div className="mt-4 w-64 bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full w-3/4 animate-pulse"></div>
          </div>
        </div>
        
        {/* الميزات السريعة */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl">
          {[
            { icon: 'bar-chart-3', text: 'لوحة تحكم', color: 'text-blue-500' },
            { icon: 'chicken', text: 'إدارة الدورات', color: 'text-green-500' },
            { icon: 'dollar-sign', text: 'المبيعات', color: 'text-green-600' },
            { icon: 'package', text: 'المخزون', color: 'text-orange-500' },
            { icon: 'users', text: 'الموظفين', color: 'text-purple-500' },
            { icon: 'pie-chart', text: 'تقارير', color: 'text-red-500' },
          ].map((item, index) => (
            <div key={index} className="bg-white/50 p-4 rounded-lg backdrop-blur-sm hover:bg-white/70 transition-colors">
              <div className="flex flex-col items-center">
                <Icon name={item.icon} className={`w-8 h-8 ${item.color} mb-2`} />
                <p className="text-sm text-gray-600 font-medium">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* حقوق النشر */}
      <div className="absolute bottom-6 text-center">
        <div className="flex items-center justify-center mb-2">
          <Icon name="copyright" className="w-4 h-4 text-gray-400 ml-1" />
          <p className="text-gray-400 text-sm">
            2024 دواجني. جميع الحقوق محفوظة.
          </p>
        </div>
        <p className="text-gray-400 text-xs">
          نظام إدارة مزارع الدواجن المتكامل
        </p>
      </div>
    </div>
  )
}

export default SplashScreen
