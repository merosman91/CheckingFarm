import React, { useState, useEffect } from 'react'
import { 
  Plus, 
  Package, 
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  Filter,
  RefreshCw,
  Edit,
  Trash2
} from 'lucide-react'

const InventoryManagement = () => {
  const [inventory, setInventory] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('all')
  const [showAddItem, setShowAddItem] = useState(false)
  const [showLowStock, setShowLowStock] = useState(true)

  const [newItem, setNewItem] = useState({
    name: '',
    category: '',
    quantity: 0,
    unit: '',
    minStock: 10,
    price: 0,
    supplier: '',
    notes: ''
  })

  const categories = [
    'أعلاف', 'أدوية', 'مستلزمات', 'معدات', 'أخرى'
  ]

  const units = ['كيلو', 'لتر', 'علبة', 'قطعة', 'كيس']

  useEffect(() => {
    const savedInventory = localStorage.getItem('inventoryData')
    if (savedInventory) {
      setInventory(JSON.parse(savedInventory))
    } else {
      // بيانات تجريبية
      setInventory([
        {
          id: 1,
          name: 'علف نامي',
          category: 'أعلاف',
          quantity: 850,
          unit: 'كيس',
          minStock: 100,
          price: 120,
          supplier: 'شركة الأعلاف المتحدة',
          lastUpdated: '2024-01-15',
          status: 'low'
        },
        {
          id: 2,
          name: 'فيتامين أ',
          category: 'أدوية',
          quantity: 45,
          unit: 'علبة',
          minStock: 20,
          price: 85,
          supplier: 'مختبرات الصحة الحيوانية',
          lastUpdated: '2024-01-16',
          status: 'good'
        },
        {
          id: 3,
          name: 'مضاد حيوي',
          category: 'أدوية',
          quantity: 15,
          unit: 'علبة',
          minStock: 25,
          price: 120,
          supplier: 'مختبرات الصحة الحيوانية',
          lastUpdated: '2024-01-10',
          status: 'low'
        }
      ])
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('inventoryData', JSON.stringify(inventory))
  }, [inventory])

  const handleAddItem = () => {
    const status = newItem.quantity <= newItem.minStock ? 'low' : 'good'
    const item = {
      id: inventory.length + 1,
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
      supplier: '',
      notes: ''
    })
  }

  const handleUpdateStock = (id, change) => {
    setInventory(inventory.map(item => {
      if (item.id === id) {
        const newQuantity = item.quantity + change
        return {
          ...item,
          quantity: newQuantity,
          status: newQuantity <= item.minStock ? 'low' : 'good',
          lastUpdated: new Date().toISOString().split('T')[0]
        }
      }
      return item
    }))
  }

  const lowStockItems = inventory.filter(item => item.status === 'low')
  const totalValue = inventory.reduce((sum, item) => sum + (item.quantity * item.price), 0)

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
      {/* رأس الصفحة */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">إدارة المخزون</h1>
          <p className="text-gray-600 mt-1">إدارة أعلاف وأدوية ومستلزمات المزرعة</p>
        </div>
        <div className="flex items-center space-x-3 space-x-reverse">
          <button 
            className="btn-secondary flex items-center"
            onClick={() => setShowAddItem(true)}
          >
            <Plus size={18} className="ml-2" />
            إضافة صنف
          </button>
        </div>
      </div>

      {/* بطاقات الإحصائيات */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">إجمالي الأصناف</p>
              <p className="text-2xl font-bold text-gray-800 mt-2">
                {inventory.length}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-blue-50">
              <Package size={24} className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">قيمة المخزون</p>
              <p className="text-2xl font-bold text-gray-800 mt-2">
                {totalValue.toLocaleString()} ر.س
              </p>
            </div>
            <div className="p-3 rounded-lg bg-green-50">
              <ArrowUpRight size={24} className="text-green-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">أصناف منخفضة</p>
              <p className="text-2xl font-bold text-gray-800 mt-2">
                {lowStockItems.length}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-red-50">
              <ArrowDownRight size={24} className="text-red-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">آخر تحديث</p>
              <p className="text-2xl font-bold text-gray-800 mt-2">
                {new Date().toLocaleDateString('ar-SA', { day: 'numeric', month: 'short' })}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-purple-50">
              <RefreshCw size={24} className="text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* تحذيرات المخزون المنخفض */}
      {showLowStock && lowStockItems.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center">
              <AlertTriangle className="text-red-600 ml-2" size={20} />
              <h3 className="text-red-800 font-medium">تحذير: مخزون منخفض</h3>
            </div>
            <button 
              onClick={() => setShowLowStock(false)}
              className="text-red-600 hover:text-red-800"
            >
              ✕
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {lowStockItems.slice(0, 4).map(item => (
              <div key={item.id} className="bg-white p-3 rounded-lg border border-red-100">
                <p className="font-medium text-red-800">{item.name}</p>
                <p className="text-sm text-red-600">
                  المخزون: {item.quantity} {item.unit} (الحد الأدنى: {item.minStock})
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* فلتر البحث */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute right-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="بحث باسم الصنف أو الفئة..."
                className="input-field pr-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex space-x-3 space-x-reverse">
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
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter size={20} className="text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* جدول المخزون */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الصنف
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الفئة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الكمية
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الحد الأدنى
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  السعر
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
              {filteredInventory.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{item.name}</div>
                    <div className="text-sm text-gray-500">{item.supplier}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 text-xs rounded-full ${
                      item.category === 'أعلاف' ? 'bg-green-100 text-green-800' :
                      item.category === 'أدوية' ? 'bg-blue-100 text-blue-800' :
                      item.category === 'مستلزمات' ? 'bg-yellow-100 text-yellow-800' :
                      item.category === 'معدات' ? 'bg-purple-100 text-purple-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">
                      {item.quantity} {item.unit}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.minStock} {item.unit}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">
                      {item.price.toLocaleString()} ر.س
                    </div>
                    <div className="text-sm text-gray-500">
                      {(item.quantity * item.price).toLocaleString()} ر.س
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 text-xs rounded-full ${
                      item.status === 'low' 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {item.status === 'low' ? 'منخفض' : 'جيد'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2 space-x-reverse">
                      <button 
                        className="text-green-600 hover:text-green-900"
                        onClick={() => handleUpdateStock(item.id, 1)}
                      >
                        +
                      </button>
                      <button 
                        className="text-red-600 hover:text-red-900"
                        onClick={() => handleUpdateStock(item.id, -1)}
                      >
                        -
                      </button>
                      <button className="text-blue-600 hover:text-blue-900">
                        <Edit size={16} />
                      </button>
                      <button 
                        className="text-red-600 hover:text-red-900"
                        onClick={() => {
                          if (window.confirm('هل تريد حذف هذا الصنف؟')) {
                            setInventory(inventory.filter(i => i.id !== item.id))
                          }
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
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
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">إضافة صنف جديد</h2>
                <button
                  onClick={() => setShowAddItem(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      اسم الصنف *
                    </label>
                    <input
                      type="text"
                      className="input-field"
                      value={newItem.name}
                      onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                      placeholder="مثال: علف نامي"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الفئة *
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
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الكمية *
                    </label>
                    <input
                      type="number"
                      className="input-field"
                      value={newItem.quantity}
                      onChange={(e) => setNewItem({...newItem, quantity: parseInt(e.target.value) || 0})}
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      وحدة القياس *
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الحد الأدنى للمخزون *
                    </label>
                    <input
                      type="number"
                      className="input-field"
                      value={newItem.minStock}
                      onChange={(e) => setNewItem({...newItem, minStock: parseInt(e.target.value) || 10})}
                      min="1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      السعر (ر.س) *
                    </label>
                    <input
                      type="number"
                      className="input-field"
                      value={newItem.price}
                      onChange={(e) => setNewItem({...newItem, price: parseFloat(e.target.value) || 0})}
                      min="0"
                      step="0.01"
                    />
                  </div>
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
                    placeholder="اسم المورد"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ملاحظات
                  </label>
                  <textarea
                    className="input-field h-24"
                    value={newItem.notes}
                    onChange={(e) => setNewItem({...newItem, notes: e.target.value})}
                    placeholder="أي ملاحظات إضافية..."
                  />
                </div>

                <div className="flex justify-end space-x-3 space-x-reverse pt-6 border-t">
                  <button
                    onClick={() => setShowAddItem(false)}
                    className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    إلغاء
                  </button>
                  <button
                    onClick={handleAddItem}
                    className="btn-primary px-6 py-3"
                    disabled={!newItem.name || !newItem.category || !newItem.unit}
                  >
                    إضافة الصنف
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
