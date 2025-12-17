import React, { useState, useEffect } from 'react'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  PlayCircle,
  PauseCircle,
  Calendar,
  Users,
  TrendingUp,
  Filter,
  Download
} from 'lucide-react'

const CyclesManagement = () => {
  const [cycles, setCycles] = useState([])
  const [showNewCycle, setShowNewCycle] = useState(false)
  const [selectedCycle, setSelectedCycle] = useState(null)
  const [showDetails, setShowDetails] = useState(false)

  const [newCycle, setNewCycle] = useState({
    name: '',
    startDate: new Date().toISOString().split('T')[0],
    birdsCount: 0,
    breed: '',
    houseNumber: '',
    expectedDuration: 45,
    notes: ''
  })

  useEffect(() => {
    const savedCycles = localStorage.getItem('cyclesData')
    if (savedCycles) {
      setCycles(JSON.parse(savedCycles))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('cyclesData', JSON.stringify(cycles))
  }, [cycles])

  const handleCreateCycle = () => {
    const cycle = {
      id: cycles.length + 1,
      ...newCycle,
      status: 'active',
      currentBirds: newCycle.birdsCount,
      mortality: 0,
      feedConsumed: 0,
      medicinesUsed: [],
      sales: [],
      expenses: [],
      createdAt: new Date().toISOString()
    }
    
    setCycles([...cycles, cycle])
    setShowNewCycle(false)
    setNewCycle({
      name: '',
      startDate: new Date().toISOString().split('T')[0],
      birdsCount: 0,
      breed: '',
      houseNumber: '',
      expectedDuration: 45,
      notes: ''
    })
  }

  const handleToggleStatus = (id) => {
    setCycles(cycles.map(cycle => 
      cycle.id === id 
        ? { ...cycle, status: cycle.status === 'active' ? 'inactive' : 'active' }
        : cycle
    ))
  }

  const handleDeleteCycle = (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذه الدورة؟')) {
      setCycles(cycles.filter(cycle => cycle.id !== id))
    }
  }

  const activeCycles = cycles.filter(c => c.status === 'active')
  const inactiveCycles = cycles.filter(c => c.status === 'inactive')

  return (
    <div className="space-y-6">
      {/* رأس الصفحة */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">إدارة الدورات</h1>
          <p className="text-gray-600 mt-1">إدارة دورات تربية الدواجن</p>
        </div>
        <div className="flex items-center space-x-3 space-x-reverse">
          <button 
            className="btn-secondary flex items-center"
            onClick={() => setShowNewCycle(true)}
          >
            <Plus size={18} className="ml-2" />
            دورة جديدة
          </button>
        </div>
      </div>

      {/* بطاقات الإحصائيات */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">الدورات النشطة</p>
              <p className="text-2xl font-bold text-gray-800 mt-2">
                {activeCycles.length}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {activeCycles.reduce((sum, c) => sum + c.currentBirds, 0).toLocaleString()} طائر
              </p>
            </div>
            <div className="p-3 rounded-lg bg-green-50">
              <PlayCircle size={24} className="text-green-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">الدورات المنتهية</p>
              <p className="text-2xl font-bold text-gray-800 mt-2">
                {inactiveCycles.length}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-gray-50">
              <PauseCircle size={24} className="text-gray-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">إجمالي الدورات</p>
              <p className="text-2xl font-bold text-gray-800 mt-2">
                {cycles.length}
              </p>
              <p className="text-sm text-gray-500 mt-1">من بداية العام</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-50">
              <TrendingUp size={24} className="text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* الدورات النشطة */}
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">الدورات النشطة</h2>
          <div className="flex space-x-2 space-x-reverse">
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter size={20} className="text-gray-600" />
            </button>
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Download size={20} className="text-gray-600" />
            </button>
          </div>
        </div>

        {activeCycles.length === 0 ? (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">لا توجد دورات نشطة</h3>
            <p className="mt-2 text-gray-500">ابدأ بإضافة دورة جديدة لتربية الدواجن.</p>
            <button 
              className="mt-4 btn-secondary"
              onClick={() => setShowNewCycle(true)}
            >
              <Plus size={18} className="ml-2" />
              إضافة دورة جديدة
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    اسم الدورة
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    تاريخ البدء
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    عدد الطيور
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    السلالة
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
                {activeCycles.map((cycle) => (
                  <tr key={cycle.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{cycle.name}</div>
                      <div className="text-sm text-gray-500">بيت رقم: {cycle.houseNumber}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {cycle.startDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">
                        {cycle.currentBirds.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        من {cycle.birdsCount.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {cycle.breed}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-800">
                        نشطة
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2 space-x-reverse">
                        <button 
                          className="text-blue-600 hover:text-blue-900"
                          onClick={() => {
                            setSelectedCycle(cycle)
                            setShowDetails(true)
                          }}
                        >
                          <Eye size={18} />
                        </button>
                        <button className="text-yellow-600 hover:text-yellow-900">
                          <Edit size={18} />
                        </button>
                        <button 
                          className="text-red-600 hover:text-red-900"
                          onClick={() => handleToggleStatus(cycle.id)}
                        >
                          <PauseCircle size={18} />
                        </button>
                        <button 
                          className="text-red-600 hover:text-red-900"
                          onClick={() => handleDeleteCycle(cycle.id)}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* الدورات المنتهية */}
      {inactiveCycles.length > 0 && (
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">الدورات المنتهية</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    اسم الدورة
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الفترة
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الإنتاج
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الإيرادات
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {inactiveCycles.slice(0, 5).map((cycle) => (
                  <tr key={cycle.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{cycle.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {cycle.startDate} - {cycle.endDate || 'حالياً'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">
                        {cycle.currentBirds?.toLocaleString() || 0} طائر
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-green-600">
                        {(cycle.sales?.reduce((sum, s) => sum + s.amount, 0) || 0).toLocaleString()} ر.س
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2 space-x-reverse">
                        <button className="text-blue-600 hover:text-blue-900">
                          <Eye size={18} />
                        </button>
                        <button 
                          className="text-green-600 hover:text-green-900"
                          onClick={() => handleToggleStatus(cycle.id)}
                        >
                          <PlayCircle size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* نافذة إنشاء دورة جديدة */}
      {showNewCycle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">دورة جديدة</h2>
                <button
                  onClick={() => setShowNewCycle(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      اسم الدورة *
                    </label>
                    <input
                      type="text"
                      className="input-field"
                      value={newCycle.name}
                      onChange={(e) => setNewCycle({...newCycle, name: e.target.value})}
                      placeholder="مثال: الدورة الشتوية 2024"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      تاريخ البدء *
                    </label>
                    <input
                      type="date"
                      className="input-field"
                      value={newCycle.startDate}
                      onChange={(e) => setNewCycle({...newCycle, startDate: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      عدد الطيور *
                    </label>
                    <input
                      type="number"
                      className="input-field"
                      value={newCycle.birdsCount}
                      onChange={(e) => setNewCycle({...newCycle, birdsCount: parseInt(e.target.value) || 0})}
                      min="1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      السلالة *
                    </label>
                    <select
                      className="input-field"
                      value={newCycle.breed}
                      onChange={(e) => setNewCycle({...newCycle, breed: e.target.value})}
                    >
                      <option value="">اختر السلالة</option>
                      <option value="لوجهورن">لوجهورن</option>
                      <option value="هاي لاين">هاي لاين</option>
                      <option value="روس">روس</option>
                      <option value="كوب">كوب</option>
                      <option value="أخرى">أخرى</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      رقم البيت
                    </label>
                    <input
                      type="text"
                      className="input-field"
                      value={newCycle.houseNumber}
                      onChange={(e) => setNewCycle({...newCycle, houseNumber: e.target.value})}
                      placeholder="مثال: بيت 1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      المدة المتوقعة (يوم)
                    </label>
                    <input
                      type="number"
                      className="input-field"
                      value={newCycle.expectedDuration}
                      onChange={(e) => setNewCycle({...newCycle, expectedDuration: parseInt(e.target.value) || 45})}
                      min="1"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ملاحظات
                  </label>
                  <textarea
                    className="input-field h-32"
                    value={newCycle.notes}
                    onChange={(e) => setNewCycle({...newCycle, notes: e.target.value})}
                    placeholder="أي ملاحظات إضافية..."
                  />
                </div>

                <div className="flex justify-end space-x-3 space-x-reverse pt-6 border-t">
                  <button
                    onClick={() => setShowNewCycle(false)}
                    className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    إلغاء
                  </button>
                  <button
                    onClick={handleCreateCycle}
                    className="btn-primary px-6 py-3"
                    disabled={!newCycle.name || !newCycle.birdsCount || !newCycle.breed}
                  >
                    بدء الدورة
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* عرض تفاصيل الدورة */}
      {showDetails && selectedCycle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">{selectedCycle.name}</h2>
                <div className="flex space-x-2 space-x-reverse">
                  <span className={`px-3 py-1 text-xs rounded-full ${
                    selectedCycle.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {selectedCycle.status === 'active' ? 'نشطة' : 'متوقفة'}
                  </span>
                  <button
                    onClick={() => setShowDetails(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* المعلومات الأساسية */}
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-4">المعلومات الأساسية</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-gray-600">تاريخ البدء:</span>
                      <span className="font-medium">{selectedCycle.startDate}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-gray-600">عدد الطيور:</span>
                      <span className="font-medium">{selectedCycle.currentBirds?.toLocaleString()} من {selectedCycle.birdsCount?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-gray-600">السلالة:</span>
                      <span className="font-medium">{selectedCycle.breed}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-gray-600">رقم البيت:</span>
                      <span className="font-medium">{selectedCycle.houseNumber}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-gray-600">المدة المتوقعة:</span>
                      <span className="font-medium">{selectedCycle.expectedDuration} يوم</span>
                    </div>
                  </div>
                </div>

                {/* الإحصائيات */}
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-4">الإحصائيات</h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-600">معدل النفوق</p>
                      <p className="text-2xl font-bold text-blue-700 mt-1">
                        {selectedCycle.mortality ? 
                          ((selectedCycle.mortality / selectedCycle.birdsCount) * 100).toFixed(1) : '0.0'}%
                      </p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <p className="text-sm text-green-600">استهلاك العلف</p>
                      <p className="text-2xl font-bold text-green-700 mt-1">
                        {selectedCycle.feedConsumed?.toLocaleString() || 0} كغ
                      </p>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <p className="text-sm text-purple-600">معدل التحويل</p>
                      <p className="text-2xl font-bold text-purple-700 mt-1">
                        {selectedCycle.conversionRate || '1.8'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* الملاحظات */}
              {selectedCycle.notes && (
                <div className="mt-8">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">ملاحظات</h3>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-700">{selectedCycle.notes}</p>
                  </div>
                </div>
              )}

              {/* أزرار الإجراءات */}
              <div className="mt-8 flex justify-end space-x-3 space-x-reverse pt-6 border-t">
                <button
                  onClick={() => setShowDetails(false)}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  إغلاق
                </button>
                <button
                  onClick={() => handleToggleStatus(selectedCycle.id)}
                  className={`px-6 py-3 rounded-lg transition-colors ${
                    selectedCycle.status === 'active'
                      ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                      : 'bg-green-100 text-green-800 hover:bg-green-200'
                  }`}
                >
                  {selectedCycle.status === 'active' ? 'إيقاف الدورة' : 'تفعيل الدورة'}
                </button>
                <button className="btn-primary px-6 py-3">
                  تعديل الدورة
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CyclesManagement
