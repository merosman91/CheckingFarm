import React, { useState, useEffect } from 'react';
import {
  FiPlus, FiEdit, FiTrash2, FiFilter, FiDownload,
  FiPrinter, FiSearch, FiDollarSign, FiTrendingUp,
  FiTrendingDown, FiPieChart, FiBarChart2, FiCalendar,
  FiCreditCard, FiCheckCircle, FiAlertCircle
} from 'react-icons/fi';
import { MdAttachMoney, MdShowChart, MdLocalHospital } from 'react-icons/md';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const FinancialManagement = ({ data, updateData, addNotification }) => {
  const [financialRecords, setFinancialRecords] = useState(data.financialRecords || []);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('الكل');
  const [filterCategory, setFilterCategory] = useState('الكل');
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  const [newRecord, setNewRecord] = useState({
    date: new Date(),
    type: 'مصروف',
    category: 'أعلاف',
    amount: 0,
    description: '',
    cycleId: '',
    paymentMethod: 'نقدي',
    reference: '',
    paidTo: '',
    notes: '',
    status: 'مدفوع'
  });

  const recordTypes = ['مصروف', 'إيراد'];
  const categories = {
    'مصروف': ['أعلاف', 'أدوية', 'مرتبات', 'كهرباء', 'ماء', 'صيانة', 'نقل', 'أخرى'],
    'إيراد': ['بيع دواجن', 'بيع مخلفات', 'إعانات', 'أخرى']
  };
  const paymentMethods = ['نقدي', 'تحويل بنكي', 'شيك', 'آجل', 'أخرى'];
  const statuses = ['مدفوع', 'مستحق', 'ملغي', 'مؤجل'];
  const activeCycles = data.cycles?.filter(c => c.status === 'نشط') || [];

  useEffect(() => {
    setFinancialRecords(data.financialRecords || []);
    filterRecords();
  }, [data.financialRecords, searchTerm, filterType, filterCategory, dateRange]);

  const filterRecords = () => {
    let filtered = financialRecords.filter(record => {
      const matchesSearch = record.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          record.paidTo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          record.reference?.includes(searchTerm);
      const matchesType = filterType === 'الكل' || record.type === filterType;
      const matchesCategory = filterCategory === 'الكل' || record.category === filterCategory;
      
      const recordDate = new Date(record.date);
      const matchesDate = (!startDate || recordDate >= startDate) && 
                         (!endDate || recordDate <= endDate);
      
      return matchesSearch && matchesType && matchesCategory && matchesDate;
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
      date: newRecord.date.toISOString()
    };

    let updatedRecords;
    if (editingRecord) {
      updatedRecords = financialRecords.map(r => r.id === editingRecord.id ? updatedRecord : r);
      addNotification({
        type: 'success',
        title: 'تم التحديث',
        message: 'تم تحديث السجل المالي بنجاح',
        time: new Date().toLocaleTimeString('ar-EG')
      });
    } else {
      updatedRecords = [...financialRecords, updatedRecord];
      addNotification({
        type: 'success',
        title: 'تم الإضافة',
        message: 'تم إضافة سجل مالي جديد',
        time: new Date().toLocaleTimeString('ar-EG')
      });
    }

    updateData('financialRecords', updatedRecords);
    setShowModal(false);
    resetForm();
  };

  const resetForm = () => {
    setNewRecord({
      date: new Date(),
      type: 'مصروف',
      category: 'أعلاف',
      amount: 0,
      description: '',
      cycleId: '',
      paymentMethod: 'نقدي',
      reference: '',
      paidTo: '',
      notes: '',
      status: 'مدفوع'
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
    if (window.confirm('هل أنت متأكد من حذف هذا السجل المالي؟')) {
      const updatedRecords = financialRecords.filter(r => r.id !== id);
      updateData('financialRecords', updatedRecords);
      addNotification({
        type: 'warning',
        title: 'تم الحذف',
        message: 'تم حذف السجل المالي بنجاح',
        time: new Date().toLocaleTimeString('ar-EG')
      });
    }
  };

  const getCycleName = (cycleId) => {
    if (!cycleId) return '-';
    const cycle = data.cycles?.find(c => c.id === cycleId);
    return cycle ? cycle.name : 'غير معروف';
  };

  const getStatusBadge = (status) => {
    const badges = {
      'مدفوع': 'bg-green-100 text-green-800',
      'مستحق': 'bg-yellow-100 text-yellow-800',
      'ملغي': 'bg-red-100 text-red-800',
      'مؤجل': 'bg-blue-100 text-blue-800'
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  // حساب الإحصائيات المالية
  const calculateFinancialStats = () => {
    const totalIncome = financialRecords
      .filter(r => r.type === 'إيراد')
      .reduce((sum, r) => sum + (r.amount || 0), 0);
    
    const totalExpenses = financialRecords
      .filter(r => r.type === 'مصروف')
      .reduce((sum, r) => sum + (r.amount || 0), 0);
    
    const netProfit = totalIncome - totalExpenses;
    
    const pendingPayments = financialRecords
      .filter(r => r.status === 'مستحق')
      .reduce((sum, r) => sum + (r.amount || 0), 0);
    
    // تحليل المصروفات حسب الفئة
    const expensesByCategory = financialRecords
      .filter(r => r.type === 'مصروف')
      .reduce((acc, r) => {
        acc[r.category] = (acc[r.category] || 0) + (r.amount || 0);
        return acc;
      }, {});
    
    // الإيرادات حسب الفئة
    const incomeByCategory = financialRecords
      .filter(r => r.type === 'إيراد')
      .reduce((acc, r) => {
        acc[r.category] = (acc[r.category] || 0) + (r.amount || 0);
        return acc;
      }, {});

    return {
      totalIncome,
      totalExpenses,
      netProfit,
      pendingPayments,
      expensesByCategory,
      incomeByCategory,
      totalRecords: financialRecords.length
    };
  };

  // بيانات الرسوم البيانية
  const prepareMonthlyData = () => {
    const months = Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (5 - i));
      return date;
    });

    return months.map(month => {
      const monthRecords = financialRecords.filter(r => {
        const recordDate = new Date(r.date);
        return recordDate.getMonth() === month.getMonth() && 
               recordDate.getFullYear() === month.getFullYear();
      });
      
      const monthIncome = monthRecords
        .filter(r => r.type === 'إيراد')
        .reduce((sum, r) => sum + (r.amount || 0), 0);
      
      const monthExpenses = monthRecords
        .filter(r => r.type === 'مصروف')
        .reduce((sum, r) => sum + (r.amount || 0), 0);
      
      return {
        month: month.toLocaleDateString('ar-EG', { month: 'short' }),
        إيرادات: monthIncome,
        مصروفات: monthExpenses
      };
    });
  };

  const prepareCategoryData = () => {
    const stats = calculateFinancialStats();
    const expenseData = Object.entries(stats.expensesByCategory).map(([name, value]) => ({
      name,
      value
    }));
    
    const incomeData = Object.entries(stats.incomeByCategory).map(([name, value]) => ({
      name,
      value
    }));

    return { expenseData, incomeData };
  };

  const stats = calculateFinancialStats();
  const monthlyData = prepareMonthlyData();
  const { expenseData, incomeData } = prepareCategoryData();
  const paginatedRecords = filteredRecords.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );
  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FF6B6B'];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* رأس الصفحة */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-3">
            <FiDollarSign className="text-primary-600" />
            الإدارة المالية
          </h1>
          <p className="text-gray-600 mt-2">
            تتبع وتحليل الإيرادات والمصروفات المالية للمزرعة
          </p>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={() => {
              setShowModal(true);
              resetForm();
            }}
            className="btn btn-primary flex items-center gap-2"
          >
            <FiPlus /> معاملة جديدة
          </button>
          <button className="btn bg-white border border-gray-300 text-gray-700 flex items-center gap-2">
            <FiDownload /> تقرير مالي
          </button>
          <button className="btn bg-white border border-gray-300 text-gray-700 flex items-center gap-2">
            <FiPrinter /> طباعة
          </button>
        </div>
      </div>

      {/* إحصائيات مالية سريعة */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">إجمالي الإيرادات</p>
              <h3 className="text-2xl font-bold text-gray-800">
                {stats.totalIncome.toFixed(2)} ج.م
              </h3>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <FiTrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">إجمالي المصروفات</p>
              <h3 className="text-2xl font-bold text-gray-800">
                {stats.totalExpenses.toFixed(2)} ج.م
              </h3>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <FiTrendingDown className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
        
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">صافي الربح</p>
              <h3 className={`text-2xl font-bold ${stats.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stats.netProfit.toFixed(2)} ج.م
              </h3>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <MdAttachMoney className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">المستحقات</p>
              <h3 className="text-2xl font-bold text-yellow-600">
                {stats.pendingPayments.toFixed(2)} ج.م
              </h3>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <FiAlertCircle className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* تنبيهات المستحقات */}
      {stats.pendingPayments > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <FiAlertCircle className="text-yellow-500 text-xl mt-1" />
            <div className="flex-1">
              <h4 className="font-medium text-yellow-800">مستحقات معلقة</h4>
              <p className="text-yellow-600 text-sm mt-1">
                يوجد مستحقات بقيمة {stats.pendingPayments.toFixed(2)} ج.م تحتاج للمعالجة.
              </p>
            </div>
            <button
              onClick={() => {
                const pending = financialRecords.filter(r => r.status === 'مستحق');
                addNotification({
                  type: 'warning',
                  title: 'المستحقات المعلقة',
                  message: `يوجد ${pending.length} معاملة قيد الانتظار`,
                  time: new Date().toLocaleTimeString('ar-EG')
                });
              }}
              className="text-sm text-yellow-600 hover:text-yellow-800"
            >
              عرض التفاصيل
            </button>
          </div>
        </div>
      )}

      {/* الرسوم البيانية */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* الإيرادات والمصروفات الشهرية */}
        <div className="glass-card rounded-xl p-5">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-800">الإيرادات والمصروفات (6 أشهر)</h3>
            <button className="text-primary-600 hover:text-primary-800">
              المزيد
            </button>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value.toFixed(2)} ج.م`, 'القيمة']} />
                <Legend />
                <Bar dataKey="إيرادات" fill="#2ecc71" radius={[4, 4, 0, 0]} />
                <Bar dataKey="مصروفات" fill="#e74c3c" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* توزيع المصروفات */}
        <div className="glass-card rounded-xl p-5">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-800">توزيع المصروفات</h3>
            <button className="text-primary-600 hover:text-primary-800">
              التفاصيل
            </button>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenseData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {expenseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value.toFixed(2)} ج.م`, 'القيمة']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* أدوات البحث والتصفية */}
      <div className="glass-card rounded-xl p-5">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <FiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="ابحق بالوصف، المستلم، أو المرجع..."
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
              <option value="الكل">النوع</option>
              {recordTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="الكل">الفئة</option>
              {categories[filterType === 'الكل' ? 'مصروف' : filterType]?.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
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

        {/* جدول المعاملات المالية */}
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
                  المبلغ
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
                            {new Date(record.date).toLocaleDateString('ar-EG')}
                          </h4>
                          <p className="text-sm text-gray-500 mt-1">
                            {record.reference && `مرجع: ${record.reference}`}
                          </p>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${record.type === 'إيراد' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {record.type}
                        </div>
                        <div className="text-sm text-gray-500">
                          {record.category}
                        </div>
                        {record.cycleId && (
                          <div className="text-xs text-primary-600">
                            {getCycleName(record.cycleId)}
                          </div>
                        )}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-900">{record.description}</h4>
                        <div className="text-sm text-gray-500">
                          {record.paidTo && <div>لـ: {record.paidTo}</div>}
                          {record.paymentMethod && <div>طريقة: {record.paymentMethod}</div>}
                        </div>
                        {record.notes && (
                          <p className="text-sm text-gray-600">
                            {record.notes.length > 50 ? record.notes.substring(0, 50) + '...' : record.notes}
                          </p>
                        )}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className={`text-xl font-bold ${record.type === 'إيراد' ? 'text-green-600' : 'text-red-600'}`}>
                        {record.amount.toFixed(2)} ج.م
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {record.paymentMethod}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(record.status)}`}>
                          {record.status}
                        </span>
                        {record.status === 'مستحق' && (
                          <div className="text-xs text-yellow-600">
                            ⏳ مستحق الدفع
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
                        {record.status === 'مستحق' && (
                          <button
                            onClick={() => {
                              const updatedRecord = { ...record, status: 'مدفوع' };
                              const updatedRecords = financialRecords.map(r => 
                                r.id === record.id ? updatedRecord : r
                              );
                              updateData('financialRecords', updatedRecords);
                              addNotification({
                                type: 'success',
                                title: 'تم الدفع',
                                message: 'تم تسجيل المبلغ كمدفوع',
                                time: new Date().toLocaleTimeString('ar-EG')
                              });
                            }}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
                            title="تسديد"
                          >
                            <FiCheckCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <div className="text-gray-500">
                      <FiDollarSign className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p className="text-lg">لا توجد معاملات مالية</p>
                      <p className="text-sm mt-2">ابدأ بإضافة معاملة مالية جديدة</p>
                      <button
                        onClick={() => setShowModal(true)}
                        className="mt-4 btn btn-primary inline-flex items-center gap-2"
                      >
                        <FiPlus /> إضافة معاملة
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
              من <span className="font-medium">{filteredRecords.length}</span> معاملة
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

      {/* مودال إضافة/تعديل معاملة مالية */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">
                  {editingRecord ? 'تعديل المعاملة' : 'إضافة معاملة مالية جديدة'}
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
                            category: categories[type]?.[0] || ''
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
                        الفئة *
                      </label>
                      <select
                        required
                        value={newRecord.category}
                        onChange={(e) => setNewRecord({...newRecord, category: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        {categories[newRecord.type]?.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        المبلغ (ج.م) *
                      </label>
                      <input
                        type="number"
                        required
                        min="0"
                        step="0.01"
                        value={newRecord.amount}
                        onChange={(e) => setNewRecord({...newRecord, amount: parseFloat(e.target.value) || 0})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  {/* التفاصيل */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-700 border-b pb-2">التفاصيل</h4>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        الوصف *
                      </label>
                      <input
                        type="text"
                        required
                        value={newRecord.description}
                        onChange={(e) => setNewRecord({...newRecord, description: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="وصف مختصر للمعاملة"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        الدورة
                      </label>
                      <select
                        value={newRecord.cycleId}
                        onChange={(e) => setNewRecord({...newRecord, cycleId: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value="">عام (لجميع الدورات)</option>
                        {activeCycles.map(cycle => (
                          <option key={cycle.id} value={cycle.id}>
                            {cycle.name} ({cycle.houseNumber})
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        طريقة الدفع
                      </label>
                      <select
                        value={newRecord.paymentMethod}
                        onChange={(e) => setNewRecord({...newRecord, paymentMethod: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        {paymentMethods.map(method => (
                          <option key={method} value={method}>{method}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        المرجع/رقم الفاتورة
                      </label>
                      <input
                        type="text"
                        value={newRecord.reference}
                        onChange={(e) => setNewRecord({...newRecord, reference: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="اختياري"
                      />
                    </div>
                  </div>
                  
                  {/* معلومات إضافية */}
                  <div className="space-y-4 md:col-span-2">
                    <h4 className="font-medium text-gray-700 border-b pb-2">معلومات إضافية</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          المستلم/المرسل إليه
                        </label>
                        <input
                          type="text"
                          value={newRecord.paidTo}
                          onChange={(e) => setNewRecord({...newRecord, paidTo: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="اسم الشخص أو الشركة"
                        />
                      </div>
                      
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
                        placeholder="أي ملاحظات إضافية عن المعاملة..."
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
                    <FiPlus /> {editingRecord ? 'تحديث المعاملة' : 'إضافة المعاملة'}
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

export default FinancialManagement;
