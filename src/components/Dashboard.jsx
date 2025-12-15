import React, { useState, useEffect } from 'react';
import {
  FiTrendingUp,
  FiDroplet,
  FiPackage,
  FiUsers,
  FiCalendar,
  FiAlertCircle,
  FiRefreshCw,
  FiDownload,
  FiPrinter,
  FiFilter
} from 'react-icons/fi';
import { MdPoultry, MdShowChart, MdAttachMoney, MdLocalHospital } from 'react-icons/md';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const Dashboard = ({ data, updateData, addNotification, isOnline }) => {
  const [stats, setStats] = useState({
    activeCycles: 0,
    totalBirds: 0,
    mortalityRate: 0,
    avgWeight: 0,
    feedConsumption: 0,
    productionRate: 0,
    financialStatus: 0,
    healthStatus: 0
  });

  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  // حساب الإحصائيات من البيانات
  useEffect(() => {
    if (data && data.cycles) {
      calculateStats();
      setLoading(false);
    }
  }, [data]);

  const calculateStats = () => {
    const activeCycles = data.cycles.filter(c => c.status === 'نشط');
    const totalBirds = activeCycles.reduce((sum, cycle) => sum + (cycle.currentBirds || 0), 0);
    
    // حساب نسبة النفوق
    let totalMortality = 0;
    let totalInitialBirds = 0;
    
    activeCycles.forEach(cycle => {
      totalInitialBirds += cycle.initialBirds || 0;
      const dailyRecords = data.dailyRecords?.filter(r => r.cycleId === cycle.id) || [];
      const cycleMortality = dailyRecords.reduce((sum, record) => sum + (record.mortality || 0), 0);
      totalMortality += cycleMortality;
    });
    
    const mortalityRate = totalInitialBirds > 0 ? ((totalMortality / totalInitialBirds) * 100).toFixed(2) : 0;
    
    // حساب متوسط الوزن
    let totalWeight = 0;
    let weightCount = 0;
    
    activeCycles.forEach(cycle => {
      const dailyRecords = data.dailyRecords?.filter(r => r.cycleId === cycle.id) || [];
      dailyRecords.forEach(record => {
        if (record.avgWeight) {
          totalWeight += record.avgWeight;
          weightCount++;
        }
      });
    });
    
    const avgWeight = weightCount > 0 ? (totalWeight / weightCount).toFixed(2) : 0;
    
    // حساب استهلاك العلف
    const feedConsumption = activeCycles.reduce((sum, cycle) => {
      const dailyRecords = data.dailyRecords?.filter(r => r.cycleId === cycle.id) || [];
      const cycleConsumption = dailyRecords.reduce((sum, record) => sum + (record.feedConsumed || 0), 0);
      return sum + cycleConsumption;
    }, 0);
    
    setStats({
      activeCycles: activeCycles.length,
      totalBirds,
      mortalityRate,
      avgWeight,
      feedConsumption,
      productionRate: 85, // قيمة افتراضية
      financialStatus: 72, // قيمة افتراضية
      healthStatus: 90 // قيمة افتراضية
    });

    // النشاط الأخير
    const activities = [];
    if (data.dailyRecords?.length > 0) {
      data.dailyRecords.slice(-5).forEach(record => {
        activities.push({
          type: 'سجل يومي',
          description: `تم إضافة سجل يومي للدورة ${record.cycleId}`,
          time: 'قبل ساعتين',
          color: 'bg-blue-500'
        });
      });
    }
    
    if (data.inventory?.length > 0) {
      const lowStock = data.inventory.filter(item => 
        item.quantity < (item.minQuantity || item.quantity * 0.2)
      );
      lowStock.forEach(item => {
        activities.push({
          type: 'تنبيه',
          description: `${item.name} منخفض في المخزون`,
          time: 'قبل 4 ساعات',
          color: 'bg-red-500'
        });
      });
    }
    
    setRecentActivity(activities);
  };

  // بيانات الرسوم البيانية
  const productionData = [
    { يوم: 'السبت', وزن: 1.2, نفوق: 15 },
    { يوم: 'الأحد', وزن: 1.3, نفوق: 12 },
    { يوم: 'الإثنين', وزن: 1.4, نفوق: 10 },
    { يوم: 'الثلاثاء', وزن: 1.5, نفوق: 8 },
    { يوم: 'الأربعاء', وزن: 1.6, نفوق: 7 },
    { يوم: 'الخميس', وزن: 1.7, نفوق: 6 },
    { يوم: 'الجمعة', وزن: 1.8, نفوق: 5 }
  ];

  const feedData = [
    { name: 'علف بادي', value: 35, color: '#8884d8' },
    { name: 'علف نامي', value: 45, color: '#82ca9d' },
    { name: 'علف ناهي', value: 20, color: '#ffc658' }
  ];

  const financialData = [
    { شهر: 'يناير', مصروفات: 4000, إيرادات: 2400 },
    { شهر: 'فبراير', مصروفات: 3000, إيرادات: 1398 },
    { شهر: 'مارس', مصروفات: 2000, إيرادات: 9800 },
    { شهر: 'أبريل', مصروفات: 2780, إيرادات: 3908 },
    { شهر: 'مايو', مصروفات: 1890, إيرادات: 4800 },
    { شهر: 'يونيو', مصروفات: 2390, إيرادات: 3800 }
  ];

  // بطاقات الإحصائيات
  const StatCard = ({ title, value, change, icon, color, unit }) => (
    <div className="glass-card rounded-xl p-5 hover:shadow-lg transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-gray-600 text-sm mb-1">{title}</p>
          <div className="flex items-baseline">
            <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
            {unit && <span className="text-sm text-gray-500 mr-1">{unit}</span>}
          </div>
        </div>
        <div className={`p-3 rounded-full ${color} text-white`}>
          {icon}
        </div>
      </div>
      {change && (
        <div className="flex items-center text-sm">
          <FiTrendingUp className={`ml-1 ${change > 0 ? 'text-green-500' : 'text-red-500'}`} />
          <span className={`font-medium ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {change > 0 ? '+' : ''}{change}%
          </span>
          <span className="text-gray-500 mr-2">من الشهر الماضي</span>
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loading-spinner"></div>
        <span className="mr-3">جاري تحميل البيانات...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* رأس الصفحة */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-3">
            <MdPoultry className="text-yellow-500 animate-bounce" />
            لوحة التحكم الرئيسية
          </h1>
          <p className="text-gray-600 mt-2">
            نظرة شاملة على أداء المزرعة والإحصائيات الحيوية
          </p>
        </div>
        
        <div className="flex gap-3">
          <button className="btn btn-primary flex items-center gap-2">
            <FiRefreshCw /> تحديث البيانات
          </button>
          <button className="btn bg-white border border-gray-300 text-gray-700 flex items-center gap-2">
            <FiDownload /> تصدير تقرير
          </button>
          <button className="btn bg-white border border-gray-300 text-gray-700 flex items-center gap-2">
            <FiPrinter /> طباعة
          </button>
        </div>
      </div>

      {/* حالة الاتصال */}
      {!isOnline && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center gap-3">
          <FiAlertCircle className="text-yellow-500 text-xl" />
          <div>
            <p className="font-medium text-yellow-800">أنت تعمل بدون اتصال بالإنترنت</p>
            <p className="text-yellow-600 text-sm">سيتم مزامنة البيانات عند استعادة الاتصال</p>
          </div>
        </div>
      )}

      {/* شبكة الإحصائيات */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="الدورات النشطة"
          value={stats.activeCycles}
          change={12}
          icon={<FiCalendar className="w-6 h-6" />}
          color="bg-gradient-to-r from-blue-500 to-blue-600"
        />
        
        <StatCard
          title="إجمالي الطيور"
          value={stats.totalBirds.toLocaleString()}
          change={5}
          icon={<MdPoultry className="w-6 h-6" />}
          color="bg-gradient-to-r from-green-500 to-green-600"
          unit="طائر"
        />
        
        <StatCard
          title="نسبة النفوق"
          value={stats.mortalityRate}
          change={-2}
          icon={<MdLocalHospital className="w-6 h-6" />}
          color="bg-gradient-to-r from-red-500 to-red-600"
          unit="%"
        />
        
        <StatCard
          title="متوسط الوزن"
          value={stats.avgWeight}
          change={8}
          icon={<MdShowChart className="w-6 h-6" />}
          color="bg-gradient-to-r from-purple-500 to-purple-600"
          unit="كجم"
        />
      </div>

      {/* المزيد من الإحصائيات */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="استهلاك العلف"
          value={(stats.feedConsumption / 1000).toFixed(1)}
          change={-3}
          icon={<FiPackage className="w-6 h-6" />}
          color="bg-gradient-to-r from-orange-500 to-orange-600"
          unit="طن"
        />
        
        <StatCard
          title="معدل الإنتاج"
          value={stats.productionRate}
          change={4}
          icon={<FiTrendingUp className="w-6 h-6" />}
          color="bg-gradient-to-r from-teal-500 to-teal-600"
          unit="%"
        />
        
        <StatCard
          title="الحالة المالية"
          value={stats.financialStatus}
          change={15}
          icon={<MdAttachMoney className="w-6 h-6" />}
          color="bg-gradient-to-r from-yellow-500 to-yellow-600"
          unit="%"
        />
        
        <StatCard
          title="الحالة الصحية"
          value={stats.healthStatus}
          change={2}
          icon={<FiDroplet className="w-6 h-6" />}
          color="bg-gradient-to-r from-pink-500 to-pink-600"
          unit="%"
        />
      </div>

      {/* الرسوم البيانية */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* رسم إنتاجي */}
        <div className="glass-card rounded-xl p-5">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-800">تطور الإنتاج الأسبوعي</h3>
            <button className="text-primary-600 hover:text-primary-800 flex items-center gap-2">
              <FiFilter /> تصفية
            </button>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={productionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="يوم" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`${value}`, 'القيمة']}
                  labelFormatter={(label) => `يوم: ${label}`}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="وزن" 
                  stroke="#3498db" 
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="نفوق" 
                  stroke="#e74c3c" 
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* توزيع الأعلاف */}
        <div className="glass-card rounded-xl p-5">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-800">توزيع استهلاك الأعلاف</h3>
            <button className="text-primary-600 hover:text-primary-800">
              المزيد
            </button>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={feedData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {feedData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'النسبة']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* المزيد من الرسوم البيانية */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* المالية */}
        <div className="glass-card rounded-xl p-5">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-800">الإيرادات والمصروفات</h3>
            <button className="text-primary-600 hover:text-primary-800 flex items-center gap-2">
              <FiDownload /> بيانات
            </button>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={financialData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="شهر" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="إيرادات" fill="#2ecc71" radius={[4, 4, 0, 0]} />
                <Bar dataKey="مصروفات" fill="#e74c3c" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* النشاط الأخير */}
        <div className="glass-card rounded-xl p-5">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-800">النشاط الأخير</h3>
            <button 
              onClick={() => addNotification({
                type: 'info',
                title: 'تم تحديث النشاط',
                message: 'تم تحميل أحدث الأنشطة',
                time: new Date().toLocaleTimeString('ar-EG')
              })}
              className="text-primary-600 hover:text-primary-800"
            >
              عرض الكل
            </button>
          </div>
          <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                  <div className={`w-3 h-3 rounded-full mt-2 ${activity.color}`}></div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium text-gray-800">{activity.type}</h4>
                      <span className="text-xs text-gray-500">{activity.time}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FiAlertCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>لا توجد أنشطة حديثة</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* الإجراءات السريعة */}
      <div className="glass-card rounded-xl p-5">
        <h3 className="text-lg font-bold text-gray-800 mb-6">الإجراءات السريعة</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button 
            onClick={() => addNotification({
              type: 'success',
              title: 'إضافة سجل يومي',
              message: 'يمكنك الآن إضافة السجل اليومي من هنا',
              time: new Date().toLocaleTimeString('ar-EG')
            })}
            className="quick-action-btn"
          >
            <FiFileText /> سجل يومي
          </button>
          
          <button 
            onClick={() => addNotification({
              type: 'info',
              title: 'إضافة دورة جديدة',
              message: 'ابدأ دورة إنتاج جديدة من هنا',
              time: new Date().toLocaleTimeString('ar-EG')
            })}
            className="quick-action-btn"
          >
            <FiCalendar /> دورة جديدة
          </button>
          
          <button 
            onClick={() => addNotification({
              type: 'warning',
              title: 'شراء أعلاف',
              message: 'نافذة شراء الأعلاف جاهزة',
              time: new Date().toLocaleTimeString('ar-EG')
            })}
            className="quick-action-btn"
          >
            <FiPackage /> شراء أعلاف
          </button>
          
          <button 
            onClick={() => addNotification({
              type: 'health',
              title: 'تسجيل تحصين',
              message: 'سجل عملية التحصين الجديدة',
              time: new Date().toLocaleTimeString('ar-EG')
            })}
            className="quick-action-btn"
          >
            <FiDroplet /> تسجيل تحصين
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
