import React, { useState, useEffect } from 'react'
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Printer, 
  Edit, 
  Trash2,
  Eye,
  DollarSign,
  ShoppingCart,
  Users,
  TrendingUp
} from 'lucide-react'

const SalesManagement = () => {
  const [sales, setSales] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('all')
  const [showInvoice, setShowInvoice] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState(null)
  const [showNewSale, setShowNewSale] = useState(false)

  const [newSale, setNewSale] = useState({
    customerName: '',
    customerPhone: '',
    items: [],
    total: 0,
    paid: 0,
    paymentMethod: 'cash',
    notes: ''
  })

  const [customers] = useState([
    { id: 1, name: 'أحمد محمد', phone: '0512345678', balance: 1500 },
    { id: 2, name: 'سالم العبدلي', phone: '0567891234', balance: 3200 },
    { id: 3, name: 'فاطمة السعيد', phone: '0554321789', balance: 0 },
  ])

  const [products] = useState([
    { id: 1, name: 'دجاج حي', price: 25, unit: 'كيلو' },
    { id: 2, name: 'بيض مائدة', price: 18, unit: 'درزن' },
    { id: 3, name: 'دواجن مجمدة', price: 32, unit: 'كيلو' },
    { id: 4, name: 'صيصان', price: 8, unit: 'قطعة' },
  ])

  useEffect(() => {
    // تحميل البيانات من localStorage
    const savedSales = localStorage.getItem('salesData')
    if (savedSales) {
      setSales(JSON.parse(savedSales))
    } else {
      // بيانات تجريبية
      setSales([
        {
          id: 1,
          invoiceNumber: 'INV-2024-001',
          date: '2024-01-15',
          customerName: 'أحمد محمد',
          customerPhone: '0512345678',
          items: [
            { name: 'دجاج حي', quantity: 100, price: 25, total: 2500 },
            { name: 'بيض مائدة', quantity: 50, price: 18, total: 900 }
          ],
          subtotal: 3400,
          discount: 100,
          total: 3300,
          paid: 3300,
          due: 0,
          paymentMethod: 'cash',
          status: 'paid'
        },
        {
          id: 2,
          invoiceNumber: 'INV-2024-002',
          date: '2024-01-16',
          customerName: 'سالم العبدلي',
          customerPhone: '0567891234',
          items: [
            { name: 'دواجن مجمدة', quantity: 200, price: 32, total: 6400 }
          ],
          subtotal: 6400,
          discount: 200,
          total: 6200,
          paid: 3000,
          due: 3200,
          paymentMethod: 'credit',
          status: 'partial'
        }
      ])
    }
  }, [])

  useEffect(() => {
    // حفظ البيانات في localStorage
    localStorage.setItem('salesData', JSON.stringify(sales))
  }, [sales])

  const handleAddItem = () => {
    setNewSale({
      ...newSale,
      items: [...newSale.items, { productId: '', quantity: 1, price: 0, total: 0 }]
    })
  }

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...newSale.items]
    updatedItems[index][field] = value
    
    if (field === 'quantity' || field === 'price') {
      updatedItems[index].total = updatedItems[index].quantity * updatedItems[index].price
    }
    
    setNewSale({
      ...newSale,
      items: updatedItems,
      total: updatedItems.reduce((sum, item) => sum + item.total, 0)
    })
  }

  const handleRemoveItem = (index) => {
    const updatedItems = newSale.items.filter((_, i) => i !== index)
    setNewSale({
      ...newSale,
      items: updatedItems,
      total: updatedItems.reduce((sum, item) => sum + item.total, 0)
    })
  }

  const handleCreateSale = () => {
    const newInvoice = {
      id: sales.length + 1,
      invoiceNumber: `INV-2024-${String(sales.length + 1).padStart(3, '0')}`,
      date: new Date().toISOString().split('T')[0],
      customerName: newSale.customerName,
      customerPhone: newSale.customerPhone,
      items: newSale.items,
      subtotal: newSale.total,
      discount: 0,
      total: newSale.total,
      paid: newSale.paid,
      due: newSale.total - newSale.paid,
      paymentMethod: newSale.paymentMethod,
      status: newSale.paid >= newSale.total ? 'paid' : newSale.paid > 0 ? 'partial' : 'pending'
    }

    setSales([...sales, newInvoice])
    setShowNewSale(false)
    setNewSale({
      customerName: '',
      customerPhone: '',
      items: [],
      total: 0,
      paid: 0,
      paymentMethod: 'cash',
      notes: ''
    })
  }

  const filteredSales = sales.filter(sale => {
    const matchesSearch = 
      sale.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.customerPhone.includes(searchTerm)
    
    const matchesFilter = 
      filter === 'all' || 
      (filter === 'paid' && sale.status === 'paid') ||
      (filter === 'pending' && sale.status === 'pending') ||
      (filter === 'partial' && sale.status === 'partial')
    
    return matchesSearch && matchesFilter
  })

  const totalSales = sales.reduce((sum, sale) => sum + sale.total, 0)
  const totalPaid = sales.reduce((sum, sale) => sum + sale.paid, 0)
  const totalDue = sales.reduce((sum, sale) => sum + sale.due, 0)

  return (
    <div className="space-y-6">
      {/* رأس الصفحة */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">إدارة المبيعات</h1>
          <p className="text-gray-600 mt-1">إدارة فواتير المبيعات والمستحقات</p>
        </div>
        <div className="flex items-center space-x-3 space-x-reverse">
          <button 
            className="btn-secondary flex items-center"
            onClick={() => setShowNewSale(true)}
          >
            <Plus size={18} className="ml-2" />
            بيع جديد
          </button>
          <button className="btn-primary flex items-center">
            <Printer size={18} className="ml-2" />
            طباعة التقارير
          </button>
        </div>
      </div>

      {/* بطاقات الإحصائيات */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">إجمالي المبيعات</p>
              <p className="text-2xl font-bold text-gray-800 mt-2">
                {totalSales.toLocaleString()} ر.س
              </p>
            </div>
            <div className="p-3 rounded-lg bg-blue-50">
              <DollarSign size={24} className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">المبلغ المحصل</p>
              <p className="text-2xl font-bold text-gray-800 mt-2">
                {totalPaid.toLocaleString()} ر.س
              </p>
            </div>
            <div className="p-3 rounded-lg bg-green-50">
              <ShoppingCart size={24} className="text-green-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">المستحقات</p>
              <p className="text-2xl font-bold text-gray-800 mt-2">
                {totalDue.toLocaleString()} ر.س
              </p>
            </div>
            <div className="p-3 rounded-lg bg-red-50">
              <Users size={24} className="text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* فلتر البحث */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute right-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="بحث برقم الفاتورة أو اسم العميل..."
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
              <option value="all">جميع الحالات</option>
              <option value="paid">مدفوعة</option>
              <option value="pending">معلقة</option>
              <option value="partial">جزئية</option>
            </select>
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter size={20} className="text-gray-600" />
            </button>
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Download size={20} className="text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* جدول الفواتير */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  رقم الفاتورة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  العميل
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  التاريخ
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الإجمالي
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  المدفوع
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
              {filteredSales.map((sale) => (
                <tr key={sale.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-blue-600">{sale.invoiceNumber}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="font-medium text-gray-900">{sale.customerName}</div>
                      <div className="text-sm text-gray-500">{sale.customerPhone}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {sale.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">
                      {sale.total.toLocaleString()} ر.س
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-green-600">
                      {sale.paid.toLocaleString()} ر.س
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 text-xs rounded-full ${
                      sale.status === 'paid' 
                        ? 'bg-green-100 text-green-800' 
                        : sale.status === 'partial'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {sale.status === 'paid' ? 'مدفوعة' : 
                       sale.status === 'partial' ? 'جزئية' : 'معلقة'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2 space-x-reverse">
                      <button 
                        className="text-blue-600 hover:text-blue-900"
                        onClick={() => {
                          setSelectedInvoice(sale)
                          setShowInvoice(true)
                        }}
                      >
                        <Eye size={18} />
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        <Edit size={18} />
                      </button>
                      <button 
                        className="text-red-600 hover:text-red-900"
                        onClick={() => {
                          if (window.confirm('هل تريد حذف هذه الفاتورة؟')) {
                            setSales(sales.filter(s => s.id !== sale.id))
                          }
                        }}
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
      </div>

      {/* نافذة إنشاء فاتورة جديدة */}
      {showNewSale && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">فاتورة بيع جديدة</h2>
                <button
                  onClick={() => setShowNewSale(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* معلومات العميل */}
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-4">معلومات العميل</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        اسم العميل
                      </label>
                      <select
                        className="input-field"
                        value={newSale.customerName}
                        onChange={(e) => setNewSale({...newSale, customerName: e.target.value})}
                      >
                        <option value="">اختر عميلاً</option>
                        {customers.map(customer => (
                          <option key={customer.id} value={customer.name}>
                            {customer.name} ({customer.phone})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        رقم الهاتف
                      </label>
                      <input
                        type="tel"
                        className="input-field"
                        value={newSale.customerPhone}
                        onChange={(e) => setNewSale({...newSale, customerPhone: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                {/* طريقة الدفع */}
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-4">طريقة الدفع</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        طريقة الدفع
                      </label>
                      <select
                        className="input-field"
                        value={newSale.paymentMethod}
                        onChange={(e) => setNewSale({...newSale, paymentMethod: e.target.value})}
                      >
                        <option value="cash">نقدي</option>
                        <option value="credit">آجل</option>
                        <option value="transfer">تحويل بنكي</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        المبلغ المدفوع (ر.س)
                      </label>
                      <input
                        type="number"
                        className="input-field"
                        value={newSale.paid}
                        onChange={(e) => setNewSale({...newSale, paid: parseFloat(e.target.value) || 0})}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* العناصر */}
              <div className="mt-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-800">المنتجات</h3>
                  <button
                    onClick={handleAddItem}
                    className="flex items-center text-blue-600 hover:text-blue-800"
                  >
                    <Plus size={18} className="ml-1" />
                    إضافة منتج
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          المنتج
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          الكمية
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          السعر
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          الإجمالي
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          إجراء
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {newSale.items.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3">
                            <select
                              className="input-field"
                              value={item.productId}
                              onChange={(e) => {
                                const product = products.find(p => p.id == e.target.value)
                                handleItemChange(index, 'productId', e.target.value)
                                handleItemChange(index, 'price', product ? product.price : 0)
                              }}
                            >
                              <option value="">اختر منتجاً</option>
                              {products.map(product => (
                                <option key={product.id} value={product.id}>
                                  {product.name} - {product.price} ر.س / {product.unit}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="number"
                              className="input-field"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 0)}
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="number"
                              className="input-field"
                              value={item.price}
                              onChange={(e) => handleItemChange(index, 'price', parseFloat(e.target.value) || 0)}
                            />
                          </td>
                          <td className="px-4 py-3 font-medium">
                            {item.total.toLocaleString()} ر.س
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => handleRemoveItem(index)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* الملخص */}
              <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-800">ملخص الفاتورة</h3>
                  <div className="text-2xl font-bold text-blue-600">
                    {newSale.total.toLocaleString()} ر.س
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">المبلغ المستحق:</span>
                      <span className="font-medium">{newSale.total.toLocaleString()} ر.س</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">المبلغ المدفوع:</span>
                      <span className="font-medium text-green-600">{newSale.paid.toLocaleString()} ر.س</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">المبلغ المتبقي:</span>
                      <span className="font-medium text-red-600">
                        {(newSale.total - newSale.paid).toLocaleString()} ر.س
                      </span>
                    </div>
                  </div>
                  <div>
                    <textarea
                      placeholder="ملاحظات..."
                      className="input-field h-24"
                      value={newSale.notes}
                      onChange={(e) => setNewSale({...newSale, notes: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              {/* أزرار التنفيذ */}
              <div className="mt-8 flex justify-end space-x-3 space-x-reverse">
                <button
                  onClick={() => setShowNewSale(false)}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleCreateSale}
                  className="btn-primary px-6 py-3"
                  disabled={newSale.items.length === 0 || !newSale.customerName}
                >
                  حفظ الفاتورة
                </button>
                <button
                  onClick={handleCreateSale}
                  className="btn-secondary px-6 py-3"
                  disabled={newSale.items.length === 0 || !newSale.customerName}
                >
                  حفظ وطباعة
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* عرض الفاتورة */}
      {showInvoice && selectedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full">
            <div className="p-8">
              {/* رأس الفاتورة */}
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">فاتورة بيع</h2>
                  <p className="text-gray-600">{selectedInvoice.invoiceNumber}</p>
                </div>
                <div className="text-left">
                  <div className="h-16 w-16 bg-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-xl">د</span>
                  </div>
                </div>
              </div>

              {/* معلومات الفاتورة */}
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div>
                  <h3 className="font-medium text-gray-800 mb-2">معلومات العميل</h3>
                  <p className="text-gray-600">{selectedInvoice.customerName}</p>
                  <p className="text-gray-600">{selectedInvoice.customerPhone}</p>
                </div>
                <div className="text-left">
                  <h3 className="font-medium text-gray-800 mb-2">معلومات الفاتورة</h3>
                  <p className="text-gray-600">التاريخ: {selectedInvoice.date}</p>
                  <p className="text-gray-600">الحالة: {
                    selectedInvoice.status === 'paid' ? 'مدفوعة' : 
                    selectedInvoice.status === 'partial' ? 'جزئية' : 'معلقة'
                  }</p>
                </div>
              </div>

              {/* جدول المنتجات */}
              <div className="mb-8">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="py-3 px-4 text-right font-medium text-gray-700">المنتج</th>
                      <th className="py-3 px-4 text-right font-medium text-gray-700">الكمية</th>
                      <th className="py-3 px-4 text-right font-medium text-gray-700">السعر</th>
                      <th className="py-3 px-4 text-right font-medium text-gray-700">الإجمالي</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedInvoice.items.map((item, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-3 px-4">{item.name}</td>
                        <td className="py-3 px-4">{item.quantity}</td>
                        <td className="py-3 px-4">{item.price.toLocaleString()} ر.س</td>
                        <td className="py-3 px-4">{item.total.toLocaleString()} ر.س</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* الملخص */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span>الإجمالي:</span>
                  <span className="font-medium">{selectedInvoice.subtotal.toLocaleString()} ر.س</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>الخصم:</span>
                  <span className="font-medium text-red-600">-{selectedInvoice.discount.toLocaleString()} ر.س</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>المجموع:</span>
                  <span className="font-bold text-lg">{selectedInvoice.total.toLocaleString()} ر.س</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>المدفوع:</span>
                  <span className="font-medium text-green-600">{selectedInvoice.paid.toLocaleString()} ر.س</span>
                </div>
                <div className="flex justify-between">
                  <span>المتبقي:</span>
                  <span className="font-medium text-red-600">{selectedInvoice.due.toLocaleString()} ر.س</span>
                </div>
              </div>

              {/* أزرار */}
              <div className="mt-8 flex justify-end space-x-3 space-x-reverse">
                <button
                  onClick={() => setShowInvoice(false)}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  إغلاق
                </button>
                <button className="btn-primary px-6 py-3 flex items-center">
                  <Printer size={18} className="ml-2" />
                  طباعة
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SalesManagement
