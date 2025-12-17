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
//import NotFound from './components/NotFound'

function App() {
  const [showSplash, setShowSplash] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false)
    }, 3000)
    return () => clearTimeout(timer)
  }, [])

  if (showSplash) {
    return <SplashScreen />
  }

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
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
    </Router>
  )
}

export default App
