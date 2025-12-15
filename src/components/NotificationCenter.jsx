import React, { useState, useEffect } from 'react';
import {
  FiBell, FiCheck, FiTrash2, FiSettings,
  FiAlertCircle, FiCheckCircle, FiInfo,
  FiClock, FiFilter
} from 'react-icons/fi';

const NotificationCenter = ({ notifications, setNotifications }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState('الكل');

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    if (window.confirm('هل تريد حذف جميع الإشعارات؟')) {
      setNotifications([]);
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'الكل') return true;
    if (filter === 'غير مقروء') return !notification.read;
    return notification.type === filter;
  });

  const notificationTypes = [
    { id: 'الكل', label: 'الكل', icon: FiBell },
    { id: 'غير مقروء', label: 'غير مقروء', icon: FiAlertCircle },
    { id: 'info', label: 'معلومات', icon: FiInfo },
    { id: 'success', label: 'نجاح', icon: FiCheckCircle },
    { id: 'warning', label: 'تحذير', icon: FiAlertCircle },
    { id: 'error', label: 'خطأ', icon: FiAlertCircle }
  ];

  return (
    <>
      {/* زر الإشعارات */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 left-6 z-40 p-4 bg-primary-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
        title="الإشعارات"
      >
        <FiBell className="w-6 h-6" />
        {notifications.filter(n => !n.read).length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
            {notifications.filter(n => !n.read).length}
          </span>
        )}
      </button>

      {/* لوحة الإشعارات */}
      {isOpen && (
        <div className="fixed inset-0 z-50">
          {/* الخلفية المعتمة */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setIsOpen(false)}
          />
          
          {/* لوحة الإشعارات */}
          <div className="absolute bottom-24 left-6 w-96 bg-white rounded-xl shadow-2xl overflow-hidden">
            {/* رأس اللوحة */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white p-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <FiBell className="w-5 h-5" />
                  <h3 className="font-bold">مركز الإشعارات</h3>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={markAllAsRead}
                    className="p-1 hover:bg-white hover:bg-opacity-20 rounded"
                    title="قراءة الكل"
                  >
                    <FiCheck className="w-4 h-4" />
                  </button>
                  <button
                    onClick={clearAll}
                    className="p-1 hover:bg-white hover:bg-opacity-20 rounded"
                    title="حذف الكل"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 hover:bg-white hover:bg-opacity-20 rounded"
                    title="إغلاق"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>

            {/* الفلاتر */}
            <div className="p-3 border-b">
              <div className="flex flex-wrap gap-2">
                {notificationTypes.map(type => (
                  <button
                    key={type.id}
                    onClick={() => setFilter(type.id)}
                    className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 transition-all ${
                      filter === type.id
                        ? 'bg-primary-100 text-primary-700'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <type.icon className="w-3 h-3" />
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* قائمة الإشعارات */}
            <div className="max-h-96 overflow-y-auto">
              {filteredNotifications.length > 0 ? (
                filteredNotifications.map(notification => (
                  <div
                    key={notification.id}
                    className={`p-4 border-b hover:bg-gray-50 transition-colors ${
                      !notification.read ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex gap-3">
                      <div className={`p-2 rounded-lg ${
                        notification.type === 'success' ? 'bg-green-100 text-green-600' :
                        notification.type === 'error' ? 'bg-red-100 text-red-600' :
                        notification.type === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                        'bg-blue-100 text-blue-600'
                      }`}>
                        {notification.type === 'success' ? <FiCheckCircle className="w-5 h-5" /> :
                         notification.type === 'error' ? <FiAlertCircle className="w-5 h-5" /> :
                         <FiInfo className="w-5 h-5" />}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium text-gray-800">{notification.title}</h4>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">
                              <FiClock className="inline ml-1" />
                              {notification.time}
                            </span>
                            {!notification.read && (
                              <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                        
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="text-xs text-primary-600 hover:text-primary-800"
                          >
                            {notification.read ? 'تم القراءة' : 'وضع مقروء'}
                          </button>
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="text-xs text-red-600 hover:text-red-800"
                          >
                            حذف
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <FiBell className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>لا توجد إشعارات</p>
                </div>
              )}
            </div>

            {/* تذييل اللوحة */}
            <div className="p-3 bg-gray-50 border-t">
              <div className="flex justify-between text-sm text-gray-600">
                <span>
                  {notifications.filter(n => !n.read).length} غير مقروء
                </span>
                <span>
                  {notifications.length} إجمالي
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NotificationCenter;
