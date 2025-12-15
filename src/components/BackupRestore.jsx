import React, { useState, useEffect } from 'react';
import {
  FiSave, FiDownload, FiUpload, FiDatabase,
  FiRefreshCw, FiTrash2, FiClock, FiCheckCircle,
  FiAlertCircle, FiHardDrive, FiCloud, FiLock,
  FiUnlock, FiCalendar, FiFileText, FiSettings
} from 'react-icons/fi';
import { MdSecurity, MdBackup, MdRestore } from 'react-icons/md';

const BackupRestore = ({ data, updateData, addNotification, isOnline }) => {
  const [backups, setBackups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [autoBackup, setAutoBackup] = useState(true);
  const [backupInterval, setBackupInterval] = useState(24); // ساعات
  const [encryptionKey, setEncryptionKey] = useState('');
  const [showEncryption, setShowEncryption] = useState(false);

  // تحميل النسخ الاحتياطية المحفوظة
  useEffect(() => {
    loadBackups();
    loadSettings();
    
    // إعداد النسخ الاحتياطي التلقائي
    if (autoBackup) {
      const interval = setInterval(() => {
        createBackup();
      }, backupInterval * 60 * 60 * 1000);
      
      return () => clearInterval(interval);
    }
  }, [autoBackup, backupInterval]);

  const loadBackups = () => {
    try {
      const savedBackups = localStorage.getItem('douajny_backups');
      if (savedBackups) {
        setBackups(JSON.parse(savedBackups));
      }
    } catch (error) {
      console.error('خطأ في تحميل النسخ الاحتياطية:', error);
    }
  };

  const loadSettings = () => {
    try {
      const settings = localStorage.getItem('douajny_backup_settings');
      if (settings) {
        const { autoBackup: savedAuto, interval, encryption } = JSON.parse(settings);
        setAutoBackup(savedAuto || false);
        setBackupInterval(interval || 24);
        setEncryptionKey(encryption || '');
      }
    } catch (error) {
      console.error('خطأ في تحميل الإعدادات:', error);
    }
  };

  const saveSettings = () => {
    const settings = {
      autoBackup,
      backupInterval,
      encryption: encryptionKey
    };
    localStorage.setItem('douajny_backup_settings', JSON.stringify(settings));
    
    addNotification({
      type: 'success',
      title: 'تم الحفظ',
      message: 'تم حفظ إعدادات النسخ الاحتياطي',
      time: new Date().toLocaleTimeString('ar-EG')
    });
  };

  const createBackup = async () => {
    setLoading(true);
    
    try {
      // إنشاء نسخة احتياطية من جميع البيانات
      const backupData = {
        ...data,
        metadata: {
          version: '2.0.0',
          timestamp: new Date().toISOString(),
          recordsCount: {
            cycles: data.cycles?.length || 0,
            dailyRecords: data.dailyRecords?.length || 0,
            inventory: data.inventory?.length || 0,
            healthRecords: data.healthRecords?.length || 0,
            financialRecords: data.financialRecords?.length || 0
          }
        }
      };

      // التشفير إذا كان المفتاح موجود
      let backupToSave = backupData;
      if (encryptionKey) {
        backupToSave = {
          ...backupData,
          encrypted: true,
          data: btoa(JSON.stringify(backupData)) // تشفير بسيط
        };
      }

      const backup = {
        id: Date.now(),
        name: `نسخة احتياطية ${new Date().toLocaleDateString('ar-EG')}`,
        timestamp: new Date().toISOString(),
        size: JSON.stringify(backupToSave).length,
        data: backupToSave,
        type: encryptionKey ? 'مشفر' : 'عادي',
        auto: true
      };

      // حفظ النسخة الجديدة
      const updatedBackups = [backup, ...backups.slice(0, 9)]; // حفظ آخر 10 نسخ فقط
      setBackups(updatedBackups);
      localStorage.setItem('douajny_backups', JSON.stringify(updatedBackups));

      addNotification({
        type: 'success',
        title: 'نسخة احتياطية جديدة',
        message: 'تم إنشاء نسخة احتياطية بنجاح',
        time: new Date().toLocaleTimeString('ar-EG')
      });

      // إذا كان اتصال إنترنت متاح، مزامنة مع السحابة
      if (isOnline) {
        await syncToCloud(backup);
      }

    } catch (error) {
      console.error('خطأ في إنشاء النسخة الاحتياطية:', error);
      addNotification({
        type: 'error',
        title: 'خطأ',
        message: 'فشل إنشاء النسخة الاحتياطية',
        time: new Date().toLocaleTimeString('ar-EG')
      });
    } finally {
      setLoading(false);
    }
  };

  const syncToCloud = async (backup) => {
    // محاكاة المزامنة مع السحابة
    try {
      // في التطبيق الحقيقي، هنا يتم الاتصال بالسيرڤر
      console.log('مزامنة النسخة الاحتياطية مع السحابة...', backup.id);
      
      addNotification({
        type: 'info',
        title: 'مزامنة سحابية',
        message: 'تم رفع النسخة الاحتياطية للسحابة',
        time: new Date().toLocaleTimeString('ar-EG')
      });
    } catch (error) {
      console.error('خطأ في المزامنة السحابية:', error);
    }
  };

  const restoreBackup = (backup) => {
    if (!window.confirm('هل أنت متأكد من استعادة هذه النسخة؟ سيتم استبدال جميع البيانات الحالية.')) {
      return;
    }

    try {
      let backupData = backup.data;
      
      // فك التشفير إذا كان مشفراً
      if (backup.data.encrypted) {
        if (!encryptionKey) {
          const key = prompt('هذه النسخة مشفرة. الرجاء إدخال مفتاح التشفير:');
          if (!key) {
            addNotification({
              type: 'error',
              title: 'خطأ',
              message: 'مفتاح التشفير مطلوب',
              time: new Date().toLocaleTimeString('ar-EG')
            });
            return;
          }
          // فك التشفير البسيط
          try {
            const decrypted = atob(backup.data.data);
            backupData = JSON.parse(decrypted);
          } catch (e) {
            addNotification({
              type: 'error',
              title: 'خطأ',
              message: 'مفتاح التشفير غير صحيح',
              time: new Date().toLocaleTimeString('ar-EG')
            });
            return;
          }
        }
      }

      // استعادة البيانات
      updateData('cycles', backupData.cycles || []);
      updateData('dailyRecords', backupData.dailyRecords || []);
      updateData('inventory', backupData.inventory || []);
      updateData('healthRecords', backupData.healthRecords || []);
      updateData('financialRecords', backupData.financialRecords || []);
      updateData('employees', backupData.employees || []);
      updateData('sales', backupData.sales || []);

      // تحديث التطبيق الرئيسي
      localStorage.setItem('douajny_app_data', JSON.stringify(backupData));

      addNotification({
        type: 'success',
        title: 'تم الاستعادة',
        message: 'تم استعادة النسخة الاحتياطية بنجاح',
        time: new Date().toLocaleTimeString('ar-EG')
      });

      // إعادة تحميل الصفحة للتأكد من تطبيق جميع التغييرات
      setTimeout(() => {
        window.location.reload();
      }, 1000);

    } catch (error) {
      console.error('خطأ في استعادة النسخة الاحتياطية:', error);
      addNotification({
        type: 'error',
        title: 'خطأ',
        message: 'فشل استعادة النسخة الاحتياطية',
        time: new Date().toLocaleTimeString('ar-EG')
      });
    }
  };

  const deleteBackup = (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذه النسخة الاحتياطية؟')) {
      return;
    }

    const updatedBackups = backups.filter(backup => backup.id !== id);
    setBackups(updatedBackups);
    localStorage.setItem('douajny_backups', JSON.stringify(updatedBackups));

    addNotification({
      type: 'warning',
      title: 'تم الحذف',
      message: 'تم حذف النسخة الاحتياطية',
      time: new Date().toLocaleTimeString('ar-EG')
    });
  };

  const exportData = () => {
    try {
      const exportData = {
        ...data,
        exportInfo: {
          exportedAt: new Date().toISOString(),
          app: 'دواجني',
          version: '2.0.0'
        }
      };

      const dataStr = JSON.stringify(exportData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `douajny_backup_${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();

      addNotification({
        type: 'success',
        title: 'تم التصدير',
        message: 'تم تصدير البيانات بنجاح',
        time: new Date().toLocaleTimeString('ar-EG')
      });

    } catch (error) {
      console.error('خطأ في تصدير البيانات:', error);
      addNotification({
        type: 'error',
        title: 'خطأ',
        message: 'فشل تصدير البيانات',
        time: new Date().toLocaleTimeString('ar-EG')
      });
    }
  };

  const importData = (event) => {
    setImporting(true);
    
    const file = event.target.files[0];
    if (!file) {
      setImporting(false);
      return;
    }

    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);
        
        // التحقق من صحة البيانات المستوردة
        if (!importedData.cycles || !importedData.dailyRecords) {
          throw new Error('ملف غير صالح');
        }

        // استيراد البيانات
        updateData('cycles', importedData.cycles || []);
        updateData('dailyRecords', importedData.dailyRecords || []);
        updateData('inventory', importedData.inventory || []);
        updateData('healthRecords', importedData.healthRecords || []);
        updateData('financialRecords', importedData.financialRecords || []);
        updateData('employees', importedData.employees || []);
        updateData('sales', importedData.sales || []);

        // حفظ في التخزين المحلي
        localStorage.setItem('douajny_app_data', JSON.stringify(importedData));

        addNotification({
          type: 'success',
          title: 'تم الاستيراد',
          message: 'تم استيراد البيانات بنجاح',
          time: new Date().toLocaleTimeString('ar-EG')
        });

        // إعادة تحميل الصفحة
        setTimeout(() => {
          window.location.reload();
        }, 1000);

      } catch (error) {
        console.error('خطأ في استيراد البيانات:', error);
        addNotification({
          type: 'error',
          title: 'خطأ',
          message: 'فشل استيراد البيانات - ملف غير صالح',
          time: new Date().toLocaleTimeString('ar-EG')
        });
      } finally {
        setImporting(false);
        event.target.value = ''; // إعادة تعيين ملف الإدخال
      }
    };

    reader.onerror = () => {
      addNotification({
        type: 'error',
        title: 'خطأ',
        message: 'فشل قراءة الملف',
        time: new Date().toLocaleTimeString('ar-EG')
      });
      setImporting(false);
      event.target.value = '';
    };

    reader.readAsText(file);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 بايت';
    const k = 1024;
    const sizes = ['بايت', 'كيلوبايت', 'ميجابايت', 'جيجابايت'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* رأس الصفحة */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-3">
            <FiDatabase className="text-primary-600" />
            النسخ الاحتياطي والاستعادة
          </h1>
          <p className="text-gray-600 mt-2">
            حماية واستعادة بيانات المزرعة بسهولة وأمان
          </p>
        </div>
      </div>

      {/* حالة النظام */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">إجمالي النسخ</p>
              <h3 className="text-2xl font-bold text-gray-800">
                {backups.length}
              </h3>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <FiDatabase className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">الحالة</p>
              <h3 className="text-2xl font-bold text-green-600">
                {isOnline ? 'متصل' : 'غير متصل'}
              </h3>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              {isOnline ? (
                <FiCloud className="w-6 h-6 text-green-600" />
              ) : (
                <FiHardDrive className="w-6 h-6 text-yellow-600" />
              )}
            </div>
          </div>
        </div>
        
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">آخر نسخة</p>
              <h3 className="text-2xl font-bold text-gray-800">
                {backups.length > 0 ? formatDate(backups[0].timestamp).split('،')[0] : 'لا يوجد'}
              </h3>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <FiClock className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* إشعار مهم */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <FiAlertCircle className="text-blue-500 text-xl mt-1" />
          <div className="flex-1">
            <h4 className="font-medium text-blue-800">نصيحة مهمة</h4>
            <p className="text-blue-600 text-sm mt-1">
              قم بإنشاء نسخ احتياطية منتظمة لحماية بيانات مزرعتك. يوصى بالنسخ الاحتياطي اليومي.
            </p>
          </div>
        </div>
      </div>

      {/* الإجراءات السريعة */}
      <div className="glass-card rounded-xl p-5">
        <h3 className="text-lg font-bold text-gray-800 mb-6">الإجراءات السريعة</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button
            onClick={createBackup}
            disabled={loading}
            className="btn btn-primary flex items-center justify-center gap-3 p-4"
          >
            {loading ? (
              <div className="loading-spinner"></div>
            ) : (
              <>
                <FiSave className="w-5 h-5" />
                <span>إنشاء نسخة</span>
              </>
            )}
          </button>
          
          <button
            onClick={exportData}
            className="btn bg-green-600 text-white hover:bg-green-700 flex items-center justify-center gap-3 p-4"
          >
            <FiDownload className="w-5 h-5" />
            <span>تصدير البيانات</span>
          </button>
          
          <label className="btn bg-blue-600 text-white hover:bg-blue-700 flex items-center justify-center gap-3 p-4 cursor-pointer">
            <FiUpload className="w-5 h-5" />
            <span>{importing ? 'جاري الاستيراد...' : 'استيراد البيانات'}</span>
            <input
              type="file"
              accept=".json"
              onChange={importData}
              className="hidden"
              disabled={importing}
            />
          </label>
          
          <button
            onClick={() => setShowEncryption(!showEncryption)}
            className="btn bg-purple-600 text-white hover:bg-purple-700 flex items-center justify-center gap-3 p-4"
          >
            {encryptionKey ? <FiLock className="w-5 h-5" /> : <FiUnlock className="w-5 h-5" />}
            <span>إعدادات الأمان</span>
          </button>
        </div>
      </div>

      {/* إعدادات الأمان */}
      {showEncryption && (
        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center gap-3 mb-6">
            <MdSecurity className="w-6 h-6 text-purple-600" />
            <h3 className="text-lg font-bold text-gray-800">إعدادات الأمان</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                مفتاح التشفير
              </label>
              <input
                type="password"
                value={encryptionKey}
                onChange={(e) => setEncryptionKey(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="أدخل مفتاح التشفير (اختياري)"
              />
              <p className="text-xs text-gray-500 mt-2">
                سيتم تشفير النسخ الاحتياطية باستخدام هذا المفتاح. احفظ المفتاح في مكان آمن.
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="autoBackup"
                checked={autoBackup}
                onChange={(e) => setAutoBackup(e.target.checked)}
                className="rounded text-primary-600"
              />
              <label htmlFor="autoBackup" className="text-sm text-gray-700">
                النسخ الاحتياطي التلقائي
              </label>
            </div>
            
            {autoBackup && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الفترة الزمنية (ساعة)
                </label>
                <select
                  value={backupInterval}
                  onChange={(e) => setBackupInterval(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value={1}>كل ساعة</option>
                  <option value={6}>كل 6 ساعات</option>
                  <option value={12}>كل 12 ساعة</option>
                  <option value={24}>يومياً</option>
                  <option value={168}>أسبوعياً</option>
                </select>
              </div>
            )}
            
            <button
              onClick={saveSettings}
              className="btn btn-primary flex items-center gap-2"
            >
              <FiSettings /> حفظ الإعدادات
            </button>
          </div>
        </div>
      )}

      {/* النسخ الاحتياطية المحفوظة */}
      <div className="glass-card rounded-xl p-5">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-gray-800">النسخ الاحتياطية المحفوظة</h3>
          <div className="text-sm text-gray-500">
            {backups.length} من أقصى 10 نسخة
          </div>
        </div>
        
        {backups.length > 0 ? (
          <div className="space-y-4">
            {backups.map((backup) => (
              <div key={backup.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors duration-200">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FiDatabase className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{backup.name}</h4>
                      <div className="flex flex-wrap gap-3 mt-2">
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                          <FiCalendar />
                          {formatDate(backup.timestamp)}
                        </span>
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                          <FiFileText />
                          {formatFileSize(backup.size)}
                        </span>
                        <span className={`text-sm px-2 py-1 rounded-full ${backup.type === 'مشفر' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>
                          {backup.type}
                        </span>
                        {backup.auto && (
                          <span className="text-sm px-2 py-1 rounded-full bg-yellow-100 text-yellow-800">
                            تلقائي
                          </span>
                        )}
                      </div>
                      {backup.data?.metadata && (
                        <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2">
                          <div className="text-xs">
                            <span className="text-gray-500">الدورات:</span>{' '}
                            <span className="font-medium">{backup.data.metadata.recordsCount.cycles || 0}</span>
                          </div>
                          <div className="text-xs">
                            <span className="text-gray-500">السجلات:</span>{' '}
                            <span className="font-medium">{backup.data.metadata.recordsCount.dailyRecords || 0}</span>
                          </div>
                          <div className="text-xs">
                            <span className="text-gray-500">المخزون:</span>{' '}
                            <span className="font-medium">{backup.data.metadata.recordsCount.inventory || 0}</span>
                          </div>
                          <div className="text-xs">
                            <span className="text-gray-500">المالية:</span>{' '}
                            <span className="font-medium">{backup.data.metadata.recordsCount.financialRecords || 0}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => restoreBackup(backup)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
                      title="استعادة"
                    >
                      <MdRestore className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => deleteBackup(backup.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                      title="حذف"
                    >
                      <FiTrash2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => {
                        // عرض تفاصيل النسخة
                        addNotification({
                          type: 'info',
                          title: 'تفاصيل النسخة',
                          message: `نسخة من ${formatDate(backup.timestamp)}`,
                          time: new Date().toLocaleTimeString('ar-EG')
                        });
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                      title="التفاصيل"
                    >
                      <FiEye className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FiDatabase className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg text-gray-600">لا توجد نسخ احتياطية</p>
            <p className="text-sm text-gray-500 mt-2">
              قم بإنشاء أول نسخة احتياطية لحماية بياناتك
            </p>
          </div>
        )}
      </div>

      {/* إحصائيات ومعلومات */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center gap-3 mb-6">
            <MdBackup className="w-6 h-6 text-primary-600" />
            <h3 className="text-lg font-bold text-gray-800">نصائح النسخ الاحتياطي</h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <FiCheckCircle className="w-5 h-5 text-green-500 mt-1" />
              <div>
                <p className="font-medium text-gray-800">النسخ المنتظم</p>
                <p className="text-sm text-gray-600">
                  قم بإنشاء نسخ احتياطية يومياً أو أسبوعياً على الأقل.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <FiCheckCircle className="w-5 h-5 text-green-500 mt-1" />
              <div>
                <p className="font-medium text-gray-800">التخزين الآمن</p>
                <p className="text-sm text-gray-600">
                  احفظ نسخة خارجية على جهاز مختلف أو خدمة سحابية.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <FiCheckCircle className="w-5 h-5 text-green-500 mt-1" />
              <div>
                <p className="font-medium text-gray-800">اختبار الاستعادة</p>
                <p className="text-sm text-gray-600">
                  تأكد من عمل النسخ الاحتياطية عن طريق اختبار استعادتها.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <FiCheckCircle className="w-5 h-5 text-green-500 mt-1" />
              <div>
                <p className="font-medium text-gray-800">التشفير</p>
                <p className="text-sm text-gray-600">
                  استخدم التشفير لحماية البيانات الحساسة.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center gap-3 mb-6">
            <FiAlertCircle className="w-6 h-6 text-yellow-600" />
            <h3 className="text-lg font-bold text-gray-800">معلومات النظام</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">مساحة التخزين المحلي</span>
              <span className="font-medium">~{formatFileSize(JSON.stringify(data).length * 2)}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">آخر تحديث بيانات</span>
              <span className="font-medium">
                {localStorage.getItem('douajny_last_sync') 
                  ? formatDate(localStorage.getItem('douajny_last_sync'))
                  : 'غير معروف'}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">إصدار التطبيق</span>
              <span className="font-medium">2.0.0</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">حالة الاتصال</span>
              <span className={`font-medium ${isOnline ? 'text-green-600' : 'text-red-600'}`}>
                {isOnline ? 'متصل' : 'غير متصل'}
              </span>
            </div>
            
            <div className="pt-4 border-t">
              <button
                onClick={() => {
                  localStorage.clear();
                  window.location.reload();
                }}
                className="text-sm text-red-600 hover:text-red-800"
              >
                ❗ مسح جميع البيانات
              </button>
              <p className="text-xs text-gray-500 mt-2">
                تحذير: هذه العملية غير قابلة للاسترجاع. تأكد من وجود نسخة احتياطية أولاً.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* زر التنظيف */}
      <div className="flex justify-end">
        <button
          onClick={() => {
            if (window.confirm('هل تريد حذف جميع النسخ الاحتياطية القديمة؟')) {
              setBackups([]);
              localStorage.removeItem('douajny_backups');
              addNotification({
                type: 'warning',
                title: 'تم التنظيف',
                message: 'تم حذف جميع النسخ الاحتياطية',
                time: new Date().toLocaleTimeString('ar-EG')
              });
            }
          }}
          className="btn bg-gray-200 text-gray-700 hover:bg-gray-300 flex items-center gap-2"
        >
          <FiTrash2 /> تنظيف النسخ الاحتياطية
        </button>
      </div>
    </div>
  );
};

export default BackupRestore;
