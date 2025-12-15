import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import CyclesManagement from './components/CyclesManagement';
import InventoryManagement from './components/InventoryManagement';
import HealthManagement from './components/HealthManagement';
import FinancialManagement from './components/FinancialManagement';
import DailyRecords from './components/DailyRecords';
import SalesManagement from './components/SalesManagement';
import EmployeesManagement from './components/EmployeesManagement';
import BackupRestore from './components/BackupRestore';
import Reports from './components/Reports';
import Settings from './components/Settings';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import NotificationCenter from './components/NotificationCenter';
import OfflineIndicator from './components/OfflineIndicator';
import WelcomeModal from './components/WelcomeModal';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  
  // هيكل البيانات الرئيسي للتطبيق
  const [appData, setAppData] = useState({
    cycles: [],
    inventory: [],
    healthRecords: [],
    financialRecords: [],
    dailyRecords: [],
    employees: [],
    sales: [],
    vaccinations: [],
    settings: {}
  });

  // تحميل البيانات من التخزين المحلي عند التحميل
  useEffect(() => {
    const savedData = localStorage.getItem('douajny_app_data');
    if (savedData) {
      try {
        setAppData(JSON.parse(savedData));
      } catch (error) {
        console.error('خطأ في تحميل البيانات:', error);
        // إنشاء بيانات تجريبية أولية
        initializeSampleData();
      }
    } else {
      initializeSampleData();
      setShowWelcomeModal(true);
    }

    // تحقق من الاتصال بالإنترنت
    window.addEventListener('online', () => setIsOnline(true));
    window.addEventListener('offline', () => setIsOnline(false));

    // تحديث البيانات تلقائياً كل 5 دقائق
    const interval = setInterval(syncData, 5 * 60 * 1000);

    // إشعارات نظامية
    const today = new Date();
    const hasDailyRecord = appData.dailyRecords.some(record => 
      new Date(record.date).toDateString() === today.toDateString()
    );
    
    if (!hasDailyRecord && today.getHours() >= 8) {
      addNotification({
        id: Date.now(),
        type: 'reminder',
        title: 'تذكير بالسجل اليومي',
        message: 'لم تقم بإضافة السجل اليومي بعد',
        time: new Date().toLocaleTimeString('ar-EG'),
        read: false
      });
    }

    return () => {
      window.removeEventListener('online', () => setIsOnline(true));
      window.removeEventListener('offline', () => setIsOnline(false));
      clearInterval(interval);
    };
  }, []);

  // حفظ البيانات تلقائياً عند التغيير
  useEffect(() => {
    const saveTimeout = setTimeout(() => {
      localStorage.setItem('douajny_app_data', JSON.stringify(appData));
      localStorage.setItem('douajny_last_sync', new Date().toISOString());
    }, 1000);

    return () => clearTimeout(saveTimeout);
  }, [appData]);

  // تهيئة بيانات تجريبية
  const initializeSampleData = () => {
    const sampleData = {
      cycles: [
        {
          id: 1,
          name: 'دورة الشتاء 2024',
          startDate: '2024-01-01',
          endDate: '2024-02-15',
          status: 'مكتمل',
          initialBirds: 10000,
          currentBirds: 9500,
          breed: 'كوب 500',
          houseNumber: '1',
          farmer: 'محمد أحمد',
          notes: 'دورة ناجحة - معدل تحويل 1.6'
        },
        {
          id: 2,
          name: 'دورة الربيع 2024',
          startDate: '2024-03-01',
          endDate: null,
          status: 'نشط',
          initialBirds: 15000,
          currentBirds: 14800,
          breed: 'روس 308',
          houseNumber: '2',
          farmer: 'علي محمد',
          notes: 'جارية - عمر 25 يوم'
        }
      ],
      inventory: [
        {
          id: 1,
          name: 'علف بادي',
          type: 'علف',
          quantity: 5000,
          unit: 'كيلو',
          minQuantity: 1000,
          supplier: 'شركة الأعلاف المتحدة',
          lastRestock: '2024-03-15',
          costPerUnit: 1.8
        },
        {
          id: 2,
          name: 'فيتامين AD3E',
          type: 'دواء',
          quantity: 50,
          unit: 'لتر',
          minQuantity: 10,
          supplier: 'مكتبة الدواجن',
          lastRestock: '2024-03-10',
          costPerUnit: 120
        }
      ],
      dailyRecords: [
        {
          id: 1,
          date: '2024-03-20',
          cycleId: 2,
          mortality: 12,
          avgWeight: 1.2,
          temperature: 24,
          humidity: 60,
          feedConsumed: 1800,
          waterConsumed: 3500,
          notes: 'حالة الطيور جيدة'
        }
      ],
      // ... باقي البيانات
    };
    setAppData(sampleData);
  };

  // مزامنة البيانات
  const syncData = async () => {
    if (!isOnline) return;
    
    try {
      // هنا يمكن إضافة منطق المزامنة مع السيرفر
      console.log('مزامنة البيانات...');
      addNotification({
        id: Date.now(),
        type: 'sync',
        title: 'مزامنة ناجحة',
        message: 'تم تحديث البيانات بنجاح',
        time: new Date().toLocaleTimeString('ar-EG'),
        read: false
      });
    } catch (error) {
      console.error('خطأ في المزامنة:', error);
    }
  };

  // إضافة إشعار جديد
  const addNotification = (notification) => {
    setNotifications(prev => [notification, ...prev.slice(0, 9)]);
  };

  // تحديث البيانات
  const updateData = (key, data) => {
    setAppData(prev => ({
      ...prev,
      [key]: data
    }));
  };

  // عرض الصفحة الحالية
  const renderPage = () => {
    const props = {
      data: appData,
      updateData,
      addNotification,
      isOnline
    };

    switch(currentPage) {
      case 'dashboard':
        return <Dashboard {...props} />;
      case 'cycles':
        return <CyclesManagement {...props} />;
      case 'inventory':
        return <InventoryManagement {...props} />;
      case 'health':
        return <HealthManagement {...props} />;
      case 'financial':
        return <FinancialManagement {...props} />;
      case 'daily':
        return <DailyRecords {...props} />;
      case 'sales':
        return <SalesManagement {...props} />;
      case 'employees':
        return <EmployeesManagement {...props} />;
      case 'reports':
        return <Reports {...props} />;
      case 'backup':
        return <BackupRestore {...props} />;
      case 'settings':
        return <Settings {...props} />;
      default:
        return <Dashboard {...props} />;
    }
  };

  return (
    <div className="app min-h-screen bg-gray-50">
      <OfflineIndicator isOnline={isOnline} />
      
      <Navbar 
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        notifications={notifications}
        setNotifications={setNotifications}
      />
      
      <div className="flex flex-1 pt-16">
        <Sidebar 
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
        />
        
        <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'mr-64' : 'mr-0'}`}>
          <div className="p-4 md:p-6">
            {renderPage()}
          </div>
        </main>
      </div>

      <NotificationCenter 
        notifications={notifications}
        setNotifications={setNotifications}
      />

      <WelcomeModal 
        isOpen={showWelcomeModal}
        onClose={() => setShowWelcomeModal(false)}
      />
    </div>
  );
}

export default App;
