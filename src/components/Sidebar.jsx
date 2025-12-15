import React, { useState } from 'react';
import {
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
  FiSettings,
  FiChevronRight,
  FiChevronLeft,
  FiGrid,
  FiActivity,
  FiTrendingUp,
  FiAlertCircle,
  FiClipboard,
  FiTool,
  FiHelpCircle
} from 'react-icons/fi';
import { MdPoultry, MdDashboard } from 'react-icons/md';

const Sidebar = ({ currentPage, setCurrentPage, isOpen, setIsOpen }) => {
  const [expandedSections, setExpandedSections] = useState({
    production: true,
    health: false,
    financial: false,
    reports: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const menuItems = [
    {
      id: 'dashboard',
      label: 'لوحة التحكم',
      icon: <MdDashboard className="w-5 h-5" />,
      color: 'text-blue-500',
      subItems: []
    },
    {
      section: 'production',
      label: 'الإنتاج',
      icon: <FiGrid className="w-5 h-5" />,
      color: 'text-green-500',
      subItems: [
        { id: 'cycles', label: 'الدورات الإنتاجية', icon: <FiCalendar /> },
        { id: 'daily', label: 'السجل اليومي', icon: <FiFileText /> },
        { id: 'inventory', label: 'المخزون والأعلاف', icon: <FiPackage /> }
      ]
    },
    {
      section: 'health',
      label: 'الصحة والرعاية',
      icon: <FiActivity className="w-5 h-5" />,
      color: 'text-red-500',
      subItems: [
        { id: 'health', label: 'الصحة والتحصينات', icon: <FiDroplet /> },
        { id: 'vaccinations', label: 'برنامج التحصين', icon: <FiClipboard /> },
        { id: 'alerts', label: 'التنبيهات الصحية', icon: <FiAlertCircle /> }
      ]
    },
    {
      section: 'financial',
      label: 'المالية',
      icon: <FiTrendingUp className="w-5 h-5" />,
      color: 'text-yellow-500',
      subItems: [
        { id: 'financial', label: 'الإدارة المالية', icon: <FiDollarSign /> },
        { id: 'sales', label: 'المبيعات', icon: <FiShoppingCart /> },
        { id: 'employees', label: 'المرتبات', icon: <FiUsers /> }
      ]
    },
    {
      section: 'reports',
      label: 'التقارير والتحليل',
      icon: <FiBarChart2 className="w-5 h-5" />,
      color: 'text-purple-500',
      subItems: [
        { id: 'reports', label: 'التقارير', icon: <FiBarChart2 /> },
        { id: 'analytics', label: 'التحليلات', icon: <FiTrendingUp /> }
      ]
    },
    {
      id: 'backup',
      label: 'النسخ الاحتياطي',
      icon: <FiDatabase className="w-5 h-5" />,
      color: 'text-indigo-500',
      subItems: []
    },
    {
      id: 'settings',
      label: 'الإعدادات',
      icon: <FiSettings className="w-5 h-5" />,
      color: 'text-gray-500',
      subItems: []
    },
    {
      id: 'help',
      label: 'المساعدة',
      icon: <FiHelpCircle className="w-5 h-5" />,
      color: 'text-pink-500',
      subItems: []
    }
  ];

  return (
    <aside className={`
      sidebar fixed right-0 top-16 bottom-0 z-40 
      bg-gradient-to-b from-gray-900 to-gray-800 
      text-white shadow-xl transition-all duration-300 ease-in-out
      ${isOpen ? 'w-64' : 'w-0 md:w-16'}
      overflow-hidden
    `}>
      {/* زر طي/فتح الشريط الجانبي */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          absolute -left-3 top-6 z-50
          bg-gradient-to-r from-primary-600 to-primary-700 
          text-white p-2 rounded-full shadow-lg
          transition-transform duration-300
          ${isOpen ? 'rotate-0' : 'rotate-180'}
          hover:scale-110 active:scale-95
        `}
        title={isOpen ? 'طي القائمة' : 'فتح القائمة'}
      >
        {isOpen ? <FiChevronRight /> : <FiChevronLeft />}
      </button>

      {/* رأس الشريط الجانبي */}
      <div className={`
        p-4 border-b border-gray-700
        transition-all duration-300
        ${!isOpen && 'opacity-0'}
      `}>
        <div className="flex items-center space-x-3 space-x-reverse mb-4">
          <div className="relative">
            <MdPoultry className="w-8 h-8 text-yellow-400 animate-pulse" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
          </div>
          {isOpen && (
            <div>
              <h2 className="text-lg font-bold text-white">دواجني</h2>
              <p className="text-xs text-gray-400">الإدارة المتكاملة</p>
            </div>
          )}
        </div>
        
        {isOpen && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">النظام نشط</span>
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-1.5">
              <div 
                className="bg-gradient-to-r from-green-500 to-blue-500 h-1.5 rounded-full"
                style={{ width: '85%' }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* قائمة التنقل */}
      <nav className="p-2 overflow-y-auto h-[calc(100vh-10rem)]">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            if (item.id) {
              // عنصر فردي
              return (
                <li key={item.id}>
                  <button
                    onClick={() => setCurrentPage(item.id)}
                    className={`
                      w-full flex items-center p-3 rounded-lg
                      transition-all duration-200 group
                      ${currentPage === item.id
                        ? 'bg-gradient-to-r from-primary-600 to-primary-700 shadow-md'
                        : 'hover:bg-gray-700 hover:shadow-md'
                      }
                    `}
                    title={!isOpen ? item.label : ''}
                  >
                    <span className={`${item.color} transition-transform group-hover:scale-110`}>
                      {item.icon}
                    </span>
                    {isOpen && (
                      <>
                        <span className="mr-3 flex-1 text-right">{item.label}</span>
                        {currentPage === item.id && (
                          <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
                        )}
                      </>
                    )}
                  </button>
                </li>
              );
            } else {
              // قسم يحتوي على عناصر فرعية
              return (
                <li key={item.section}>
                  <button
                    onClick={() => toggleSection(item.section)}
                    className={`
                      w-full flex items-center justify-between p-3 rounded-lg
                      transition-all duration-200 group
                      hover:bg-gray-700 hover:shadow-md
                    `}
                    title={!isOpen ? item.label : ''}
                  >
                    <div className="flex items-center">
                      <span className={`${item.color} transition-transform group-hover:scale-110`}>
                        {item.icon}
                      </span>
                      {isOpen && (
                        <span className="mr-3">{item.label}</span>
                      )}
                    </div>
                    {isOpen && (
                      <span className={`
                        transition-transform duration-200
                        ${expandedSections[item.section] ? 'rotate-90' : 'rotate-0'}
                      `}>
                        <FiChevronLeft />
                      </span>
                    )}
                  </button>

                  {/* العناصر الفرعية */}
                  {isOpen && expandedSections[item.section] && (
                    <ul className="mr-6 mt-1 space-y-1 border-r-2 border-gray-700 pr-2">
                      {item.subItems.map((subItem) => (
                        <li key={subItem.id}>
                          <button
                            onClick={() => setCurrentPage(subItem.id)}
                            className={`
                              w-full flex items-center p-2 rounded
                              transition-all duration-200 text-sm
                              ${currentPage === subItem.id
                                ? 'text-primary-300 bg-gray-800'
                                : 'text-gray-400 hover:text-white hover:bg-gray-700'
                              }
                            `}
                          >
                            <span className="ml-2">{subItem.icon}</span>
                            <span className="flex-1 text-right">{subItem.label}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            }
          })}
        </ul>

        {/* إحصائيات سريعة */}
        {isOpen && (
          <div className="mt-8 p-4 bg-gray-800 rounded-lg border border-gray-700">
            <h3 className="text-sm font-medium text-gray-300 mb-3">نظرة سريعة</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>الدورات النشطة</span>
                  <span className="text-green-400">4</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-1.5">
                  <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>مخزون الأعلاف</span>
                  <span className="text-yellow-400">65%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-1.5">
                  <div className="bg-yellow-500 h-1.5 rounded-full" style={{ width: '65%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>الإنتاج اليومي</span>
                  <span className="text-blue-400">92%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-1.5">
                  <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '92%' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* تذييل الشريط الجانبي */}
      <div className={`
        absolute bottom-0 right-0 left-0 p-3
        border-t border-gray-700 bg-gray-800
        transition-all duration-300
        ${!isOpen && 'opacity-0'}
      `}>
        {isOpen && (
          <>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-400">آخر تحديث</span>
              <span className="text-xs text-green-400">الآن</span>
            </div>
            <div className="flex items-center space-x-2 space-x-reverse">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                <FiTool className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium">النظام يعمل بكفاءة</p>
                <p className="text-xs text-gray-400">جميع الخدمات نشطة</p>
              </div>
            </div>
          </>
        )}
        
        {!isOpen && (
          <div className="text-center">
            <MdPoultry className="w-6 h-6 text-yellow-400 mx-auto animate-pulse" />
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
