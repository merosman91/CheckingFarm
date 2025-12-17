import React, { useState, useEffect } from 'react'

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general')
  const [settings, setSettings] = useState({
    general: {
      farmName: 'مزرعة دواجني',
      farmType: 'دواجن تسمين',
      email: 'info@douajny.com',
      phone: '0501234567',
      address: 'الرياض، المملكة العربية السعودية',
      currency: 'SAR',
      language: 'ar',
      timezone: 'Asia/Riyadh',
      dateFormat: 'dd/MM/yyyy',
      theme: 'light'
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      salesAlerts: true,
      inventoryAlerts: true,
      healthAlerts: true,
      financialAlerts: true,
      dailyReports: true
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: 30,
      passwordChangeRequired: false,
      loginAttempts: 5,
      ipWhitelist: []
    },
    backup: {
      autoBackup: true,
      backupFrequency: 'daily',
      lastBackup: '2024-01-20 14:30:00',
      backupLocation: 'local',
      keepBackups: 30
    }
  })

  const [users, setUsers] = useState([
    { id: 1, name: 'مدير النظام', email: 'admin@douajny.com', role: 'admin', status: 'active' },
    { id: 2, name: 'أحمد محمد', email: 'ahmed@douajny.com', role: 'manager', status: 'active' },
    { id: 3, name: 'سالم العبدلي', email: 'salem@douajny.com', role: 'viewer', status: 'inactive' }
  ])

  const [backupHistory, setBackupHistory] = useState([
    { id: 1, date: '2024-01-20 14:30:00', size: '45 MB', type: 'auto', status: 'success' },
    { id: 2, date: '2024-01-19 14:30:00', size: '43 MB', type: 'auto', status: 'success' },
    { id: 3, date: '2024-01-18 14:30:00', size: '42 MB', type: 'manual', status: 'success' }
  ])

  useEffect(() => {
    const savedSettings = localStorage.getItem('appSettings')
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('appSettings', JSON.stringify(settings))
  }, [settings])

  // دالة مساعدة لعرض الأيقونات
  const Icon = ({ name, className = "w-5 h-5", ...props }) => (
    <img 
      src={`/icons/${name}.svg`} 
      alt={name}
      className={className}
      {...props}
    />
  )

  const handleSettingChange = (category, key, value) => {
    setSettings({
      ...settings,
      [category]: {
        ...settings[category],
        [key]: value
      }
    })
  }

  const handleBackup = () => {
    const backup = {
      id: backupHistory.length + 1,
      date: new Date().toLocaleString('ar-SA'),
      size: '46 MB',
      type: 'manual',
      status: 'success'
    }
    setBackupHistory([backup, ...backupHistory])
    alert('تم إنشاء نسخة احتياطية بنجاح!')
  }

  const handleRestore = () => {
    if (window.confirm('هل أنت متأكد من استعادة النسخة الاحتياطية؟ سيتم فقدان البيانات الحالية.')) {
      alert('تم استعادة النسخة الاحتياطية بنجاح!')
    }
  }

  const handleExportData = () => {
    const data = {
      settings,
      users,
      backupHistory,
      exportedAt: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `douajny-backup-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* رأس الصفحة */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">الإعدادات</h1>
          <p className="text-gray-600 mt-1">إعدادات النظام وإدارة المستخدمين</p>
        </div>
        <div className="flex items-center space-x-3 space-x-reverse">
          <button 
            className="btn-primary flex items-center"
            onClick={() => {
              localStorage.setItem('appSettings', JSON.stringify(settings))
              alert('تم حفظ الإعدادات بنجاح!')
            }}
          >
            <Icon name="save" className="w-4 h-4 ml-2" />
            حفظ التغييرات
          </button>
        </div>
      </div>

      {/* تنقل بين التبويبات */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 space-x-reverse">
          {[
            { id: 'general', label: 'عام', icon: 'settings' },
            { id: 'users', label: 'المستخدمين', icon: 'users' },
            { id: 'notifications', label: 'الإشعارات', icon: 'bell' },
            { id: 'security', label: 'الأمان', icon: 'shield' },
            { id: 'backup', label: 'النسخ الاحتياطي', icon: 'database' },
            { id: 'system', label: 'النظام', icon: 'building' }
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
              <Icon name={tab.icon} className="w-4 h-4 ml-2" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* محتوى التبويبات */}
      <div className="space-y-6">
        {activeTab === 'general' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* معلومات المزرعة */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">معلومات المزرعة</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    اسم المزرعة *
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    value={settings.general.farmName}
                    onChange={(e) => handleSettingChange('general', 'farmName', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    نوع النشاط
                  </label>
                  <select
                    className="input-field"
                    value={settings.general.farmType}
                    onChange={(e) => handleSettingChange('general', 'farmType', e.target.value)}
                  >
                    <option value="دواجن تسمين">دواجن تسمين</option>
                    <option value="دواجن بياض">دواجن بياض</option>
                    <option value="أمهات">أمهات</option>
                    <option value="مختلط">مختلط</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      البريد الإلكتروني
                    </label>
                    <div className="relative">
                      <Icon name="mail" className="absolute w-4 h-4 right-3 top-3 text-gray-400" />
                      <input
                        type="email"
                        className="input-field pr-10"
                        value={settings.general.email}
                        onChange={(e) => handleSettingChange('general', 'email', e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      رقم الهاتف
                    </label>
                    <div className="relative">
                      <Icon name="phone" className="absolute w-4 h-4 right-3 top-3 text-gray-400" />
                      <input
                        type="tel"
                        className="input-field pr-10"
                        value={settings.general.phone}
                        onChange={(e) => handleSettingChange('general', 'phone', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    العنوان
                  </label>
                  <div className="relative">
                    <Icon name="map-pin" className="absolute w-4 h-4 right-3 top-3 text-gray-400" />
                    <input
                      type="text"
                      className="input-field pr-10"
                      value={settings.general.address}
                      onChange={(e) => handleSettingChange('general', 'address', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* إعدادات النظام */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">إعدادات النظام</h2>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      العملة
                    </label>
                    <select
                      className="input-field"
                      value={settings.general.currency}
                      onChange={(e) => handleSettingChange('general', 'currency', e.target.value)}
                    >
                      <option value="SAR">ريال سعودي (ر.س)</option>
                      <option value="USD">دولار أمريكي ($)</option>
                      <option value="EUR">يورو (€)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      اللغة
                    </label>
                    <select
                      className="input-field"
                      value={settings.general.language}
                      onChange={(e) => handleSettingChange('general', 'language', e.target.value)}
                    >
                      <option value="ar">العربية</option>
                      <option value="en">الإنجليزية</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      المنطقة الزمنية
                    </label>
                    <select
                      className="input-field"
                      value={settings.general.timezone}
                      onChange={(e) => handleSettingChange('general', 'timezone', e.target.value)}
                    >
                      <option value="Asia/Riyadh">الرياض (UTC+3)</option>
                      <option value="Asia/Dubai">دبي (UTC+4)</option>
                      <option value="Asia/Kuwait">الكويت (UTC+3)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      تنسيق التاريخ
                    </label>
                    <select
                      className="input-field"
                      value={settings.general.dateFormat}
                      onChange={(e) => handleSettingChange('general', 'dateFormat', e.target.value)}
                    >
                      <option value="dd/MM/yyyy">يوم/شهر/سنة</option>
                      <option value="yyyy-MM-dd">سنة-شهر-يوم</option>
                      <option value="MM/dd/yyyy">شهر/يوم/سنة</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    المظهر
                  </label>
                  <div className="flex space-x-4 space-x-reverse">
                    <button
                      onClick={() => handleSettingChange('general', 'theme', 'light')}
                      className={`flex-1 p-4 border rounded-lg flex flex-col items-center ${
                        settings.general.theme === 'light'
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <Icon name="sun" className={`w-6 h-6 mb-2 ${
                        settings.general.theme === 'light' ? 'text-blue-600' : 'text-gray-400'
                      }`} />
                      <span className={`font-medium ${
                        settings.general.theme === 'light' ? 'text-blue-700' : 'text-gray-700'
                      }`}>
                        فاتح
                      </span>
                    </button>

                    <button
                      onClick={() => handleSettingChange('general', 'theme', 'dark')}
                      className={`flex-1 p-4 border rounded-lg flex flex-col items-center ${
                        settings.general.theme === 'dark'
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <Icon name="moon" className={`w-6 h-6 mb-2 ${
                        settings.general.theme === 'dark' ? 'text-blue-600' : 'text-gray-400'
                      }`} />
                      <span className={`font-medium ${
                        settings.general.theme === 'dark' ? 'text-blue-700' : 'text-gray-700'
                      }`}>
                        داكن
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="card">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">إدارة المستخدمين</h2>
                <button className="btn-secondary flex items-center">
                  <Icon name="users" className="w-4 h-4 ml-2" />
                  إضافة مستخدم
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        المستخدم
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        البريد الإلكتروني
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        الصلاحية
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
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center ml-4">
                              <Icon name="user" className="w-5 h-5 text-gray-600" />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{user.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 text-xs rounded-full ${
                            user.role === 'admin' ? 'bg-red-100 text-red-800' :
                            user.role === 'manager' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {user.role === 'admin' ? 'مدير النظام' :
                             user.role === 'manager' ? 'مدير' : 'مشاهد'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 text-xs rounded-full ${
                            user.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {user.status === 'active' ? 'نشط' : 'غير نشط'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2 space-x-reverse">
                            <button className="text-blue-600 hover:text-blue-900">
                              <Icon name="key" className="w-4 h-4" />
                            </button>
                            <button className="text-yellow-600 hover:text-yellow-900">
                              <Icon name="edit" className="w-4 h-4" />
                            </button>
                            <button className="text-red-600 hover:text-red-900">
                              <Icon name="trash-2" className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* أدوار المستخدمين */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">الصلاحيات والأدوار</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                  <h3 className="font-medium text-red-800 mb-2">مدير النظام</h3>
                  <ul className="text-sm text-red-700 space-y-1">
                    <li>• جميع الصلاحيات</li>
                    <li>• إدارة المستخدمين</li>
                    <li>• تعديل الإعدادات</li>
                    <li>• الوصول الكامل</li>
                  </ul>
                </div>

                <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
                  <h3 className="font-medium text-blue-800 mb-2">مدير</h3>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• إدارة العمليات</li>
                    <li>• تقارير متقدمة</li>
                    <li>• إضافة بيانات</li>
                    <li>• تعديل محدود</li>
                  </ul>
                </div>

                <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <h3 className="font-medium text-gray-800 mb-2">مشاهد</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• عرض البيانات</li>
                    <li>• تقارير أساسية</li>
                    <li>• لا يمكن التعديل</li>
                    <li>• صلاحيات محدودة</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">إعدادات الإشعارات</h2>
            <div className="space-y-6">
              {Object.entries(settings.notifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">
                      {key === 'emailNotifications' && 'الإشعارات البريدية'}
                      {key === 'pushNotifications' && 'الإشعارات الفورية'}
                      {key === 'salesAlerts' && 'تنبيهات المبيعات'}
                      {key === 'inventoryAlerts' && 'تنبيهات المخزون'}
                      {key === 'healthAlerts' && 'تنبيهات الصحة'}
                      {key === 'financialAlerts' && 'تنبيهات مالية'}
                      {key === 'dailyReports' && 'التقارير اليومية'}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {key === 'emailNotifications' && 'إرسال الإشعارات عبر البريد الإلكتروني'}
                      {key === 'pushNotifications' && 'إشعارات فورية في التطبيق'}
                      {key === 'salesAlerts' && 'تنبيهات عند إكمال عمليات البيع'}
                      {key === 'inventoryAlerts' && 'تنبيهات عند انخفاض المخزون'}
                      {key === 'healthAlerts' && 'تنبيهات مهمة عن صحة الطيور'}
                      {key === 'financialAlerts' && 'تنبيهات المدفوعات والمستحقات'}
                      {key === 'dailyReports' && 'إرسال تقرير يومي تلقائي'}
                    </p>
                  </div>
                  <button
                    onClick={() => handleSettingChange('notifications', key, !value)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                      value ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      value ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'backup' && (
          <div className="space-y-6">
            <div className="card">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">النسخ الاحتياطي</h2>
                <div className="flex space-x-3 space-x-reverse">
                  <button 
                    className="btn-secondary flex items-center"
                    onClick={handleBackup}
                  >
                    <Icon name="download" className="w-4 h-4 ml-2" />
                    نسخة احتياطية الآن
                  </button>
                  <button 
                    className="btn-primary flex items-center"
                    onClick={handleExportData}
                  >
                    <Icon name="upload" className="w-4 h-4 ml-2" />
                    تصدير البيانات
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-blue-800">النسخ الاحتياطي التلقائي</p>
                      <p className="text-sm text-blue-700 mt-1">
                        {settings.backup.autoBackup ? 'مفعل' : 'معطل'} - {settings.backup.backupFrequency === 'daily' ? 'يومي' : 'أسبوعي'}
                      </p>
                    </div>
                    <button
                      onClick={() => handleSettingChange('backup', 'autoBackup', !settings.backup.autoBackup)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                        settings.backup.autoBackup ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                        settings.backup.autoBackup ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      تكرار النسخ الاحتياطي
                    </label>
                    <select
                      className="input-field"
                      value={settings.backup.backupFrequency}
                      onChange={(e) => handleSettingChange('backup', 'backupFrequency', e.target.value)}
                    >
                      <option value="daily">يومي</option>
                      <option value="weekly">أسبوعي</option>
                      <option value="monthly">شهري</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      عدد النسخ المحفوظة
                    </label>
                    <input
                      type="number"
                      className="input-field"
                      value={settings.backup.keepBackups}
                      onChange={(e) => handleSettingChange('backup', 'keepBackups', parseInt(e.target.value) || 30)}
                      min="1"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* سجل النسخ الاحتياطية */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">سجل النسخ الاحتياطية</h2>
              <div className="space-y-4">
                {backupHistory.map((backup) => (
                  <div key={backup.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-800">
                          {backup.type === 'auto' ? 'نسخة احتياطية تلقائية' : 'نسخة احتياطية يدوية'}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {backup.date} - {backup.size}
                        </p>
                      </div>
                      <div className="flex items-center space-x-3 space-x-reverse">
                        <span className={`px-3 py-1 text-xs rounded-full ${
                          backup.status === 'success' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {backup.status === 'success' ? 'ناجح' : 'فاشل'}
                        </span>
                        <button 
                          className="text-blue-600 hover:text-blue-900"
                          onClick={handleRestore}
                        >
                          <Icon name="refresh-cw" className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* تحذير */}
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center">
                <Icon name="alert-triangle" className="w-5 h-5 text-yellow-600 ml-3" />
                <div>
                  <p className="font-medium text-yellow-800">تنبيه هام</p>
                  <p className="text-sm text-yellow-700 mt-1">
                    يوصى بالاحتفاظ بنسخ احتياطية منتظمة لحماية بيانات المزرعة. يتم تخزين النسخ محلياً فقط.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'system' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">معلومات النظام</h2>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">إصدار التطبيق</p>
                  <p className="font-medium text-gray-800 mt-1">1.0.0</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">تاريخ آخر تحديث</p>
                  <p className="font-medium text-gray-800 mt-1">يناير 2024</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">حجم قاعدة البيانات</p>
                  <p className="font-medium text-gray-800 mt-1">46 MB</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">عدد السجلات</p>
                  <p className="font-medium text-gray-800 mt-1">1,245 سجل</p>
                </div>
              </div>
            </div>

            <div className="card">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">أدوات النظام</h2>
              <div className="space-y-4">
                <button className="w-full p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-between">
                  <span className="font-medium text-gray-800">مسح ذاكرة التخزين المؤقت</span>
                  <Icon name="refresh-cw" className="w-4 h-4 text-gray-400" />
                </button>

                <button className="w-full p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-between">
                  <span className="font-medium text-gray-800">فحص قاعدة البيانات</span>
                  <Icon name="database" className="w-4 h-4 text-gray-400" />
                </button>

                <button className="w-full p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-between">
                  <span className="font-medium text-gray-800">سجلات النظام</span>
                  <Icon name="file-text" className="w-4 h-4 text-gray-400" />
                </button>

                <button className="w-full p-4 border border-red-300 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-between text-red-600">
                  <span className="font-medium">إعادة تعيين النظام</span>
                  <Icon name="alert-triangle" className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Settings
