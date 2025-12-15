import React, { useState, useEffect } from 'react';
import { 
  FiMenu, 
  FiBell, 
  FiUser, 
  FiSettings,
  FiHome,
  FiCalendar,
  FiPackage,
  FiDroplet,
  FiDollarSign,
  FiFileText,
  FiShoppingCart,
  FiUsers,
  FiBarChart2,
  FiDatabase,
  FiLogOut
} from 'react-icons/fi';
import { MdPoultry } from 'react-icons/md';

const Navbar = ({ 
  currentPage, 
  setCurrentPage, 
  isSidebarOpen, 
  setIsSidebarOpen,
  notifications,
  setNotifications
}) => {
  const [time, setTime] = useState('');
  const [user, setUser] = useState({ name: 'مدير المزرعة' });
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  // تحديث الوقت الحالي
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      };
      setTime(now.toLocaleDateString('ar-EG', options));
    };
    
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // حساب الإشعارات غير المقروءة
  useEffect(() => {
    const unread = notifications.filter(n => !n.read).length;
    setUnreadNotifications(unread);
  }, [notifications]);

  // قراءة جميع الإشعارات
  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(notification => ({
      ...notification,
      read: true
    }));
    setNotifications(updatedNotifications);
  };

  // عناصر القائمة الرئيسية
  const navItems = [
    { id: 'dashboard', label: 'لوحة التحكم', icon: <FiHome /> },
    { id: 'cycles', label: 'إدارة الدورات', icon: <FiCalendar /> },
    { id: 'inventory', label: 'المخزون والأعلاف', icon: <FiPackage /> },
    { id: 'health', label: 'الصحة والتحصينات', icon: <FiDroplet /> },
    { id: 'financial', label: 'الإدارة المالية', icon: <FiDollarSign /> },
    { id: 'daily', label: 'السجل اليومي', icon: <FiFileText /> },
    { id: 'sales', label: 'المبيعات', icon: <FiShoppingCart /> },
    { id: 'employees', label: 'الموظفين', icon: <FiUsers /> },
    { id: 'reports', label: 'التقارير', icon: <FiBarChart2 /> },
    { id: 'backup', label: 'النسخ الاحتياطي', icon: <FiDatabase /> },
    { id: 'settings', label: 'الإعدادات', icon: <FiSettings /> }
  ];

  return (
    <nav className="navbar fixed top-0 right-0 left-0 z-50 bg-gradient-to-r from-primary-900 to-primary-800 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* الجزء الأيسر: القائمة والشعار */}
          <div className="flex items-center space-x-4 space-x-reverse">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg hover:bg-primary-700 transition-colors duration-200"
              title={isSidebarOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
            >
              <FiMenu className="w-6 h-6" />
            </button>
            
            <div className="flex items-center space-x-3 space-x-reverse">
              <MdPoultry className="w-8 h-8 text-yellow-400 animate-pulse" />
              <div>
                <h1 className="text-xl font-bold flex items-center gap-2">
                  <span className="text-yellow-400">🐔</span>
                  دواجني
                  <span className="text-xs bg-yellow-500 text-white px-2 py-1 rounded-full animate-bounce">
                    Pro
                  </span>
                </h1>
                <p className="text-xs text-primary-200 opacity-80">
                  إدارة متكاملة لمزارع الدواجن اللاحم
                </p>
              </div>
            </div>
          </div>

          {/* الجزء الأوسط: الوقت والإحصائيات السريعة */}
          <div className="hidden md:flex items-center space-x-6 space-x-reverse">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2">
                <span className="text-yellow-400 animate-pulse">⏰</span>
                <span className="text-sm font-medium">{time}</span>
              </div>
              <p className="text-xs text-primary-200 opacity-80 mt-1">
                التوقيت المحلي - القاهرة
              </p>
            </div>
          </div>

          {/* الجزء الأيمن: الإشعارات والمستخدم */}
          <div className="flex items-center space-x-4 space-x-reverse">
            {/* زر الإشعارات */}
            <div className="relative">
              <button
                onClick={() => setCurrentPage('notifications')}
                className="p-2 rounded-lg hover:bg-primary-700 transition-colors duration-200 relative"
                title="الإشعارات"
              >
                <FiBell className="w-6 h-6" />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-ping">
                    {unreadNotifications}
                  </span>
                )}
              </button>
              
              {unreadNotifications > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="absolute top-full left-0 mt-2 bg-red-500 text-white text-xs px-2 py-1 rounded opacity-0 hover:opacity-100 transition-opacity duration-200"
                >
                  قراءة الكل
                </button>
              )}
            </div>

            {/* ملف المستخدم */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-2 space-x-reverse p-2 rounded-lg hover:bg-primary-700 transition-colors duration-200"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center">
                  <FiUser className="w-5 h-5" />
                </div>
                <div className="hidden md:block text-right">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-primary-200 opacity-80">مدير النظام</p>
                </div>
              </button>

              {/* قائمة الملف الشخصي */}
              {showProfileMenu && (
                <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-xl z-50 border border-gray-200">
                  <div className="p-4 border-b border-gray-100">
                    <p className="font-medium text-gray-800">{user.name}</p>
                    <p className="text-sm text-gray-600">مدير المزرعة</p>
                  </div>
                  
                  <div className="py-2">
                    <button
                      onClick={() => {
                        setCurrentPage('settings');
                        setShowProfileMenu(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary-600 transition-colors duration-200"
                    >
                      <FiSettings className="ml-2" />
                      الإعدادات
                    </button>
                    
                    <button
                      onClick={() => {
                        // تسجيل الخروج
                        localStorage.removeItem('douajny_app_data');
                        window.location.reload();
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                    >
                      <FiLogOut className="ml-2" />
                      تسجيل الخروج
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* شريط التنقل السريع */}
        <div className="overflow-x-auto py-2 border-t border-primary-700">
          <div className="flex space-x-4 space-x-reverse min-w-max">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`flex items-center px-3 py-2 rounded-lg transition-all duration-200 whitespace-nowrap ${
                  currentPage === item.id
                    ? 'bg-white text-primary-900 shadow-md'
                    : 'text-primary-200 hover:bg-primary-700 hover:text-white'
                }`}
                title={item.label}
              >
                <span className={`ml-2 ${currentPage === item.id ? 'text-primary-600' : ''}`}>
                  {item.icon}
                </span>
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* مؤشر الصفحة الحالية */}
      <div className="h-1 bg-gradient-to-r from-yellow-500 via-green-500 to-blue-500 animate-gradient-x"></div>
    </nav>
  );
};

export default Navbar;
