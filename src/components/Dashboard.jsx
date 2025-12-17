import React, { useState, useEffect } from 'react'

const Dashboard = () => {
  const [salesData] = useState([
    { day: 'السبت', amount: 450000 },
    { day: 'الأحد', amount: 520000 },
    { day: 'الإثنين', amount: 480000 },
    { day: 'الثلاثاء', amount: 610000 },
    { day: 'الأربعاء', amount: 550000 },
    { day: 'الخميس', amount: 720000 },
    { day: 'الجمعة', amount: 680000 },
  ])

  const maxSales = Math.max(...salesData.map(item => item.amount))

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">لوحة التحكم</h1>
          <p className="text-gray-600 mt-1">مرحباً بك في نظام إدارة مزرعة الدواجن</p>
        </div>
        <div className="flex items-center space-x-3 space-x-reverse">
          <div className="bg-blue-50 px-4 py-2 rounded-lg">
            <p className="text-sm text-gray-600">التاريخ</p>
            <p className="font-medium">{new Date().toLocaleDateString('ar-SA')}</p>
          </div>
        </div>
      </div>

      {/* مخطط المبيعات */}
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">مبيعات الأسبوع</h2>
        </div>
        <div className="h-64">
          <div className="flex items-end h-48 space-x-1 space-x-reverse">
            {salesData.map((item, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-gradient-to-t from-blue-500 to-blue-300 rounded-t-lg transition-all duration-300 hover:opacity-80"
                  style={{ height: `${(item.amount / maxSales) * 100}%` }}
                ></div>
                <p className="text-sm text-gray-600 mt-2">{item.day}</p>
                <p className="text-xs text-gray-500">{(item.amount / 1000).toFixed(0)}K ج.س</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
