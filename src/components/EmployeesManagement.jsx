import React, { useState, useEffect } from 'react'

const EmployeesManagement = () => {
  const [employees, setEmployees] = useState([])
  const [attendance, setAttendance] = useState([])
  const [salaries, setSalaries] = useState([])
  const [activeTab, setActiveTab] = useState('employees')
  const [showNewEmployee, setShowNewEmployee] = useState(false)
  const [showAttendance, setShowAttendance] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState(null)
  const [editForm, setEditForm] = useState({
    name: '',
    phone: '',
    salary: 0,
    position: '',
    department: ''
  })

  const [newEmployee, setNewEmployee] = useState({
    name: '',
    phone: '',
    email: '',
    position: '',
    department: '',
    hireDate: new Date().toISOString().split('T')[0],
    salary: 0,
    status: 'active',
    address: '',
    emergencyContact: '',
    notes: ''
  })

  const departments = ['الإدارة', 'التربية', 'الصحة', 'المبيعات', 'المخازن', 'المالية', 'الصيانة']
  const positions = ['مدير', 'مشرف', 'فني', 'عامل', 'سائق', 'محاسب', 'بائع', 'طبيب بيطري']

  useEffect(() => {
    const savedData = localStorage.getItem('employeesData')
    if (savedData) {
      const data = JSON.parse(savedData)
      setEmployees(data.employees || [])
      setAttendance(data.attendance || [])
      setSalaries(data.salaries || [])
    }
  }, [])

  useEffect(() => {
    const data = { employees, attendance, salaries }
    localStorage.setItem('employeesData', JSON.stringify(data))
  }, [employees, attendance, salaries])

  const handleAddEmployee = () => {
    const employee = {
      id: Date.now(),
      ...newEmployee,
      employeeId: `EMP-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString()
    }

    setEmployees([...employees, employee])
    setShowNewEmployee(false)
    setNewEmployee({
      name: '',
      phone: '',
      email: '',
      position: '',
      department: '',
      hireDate: new Date().toISOString().split('T')[0],
      salary: 0,
      status: 'active',
      address: '',
      emergencyContact: '',
      notes: ''
    })
  }

  const handleEditEmployee = (employee) => {
    setEditingEmployee(employee)
    setEditForm({
      name: employee.name,
      phone: employee.phone,
      salary: employee.salary,
      position: employee.position,
      department: employee.department
    })
  }

  const handleSaveEdit = () => {
    if (editingEmployee) {
      setEmployees(employees.map(emp => 
        emp.id === editingEmployee.id 
          ? { ...emp, ...editForm }
          : emp
      ))
      setEditingEmployee(null)
      setEditForm({
        name: '',
        phone: '',
        salary: 0,
        position: '',
        department: ''
      })
    }
  }

  const handleToggleStatus = (id) => {
    setEmployees(employees.map(emp => 
      emp.id === id 
        ? { ...emp, status: emp.status === 'active' ? 'inactive' : 'active' }
        : emp
    ))
  }

  const handleDeleteEmployee = (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الموظف؟')) {
      setEmployees(employees.filter(emp => emp.id !== id))
    }
  }

  const handleAttendance = (employeeId, status) => {
    const today = new Date().toISOString().split('T')[0]
    const existingIndex = attendance.findIndex(a => 
      a.employeeId === employeeId && a.date === today
    )

    const newRecord = {
      id: Date.now(),
      employeeId,
      date: today,
      time: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
      status,
      notes: ''
    }

    if (existingIndex >= 0) {
      const updatedAttendance = [...attendance]
      updatedAttendance[existingIndex] = newRecord
      setAttendance(updatedAttendance)
    } else {
      setAttendance([...attendance, newRecord])
    }
  }

  const todayAttendance = attendance.filter(a => a.date === new Date().toISOString().split('T')[0])
  const presentCount = todayAttendance.filter(a => a.status === 'present').length
  const absentCount = todayAttendance.filter(a => a.status === 'absent').length
  const lateCount = todayAttendance.filter(a => a.status === 'late').length

  const totalEmployees = employees.length
  const activeEmployees = employees.filter(e => e.status === 'active').length
  const totalSalary = employees.reduce((sum, emp) => sum + emp.salary, 0)
  const attendanceRate = employees.length > 0 
    ? ((presentCount / activeEmployees) * 100).toFixed(1)
    : 0

  return (
    <div className="space-y-6">
      {/* رأس الصفحة */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">إدارة الموظفين</h1>
          <p className="text-gray-600 mt-1">إدارة بيانات الموظفين والحضور والرواتب</p>
        </div>
        <div className="flex items-center space-x-3 space-x-reverse">
          <button 
            className="btn-secondary"
            onClick={() => setShowNewEmployee(true)}
          >
            + موظف جديد
          </button>
          <button 
            className="btn-primary"
            onClick={() => setShowAttendance(true)}
          >
            تسجيل حضور
          </button>
        </div>
      </div>

      {/* بطاقات الإحصائيات */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">إجمالي الموظفين</p>
              <p className="text-2xl font-bold text-gray-800 mt-2">{totalEmployees}</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-50">
              <img src="/icons/users.svg" alt="موظفين" className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">موظفين نشطين</p>
              <p className="text-2xl font-bold text-gray-800 mt-2">{activeEmployees}</p>
              <p className="text-sm text-gray-500 mt-1">
                {totalEmployees > 0 ? ((activeEmployees / totalEmployees) * 100).toFixed(0) : 0}%
              </p>
            </div>
            <div className="p-3 rounded-lg bg-green-50">
              <img src="/icons/user.svg" alt="نشطين" className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">إجمالي الرواتب</p>
              <p className="text-2xl font-bold text-gray-800 mt-2">{totalSalary.toLocaleString()} ج.س</p>
              <p className="text-sm text-gray-500 mt-1">شهرياً</p>
            </div>
            <div className="p-3 rounded-lg bg-yellow-50">
              <img src="/icons/dollar.svg" alt="رواتب" className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">نسبة الحضور</p>
              <p className="text-2xl font-bold text-gray-800 mt-2">{attendanceRate}%</p>
              <p className="text-sm text-gray-500 mt-1">اليوم</p>
            </div>
            <div className="p-3 rounded-lg bg-purple-50">
              <img src="/icons/award.svg" alt="حضور" className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

      {/* تبويبات */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-4 space-x-reverse overflow-x-auto">
          <button
            onClick={() => setActiveTab('employees')}
            className={`py-3 px-4 whitespace-nowrap border-b-2 ${
              activeTab === 'employees'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            الموظفين
          </button>
          <button
            onClick={() => setActiveTab('attendance')}
            className={`py-3 px-4 whitespace-nowrap border-b-2 ${
              activeTab === 'attendance'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            الحضور
          </button>
          <button
            onClick={() => setActiveTab('performance')}
            className={`py-3 px-4 whitespace-nowrap border-b-2 ${
              activeTab === 'performance'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            الأداء
          </button>
        </nav>
      </div>

      {/* محتوى التبويبات */}
      <div className="space-y-6">
        {activeTab === 'employees' && (
          <div className="card">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">الاسم</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">الوظيفة</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">القسم</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">الراتب</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">الحالة</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {employees.map((employee) => (
                    <tr key={employee.id}>
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">{employee.name}</div>
                        <div className="text-sm text-gray-500">{employee.phone}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">{employee.position}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                          {employee.department}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">{employee.salary.toLocaleString()} ج.س</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          employee.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {employee.status === 'active' ? 'نشط' : 'غير نشط'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex space-x-2 space-x-reverse">
                          <button 
                            className="text-yellow-600 hover:text-yellow-900 text-sm"
                            onClick={() => handleEditEmployee(employee)}
                          >
                            تعديل
                          </button>
                          <button 
                            className="text-red-600 hover:text-red-900 text-sm"
                            onClick={() => handleDeleteEmployee(employee.id)}
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
        )}

        {activeTab === 'attendance' && (
          <div className="space-y-6">
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">حضور اليوم</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-600">الحاضرين</p>
                  <p className="text-2xl font-bold text-green-700 mt-2">{presentCount}</p>
                </div>
                <div className="p-4 bg-red-50 rounded-lg">
                  <p className="text-sm text-red-600">الغائبين</p>
                  <p className="text-2xl font-bold text-red-700 mt-2">{absentCount}</p>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <p className="text-sm text-yellow-600">المتأخرين</p>
                  <p className="text-2xl font-bold text-yellow-700 mt-2">{lateCount}</p>
                </div>
              </div>
            </div>

            <div className="card">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">سجل الحضور</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">الموظف</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">الحالة</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">الوقت</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {todayAttendance.map((record) => {
                      const employee = employees.find(e => e.id === record.employeeId)
                      return (
                        <tr key={record.id}>
                          <td className="px-4 py-3">
                            <div className="font-medium text-gray-900">{employee?.name || 'غير معروف'}</div>
                            <div className="text-sm text-gray-500">{employee?.position || ''}</div>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              record.status === 'present' ? 'bg-green-100 text-green-800' :
                              record.status === 'absent' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {record.status === 'present' ? 'حاضر' :
                               record.status === 'absent' ? 'غائب' : 'متأخر'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {record.time}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'performance' && (
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">تقييم الأداء</h2>
            <div className="space-y-4">
              {employees.slice(0, 5).map((employee) => (
                <div key={employee.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-800">{employee.name}</p>
                      <p className="text-sm text-gray-600">{employee.position}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-800">4.2/5</p>
                      <p className="text-sm text-gray-500">تقييم</p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600">الإنتاجية</span>
                      <span className="text-sm font-medium">85%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* نافذة تسجيل حضور */}
      {showAttendance && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">تسجيل حضور اليوم</h2>
                <button
                  onClick={() => setShowAttendance(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                {employees.filter(e => e.status === 'active').map((employee) => {
                  const todayRecord = todayAttendance.find(a => a.employeeId === employee.id)

                  return (
                    <div key={employee.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-gray-800">{employee.name}</p>
                          <p className="text-sm text-gray-600">{employee.position} - {employee.department}</p>
                        </div>
                        <div className="flex space-x-2 space-x-reverse">
                          <button
                            onClick={() => handleAttendance(employee.id, 'present')}
                            className={`px-3 py-1 text-sm rounded-lg ${
                              todayRecord?.status === 'present'
                                ? 'bg-green-100 text-green-800 border border-green-200'
                                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                            }`}
                          >
                            حاضر
                          </button>
                          <button
                            onClick={() => handleAttendance(employee.id, 'absent')}
                            className={`px-3 py-1 text-sm rounded-lg ${
                              todayRecord?.status === 'absent'
                                ? 'bg-red-100 text-red-800 border border-red-200'
                                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                            }`}
                          >
                            غائب
                          </button>
                          <button
                            onClick={() => handleAttendance(employee.id, 'late')}
                            className={`px-3 py-1 text-sm rounded-lg ${
                              todayRecord?.status === 'late'
                                ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                            }`}
                          >
                            متأخر
                          </button>
                        </div>
                      </div>
                      {todayRecord && (
                        <p className="text-sm text-gray-500 mt-2">
                          مسجل كـ {todayRecord.status === 'present' ? 'حاضر' : 
                                   todayRecord.status === 'absent' ? 'غائب' : 'متأخر'} 
                          في {todayRecord.time}
                        </p>
                      )}
                    </div>
                  )
                })}
              </div>

              <div className="flex justify-end space-x-3 space-x-reverse pt-6 border-t mt-6">
                <button
                  onClick={() => setShowAttendance(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  إغلاق
                </button>
                <button
                  onClick={() => setShowAttendance(false)}
                  className="btn-primary px-4 py-2"
                >
                  حفظ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* نافذة تعديل موظف */}
      {editingEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">تعديل بيانات الموظف</h2>
                <button
                  onClick={() => setEditingEmployee(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الاسم الكامل
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
                    رقم الهاتف
                  </label>
                  <input
                    type="tel"
                    className="input-field"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الراتب الشهري (ج.س)
                  </label>
                  <input
                    type="number"
                    className="input-field"
                    value={editForm.salary}
                    onChange={(e) => setEditForm({...editForm, salary: parseFloat(e.target.value) || 0})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الوظيفة
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    value={editForm.position}
                    onChange={(e) => setEditForm({...editForm, position: e.target.value})}
                  />
                </div>

                <div className="flex justify-end space-x-3 space-x-reverse pt-4 border-t">
                  <button
                    onClick={() => setEditingEmployee(null)}
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

      {/* نافذة موظف جديد */}
      {showNewEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">إضافة موظف جديد</h2>
                <button
                  onClick={() => setShowNewEmployee(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الاسم الكامل
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    value={newEmployee.name}
                    onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    رقم الهاتف
                  </label>
                  <input
                    type="tel"
                    className="input-field"
                    value={newEmployee.phone}
                    onChange={(e) => setNewEmployee({...newEmployee, phone: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      القسم
                    </label>
                    <select
                      className="input-field"
                      value={newEmployee.department}
                      onChange={(e) => setNewEmployee({...newEmployee, department: e.target.value})}
                    >
                      <option value="">اختر القسم</option>
                      {departments.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الوظيفة
                    </label>
                    <select
                      className="input-field"
                      value={newEmployee.position}
                      onChange={(e) => setNewEmployee({...newEmployee, position: e.target.value})}
                    >
                      <option value="">اختر الوظيفة</option>
                      {positions.map(pos => (
                        <option key={pos} value={pos}>{pos}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الراتب الشهري (ج.س)
                  </label>
                  <input
                    type="number"
                    className="input-field"
                    value={newEmployee.salary}
                    onChange={(e) => setNewEmployee({...newEmployee, salary: parseFloat(e.target.value) || 0})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    تاريخ التعيين
                  </label>
                  <input
                    type="date"
                    className="input-field"
                    value={newEmployee.hireDate}
                    onChange={(e) => setNewEmployee({...newEmployee, hireDate: e.target.value})}
                  />
                </div>

                <div className="flex justify-end space-x-3 space-x-reverse pt-4 border-t">
                  <button
                    onClick={() => setShowNewEmployee(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    إلغاء
                  </button>
                  <button
                    onClick={handleAddEmployee}
                    className="btn-primary px-4 py-2"
                  >
                    إضافة الموظف
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

export default EmployeesManagement
