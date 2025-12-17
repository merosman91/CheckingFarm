import React, { useState, useEffect } from 'react'
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Package, 
  Activity,
  Calendar,
  BarChart2,
  Bell,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'

const Dashboard = () => {
  const [activeCycle, setActiveCycle] = useState(null)
  const [stats, setStats] = useState({
    totalBirds: 0,
    mortalityRate: 0,
    feedConsumption: 0,
    dailySales: 0,
    pendingTasks: 0,
    inventoryAlerts: 0
  })

  const [salesData, setSalesData] = useState([
    { day: 'السبت', amount: 4500 },
    { day: 'الأحد', amount: 5200 },
    { day: 'الإثنين', amount: 4800 },
    { day: 'الثلاثاء', amount: 6100 },
    { day: 'الأربعاء', amount: 5500 },
    { day: 'الخميس', amount: 7200 },
    { day: 'الجمعة', amount: 6800 },
  ])

  const [cycles, setCycles] = useState([
    { id: 1, name: 'الدورة الشتوية', startDate: '2024-01-01', birds: 5000, status: 'active' },
    { id: 2, name: 'الدورة الربيعية', startDate: '2024-03-01', birds: 7500, status: 'active' },
    { id: 3, name: 'الدورة الصيفية', startDate: '2024-06-01', birds: 6000, status: 'inactive' },
  ])

  const [recentActivities, setRecentActivities] = useState([
    { id: 1, type: 'بيع', description: 'بيع 200 كيلو دجاج', time: 'قبل ساعتين', amount: 4500 },
    { id: 2, type: 'تطعيم', description: 'تطعيم الدورة الشتوية', time: 'قبل 4 ساعات', amount: null },
    { id: 3, type: 'شراء', description: 'شراء أعلاف جديدة', time: 'أمس', amount: 3200 },
    { id: 4, type: 'تسجيل', description: 'تسجيل الوفيات اليومية', time: 'أمس', amount: null },
    { id: 5, type: 'راتب', description: 'دفع رواتب الموظفين', time: 'قبل يومين', amount: 8500 },
  ])

  useEffect(() => {
    // تحميل البيانات من localStorage
    const savedData = localStorage.getItem('poultryFarmData')
    if (savedData) {
      const data = JSON.parse(savedData)
      setStats(data.stats || stats)
    }
  }, [])

  const statCards = [
    {
      title: 'إجمالي الطيور',
      value: '12,500',
      icon: Users,
      change: '+5.2%',
      isPositive: true,
      color: 'blue'
    },
    {
      title: 'المبيعات اليومية',
      value: '6,800 ر.س',
      icon: DollarSign,
      change: '+12.3%',
      isPositive: true,
      color: 'green'
    },
    {
      title: 'معدل النفوق',
      value: '1.2%',
      icon: Activity,
      change: '-0.3%',
      isPositive: true,
      color: 'red'
    },
    {
      title: 'استهلاك العلف',
      value: '850 كغ',
      icon: Package,
      change: '+2.1%',
      isPositive: false,
      color: 'orange'
    }
  ]

  return (
    <div className="space-y-6">
      {/* رأس الصفحة */}
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
          <button className="btn-primary flex items-center">
            <Calendar size={18} className="ml-2" />
            تقرير اليوم
          </button>
        </div>
      </div>

      {/* بطاقات الإحصائيات */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="card hover:shadow-lg transition-shadow duration-300">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-800 mt-2">{stat.value}</p>
                <div className="flex items-center mt-2">
                  {stat.isPositive ? (
                    <ArrowUpRight size={16} className="text-green-500 ml-1" />
                  ) : (
                    <ArrowDownRight size={16} className="text-red-500 ml-1" />
                  )}
                  <span className={`text-sm ${stat.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change}
                  </span>
                  <span className="text-gray-400 text-sm mr-2">من الشهر الماضي</span>
                </div>
              </div>
              <div className={`p-3 rounded-lg bg-${stat.color}-50`}>
                <stat.icon size={24} className={`text-${stat.color}-600`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* المخططات والدورات النشطة */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* مخطط المبيعات */}
        <div className="lg:col-span-2 card">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">مبيعات الأسبوع</h2>
            <select className="input-field w-32">
              <option>هذا الأسبوع</option>
              <option>الأسبوع الماضي</option>
              <option>هذا الشهر</option>
            </select>
          </div>
          <div className="h-64">
            <div className="flex items-end h-48 space-x-2 space-x-reverse">
              {salesData.map((item, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-gradient-to-t from-blue-500 to-blue-300 rounded-t-lg transition-all duration-300 hover:opacity-80"
                    style={{ height: `${(item.amount / 8000) * 100}%` }}
                  ></div>
                  <p className="text-sm text-gray-600 mt-2">{item.day}</p>
                  <p className="text-xs text-gray-500">{item.amount.toLocaleString()} ر.س</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* الدورات النشطة */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">الدورات النشطة</h2>
          <div className="space-y-4">
            {cycles.filter(c => c.status === 'active').map(cycle => (
              <div key={cycle.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-gray-800">{cycle.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">بدأت في {cycle.startDate}</p>
                  </div>
                  <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full">
                    نشطة
                  </span>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">عدد الطيور</p>
                    <p className="font-medium">{cycle.birds.toLocaleString()}</p>
                  </div>
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    التفاصيل →
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
            عرض جميع الدورات
          </button>
        </div>
      </div>

      {/* الأنشطة الأخيرة والإشعارات */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* الأنشطة الأخيرة */}
        <div className="lg:col-span-2 card">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">آخر الأنشطة</h2>
          <div className="space-y-4">
            {recentActivities.map(activity => (
              <div key={activity.id} className="flex items-center justify-between p-3 border-b border-gray-100 last:border-0">
                <div className="flex items-center">
                  <div className={`p-2 rounded-lg ml-4 ${
                    activity.type === 'بيع' ? 'bg-green-50 text-green-600' :
                    activity.type === 'تطعيم' ? 'bg-blue-50 text-blue-600' :
                    activity.type === 'شراء' ? 'bg-orange-50 text-orange-600' :
                    activity.type === 'تسجيل' ? 'bg-purple-50 text-purple-600' :
                    'bg-red-50 text-red-600'
                  }`}>
                    {activity.type === 'بيع' && <DollarSign size={18} />}
                    {activity.type === 'تطعيم' && <Activity size={18} />}
                    {activity.type === 'شراء' && <Package size={18} />}
                    {activity.type === 'تسجيل' && <Calendar size={18} />}
                    {activity.type === 'راتب' && <Users size={18} />}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{activity.description}</p>
                    <p className="text-sm text-gray-500">{activity.time}</p>
                  </div>
                </div>
                {activity.amount && (
                  <span className="font-medium text-gray-800">
                    {activity.amount.toLocaleString()} ر.س
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* الإشعارات والمهام */}
        <div className="space-y-6">
          {/* الإشعارات */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">الإشعارات</h2>
              <Bell size={20} className="text-gray-400" />
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-red-50 border border-red-100 rounded-lg">
                <p className="font-medium text-red-800">تنبيه: نفوق طيور</p>
                <p className="text-sm text-red-600 mt-1">تم تسجيل 15 حالة نفوق اليوم</p>
              </div>
              <div className="p-3 bg-yellow-50 border border-yellow-100 rounded-lg">
                <p className="font-medium text-yellow-800">تنبيه: مخزون منخفض</p>
                <p className="text-sm text-yellow-600 mt-1">العلف سينفذ خلال 3 أيام</p>
              </div>
              <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg">
                <p className="font-medium text-blue-800">تذكير: تطعيم</p>
                <p className="text-sm text-blue-600 mt-1">موعد تطعيم الدورة الشتوية غداً</p>
              </div>
            </div>
          </div>

          {/* مؤشرات الأداء */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">مؤشرات الأداء</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">معدل التحويل</span>
                  <span className="text-sm font-medium">78%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: '78%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">كفاءة العلف</span>
                  <span className="text-sm font-medium">92%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '92%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">رضا العملاء</span>
                  <span className="text-sm font-medium">95%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full" style={{ width: '95%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
