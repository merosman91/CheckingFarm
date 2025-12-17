import React, { useState, useEffect } from 'react'
import { 
  Plus, 
  DollarSign,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Calendar,
  Filter,
  Download,
  PieChart,
  BarChart3,
  Wallet,
  Repeat,
  Eye,
  Edit,
  Trash2
} from 'lucide-react'

const FinancialManagement = () => {
  const [transactions, setTransactions] = useState([])
  const [expenses, setExpenses] = useState([])
  const [incomes, setIncomes] = useState([])
  const [activeTab, setActiveTab] = useState('overview')
  const [showNewTransaction, setShowNewTransaction] = useState(false)
  const [filter, setFilter] = useState('all')

  const [newTransaction, setNewTransaction] = useState({
    type: 'expense',
    category: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    description: '',
    paymentMethod: 'cash',
    reference: '',
    attachments: []
  })

  const expenseCategories = [
    'علف', 'أدوية', 'مستلزمات', 'رواتب', 'صيانة', 'كهرباء', 'ماء', 'نقل', 'أخرى'
  ]

  const incomeCategories = [
    'مبيعات دواجن', 'مبيعات بيض', 'مبيعات مستلزمات', 'إيرادات أخرى'
  ]

  useEffect(() => {
    const savedData = localStorage.getItem('financialData')
    if (savedData) {
      const data = JSON.parse(savedData)
      setTransactions(data.transactions || [])
      setExpenses(data.expenses || [])
      setIncomes(data.incomes || [])
    }
  }, [])

  useEffect(() => {
    const data = {
      transactions,
      expenses,
      incomes
    }
    localStorage.setItem('financialData', JSON.stringify(data))
  }, [transactions, expenses, incomes])

  const handleAddTransaction = () => {
    const transaction = {
      id: transactions.length + 1,
      ...newTransaction,
      status: 'completed',
      createdAt: new Date().toISOString()
    }

    if (newTransaction.type === 'expense') {
      setExpenses([...expenses, transaction])
    } else {
      setIncomes([...incomes, transaction])
    }

    setTransactions([...transactions, transaction])
    setShowNewTransaction(false)
    setNewTransaction({
      type: 'expense',
      category: '',
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      description: '',
      paymentMethod: 'cash',
      reference: '',
      attachments: []
    })
  }

  const totalIncome = incomes.reduce((sum, item) => sum + item.amount, 0)
  const totalExpense = expenses.reduce((sum, item) => sum + item.amount, 0)
  const balance = totalIncome - totalExpense

  const filteredTransactions = transactions.filter(transaction => {
    if (filter === 'all') return true
    if (filter === 'expenses') return transaction.type === 'expense'
    if (filter === 'incomes') return transaction.type === 'income'
    return transaction.category === filter
  })

  const monthlyExpenses = expenses.reduce((acc, expense) => {
    const month = expense.date.substring(0, 7)
    acc[month] = (acc[month] || 0) + expense.amount
    return acc
  }, {})

  const monthlyIncomes = incomes.reduce((acc, income) => {
    const month = income.date.substring(0, 7)
    acc[month] = (acc[month] || 0) + income.amount
    return acc
  }, {})

  return (
    <div className="space-y-6">
      {/* رأس الصفحة */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">الشؤون المالية</h1>
          <p className="text-gray-600 mt-1">إدارة المصروفات والإيرادات والموازنة</p>
        </div>
        <div className="flex items-center space-x-3 space-x-reverse">
          <button 
            className="btn-secondary flex items-center"
            onClick={() => setShowNewTransaction(true)}
          >
            <Plus size={18} className="ml-2" />
            معاملة جديدة
          </button>
          <button className="btn-primary flex items-center">
            <Download size={18} className="ml-2" />
            تقرير مالي
          </button>
        </div>
      </div>

      {/* بطاقات الإحصائيات */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">إجمالي الإيرادات</p>
              <p className="text-2xl font-bold text-gray-800 mt-2">
                {totalIncome.toLocaleString()} ر.س
              </p>
              <div className="flex items-center mt-2">
                <TrendingUp size={16} className="text-green-500 ml-1" />
                <span className="text-sm text-green-600">+12.5%</span>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-green-50">
              <TrendingUp size={24} className="text-green-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">إجمالي المصروفات</p>
              <p className="text-2xl font-bold text-gray-800 mt-2">
                {totalExpense.toLocaleString()} ر.س
              </p>
              <div className="flex items-center mt-2">
                <TrendingDown size={16} className="text-red-500 ml-1" />
                <span className="text-sm text-red-600">-3.2%</span>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-red-50">
              <TrendingDown size={24} className="text-red-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">الرصيد الحالي</p>
              <p className={`text-2xl font-bold mt-2 ${
                balance >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {balance.toLocaleString()} ر.س
              </p>
              <p className="text-sm text-gray-500 mt-1">من بداية العام</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-50">
              <Wallet size={24} className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">المعاملات الشهرية</p>
              <p className="text-2xl font-bold text-gray-800 mt-2">
                {transactions.length}
              </p>
              <p className="text-sm text-gray-500 mt-1">هذا الشهر</p>
            </div>
            <div className="p-3 rounded-lg bg-purple-50">
              <Repeat size={24} className="text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* تنقل بين التبويبات */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 space-x-reverse">
          {[
            { id: 'overview', label: 'نظرة عامة', icon: PieChart },
            { id: 'transactions', label: 'المعاملات', icon: CreditCard },
            { id: 'expenses', label: 'المصروفات', icon: TrendingDown },
            { id: 'incomes', label: 'الإيرادات', icon: TrendingUp },
            { id: 'reports', label: 'التقارير', icon: BarChart3 }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon size={18} className="ml-2" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* محتوى التبويبات */}
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* مخطط توزيع المصروفات */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">توزيع المصروفات</h2>
              <div className="space-y-4">
                {expenseCategories.map(category => {
                  const categoryExpenses = expenses.filter(e => e.category === category)
                  const total = categoryExpenses.reduce((sum, e) => sum + e.amount, 0)
                  const percentage = totalExpense > 0 ? (total / totalExpense * 100).toFixed(1) : 0
                  
                  return total > 0 && (
                    <div key={category} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-700">{category}</span>
                        <span className="text-sm text-gray-600">{percentage}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-red-500 rounded-full"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{total.toLocaleString()} ر.س</span>
                        <span>{categoryExpenses.length} معاملة</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* مخطط توزيع الإيرادات */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">توزيع الإيرادات</h2>
              <div className="space-y-4">
                {incomeCategories.map(category => {
                  const categoryIncomes = incomes.filter(i => i.category === category)
                  const total = categoryIncomes.reduce((sum, i) => sum + i.amount, 0)
                  const percentage = totalIncome > 0 ? (total / totalIncome * 100).toFixed(1) : 0
                  
                  return total > 0 && (
                    <div key={category} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-700">{category}</span>
                        <span className="text-sm text-gray-600">{percentage}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-green-500 rounded-full"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{total.toLocaleString()} ر.س</span>
                        <span>{categoryIncomes.length} معاملة</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* ملخص مالي */}
            <div className="lg:col-span-2 card">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">ملخص مالي - الشهر الحالي</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">أعلى مصروف</p>
                  <p className="text-xl font-bold text-gray-800 mt-2">
                    {expenses.length > 0 
                      ? Math.max(...expenses.map(e => e.amount)).toLocaleString() 
                      : 0} ر.س
                  </p>
                  <p className="text-sm text-gray-500 mt-1">على {expenses.find(e => e.amount === Math.max(...expenses.map(e => e.amount)))?.category || '--'}</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">أعلى إيراد</p>
                  <p className="text-xl font-bold text-gray-800 mt-2">
                    {incomes.length > 0 
                      ? Math.max(...incomes.map(i => i.amount)).toLocaleString() 
                      : 0} ر.س
                  </p>
                  <p className="text-sm text-gray-500 mt-1">من {incomes.find(i => i.amount === Math.max(...incomes.map(i => i.amount)))?.category || '--'}</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">متوسط التدفق النقدي</p>
                  <p className="text-xl font-bold text-gray-800 mt-2">
                    {transactions.length > 0 
                      ? ((totalIncome + totalExpense) / transactions.length).toFixed(0).toLocaleString() 
                      : 0} ر.س
                  </p>
                  <p className="text-sm text-gray-500 mt-1">لكل معاملة</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'transactions' && (
          <>
            {/* فلتر البحث */}
            <div className="card">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="بحث في المعاملات..."
                      className="input-field pr-10"
                    />
                  </div>
                </div>
                <div className="flex space-x-3 space-x-reverse">
                  <select 
                    className="input-field w-32"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                  >
                    <option value="all">جميع المعاملات</option>
                    <option value="expenses">المصروفات</option>
                    <option value="incomes">الإيرادات</option>
                    {[...expenseCategories, ...incomeCategories].map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <Filter size={20} className="text-gray-600" />
                  </button>
                </div>
              </div>
            </div>

            {/* جدول المعاملات */}
            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        التاريخ
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        الوصف
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        الفئة
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        نوع الدفع
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        المبلغ
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        الإجراءات
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredTransactions.slice(0, 10).map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {transaction.date}
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">{transaction.description}</div>
                          <div className="text-sm text-gray-500">{transaction.reference}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 text-xs rounded-full ${
                            transaction.type === 'expense'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {transaction.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {transaction.paymentMethod === 'cash' ? 'نقدي' : 
                           transaction.paymentMethod === 'transfer' ? 'تحويل' : 'شيك'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`font-medium ${
                            transaction.type === 'expense' ? 'text-red-600' : 'text-green-600'
                          }`}>
                            {transaction.type === 'expense' ? '-' : '+'}
                            {transaction.amount.toLocaleString()} ر.س
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2 space-x-reverse">
                            <button className="text-blue-600 hover:text-blue-900">
                              <Eye size={18} />
                            </button>
                            <button className="text-yellow-600 hover:text-yellow-900">
                              <Edit size={18} />
                            </button>
                            <button className="text-red-600 hover:text-red-900">
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
          </>
        )}

        {activeTab === 'reports' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* تقرير شهري */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">تقرير شهري</h2>
              <div className="space-y-4">
                {Object.entries(monthlyExpenses).slice(0, 6).map(([month, amount]) => (
                  <div key={month} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-800">{month}</p>
                        <p className="text-sm text-gray-600">المصروفات</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-red-600">-{amount.toLocaleString()} ر.س</p>
                        <p className="text-sm text-green-600">
                          +{(monthlyIncomes[month] || 0).toLocaleString()} ر.س إيرادات
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ملخص سنوي */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">ملخص سنوي</h2>
              <div className="space-y-6">
                <div className="p-6 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg">
                  <p className="text-sm text-gray-600">صافي الربح لهذا العام</p>
                  <p className="text-3xl font-bold text-gray-800 mt-2">
                    {(Object.values(monthlyIncomes).reduce((a, b) => a + b, 0) - 
                     Object.values(monthlyExpenses).reduce((a, b) => a + b, 0)).toLocaleString()} ر.س
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">أعلى شهر إيرادات</p>
                    <p className="text-lg font-bold text-gray-800 mt-2">
                      {Object.entries(monthlyIncomes).sort((a, b) => b[1] - a[1])[0]?.[0] || '--'}
                    </p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">أعلى شهر مصروفات</p>
                    <p className="text-lg font-bold text-gray-800 mt-2">
                      {Object.entries(monthlyExpenses).sort((a, b) => b[1] - a[1])[0]?.[0] || '--'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* نافذة معاملة جديدة */}
      {showNewTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">معاملة مالية جديدة</h2>
                <button
                  onClick={() => setShowNewTransaction(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                {/* نوع المعاملة */}
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setNewTransaction({...newTransaction, type: 'expense'})}
                    className={`p-4 border rounded-lg flex flex-col items-center transition-colors ${
                      newTransaction.type === 'expense'
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <TrendingDown size={24} className={`mb-2 ${
                      newTransaction.type === 'expense' ? 'text-red-600' : 'text-gray-400'
                    }`} />
                    <span className={`font-medium ${
                      newTransaction.type === 'expense' ? 'text-red-700' : 'text-gray-700'
                    }`}>
                      مصروف
                    </span>
                  </button>

                  <button
                    onClick={() => setNewTransaction({...newTransaction, type: 'income'})}
                    className={`p-4 border rounded-lg flex flex-col items-center transition-colors ${
                      newTransaction.type === 'income'
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <TrendingUp size={24} className={`mb-2 ${
                      newTransaction.type === 'income' ? 'text-green-600' : 'text-gray-400'
                    }`} />
                    <span className={`font-medium ${
                      newTransaction.type === 'income' ? 'text-green-700' : 'text-gray-700'
                    }`}>
                      إيراد
                    </span>
                  </button>
                </div>

                {/* المعلومات الأساسية */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الفئة *
                    </label>
                    <select
                      className="input-field"
                      value={newTransaction.category}
                      onChange={(e) => setNewTransaction({...newTransaction, category: e.target.value})}
                    >
                      <option value="">اختر الفئة</option>
                      {newTransaction.type === 'expense'
                        ? expenseCategories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))
                        : incomeCategories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))
                      }
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      المبلغ (ر.س) *
                    </label>
                    <input
                      type="number"
                      className="input-field"
                      value={newTransaction.amount}
                      onChange={(e) => setNewTransaction({...newTransaction, amount: parseFloat(e.target.value) || 0})}
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      التاريخ *
                    </label>
                    <input
                      type="date"
                      className="input-field"
                      value={newTransaction.date}
                      onChange={(e) => setNewTransaction({...newTransaction, date: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      طريقة الدفع *
                    </label>
                    <select
                      className="input-field"
                      value={newTransaction.paymentMethod}
                      onChange={(e) => setNewTransaction({...newTransaction, paymentMethod: e.target.value})}
                    >
                      <option value="cash">نقدي</option>
                      <option value="transfer">تحويل بنكي</option>
                      <option value="check">شيك</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الوصف *
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    value={newTransaction.description}
                    onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
                    placeholder="وصف تفصيلي للمعاملة"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    رقم المرجع
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    value={newTransaction.reference}
                    onChange={(e) => setNewTransaction({...newTransaction, reference: e.target.value})}
                    placeholder="رقم الفاتورة أو المرجع"
                  />
                </div>

                {/* أزرار التنفيذ */}
                <div className="flex justify-end space-x-3 space-x-reverse pt-6 border-t">
                  <button
                    onClick={() => setShowNewTransaction(false)}
                    className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    إلغاء
                  </button>
                  <button
                    onClick={handleAddTransaction}
                    className="btn-primary px-6 py-3"
                    disabled={!newTransaction.category || !newTransaction.amount || !newTransaction.description}
                  >
                    حفظ المعاملة
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

export default FinancialManagement
