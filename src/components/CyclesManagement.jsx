import React, { useState, useEffect } from 'react';
import {
  FiPlus, FiEdit, FiTrash2, FiEye, FiFilter,
  FiCalendar, FiClock, FiTrendingUp, FiDroplet,
  FiPackage, FiDollarSign, FiUsers, FiHome,
  FiChevronRight, FiSearch, FiDownload, FiPrinter
} from 'react-icons/fi';
import { MdPoultry, MdShowChart, MdLocalHospital } from 'react-icons/md';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const CyclesManagement = ({ data, updateData, addNotification }) => {
  const [cycles, setCycles] = useState(data.cycles || []);
  const [filteredCycles, setFilteredCycles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCycle, setEditingCycle] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('الكل');
  const [sortBy, setSortBy] = useState('تاريخ البدء');
  const [currentPage, setCurrentPage] = useState(1);
  const cyclesPerPage = 10;

  const [newCycle, setNewCycle] = useState({
    name: '',
    startDate: new Date(),
    endDate: null,
    status: 'نشط',
    initialBirds: 0,
    currentBirds: 0,
    breed: 'روس 308',
    houseNumber: '',
    farmer: '',
    notes: '',
    targetWeight: 2.5,
    mortalityLimit: 5,
    feedType: 'علف بادي'
  });

  const breeds = ['روس 308', 'كوب 500', 'هبرد', 'آربور آكرز', 'لوهان', 'سلالة محلية'];
  const statuses = ['نشط', 'مكتمل', 'ملغى', 'معلق'];
  const feedTypes = ['علف بادي', 'علف نامي', 'علف ناهي', 'علف بياض'];

  useEffect(() => {
    setCycles(data.cycles || []);
    filterAndSortCycles();
  }, [data.cycles, searchTerm, filterStatus, sortBy]);

  const filterAndSortCycles = () => {
    let filtered = cycles.filter(cycle => {
      const matchesSearch = cycle.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          cycle.houseNumber?.includes(searchTerm) ||
                          cycle.farmer?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'الكل' || cycle.status === filterStatus;
      return matchesSearch && matchesStatus;
    });

    // الترتيب
    filtered.sort((a, b) => {
      switch(sortBy) {
        case 'تاريخ البدء':
          return new Date(b.startDate) - new Date(a.startDate);
        case 'اسم الدورة':
          return a.name.localeCompare(b.name);
        case 'عدد الطيور':
          return b.currentBirds - a.currentBirds;
        case 'الحالة':
          const statusOrder = { 'نشط': 1, 'معلق': 2, 'مكتمل': 3, 'ملغى': 4 };
          return statusOrder[a.status] - statusOrder[b.status];
        default:
          return 0;
      }
    });

    setFilteredCycles(filtered);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const updatedCycle = {
      ...newCycle,
      id: editingCycle ? editingCycle.id : Date.now(),
      createdAt: editingCycle ? editingCycle.createdAt : new Date().toISOString(),
      currentBirds: newCycle.currentBirds || newCycle.initialBirds
    };

    let updatedCycles;
    if (editingCycle) {
      updatedCycles = cycles.map(c => c.id === editingCycle.id ? updatedCycle : c);
      addNotification({
        type: 'success',
        title: 'تم التحديث',
        message: `تم تحديث دورة ${updatedCycle.name} بنجاح`,
        time: new Date().toLocaleTimeString('ar-EG')
      });
    } else {
      updatedCycles = [...cycles, updatedCycle];
      addNotification({
        type: 'success',
        title: 'تم الإضافة',
        message: `تم إضافة دورة ${updatedCycle.name} جديدة`,
        time: new Date().toLocaleTimeString('ar-EG')
      });
    }

    updateData('cycles', updatedCycles);
    setShowModal(false);
    resetForm();
  };

  const resetForm = () => {
    setNewCycle({
      name: '',
      startDate: new Date(),
      endDate: null,
      status: 'نشط',
      initialBirds: 0,
      currentBirds: 0,
      breed: 'روس 308',
      houseNumber: '',
      farmer: '',
      notes: '',
      targetWeight: 2.5,
      mortalityLimit: 5,
      feedType: 'علف بادي'
    });
    setEditingCycle(null);
  };

  const handleEdit = (cycle) => {
    setEditingCycle(cycle);
    setNewCycle({
      ...cycle,
      startDate: new Date(cycle.startDate),
      endDate: cycle.endDate ? new Date(cycle.endDate) : null
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذه الدورة؟')) {
      const updatedCycles = cycles.filter(c => c.id !== id);
      updateData('cycles', updatedCycles);
      addNotification({
        type: 'warning',
        title: 'تم الحذف',
        message: 'تم حذف الدورة بنجاح',
        time: new Date().toLocaleTimeString('ar-EG')
      });
    }
  };

  const calculateCycleStats = (cycle) => {
    const dailyRecords = data.dailyRecords?.filter(r => r.cycleId === cycle.id) || [];
    const totalMortality = dailyRecords.reduce((sum, r) => sum + (r.mortality || 0), 0);
    const mortalityRate = cycle.initialBirds > 0 ? ((totalMortality / cycle.initialBirds) * 100).toFixed(2) : 0;
    
    const avgWeight = dailyRecords.length > 0 
      ? (dailyRecords.reduce((sum, r) => sum + (r.avgWeight || 0), 0) / dailyRecords.length).toFixed(2)
      : 0;

    const feedConsumed = dailyRecords.reduce((sum, r) => sum + (r.feedConsumed || 0), 0);
    const waterConsumed = dailyRecords.reduce((sum, r) => sum + (r.waterConsumed || 0), 0);

    return { totalMortality, mortalityRate, avgWeight, feedConsumed, waterConsumed };
  };

  const getStatusBadge = (status) => {
    const badges = {
      'نشط': 'bg-green-100 text-green-800',
      'مكتمل': 'bg-blue-100 text-blue-800',
      'ملغى': 'bg-red-100 text-red-800',
      'معلق': 'bg-yellow-100 text-yellow-800'
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  const paginatedCycles = filteredCycles.slice(
    (currentPage - 1) * cyclesPerPage,
    currentPage * cyclesPerPage
  );

  const totalPages = Math.ceil(filteredCycles.length / cyclesPerPage);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* رأس الصفحة */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-3">
            <FiCalendar className="text-primary-600" />
            إدارة الدورات الإنتاجية
          </h1>
          <p className="text-gray-600 mt-2">
            إدارة وتتبع جميع دورات إنتاج الدواجن في المزرعة
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
            <FiPlus /> دورة جديدة
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">الدورات النشطة</p>
              <h3 className="text-2xl font-bold text-gray-800">
                {cycles.filter(c => c.status === 'نشط').length}
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
              <p className="text-gray-600 text-sm">إجمالي الطيور</p>
              <h3 className="text-2xl font-bold text-gray-800">
                {cycles.reduce((sum, c) => sum + (c.currentBirds || 0), 0).toLocaleString()}
              </h3>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <MdPoultry className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">متوسط النفوق</p>
              <h3 className="text-2xl font-bold text-gray-800">
                {(() => {
                  const activeCycles = cycles.filter(c => c.status === 'نشط');
                  if (activeCycles.length === 0) return '0%';
                  const avg = activeCycles.reduce((sum, c) => {
                    const stats = calculateCycleStats(c);
                    return sum + parseFloat(stats.mortalityRate);
                  }, 0) / activeCycles.length;
                  return `${avg.toFixed(1)}%`;
                })()}
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
                {(() => {
                  const activeCycles = cycles.filter(c => c.status === 'نشط');
                  if (activeCycles.length === 0) return '0 كجم';
                  let totalWeight = 0;
                  let count = 0;
                  activeCycles.forEach(c => {
                    const stats = calculateCycleStats(c);
                    if (stats.avgWeight > 0) {
                      totalWeight += parseFloat(stats.avgWeight);
                      count++;
                    }
                  });
                  return count > 0 ? `${(totalWeight / count).toFixed(2)} كجم` : '0 كجم';
                })()}
              </h3>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <MdShowChart className="w-6 h-6 text-purple-600" />
            </div>
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
                placeholder="ابحث باسم الدورة، رقم الحظيرة، أو المربي..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex gap-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="الكل">جميع الحالات</option>
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="تاريخ البدء">تاريخ البدء</option>
              <option value="اسم الدورة">اسم الدورة</option>
              <option value="عدد الطيور">عدد الطيور</option>
              <option value="الحالة">الحالة</option>
            </select>
            
            <button className="btn bg-white border border-gray-300 text-gray-700 flex items-center gap-2">
              <FiFilter /> تصفية متقدمة
            </button>
          </div>
        </div>

        {/* جدول الدورات */}
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الدورة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الحالة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الطيور
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الإحصائيات
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  التواريخ
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedCycles.length > 0 ? (
                paginatedCycles.map((cycle) => {
                  const stats = calculateCycleStats(cycle);
                  const daysRunning = Math.floor(
                    (new Date() - new Date(cycle.startDate)) / (1000 * 60 * 60 * 24)
                  );
                  
                  return (
                    <tr key={cycle.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4">
                        <div>
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary-100 rounded-lg">
                              <FiCalendar className="w-5 h-5 text-primary-600" />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">{cycle.name}</h4>
                              <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                <FiHome /> {cycle.houseNumber} حظيرة
                                <span className="mx-2">•</span>
                                <MdPoultry /> {cycle.breed}
                              </div>
                              <p className="text-sm text-gray-500 mt-1">
                                <FiUsers /> {cycle.farmer}
                              </p>
                            </div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(cycle.status)}`}>
                          {cycle.status}
                        </span>
                        {cycle.status === 'نشط' && (
                          <div className="mt-2">
                            <div className="text-xs text-gray-500 mb-1">
                              اليوم {daysRunning > 0 ? daysRunning : 1}
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                              <div 
                                className="bg-green-500 h-1.5 rounded-full"
                                style={{ width: `${Math.min((daysRunning / 45) * 100, 100)}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          <div>
                            <div className="text-sm text-gray-500">البداية</div>
                            <div className="font-medium">{cycle.initialBirds.toLocaleString()}</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">الحالي</div>
                            <div className="font-medium text-primary-600">
                              {cycle.currentBirds.toLocaleString()}
                            </div>
                          </div>
                          <div className="text-sm text-gray-500">
                            -{cycle.initialBirds - cycle.currentBirds} طائر
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">النفوق</span>
                            <span className={`font-medium ${parseFloat(stats.mortalityRate) > 5 ? 'text-red-600' : 'text-green-600'}`}>
                              {stats.mortalityRate}%
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">متوسط الوزن</span>
                            <span className="font-medium">{stats.avgWeight} كجم</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">العلف المستهلك</span>
                            <span className="font-medium">{(stats.feedConsumed / 1000).toFixed(1)} طن</span>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          <div>
                            <div className="text-sm text-gray-500">تاريخ البدء</div>
                            <div className="font-medium">
                              {new Date(cycle.startDate).toLocaleDateString('ar-EG')}
                            </div>
                          </div>
                          {cycle.endDate && (
                            <div>
                              <div className="text-sm text-gray-500">تاريخ الانتهاء</div>
                              <div className="font-medium">
                                {new Date(cycle.endDate).toLocaleDateString('ar-EG')}
                              </div>
                            </div>
                          )}
                          {cycle.status === 'نشط' && (
                            <div className="text-xs text-primary-600 flex items-center gap-1">
                              <FiClock />
                              مستمرة منذ {daysRunning} يوم
                            </div>
                          )}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(cycle)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                            title="تعديل"
                          >
                            <FiEdit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => window.open(`/cycle/${cycle.id}`, '_blank')}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
                            title="عرض التفاصيل"
                          >
                            <FiEye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(cycle.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                            title="حذف"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              addNotification({
                                type: 'info',
                                title: 'إضافة سجل',
                                message: `إضافة سجل يومي للدورة ${cycle.name}`,
                                time: new Date().toLocaleTimeString('ar-EG')
                              });
                            }}
                            className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors duration-200"
                            title="إضافة سجل يومي"
                          >
                            <FiPlus className="w-4 h-4" />
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
                      <FiCalendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p className="text-lg">لا توجد دورات</p>
                      <p className="text-sm mt-2">ابدأ بإضافة دورة إنتاجية جديدة</p>
                      <button
                        onClick={() => setShowModal(true)}
                        className="mt-4 btn btn-primary inline-flex items-center gap-2"
                      >
                        <FiPlus /> إضافة دورة جديدة
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
              عرض <span className="font-medium">{(currentPage - 1) * cyclesPerPage + 1}</span> إلى{' '}
              <span className="font-medium">
                {Math.min(currentPage * cyclesPerPage, filteredCycles.length)}
              </span>{' '}
              من <span className="font-medium">{filteredCycles.length}</span> دورة
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

      {/* مودال إضافة/تعديل دورة */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">
                  {editingCycle ? 'تعديل الدورة' : 'إضافة دورة جديدة'}
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
                        اسم الدورة *
                      </label>
                      <input
                        type="text"
                        required
                        value={newCycle.name}
                        onChange={(e) => setNewCycle({...newCycle, name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="مثال: دورة الشتاء 2024"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        رقم الحظيرة *
                      </label>
                      <input
                        type="text"
                        required
                        value={newCycle.houseNumber}
                        onChange={(e) => setNewCycle({...newCycle, houseNumber: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="مثال: 1، 2، أ، ب"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        السلالة *
                      </label>
                      <select
                        required
                        value={newCycle.breed}
                        onChange={(e) => setNewCycle({...newCycle, breed: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        {breeds.map(breed => (
                          <option key={breed} value={breed}>{breed}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        المسئول عن الدورة
                      </label>
                      <input
                        type="text"
                        value={newCycle.farmer}
                        onChange={(e) => setNewCycle({...newCycle, farmer: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="اسم المربي"
                      />
                    </div>
                  </div>
                  
                  {/* التفاصيل الفنية */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-700 border-b pb-2">التفاصيل الفنية</h4>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        عدد الطيور الابتدائي *
                      </label>
                      <input
                        type="number"
                        required
                        min="1"
                        value={newCycle.initialBirds}
                        onChange={(e) => setNewCycle({...newCycle, initialBirds: parseInt(e.target.value) || 0})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        الحالة *
                      </label>
                      <select
                        required
                        value={newCycle.status}
                        onChange={(e) => setNewCycle({...newCycle, status: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        {statuses.map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        تاريخ البدء *
                      </label>
                      <DatePicker
                        selected={newCycle.startDate}
                        onChange={(date) => setNewCycle({...newCycle, startDate: date})}
                        dateFormat="yyyy/MM/dd"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        تاريخ الانتهاء المتوقع
                      </label>
                      <DatePicker
                        selected={newCycle.endDate}
                        onChange={(date) => setNewCycle({...newCycle, endDate: date})}
                        dateFormat="yyyy/MM/dd"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        isClearable
                        placeholderText="اختياري"
                      />
                    </div>
                  </div>
                  
                  {/* الإعدادات */}
                  <div className="space-y-4 md:col-span-2">
                    <h4 className="font-medium text-gray-700 border-b pb-2">الإعدادات المستهدفة</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          الوزن المستهدف (كجم)
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={newCycle.targetWeight}
                          onChange={(e) => setNewCycle({...newCycle, targetWeight: parseFloat(e.target.value)})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          حد النفوق المسموح (%)
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={newCycle.mortalityLimit}
                          onChange={(e) => setNewCycle({...newCycle, mortalityLimit: parseFloat(e.target.value)})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          نوع العلف الأساسي
                        </label>
                        <select
                          value={newCycle.feedType}
                          onChange={(e) => setNewCycle({...newCycle, feedType: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                          {feedTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        ملاحظات إضافية
                      </label>
                      <textarea
                        value={newCycle.notes}
                        onChange={(e) => setNewCycle({...newCycle, notes: e.target.value})}
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="أي ملاحظات إضافية عن الدورة..."
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
                    <FiPlus /> {editingCycle ? 'تحديث الدورة' : 'إضافة الدورة'}
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

export default CyclesManagement;
