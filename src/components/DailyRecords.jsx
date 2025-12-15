import React, { useState, useEffect } from 'react';
import {
  FiPlus, FiEdit, FiTrash2, FiFilter, FiDownload,
  FiPrinter, FiSearch, FiCalendar, FiTrendingUp,
  FiThermometer, FiDroplet, FiPackage, FiBarChart2,
  FiChevronRight, FiAlertCircle, FiCheckCircle
} from 'react-icons/fi';
import { MdPoultry, MdShowChart, MdLocalHospital } from 'react-icons/md';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const DailyRecords = ({ data, updateData, addNotification }) => {
  const [records, setRecords] = useState(data.dailyRecords || []);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCycle, setFilterCycle] = useState('الكل');
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  const [newRecord, setNewRecord] = useState({
    date: new Date(),
    cycleId: '',
    mortality: 0,
    avgWeight: 0,
    temperature: 24,
    humidity: 60,
    feedConsumed: 0,
    waterConsumed: 0,
    feedType: 'علف بادي',
    notes: '',
    healthStatus: 'جيد',
    vaccinations: [],
    medicines: []
  });

  // الحصول على الدورات النشطة
  const activeCycles = data.cycles?.filter(c => c.status === 'نشط') || [];
  const healthStatuses = ['ممتاز', 'جيد', 'متوسط', 'سيء', 'حرج'];
  const feedTypes = ['علف بادي', 'علف نامي', 'علف ناهي', 'علف خاص'];

  useEffect(() => {
    setRecords(data.dailyRecords || []);
    filterRecords();
  }, [data.dailyRecords, searchTerm, filterCycle, dateRange]);

  const filterRecords = () => {
    let filtered = records.filter(record => {
      const cycle = data.cycles?.find(c => c.id === record.cycleId);
      const matchesSearch = cycle?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          record.notes?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCycle = filterCycle === 'الكل' || record.cycleId.toString() === filterCycle;
      
      const recordDate = new Date(record.date);
      const matchesDate = (!startDate || recordDate >= startDate) && 
                         (!endDate || recordDate <= endDate);
      
      return matchesSearch && matchesCycle && matchesDate;
    });

    // الترتيب من الأحدث إلى الأقدم
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    setFilteredRecords(filtered);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // التحقق من عدم تكرار السجل لنفس اليوم والدورة
    const existingRecord = records.find(r => 
      r.cycleId === newRecord.cycleId && 
      new Date(r.date).toDateString() === newRecord.date.toDateString() &&
      (!editingRecord || r.id !== editingRecord.id)
    );
    
    if (existingRecord) {
      addNotification({
        type: 'error',
        title: 'خطأ',
        message: 'يوجد سجل بالفعل لهذا اليوم لهذه الدورة',
        time: new Date().toLocaleTimeString('ar-EG')
      });
      return;
    }

    const updatedRecord = {
      ...newRecord,
      id: editingRecord ? editingRecord.id : Date.now(),
      createdAt: editingRecord ? editingRecord.createdAt : new Date().toISOString(),
      date: newRecord.date.toISOString()
    };

    let updatedRecords;
    if (editingRecord) {
      updatedRecords = records.map(r => r.id === editingRecord.id ? updatedRecord : r);
      addNotification({
        type: 'success',
        title: 'تم التحديث',
        message: 'تم تحديث السجل اليومي بنجاح',
        time: new Date().toLocaleTimeString('ar-EG')
      });
    } else {
      updatedRecords = [...records, updatedRecord];
      addNotification({
        type: 'success',
        title: 'تم الإضافة',
        message: 'تم إضافة السجل اليومي بنجاح',
        time: new Date().toLocaleTimeString('ar-EG')
      });

      // تحديث عدد الطيور في الدورة
      if (newRecord.cycleId) {
        const cycle = data.cycles.find(c => c.id === newRecord.cycleId);
        if (cycle) {
          const newCurrentBirds = cycle.currentBirds - (newRecord.mortality || 0);
          const updatedCycles = data.cycles.map(c => 
            c.id === newRecord.cycleId 
              ? { ...c, currentBirds: Math.max(0, newCurrentBirds) }
              : c
          );
          updateData('cycles', updatedCycles);
        }
      }
    }

    updateData('dailyRecords', updatedRecords);
    setShowModal(false);
    resetForm();
  };

  const resetForm = () => {
    setNewRecord({
      date: new Date(),
      cycleId: '',
      mortality: 0,
      avgWeight: 0,
      temperature: 24,
      humidity: 60,
      feedConsumed: 0,
      waterConsumed: 0,
      feedType: 'علف بادي',
      notes: '',
      healthStatus: 'جيد',
      vaccinations: [],
      medicines: []
    });
    setEditingRecord(null);
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    setNewRecord({
      ...record,
      date: new Date(record.date)
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذا السجل؟')) {
      const updatedRecords = records.filter(r => r.id !== id);
      updateData('dailyRecords', updatedRecords);
      addNotification({
        type: 'warning',
        title: 'تم الحذف',
        message: 'تم حذف السجل اليومي بنجاح',
        time: new Date().toLocaleTimeString('ar-EG')
      });
    }
  };

  const getCycleName = (cycleId) => {
    const cycle = data.cycles?.find(c => c.id === cycleId);
    return cycle ? cycle.name : 'غير معروف';
  };

  const getHealthBadge = (status) => {
    const badges = {
      'ممتاز': 'bg-green-100 text-green-800',
      'جيد': 'bg-blue-100 text-blue-800',
      'متوسط': 'bg-yellow-100 text-yellow-800',
      'سيء': 'bg-orange-100 text-orange-800',
      'حرج': 'bg-red-100 text-red-800'
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  // حساب الإحصائيات
  const calculateStats = () => {
    if (filteredRecords.length === 0) return null;

    const totalMortality = filteredRecords.reduce((sum, r) => sum + (r.mortality || 0), 0);
    const avgWeight = filteredRecords.reduce((sum, r) => sum + (r.avgWeight || 0), 0) / filteredRecords.length;
    const avgTemp = filteredRecords.reduce((sum, r) => sum + (r.temperature || 0), 0) / filteredRecords.length;
    const totalFeed = filteredRecords.reduce((sum, r) => sum + (r.feedConsumed || 0), 0);
    const totalWater = filteredRecords.reduce((sum, r) => sum + (r.waterConsumed || 0), 0);

    return {
      totalMortality,
      avgWeight: avgWeight.toFixed(2),
      avgTemp: avgTemp.toFixed(1),
      totalFeed,
      totalWater,
      totalRecords: filteredRecords.length
    };
  };

  // بيانات الرسوم البيانية
  const prepareChartData = () => {
    const last7Records = filteredRecords.slice(0, 7).reverse();
    return last7Records.map(record => ({
      date: new Date(record.date).toLocaleDateString('ar-EG', { weekday: 'short' }),
      نفوق: record.mortality || 0,
      وزن: record.avgWeight || 0,
      علف: record.feedConsumed || 0
    }));
  };

  const stats = calculateStats();
  const chartData = prepareChartData();
  const paginatedRecords = filteredRecords.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );
  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* رأس الصفحة */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-3">
            <FiCalendar className="text-primary-600" />
            السجل اليومي
          </h1>
          <p className="text-gray-600 mt-2">
            تسجيل ومتابعة البيانات اليومية للدواجن
          </p>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={() => {
              if (activeCycles.length === 0) {
                addNotification({
                  type: 'error',
                  title: 'لا توجد دورات',
                  message: 'يجب إضافة دورة نشطة أولاً',
                  time: new Date().toLocaleTimeString('ar-EG')
                });
                return;
              }
              setShowModal(true);
              resetForm();
            }}
            className="btn btn-primary flex items-center gap-2"
          >
            <FiPlus /> سجل جديد
          </button>
          <button className="btn bg-white border border-gray-300 text-gray-700 flex items-center gap-2">
            <FiDownload /> تصدير
          </button>
          <button className="btn bg-white border border-gray-300 text-gray-700 flex items-center gap-2">
            <FiPrinter /> طباعة
          </button>
        </div>
      </div>

      {/* إحصائيات سريعة */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-card rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">إجمالي النفوق</p>
                <h3 className="text-2xl font-bold text-gray-800">
                  {stats.totalMortality}
                </h3>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <MdLocalHospital className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
          
          <div className="glass-card rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">متوسط الوزن</p>
                <h3 className="text-2xl font-bold text-gray-800">
                  {stats.avgWeight} كجم
                </h3>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <MdShowChart className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="glass-card rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">إجمالي العلف</p>
                <h3 className="text-2xl font-bold text-gray-800">
                  {(stats.totalFeed / 1000).toFixed(1)} طن
                </h3>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <FiPackage className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="glass-card rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">عدد السجلات</p>
                <h3 className="text-2xl font-bold text-gray-800">
                  {stats.totalRecords}
                </h3>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <FiBarChart2 className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* أدوات البحث والتصفية */}
      <div className="glass-card rounded-xl p-5">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <FiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="ابحث باسم الدورة أو الملاحظات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex gap-3">
            <select
              value={filterCycle}
              onChange={(e) => setFilterCycle(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="الكل">جميع الدورات</option>
              {activeCycles.map(cycle => (
                <option key={cycle.id} value={cycle.id}>{cycle.name}</option>
              ))}
            </select>
            
            <DatePicker
              selectsRange={true}
              startDate={startDate}
              endDate={endDate}
              onChange={(update) => setDateRange(update)}
              isClearable={true}
              placeholderText="نطاق التاريخ"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              dateFormat="yyyy/MM/dd"
            />
            
            <button className="btn bg-white border border-gray-300 text-gray-700 flex items-center gap-2">
              <FiFilter /> تصفية متقدمة
            </button>
          </div>
        </div>

        {/* الرسوم البيانية */}
        {filteredRecords.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-800 mb-4">تحليل بيانات الأسبوع الأخير</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="glass-card rounded-xl p-4">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="نفوق" 
                        stroke="#e74c3c" 
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="وزن" 
                        stroke="#3498db" 
                        strokeWidth={2}
                        dot={{ r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="glass-card rounded-xl p-4">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area 
                        type="monotone" 
                        dataKey="علف" 
                        stroke="#2ecc71" 
                        fill="#2ecc71" 
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* جدول السجلات */}
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  التاريخ
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الدورة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  البيانات الصحية
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الاستهلاك
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الحالة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedRecords.length > 0 ? (
                paginatedRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary-100 rounded-lg">
                          <FiCalendar className="w-5 h-5 text-primary-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {new Date(record.date).toLocaleDateString('ar-EG', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </h4>
                          <p className="text-sm text-gray-500 mt-1">
                            {new Date(record.date).toLocaleTimeString('ar-EG')}
                          </p>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div>
                        <h4 className="font-medium text-primary-600">
                          {getCycleName(record.cycleId)}
                        </h4>
                        <p className="text-sm text-gray-500 mt-1">
                          <MdPoultry className="inline ml-1" />
                          {record.feedType}
                        </p>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">النفوق</span>
                          <span className="font-medium text-red-600">
                            {record.mortality || 0} طائر
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">متوسط الوزن</span>
                          <span className="font-medium text-blue-600">
                            {record.avgWeight || 0} كجم
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">درجة الحرارة</span>
                          <span className="font-medium text-orange-600">
                            <FiThermometer className="inline ml-1" />
                            {record.temperature || 24}°C
                          </span>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">العلف المستهلك</span>
                          <span className="font-medium text-green-600">
                            {record.feedConsumed || 0} كجم
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">الماء المستهلك</span>
                          <span className="font-medium text-blue-600">
                            <FiDroplet className="inline ml-1" />
                            {record.waterConsumed || 0} لتر
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">الرطوبة</span>
                          <span className="font-medium text-purple-600">
                            {record.humidity || 60}%
                          </span>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getHealthBadge(record.healthStatus)}`}>
                          {record.healthStatus}
                        </span>
                        {record.vaccinations?.length > 0 && (
                          <div className="text-xs text-green-600 flex items-center gap-1 mt-2">
                            <FiCheckCircle />
                            {record.vaccinations.length} تحصين
                          </div>
                        )}
                        {record.medicines?.length > 0 && (
                          <div className="text-xs text-red-600 flex items-center gap-1">
                            <FiAlertCircle />
                            {record.medicines.length} دواء
                          </div>
                        )}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(record)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                          title="تعديل"
                        >
                          <FiEdit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(record.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                          title="حذف"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            // عرض التفاصيل
                            addNotification({
                              type: 'info',
                              title: 'تفاصيل السجل',
                              message: `عرض تفاصيل السجل لـ ${getCycleName(record.cycleId)}`,
                              time: new Date().toLocaleTimeString('ar-EG')
                            });
                          }}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
                          title="عرض التفاصيل"
                        >
                          <FiChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <div className="text-gray-500">
                      <FiCalendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p className="text-lg">لا توجد سجلات</p>
                      <p className="text-sm mt-2">ابدأ بإضافة سجل يومي جديد</p>
                      <button
                        onClick={() => setShowModal(true)}
                        className="mt-4 btn btn-primary inline-flex items-center gap-2"
                      >
                        <FiPlus /> إضافة سجل جديد
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* الترقيم الصفحي */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-700">
              عرض <span className="font-medium">{(currentPage - 1) * recordsPerPage + 1}</span> إلى{' '}
              <span className="font-medium">
                {Math.min(currentPage * recordsPerPage, filteredRecords.length)}
              </span>{' '}
              من <span className="font-medium">{filteredRecords.length}</span> سجل
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                السابق
              </button>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-1 rounded ${currentPage === pageNum 
                      ? 'bg-primary-600 text-white' 
                      : 'border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                التالي
              </button>
            </div>
          </div>
        )}
      </div>

      {/* مودال إضافة/تعديل سجل */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">
                  {editingRecord ? 'تعديل السجل اليومي' : 'إضافة سجل يومي جديد'}
                </h3>
                <button
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* المعلومات الأساسية */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-700 border-b pb-2">المعلومات الأساسية</h4>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        التاريخ *
                      </label>
                      <DatePicker
                        selected={newRecord.date}
                        onChange={(date) => setNewRecord({...newRecord, date})}
                        dateFormat="yyyy/MM/dd"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        الدورة *
                      </label>
                      <select
                        required
                        value={newRecord.cycleId}
                        onChange={(e) => setNewRecord({...newRecord, cycleId: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value="">اختر الدورة</option>
                        {activeCycles.map(cycle => (
                          <option key={cycle.id} value={cycle.id}>
                            {cycle.name} ({cycle.houseNumber}) - {cycle.currentBirds} طائر
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        نوع العلف
                      </label>
                      <select
                        value={newRecord.feedType}
                        onChange={(e) => setNewRecord({...newRecord, feedType: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        {feedTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        الحالة الصحية
                      </label>
                      <select
                        value={newRecord.healthStatus}
                        onChange={(e) => setNewRecord({...newRecord, healthStatus: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        {healthStatuses.map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  {/* البيانات الصحية */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-700 border-b pb-2">البيانات الصحية</h4>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          عدد النفوق *
                        </label>
                        <input
                          type="number"
                          required
                          min="0"
                          value={newRecord.mortality}
                          onChange={(e) => setNewRecord({...newRecord, mortality: parseInt(e.target.value) || 0})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          متوسط الوزن (كجم) *
                        </label>
                        <input
                          type="number"
                          required
                          step="0.01"
                          min="0"
                          value={newRecord.avgWeight}
                          onChange={(e) => setNewRecord({...newRecord, avgWeight: parseFloat(e.target.value) || 0})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          درجة الحرارة (°C)
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={newRecord.temperature}
                          onChange={(e) => setNewRecord({...newRecord, temperature: parseFloat(e.target.value) || 24})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          الرطوبة (%)
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={newRecord.humidity}
                          onChange={(e) => setNewRecord({...newRecord, humidity: parseInt(e.target.value) || 60})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* الاستهلاك */}
                  <div className="space-y-4 md:col-span-2">
                    <h4 className="font-medium text-gray-700 border-b pb-2">الاستهلاك اليومي</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          العلف المستهلك (كجم) *
                        </label>
                        <input
                          type="number"
                          required
                          min="0"
                          value={newRecord.feedConsumed}
                          onChange={(e) => setNewRecord({...newRecord, feedConsumed: parseInt(e.target.value) || 0})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          الماء المستهلك (لتر) *
                        </label>
                        <input
                          type="number"
                          required
                          min="0"
                          value={newRecord.waterConsumed}
                          onChange={(e) => setNewRecord({...newRecord, waterConsumed: parseInt(e.target.value) || 0})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        ملاحظات إضافية
                      </label>
                      <textarea
                        value={newRecord.notes}
                        onChange={(e) => setNewRecord({...newRecord, notes: e.target.value})}
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="أي ملاحظات إضافية عن حالة الطيور، التصرفات، أو المشاكل..."
                      />
                    </div>
                    
                    {/* التحصينات والأدوية (مثال مبسط) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          التحصينات المطبقة
                        </label>
                        <div className="space-y-2">
                          {['نيوكاسل', 'جدري الطيور', 'إنفلونزا', 'جمبورو'].map(vaccine => (
                            <label key={vaccine} className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={newRecord.vaccinations?.includes(vaccine)}
                                onChange={(e) => {
                                  const updatedVaccinations = e.target.checked
                                    ? [...(newRecord.vaccinations || []), vaccine]
                                    : (newRecord.vaccinations || []).filter(v => v !== vaccine);
                                  setNewRecord({...newRecord, vaccinations: updatedVaccinations});
                                }}
                                className="rounded text-primary-600"
                              />
                              <span className="text-sm">{vaccine}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          الأدوية المعطاة
                        </label>
                        <div className="space-y-2">
                          {['مضاد حيوي', 'فيتامينات', 'مطهر مائي', 'منشط مناعي'].map(medicine => (
                            <label key={medicine} className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={newRecord.medicines?.includes(medicine)}
                                onChange={(e) => {
                                  const updatedMedicines = e.target.checked
                                    ? [...(newRecord.medicines || []), medicine]
                                    : (newRecord.medicines || []).filter(m => m !== medicine);
                                  setNewRecord({...newRecord, medicines: updatedMedicines});
                                }}
                                className="rounded text-primary-600"
                              />
                              <span className="text-sm">{medicine}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end gap-3 mt-8 pt-6 border-t">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 flex items-center gap-2"
                  >
                    <FiPlus /> {editingRecord ? 'تحديث السجل' : 'إضافة السجل'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DailyRecords;
