import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import SplashScreen from './components/SplashScreen'
import Dashboard from './components/Dashboard'
import CyclesManagement from './components/CyclesManagement'
import InventoryManagement from './components/InventoryManagement'
import HealthManagement from './components/HealthManagement'
import FinancialManagement from './components/FinancialManagement'
import DailyRecords from './components/DailyRecords'
import SalesManagement from './components/SalesManagement'
import EmployeesManagement from './components/EmployeesManagement'
import Reports from './components/Reports'
import Settings from './components/Settings'

// مكون للصفحة غير موجودة
const NotFound = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
    <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
    <p className="text-gray-600 mb-8">الصفحة غير موجودة</p>
    <a href="/" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
      العودة للرئيسية
    </a>
  </div>
)

function App() {
  const [showSplash, setShowSplash] = useState(true)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // محاكاة وقت تحميل البيانات الأولية
    const loadData = async () => {
      // يمكنك هنا تحميل البيانات الأولية إذا كان هناك حاجة
      await new Promise(resolve => setTimeout(resolve, 2000))
      setIsLoading(false)
    }

    loadData()
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false)
    }, 3000)
    return () => clearTimeout(timer)
  }, [])

  // إذا كان لا يزال في مرحلة التحميل، اعرض شاشة التحميل
  if (isLoading) {
    return <SplashScreen />
  }

  // بعد انتهاء التحميل، اعرض التطبيق الرئيسي
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/*" element={
            <Layout>
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/cycles" element={<CyclesManagement />} />
                <Route path="/inventory" element={<InventoryManagement />} />
                <Route path="/health" element={<HealthManagement />} />
                <Route path="/financial" element={<FinancialManagement />} />
                <Route path="/daily-records" element={<DailyRecords />} />
                <Route path="/sales" element={<SalesManagement />} />
                <Route path="/employees" element={<EmployeesManagement />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          } />
        </Routes>
      </div>
    </Router>
  )
}

export default App
