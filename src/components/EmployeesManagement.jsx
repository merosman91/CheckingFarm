import React, { useState, useEffect } from 'react'
import { 
  Plus, 
  Users,
  User,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  Clock,
  Award,
  Shield,
  Search,
  Filter,
  Download,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle
} from 'lucide-react'

const EmployeesManagement = () => {
  const [employees, setEmployees] = useState([])
  const [attendance, setAttendance] = useState([])
  const [salaries, setSalaries] = useState([])
  const [activeTab, setActiveTab] = useState('employees')
  const [showNewEmployee, setShowNewEmployee] = useState(false)
  const [showAttendance, setShowAttendance] = useState(false)

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

  const departments = [
    'الإدارة', 'التربية', 'الصحة', 'المبيعات', 'المخازن', 'المالية', 'الصيانة'
  ]

  const positions = [
    'مدير', 'مشرف', 'فني', 'عامل', 'سائق', 'محاسب', 'بائع', 'طبيب بيطري'
  ]

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
    const data = {
      employees,
      attendance,
      salaries
    }
    localStorage.setItem('employeesData', JSON.stringify(data))
  }, [employees, attendance, salaries])

  const handleAddEmployee = () => {
    const employee = {
      id: employees.length + 1,
      ...newEmployee,
      employeeId: `EMP-${String(employees.length + 1).padStart(3, '0')}`,
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

  const handleToggleStatus = (id) => {
    setEmployees(employees.map(emp => 
      emp.id === id 
        ? { ...emp, status: emp.status === 'active' ? 'inactive' : 'active' }
        : emp
    ))
  }

  const totalEmployees = employees.length
  const activeEmployees = employees.filter(e => e.status === 'active').length
  const totalSalary = employees.reduce((sum, emp) => sum + emp.salary, 0)
  const attendanceRate = attendance.length > 0 
    ? (attendance.filter(a => a.status === 'present').length / attendance.length * 100).toFixed(1)
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
            className="btn-secondary flex items-center"
            onClick={() => setShowNewEmployee(true)}
          >
            <Plus size={18} className="ml-2" />
            موظف جديد
          </button>
          <button 
            className="btn-primary flex items-center"
            onClick={() => setShowAttendance(true)}
          >
            <Clock size={18} className="ml-2" />
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
              <p className="text-2xl font-bold text-gray-800 mt-2">
                {totalEmployees}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-blue-50">
              <Users size={24} className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">موظفين نشطين</p>
              <p className="text-2xl font-bold text-gray-800 mt-2">
                {activeEmployees}
              </p>
              <p className="text-sm text-gray-500 mt-1">{((activeEmployees / totalEmployees) * 100 || 0).toFixed(0)}%</p>
            </div>
            <div className="p-3 rounded-lg bg-green-50">
              <User size={24} className="text-green-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">إجمالي الرواتب</p>
              <p className="text-2xl font-bold text-gray-800 mt-2">
                {totalSalary.toLocaleString()} ر.س
              </p>
              <p className="text-sm text-gray-500 mt-1">شهرياً</p>
            </div>
            <div className="p-3 rounded-lg bg-yellow-50">
              <DollarSign size={24} className="text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">نسبة الحضور</p>
              <p className="text-2xl font-bold text-gray-800 mt-2">
                {attendanceRate}%
              </p>
              <p className="text-sm text-gray-500 mt-1">هذا الشهر</p>
            </div>
            <div className="p-3 rounded-lg bg-purple-50">
              <Award size={24} className="text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* تنقل بين التبويبات */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 space-x-reverse">
          {[
            { id: 'employees', label: 'الموظفين', icon: Users },
            { id: 'attendance', label: 'الحضور', icon: Clock },
            { id: 'salaries', label: 'الرواتب', icon: DollarSign },
            { id: 'performance', label: 'الأداء', icon: Award }
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
        {activeTab === 'employees' && (
          <div className="card overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">قائمة الموظفين</h2>
              <div className="flex space-x-2 space-x-reverse">
                <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Filter size={20} className="text-gray-600" />
                </button>
                <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Download size={20} className="text-gray-600" />
                </button>
              </div>
            </div>

            {employees.length === 0 ? (
              <div className="text-center py-12">
                <Users className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">لا توجد بيانات موظفين</h3>
                <p className="mt-2 text-gray-500">ابدأ بإضافة موظفين جديدين للنظام.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        الموظف
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        الوظيفة
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        القسم
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        الراتب
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        تاريخ التعيين
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
                    {employees.map((employee) => (
                      <tr key={employee.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center ml-4">
                              <User size={20} className="text-gray-600" />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{employee.name}</div>
                              <div className="text-sm text-gray-500">{employee.employeeId}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{employee.position}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                            {employee.department}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">
                            {employee.salary.toLocaleString()} ر.س
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {employee.hireDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 text-xs rounded-full ${
                            employee.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {employee.status === 'active' ? 'نشط' : 'غير نشط'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2 space-x-reverse">
                            <button className="text-blue-600 hover:text-blue-900">
                              <Eye size={18} />
                            </button>
                            <button className="text-yellow-600 hover:text-yellow-900">
                              <Edit size={18} />
                            </button>
                            <button 
                              className={`hover:text-gray-900 ${
                                employee.status === 'active' ? 'text-red-600' : 'text-green-600'
                              }`}
                              onClick={() => handleToggleStatus(employee.id)}
                            >
                              {employee.status === 'active' ? <XCircle size={18} /> : <CheckCircle size={18} />}
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
        )}

        {activeTab === 'attendance' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 card">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">سجلات الحضور</h2>
              <div className="space-y-4">
                {attendance.length === 0 ? (
                  <div className="text-center py-8">
                    <Clock className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900">لا توجد سجلات حضور</h3>
                    <p className="mt-2 text-gray-500">سجّل حضور الموظفين لليوم الحالي.</p>
                  </div>
                ) : (
                  attendance.map((record) => (
                    <div key={record.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className={`p-2 rounded-lg ml-4 ${
                            record.status === 'present' ? 'bg-green-50 text-green-600' :
                            record.status === 'absent' ? 'bg-red-50 text-red-600' :
                            record.status === 'late' ? 'bg-yellow-50 text-yellow-600' :
                            'bg-blue-50 text-blue-600'
                          }`}>
                            {record.status === 'present' && <CheckCircle size={20} />}
                            {record.status === 'absent' && <XCircle size={20} />}
                            {record.status === 'late' && <Clock size={20} />}
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">
                              {employees.find(e => e.id == record.employeeId)?.name || 'غير معروف'}
                            </p>
                            <p className="text-sm text-gray-500">
                              {record.date} - {record.time}
                            </p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 text-xs rounded-full ${
                          record.status === 'present' ? 'bg-green-100 text-green-800' :
                          record.status === 'absent' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {record.status === 'present' ? 'حاضر' :
                           record.status === 'absent' ? 'غائب' : 'متأخر'}
                        </span>
                      </div>
                      {record.notes && (
                        <p className="text-sm text-gray-600 mt-3">{record.notes}</p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="card">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">إحصائيات الحضور</h2>
              <div className="space-y-6">
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-600">الحضور</p>
                  <p className="text-2xl font-bold text-green-700 mt-2">
                    {attendance.filter(a => a.status === 'present').length}
                  </p>
                </div>
                <div className="p-4 bg-red-50 rounded-lg">
                  <p className="text-sm text-red-600">الغياب</p>
                  <p className="text-2xl font-bold text-red-700 mt-2">
                    {attendance.filter(a => a.status === 'absent').length}
                  </p>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <p className="text-sm text-yellow-600">التأخير</p>
                  <p className="text-2xl font-bold text-yellow-700 mt-2">
                    {attendance.filter(a => a.status === 'late').length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'performance' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">تقييم الأداء</h2>
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

            <div className="card">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">المهام المعلقة</h2>
              <div className="space-y-4">
                {[
                  { employee: 'أحمد محمد', task: 'تطعيم الدورة الشتوية', deadline: 'غداً' },
                  { employee: 'سالم العبدلي', task: 'تنظيف الحظائر', deadline: 'اليوم' },
                  { employee: 'فاطمة السعيد', task: 'جرد المخزون', deadline: 'بعد غد' },
                ].map((task, index) => (
                  <div key={index} className="p-4 border border-yellow-200 rounded-lg bg-yellow-50">
                    <p className="font-medium text-yellow-800">{task.task}</p>
                    <div className="flex justify-between mt-2">
                      <span className="text-sm text-yellow-700">{task.employee}</span>
                      <span className="text-sm text-yellow-800">{task.deadline}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* نافذة موظف جديد */}
      {showNewEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">إضافة موظف جديد</h2>
                <button
                  onClick={() => setShowNewEmployee(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                {/* المعلومات الشخصية */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الاسم الكامل *
                    </label>
                    <input
                      type="text"
                      className="input-field"
                      value={newEmployee.name}
                      onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})}
                      placeholder="اسم الموظف الثلاثي"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      رقم الهاتف *
                    </label>
                    <input
                      type="tel"
                      className="input-field"
                      value={newEmployee.phone}
                      onChange={(e) => setNewEmployee({...newEmployee, phone: e.target.value})}
                      placeholder="05XXXXXXXX"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      البريد الإلكتروني
                    </label>
                    <input
                      type="email"
                      className="input-field"
                      value={newEmployee.email}
                      onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})}
                      placeholder="email@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      جهة الاتصال الطارئة
                    </label>
                    <input
                      type="text"
                      className="input-field"
                      value={newEmployee.emergencyContact}
                      onChange={(e) => setNewEmployee({...newEmployee, emergencyContact: e.target.value})}
                      placeholder="رقم هاتف للطوارئ"
                    />
                  </div>
                </div>

                {/* المعلومات الوظيفية */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      القسم *
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
                      الوظيفة *
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      تاريخ التعيين *
                    </label>
                    <input
                      type="date"
                      className="input-field"
                      value={newEmployee.hireDate}
                      onChange={(e) => setNewEmployee({...newEmployee, hireDate: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الراتب الشهري (ر.س) *
                    </label>
                    <input
                      type="number"
                      className="input-field"
                      value={newEmployee.salary}
                      onChange={(e) => setNewEmployee({...newEmployee, salary: parseFloat(e.target.value) || 0})}
                      min="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    العنوان
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    value={newEmployee.address}
                    onChange={(e) => setNewEmployee({...newEmployee, address: e.target.value})}
                    placeholder="العنوان التفصيلي"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ملاحظات
                  </label>
                  <textarea
                    className="input-field h-32"
                    value={newEmployee.notes}
                    onChange={(e) => setNewEmployee({...newEmployee, notes: e.target.value})}
                    placeholder="أي ملاحظات إضافية..."
                  />
                </div>

                {/* أزرار التنفيذ */}
                <div className="flex justify-end space-x-3 space-x-reverse pt-6 border-t">
                  <button
                    onClick={() => setShowNewEmployee(false)}
                    className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    إلغاء
                  </button>
                  <button
                    onClick={handleAddEmployee}
                    className="btn-primary px-6 py-3"
                    disabled={!newEmployee.name || !newEmployee.phone || !newEmployee.department || !newEmployee.position}
                  >
                    إضافة الموظف
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* نافذة تسجيل حضور */}
      {showAttendance && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">تسجيل حضور اليوم</h2>
                <button
                  onClick={() => setShowAttendance(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                {employees.filter(e => e.status === 'active').map((employee) => {
                  const todayRecord = attendance.find(a => 
                    a.employeeId == employee.id && a.date === new Date().toISOString().split('T')[0]
                  )

                  return (
                    <div key={employee.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-gray-800">{employee.name}</p>
                          <p className="text-sm text-gray-600">{employee.position} - {employee.department}</p>
                        </div>
                        <div className="flex space-x-2 space-x-reverse">
                          <button
                            onClick={() => {
                              const newRecord = {
                                id: attendance.length + 1,
                                employeeId: employee.id,
                                date: new Date().toISOString().split('T')[0],
                                time: new Date().toLocaleTimeString('ar-SA'),
                                status: 'present',
                                notes: ''
                              }
                              setAttendance([...attendance, newRecord])
                            }}
                            className={`px-4 py-2 rounded-lg text-sm ${
                              todayRecord?.status === 'present'
                                ? 'bg-green-100 text-green-800 border border-green-200'
                                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                            }`}
                          >
                            حاضر
                          </button>
                          <button
                            onClick={() => {
                              const newRecord = {
                                id: attendance.length + 1,
                                employeeId: employee.id,
                                date: new Date().toISOString().split('T')[0],
                                time: new Date().toLocaleTimeString('ar-SA'),
                                status: 'absent',
                                notes: ''
                              }
                              setAttendance([...attendance, newRecord])
                            }}
                            className={`px-4 py-2 rounded-lg text-sm ${
                              todayRecord?.status === 'absent'
                                ? 'bg-red-100 text-red-800 border border-red-200'
                                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                            }`}
                          >
                            غائب
                          </button>
                          <button
                            onClick={() => {
                              const newRecord = {
                                id: attendance.length + 1,
                                employeeId: employee.id,
                                date: new Date().toISOString().split('T')[0],
                                time: new Date().toLocaleTimeString('ar-SA'),
                                status: 'late',
                                notes: ''
                              }
                              setAttendance([...attendance, newRecord])
                            }}
                            className={`px-4 py-2 rounded-lg text-sm ${
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
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  إغلاق
                </button>
                <button
                  onClick={() => setShowAttendance(false)}
                  className="btn-primary px-6 py-3"
                >
                  حفظ التغييرات
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default EmployeesManagement
