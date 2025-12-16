import React, { useState, useEffect } from 'react';
import {
  FiPlus, FiEdit, FiTrash2, FiFilter, FiDownload,
  FiPrinter, FiSearch, FiUsers, FiUser, FiDollarSign,
  FiCalendar, FiClock, FiMail, FiPhone, FiMapPin,
  FiCheckCircle, FiAlertCircle, FiEye, FiTrendingUp
} from 'react-icons/fi';
import { MdPerson, MdWork, MdPayment, MdSecurity } from 'react-icons/md';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const EmployeesManagement = ({ data, updateData, addNotification }) => {
  const [employees, setEmployees] = useState(data.employees || []);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('الكل');
  const [filterStatus, setFilterStatus] = useState('الكل');
  const [currentPage, setCurrentPage] = useState(1);
  const employeesPerPage = 10;

  const [newEmployee, setNewEmployee] = useState({
    name: '',
    position: 'عامل',
    department: 'إنتاج',
    salary: 0,
    hireDate: new Date(),
    phone: '',
    email: '',
    address: '',
    status: 'نشط',
    notes: '',
    workingHours: 8,
    overtimeRate: 1.5,
    bankAccount: '',
    emergencyContact: '',
    qualifications: ''
  });

  const positions = ['مدير', 'مشرف', 'فني', 'عامل', 'سائق', 'حارس', 'محاسب', 'أخرى'];
  const departments = ['إنتاج', 'صحة', 'مخازن', 'صيانة', 'إدارة', 'أخرى'];
  const statuses = ['نشط', 'إجازة', 'متوقف', 'مستقيل'];

  useEffect(() => {
    setEmployees(data.employees || []);
    filterEmployees();
  }, [data.employees, searchTerm, filterDepartment, filterStatus]);

  const filterEmployees = () => {
    let filtered = employees.filter(employee => {
      const matchesSearch = employee.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          employee.phone?.includes(searchTerm) ||
                          employee.email?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDepartment = filterDepartment === 'الكل' || employee.department === filterDepartment;
      const matchesStatus = filterStatus === 'الكل' || employee.status === filterStatus;
      return matchesSearch && matchesDepartment && matchesStatus;
    });

    // الترتيب حسب اسم الموظف
    filtered.sort((a, b) => a.name.localeCompare(b.name));
    setFilteredEmployees(filtered);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const updatedEmployee = {
      ...newEmployee,
      id: editingEmployee ? editingEmployee.id : Date.now(),
      createdAt: editingEmployee ? editingEmployee.createdAt : new Date().toISOString(),
      hireDate: newEmployee.hireDate.toISOString(),
      monthlySalary: newEmployee.salary,
      totalEarned: editingEmployee ? editingEmployee.totalEarned || 0 : 0,
      attendance: editingEmployee ? editingEmployee.attendance || [] : []
    };

    let updatedEmployees;
    if (editingEmployee) {
      updatedEmployees = employees.map(e => e.id === editingEmployee.id ? updatedEmployee : e);
      addNotification({
        type: 'success',
        title: 'تم التحديث',
        message: `تم تحديث بيانات الموظف ${updatedEmployee.name}`,
        time: new Date().toLocaleTimeString('ar-EG')
      });
    } else {
      updatedEmployees = [...employees, updatedEmployee];
      addNotification({
        type: 'success',
        title: 'تم الإضافة',
        message: `تم إضافة الموظف ${updatedEmployee.name}`,
        time: new Date().toLocaleTimeString('ar-EG')
      });
    }

    updateData('employees', updatedEmployees);
    setShowModal(false);
    resetForm();
  };

  const resetForm = () => {
    setNewEmployee({
      name: '',
      position: 'عامل',
      department: 'إنتاج',
      salary: 0,
      hireDate: new Date(),
      phone: '',
      email: '',
      address: '',
      status: 'نشط',
      notes: '',
      workingHours: 8,
      overtimeRate: 1.5,
      bankAccount: '',
      emergencyContact: '',
      qualifications: ''
    });
    setEditingEmployee(null);
  };

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setNewEmployee({
      ...employee,
      hireDate: new Date(employee.hireDate)
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الموظف؟')) {
      const updatedEmployees = employees.filter(e => e.id !== id);
      updateData('employees', updatedEmployees);
      addNotification({
        type: 'warning',
        title: 'تم الحذف',
        message: 'تم حذف الموظف بنجاح',
        time: new Date().toLocaleTimeString('ar-EG')
      });
    }
  };

  const handleAttendance = (employee) => {
    const today = new Date().toISOString().split('T')[0];
    const updatedAttendance = [...(employee.attendance || [])];
    
    const todayRecord = updatedAttendance.find(a => a.date === today);
    if (todayRecord) {
      // إذا كان موجوداً، تسجيل خروج
      todayRecord.checkOut = new Date().toLocaleTimeString('ar-EG');
      todayRecord.workedHours = calculateWorkedHours(todayRecord.checkIn, todayRecord.checkOut);
    } else {
      // تسجيل حضور
      updatedAttendance.push({
        date: today,
        checkIn: new Date().toLocaleTimeString('ar-EG'),
        checkOut: null,
        workedHours: 0,
        status: 'حاضر'
      });
    }

    const updatedEmployee = {
      ...employee,
      attendance: updatedAttendance
    };

    const updatedEmployees = employees.map(e => 
      e.id === employee.id ? updatedEmployee : e
    );

    updateData('employees', updatedEmployees);
    
    const action = todayRecord ? 'خروج' : 'حضور';
    addNotification({
      type: 'info',
      title: 'تم التسجيل',
      message: `تم تسجيل ${action} للموظف ${employee.name}`,
      time: new Date().toLocaleTimeString('ar-EG')
    });
  };

  const calculateWorkedHours = (checkIn, checkOut) => {
    if (!checkOut) return 0;
    
    const [inHours, inMinutes] = checkIn.split(':').map(Number);
    const [outHours, outMinutes] = checkOut.split(':').map(Number);
    
    const totalMinutes = (outHours * 60 + outMinutes) - (inHours * 60 + inMinutes);
    return Math.max(0, totalMinutes / 60);
  };

  const calculateSalary = (employee) => {
    const baseSalary = employee.salary || 0;
    const attendance = employee.attendance || [];
    
    // حساب أيام العمل لهذا الشهر
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const thisMonthAttendance = attendance.filter(a => {
      const date = new Date(a.date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });
    
    const workedDays = thisMonthAttendance.length;
    const dailyRate = baseSalary / 30; // افتراض 30 يوم في الشهر
    
    // حساب ساعات العمل الإضافية
    let overtimeHours = 0;
    thisMonthAttendance.forEach(a => {
      const regularHours = employee.workingHours || 8;
      if (a.workedHours > regularHours) {
        overtimeHours += a.workedHours - regularHours;
      }
    });
    
    const overtimePay = overtimeHours * dailyRate / 8 * (employee.overtimeRate || 1.5);
    const totalSalary = (workedDays * dailyRate) + overtimePay;
    
    return {
      baseSalary,
      workedDays,
      overtimeHours: overtimeHours.toFixed(2),
      overtimePay: overtimePay.toFixed(2),
      totalSalary: totalSalary.toFixed(2)
    };
  };

  const getStatusBadge = (status) => {
    const badges = {
      'نشط': 'bg-green-100 text-green-800',
      'إجازة': 'bg-blue-100 text-blue-800',
      'متوقف': 'bg-yellow-100 text-yellow-800',
      'مستقيل': 'bg-red-100 text-red-800'
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  const getDepartmentColor = (department) => {
    const colors = {
      'إنتاج': 'bg-blue-100 text-blue-800',
      'صحة': 'bg-red-100 text-red-800',
      'مخازن': 'bg-yellow-100 text-yellow-800',
      'صيانة': 'bg-green-100 text-green-800',
      'إدارة': 'bg-purple-100 text-purple-800',
      'أخرى': 'bg-gray-100 text-gray-800'
    };
    return colors[department] || 'bg-gray-100 text-gray-800';
  };

  // حساب إحصائيات الموظفين
  const calculateStats = () => {
    const totalEmployees = employees.length;
    const activeEmployees = employees.filter(e => e.status === 'نشط').length;
    const onLeave = employees.filter(e => e.status === 'إجازة').length;
    const totalSalary = employees.reduce((sum, e) => sum + (e.salary || 0), 0);
    
    // الحضور اليوم
    const today = new Date().toISOString().split('T')[0];
    const presentToday = employees.filter(e => 
      e.attendance?.some(a => a.date === today && a.status === 'حاضر')
    ).length;

    return {
      totalEmployees,
      activeEmployees,
      onLeave,
      totalSalary: totalSalary.toFixed(2),
      presentToday,
      attendanceRate: totalEmployees > 0 ? ((presentToday / totalEmployees) * 100).toFixed(1) : 0
    };
  };

  const stats = calculateStats();
  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * employeesPerPage,
    currentPage * employeesPerPage
  );
  const totalPages = Math.ceil(filteredEmployees.length / employeesPerPage);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* رأس الصفحة */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-3">
            <FiUsers className="text-primary-600" />
            إدارة الموظفين
          </h1>
          <p className="text-gray-600 mt-2">
            إدارة معلومات الموظفين، الحضور، والمرتبات
          </p>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={() => {
              setShowModal(true);
              resetForm();
            }}
            className="btn btn-primary flex items-center gap-2"
          >
            <FiPlus /> موظف جديد
          </button>
          <button className="btn bg-white border border-gray-300 text-gray-700 flex items-center gap-2">
            <FiDownload /> تقرير مرتبات
          </button>
          <button className="btn bg-white border border-gray-300 text-gray-700 flex items-center gap-2">
            <FiPrinter /> طباعة
          </button>
        </div>
      </div>

      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">إجمالي الموظفين</p>
              <h3 className="text-2xl font-bold text-gray-800">
                {stats.totalEmployees}
              </h3>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <FiUsers className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">النشطين</p>
              <h3 className="text-2xl font-bold text-gray-800">
                {stats.activeEmployees}
              </h3>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <FiCheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">الحضور اليوم</p>
              <h3 className="text-2xl font-bold text-gray-800">
                {stats.presentToday}
              </h3>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <FiClock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
        
        <div className="glasscard rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">في إجازة</p>
              <h3 className="text-2xl font-bold text-gray-800">
                {stats.onLeave}
              </h3>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <FiAlertCircle className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
        
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">إجمالي المرتبات</p>
              <h3 className="text-2xl font-bold text-gray-800">
                {stats.totalSalary} ج.م
              </h3>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <FiDollarSign className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* تنبيهات الحضور */}
      {stats.attendanceRate < 70 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <FiAlertCircle className="text-yellow-500 text-xl mt-1" />
            <div className="flex-1">
              <h4 className="font-medium text-yellow-800">تنبيه انخفاض الحضور</h4>
              <p className="text-yellow-600 text-sm mt-1">
                نسبة الحضور اليومية {stats.attendanceRate}%، أقل من المستوى المطلوب.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* أدوات البحث والتصفية */}
      <div className="glass-card rounded-xl p-5">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <FiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="ابحث باسم الموظف، رقم الهاتف، أو البريد..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex gap-3">
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="الكل">جميع الأقسام</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="الكل">جميع الحالات</option>
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
            
            <button className="btn bg-white border border-gray-300 text-gray-700 flex items-center gap-2">
              <FiFilter /> تصفية متقدمة
            </button>
          </div>
        </div>

        {/* جدول الموظفين */}
        <div className="overflow-x-auto rounded-lg border border-gray-200">
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
                  الحضور
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  المرتب
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
              {paginatedEmployees.length > 0 ? (
                paginatedEmployees.map((employee) => {
                  const salaryInfo = calculateSalary(employee);
                  const today = new Date().toISOString().split('T')[0];
                  const todayAttendance = employee.attendance?.find(a => a.date === today);
                  
                  return (
                    <tr key={employee.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary-100 rounded-lg">
                            <FiUser className="w-5 h-5 text-primary-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{employee.name}</h4>
                            <div className="text-sm text-gray-500 mt-1">
                              {employee.phone && <div className="flex items-center gap-1">
                                <FiPhone className="w-3 h-3" /> {employee.phone}
                              </div>}
                              {employee.email && <div className="flex items-center gap-1">
                                <FiMail className="w-3 h-3" /> {employee.email}
                              </div>}
                            </div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          <div>
                            <span className="font-medium text-gray-900">{employee.position}</span>
                          </div>
                          <div>
                            <span className={`px-2 py-1 rounded-full text-xs ${getDepartmentColor(employee.department)}`}>
                              {employee.department}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500">
                            <FiCalendar className="inline ml-1" />
                            التعيين: {new Date(employee.hireDate).toLocaleDateString('ar-EG')}
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          <div>
                            {todayAttendance ? (
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span className="text-sm text-green-600">حاضر</span>
                                <span className="text-xs text-gray-500">
                                  ({todayAttendance.checkIn})
                                </span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                <span className="text-sm text-red-600">غائب</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="text-xs text-gray-500">
                            <FiClock className="inline ml-1" />
                            أيام العمل: {salaryInfo.workedDays} يوم
                          </div>
                          
                          <div className="text-xs text-blue-600">
                            إضافي: {salaryInfo.overtimeHours} ساعة
                          </div>
                          
                          <button
                            onClick={() => handleAttendance(employee)}
                            className={`text-xs px-2 py-1 rounded ${
                              todayAttendance && !todayAttendance.checkOut
                                ? 'bg-red-100 text-red-600 hover:bg-red-200'
                                : 'bg-green-100 text-green-600 hover:bg-green-200'
                            }`}
                          >
                            {todayAttendance && !todayAttendance.checkOut ? 'تسجيل خروج' : 'تسجيل حضور'}
                          </button>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          <div className="text-lg font-bold text-gray-900">
                            {employee.salary?.toFixed(2)} ج.م
                          </div>
                          <div className="text-sm text-gray-600">
                            شهرياً
                          </div>
                          <div className="text-xs text-green-600">
                            إجمالي المستحق: {salaryInfo.totalSalary} ج.م
                          </div>
                          {salaryInfo.overtimePay > 0 && (
                            <div className="text-xs text-blue-600">
                              إضافي: +{salaryInfo.overtimePay} ج.م
                            </div>
                          )}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(employee.status)}`}>
                            {employee.status}
                          </span>
                          
                          {employee.status === 'إجازة' && (
                            <div className="text-xs text-blue-600">
                              ⏳ في إجازة
                            </div>
                          )}
                          
                          <div className="text-xs text-gray-500">
                            الساعات: {employee.workingHours || 8} ساعة/يوم
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleAttendance(employee)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
                            title="تسجيل حضور/انصراف"
                          >
                            <FiClock className="w-4 h-4" />
                          </button>
                          
                          <button
                            onClick={() => handleEdit(employee)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                            title="تعديل"
                          >
                            <FiEdit className="w-4 h-4" />
                          </button>
                          
                          <button
                            onClick={() => handleDelete(employee.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                            title="حذف"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                          
                          <button
                            onClick={() => {
                              const salaryInfo = calculateSalary(employee);
                              addNotification({
                                type: 'info',
                                title: 'تفاصيل الراتب',
                                message: `راتب ${employee.name} لهذا الشهر: ${salaryInfo.totalSalary} ج.م`,
                                time: new Date().toLocaleTimeString('ar-EG')
                              });
                            }}
                            className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors duration-200"
                            title="تفاصيل الراتب"
                          >
                            <FiDollarSign className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <div className="text-gray-500">
                      <FiUsers className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p className="text-lg">لا توجد موظفين</p>
                      <p className="text-sm mt-2">ابدأ بإضافة موظف جديد</p>
                      <button
                        onClick={() => setShowModal(true)}
                        className="mt-4 btn btn-primary inline-flex items-center gap-2"
                      >
                        <FiPlus /> إضافة موظف جديد
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* الترقيم الصفحي */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-700">
              عرض <span className="font-medium">{(currentPage - 1) * employeesPerPage + 1}</span> إلى{' '}
              <span className="font-medium">
                {Math.min(currentPage * employeesPerPage, filteredEmployees.length)}
              </span>{' '}
              من <span className="font-medium">{filteredEmployees.length}</span> موظف
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                السابق
              </button>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-1 rounded ${currentPage === pageNum 
                      ? 'bg-primary-600 text-white' 
                      : 'border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                التالي
              </button>
            </div>
          </div>
        )}
      </div>

      {/* تقرير المرتبات السريع */}
      <div className="glass-card rounded-xl p-5">
        <h3 className="text-lg font-bold text-gray-800 mb-6">تقرير المرتبات الشهرية</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">الموظف</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">الراتب الأساسي</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">أيام العمل</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">الساعات الإضافية</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">الإضافي</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">الإجمالي</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {employees.slice(0, 5).map(employee => {
                const salaryInfo = calculateSalary(employee);
                return (
                  <tr key={employee.id}>
                    <td className="px-6 py-4 font-medium">{employee.name}</td>
                    <td className="px-6 py-4">{salaryInfo.baseSalary.toFixed(2)} ج.م</td>
                    <td className="px-6 py-4">{salaryInfo.workedDays} يوم</td>
                    <td className="px-6 py-4">{salaryInfo.overtimeHours} ساعة</td>
                    <td className="px-6 py-4 text-green-600">+{salaryInfo.overtimePay} ج.م</td>
                    <td className="px-6 py-4 font-bold">{salaryInfo.totalSalary} ج.م</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="bg-gray-50">
              <tr>
                <td colSpan="5" className="px-6 py-4 font-bold text-right">الإجمالي:</td>
                <td className="px-6 py-4 font-bold text-green-600">
                  {employees.reduce((sum, e) => {
                    const salaryInfo = calculateSalary(e);
                    return sum + parseFloat(salaryInfo.totalSalary);
                  }, 0).toFixed(2)} ج.م
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* مودال إضافة/تعديل موظف */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">
                  {editingEmployee ? 'تعديل بيانات الموظف' : 'إضافة موظف جديد'}
                </h3>
                <button
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* معلومات شخصية */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-700 border-b pb-2">المعلومات الشخصية</h4>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        الاسم الكامل *
                      </label>
                      <input
                        type="text"
                        required
                        value={newEmployee.name}
                        onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="الاسم الثلاثي"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        رقم الهاتف *
                      </label>
                      <input
                        type="tel"
                        required
                        value={newEmployee.phone}
                        onChange={(e) => setNewEmployee({...newEmployee, phone: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="رقم الهاتف"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        البريد الإلكتروني
                      </label>
                      <input
                        type="email"
                        value={newEmployee.email}
                        onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="البريد الإلكتروني"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        العنوان
                      </label>
                      <input
                        type="text"
                        value={newEmployee.address}
                        onChange={(e) => setNewEmployee({...newEmployee, address: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="عنوان السكن"
                      />
                    </div>
                  </div>
                  
                  {/* معلومات الوظيفة */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-700 border-b pb-2">معلومات الوظيفة</h4>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        المسمى الوظيفي *
                      </label>
                      <select
                        required
                        value={newEmployee.position}
                        onChange={(e) => setNewEmployee({...newEmployee, position: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        {positions.map(position => (
                          <option key={position} value={position}>{position}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        القسم *
                      </label>
                      <select
                        required
                        value={newEmployee.department}
                        onChange={(e) => setNewEmployee({...newEmployee, department: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        {departments.map(dept => (
                          <option key={dept} value={dept}>{dept}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        تاريخ التعيين *
                      </label>
                      <DatePicker
                        selected={newEmployee.hireDate}
                        onChange={(date) => setNewEmployee({...newEmployee, hireDate: date})}
                        dateFormat="yyyy/MM/dd"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        الحالة *
                      </label>
                      <select
                        required
                        value={newEmployee.status}
                        onChange={(e) => setNewEmployee({...newEmployee, status: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        {statuses.map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  {/* المعلومات المالية */}
                  <div className="space-y-4 md:col-span-2">
                    <h4 className="font-medium text-gray-700 border-b pb-2">المعلومات المالية</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          الراتب الشهري (ج.م) *
                        </label>
                        <input
                          type="number"
                          required
                          min="0"
                          step="0.01"
                          value={newEmployee.salary}
                          onChange={(e) => setNewEmployee({...newEmployee, salary: parseFloat(e.target.value) || 0})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          ساعات العمل اليومية
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="12"
                          value={newEmployee.workingHours}
                          onChange={(e) => setNewEmployee({...newEmployee, workingHours: parseInt(e.target.value) || 8})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          معدل الساعات الإضافية
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="3"
                          step="0.1"
                          value={newEmployee.overtimeRate}
                          onChange={(e) => setNewEmployee({...newEmployee, overtimeRate: parseFloat(e.target.value) || 1.5})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          الحساب البنكي
                        </label>
                        <input
                          type="text"
                          value={newEmployee.bankAccount}
                          onChange={(e) => setNewEmployee({...newEmployee, bankAccount: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="رقم الحساب البنكي"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          جهة اتصال للطوارئ
                        </label>
                        <input
                          type="text"
                          value={newEmployee.emergencyContact}
                          onChange={(e) => setNewEmployee({...newEmployee, emergencyContact: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="اسم ورقم للطوارئ"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        المؤهلات والخبرات
                      </label>
                      <textarea
                        value={newEmployee.qualifications}
                        onChange={(e) => setNewEmployee({...newEmployee, qualifications: e.target.value})}
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="المؤهلات الدراسية، الدورات، الخبرات..."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        ملاحظات إضافية
                      </label>
                      <textarea
                        value={newEmployee.notes}
                        onChange={(e) => setNewEmployee({...newEmployee, notes: e.target.value})}
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="أي ملاحظات إضافية عن الموظف..."
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end gap-3 mt-8 pt-6 border-t">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 flex items-center gap-2"
                  >
                    <FiPlus /> {editingEmployee ? 'تحديث الموظف' : 'إضافة الموظف'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeesManagement;
