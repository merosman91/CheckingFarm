import React, { useState, useEffect } from 'react';
import {
  FiPlus, FiEdit, FiTrash2, FiFilter, FiDownload,
  FiPrinter, FiSearch, FiPackage, FiDroplet,
  FiAlertCircle, FiTrendingUp, FiShoppingCart,
  FiBarChart2, FiRefreshCw, FiEye
} from 'react-icons/fi';
import { MdPoultry, MdLocalHospital, MdAttachMoney } from 'react-icons/md';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const InventoryManagement = ({ data, updateData, addNotification }) => {
  const [inventory, setInventory] = useState(data.inventory || []);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('الكل');
  const [sortBy, setSortBy] = useState('الاسم');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [newItem, setNewItem] = useState({
    name: '',
    type: 'علف',
    quantity: 0,
    unit: 'كيلو',
    minQuantity: 0,
    supplier: '',
    lastRestock: new Date(),
    costPerUnit: 0,
    expiryDate: null,
    location: 'مخزن 1',
    notes: '',
    category: 'علف'
  });

  const itemTypes = ['علف', 'دواء', 'مطهر', 'مستلزمات', 'أخرى'];
  const units = ['كيلو', 'طن', 'لتر', 'كيس', 'علبة', 'قنينة', 'قطعة'];
  const categories = {
    'علف': ['علف بادي', 'علف نامي', 'علف ناهي', 'علف بياض'],
    'دواء': ['مضاد حيوي', 'فيتامينات', 'لقاحات', 'مطهرات'],
    'مستلزمات': ['أدوات', 'ملابس', 'أجهزة', 'تنظيف']
  };

  useEffect(() => {
    setInventory(data.inventory || []);
    filterAndSortItems();
  }, [data.inventory, searchTerm, filterType, sortBy]);

  const filterAndSortItems = () => {
    let filtered = inventory.filter(item => {
      const matchesSearch = item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.supplier?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'الكل' || item.type === filterType;
      return matchesSearch && matchesType;
    });

    // الترتيب
    filtered.sort((a, b) => {
      switch(sortBy) {
        case 'الاسم':
          return a.name.localeCompare(b.name);
        case 'الكمية':
          return a.quantity - b.quantity;
        case 'النوع':
          return a.type.localeCompare(b.type);
        case 'آخر تجديد':
          return new Date(b.lastRestock) - new Date(a.lastRestock);
        default:
          return 0;
      }
    });

    setFilteredInventory(filtered);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const updatedItem = {
      ...newItem,
      id: editingItem ? editingItem.id : Date.now(),
      createdAt: editingItem ? editingItem.createdAt : new Date().toISOString(),
      lastRestock: newItem.lastRestock.toISOString(),
      expiryDate: newItem.expiryDate ? newItem.expiryDate.toISOString() : null
    };

    let updatedItems;
    if (editingItem) {
      updatedItems = inventory.map(i => i.id === editingItem.id ? updatedItem : i);
      addNotification({
        type: 'success',
        title: 'تم التحديث',
        message: `تم تحديث ${updatedItem.name} بنجاح`,
        time: new Date().toLocaleTimeString('ar-EG')
      });
    } else {
      updatedItems = [...inventory, updatedItem];
      addNotification({
        type: 'success',
        title: 'تم الإضافة',
        message: `تم إضافة ${updatedItem.name} إلى المخزون`,
        time: new Date().toLocaleTimeString('ar-EG')
      });
    }

    updateData('inventory', updatedItems);
    setShowModal(false);
    resetForm();
  };

  const resetForm = () => {
    setNewItem({
      name: '',
      type: 'علف',
      quantity: 0,
      unit: 'كيلو',
      minQuantity: 0,
      supplier: '',
      lastRestock: new Date(),
      costPerUnit: 0,
      expiryDate: null,
      location: 'مخزن 1',
      notes: '',
      category: 'علف'
    });
    setEditingItem(null);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setNewItem({
      ...item,
      lastRestock: new Date(item.lastRestock),
      expiryDate: item.expiryDate ? new Date(item.expiryDate) : null
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذا العنصر من المخزون؟')) {
      const updatedItems = inventory.filter(i => i.id !== id);
      updateData('inventory', updatedItems);
      addNotification({
        type: 'warning',
        title: 'تم الحذف',
        message: 'تم حذف العنصر من المخزون',
        time: new Date().toLocaleTimeString('ar-EG')
      });
    }
  };

  const handleRestock = (item) => {
    const quantity = prompt(`أدخل الكمية المضافة لـ ${item.name} (${item.unit}):`, '0');
    if (quantity && !isNaN(quantity)) {
      const updatedItems = inventory.map(i => 
        i.id === item.id 
          ? { 
              ...i, 
              quantity: i.quantity + parseFloat(quantity),
              lastRestock: new Date().toISOString()
            }
          : i
      );
      updateData('inventory', updatedItems);
      addNotification({
        type: 'info',
        title: 'تم التزويد',
        message: `تمت إضافة ${quantity} ${item.unit} إلى ${item.name}`,
        time: new Date().toLocaleTimeString('ar-EG')
      });
    }
  };

  const calculateInventoryStats = () => {
    const lowStockItems = inventory.filter(item => 
      item.quantity < (item.minQuantity || item.quantity * 0.2)
    );
    
    const totalValue = inventory.reduce((sum, item) => 
      sum + (item.quantity * item.costPerUnit), 0
    );
    
    const totalItems = inventory.length;
    const feedItems = inventory.filter(i => i.type === 'علف').length;
    const medicineItems = inventory.filter(i => i.type === 'دواء').length;
    const expiredItems = inventory.filter(i => 
      i.expiryDate && new Date(i.expiryDate) < new Date()
    ).length;

    return {
      lowStockItems: lowStockItems.length,
      totalValue: totalValue.toFixed(2),
      totalItems,
      feedItems,
      medicineItems,
      expiredItems
    };
  };

  const getStockStatus = (item) => {
    const percentage = (item.quantity / (item.minQuantity || item.quantity * 5)) * 100;
    if (percentage <= 20) return { color: 'bg-red-500', text: 'منخفض جداً' };
    if (percentage <= 50) return { color: 'bg-orange-500', text: 'منخفض' };
    if (percentage <= 80) return { color: 'bg-yellow-500', text: 'متوسط' };
    return { color: 'bg-green-500', text: 'جيد' };
  };

  const stats = calculateInventoryStats();
  const paginatedItems = filteredInventory.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filteredInventory.length / itemsPerPage);

  // بيانات الرسوم البيانية
  const typeDistribution = Object.entries(
    inventory.reduce((acc, item) => {
      acc[item.type] = (acc[item.type] || 0) + 1;
      return acc;
    }, {})
  ).map(([type, count]) => ({ name: type, value: count }));

  const lowStockData = inventory
    .filter(item => (item.quantity / (item.minQuantity || 100)) <= 0.5)
    .slice(0, 5)
    .map(item => ({
      name: item.name,
      quantity: item.quantity,
      min: item.minQuantity || item.quantity * 0.2
    }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* رأس الصفحة */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-3">
            <FiPackage className="text-primary-600" />
            إدارة المخزون والأعلاف
          </h1>
          <p className="text-gray-600 mt-2">
            إدارة وتتبع مخزون الأعلاف، الأدوية، والمستلزمات
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
            <FiPlus /> عنصر جديد
          </button>
          <button className="btn bg-white border border-gray-300 text-gray-700 flex items-center gap-2">
            <FiShoppingCart /> طلب شراء
          </button>
          <button className="btn bg-white border border-gray-300 text-gray-700 flex items-center gap-2">
            <FiDownload /> تصدير
          </button>
        </div>
      </div>

      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">إجمالي العناصر</p>
              <h3 className="text-2xl font-bold text-gray-800">
                {stats.totalItems}
              </h3>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <FiPackage className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">قيمة المخزون</p>
              <h3 className="text-2xl font-bold text-gray-800">
                {stats.totalValue} ج.م
              </h3>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <MdAttachMoney className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">منخفض المخزون</p>
              <h3 className="text-2xl font-bold text-gray-800">
                {stats.lowStockItems}
              </h3>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <FiAlertCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
        
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">الأدوية</p>
              <h3 className="text-2xl font-bold text-gray-800">
                {stats.medicineItems}
              </h3>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <MdLocalHospital className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* تنبيهات المخزون المنخفض */}
      {stats.lowStockItems > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <FiAlertCircle className="text-red-500 text-xl mt-1" />
            <div className="flex-1">
              <h4 className="font-medium text-red-800">تحذير: مخزون منخفض</h4>
              <p className="text-red-600 text-sm mt-1">
                يوجد {stats.lowStockItems} عنصر بمستوى مخزون منخفض. يرجى التزويد.
              </p>
            </div>
            <button
              onClick={() => {
                const lowStock = inventory.filter(item => 
                  item.quantity < (item.minQuantity || item.quantity * 0.2)
                );
                addNotification({
                  type: 'warning',
                  title: 'العناصر منخفضة المخزون',
                  message: `يوجد ${lowStock.length} عنصر يحتاج للتزويد`,
                  time: new Date().toLocaleTimeString('ar-EG'),
                  items: lowStock.map(i => i.name)
                });
              }}
              className="text-sm text-red-600 hover:text-red-800"
            >
              عرض التفاصيل
            </button>
          </div>
        </div>
      )}

      {/* الرسوم البيانية */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card rounded-xl p-5">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-800">توزيع أنواع المخزون</h3>
            <button className="text-primary-600 hover:text-primary-800">
              المزيد
            </button>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={typeDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {typeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} عنصر`, 'العدد']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card rounded-xl p-5">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-800">المخزون المنخفض</h3>
            <button className="text-primary-600 hover:text-primary-800">
              التزويد
            </button>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={lowStockData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="quantity" fill="#e74c3c" name="المخزون الحالي" />
                <Bar dataKey="min" fill="#3498db" name="الحد الأدنى" />
              </BarChart>
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
                placeholder="ابحث باسم العنصر أو المورد..."
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
              {itemTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="الاسم">الاسم</option>
              <option value="الكمية">الكمية</option>
              <option value="النوع">النوع</option>
              <option value="آخر تجديد">آخر تجديد</option>
            </select>
            
            <button className="btn bg-white border border-gray-300 text-gray-700 flex items-center gap-2">
              <FiFilter /> تصفية متقدمة
            </button>
          </div>
        </div>

        {/* جدول المخزون */}
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  العنصر
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  المخزون
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  التكلفة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  المورد
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  آخر تجديد
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedItems.length > 0 ? (
                paginatedItems.map((item) => {
                  const stockStatus = getStockStatus(item);
                  const isExpired = item.expiryDate && new Date(item.expiryDate) < new Date();
                  
                  return (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${item.type === 'علف' ? 'bg-green-100' : item.type === 'دواء' ? 'bg-red-100' : 'bg-blue-100'}`}>
                            {item.type === 'علف' ? (
                              <FiPackage className="w-5 h-5 text-green-600" />
                            ) : item.type === 'دواء' ? (
                              <MdLocalHospital className="w-5 h-5 text-red-600" />
                            ) : (
                              <FiPackage className="w-5 h-5 text-blue-600" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{item.name}</h4>
                            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                              <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                                {item.type}
                              </span>
                              {item.category && (
                                <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                                  {item.category}
                                </span>
                              )}
                            </div>
                            {item.location && (
                              <p className="text-xs text-gray-500 mt-1">
                                📍 {item.location}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-gray-900">
                              {item.quantity} {item.unit}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded-full text-white ${stockStatus.color}`}>
                              {stockStatus.text}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${stockStatus.color}`}
                              style={{ 
                                width: `${Math.min((item.quantity / (item.minQuantity || item.quantity * 5)) * 100, 100)}%` 
                              }}
                            ></div>
                          </div>
                          {item.minQuantity > 0 && (
                            <div className="text-xs text-gray-500 mt-1">
                              الحد الأدنى: {item.minQuantity} {item.unit}
                            </div>
                          )}
                          {isExpired && (
                            <div className="text-xs text-red-600 mt-1 flex items-center gap-1">
                              <FiAlertCircle />
                              منتهي الصلاحية
                            </div>
                          )}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          <div>
                            <div className="text-sm text-gray-500">سعر الوحدة</div>
                            <div className="font-medium text-green-600">
                              {item.costPerUnit?.toFixed(2)} ج.م
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">القيمة الإجمالية</div>
                            <div className="font-medium text-blue-600">
                              {(item.quantity * item.costPerUnit).toFixed(2)} ج.م
                            </div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{item.supplier || '-'}</p>
                          {item.expiryDate && (
                            <div className="text-xs text-gray-500 mt-2">
                              <div className={`${isExpired ? 'text-red-600' : 'text-green-600'}`}>
                                الصلاحية: {new Date(item.expiryDate).toLocaleDateString('ar-EG')}
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">
                            {new Date(item.lastRestock).toLocaleDateString('ar-EG')}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            منذ {Math.floor((new Date() - new Date(item.lastRestock)) / (1000 * 60 * 60 * 24))} يوم
                          </p>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleRestock(item)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
                            title="تزويد المخزون"
                          >
                            <FiRefreshCw className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(item)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                            title="تعديل"
                          >
                            <FiEdit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                            title="حذف"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              addNotification({
                                type: 'info',
                                title: 'تفاصيل المخزون',
                                message: `عرض تفاصيل ${item.name}`,
                                time: new Date().toLocaleTimeString('ar-EG')
                              });
                            }}
                            className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors duration-200"
                            title="عرض التفاصيل"
                          >
                            <FiEye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <div className="text-gray-500">
                      <FiPackage className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p className="text-lg">لا توجد عناصر في المخزون</p>
                      <p className="text-sm mt-2">ابدأ بإضافة عناصر إلى المخزون</p>
                      <button
                        onClick={() => setShowModal(true)}
                        className="mt-4 btn btn-primary inline-flex items-center gap-2"
                      >
                        <FiPlus /> إضافة عنصر جديد
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
              عرض <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> إلى{' '}
              <span className="font-medium">
                {Math.min(currentPage * itemsPerPage, filteredInventory.length)}
              </span>{' '}
              من <span className="font-medium">{filteredInventory.length}</span> عنصر
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

      {/* مودال إضافة/تعديل عنصر */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">
                  {editingItem ? 'تعديل العنصر' : 'إضافة عنصر جديد للمخزون'}
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
                        اسم العنصر *
                      </label>
                      <input
                        type="text"
                        required
                        value={newItem.name}
                        onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="مثال: علف بادي، لقاح نيوكاسل"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        النوع *
                      </label>
                      <select
                        required
                        value={newItem.type}
                        onChange={(e) => {
                          const type = e.target.value;
                          setNewItem({
                            ...newItem,
                            type,
                            category: categories[type]?.[0] || ''
                          });
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        {itemTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        الفئة
                      </label>
                      <select
                        value={newItem.category}
                        onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        {categories[newItem.type]?.map(category => (
                          <option key={category} value={category}>{category}</option>
                        )) || <option value="">اختر الفئة</option>}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        المورد
                      </label>
                      <input
                        type="text"
                        value={newItem.supplier}
                        onChange={(e) => setNewItem({...newItem, supplier: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="اسم المورد أو الشركة"
                      />
                    </div>
                  </div>
                  
                  {/* الكمية والتكلفة */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-700 border-b pb-2">الكمية والتكلفة</h4>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          الكمية *
                        </label>
                        <input
                          type="number"
                          required
                          min="0"
                          step="0.01"
                          value={newItem.quantity}
                          onChange={(e) => setNewItem({...newItem, quantity: parseFloat(e.target.value) || 0})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          الوحدة *
                        </label>
                        <select
                          required
                          value={newItem.unit}
                          onChange={(e) => setNewItem({...newItem, unit: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                          {units.map(unit => (
                            <option key={unit} value={unit}>{unit}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          الحد الأدنى
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={newItem.minQuantity}
                          onChange={(e) => setNewItem({...newItem, minQuantity: parseFloat(e.target.value) || 0})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="للتذكير عند الوصول له"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          سعر الوحدة (ج.م)
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={newItem.costPerUnit}
                          onChange={(e) => setNewItem({...newItem, costPerUnit: parseFloat(e.target.value) || 0})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        الموقع
                      </label>
                      <input
                        type="text"
                        value={newItem.location}
                        onChange={(e) => setNewItem({...newItem, location: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="مثال: مخزن 1، رف أ"
                      />
                    </div>
                  </div>
                  
                  {/* التواريخ */}
                  <div className="space-y-4 md:col-span-2">
                    <h4 className="font-medium text-gray-700 border-b pb-2">التواريخ</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          تاريخ آخر تزويد *
                        </label>
                        <DatePicker
                          selected={newItem.lastRestock}
                          onChange={(date) => setNewItem({...newItem, lastRestock: date})}
                          dateFormat="yyyy/MM/dd"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          تاريخ انتهاء الصلاحية
                        </label>
                        <DatePicker
                          selected={newItem.expiryDate}
                          onChange={(date) => setNewItem({...newItem, expiryDate: date})}
                          dateFormat="yyyy/MM/dd"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          isClearable
                          placeholderText="اختياري للمواد القابلة للتلف"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        ملاحظات
                      </label>
                      <textarea
                        value={newItem.notes}
                        onChange={(e) => setNewItem({...newItem, notes: e.target.value})}
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="أي ملاحظات إضافية عن العنصر..."
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
                    <FiPlus /> {editingItem ? 'تحديث العنصر' : 'إضافة العنصر'}
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

export default InventoryManagement;
