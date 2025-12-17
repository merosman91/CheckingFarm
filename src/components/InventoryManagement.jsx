import React, { useState, useEffect } from 'react'

const InventoryManagement = () => {
  const [inventory, setInventory] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('all')
  const [showAddItem, setShowAddItem] = useState(false)

  const [newItem, setNewItem] = useState({
    name: '',
    category: '',
    quantity: 0,
    unit: '',
    minStock: 10,
    price: 0,
    supplier: ''
  })

  const categories = ['أعلاف', 'أدوية', 'مستلزمات', 'معدات', 'أخرى']
  const units = ['كيلو', 'لتر', 'علبة', 'قطعة', 'كيس']

  useEffect(() => {
    const savedInventory = localStorage.getItem('inventoryData')
    if (savedInventory) {
      setInventory(JSON.parse(savedInventory))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('inventoryData', JSON.stringify(inventory))
  }, [inventory])

  const handleAddItem = () => {
    const status = newItem.quantity <= newItem.minStock ? 'low' : 'good'
    const item = {
      id: Date.now(),
      ...newItem,
      status,
      lastUpdated: new Date().toISOString().split('T')[0]
    }
    
    setInventory([...inventory, item])
    setShowAddItem(false)
    setNewItem({
      name: '',
      category: '',
      quantity: 0,
      unit: '',
      minStock: 10,
      price: 0,
      supplier: ''
    })
  }

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = 
      filter === 'all' || 
      item.category === filter
    
    return matchesSearch && matchesFilter
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">إدارة المخزون</h1>
          <p className="text-gray-600 mt-1">إدارة أعلاف وأدوية ومستلزمات المزرعة</p>
        </div>
        <button 
          className="btn-secondary"
          onClick={() => setShowAddItem(true)}
        >
          + إضافة صنف
        </button>
      </div>

      {/* فلتر البحث */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="بحث باسم الصنف أو الفئة..."
                className="input-field pr-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <select 
            className="input-field w-32"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">جميع الفئات</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      {/* جدول المخزون */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">الصنف</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">الفئة</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">الكمية</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">السعر</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">الحالة</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInventory.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{item.name}</div>
                    <div className="text-sm text-gray-500">{item.supplier}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">
                      {item.quantity} {item.unit}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">
                      {item.price.toLocaleString()} ج.س
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      item.status === 'low' 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {item.status === 'low' ? 'منخفض' : 'جيد'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button className="text-red-600 hover:text-red-800 text-sm">
                      حذف
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* نافذة إضافة صنف جديد */}
      {showAddItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">إضافة صنف جديد</h2>
                <button
                  onClick={() => setShowAddItem(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    اسم الصنف
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    value={newItem.name}
                    onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الفئة
                  </label>
                  <select
                    className="input-field"
                    value={newItem.category}
                    onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                  >
                    <option value="">اختر الفئة</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الكمية
                    </label>
                    <input
                      type="number"
                      className="input-field"
                      value={newItem.quantity}
                      onChange={(e) => setNewItem({...newItem, quantity: parseInt(e.target.value) || 0})}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الوحدة
                    </label>
                    <select
                      className="input-field"
                      value={newItem.unit}
                      onChange={(e) => setNewItem({...newItem, unit: e.target.value})}
                    >
                      <option value="">اختر الوحدة</option>
                      {units.map(unit => (
                        <option key={unit} value={unit}>{unit}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      السعر (ج.س)
                    </label>
                    <input
                      type="number"
                      className="input-field"
                      value={newItem.price}
                      onChange={(e) => setNewItem({...newItem, price: parseFloat(e.target.value) || 0})}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      المورد
                    </label>
                    <input
                      type="text"
                      className="input-field"
                      value={newItem.supplier}
                      onChange={(e) => setNewItem({...newItem, supplier: e.target.value})}
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 space-x-reverse pt-4 border-t">
                  <button
                    onClick={() => setShowAddItem(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    إلغاء
                  </button>
                  <button
                    onClick={handleAddItem}
                    className="btn-primary px-4 py-2"
                  >
                    إضافة
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default InventoryManagement
