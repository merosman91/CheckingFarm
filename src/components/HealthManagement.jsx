import React, { useState, useEffect } from 'react';
import {
  FiPlus, FiEdit, FiTrash2, FiFilter, FiDownload,
  FiPrinter, FiSearch, FiDroplet, FiThermometer,
  FiAlertCircle, FiCheckCircle, FiCalendar,
  FiTrendingUp, FiEye, FiFileText
} from 'react-icons/fi';
import { MdLocalHospital, MdPoultry, MdShowChart } from 'react-icons/md';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const HealthManagement = ({ data, updateData, addNotification }) => {
  const [healthRecords, setHealthRecords] = useState(data.healthRecords || []);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('الكل');
  const [filterCycle, setFilterCycle] = useState('الكل');
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  const [newRecord, setNewRecord] = useState({
    date: new Date(),
    cycleId: '',
    type: 'تحصين',
    vaccineName: '',
    medicineName: '',
    dosage: '',
    method: 'ماء الشرب',
    notes: '',
    nextDate: null,
    cost: 0,
    responsible: '',
    status: 'مكتمل'
  });

  const recordTypes = ['تحصين', 'علاج', 'فحص', 'تنظيف', 'أخرى'];
  const vaccinationMethods = ['ماء الشرب', 'حقن', 'رش', 'قطرة عين', 'أخرى'];
  const statuses = ['مخطط', 'مكتمل', 'ملغى', 'مؤجل'];
  const activeCycles = data.cycles?.filter(c => c.status === 'نشط') || [];

  // قوائم الأدوية والتحصينات الشائعة
  const commonVaccines = [
    'نيوكاسل', 'جدري الطيور', 'إنفلونزا الطيور', 'جمبورو',
    'ماريك', 'برونشيت معدي', 'كوريزا', 'إيشيريشيا كولي'
  ];

  const commonMedicines = [
    'أموكسيسيلين', 'تيلوزين', 'دوكسيسايكلين', 'إنروفوكساسين',
    'فيتامين AD3E', 'فيتامين C', 'إلكترولايت', 'منشط مناعي'
  ];

  useEffect(() => {
    setHealthRecords(data.healthRecords || []);
    filterRecords();
  }, [data.healthRecords, searchTerm, filterType, filterCycle, dateRange]);

  const filterRecords = () => {
    let filtered = healthRecords.filter(record => {
      const matchesSearch = record.notes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          record.vaccineName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          record.medicineName?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'الكل' || record.type === filterType;
      const matchesCycle = filterCycle === 'الكل' || record.cycleId?.toString() === filterCycle;
      
      const recordDate = new Date(record.date);
      const matchesDate = (!startDate || recordDate >= startDate) && 
                         (!endDate || recordDate <= endDate);
      
      return matchesSearch && matchesType && matchesCycle && matchesDate;
    });

    // الترتيب من الأحدث إلى الأقدم
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    setFilteredRecords(filtered);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const updatedRecord = {
      ...newRecord,
      id: editingRecord ? editingRecord.id : Date.now(),
      createdAt: editingRecord ? editingRecord.createdAt : new Date().toISOString(),
      date: newRecord.date.toISOString(),
      nextDate: newRecord.nextDate ? newRecord.nextDate.toISOString() : null
    };

    let updatedRecords;
    if (editingRecord) {
      updatedRecords = healthRecords.map(r => r.id === editingRecord.id ? updatedRecord : r);
      addNotification({
        type: 'success',
        title: 'تم التحديث',
        message: 'تم تحديث السجل الصحي بنجاح',
        time: new Date().toLocaleTimeString('ar-EG')
      });
    } else {
      updatedRecords = [...healthRecords, updatedRecord];
      addNotification({
        type: 'success',
        title: 'تم الإضافة',
        message: 'تم إضافة سجل صحي جديد',
        time: new Date().toLocaleTimeString('ar-EG')
      });
    }

    updateData('healthRecords', updatedRecords);
    setShowModal(false);
    resetForm();
  };

  const resetForm = () => {
    setNewRecord({
      date: new Date(),
      cycleId: '',
      type: 'تحصين',
      vaccineName: '',
      medicineName: '',
      dosage: '',
      method: 'ماء الشرب',
      notes: '',
      nextDate: null,
      cost: 0,
      responsible: '',
      status: 'مكتمل'
    });
    setEditingRecord(null);
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    setNewRecord({
      ...record,
      date: new Date(record.date),
      nextDate: record.nextDate ? new Date(record.nextDate) : null
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذا السجل الصحي؟')) {
      const updatedRecords = healthRecords.filter(r => r.id !== id);
      updateData('healthRecords', updatedRecords);
      addNotification({
        type: 'warning',
        title: 'تم الحذف',
        message: 'تم حذف السجل الصحي بنجاح',
        time: new Date().toLocaleTimeString('ar-EG')
      });
    }
  };

  const getCycleName = (cycleId) => {
    const cycle = data.cycles?.find(c => c.id === cycleId);
    return cycle ? cycle.name : 'جميع الدورات';
  };

  const getStatusBadge = (status) => {
    const badges = {
      'مكتمل': 'bg-green-100 text-green-800',
      'مخطط': 'bg-blue-100 text-blue-800',
      'ملغى': 'bg-red-100 text-red-800',
      'مؤجل': 'bg-yellow-100 text-yellow-800'
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  const getTypeIcon = (type) => {
    const icons = {
      'تحصين': <FiCheckCircle className="w-5 h-5 text-green-600" />,
      'علاج': <MdLocalHospital className="w-5 h-5 text-red-600" />,
      'فحص': <FiEye className="w-5 h-5 text-blue-600" />,
      'تنظيف': <FiThermometer className="w-5 h-5 text-purple-600" />
    };
    return icons[type] || <FiFileText className="w-5 h-5 text-gray-600" />;
  };

  // حساب الإحصائيات
  const calculateStats = () => {
    const vaccinations = healthRecords.filter(r => r.type === 'تحصين').length;
    const treatments = healthRecords.filter(r => r.type === 'علاج').length;
    const upcoming = healthRecords.filter(r => 
      r.nextDate && new Date(r.nextDate) > new Date() && 
      new Date(r.nextDate) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    ).length;
    
    const totalCost = healthRecords.reduce((sum, r) => sum + (r.cost || 0), 0);
    const completed = healthRecords.filter(r => r.status === 'مكتمل').length;

    return {
      vaccinations,
      treatments,
      upcoming,
      totalCost: totalCost.toFixed(2),
      completed,
      total: healthRecords.length
    };
  };

  // بيانات الرسوم البيانية
  const prepareChartData = () => {
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return date;
    });

    return last30Days.map(date => {
      const dayRecords = healthRecords.filter(r => 
        new Date(r.date).toDateString() === date.toDateString()
      );
      
      return {
        date: date.toLocaleDateString('ar-EG', { day: 'numeric', month: 'short' }),
        تحصينات: dayRecords.filter(r => r.type === 'تحصين').length,
        علاجات: dayRecords.filter(r => r.type === 'علاج').length
      };
    });
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
            <MdLocalHospital className="text-primary-600" />
            إدارة الصحة والتحصينات
          </h1>
          <p className="text-gray-600 mt-2">
            متابعة وتنظيم البرامج الصحية والتحصينية للدواجن
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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">التحصينات</p>
              <h3 className="text-2xl font-bold text-gray-800">
                {stats.vaccinations}
              </h3>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <FiCheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">العلاجات</p>
              <h3 className="text-2xl font-bold text-gray-800">
                {stats.treatments}
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
              <p className="text-gray-600 text-sm">القادمة</p>
              <h3 className="text-2xl font-bold text-gray-800">
                {stats.upcoming}
              </h3>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <FiCalendar className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">إجمالي التكلفة</p>
              <h3 className="text-2xl font-bold text-gray-800">
                {stats.totalCost} ج.م
              </h3>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <MdShowChart className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* تنبيهات القادمة */}
      {stats.upcoming > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <FiAlertCircle className="text-yellow-500 text-xl mt-1" />
            <div className="flex-1">
              <h4 className="font-medium text-yellow-800">تحصينات قادمة</h4>
              <p className="text-yellow-600 text-sm mt-1">
                يوجد {stats.upcoming} تحصين/علاج خلال الأسبوع القادم.
              </p>
            </div>
            <button
              onClick={() => {
                const upcoming = healthRecords.filter(r => 
                  r.nextDate && new Date(r.nextDate) > new Date() && 
                  new Date(r.nextDate) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                );
                addNotification({
                  type: 'warning',
                  title: 'التحصينات القادمة',
                  message: `يوجد ${upcoming.length} تحصين قادم خلال الأسبوع`,
                  time: new Date().toLocaleTimeString('ar-EG'),
                  items: upcoming.map(u => u.vaccineName || u.medicineName)
                });
              }}
              className="text-sm text-yellow-600 hover:text-yellow-800"
            >
              عرض القائمة
            </button>
          </div>
        </div>
      )}

      {/* الرسوم البيانية */}
      {healthRecords.length > 0 && (
        <div className="glass-card rounded-xl p-5">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-800">نشاط الصحة خلال 30 يوم</h3>
            <button className="text-primary-600 hover:text-primary-800">
              المزيد
            </button>
          </div>
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
                  dataKey="تحصينات" 
                  stroke="#2ecc71" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="علاجات" 
                  stroke="#e74c3c" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
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
                placeholder="ابحث باسم الدواء، التحصين، أو الملاحظات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex gap-3">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="الكل">جميع الأنواع</option>
              {recordTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            
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
          </div>
        </div>

        {/* جدول السجلات الصحية */}
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  التاريخ
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  النوع
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  التفاصيل
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الدورة
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
                paginatedRecords.map((record) => {
                  const isUpcoming = record.nextDate && new Date(record.nextDate) > new Date();
                  
                  return (
                    <tr key={record.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary-100 rounded-lg">
                            <FiCalendar className="w-5 h-5 text-primary-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {new Date(record.date).toLocaleDateString('ar-EG')}
                            </h4>
                            {record.nextDate && (
                              <div className={`text-xs mt-1 ${isUpcoming ? 'text-yellow-600' : 'text-gray-500'}`}>
                                <FiCalendar className="inline ml-1" />
                                التالي: {new Date(record.nextDate).toLocaleDateString('ar-EG')}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-gray-100">
                            {getTypeIcon(record.type)}
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{record.type}</h4>
                            <p className="text-sm text-gray-500 mt-1">
                              {record.method}
                            </p>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {record.vaccineName || record.medicineName}
                            </h4>
                            {record.dosage && (
                              <p className="text-sm text-gray-500 mt-1">
                                الجرعة: {record.dosage}
                              </p>
                            )}
                          </div>
                          {record.notes && (
                            <p className="text-sm text-gray-600">
                              {record.notes.length > 50 ? record.notes.substring(0, 50) + '...' : record.notes}
                            </p>
                          )}
                          {record.cost > 0 && (
                            <div className="text-sm text-green-600">
                              التكلفة: {record.cost} ج.م
                            </div>
                          )}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div>
                          <h4 className="font-medium text-primary-600">
                            {getCycleName(record.cycleId)}
                          </h4>
                          {record.responsible && (
                            <p className="text-sm text-gray-500 mt-1">
                              <FiEye className="inline ml-1" />
                              {record.responsible}
                            </p>
                          )}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(record.status)}`}>
                            {record.status}
                          </span>
                          {isUpcoming && (
                            <div className="text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded">
                              ⏳ قادم خلال {Math.ceil((new Date(record.nextDate) - new Date()) / (1000 * 60 * 60 * 24))} يوم
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
                          {isUpcoming && (
                            <button
                              onClick={() => {
                                const newDate = new Date(record.nextDate);
                                newDate.setDate(newDate.getDate() + 1);
                                const updatedRecord = {
                                  ...record,
                                  date: newDate,
                                  status: 'مخطط'
                                };
                                const updatedRecords = healthRecords.map(r => 
                                  r.id === record.id ? updatedRecord : r
                                );
                                updateData('healthRecords', updatedRecords);
                                addNotification({
                                  type: 'info',
                                  title: 'تم التأجيل',
                                  message: 'تم تأجيل التحصين ليوم إضافي',
                                  time: new Date().toLocaleTimeString('ar-EG')
                                });
                              }}
                              className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors duration-200"
                              title="تأجيل ليوم"
                            >
                              <FiCalendar className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <div className="text-gray-500">
                      <MdLocalHospital className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p className="text-lg">لا توجد سجلات صحية</p>
                      <p className="text-sm mt-2">ابدأ بإضافة سجل صحي جديد</p>
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

      {/* مودال إضافة/تعديل سجل صحي */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">
                  {editingRecord ? 'تعديل السجل الصحي' : 'إضافة سجل صحي جديد'}
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
                  {/* معلومات أساسية */}
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
                            {cycle.name} ({cycle.houseNumber})
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        النوع *
                      </label>
                      <select
                        required
                        value={newRecord.type}
                        onChange={(e) => {
                          const type = e.target.value;
                          setNewRecord({
                            ...newRecord,
                            type,
                            vaccineName: type === 'تحصين' ? commonVaccines[0] : '',
                            medicineName: type === 'علاج' ? commonMedicines[0] : ''
                          });
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        {recordTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        المسئول
                      </label>
                      <input
                        type="text"
                        value={newRecord.responsible}
                        onChange={(e) => setNewRecord({...newRecord, responsible: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="اسم الطبيب أو المسئول"
                      />
                    </div>
                  </div>
                  
                  {/* التفاصيل */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-700 border-b pb-2">التفاصيل</h4>
                    
                    {newRecord.type === 'تحصين' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          اسم التحصين *
                        </label>
                        <select
                          required
                          value={newRecord.vaccineName}
                          onChange={(e) => setNewRecord({...newRecord, vaccineName: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                          <option value="">اختر التحصين</option>
                          {commonVaccines.map(vaccine => (
                            <option key={vaccine} value={vaccine}>{vaccine}</option>
                          ))}
                        </select>
                      </div>
                    )}
                    
                    {newRecord.type === 'علاج' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          اسم الدواء *
                        </label>
                        <select
                          required
                          value={newRecord.medicineName}
                          onChange={(e) => setNewRecord({...newRecord, medicineName: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                          <option value="">اختر الدواء</option>
                          {commonMedicines.map(medicine => (
                            <option key={medicine} value={medicine}>{medicine}</option>
                          ))}
                        </select>
                      </div>
                    )}
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        طريقة التطبيق
                      </label>
                      <select
                        value={newRecord.method}
                        onChange={(e) => setNewRecord({...newRecord, method: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        {vaccinationMethods.map(method => (
                          <option key={method} value={method}>{method}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        الجرعة/الكمية
                      </label>
                      <input
                        type="text"
                        value={newRecord.dosage}
                        onChange={(e) => setNewRecord({...newRecord, dosage: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="مثال: 1 مل/لتر، 100 جرام"
                      />
                    </div>
                  </div>
                  
                  {/* الإعدادات والتكاليف */}
                  <div className="space-y-4 md:col-span-2">
                    <h4 className="font-medium text-gray-700 border-b pb-2">الإعدادات والتكاليف</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          الحالة *
                        </label>
                        <select
                          required
                          value={newRecord.status}
                          onChange={(e) => setNewRecord({...newRecord, status: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                          {statuses.map(status => (
                            <option key={status} value={status}>{status}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          التاريخ التالي
                        </label>
                        <DatePicker
                          selected={newRecord.nextDate}
                          onChange={(date) => setNewRecord({...newRecord, nextDate: date})}
                          dateFormat="yyyy/MM/dd"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          isClearable
                          placeholderText="للتذكير بالجرعة التالية"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          التكلفة (ج.م)
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={newRecord.cost}
                          onChange={(e) => setNewRecord({...newRecord, cost: parseFloat(e.target.value) || 0})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        ملاحظات
                      </label>
                      <textarea
                        value={newRecord.notes}
                        onChange={(e) => setNewRecord({...newRecord, notes: e.target.value})}
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="أي ملاحظات إضافية عن الحالة، التفاعلات، أو التعليمات..."
                      />
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

export default HealthManagement;
