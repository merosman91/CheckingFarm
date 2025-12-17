import React, { useState, useEffect } from 'react'

const FinancialManagement = () => {
  const [transactions, setTransactions] = useState([])
  const [expenses, setExpenses] = useState([])
  const [incomes, setIncomes] = useState([])
  const [activeTab, setActiveTab] = useState('overview')
  const [showNewTransaction, setShowNewTransaction] = useState(false)
  const [filter, setFilter] = useState('all')
  const [editingTransaction, setEditingTransaction] = useState(null)
  const [editForm, setEditForm] = useState({
    category: '',
    amount: 0,
    description: '',
    date: ''
  })

  const [newTransaction, setNewTransaction] = useState({
    type: 'expense',
    category: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    description: '',
    paymentMethod: 'cash',
    reference: ''
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
      id: Date.now(),
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
      reference: ''
    })
  }

  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction)
    setEditForm({
      category: transaction.category,
      amount: transaction.amount,
      description: transaction.description,
      date: transaction.date
    })
  }

  const handleSaveEdit = () => {
    if (editingTransaction) {
      const updatedTransaction = {
        ...editingTransaction,
        ...editForm
      }

      // تحديث في القائمة المناسبة
      if (editingTransaction.type === 'expense') {
        setExpenses(expenses.map(exp => 
          exp.id === editingTransaction.id ? updatedTransaction : exp
        ))
      } else {
        setIncomes(incomes.map(inc => 
          inc.id === editingTransaction.id ? updatedTransaction : inc
        ))
      }

      // تحديث في المعاملات العامة
      setTransactions(transactions.map(trans => 
        trans.id === editingTransaction.id ? updatedTransaction : trans
      ))

      setEditingTransaction(null)
      setEditForm({
        category: '',
        amount: 0,
        description: '',
        date: ''
      })
    }
  }

  const handleDeleteTransaction = (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذه المعاملة؟')) {
      setTransactions(transactions.filter(trans => trans.id !== id))
      setExpenses(expenses.filter(exp => exp.id !== id))
      setIncomes(incomes.filter(inc => inc.id !== id))
    }
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

  const today = new Date().toISOString().split('T')[0]
  const todayTransactions = transactions.filter(t => t.date === today)
  const todayExpenses = todayTransactions.filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)
  const todayIncomes = todayTransactions.filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

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
            className="btn-secondary"
            onClick={() => setShowNewTransaction(true)}
          >
            + معاملة جديدة
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
                {totalIncome.toLocaleString()} ج.س
              </p>
            </div>
            <div className="p-3 rounded-lg bg-green-50">
              <img src="/icons/trending-up.svg" alt="إيرادات" className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">إجمالي المصروفات</p>
              <p className="text-2xl font-bold text-gray-800 mt-2">
                {totalExpense.toLocaleString()} ج.س
              </p>
            </div>
            <div className="p-3 rounded-lg bg-red-50">
              <img src="/icons/trending-down.svg" alt="مصروفات" className="h-6 w-6" />
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
                {balance.toLocaleString()} ج.س
              </p>
            </div>
            <div className="p-3 rounded-lg bg-blue-50">
              <img src="/icons/wallet.svg" alt="رصيد" className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">معاملات اليوم</p>
              <p className="text-2xl font-bold text-gray-800 mt-2">
                {todayTransactions.length}
              </p>
              <p className="text-sm text-gray-500 mt-1">{new Date().toLocaleDateString('ar-SA')}</p>
            </div>
            <div className="p-3 rounded-lg bg-purple-50">
              <img src="/icons/repeat.svg" alt="معاملات" className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

      {/* تبويبات */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-4 space-x-reverse overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-4 whitespace-nowrap border-b-2 ${
              activeTab === 'overview'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            نظرة عامة
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            className={`py-3 px-4 whitespace-nowrap border-b-2 ${
              activeTab === 'transactions'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            المعاملات
          </button>
          <button
            onClick={() => setActiveTab('expenses')}
            className={`py-3 px-4 whitespace-nowrap border-b-2 ${
              activeTab === 'expenses'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            المصروفات
          </button>
          <button
            onClick={() => setActiveTab('incomes')}
            className={`py-3 px-4 whitespace-nowrap border-b-2 ${
              activeTab === 'incomes'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            الإيرادات
          </button>
        </nav>
      </div>

      {/* محتوى التبويبات */}
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">ملخص اليوم</h2>
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-600">إيرادات اليوم</p>
                    <p className="text-2xl font-bold text-green-700 mt-2">
                      {todayIncomes.toLocaleString()} ج.س
                    </p>
                  </div>
                  <div className="p-4 bg-red-50 rounded-lg">
                    <p className="text-sm text-red-600">مصروفات اليوم</p>
                    <p className="text-2xl font-bold text-red-700 mt-2">
                      {todayExpenses.toLocaleString()} ج.س
                    </p>
                  </div>
                </div>
              </div>

              <div className="card">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">الصافي اليوم</h2>
                <div className="p-6 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg">
                  <p className="text-sm text-gray-600">صافي اليوم</p>
                  <p className={`text-3xl font-bold mt-2 ${
                    (todayIncomes - todayExpenses) >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {(todayIncomes - todayExpenses).toLocaleString()} ج.س
                  </p>
                </div>
              </div>
            </div>

            <div className="card">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">توزيع المصروفات</h2>
              <div className="space-y-3">
                {expenseCategories.map(category => {
                  const categoryExpenses = expenses.filter(e => e.category === category)
                  const total = categoryExpenses.reduce((sum, e) => sum + e.amount, 0)
                  const percentage = totalExpense > 0 ? (total / totalExpense * 100).toFixed(1) : 0
                  
                  return total > 0 && (
                    <div key={category} className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-700">{category}</span>
                        <span className="text-sm text-gray-600">{percentage}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-red-500 rounded-full"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{total.toLocaleString()} ج.س</span>
                        <span>{categoryExpenses.length} معاملة</span>
                      </div>
                    </div>
                  )
                })}
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
                  <input
                    type="text"
                    placeholder="بحث في المعاملات..."
                    className="input-field"
                  />
                </div>
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
              </div>
            </div>

            {/* جدول المعاملات */}
            <div className="card">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">التاريخ</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">الوصف</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">الفئة</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">المبلغ</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredTransactions.slice(0, 10).map((transaction) => (
                      <tr key={transaction.id}>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {transaction.date}
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-medium text-gray-900">{transaction.description}</div>
                          <div className="text-sm text-gray-500">{transaction.reference}</div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            transaction.type === 'expense'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {transaction.category}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className={`font-medium ${
                            transaction.type === 'expense' ? 'text-red-600' : 'text-green-600'
                          }`}>
                            {transaction.type === 'expense' ? '-' : '+'}
                            {transaction.amount.toLocaleString()} ج.س
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex space-x-2 space-x-reverse">
                            <button 
                              className="text-yellow-600 hover:text-yellow-900 text-sm"
                              onClick={() => handleEditTransaction(transaction)}
                            >
                              تعديل
                            </button>
                            <button 
                              className="text-red-600 hover:text-red-900 text-sm"
                              onClick={() => handleDeleteTransaction(transaction.id)}
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
            </div>
          </>
        )}

        {activeTab === 'expenses' && (
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">المصروفات</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">التاريخ</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">الفئة</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">الوصف</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">المبلغ</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {expenses.slice(0, 10).map((expense) => (
                    <tr key={expense.id}>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {expense.date}
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                          {expense.category}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">{expense.description}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-red-600">
                          -{expense.amount.toLocaleString()} ج.س
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'incomes' && (
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">الإيرادات</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">التاريخ</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">الفئة</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">الوصف</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">المبلغ</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {incomes.slice(0, 10).map((income) => (
                    <tr key={income.id}>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {income.date}
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                          {income.category}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">{income.description}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-green-600">
                          +{income.amount.toLocaleString()} ج.س
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* نافذة تعديل معاملة */}
      {editingTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">تعديل المعاملة</h2>
                <button
                  onClick={() => setEditingTransaction(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الفئة
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    value={editForm.category}
                    onChange={(e) => setEditForm({...editForm, category: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    المبلغ (ج.س)
                  </label>
                  <input
                    type="number"
                    className="input-field"
                    value={editForm.amount}
                    onChange={(e) => setEditForm({...editForm, amount: parseFloat(e.target.value) || 0})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الوصف
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    value={editForm.description}
                    onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    التاريخ
                  </label>
                  <input
                    type="date"
                    className="input-field"
                    value={editForm.date}
                    onChange={(e) => setEditForm({...editForm, date: e.target.value})}
                  />
                </div>

                <div className="flex justify-end space-x-3 space-x-reverse pt-4 border-t">
                  <button
                    onClick={() => setEditingTransaction(null)}
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

      {/* نافذة معاملة جديدة */}
      {showNewTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">معاملة مالية جديدة</h2>
                <button
                  onClick={() => setShowNewTransaction(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex space-x-4 space-x-reverse">
                  <button
                    onClick={() => setNewTransaction({...newTransaction, type: 'expense'})}
                    className={`flex-1 p-3 border rounded-lg ${
                      newTransaction.type === 'expense'
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <span className={`font-medium ${
                      newTransaction.type === 'expense' ? 'text-red-700' : 'text-gray-700'
                    }`}>
                      مصروف
                    </span>
                  </button>

                  <button
                    onClick={() => setNewTransaction({...newTransaction, type: 'income'})}
                    className={`flex-1 p-3 border rounded-lg ${
                      newTransaction.type === 'income'
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <span className={`font-medium ${
                      newTransaction.type === 'income' ? 'text-green-700' : 'text-gray-700'
                    }`}>
                      إيراد
                    </span>
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الفئة
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
                    المبلغ (ج.س)
                  </label>
                  <input
                    type="number"
                    className="input-field"
                    value={newTransaction.amount}
                    onChange={(e) => setNewTransaction({...newTransaction, amount: parseFloat(e.target.value) || 0})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    التاريخ
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
                    الوصف
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    value={newTransaction.description}
                    onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    طريقة الدفع
                  </label>
                  <select
                    className="input-field"
                    value={newTransaction.paymentMethod}
                    onChange={(e) => setNewTransaction({...newTransaction, paymentMethod: e.target.value})}
                  >
                    <option value="cash">نقدي</option>
                    <option value="transfer">تحويل بنكي</option>
                  </select>
                </div>

                <div className="flex justify-end space-x-3 space-x-reverse pt-4 border-t">
                  <button
                    onClick={() => setShowNewTransaction(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    إلغاء
                  </button>
                  <button
                    onClick={handleAddTransaction}
                    className="btn-primary px-4 py-2"
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
