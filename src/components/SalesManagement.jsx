import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  FiPlus, FiEdit, FiTrash2, FiFilter, FiDownload,
  FiPrinter, FiSearch, FiShoppingCart, FiTrendingUp,
  FiTrendingDown, FiPackage, FiCalendar, FiDollarSign,
  FiUser, FiCheckCircle, FiAlertCircle, FiBarChart2,
  FiRefreshCw, FiEye, FiX
} from 'react-icons/fi';
import { MdPoultry, MdAttachMoney, MdShowChart } from 'react-icons/md';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const SalesManagement = ({ data, updateData, addNotification }) => {
  const [sales, setSales] = useState(data.sales || []);
  const [filteredSales, setFilteredSales] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingSale, setEditingSale] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('الكل');
  const [filterStatus, setFilterStatus] = useState('الكل');
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [currentPage, setCurrentPage] = useState(1);
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
  const salesPerPage = 10;

  const [newSale, setNewSale] = useState({
    date: new Date(),
    type: 'دواجن حية',
    customerName: '',
    customerPhone: '',
    customerAddress: '',
    items: [],
    totalWeight: 0,
    unitPrice: 0,
    totalAmount: 0,
    paidAmount: 0,
    paymentMethod: 'نقدي',
    paymentStatus: 'مدفوع',
    deliveryMethod: 'تسليم في المزرعة',
    notes: '',
    invoiceNumber: generateInvoiceNumber()
  });

  const saleTypes = ['دواجن حية', 'دواجن مجمدة', 'مخلفات', 'بيض', 'أخرى'];
  const paymentMethods = ['نقدي', 'تحويل بنكي', 'شيك', 'آجل', 'أخرى'];
  const paymentStatuses = ['مدفوع', 'جزئي', 'مستحق', 'ملغي'];
  const deliveryMethods = ['تسليم في المزرعة', 'شحن', 'توصيل', 'استلام'];
  const activeCycles = data.cycles?.filter(c => c.status === 'نشط') || [];

  // توليد رقم فاتورة محسن
  function generateInvoiceNumber() {
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0].replace(/-/g, '');
    const salesToday = data.sales?.filter(s => {
      if (!s.createdAt) return false;
      const saleDate = new Date(s.createdAt);
      return saleDate.toISOString().split('T')[0] === today.toISOString().split('T')[0];
    }).length || 0;
    
    const sequential = (salesToday + 1).toString().padStart(3, '0');
    return `INV-${dateStr}-${sequential}`;
  }

  useEffect(() => {
    setSales(data.sales || []);
    filterSales();
  }, [data.sales, searchTerm, filterType, filterStatus, dateRange]);

  const filterSales = useCallback(() => {
    let filtered = sales.filter(sale => {
      const matchesSearch = 
        sale.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sale.invoiceNumber?.includes(searchTerm) ||
        sale.customerPhone?.includes(searchTerm);
      const matchesType = filterType === 'الكل' || sale.type === filterType;
      const matchesStatus = filterStatus === 'الكل' || sale.paymentStatus === filterStatus;
      
      const saleDate = new Date(sale.date);
      const matchesDate = (!startDate || saleDate >= startDate) && 
                         (!endDate || saleDate <= endDate);
      
      return matchesSearch && matchesType && matchesStatus && matchesDate;
    });

    // الترتيب من الأحدث إلى الأقدم
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    setFilteredSales(filtered);
    setCurrentPage(1); // العودة للصفحة الأولى عند التصفية
  }, [sales, searchTerm, filterType, filterStatus, startDate, endDate]);

  const validateForm = () => {
    if (newSale.totalWeight <= 0) {
      addNotification({
        type: 'error',
        title: 'خطأ في الوزن',
        message: 'الوزن يجب أن يكون أكبر من صفر',
        time: new Date().toLocaleTimeString('ar-EG')
      });
      return false;
    }
    if (newSale.unitPrice <= 0) {
      addNotification({
        type: 'error',
        title: 'خطأ في السعر',
        message: 'سعر الكيلو يجب أن يكون أكبر من صفر',
        time: new Date().toLocaleTimeString('ar-EG')
      });
      return false;
    }
    if (newSale.paidAmount > newSale.totalAmount) {
      addNotification({
        type: 'error',
        title: 'خطأ في المبلغ',
        message: 'المبلغ المدفوع لا يمكن أن يكون أكبر من الإجمالي',
        time: new Date().toLocaleTimeString('ar-EG')
      });
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // حساب الإجمالي إذا لم يكن محسوباً
    if (newSale.totalAmount === 0 && newSale.totalWeight > 0 && newSale.unitPrice > 0) {
      newSale.totalAmount = newSale.totalWeight * newSale.unitPrice;
    }

    const updatedSale = {
      ...newSale,
      id: editingSale ? editingSale.id : Date.now(),
      createdAt: editingSale ? editingSale.createdAt : new Date().toISOString(),
      date: newSale.date.toISOString(),
      remainingAmount: newSale.totalAmount - newSale.paidAmount,
      updatedAt: new Date().toISOString()
    };

    let updatedSales;
    if (editingSale) {
      updatedSales = sales.map(s => s.id === editingSale.id ? updatedSale : s);
      addNotification({
        type: 'success',
        title: 'تم التحديث',
        message: `تم تحديث فاتورة ${updatedSale.invoiceNumber}`,
        time: new Date().toLocaleTimeString('ar-EG')
      });
    } else {
      updatedSales = [...sales, updatedSale];
      addNotification({
        type: 'success',
        title: 'تم الإضافة',
        message: `تم إضافة عملية بيع جديدة برقم ${updatedSale.invoiceNumber}`,
        time: new Date().toLocaleTimeString('ar-EG')
      });
    }

    updateData('sales', updatedSales);
    setShowModal(false);
    resetForm();
  };

  const resetForm = () => {
    setNewSale({
      date: new Date(),
      type: 'دواجن حية',
      customerName: '',
      customerPhone: '',
      customerAddress: '',
      items: [],
      totalWeight: 0,
      unitPrice: 0,
      totalAmount: 0,
      paidAmount: 0,
      paymentMethod: 'نقدي',
      paymentStatus: 'مدفوع',
      deliveryMethod: 'تسليم في المزرعة',
      notes: '',
      invoiceNumber: generateInvoiceNumber()
    });
    setEditingSale(null);
  };

  const handleEdit = (sale) => {
    setEditingSale(sale);
    setNewSale({
      ...sale,
      date: new Date(sale.date),
      items: sale.items || []
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    const saleToDelete = sales.find(s => s.id === id);
    if (window.confirm(`هل أنت متأكد من حذف فاتورة ${saleToDelete?.invoiceNumber}؟`)) {
      const updatedSales = sales.filter(s => s.id !== id);
      updateData('sales', updatedSales);
      addNotification({
        type: 'warning',
        title: 'تم الحذف',
        message: 'تم حذف عملية البيع بنجاح',
        time: new Date().toLocaleTimeString('ar-EG')
      });
    }
  };

  const handleCancelInvoice = (sale) => {
    if (window.confirm(`هل أنت متأكد من إلغاء فاتورة ${sale.invoiceNumber}؟`)) {
      const updatedSale = {
        ...sale,
        paymentStatus: 'ملغي',
        cancelledAt: new Date().toISOString(),
        cancelledBy: 'المستخدم'
      };
      
      const updatedSales = sales.map(s => s.id === sale.id ? updatedSale : s);
      updateData('sales', updatedSales);
      
      addNotification({
        type: 'warning',
        title: 'تم الإلغاء',
        message: `تم إلغاء فاتورة ${sale.invoiceNumber}`,
        time: new Date().toLocaleTimeString('ar-EG')
      });
    }
  };

  const handleReceivePayment = (sale) => {
    const maxAmount = sale.remainingAmount || (sale.totalAmount - sale.paidAmount);
    const amount = prompt(
      `أدخل المبلغ المستلم لفاتورة ${sale.invoiceNumber} (الحد الأقصى: ${maxAmount} ج.م):`,
      maxAmount.toString()
    );
    
    if (amount && !isNaN(amount)) {
      const receivedAmount = parseFloat(amount);
      if (receivedAmount <= 0) {
        addNotification({
          type: 'error',
          title: 'خطأ',
          message: 'المبلغ يجب أن يكون أكبر من صفر',
          time: new Date().toLocaleTimeString('ar-EG')
        });
        return;
      }
      
      if (receivedAmount > maxAmount) {
        addNotification({
          type: 'error',
          title: 'خطأ',
          message: 'المبلغ المستلم أكبر من المبلغ المتبقي',
          time: new Date().toLocaleTimeString('ar-EG')
        });
        return;
      }
      
      const updatedSale = {
        ...sale,
        paidAmount: sale.paidAmount + receivedAmount,
        paymentStatus: (sale.paidAmount + receivedAmount) >= sale.totalAmount ? 'مدفوع' : 'جزئي',
        lastPaymentDate: new Date().toISOString()
      };
      
      const updatedSales = sales.map(s => s.id === sale.id ? updatedSale : s);
      updateData('sales', updatedSales);
      
      addNotification({
        type: 'success',
        title: 'تم الاستلام',
        message: `تم استلام مبلغ ${receivedAmount.toFixed(2)} ج.م للفاتورة ${sale.invoiceNumber}`,
        time: new Date().toLocaleTimeString('ar-EG')
      });
    }
  };

  const handleExport = () => {
    try {
      const csvContent = [
        ['رقم الفاتورة', 'التاريخ', 'اسم العميل', 'هاتف العميل', 'نوع البيع', 'الوزن (كجم)', 'سعر الكيلو', 'الإجمالي', 'المدفوع', 'المتبقي', 'طريقة الدفع', 'حالة الدفع', 'طريقة التوصيل'],
        ...filteredSales.map(sale => [
          sale.invoiceNumber,
          new Date(sale.date).toLocaleDateString('ar-EG'),
          sale.customerName || 'عميل نقدي',
          sale.customerPhone || '',
          sale.type,
          sale.totalWeight,
          sale.unitPrice,
          sale.totalAmount.toFixed(2),
          sale.paidAmount.toFixed(2),
          (sale.totalAmount - sale.paidAmount).toFixed(2),
          sale.paymentMethod,
          sale.paymentStatus,
          sale.deliveryMethod
        ])
      ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

      const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `مبيعات_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      addNotification({
        type: 'success',
        title: 'تم التصدير',
        message: `تم تصدير ${filteredSales.length} عملية بيع`,
        time: new Date().toLocaleTimeString('ar-EG')
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'خطأ في التصدير',
        message: 'حدث خطأ أثناء تصدير البيانات',
        time: new Date().toLocaleTimeString('ar-EG')
      });
    }
  };

  const handlePrint = () => {
    window.print();
    addNotification({
      type: 'info',
      title: 'الطباعة',
      message: 'جاري تحضير الصفحة للطباعة',
      time: new Date().toLocaleTimeString('ar-EG')
    });
  };

  const getStatusBadge = (status) => {
    const badges = {
      'مدفوع': 'bg-green-100 text-green-800 border border-green-200',
      'جزئي': 'bg-yellow-100 text-yellow-800 border border-yellow-200',
      'مستحق': 'bg-red-100 text-red-800 border border-red-200',
      'ملغي': 'bg-gray-100 text-gray-800 border border-gray-200'
    };
    return badges[status] || 'bg-gray-100 text-gray-800 border border-gray-200';
  };

  const getTypeBadge = (type) => {
    const badges = {
      'دواجن حية': 'bg-blue-100 text-blue-800 border border-blue-200',
      'دواجن مجمدة': 'bg-purple-100 text-purple-800 border border-purple-200',
      'مخلفات': 'bg-green-100 text-green-800 border border-green-200',
      'بيض': 'bg-yellow-100 text-yellow-800 border border-yellow-200',
      'أخرى': 'bg-gray-100 text-gray-800 border border-gray-200'
    };
    return badges[type] || 'bg-gray-100 text-gray-800 border border-gray-200';
  };

  // حساب إحصائيات المبيعات
  const calculateSalesStats = useMemo(() => {
    const totalSales = sales.reduce((sum, s) => sum + (s.paymentStatus !== 'ملغي' ? s.totalAmount : 0), 0);
    const totalReceived = sales.reduce((sum, s) => sum + (s.paymentStatus !== 'ملغي' ? s.paidAmount : 0), 0);
    const pendingAmount = totalSales - totalReceived;
    
    const today = new Date().toISOString().split('T')[0];
    const todaySales = sales
      .filter(s => s.date.startsWith(today) && s.paymentStatus !== 'ملغي')
      .reduce((sum, s) => sum + s.totalAmount, 0);
    
    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();
    const monthlySales = sales
      .filter(s => {
        const saleDate = new Date(s.date);
        return saleDate.getMonth() === thisMonth && 
               saleDate.getFullYear() === thisYear &&
               s.paymentStatus !== 'ملغي';
      })
      .reduce((sum, s) => sum + s.totalAmount, 0);

    const activeSales = sales.filter(s => s.paymentStatus !== 'ملغي').length;

    return {
      totalSales: totalSales.toFixed(2),
      totalReceived: totalReceived.toFixed(2),
      pendingAmount: pendingAmount.toFixed(2),
      todaySales: todaySales.toFixed(2),
      monthlySales: monthlySales.toFixed(2),
      totalTransactions: activeSales,
      cancelledTransactions: sales.filter(s => s.paymentStatus === 'ملغي').length
    };
  }, [sales]);

  // بيانات الرسوم البيانية
  const prepareChartData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date;
    });

    return last7Days.map(date => {
      const daySales = sales.filter(s => {
        const saleDate = new Date(s.date);
        return saleDate.toDateString() === date.toDateString() && s.paymentStatus !== 'ملغي';
      });
      
      const dayAmount = daySales.reduce((sum, s) => sum + s.totalAmount, 0);
      const dayWeight = daySales.reduce((sum, s) => sum + s.totalWeight, 0);
      const dayCount = daySales.length;
      
      return {
        day: date.toLocaleDateString('ar-EG', { weekday: 'short' }),
        date: date.toLocaleDateString('ar-EG'),
        المبلغ: dayAmount,
        الوزن: dayWeight / 100, // تحويل للطن
        العمليات: dayCount
      };
    });
  }, [sales]);

  // تحليل المبيعات حسب النوع
  const prepareTypeData = useMemo(() => {
    const typeData = {};
    sales.forEach(sale => {
      if (sale.paymentStatus !== 'ملغي') {
        typeData[sale.type] = (typeData[sale.type] || 0) + sale.totalAmount;
      }
    });
    
    return Object.entries(typeData).map(([name, value]) => ({
      name,
      value: parseFloat(value.toFixed(2))
    }));
  }, [sales]);

  // تحليل المبيعات حسب حالة الدفع
  const preparePaymentStatusData = useMemo(() => {
    const statusData = {};
    sales.forEach(sale => {
      statusData[sale.paymentStatus] = (statusData[sale.paymentStatus] || 0) + 1;
    });
    
    return Object.entries(statusData).map(([name, value]) => ({
      name,
      value
    }));
  }, [sales]);

  const stats = calculateSalesStats;
  const chartData = prepareChartData;
  const typeData = prepareTypeData;
  const paymentStatusData = preparePaymentStatusData;
  
  const paginatedSales = filteredSales.slice(
    (currentPage - 1) * salesPerPage,
    currentPage * salesPerPage
  );
  const totalPages = Math.ceil(filteredSales.length / salesPerPage);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];
  const STATUS_COLORS = ['#10B981', '#F59E0B', '#EF4444', '#6B7280'];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* رأس الصفحة */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-3">
            <FiShoppingCart className="text-primary-600" />
            إدارة المبيعات
          </h1>
          <p className="text-gray-600 mt-2">
            إدارة وتسجيل مبيعات الدواجن والمخلفات - إجمالي {stats.totalTransactions} عملية بيع
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
            <FiPlus /> عملية بيع جديدة
          </button>
          <button 
            onClick={handleExport}
            className="btn bg-white border border-gray-300 text-gray-700 flex items-center gap-2 hover:bg-gray-50"
          >
            <FiDownload /> تصدير
          </button>
          <button 
            onClick={handlePrint}
            className="btn bg-white border border-gray-300 text-gray-700 flex items-center gap-2 hover:bg-gray-50"
          >
            <FiPrinter /> طباعة
          </button>
        </div>
      </div>

      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="glass-card rounded-xl p-4 hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">إجمالي المبيعات</p>
              <h3 className="text-2xl font-bold text-gray-800">
                {stats.totalSales} ج.م
              </h3>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <FiTrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            {stats.totalTransactions} عملية
          </div>
        </div>
        
        <div className="glass-card rounded-xl p-4 hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">المستلم</p>
              <h3 className="text-2xl font-bold text-gray-800">
                {stats.totalReceived} ج.م
              </h3>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <FiDollarSign className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            مدفوع بالكامل
          </div>
        </div>
        
        <div className="glass-card rounded-xl p-4 hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">المستحق</p>
              <h3 className="text-2xl font-bold text-red-600">
                {stats.pendingAmount} ج.م
              </h3>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <FiAlertCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <div className="mt-2 text-xs text-red-500">
            قيد التحصيل
          </div>
        </div>
        
        <div className="glass-card rounded-xl p-4 hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">مبيعات اليوم</p>
              <h3 className="text-2xl font-bold text-gray-800">
                {stats.todaySales} ج.م
              </h3>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <FiShoppingCart className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            اليوم
          </div>
        </div>
        
        <div className="glass-card rounded-xl p-4 hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">مبيعات الشهر</p>
              <h3 className="text-2xl font-bold text-gray-800">
                {stats.monthlySales} ج.م
              </h3>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <MdShowChart className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            هذا الشهر
          </div>
        </div>
      </div>

      {/* تنبيهات المبالغ المستحقة */}
      {parseFloat(stats.pendingAmount) > 0 && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <FiAlertCircle className="text-yellow-500 text-xl mt-1 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="font-medium text-yellow-800">تنبيه: مستحقات معلقة</h4>
              <p className="text-yellow-600 text-sm mt-1">
                يوجد مبالغ مستحقة بقيمة {stats.pendingAmount} ج.م تحتاج للتحصيل.
                هناك {sales.filter(s => s.paymentStatus === 'مستحق').length} فاتورة مستحقة الدفع.
              </p>
            </div>
            <button
              onClick={() => {
                const pendingSales = sales.filter(s => s.paymentStatus !== 'مدفوع' && s.paymentStatus !== 'ملغي');
                addNotification({
                  type: 'warning',
                  title: 'المستحقات المعلقة',
                  message: `يوجد ${pendingSales.length} فاتورة قيد التحصيل`,
                  time: new Date().toLocaleTimeString('ar-EG')
                });
              }}
              className="text-sm bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-3 py-1 rounded-lg transition-colors duration-200"
            >
              عرض التفاصيل
            </button>
          </div>
        </div>
      )}

      {/* الرسوم البيانية */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* المبيعات اليومية */}
        <div className="glass-card rounded-xl p-5 lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-800">المبيعات خلال 7 أيام</h3>
              <p className="text-sm text-gray-500 mt-1">تتبع أداء المبيعات اليومي</p>
            </div>
            <button 
              onClick={() => {
                addNotification({
                  type: 'info',
                  title: 'تفاصيل الرسم البياني',
                  message: 'عرض رسم بياني تفصيلي للمبيعات',
                  time: new Date().toLocaleTimeString('ar-EG')
                });
              }}
              className="text-primary-600 hover:text-primary-800 text-sm font-medium"
            >
              عرض التقرير الكامل
            </button>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="day" 
                  tick={{ fill: '#6B7280' }}
                />
                <YAxis 
                  tick={{ fill: '#6B7280' }}
                  tickFormatter={(value) => `${value.toLocaleString('ar-EG')}`}
                />
                <Tooltip 
                  formatter={(value, name) => {
                    if (name === 'المبلغ') return [`${value.toFixed(2)} ج.م`, 'القيمة'];
                    if (name === 'الوزن') return [`${value.toFixed(1)} طن`, 'الوزن'];
                    return [value, name];
                  }}
                  labelFormatter={(label) => `اليوم: ${label}`}
                  contentStyle={{ 
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="المبلغ" 
                  name="قيمة المبيعات"
                  stroke="#2ecc71" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6, strokeWidth: 2 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="الوزن" 
                  name="الوزن المباع (طن)"
                  stroke="#3498db" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  strokeDasharray="5 5"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
            <div className="text-center p-2 bg-green-50 rounded-lg">
              <div className="font-medium text-green-700">أعلى مبيعات</div>
              <div className="text-green-600">
                {Math.max(...chartData.map(d => d.المبلغ)).toFixed(2)} ج.م
              </div>
            </div>
            <div className="text-center p-2 bg-blue-50 rounded-lg">
              <div className="font-medium text-blue-700">متوسط يومي</div>
              <div className="text-blue-600">
                {(chartData.reduce((sum, d) => sum + d.المبلغ, 0) / chartData.length).toFixed(2)} ج.م
              </div>
            </div>
          </div>
        </div>

        {/* توزيع المبيعات حسب النوع */}
        <div className="glass-card rounded-xl p-5">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-800">توزيع المبيعات</h3>
              <p className="text-sm text-gray-500 mt-1">حسب نوع المنتج</p>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setShowAdvancedFilter(!showAdvancedFilter)}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <FiFilter className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={typeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => 
                    typeData.length > 3 ? `${name}: ${(percent * 100).toFixed(0)}%` : `${name}`
                  }
                  outerRadius={70}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {typeData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]} 
                      stroke="#fff"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${value.toFixed(2)} ج.م`, 'القيمة']}
                  contentStyle={{ 
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb'
                  }}
                />
                <Legend 
                  layout="vertical"
                  verticalAlign="middle"
                  align="right"
                  wrapperStyle={{ paddingLeft: '20px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {typeData.length === 0 && (
            <div className="text-center py-4 text-gray-500">
              <FiBarChart2 className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p>لا توجد بيانات للعرض</p>
            </div>
          )}
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
                placeholder="ابحث باسم العميل، رقم الفاتورة، أو الهاتف..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-10 pl-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>
          
          <div className="flex gap-3 flex-wrap">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white min-w-[150px]"
            >
              <option value="الكل">جميع الأنواع</option>
              {saleTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white min-w-[150px]"
            >
              <option value="الكل">جميع الحالات</option>
              {paymentStatuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
            
            <div className="min-w-[200px]">
              <DatePicker
                selectsRange={true}
                startDate={startDate}
                endDate={endDate}
                onChange={(update) => setDateRange(update)}
                isClearable={true}
                placeholderText="نطاق التاريخ"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-right"
                dateFormat="yyyy/MM/dd"
                locale="ar"
              />
            </div>
            
            <button 
              onClick={() => {
                setSearchTerm('');
                setFilterType('الكل');
                setFilterStatus('الكل');
                setDateRange([null, null]);
                addNotification({
                  type: 'info',
                  title: 'تمت إعادة التعيين',
                  message: 'تم مسح جميع عوامل التصفية',
                  time: new Date().toLocaleTimeString('ar-EG')
                });
              }}
              className="btn bg-white border border-gray-300 text-gray-700 flex items-center gap-2 hover:bg-gray-50"
            >
              <FiRefreshCw /> إعادة تعيين
            </button>
          </div>
        </div>

        {/* مؤشرات التصفية النشطة */}
        {(searchTerm || filterType !== 'الكل' || filterStatus !== 'الكل' || startDate || endDate) && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <FiFilter className="text-gray-500" />
              <span className="text-sm font-medium text-gray-700">التصفيات النشطة:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {searchTerm && (
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full flex items-center gap-1">
                  بحث: {searchTerm}
                  <button onClick={() => setSearchTerm('')} className="text-blue-600 hover:text-blue-800">
                    <FiX className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filterType !== 'الكل' && (
                <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full flex items-center gap-1">
                  نوع: {filterType}
                  <button onClick={() => setFilterType('الكل')} className="text-green-600 hover:text-green-800">
                    <FiX className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filterStatus !== 'الكل' && (
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full flex items-center gap-1">
                  حالة: {filterStatus}
                  <button onClick={() => setFilterStatus('الكل')} className="text-yellow-600 hover:text-yellow-800">
                    <FiX className="w-3 h-3" />
                  </button>
                </span>
              )}
              {startDate && endDate && (
                <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full flex items-center gap-1">
                  تاريخ: {startDate.toLocaleDateString('ar-EG')} - {endDate.toLocaleDateString('ar-EG')}
                  <button onClick={() => setDateRange([null, null])} className="text-purple-600 hover:text-purple-800">
                    <FiX className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
          </div>
        )}

        {/* جدول المبيعات */}
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الفاتورة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  العميل
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
              {paginatedSales.length > 0 ? (
                paginatedSales.map((sale) => (
                  <tr 
                    key={sale.id} 
                    className={`hover:bg-gray-50 transition-colors duration-150 ${
                      sale.paymentStatus === 'ملغي' ? 'opacity-60' : ''
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          sale.paymentStatus === 'ملغي' ? 'bg-gray-100' : 'bg-primary-100'
                        }`}>
                          <FiShoppingCart className={`w-5 h-5 ${
                            sale.paymentStatus === 'ملغي' ? 'text-gray-400' : 'text-primary-600'
                          }`} />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{sale.invoiceNumber}</h4>
                          <p className="text-sm text-gray-500 mt-1">
                            <FiCalendar className="inline w-3 h-3 mr-1" />
                            {new Date(sale.date).toLocaleDateString('ar-EG', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                          <span className={`text-xs px-2 py-1 rounded-full mt-1 inline-block ${getTypeBadge(sale.type)}`}>
                            {sale.type}
                          </span>
                          {sale.cancelledAt && (
                            <div className="text-xs text-red-500 mt-1">
                              ملغاة في {new Date(sale.cancelledAt).toLocaleDateString('ar-EG')}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {sale.customerName || 'عميل نقدي'}
                          {sale.customerName && <FiUser className="inline w-3 h-3 mr-1 text-gray-400" />}
                        </h4>
                        <div className="text-sm text-gray-500 mt-1 space-y-1">
                          {sale.customerPhone && (
                            <div className="flex items-center gap-1">
                              <span>📱</span>
                              <span>{sale.customerPhone}</span>
                            </div>
                          )}
                          {sale.deliveryMethod && (
                            <div className="flex items-center gap-1">
                              <span>🚚</span>
                              <span>{sale.deliveryMethod}</span>
                            </div>
                          )}
                          {sale.customerAddress && (
                            <div className="text-xs text-gray-400 mt-1">
                              {sale.customerAddress.substring(0, 30)}...
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">الوزن:</span>
                          <span className="font-medium">{sale.totalWeight.toFixed(1)} كجم</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">سعر الكيلو:</span>
                          <span className="font-medium">{sale.unitPrice.toFixed(2)} ج.م</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">طريقة الدفع:</span>
                          <span className="font-medium">{sale.paymentMethod}</span>
                        </div>
                        {sale.notes && (
                          <div className="mt-2 pt-2 border-t border-gray-100">
                            <p className="text-sm text-gray-600">
                              <span className="text-gray-400">📝 </span>
                              {sale.notes.length > 40 ? sale.notes.substring(0, 40) + '...' : sale.notes}
                            </p>
                          </div>
                        )}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <div className="text-xl font-bold text-green-600">
                          {sale.totalAmount.toFixed(2)} ج.م
                        </div>
                        <div className="text-sm text-gray-500">
                          <span className="font-medium">مدفوع:</span> {sale.paidAmount.toFixed(2)} ج.م
                        </div>
                        {sale.remainingAmount > 0 && (
                          <div className="text-sm text-red-600">
                            <span className="font-medium">مستحق:</span> {sale.remainingAmount.toFixed(2)} ج.م
                          </div>
                        )}
                        <div className="text-xs text-gray-400 mt-1">
                          {sale.paymentMethod === 'نقدي' ? '💵 نقدي' : 
                           sale.paymentMethod === 'تحويل بنكي' ? '🏦 تحويل' :
                           sale.paymentMethod === 'شيك' ? '📋 شيك' : '⏳ آجل'}
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${getStatusBadge(sale.paymentStatus)}`}>
                          {sale.paymentStatus === 'مدفوع' && '✅ '}
                          {sale.paymentStatus === 'جزئي' && '⚠️ '}
                          {sale.paymentStatus === 'مستحق' && '❌ '}
                          {sale.paymentStatus === 'ملغي' && '🚫 '}
                          {sale.paymentStatus}
                        </span>
                        {sale.paymentStatus !== 'مدفوع' && sale.paymentStatus !== 'ملغي' && (
                          <div className="text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded">
                            ⏳ قيد التحصيل
                          </div>
                        )}
                        {sale.lastPaymentDate && sale.paymentStatus === 'جزئي' && (
                          <div className="text-xs text-gray-400 mt-1">
                            آخر دفعة: {new Date(sale.lastPaymentDate).toLocaleDateString('ar-EG')}
                          </div>
                        )}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        {sale.paymentStatus !== 'مدفوع' && sale.paymentStatus !== 'ملغي' && (
                          <button
                            onClick={() => handleReceivePayment(sale)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200 tooltip"
                            title="استلام دفعة"
                            disabled={sale.paymentStatus === 'ملغي'}
                          >
                            <FiDollarSign className="w-4 h-4" />
                          </button>
                        )}
                        
                        <button
                          onClick={() => handleEdit(sale)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200 tooltip"
                          title="تعديل"
                          disabled={sale.paymentStatus === 'ملغي'}
                        >
                          <FiEdit className="w-4 h-4" />
                        </button>
                        
                        {sale.paymentStatus !== 'ملغي' ? (
                          <button
                            onClick={() => handleCancelInvoice(sale)}
                            className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors duration-200 tooltip"
                            title="إلغاء الفاتورة"
                          >
                            <FiX className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleDelete(sale.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 tooltip"
                            title="حذف نهائي"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        )}
                        
                        <button
                          onClick={() => {
                            addNotification({
                              type: 'info',
                              title: 'عرض الفاتورة',
                              message: `جاري تحضير فاتورة ${sale.invoiceNumber} للعرض`,
                              time: new Date().toLocaleTimeString('ar-EG')
                            });
                          }}
                          className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors duration-200 tooltip"
                          title="عرض الفاتورة"
                        >
                          <FiEye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <div className="text-gray-500">
                      <FiShoppingCart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                      <p className="text-lg font-medium">لا توجد عمليات بيع</p>
                      <p className="text-sm mt-2">ابدأ بإضافة عملية بيع جديدة أو قم بتعديل عوامل التصفية</p>
                      <div className="mt-6 space-x-3">
                        <button
                          onClick={() => setShowModal(true)}
                          className="btn btn-primary inline-flex items-center gap-2"
                        >
                          <FiPlus /> إضافة عملية بيع
                        </button>
                        <button
                          onClick={() => {
                            setSearchTerm('');
                            setFilterType('الكل');
                            setFilterStatus('الكل');
                            setDateRange([null, null]);
                          }}
                          className="btn bg-white border border-gray-300 text-gray-700 inline-flex items-center gap-2"
                        >
                          <FiRefreshCw /> مسح التصفيات
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* الترقيم الصفحي */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
            <div className="text-sm text-gray-700">
              عرض <span className="font-medium">{(currentPage - 1) * salesPerPage + 1}</span> إلى{' '}
              <span className="font-medium">
                {Math.min(currentPage * salesPerPage, filteredSales.length)}
              </span>{' '}
              من <span className="font-medium">{filteredSales.length}</span> عملية بيع
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors duration-200 flex items-center gap-1"
              >
                <span>←</span> السابق
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
                    className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors duration-200 ${
                      currentPage === pageNum 
                        ? 'bg-primary-600 text-white shadow-sm' 
                        : 'border border-gray-300 hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors duration-200 flex items-center gap-1"
              >
                التالي <span>→</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* مودال إضافة/تعديل عملية بيع */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 z-10">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">
                    {editingSale ? 'تعديل عملية البيع' : 'إضافة عملية بيع جديدة'}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {editingSale ? `تعديل فاتورة ${editingSale.invoiceNumber}` : 'أدخل تفاصيل عملية البيع الجديدة'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* معلومات الفاتورة */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-700 border-b pb-2 text-lg flex items-center gap-2">
                    <FiShoppingCart className="text-primary-600" />
                    معلومات الفاتورة
                  </h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      رقم الفاتورة
                    </label>
                    <input
                      type="text"
                      value={newSale.invoiceNumber}
                      readOnly
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      التاريخ *
                    </label>
                    <DatePicker
                      selected={newSale.date}
                      onChange={(date) => setNewSale({...newSale, date})}
                      dateFormat="yyyy/MM/dd"
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      نوع البيع *
                    </label>
                    <select
                      required
                      value={newSale.type}
                      onChange={(e) => setNewSale({...newSale, type: e.target.value})}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      {saleTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      طريقة التوصيل
                    </label>
                    <select
                      value={newSale.deliveryMethod}
                      onChange={(e) => setNewSale({...newSale, deliveryMethod: e.target.value})}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      {deliveryMethods.map(method => (
                        <option key={method} value={method}>{method}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                {/* معلومات العميل */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-700 border-b pb-2 text-lg flex items-center gap-2">
                    <FiUser className="text-primary-600" />
                    معلومات العميل
                  </h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      اسم العميل
                    </label>
                    <input
                      type="text"
                      value={newSale.customerName}
                      onChange={(e) => setNewSale({...newSale, customerName: e.target.value})}
                      placeholder="أدخل اسم العميل"
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      رقم الهاتف
                    </label>
                    <input
                      type="tel"
                      value={newSale.customerPhone}
                      onChange={(e) => setNewSale({...newSale, customerPhone: e.target.value})}
                      placeholder="رقم الهاتف"
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      العنوان
                    </label>
                    <textarea
                      value={newSale.customerAddress}
                      onChange={(e) => setNewSale({...newSale, customerAddress: e.target.value})}
                      placeholder="عنوان العميل"
                      rows="2"
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ملاحظات
                    </label>
                    <textarea
                      value={newSale.notes}
                      onChange={(e) => setNewSale({...newSale, notes: e.target.value})}
                      placeholder="أي ملاحظات إضافية"
                      rows="2"
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                    />
                  </div>
                </div>
                
                {/* تفاصيل المنتج */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-700 border-b pb-2 text-lg flex items-center gap-2">
                    <FiPackage className="text-primary-600" />
                    تفاصيل المنتج
                  </h4>
                  
                  {/* اختيار الدورة الإنتاجية */}
                  {activeCycles.length > 0 && newSale.type === 'دواجن حية' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        اختر الدورة الإنتاجية
                      </label>
                      <select
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        onChange={(e) => {
                          const cycleId = e.target.value;
                          if (cycleId) {
                            const selectedCycle = activeCycles.find(c => c.id == cycleId);
                            if (selectedCycle) {
                              setNewSale({
                                ...newSale,
                                cycleId: selectedCycle.id,
                                unitPrice: selectedCycle.currentPrice || newSale.unitPrice,
                                totalAmount: newSale.totalWeight * (selectedCycle.currentPrice || newSale.unitPrice)
                              });
                            }
                          }
                        }}
                      >
                        <option value="">اختر دورة إنتاجية</option>
                        {activeCycles.map(cycle => (
                          <option key={cycle.id} value={cycle.id}>
                            {cycle.name} - {cycle.birdsCount} طائر - {cycle.currentPrice} ج.م/كجم
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      الوزن الإجمالي (كجم) *
                    </label>
                    <input
                      type="number"
                      required
                      min="0.1"
                      step="0.1"
                      value={newSale.totalWeight || ''}
                      onChange={(e) => {
                        const weight = parseFloat(e.target.value) || 0;
                        const totalAmount = weight * newSale.unitPrice;
                        setNewSale({
                          ...newSale,
                          totalWeight: weight,
                          totalAmount: totalAmount
                        });
                      }}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      سعر الكيلو (ج.م) *
                    </label>
                    <input
                      type="number"
                      required
                      min="0.01"
                      step="0.01"
                      value={newSale.unitPrice || ''}
                      onChange={(e) => {
                        const price = parseFloat(e.target.value) || 0;
                        const totalAmount = newSale.totalWeight * price;
                        setNewSale({
                          ...newSale,
                          unitPrice: price,
                          totalAmount: totalAmount
                        });
                      }}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div className="p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-700">الإجمالي:</span>
                      <span className="text-xl font-bold text-green-600">
                        {newSale.totalAmount.toFixed(2)} ج.م
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {newSale.totalWeight.toFixed(1)} كجم × {newSale.unitPrice.toFixed(2)} ج.م
                    </div>
                    <div className="text-xs text-gray-400 mt-2">
                      يتم حساب الإجمالي تلقائياً
                    </div>
                  </div>
                </div>
                
                {/* الدفع والمعلومات المالية */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-700 border-b pb-2 text-lg flex items-center gap-2">
                    <FiDollarSign className="text-primary-600" />
                    المعلومات المالية
                  </h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      المبلغ المدفوع (ج.م) *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      max={newSale.totalAmount}
                      value={newSale.paidAmount || ''}
                      onChange={(e) => {
                        const paid = parseFloat(e.target.value) || 0;
                        const total = newSale.totalAmount;
                        let status = 'مدفوع';
                        
                        if (paid === 0) {
                          status = 'مستحق';
                        } else if (paid < total) {
                          status = 'جزئي';
                        }
                        
                        setNewSale({
                          ...newSale,
                          paidAmount: paid,
                          paymentStatus: status
                        });
                      }}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    {newSale.paidAmount > newSale.totalAmount && (
                      <p className="text-red-500 text-xs mt-1">
                        ⚠️ المبلغ المدفوع لا يمكن أن يكون أكبر من الإجمالي
                      </p>
                    )}
                    <div className="text-xs text-gray-500 mt-1">
                      الحد الأقصى: {newSale.totalAmount.toFixed(2)} ج.م
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      طريقة الدفع *
                    </label>
                    <select
                      required
                      value={newSale.paymentMethod}
                      onChange={(e) => setNewSale({...newSale, paymentMethod: e.target.value})}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      {paymentMethods.map(method => (
                        <option key={method} value={method}>{method}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      حالة الدفع *
                    </label>
                    <select
                      required
                      value={newSale.paymentStatus}
                      onChange={(e) => setNewSale({...newSale, paymentStatus: e.target.value})}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      {paymentStatuses.map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-blue-200">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-700">الإجمالي:</span>
                        <span className="font-bold text-lg">{newSale.totalAmount.toFixed(2)} ج.م</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-700">المدفوع:</span>
                        <span className="text-green-600 font-bold">{newSale.paidAmount.toFixed(2)} ج.م</span>
                      </div>
                      <div className="border-t border-blue-200 pt-3">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-700">المتبقي:</span>
                          <span className={`font-bold text-lg ${
                            (newSale.totalAmount - newSale.paidAmount) > 0 ? 'text-red-600' : 'text-green-600'
                          }`}>
                            {(newSale.totalAmount - newSale.paidAmount).toFixed(2)} ج.م
                          </span>
                        </div>
                        {newSale.totalAmount - newSale.paidAmount > 0 && (
                          <div className="text-xs text-red-500 mt-1">
                            ⚠️ هناك مبلغ مستحق للتحصيل
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* أزرار الحفظ والإلغاء */}
              <div className="flex justify-end gap-3 mt-8 pt-6 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200 font-medium"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 font-medium flex items-center gap-2 shadow-sm"
                >
                  {editingSale ? (
                    <>
                      <FiEdit /> تحديث العملية
                    </>
                  ) : (
                    <>
                      <FiPlus /> إضافة عملية بيع
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesManagement;
