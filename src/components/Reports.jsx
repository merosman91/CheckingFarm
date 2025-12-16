import React, { useState, useEffect } from 'react';
import {
  FiDownload, FiPrinter, FiFilter, FiCalendar,
  FiBarChart2, FiPieChart, FiTrendingUp,
  FiTrendingDown, FiFileText, FiDollarSign,
  FiPackage, FiUsers, FiClock, FiEye
} from 'react-icons/fi';
import { MdPoultry, MdShowChart, MdLocalHospital } from 'react-icons/md';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, ComposedChart, Scatter
} from 'recharts';

const Reports = ({ data, addNotification }) => {
  const [activeReport, setActiveReport] = useState('الأداء');
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [selectedCycle, setSelectedCycle] = useState('الكل');
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);

  const reports = [
    { id: 'الأداء', label: 'أداء المزرعة', icon: <MdShowChart />, color: 'bg-blue-500' },
    { id: 'المالية', label: 'التقارير المالية', icon: <FiDollarSign />, color: 'bg-green-500' },
    { id: 'الصحة', label: 'الصحة والنفوق', icon: <MdLocalHospital />, color: 'bg-red-500' },
    { id: 'المخزون', label: 'المخزون والعلف', icon: <FiPackage />, color: 'bg-yellow-500' },
    { id: 'الدورات', label: 'مقارنة الدورات', icon: <MdPoultry />, color: 'bg-purple-500' },
    { id: 'الموظفين', label: 'أداء الموظفين', icon: <FiUsers />, color: 'bg-pink-500' },
    { id: 'الشامل', label: 'التقرير الشامل', icon: <FiFileText />, color: 'bg-indigo-500' }
  ];

  const cycles = data.cycles || [];
  const activeCycles = cycles.filter(c => c.status === 'نشط');

  useEffect(() => {
    generateReport();
  }, [activeReport, dateRange, selectedCycle]);

  const generateReport = () => {
    setLoading(true);
    
    // محاكاة توليد التقرير
    setTimeout(() => {
      let generatedData = null;
      
      switch(activeReport) {
        case 'الأداء':
          generatedData = generatePerformanceReport();
          break;
        case 'المالية':
          generatedData = generateFinancialReport();
          break;
        case 'الصحة':
          generatedData = generateHealthReport();
          break;
        case 'المخزون':
          generatedData = generateInventoryReport();
          break;
        case 'الدورات':
          generatedData = generateCyclesReport();
          break;
        case 'الموظفين':
          generatedData = generateEmployeesReport();
          break;
        case 'الشامل':
          generatedData = generateComprehensiveReport();
          break;
      }
      
      setReportData(generatedData);
      setLoading(false);
      
      addNotification({
        type: 'info',
        title: 'تم إنشاء التقرير',
        message: `تم إنشاء تقرير ${activeReport} بنجاح`,
        time: new Date().toLocaleTimeString('ar-EG')
      });
    }, 1000);
  };

  const generatePerformanceReport = () => {
    const filteredCycles = selectedCycle === 'الكل' 
      ? activeCycles 
      : activeCycles.filter(c => c.id.toString() === selectedCycle);
    
    if (filteredCycles.length === 0) return null;
    
    // بيانات الأداء اليومي
    const performanceData = [];
    filteredCycles.forEach(cycle => {
      const cycleRecords = data.dailyRecords?.filter(r => r.cycleId === cycle.id) || [];
      
      // حساب متوسطات
      const avgWeight = cycleRecords.length > 0 
        ? (cycleRecords.reduce((sum, r) => sum + (r.avgWeight || 0), 0) / cycleRecords.length).toFixed(2)
        : 0;
      
      const totalMortality = cycleRecords.reduce((sum, r) => sum + (r.mortality || 0), 0);
      const mortalityRate = cycle.initialBirds > 0 
        ? ((totalMortality / cycle.initialBirds) * 100).toFixed(2)
        : 0;
      
      const feedConsumed = cycleRecords.reduce((sum, r) => sum + (r.feedConsumed || 0), 0);
      const waterConsumed = cycleRecords.reduce((sum, r) => sum + (r.waterConsumed || 0), 0);
      const fcr = cycle.currentBirds > 0 && avgWeight > 0
        ? (feedConsumed / (cycle.currentBirds * avgWeight)).toFixed(2)
        : 0;
      
      performanceData.push({
        name: cycle.name,
        currentBirds: cycle.currentBirds,
        avgWeight: parseFloat(avgWeight),
        mortalityRate: parseFloat(mortalityRate),
        feedConsumed: Math.round(feedConsumed / 1000), // تحويل لطن
        waterConsumed: Math.round(waterConsumed / 1000), // تحويل لمتر مكعب
        fcr: parseFloat(fcr),
        daysRunning: Math.floor((new Date() - new Date(cycle.startDate)) / (1000 * 60 * 60 * 24))
      });
    });
    
    // بيانات الرسم البياني الأسبوعي
    const weeklyData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      const dayRecords = data.dailyRecords?.filter(r => {
        const recordDate = new Date(r.date);
        return recordDate.toDateString() === date.toDateString();
      }) || [];
      
      const dayMortality = dayRecords.reduce((sum, r) => sum + (r.mortality || 0), 0);
      const dayWeight = dayRecords.length > 0
        ? (dayRecords.reduce((sum, r) => sum + (r.avgWeight || 0), 0) / dayRecords.length).toFixed(2)
        : 0;
      
      weeklyData.push({
        day: date.toLocaleDateString('ar-EG', { weekday: 'short' }),
        mortality: dayMortality,
        weight: parseFloat(dayWeight),
        feed: dayRecords.reduce((sum, r) => sum + (r.feedConsumed || 0), 0) / 100
      });
    }
    
    return {
      title: 'تقرير أداء المزرعة',
      summary: {
        totalCycles: activeCycles.length,
        totalBirds: activeCycles.reduce((sum, c) => sum + (c.currentBirds || 0), 0),
        avgMortality: performanceData.length > 0 
          ? (performanceData.reduce((sum, d) => sum + d.mortalityRate, 0) / performanceData.length).toFixed(2)
          : 0,
        avgFCR: performanceData.length > 0 
          ? (performanceData.reduce((sum, d) => sum + d.fcr, 0) / performanceData.length).toFixed(2)
          : 0
      },
      performanceData,
      weeklyData,
      charts: [
        {
          type: 'bar',
          title: 'مقارنة أداء الدورات',
          data: performanceData,
          config: {
            dataKey: 'name',
            bars: [
              { key: 'currentBirds', name: 'عدد الطيور', color: '#3498db' },
              { key: 'avgWeight', name: 'متوسط الوزن', color: '#2ecc71' }
            ]
          }
        },
        {
          type: 'line',
          title: 'الأداء الأسبوعي',
          data: weeklyData,
          config: {
            dataKey: 'day',
            lines: [
              { key: 'mortality', name: 'النفوق', color: '#e74c3c' },
              { key: 'weight', name: 'متوسط الوزن', color: '#3498db' }
            ]
          }
        }
      ]
    };
  };

  const generateFinancialReport = () => {
    const filteredRecords = data.financialRecords?.filter(record => {
      if (!startDate && !endDate) return true;
      const recordDate = new Date(record.date);
      return (!startDate || recordDate >= startDate) && 
             (!endDate || recordDate <= endDate);
    }) || [];
    
    const income = filteredRecords.filter(r => r.type === 'إيراد')
      .reduce((sum, r) => sum + (r.amount || 0), 0);
    
    const expenses = filteredRecords.filter(r => r.type === 'مصروف')
      .reduce((sum, r) => sum + (r.amount || 0), 0);
    
    const netProfit = income - expenses;
    
    // تحليل المصروفات حسب الفئة
    const expensesByCategory = {};
    filteredRecords
      .filter(r => r.type === 'مصروف')
      .forEach(r => {
        expensesByCategory[r.category] = (expensesByCategory[r.category] || 0) + (r.amount || 0);
      });
    
    const expensesData = Object.entries(expensesByCategory).map(([name, value]) => ({
      name,
      value
    }));
    
    // البيانات الشهرية
    const monthlyData = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      
      const monthRecords = filteredRecords.filter(r => {
        const recordDate = new Date(r.date);
        return recordDate.getMonth() === date.getMonth() && 
               recordDate.getFullYear() === date.getFullYear();
      });
      
      const monthIncome = monthRecords.filter(r => r.type === 'إيراد')
        .reduce((sum, r) => sum + (r.amount || 0), 0);
      
      const monthExpenses = monthRecords.filter(r => r.type === 'مصروف')
        .reduce((sum, r) => sum + (r.amount || 0), 0);
      
      monthlyData.push({
        month: date.toLocaleDateString('ar-EG', { month: 'short' }),
        income: monthIncome,
        expenses: monthExpenses,
        profit: monthIncome - monthExpenses
      });
    }
    
    return {
      title: 'التقرير المالي',
      summary: {
        totalIncome: income,
        totalExpenses: expenses,
        netProfit,
        roi: expenses > 0 ? ((netProfit / expenses) * 100).toFixed(2) : 0,
        transactions: filteredRecords.length
      },
      expensesData,
      monthlyData,
      charts: [
        {
          type: 'pie',
          title: 'توزيع المصروفات',
          data: expensesData,
          config: {}
        },
        {
          type: 'composed',
          title: 'الإيرادات والمصروفات الشهرية',
          data: monthlyData,
          config: {
            dataKey: 'month',
            bars: [
              { key: 'income', name: 'الإيرادات', color: '#2ecc71' },
              { key: 'expenses', name: 'المصروفات', color: '#e74c3c' }
            ],
            lines: [
              { key: 'profit', name: 'الربح', color: '#3498db', type: 'monotone' }
            ]
          }
        }
      ]
    };
  };

  const generateHealthReport = () => {
    const healthData = data.healthRecords || [];
    const dailyRecords = data.dailyRecords || [];
    
    // إحصائيات الصحة
    const vaccinations = healthData.filter(r => r.type === 'تحصين').length;
    const treatments = healthData.filter(r => r.type === 'علاج').length;
    
    // تحليل النفوق
    const mortalityByCycle = {};
    activeCycles.forEach(cycle => {
      const cycleRecords = dailyRecords.filter(r => r.cycleId === cycle.id);
      const totalMortality = cycleRecords.reduce((sum, r) => sum + (r.mortality || 0), 0);
      const mortalityRate = cycle.initialBirds > 0 
        ? ((totalMortality / cycle.initialBirds) * 100).toFixed(2)
        : 0;
      mortalityByCycle[cycle.name] = parseFloat(mortalityRate);
    });
    
    // التحصينات حسب النوع
    const vaccinesByType = {};
    healthData
      .filter(r => r.type === 'تحصين' && r.vaccineName)
      .forEach(r => {
        vaccinesByType[r.vaccineName] = (vaccinesByType[r.vaccineName] || 0) + 1;
      });
    
    const vaccinesData = Object.entries(vaccinesByType).map(([name, count]) => ({
      name,
      count
    }));
    
    // بيانات النفوق اليومي
    const mortalityData = [];
    for (let i = 30; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      const dayRecords = dailyRecords.filter(r => {
        const recordDate = new Date(r.date);
        return recordDate.toDateString() === date.toDateString();
      });
      
      const dayMortality = dayRecords.reduce((sum, r) => sum + (r.mortality || 0), 0);
      
      mortalityData.push({
        date: date.toLocaleDateString('ar-EG', { day: 'numeric', month: 'short' }),
        mortality: dayMortality
      });
    }
    
    return {
      title: 'تقرير الصحة والنفوق',
      summary: {
        totalVaccinations: vaccinations,
        totalTreatments: treatments,
        avgMortality: Object.values(mortalityByCycle).length > 0
          ? (Object.values(mortalityByCycle).reduce((sum, rate) => sum + rate, 0) / Object.values(mortalityByCycle).length).toFixed(2)
          : 0,
        healthScore: 85 // قيمة تقديرية
      },
      mortalityByCycle,
      vaccinesData,
      mortalityData,
      charts: [
        {
          type: 'bar',
          title: 'نسبة النفوق لكل دورة',
          data: Object.entries(mortalityByCycle).map(([name, rate]) => ({ name, rate })),
          config: {
            dataKey: 'name',
            bars: [
              { key: 'rate', name: 'نسبة النفوق %', color: '#e74c3c' }
            ]
          }
        },
        {
          type: 'area',
          title: 'النفوق خلال 30 يوم',
          data: mortalityData,
          config: {
            dataKey: 'date',
            areas: [
              { key: 'mortality', name: 'النفوق', color: '#e74c3c' }
            ]
          }
        },
        {
          type: 'pie',
          title: 'التحصينات حسب النوع',
          data: vaccinesData,
          config: {}
        }
      ]
    };
  };

  // توليد التقارير الأخرى (مبسطة)
  const generateInventoryReport = () => ({
    title: 'تقرير المخزون',
    summary: {
      totalItems: data.inventory?.length || 0,
      lowStock: data.inventory?.filter(i => i.quantity < (i.minQuantity || 10)).length || 0,
      totalValue: data.inventory?.reduce((sum, i) => sum + (i.quantity * i.costPerUnit), 0) || 0
    }
  });

  const generateCyclesReport = () => ({
    title: 'مقارنة الدورات',
    summary: {
      activeCycles: activeCycles.length,
      completedCycles: cycles.filter(c => c.status === 'مكتمل').length,
      totalBirds: cycles.reduce((sum, c) => sum + (c.initialBirds || 0), 0)
    }
  });

  const generateEmployeesReport = () => ({
    title: 'تقرير الموظفين',
    summary: {
      totalEmployees: data.employees?.length || 0,
      activeEmployees: data.employees?.filter(e => e.status === 'نشط').length || 0
    }
  });

  const generateComprehensiveReport = () => ({
    title: 'التقرير الشامل',
    summary: {
      farmStatus: 'جيد',
      financialHealth: 'مربح',
      inventoryStatus: 'كافي',
      healthStatus: 'جيد'
    }
  });

  const handlePrint = () => {
    addNotification({
      type: 'success',
      title: 'جاري الطباعة',
      message: 'سيتم فتح نافذة الطباعة',
      time: new Date().toLocaleTimeString('ar-EG')
    });
    
    setTimeout(() => {
      window.print();
    }, 500);
  };

  const handleExport = () => {
    const exportData = {
      report: reportData,
      generatedAt: new Date().toISOString(),
      parameters: {
        reportType: activeReport,
        dateRange,
        selectedCycle
      }
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', `douajny_report_${activeReport}_${new Date().toISOString().split('T')[0]}.json`);
    linkElement.click();
    
    addNotification({
      type: 'success',
      title: 'تم التصدير',
      message: 'تم تصدير التقرير بنجاح',
      time: new Date().toLocaleTimeString('ar-EG')
    });
  };

  const renderChart = (chart) => {
    if (!chart) return null;
    
    const { type, data, config } = chart;
    
    switch(type) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey={config.dataKey} />
              <YAxis />
              <Tooltip />
              <Legend />
              {config.lines.map((line, index) => (
                <Line
                  key={index}
                  type="monotone"
                  dataKey={line.key}
                  name={line.name}
                  stroke={line.color}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        );
        
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey={config.dataKey} />
              <YAxis />
              <Tooltip />
              <Legend />
              {config.bars.map((bar, index) => (
                <Bar
                  key={index}
                  dataKey={bar.key}
                  name={bar.name}
                  fill={bar.color}
                  radius={[4, 4, 0, 0]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );
        
      case 'pie':
        const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey={data[0]?.count ? 'count' : 'value'}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );
        
      case 'area':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey={config.dataKey} />
              <YAxis />
              <Tooltip />
              <Legend />
              {config.areas.map((area, index) => (
                <Area
                  key={index}
                  type="monotone"
                  dataKey={area.key}
                  name={area.name}
                  stroke={area.color}
                  fill={area.color}
                  fillOpacity={0.3}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        );
        
      case 'composed':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey={config.dataKey} />
              <YAxis />
              <Tooltip />
              <Legend />
              {config.bars.map((bar, index) => (
                <Bar
                  key={index}
                  dataKey={bar.key}
                  name={bar.name}
                  fill={bar.color}
                  radius={[4, 4, 0, 0]}
                />
              ))}
              {config.lines.map((line, index) => (
                <Line
                  key={index}
                  type={line.type || 'monotone'}
                  dataKey={line.key}
                  name={line.name}
                  stroke={line.color}
                  strokeWidth={2}
                />
              ))}
            </ComposedChart>
          </ResponsiveContainer>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* رأس الصفحة */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-3">
            <FiBarChart2 className="text-primary-600" />
            التقارير والتحليلات
          </h1>
          <p className="text-gray-600 mt-2">
            تحليل بيانات المزرعة وتقارير الأداء التفصيلية
          </p>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={handlePrint}
            className="btn bg-white border border-gray-300 text-gray-700 flex items-center gap-2"
          >
            <FiPrinter /> طباعة
          </button>
          <button
            onClick={handleExport}
            disabled={!reportData}
            className="btn bg-white border border-gray-300 text-gray-700 flex items-center gap-2"
          >
            <FiDownload /> تصدير
          </button>
          <button
            onClick={generateReport}
            className="btn btn-primary flex items-center gap-2"
          >
            <FiRefreshCw /> تحديث
          </button>
        </div>
      </div>

      {/* فلترة التقارير */}
      <div className="glass-card rounded-xl p-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              نوع التقرير
            </label>
            <select
              value={activeReport}
              onChange={(e) => setActiveReport(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {reports.map(report => (
                <option key={report.id} value={report.id}>{report.label}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              نطاق التاريخ
            </label>
            <DatePicker
              selectsRange={true}
              startDate={startDate}
              endDate={endDate}
              onChange={(update) => setDateRange(update)}
              isClearable={true}
              placeholderText="اختر نطاق التاريخ"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              dateFormat="yyyy/MM/dd"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              الدورة
            </label>
            <select
              value={selectedCycle}
              onChange={(e) => setSelectedCycle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="الكل">جميع الدورات</option>
              {activeCycles.map(cycle => (
                <option key={cycle.id} value={cycle.id}>{cycle.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* تبويبات التقارير */}
        <div className="mb-6">
          <div className="flex overflow-x-auto gap-1 pb-2">
            {reports.map(report => (
              <button
                key={report.id}
                onClick={() => setActiveReport(report.id)}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg whitespace-nowrap transition-all ${
                  activeReport === report.id
                    ? `${report.color} text-white`
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {report.icon}
                {report.label}
              </button>
            ))}
          </div>
        </div>

        {/* محتوى التقرير */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="loading-spinner"></div>
            <span className="mr-3">جاري إنشاء التقرير...</span>
          </div>
        ) : reportData ? (
          <div className="space-y-8">
            {/* عنوان التقرير */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800">{reportData.title}</h2>
              <p className="text-gray-600 mt-2">
                تم إنشاؤه في {new Date().toLocaleDateString('ar-EG')}
              </p>
            </div>

            {/* ملخص التقرير */}
            {reportData.summary && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(reportData.summary).map(([key, value], index) => (
                  <div key={index} className="bg-white border rounded-lg p-4 text-center">
                    <p className="text-sm text-gray-600 mb-1">{key}</p>
                    <p className="text-xl font-bold text-gray-800">{value}</p>
                  </div>
                ))}
              </div>
            )}

            {/* الرسوم البيانية */}
            {reportData.charts && (
              <div className="space-y-8">
                {reportData.charts.map((chart, index) => (
                  <div key={index} className="glass-card rounded-xl p-5">
                    <h3 className="text-lg font-bold text-gray-800 mb-6">{chart.title}</h3>
                    {renderChart(chart)}
                  </div>
                ))}
              </div>
            )}

            {/* الجداول */}
            {reportData.performanceData && (
              <div className="glass-card rounded-xl p-5">
                <h3 className="text-lg font-bold text-gray-800 mb-6">بيانات الأداء التفصيلية</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">الدورة</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">الطيور</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">متوسط الوزن</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">نسبة النفوق</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">معدل التحويل</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">الأيام</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {reportData.performanceData.map((row, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 font-medium">{row.name}</td>
                          <td className="px-6 py-4">{row.currentBirds.toLocaleString()}</td>
                          <td className="px-6 py-4">{row.avgWeight} كجم</td>
                          <td className="px-6 py-4">{row.mortalityRate}%</td>
                          <td className="px-6 py-4">{row.fcr}</td>
                          <td className="px-6 py-4">{row.daysRunning}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* تذييل التقرير */}
            <div className="border-t pt-6 text-sm text-gray-600">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                  <p>تم إنشاء هذا التقرير بواسطة نظام دواجني</p>
                  <p className="mt-1">© 2024 دواجني - جميع الحقوق محفوظة</p>
                </div>
                <div className="text-right">
                  <p>المستخدم: المدير</p>
                  <p className="mt-1">الوقت: {new Date().toLocaleTimeString('ar-EG')}</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <FiBarChart2 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg text-gray-600">لم يتم إنشاء تقرير بعد</p>
            <p className="text-sm text-gray-500 mt-2">
              اختر نوع التقرير واضغط على تحديث لإنشاء تقرير جديد
            </p>
          </div>
        )}
      </div>

      {/* أنواع التقارير السريعة */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {reports.map(report => (
          <button
            key={report.id}
            onClick={() => setActiveReport(report.id)}
            className={`p-4 rounded-xl flex flex-col items-center justify-center transition-all ${
              activeReport === report.id
                ? `${report.color} text-white`
                : 'bg-white border hover:shadow-md'
            }`}
          >
            <div className="text-2xl mb-2">{report.icon}</div>
            <span className="font-medium">{report.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Reports;
