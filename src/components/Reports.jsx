import React, { useState, useEffect } from 'react'
import { 
  Download,
  Printer,
  Filter,
  Calendar,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Package,
  Heart,
  BarChart3,
  PieChart,
  LineChart,
  FileText,
  Eye,
  Share2
} from 'lucide-react'

const Reports = () => {
  const [reports, setReports] = useState([])
  const [selectedReport, setSelectedReport] = useState(null)
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setDate(1)).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  })
  const [reportType, setReportType] = useState('all')

  useEffect(() => {
    const savedReports = localStorage.getItem('reportsData')
    if (savedReports) {
      setReports(JSON.parse(savedReports))
    } else {
      // بيانات تجريبية
      setReports([
        {
          id: 1,
          title: 'تقرير المبيعات الشهري',
          type: 'sales',
          date: '2024-01-20',
          description: 'تقرير مفصل لمبيعات الشهر الحالي',
          data: { total: 85000, growth: 12.5, items: 45 },
          status: 'generated'
        },
        {
          id: 2,
          title: 'تقرير المصروفات',
          type: 'expenses',
          date: '2024-01-19',
          description: 'تحليل المصروفات التشغيلية',
          data: { total: 32000, growth: -3.2, items: 28 },
          status: 'generated'
        },
        {
          id: 3,
          title: 'تقرير الصحة',
          type: 'health',
          date: '2024-01-18',
          description: 'مؤشرات الصحة والعلاج',
          data: { mortality: 1.2, treatments: 8, vaccines: 12 },
          status: 'generated'
        },
        {
          id: 4,
          title: 'تقرير المخزون',
          type: 'inventory',
          date: '2024-01-17',
          description: 'جرد المخزون والتنبيهات',
          data: { items: 32, lowStock: 5, value: 45000 },
          status: 'generated'
        }
      ])
    }
  }, [])

  const reportTypes = [
    { id: 'all', label: 'جميع التقارير', icon: FileText },
    { id: 'sales', label: 'تقارير المبيعات', icon: DollarSign },
    { id: 'expenses', label: 'تقارير المصروفات', icon: TrendingDown },
    { id: 'health', label: 'تقارير الصحة', icon: Heart },
    { id: 'inventory', label: 'تقارير المخزون', icon: Package },
    { id: 'employees', label: 'تقارير الموظفين', icon: Users },
    { id: 'cycles', label: 'تقارير الدورات', icon: TrendingUp }
  ]

  const generateSalesReport = () => {
    const report = {
      id: reports.length + 1,
      title: `تقرير مبيعات ${new Date().toLocaleDateString('ar-SA')}`,
      type: 'sales',
      date: new Date().toISOString().split('T')[0],
      description: 'تقرير مبيعات حسب الفترة المحددة',
      data: {
        total: Math.floor(Math.random() * 100000) + 50000,
        growth: (Math.random() * 30 - 10).toFixed(1),
        items: Math.floor(Math.random() * 50) + 20,
        dailyAverage: Math.floor(Math.random() * 5000) + 2000
      },
      status: 'generated'
    }
    setReports([...reports, report])
  }

  const generateFinancialReport = () => {
    const report = {
      id: reports.length + 1,
      title: `تقرير مالي ${new Date().toLocaleDateString('ar-SA')}`,
      type: 'expenses',
      date: new Date().toISOString().split('T')[0],
      description: 'تقرير شامل عن الوضع المالي',
      data: {
        income: Math.floor(Math.random() * 150000) + 80000,
        expenses: Math.floor(Math.random() * 80000) + 30000,
        profit: Math.floor(Math.random() * 70000) + 20000,
        growth: (Math.random() * 20 - 5).toFixed(1)
      },
      status: 'generated'
    }
    setReports([...reports, report])
  }

  const filteredReports = reports.filter(report => {
    if (reportType !== 'all' && report.type !== reportType) return false
    if (dateRange.start && report.date < dateRange.start) return false
    if (dateRange.end && report.date > dateRange.end) return false
    return true
  })

  return (
    <div className="space-y-6">
      {/* رأس الصفحة */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">التقارير</h1>
          <p className="text-gray-600 mt-1">تقارير وتحليلات شاملة للمزرعة</p>
        </div>
        <div className="flex items-center space-x-3 space-x-reverse">
          <button className="btn-primary flex items-center">
            <Printer size={18} className="ml-2" />
            طباعة التقارير
          </button>
          <button className="btn-secondary flex items-center">
            <Download size={18} className="ml-2" />
            تصدير البيانات
          </button>
        </div>
      </div>

      {/* فلترة التقارير */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              نوع التقرير
            </label>
            <select
              className="input-field"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
            >
              {reportTypes.map(type => (
                <option key={type.id} value={type.id}>{type.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              من تاريخ
            </label>
            <input
              type="date"
              className="input-field"
              value={dateRange.start}
              onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              إلى تاريخ
            </label>
            <input
              type="date"
              className="input-field"
              value={dateRange.end}
              onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
            />
          </div>
        </div>
      </div>

      {/* أدوات توليد التقارير */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">إنشاء تقارير سريعة</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button 
            onClick={generateSalesReport}
            className="p-4 border border-blue-200 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors flex flex-col items-center"
          >
            <DollarSign size={24} className="text-blue-600 mb-2" />
            <span className="font-medium text-blue-700">تقرير مبيعات</span>
          </button>

          <button 
            onClick={generateFinancialReport}
            className="p-4 border border-green-200 rounded-lg bg-green-50 hover:bg-green-100 transition-colors flex flex-col items-center"
          >
            <TrendingUp size={24} className="text-green-600 mb-2" />
            <span className="font-medium text-green-700">تقرير مالي</span>
          </button>

          <button className="p-4 border border-red-200 rounded-lg bg-red-50 hover:bg-red-100 transition-colors flex flex-col items-center">
            <Heart size={24} className="text-red-600 mb-2" />
            <span className="font-medium text-red-700">تقرير صحة</span>
          </button>

          <button className="p-4 border border-purple-200 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors flex flex-col items-center">
            <Package size={24} className="text-purple-600 mb-2" />
            <span className="font-medium text-purple-700">تقرير مخزون</span>
          </button>
        </div>
      </div>

      {/* أنواع التقارير */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-4 space-x-reverse overflow-x-auto">
          {reportTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setReportType(type.id)}
              className={`py-3 px-4 whitespace-nowrap flex items-center border-b-2 ${
                reportType === type.id
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <type.icon size={18} className="ml-2" />
              {type.label}
            </button>
          ))}
        </nav>
      </div>

      {/* قائمة التقارير */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">التقارير المتاحة</h2>
              <div className="flex items-center space-x-2 space-x-reverse">
                <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Filter size={20} className="text-gray-600" />
                </button>
              </div>
            </div>

            {filteredReports.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">لا توجد تقارير</h3>
                <p className="mt-2 text-gray-500">قم بإنشاء تقرير جديد أو غيّر معايير البحث.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredReports.map((report) => (
                  <div key={report.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-start">
                          <div className={`p-2 rounded-lg ml-4 ${
                            report.type === 'sales' ? 'bg-blue-50 text-blue-600' :
                            report.type === 'expenses' ? 'bg-green-50 text-green-600' :
                            report.type === 'health' ? 'bg-red-50 text-red-600' :
                            report.type === 'inventory' ? 'bg-purple-50 text-purple-600' :
                            'bg-gray-50 text-gray-600'
                          }`}>
                            {report.type === 'sales' && <DollarSign size={20} />}
                            {report.type === 'expenses' && <TrendingDown size={20} />}
                            {report.type === 'health' && <Heart size={20} />}
                            {report.type === 'inventory' && <Package size={20} />}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-800">{report.title}</h3>
                            <p className="text-sm text-gray-600 mt-1">{report.description}</p>
                            <div className="flex items-center mt-2 space-x-4 space-x-reverse">
                              <span className="text-sm text-gray-500">
                                <Calendar size={14} className="inline ml-1" />
                                {report.date}
                              </span>
                              <span className={`text-sm ${
                                report.type === 'sales' ? 'text-blue-600' :
                                report.type === 'expenses' ? 'text-green-600' :
                                report.type === 'health' ? 'text-red-600' :
                                'text-purple-600'
                              }`}>
                                {reportTypes.find(t => t.id === report.type)?.label}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2 space-x-reverse">
                        <button 
                          className="text-blue-600 hover:text-blue-900"
                          onClick={() => setSelectedReport(report)}
                        >
                          <Eye size={18} />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900">
                          <Download size={18} />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900">
                          <Printer size={18} />
                        </button>
                      </div>
                    </div>
                    
                    {/* بيانات التقرير المصغرة */}
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                      {Object.entries(report.data).map(([key, value]) => (
                        <div key={key} className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-xs text-gray-500">{key}</p>
                          <p className="font-medium text-gray-800 mt-1">
                            {typeof value === 'number' 
                              ? (key.includes('growth') || key.includes('percentage') || key.includes('rate')
                                ? `${value}%`
                                : value.toLocaleString())
                              : value}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* لوحة التحليل */}
        <div className="space-y-6">
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">إحصائيات التقارير</h2>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-600">إجمالي التقارير</p>
                <p className="text-2xl font-bold text-blue-700 mt-2">
                  {reports.length}
                </p>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-green-600">آخر تقرير</p>
                <p className="text-2xl font-bold text-green-700 mt-2">
                  {reports.length > 0 
                    ? new Date(reports[0].date).toLocaleDateString('ar-SA')
                    : '--'}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">توزيع التقارير</h2>
            <div className="space-y-4">
              {reportTypes.slice(1).map(type => {
                const count = reports.filter(r => r.type === type.id).length
                const percentage = reports.length > 0 ? (count / reports.length * 100).toFixed(0) : 0
                
                return (
                  <div key={type.id} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-700">{type.label}</span>
                      <span className="text-sm text-gray-600">{percentage}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{count} تقرير</span>
                      <span>{percentage}%</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* عرض التقرير */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{selectedReport.title}</h2>
                  <p className="text-gray-600">{selectedReport.description}</p>
                </div>
                <div className="flex space-x-2 space-x-reverse">
                  <button 
                    onClick={() => setSelectedReport(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="mb-8 p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">تاريخ الإنشاء</p>
                    <p className="font-medium">{selectedReport.date}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">نوع التقرير</p>
                    <p className="font-medium">
                      {reportTypes.find(t => t.id === selectedReport.type)?.label}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">حالة التقرير</p>
                    <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-800">
                      مكتمل
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">رقم التقرير</p>
                    <p className="font-medium">REP-{selectedReport.id.toString().padStart(3, '0')}</p>
                  </div>
                </div>
              </div>

              {/* بيانات التقرير */}
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-800 mb-4">البيانات الرئيسية</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(selectedReport.data).map(([key, value]) => (
                    <div key={key} className="p-4 border border-gray-200 rounded-lg">
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        {key === 'total' ? 'الإجمالي' :
                         key === 'growth' ? 'النمو' :
                         key === 'items' ? 'عدد العناصر' :
                         key === 'mortality' ? 'معدل النفوق' :
                         key === 'treatments' ? 'عدد العلاجات' :
                         key === 'vaccines' ? 'عدد التطعيمات' :
                         key === 'value' ? 'القيمة' :
                         key === 'lowStock' ? 'أصناف منخفضة' :
                         key === 'income' ? 'الإيرادات' :
                         key === 'expenses' ? 'المصروفات' :
                         key === 'profit' ? 'صافي الربح' :
                         key === 'dailyAverage' ? 'المتوسط اليومي' :
                         key}
                      </p>
                      <p className="text-2xl font-bold text-gray-800">
                        {typeof value === 'number' 
                          ? (key.includes('growth') || key.includes('percentage') || key.includes('rate')
                            ? `${value}%`
                            : value.toLocaleString())
                          : value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* ملخص التقرير */}
              <div className="p-6 bg-blue-50 rounded-lg">
                <h3 className="text-lg font-medium text-blue-800 mb-3">ملخص التقرير</h3>
                <p className="text-blue-700">
                  {selectedReport.type === 'sales' && 
                    'يظهر التقرير أداء المبيعات خلال الفترة المحددة مع تحليل النمو والمؤشرات الرئيسية.'}
                  {selectedReport.type === 'expenses' && 
                    'يتضمن التقرير تحليل المصروفات التشغيلية والمؤشرات المالية الرئيسية.'}
                  {selectedReport.type === 'health' && 
                    'يقدم التقرير نظرة شاملة على صحة القطيع ومؤشرات الأداء الصحية.'}
                  {selectedReport.type === 'inventory' && 
                    'يحتوي التقرير على تحليل المخزون والتنبيهات والتوصيات.'}
                </p>
              </div>

              {/* أزرار الإجراءات */}
              <div className="mt-8 flex justify-end space-x-3 space-x-reverse pt-6 border-t">
                <button
                  onClick={() => setSelectedReport(null)}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  إغلاق
                </button>
                <button className="btn-primary px-6 py-3 flex items-center">
                  <Download size={18} className="ml-2" />
                  تحميل PDF
                </button>
                <button className="btn-secondary px-6 py-3 flex items-center">
                  <Printer size={18} className="ml-2" />
                  طباعة
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Reports
