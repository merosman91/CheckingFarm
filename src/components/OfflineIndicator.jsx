import React, { useState, useEffect } from 'react';
import { FiWifi, FiWifiOff, FiRefreshCw } from 'react-icons/fi';

const OfflineIndicator = ({ isOnline }) => {
  const [show, setShow] = useState(!isOnline);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!isOnline) {
      setShow(true);
      setMessage('أنت تعمل بدون اتصال بالإنترنت');
    } else {
      setMessage('تم استعادة الاتصال بالإنترنت');
      setTimeout(() => {
        setShow(false);
      }, 3000);
    }
  }, [isOnline]);

  if (!show) return null;

  return (
    <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 ${
      isOnline 
        ? 'bg-green-100 border-green-400 text-green-800' 
        : 'bg-yellow-100 border-yellow-400 text-yellow-800'
    } border rounded-lg shadow-lg px-4 py-3 flex items-center gap-3 animate-fade-in`}>
      {isOnline ? (
        <>
          <FiWifi className="w-5 h-5" />
          <span>{message}</span>
        </>
      ) : (
        <>
          <FiWifiOff className="w-5 h-5" />
          <span>{message}</span>
          <button
            onClick={() => window.location.reload()}
            className="text-yellow-700 hover:text-yellow-900 ml-2"
            title="إعادة المحاولة"
          >
            <FiRefreshCw className="w-4 h-4" />
          </button>
        </>
      )}
    </div>
  );
};

export default OfflineIndicator;
