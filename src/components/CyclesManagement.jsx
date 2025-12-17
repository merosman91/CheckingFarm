import React, { useState, useEffect } from 'react'

const CyclesManagement = () => {
  const [cycles, setCycles] = useState([])
  const [showNewCycle, setShowNewCycle] = useState(false)
  const [selectedCycle, setSelectedCycle] = useState(null)
  const [showDetails, setShowDetails] = useState(false)
  const [editingCycle, setEditingCycle] = useState(null)
  const [editForm, setEditForm] = useState({
    name: '',
    birdsCount: 0,
    breed: '',
    houseNumber: '',
    notes: ''
  })

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
      id: Date.now(),
      ...newCycle,
      status: 'active',
      currentBirds: newCycle.birdsCount,
      mortality: 0,
      feedConsumed: 0,
      medicinesUsed: [],
      sales: [],
      expenses: [],
      createdAt: new Date().toISOString(),
      conversionRate: 1.8
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

  const handleEditCycle = (cycle) => {
    setEditingCycle(cycle)
    setEditForm({
      name: cycle.name,
      birdsCount: cycle.birdsCount,
      breed: cycle.breed,
      houseNumber: cycle.houseNumber,
      notes: cycle.notes || ''
    })
  }

  const handleSaveEdit = () => {
    if (editingCycle) {
      setCycles(cycles.map(cycle => 
        cycle.id === editingCycle.id 
          ? { ...cycle, ...editForm, currentBirds: editForm.birdsCount }
          : cycle
      ))
      setEditingCycle(null)
      setEditForm({
        name: '',
        birdsCount: 0,
        breed: '',
        houseNumber: '',
        notes: ''
      })
    }
  }

  const handleToggleStatus = (id) => {
    setCycles(cycles.map(cycle => {
      if (cycle.id === id) {
        const updatedCycle = { 
          ...cycle, 
          status: cycle.status === 'active' ? 'inactive' : 'active'
        }
        if (updatedCycle.status === 'inactive') {
          updatedCycle.endDate = new Date().toISOString().split('T')[0]
        }
        return updatedCycle
      }
      return cycle
    }))
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
        <button 
          className="btn-secondary"
          onClick={() => setShowNewCycle(true)}
        >
          + دورة جديدة
        </button>
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
              <img src="/icons/play.svg" alt="نشطة" className="h-6 w-6" />
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
              <img src="/icons/pause.svg" alt="متوقفة" className="h-6 w-6" />
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
              <img src="/icons/trending-up.svg" alt="إجمالي" className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

      {/* الدورات النشطة */}
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">الدورات النشطة</h2>
        </div>

        {activeCycles.length === 0 ? (
          <div className="text-center py-12">
            <div className="h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <img src="/icons/users.svg" alt="لا توجد دورات" className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">لا توجد دورات نشطة</h3>
            <p className="mt-2 text-gray-500">ابدأ بإضافة دورة جديدة لتربية الدواجن.</p>
            <button 
              className="mt-4 btn-secondary"
              onClick={() => setShowNewCycle(true)}
            >
              + إضافة دورة جديدة
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">اسم الدورة</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">تاريخ البدء</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">عدد الطيور</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">السلالة</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">الحالة</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {activeCycles.map((cycle) => (
                  <tr key={cycle.id}>
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{cycle.name}</div>
                      <div className="text-sm text-gray-500">بيت رقم: {cycle.houseNumber}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {cycle.startDate}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">
                        {cycle.currentBirds.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        من {cycle.birdsCount.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {cycle.breed}
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                        نشطة
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-2 space-x-reverse">
                        <button 
                          className="text-blue-600 hover:text-blue-900 text-sm"
                          onClick={() => {
                            setSelectedCycle(cycle)
                            setShowDetails(true)
                          }}
                        >
                          عرض
                        </button>
                        <button 
                          className="text-yellow-600 hover:text-yellow-900 text-sm"
                          onClick={() => handleEditCycle(cycle)}
                        >
                          تعديل
                        </button>
                        <button 
                          className="text-red-600 hover:text-red-900 text-sm"
                          onClick={() => handleDeleteCycle(cycle.id)}
                        >
                          حذف
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

      {/* تعديل الدورة */}
      {editingCycle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">تعديل الدورة</h2>
                <button
                  onClick={() => setEditingCycle(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    اسم الدورة
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    value={editForm.name}
                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    عدد الطيور
                  </label>
                  <input
                    type="number"
                    className="input-field"
                    value={editForm.birdsCount}
                    onChange={(e) => setEditForm({...editForm, birdsCount: parseInt(e.target.value) || 0})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    السلالة
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    value={editForm.breed}
                    onChange={(e) => setEditForm({...editForm, breed: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    رقم البيت
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    value={editForm.houseNumber}
                    onChange={(e) => setEditForm({...editForm, houseNumber: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ملاحظات
                  </label>
                  <textarea
                    className="input-field h-24"
                    value={editForm.notes}
                    onChange={(e) => setEditForm({...editForm, notes: e.target.value})}
                  />
                </div>

                <div className="flex justify-end space-x-3 space-x-reverse pt-4 border-t">
                  <button
                    onClick={() => setEditingCycle(null)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    إلغاء
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    className="btn-primary px-4 py-2"
                  >
                    حفظ التعديلات
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* الدورات المنتهية */}
      {inactiveCycles.length > 0 && (
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">الدورات المنتهية</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">اسم الدورة</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">الفترة</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">عدد الطيور</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">الإيرادات</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {inactiveCycles.slice(0, 5).map((cycle) => (
                  <tr key={cycle.id}>
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{cycle.name}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {cycle.startDate} - {cycle.endDate || 'حالياً'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">
                        {cycle.currentBirds?.toLocaleString() || 0} طائر
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-green-600">
                        {(cycle.sales?.reduce((sum, s) => sum + s.amount, 0) || 0).toLocaleString()} ج.س
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
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">دورة جديدة</h2>
                <button
                  onClick={() => setShowNewCycle(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    اسم الدورة
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
                    تاريخ البدء
                  </label>
                  <input
                    type="date"
                    className="input-field"
                    value={newCycle.startDate}
                    onChange={(e) => setNewCycle({...newCycle, startDate: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    عدد الطيور
                  </label>
                  <input
                    type="number"
                    className="input-field"
                    value={newCycle.birdsCount}
                    onChange={(e) => setNewCycle({...newCycle, birdsCount: parseInt(e.target.value) || 0})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    السلالة
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

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      رقم البيت
                    </label>
                    <input
                      type="text"
                      className="input-field"
                      value={newCycle.houseNumber}
                      onChange={(e) => setNewCycle({...newCycle, houseNumber: e.target.value})}
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
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ملاحظات
                  </label>
                  <textarea
                    className="input-field h-24"
                    value={newCycle.notes}
                    onChange={(e) => setNewCycle({...newCycle, notes: e.target.value})}
                  />
                </div>

                <div className="flex justify-end space-x-3 space-x-reverse pt-4 border-t">
                  <button
                    onClick={() => setShowNewCycle(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    إلغاء
                  </button>
                  <button
                    onClick={handleCreateCycle}
                    className="btn-primary px-4 py-2"
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
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">{selectedCycle.name}</h2>
                <div className="flex space-x-2 space-x-reverse">
                  <span className={`px-2 py-1 text-xs rounded-full ${
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

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">تاريخ البدء</p>
                    <p className="font-medium">{selectedCycle.startDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">عدد الطيور</p>
                    <p className="font-medium">{selectedCycle.currentBirds?.toLocaleString() || 0}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">السلالة</p>
                    <p className="font-medium">{selectedCycle.breed}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">رقم البيت</p>
                    <p className="font-medium">{selectedCycle.houseNumber}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-600">معدل النفوق</p>
                    <p className="text-lg font-bold text-blue-700">
                      {selectedCycle.mortality ? 
                        ((selectedCycle.mortality / selectedCycle.birdsCount) * 100).toFixed(1) : '0.0'}%
                    </p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-600">استهلاك العلف</p>
                    <p className="text-lg font-bold text-green-700">
                      {selectedCycle.feedConsumed?.toLocaleString() || 0} كغ
                    </p>
                  </div>
                </div>

                {selectedCycle.notes && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">ملاحظات</p>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-gray-700">{selectedCycle.notes}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3 space-x-reverse pt-6 border-t mt-6">
                <button
                  onClick={() => setShowDetails(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  إغلاق
                </button>
                <button
                  onClick={() => {
                    handleToggleStatus(selectedCycle.id)
                    setShowDetails(false)
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {selectedCycle.status === 'active' ? 'إيقاف الدورة' : 'تفعيل الدورة'}
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
