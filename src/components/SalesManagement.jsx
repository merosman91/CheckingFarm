import React, { useState, useEffect } from 'react'

const SalesManagement = () => {
  const [sales, setSales] = useState([])
  const [customers, setCustomers] = useState([])
  const [showNewSale, setShowNewSale] = useState(false)
  const [newCustomer, setNewCustomer] = useState('')
  const [newCustomerPhone, setNewCustomerPhone] = useState('')

  const [newSale, setNewSale] = useState({
    customerName: '',
    customerPhone: '',
    items: [],
    total: 0,
    paid: 0,
    paymentMethod: 'cash'
  })

  useEffect(() => {
    const savedSales = localStorage.getItem('salesData')
    const savedCustomers = localStorage.getItem('customersData')
    
    if (savedSales) setSales(JSON.parse(savedSales))
    if (savedCustomers) setCustomers(JSON.parse(savedCustomers))
  }, [])

  useEffect(() => {
    localStorage.setItem('salesData', JSON.stringify(sales))
    localStorage.setItem('customersData', JSON.stringify(customers))
  }, [sales, customers])

  const handleAddCustomer = () => {
    if (newCustomer.trim() && newCustomerPhone.trim()) {
      const customer = {
        id: Date.now(),
        name: newCustomer,
        phone: newCustomerPhone
      }
      setCustomers([...customers, customer])
      setNewSale({
        ...newSale,
        customerName: newCustomer,
        customerPhone: newCustomerPhone
      })
      setNewCustomer('')
      setNewCustomerPhone('')
    }
  }

  const handleCreateSale = () => {
    const invoice = {
      id: Date.now(),
      invoiceNumber: `INV-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      customerName: newSale.customerName,
      customerPhone: newSale.customerPhone,
      items: newSale.items,
      total: newSale.total,
      paid: newSale.paid,
      due: newSale.total - newSale.paid,
      paymentMethod: newSale.paymentMethod,
      status: newSale.paid >= newSale.total ? 'paid' : 'partial'
    }

    setSales([...sales, invoice])
    setShowNewSale(false)
    setNewSale({
      customerName: '',
      customerPhone: '',
      items: [],
      total: 0,
      paid: 0,
      paymentMethod: 'cash'
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">إدارة المبيعات</h1>
          <p className="text-gray-600 mt-1">إدارة فواتير المبيعات والمستحقات</p>
        </div>
        <button 
          className="btn-secondary"
          onClick={() => setShowNewSale(true)}
        >
          + بيع جديد
        </button>
      </div>

      {/* نافذة إنشاء فاتورة جديدة */}
      {showNewSale && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
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

              {/* إضافة عميل جديد */}
              <div className="mb-6 p-4 border border-gray-200 rounded-lg">
                <h3 className="font-medium text-gray-800 mb-3">إضافة عميل جديد</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    className="input-field"
                    placeholder="اسم العميل"
                    value={newCustomer}
                    onChange={(e) => setNewCustomer(e.target.value)}
                  />
                  <input
                    type="tel"
                    className="input-field"
                    placeholder="رقم الهاتف"
                    value={newCustomerPhone}
                    onChange={(e) => setNewCustomerPhone(e.target.value)}
                  />
                </div>
                <button
                  onClick={handleAddCustomer}
                  className="mt-3 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  إضافة العميل
                </button>
              </div>

              {/* اختيار عميل */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  اختر عميلاً
                </label>
                <select
                  className="input-field"
                  value={newSale.customerName}
                  onChange={(e) => {
                    const customer = customers.find(c => c.name === e.target.value)
                    setNewSale({
                      ...newSale,
                      customerName: e.target.value,
                      customerPhone: customer?.phone || ''
                    })
                  }}
                >
                  <option value="">اختر عميلاً</option>
                  {customers.map(customer => (
                    <option key={customer.id} value={customer.name}>
                      {customer.name} ({customer.phone})
                    </option>
                  ))}
                </select>
              </div>

              {/* طريقة الدفع */}
              <div className="mb-6">
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
                </select>
              </div>

              {/* أزرار التنفيذ */}
              <div className="flex justify-end space-x-3 space-x-reverse pt-6 border-t">
                <button
                  onClick={() => setShowNewSale(false)}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleCreateSale}
                  className="btn-primary px-6 py-3"
                  disabled={!newSale.customerName}
                >
                  حفظ الفاتورة
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* قائمة الفواتير */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">رقم الفاتورة</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">العميل</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">التاريخ</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">الإجمالي</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">الحالة</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sales.map((sale) => (
                <tr key={sale.id}>
                  <td className="px-4 py-3">
                    <div className="font-medium text-blue-600">{sale.invoiceNumber}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{sale.customerName}</div>
                    <div className="text-sm text-gray-500">{sale.customerPhone}</div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {sale.date}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">
                      {sale.total.toLocaleString()} ج.س
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      sale.status === 'paid' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {sale.status === 'paid' ? 'مدفوعة' : 'جزئية'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default SalesManagement
