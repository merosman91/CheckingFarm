import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import CyclesManagement from './components/CyclesManagement';
import InventoryManagement from './components/InventoryManagement';
import HealthManagement from './components/HealthManagement';
import FinancialManagement from './components/FinancialManagement';
import DailyRecords from './components/DailyRecords';
import SalesManagement from './components/SalesManagement';
import EmployeesManagement from './components/EmployeesManagement';
import Reports from './components/Reports';
import BackupRestore from './components/BackupRestore';
import Settings from './components/Settings';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import NotificationCenter from './components/NotificationCenter';
import OfflineIndicator from './components/OfflineIndicator';
import WelcomeModal from './components/WelcomeModal';
import './App.css';

// مكون SalesManagement مبسط (لأنه مش مفصل في الطلب)
const SalesManagement = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold mb-4">إدارة المبيعات (تحت التطوير)</h1>
    <p>سيتم إضافة هذه الصفحة قريباً...</p>
  </div>
);

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  
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

  useEffect(() => {
    const savedData = localStorage.getItem('douajny_app_data');
    if (savedData) {
      try {
        setAppData(JSON.parse(savedData));
      } catch (error) {
        console.error('خطأ في تحميل البيانات:', error);
        initializeSampleData();
      }
    } else {
      initializeSampleData();
      setShowWelcomeModal(true);
    }

    window.addEventListener('online', () => setIsOnline(true));
    window.addEventListener('offline', () => setIsOnline(false));

    const interval = setInterval(() => {
      // مزامنة تلقائية كل 5 دقائق
      console.log('مزامنة تلقائية...');
    }, 5 * 60 * 1000);

    return () => {
      window.removeEventListener('online', () => setIsOnline(true));
      window.removeEventListener('offline', () => setIsOnline(false));
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const saveTimeout = setTimeout(() => {
      localStorage.setItem('douajny_app_data', JSON.stringify(appData));
      localStorage.setItem('douajny_last_sync', new Date().toISOString());
    }, 1000);

    return () => clearTimeout(saveTimeout);
  }, [appData]);

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
      healthRecords: [],
      financialRecords: [],
      employees: [],
      sales: [],
      settings: {}
    };
    setAppData(sampleData);
  };

  const updateData = (key, data) => {
    setAppData(prev => ({
      ...prev,
      [key]: data
    }));
  };

  const addNotification = (notification) => {
    setNotifications(prev => [notification, ...prev.slice(0, 9)]);
  };

  const renderPage = () => {
    const commonProps = {
      data: appData,
      updateData,
      addNotification,
      isOnline
    };

    switch(currentPage) {
      case 'dashboard':
        return <Dashboard {...commonProps} />;
      case 'cycles':
        return <CyclesManagement {...commonProps} />;
      case 'inventory':
        return <InventoryManagement {...commonProps} />;
      case 'health':
        return <HealthManagement {...commonProps} />;
      case 'financial':
        return <FinancialManagement {...commonProps} />;
      case 'daily':
        return <DailyRecords {...commonProps} />;
      case 'sales':
        return <SalesManagement {...commonProps} />;
      case 'employees':
        return <EmployeesManagement {...commonProps} />;
      case 'reports':
        return <Reports {...commonProps} />;
      case 'backup':
        return <BackupRestore {...commonProps} />;
      case 'settings':
        return <Settings {...commonProps} />;
      default:
        return <Dashboard {...commonProps} />;
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
