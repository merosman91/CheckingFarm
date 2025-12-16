import React, { useState, useEffect } from 'react';
import {
  FiSave, FiRefreshCw, FiBell, FiLock,
  FiDatabase, FiGlobe, FiMoon, FiSun,
  FiPrinter, FiDownload, FiUpload,
  FiUser, FiShield, FiClock, FiHelpCircle
} from 'react-icons/fi';
import { MdPoultry, MdSettings, MdSecurity } from 'react-icons/md';

const Settings = ({ data, updateData, addNotification }) => {
  const [settings, setSettings] = useState(data.settings || {});
  const [activeTab, setActiveTab] = useState('عام');
  const [saving, setSaving] = useState(false);

  const tabs = [
    { id: 'عام', label: 'عام', icon: <MdSettings /> },
    { id: 'المزرعة', label: 'المزرعة', icon: <MdPoultry /> },
    { id: 'المستخدمين', label: 'المستخدمين', icon: <FiUser /> },
    { id: 'الأمان', label: 'الأمان', icon: <FiShield /> },
    { id: 'التنبيهات', label: 'التنبيهات', icon: <FiBell /> },
    { id: 'المظهر', label: 'المظهر', icon: <FiSun /> },
    { id: 'المزامنة', label: 'المزامنة', icon: <FiDatabase /> },
    { id: 'التطبيق', label: 'التطبيق', icon: <FiHelpCircle /> }
  ];

  const initialSettings = {
    // الإعدادات العامة
    farmName: 'مزرعة دواجني',
    farmType: 'دواجن لاحم',
    farmLocation: '',
    farmSize: '',
    contactPhone: '',
    contactEmail: '',
    
    // إعدادات المزرعة
    currency: 'ج.م',
    weightUnit: 'كيلو',
    temperatureUnit: 'مئوية',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '12 ساعة',
    
    // إعدادات المستخدمين
    users: [],
    userRoles: ['مدير', 'مشرف', 'مستخدم'],
    
    // إعدادات الأمان
    requirePassword: true,
    sessionTimeout: 60, // دقائق
    backupAuto: true,
    backupFrequency: 'يومي',
    
    // إعدادات التنبيهات
    mortalityAlert: true,
    mortalityThreshold: 5, // نسبة
    lowStockAlert: true,
    vaccinationAlert: true,
    financialAlert: true,
    
    // إعدادات المظهر
    theme: 'فاتح',
    fontSize: 'متوسط',
    language: 'العربية',
    
    // إعدادات المزامنة
    autoSync: false,
    syncInterval: 30, // دقائق
    cloudBackup: false,
    
    // إعدادات التطبيق
    appVersion: '2.0.0',
    lastUpdate: new Date().toISOString(),
    analytics: true,
    crashReports: false
  };

  useEffect(() => {
    if (!data.settings || Object.keys(data.settings).length === 0) {
      setSettings(initialSettings);
    } else {
      setSettings({ ...initialSettings, ...data.settings });
    }
  }, [data.settings]);

  const handleChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = () => {
    setSaving(true);
    
    // محاكاة حفظ الإعدادات
    setTimeout(() => {
      updateData('settings', settings);
      setSaving(false);
      
      addNotification({
        type: 'success',
        title: 'تم الحفظ',
        message: 'تم حفظ الإعدادات بنجاح',
        time: new Date().toLocaleTimeString('ar-EG')
      });
    }, 1000);
  };

  const handleReset = () => {
    if (window.confirm('هل تريد استعادة الإعدادات الافتراضية؟')) {
      setSettings(initialSettings);
      
      addNotification({
        type: 'warning',
        title: 'تم الاستعادة',
        message: 'تم استعادة الإعدادات الافتراضية',
        time: new Date().toLocaleTimeString('ar-EG')
      });
    }
  };

  const handleExportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', `douajny_settings_${new Date().toISOString().split('T')[0]}.json`);
    linkElement.click();
    
    addNotification({
      type: 'success',
      title: 'تم التصدير',
      message: 'تم تصدير الإعدادات',
      time: new Date().toLocaleTimeString('ar-EG')
    });
  };

  const handleImportSettings = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedSettings = JSON.parse(e.target.result);
        setSettings(importedSettings);
        
        addNotification({
          type: 'success',
          title: 'تم الاستيراد',
          message: 'تم استيراد الإعدادات',
          time: new Date().toLocaleTimeString('ar-EG')
        });
      } catch (error) {
        addNotification({
          type: 'error',
          title: 'خطأ',
          message: 'ملف غير صالح',
          time: new Date().toLocaleTimeString('ar-EG')
        });
      }
      event.target.value = '';
    };
    reader.readAsText(file);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'عام':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  اسم المزرعة
                </label>
                <input
                  type="text"
                  value={settings.farmName}
                  onChange={(e) => handleChange('farmName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  نوع المزرعة
                </label>
                <select
                  value={settings.farmType}
                  onChange={(e) => handleChange('farmType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="دواجن لاحم">دواجن لاحم</option>
                  <option value="دواجن بياض">دواجن بياض</option>
                  <option value="أمهات">أمهات</option>
                  <option value="مختلط">مختلط</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الموقع
                </label>
                <input
                  type="text"
                  value={settings.farmLocation}
                  onChange={(e) => handleChange('farmLocation', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="عنوان المزرعة"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  المساحة
                </label>
                <input
                  type="text"
                  value={settings.farmSize}
                  onChange={(e) => handleChange('farmSize', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="مساحة المزرعة"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  رقم الهاتف
                </label>
                <input
                  type="tel"
                  value={settings.contactPhone}
                  onChange={(e) => handleChange('contactPhone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="رقم الاتصال الرئيسي"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  value={settings.contactEmail}
                  onChange={(e) => handleChange('contactEmail', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="البريد الإلكتروني"
                />
              </div>
            </div>
          </div>
        );

      case 'المزرعة':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  العملة
                </label>
                <select
                  value={settings.currency}
                  onChange={(e) => handleChange('currency', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="ج.م">جنيه مصري (ج.م)</option>
                  <option value="$">دولار ($)</option>
                  <option value="€">يورو (€)</option>
                  <option value="ر.س">ريال سعودي (ر.س)</option>
                  <option value="د.إ">درهم إماراتي (د.إ)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  وحدة الوزن
                </label>
                <select
                  value={settings.weightUnit}
                  onChange={(e) => handleChange('weightUnit', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="كيلو">كيلوغرام</option>
                  <option value="جرام">جرام</option>
                  <option value="طن">طن</option>
                  <option value="باوند">باوند</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  تنسيق التاريخ
                </label>
                <select
                  value={settings.dateFormat}
                  onChange={(e) => handleChange('dateFormat', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="DD/MM/YYYY">يوم/شهر/سنة</option>
                  <option value="MM/DD/YYYY">شهر/يوم/سنة</option>
                  <option value="YYYY-MM-DD">سنة-شهر-يوم</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  تنسيق الوقت
                </label>
                <select
                  value={settings.timeFormat}
                  onChange={(e) => handleChange('timeFormat', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="12 ساعة">12 ساعة</option>
                  <option value="24 ساعة">24 ساعة</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  وحدة درجة الحرارة
                </label>
                <select
                  value={settings.temperatureUnit}
                  onChange={(e) => handleChange('temperatureUnit', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="مئوية">درجة مئوية</option>
                  <option value="فهرنهايت">درجة فهرنهايت</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  التقارير التلقائية
                </label>
                <select
                  value={settings.autoReports}
                  onChange={(e) => handleChange('autoReports', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="يومي">يومي</option>
                  <option value="أسبوعي">أسبوعي</option>
                  <option value="شهري">شهري</option>
                  <option value="لا">لا</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 'المستخدمين':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h4 className="font-medium text-gray-700">إدارة المستخدمين</h4>
              <button className="btn btn-primary flex items-center gap-2">
                <FiUser /> إضافة مستخدم
              </button>
            </div>
            
            <div className="border rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">الاسم</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">الدور</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">الحالة</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4">المدير</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                        مدير النظام
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                        نشط
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button className="text-primary-600 hover:text-primary-800 text-sm">
                        تعديل
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-700 mb-3">الأدوار والصلاحيات</h4>
              <div className="space-y-3">
                {settings.userRoles?.map(role => (
                  <div key={role} className="flex items-center justify-between p-3 bg-white rounded border">
                    <span>{role}</span>
                    <div className="flex items-center gap-2">
                      <button className="text-sm text-blue-600">تعديل</button>
                      {role !== 'مدير' && (
                        <button className="text-sm text-red-600">حذف</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'الأمان':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-700">النسخ الاحتياطي التلقائي</h4>
                  <p className="text-sm text-gray-500">إنشاء نسخ احتياطية تلقائية للبيانات</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.backupAuto}
                    onChange={(e) => handleChange('backupAuto', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
              
              {settings.backupAuto && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    تكرار النسخ الاحتياطي
                  </label>
                  <select
                    value={settings.backupFrequency}
                    onChange={(e) => handleChange('backupFrequency', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="يومي">يومي</option>
                    <option value="أسبوعي">أسبوعي</option>
                    <option value="شهري">شهري</option>
                  </select>
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-700">تسجيل الخروج التلقائي</h4>
                  <p className="text-sm text-gray-500">تسجيل الخروج بعد فترة عدم نشاط</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.requirePassword}
                    onChange={(e) => handleChange('requirePassword', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
              
              {settings.requirePassword && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    فترة عدم النشاط (دقيقة)
                  </label>
                  <select
                    value={settings.sessionTimeout}
                    onChange={(e) => handleChange('sessionTimeout', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value={15}>15 دقيقة</option>
                    <option value={30}>30 دقيقة</option>
                    <option value={60}>60 دقيقة</option>
                    <option value={120}>120 دقيقة</option>
                  </select>
                </div>
              )}
            </div>
            
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-3">
                <MdSecurity className="w-5 h-5 text-yellow-600 mt-1" />
                <div>
                  <h4 className="font-medium text-yellow-800">نصائح الأمان</h4>
                  <ul className="text-sm text-yellow-700 mt-2 space-y-1">
                    <li>• قم بتغيير كلمة المرور بانتظام</li>
                    <li>• لا تشارك بيانات الدخول مع الآخرين</li>
                    <li>• احتفظ بنسخ احتياطية خارجية</li>
                    <li>• استخدم كلمات مرور قوية</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      case 'التنبيهات':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h4 className="font-medium text-gray-700">إعدادات التنبيهات</h4>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white border rounded-lg">
                  <div>
                    <h5 className="font-medium text-gray-700">تنبيهات النفوق</h5>
                    <p className="text-sm text-gray-500">تنبيه عند تجاوز نسبة النفوق المسموح بها</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.mortalityAlert}
                      onChange={(e) => handleChange('mortalityAlert', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
                
                {settings.mortalityAlert && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      حد التنبيه لنسبة النفوق (%)
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="20"
                      value={settings.mortalityThreshold}
                      onChange={(e) => handleChange('mortalityThreshold', parseInt(e.target.value))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-500 mt-1">
                      <span>1%</span>
                      <span className="font-medium">{settings.mortalityThreshold}%</span>
                      <span>20%</span>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center justify-between p-4 bg-white border rounded-lg">
                  <div>
                    <h5 className="font-medium text-gray-700">تنبيهات المخزون المنخفض</h5>
                    <p className="text-sm text-gray-500">تنبيه عند انخفاض مستويات المخزون</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.lowStockAlert}
                      onChange={(e) => handleChange('lowStockAlert', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-white border rounded-lg">
                  <div>
                    <h5 className="font-medium text-gray-700">تنبيهات التحصينات</h5>
                    <p className="text-sm text-gray-500">تنبيه قبل مواعيد التحصينات</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.vaccinationAlert}
                      onChange={(e) => handleChange('vaccinationAlert', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-white border rounded-lg">
                  <div>
                    <h5 className="font-medium text-gray-700">تنبيهات مالية</h5>
                    <p className="text-sm text-gray-500">تنبيه عند تجاوز المصروفات أو انخفاض الإيرادات</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.financialAlert}
                      onChange={(e) => handleChange('financialAlert', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <FiBell className="w-5 h-5 text-blue-600 mt-1" />
                <div>
                  <h4 className="font-medium text-blue-800">طرق إرسال التنبيهات</h4>
                  <div className="mt-3 space-y-2">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="rounded text-primary-600" />
                      <span className="text-sm text-gray-700">التنبيهات داخل التطبيق</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="rounded text-primary-600" />
                      <span className="text-sm text-gray-700">البريد الإلكتروني</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="rounded text-primary-600" />
                      <span className="text-sm text-gray-700">رسائل SMS (مدفوع)</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'المظهر':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  السمة
                </label>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="radio"
                      name="theme"
                      value="فاتح"
                      checked={settings.theme === 'فاتح'}
                      onChange={(e) => handleChange('theme', e.target.value)}
                      className="text-primary-600"
                    />
                    <div className="flex items-center gap-2">
                      <FiSun className="w-5 h-5 text-yellow-500" />
                      <span>فاتح</span>
                    </div>
                  </label>
                  
                  <label className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="radio"
                      name="theme"
                      value="غامق"
                      checked={settings.theme === 'غامق'}
                      onChange={(e) => handleChange('theme', e.target.value)}
                      className="text-primary-600"
                    />
                    <div className="flex items-center gap-2">
                      <FiMoon className="w-5 h-5 text-gray-700" />
                      <span>غامق</span>
                    </div>
                  </label>
                  
                  <label className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="radio"
                      name="theme"
                      value="تلقائي"
                      checked={settings.theme === 'تلقائي'}
                      onChange={(e) => handleChange('theme', e.target.value)}
                      className="text-primary-600"
                    />
                    <div className="flex items-center gap-2">
                      <FiRefreshCw className="w-5 h-5 text-blue-500" />
                      <span>تلقائي (يتبع النظام)</span>
                    </div>
                  </label>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  حجم الخط
                </label>
                <select
                  value={settings.fontSize}
                  onChange={(e) => handleChange('fontSize', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="صغير">صغير</option>
                  <option value="متوسط">متوسط</option>
                  <option value="كبير">كبير</option>
                  <option value="كبير جداً">كبير جداً</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                اللغة
              </label>
              <select
                value={settings.language}
                onChange={(e) => handleChange('language', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="العربية">العربية</option>
                <option value="English">English</option>
                <option value="Français">Français</option>
              </select>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-700 mb-3">معاينة السمة</h4>
              <div className={`p-4 rounded-lg ${settings.theme === 'غامق' ? 'bg-gray-800 text-white' : 'bg-white border'}`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-primary-500 rounded-full"></div>
                  <div>
                    <h5 className="font-medium">عنصر نموذجي</h5>
                    <p className="text-sm opacity-75">هذا هو شكل العناصر مع السمة الحالية</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button className={`px-3 py-2 rounded ${settings.theme === 'غامق' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    زر ثانوي
                  </button>
                  <button className="px-3 py-2 bg-primary-600 text-white rounded">
                    زر أساسي
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'المزامنة':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-700">المزامنة التلقائية</h4>
                  <p className="text-sm text-gray-500">مزامنة البيانات مع السحابة تلقائياً</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.autoSync}
                    onChange={(e) => handleChange('autoSync', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
              
              {settings.autoSync && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    فترات المزامنة (دقيقة)
                  </label>
                  <select
                    value={settings.syncInterval}
                    onChange={(e) => handleChange('syncInterval', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value={5}>كل 5 دقائق</option>
                    <option value={15}>كل 15 دقيقة</option>
                    <option value={30}>كل 30 دقيقة</option>
                    <option value={60}>كل ساعة</option>
                  </select>
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-700">النسخ الاحتياطي السحابي</h4>
                  <p className="text-sm text-gray-500">نسخ احتياطي تلقائي للبيانات على السحابة</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.cloudBackup}
                    onChange={(e) => handleChange('cloudBackup', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
              
              {settings.cloudBackup && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h5 className="font-medium text-blue-800 mb-2">خدمات السحابة المتاحة</h5>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input type="radio" name="cloud" className="text-primary-600" />
                      <span className="text-sm text-gray-700">Google Drive</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="radio" name="cloud" className="text-primary-600" />
                      <span className="text-sm text-gray-700">Dropbox</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="radio" name="cloud" className="text-primary-600" />
                      <span className="text-sm text-gray-700">OneDrive</span>
                    </label>
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start gap-3">
                <FiDatabase className="w-5 h-5 text-green-600 mt-1" />
                <div>
                  <h4 className="font-medium text-green-800">حالة المزامنة</h4>
                  <div className="mt-3 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-700">آخر مزامنة:</span>
                      <span className="font-medium">{new Date().toLocaleDateString('ar-EG')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">حجم البيانات:</span>
                      <span className="font-medium">~2.5 ميجابايت</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">الحالة:</span>
                      <span className="font-medium text-green-600">متصلة</span>
                    </div>
                  </div>
                  <button className="mt-4 btn btn-primary text-sm">
                    مزامنة يدوية الآن
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'التطبيق':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-white border rounded-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FiHelpCircle className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-700">معلومات التطبيق</h4>
                  </div>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">الإصدار:</span>
                    <span className="font-medium">{settings.appVersion}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">آخر تحديث:</span>
                    <span className="font-medium">
                      {new Date(settings.lastUpdate).toLocaleDateString('ar-EG')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">رقم البناء:</span>
                    <span className="font-medium">245</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">الرخصة:</span>
                    <span className="font-medium">MIT</span>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-white border rounded-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <FiDatabase className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-700">بيانات التطبيق</h4>
                  </div>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">الحجم الإجمالي:</span>
                    <span className="font-medium">~5.2 ميجابايت</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">عدد الدورات:</span>
                    <span className="font-medium">{data.cycles?.length || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">عدد السجلات:</span>
                    <span className="font-medium">{data.dailyRecords?.length || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">آخر نسخة احتياطية:</span>
                    <span className="font-medium">اليوم</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white border rounded-lg">
                <div>
                  <h5 className="font-medium text-gray-700">إحصاءات الاستخدام</h5>
                  <p className="text-sm text-gray-500">إرسال إحصاءات استخدام مجهولة الهوية</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.analytics}
                    onChange={(e) => handleChange('analytics', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-white border rounded-lg">
                <div>
                  <h5 className="font-medium text-gray-700">تقارير الأعطال</h5>
                  <p className="text-sm text-gray-500">إرسال تقارير الأعطال تلقائياً</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.crashReports}
                    onChange={(e) => handleChange('crashReports', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
            </div>
            
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <h4 className="font-medium text-red-800 mb-3">إجراءات خطرة</h4>
              <div className="space-y-3">
                <button
                  onClick={() => {
                    if (window.confirm('هل تريد مسح ذاكرة التخزين المؤقت؟')) {
                      // مسح الكاش
                      addNotification({
                        type: 'warning',
                        title: 'تم المسح',
                        message: 'تم مسح ذاكرة التخزين المؤقت',
                        time: new Date().toLocaleTimeString('ar-EG')
                      });
                    }
                  }}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  مسح ذاكرة التخزين المؤقت
                </button>
                
                <button
                  onClick={() => {
                    if (window.confirm('هل تريد إعادة تعيين جميع الإعدادات؟')) {
                      handleReset();
                    }
                  }}
                  className="text-sm text-red-600 hover:text-red-800 block"
                >
                  إعادة تعيين جميع الإعدادات
                </button>
                
                <button
                  onClick={() => {
                    if (window.confirm('هل تريد مسح جميع بيانات التطبيق؟ هذه العملية لا يمكن التراجع عنها!')) {
                      localStorage.clear();
                      window.location.reload();
                    }
                  }}
                  className="text-sm text-red-600 hover:text-red-800 block"
                >
                  مسح جميع البيانات
                </button>
              </div>
            </div>
            
            <div className="text-center text-sm text-gray-500">
              <p>© 2024 دواجني. جميع الحقوق محفوظة.</p>
              <p className="mt-1">تم التطوير باستخدام React.js و Vite</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* رأس الصفحة */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-3">
            <MdSettings className="text-primary-600" />
            الإعدادات
          </h1>
          <p className="text-gray-600 mt-2">
            تخصيص إعدادات التطبيق والمزرعة
          </p>
        </div>
        
        <div className="flex gap-3">
          <label className="btn bg-white border border-gray-300 text-gray-700 flex items-center gap-2 cursor-pointer">
            <FiUpload /> استيراد إعدادات
            <input
              type="file"
              accept=".json"
              onChange={handleImportSettings}
              className="hidden"
            />
          </label>
          
          <button
            onClick={handleExportSettings}
            className="btn bg-white border border-gray-300 text-gray-700 flex items-center gap-2"
          >
            <FiDownload /> تصدير إعدادات
          </button>
        </div>
      </div>

      {/* تبويبات الإعدادات */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        
        <div className="p-6">
          {renderTabContent()}
        </div>
      </div>

      {/* أزرار الحفظ */}
      <div className="flex justify-between items-center">
        <button
          onClick={handleReset}
          className="btn bg-gray-200 text-gray-700 hover:bg-gray-300 flex items-center gap-2"
          disabled={saving}
        >
          <FiRefreshCw /> استعادة الافتراضيات
        </button>
        
        <div className="flex gap-3">
          <button
            onClick={() => {
              // إلغاء التغييرات
              setSettings(data.settings || initialSettings);
            }}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
            disabled={saving}
          >
            إلغاء
          </button>
          
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 flex items-center gap-2"
            disabled={saving}
          >
            {saving ? (
              <>
                <div className="loading-spinner"></div>
                جاري الحفظ...
              </>
            ) : (
              <>
                <FiSave /> حفظ الإعدادات
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
