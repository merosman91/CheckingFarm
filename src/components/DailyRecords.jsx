import React, { useState, useEffect } from 'react'
import { 
  Plus, 
  Calendar,
  Users,
  Droplets,
  Package,
  Activity,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  Filter,
  BarChart3
} from 'lucide-react'

const DailyRecords = () => {
  const [records, setRecords] = useState([])
  const [showNewRecord, setShowNewRecord] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [activeCycle, setActiveCycle] = useState('')

  const [newRecord, setNewRecord] = useState({
    cycleId: '',
    date: new Date().toISOString().split('T')[0],
    mortality: 0,
    feedConsumed: 0,
    waterConsumed: 0,
    weight: 0,
    temperature: 0,
    humidity: 0,
    notes: '',
    issues: ''
  })

  const [cycles] = useState([
    { id: 1, name: 'الدورة الشتوية', birds: 5000, startDate: '2024-01-01' },
    { id: 2, name: 'الدورة الربيعية', birds: 7500, startDate: '2024-03-01' },
    { id: 3, name: 'الدورة الصيفية', birds: 6000, startDate: '2024-06-01' },
  ])

  useEffect(() => {
    const savedRecords = localStorage.getItem('dailyRecords')
    if (savedRecords) {
      setRecords(JSON.parse(savedRecords))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('dailyRecords', JSON.stringify(records))
  }, [records])

  const handleAddRecord = () => {
    const record = {
      id: records.length + 1,
      ...newRecord,
      createdAt: new Date().toISOString(),
      cycleName: cycles.find(c => c.id == newRecord.cycleId)?.name || ''
    }

    setRecords([...records, record])
    setShowNewRecord(false)
    setNewRecord({
      cycleId: '',
      date: new Date().toISOString().split('T')[0],
      mortality: 0,
      feedConsumed: 0,
      waterConsumed: 0,
      weight: 0,
      temperature: 0,
      humidity: 0,
      notes: '',
      issues: ''
    })
  }

  const todaysRecords = records.filter(r => r.date === selectedDate)
  const selectedCycleRecords = records.filter(r => r.cycleId == activeCycle)

  const dailyStats = {
    totalMortality: todaysRecords.reduce((sum, r) => sum + r.mortality, 0),
    totalFeed: todaysRecords.reduce((sum, r) => sum + r.feedConsumed, 0),
    totalWater: todaysRecords.reduce((sum, r) => sum + r.waterConsumed, 0),
    avgWeight: todaysRecords.length > 0 
      ? todaysRecords.reduce((sum, r) => sum + r.weight, 0) / todaysRecords.length 
      : 0
  }

  return (
    <div className="space-y-6">
      {/* رأس الصفحة */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">السجلات اليومية</h1>
          <p className="text-gray-600 mt-1">تسجيل المؤشرات اليومية للدواجن</p>
        </div>
        <div className="flex items-center space-x-3 space-x-reverse">
          <div className="bg-blue-50 px-4 py-2 rounded-lg">
            <p className="text-sm text-gray-600">تاريخ اليوم</p>
            <p className="font-medium">{new Date().toLocaleDateString('ar-SA')}</p>
          </div>
          <button 
            className="btn-secondary flex items-center"
            onClick={() => setShowNewRecord(true)}
          >
            <Plus size={18} className="ml-2" />
            تسجيل يومي
          </button>
        </div>
      </div>

      {/* فلتر التاريخ */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">اختر التاريخ</label>
            <input
              type="date"
              className="input-field"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">اختر الدورة</label>
            <select
              className="input-field"
              value={activeCycle}
              onChange={(e) => setActiveCycle(e.target.value)}
            >
              <option value="">جميع الدورات</option>
              {cycles.map(cycle => (
                <option key={cycle.id} value={cycle.id}>{cycle.name}</option>
              ))}
            </select>
          </div>
          <div className="flex space-x-2 space-x-reverse">
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter size={20} className="text-gray-600" />
            </button>
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Download size={20} className="text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* إحصائيات اليوم */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">إجمالي النفوق اليوم</p>
              <p className={`text-2xl font-bold mt-2 ${
                dailyStats.totalMortality > 10 ? 'text-red-600' : 'text-gray-800'
              }`}>
                {dailyStats.totalMortality}
              </p>
              <p className="text-sm text-gray-500 mt-1">طائر</p>
            </div>
            <div className={`p-3 rounded-lg ${
              dailyStats.totalMortality > 10 ? 'bg-red-50' : 'bg-gray-50'
            }`}>
              <Users size={24} className={
                dailyStats.totalMortality > 10 ? 'text-red-600' : 'text-gray-600'
              } />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">استهلاك العلف</p>
              <p className="text-2xl font-bold text-gray-800 mt-2">
                {dailyStats.totalFeed}
              </p>
              <p className="text-sm text-gray-500 mt-1">كيلوجرام</p>
            </div>
            <div className="p-3 rounded-lg bg-green-50">
              <Package size={24} className="text-green-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">استهلاك الماء</p>
              <p className="text-2xl font-bold text-gray-800 mt-2">
                {dailyStats.totalWater}
              </p>
              <p className="text-sm text-gray-500 mt-1">لتر</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-50">
              <Droplets size={24} className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">متوسط الوزن</p>
              <p className="text-2xl font-bold text-gray-800 mt-2">
                {dailyStats.avgWeight.toFixed(2)}
              </p>
              <p className="text-sm text-gray-500 mt-1">كيلوجرام</p>
            </div>
            <div className="p-3 rounded-lg bg-purple-50">
              <Activity size={24} className="text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* السجلات اليومية */}
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">سجلات اليوم</h2>
          <div className="flex items-center space-x-2 space-x-reverse">
            <span className="text-sm text-gray-600">
              {todaysRecords.length} تسجيل
            </span>
          </div>
        </div>

        {todaysRecords.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">لا توجد سجلات لهذا اليوم</h3>
            <p className="mt-2 text-gray-500">ابدأ بتسجيل المؤشرات اليومية للدورات النشطة.</p>
            <button 
              className="mt-4 btn-secondary"
              onClick={() => setShowNewRecord(true)}
            >
              <Plus size={18} className="ml-2" />
              تسجيل جديد
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {todaysRecords.map((record) => (
              <div key={record.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-800">{record.cycleName}</h3>
                    <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="flex items-center">
                        <Users size={16} className="text-gray-400 ml-2" />
                        <span className="text-sm text-gray-600">النفوق:</span>
                        <span className="font-medium text-gray-800 mr-2">{record.mortality}</span>
                      </div>
                      <div className="flex items-center">
                        <Package size={16} className="text-gray-400 ml-2" />
                        <span className="text-sm text-gray-600">العلف:</span>
                        <span className="font-medium text-gray-800 mr-2">{record.feedConsumed} كغ</span>
                      </div>
                      <div className="flex items-center">
                        <Droplets size={16} className="text-gray-400 ml-2" />
                        <span className="text-sm text-gray-600">الماء:</span>
                        <span className="font-medium text-gray-800 mr-2">{record.waterConsumed} لتر</span>
                      </div>
                      <div className="flex items-center">
                        <Activity size={16} className="text-gray-400 ml-2" />
                        <span className="text-sm text-gray-600">الوزن:</span>
                        <span className="font-medium text-gray-800 mr-2">{record.weight} كغ</span>
                      </div>
                    </div>
                  </div>
                  <span className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                    {new Date(record.createdAt).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                
                {record.notes && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700">{record.notes}</p>
                  </div>
                )}

                {record.issues && (
                  <div className="mt-2 p-3 bg-red-50 rounded-lg border border-red-100">
                    <p className="text-sm text-red-700">
                      <AlertTriangle size={14} className="inline ml-1" />
                      {record.issues}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* مؤشرات الأداء */}
      {selectedCycle && selectedCycleRecords.length > 0 && (
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            مؤشرات أداء {cycles.find(c => c.id == activeCycle)?.name}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">معدل النفوق التراكمي</p>
              <p className="text-2xl font-bold text-gray-800 mt-2">
                {((selectedCycleRecords.reduce((sum, r) => sum + r.mortality, 0) / 
                  cycles.find(c => c.id == activeCycle)?.birds * 100) || 0).toFixed(2)}%
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">متوسط استهلاك العلف</p>
              <p className="text-2xl font-bold text-gray-800 mt-2">
                {(selectedCycleRecords.reduce((sum, r) => sum + r.feedConsumed, 0) / 
                 selectedCycleRecords.length || 0).toFixed(1)} كغ/يوم
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">معدل التحويل الغذائي</p>
              <p className="text-2xl font-bold text-gray-800 mt-2">
                {((selectedCycleRecords.reduce((sum, r) => sum + r.feedConsumed, 0) / 
                  (cycles.find(c => c.id == activeCycle)?.birds * 
                   selectedCycleRecords.reduce((sum, r) => sum + r.weight, 0) / 
                   selectedCycleRecords.length)) || 0).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* نافذة تسجيل جديد */}
      {showNewRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">تسجيل يومي جديد</h2>
                <button
                  onClick={() => setShowNewRecord(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                {/* المعلومات الأساسية */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الدورة *
                    </label>
                    <select
                      className="input-field"
                      value={newRecord.cycleId}
                      onChange={(e) => setNewRecord({...newRecord, cycleId: e.target.value})}
                    >
                      <option value="">اختر الدورة</option>
                      {cycles.map(cycle => (
                        <option key={cycle.id} value={cycle.id}>
                          {cycle.name} ({cycle.birds.toLocaleString()} طائر)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      التاريخ *
                    </label>
                    <input
                      type="date"
                      className="input-field"
                      value={newRecord.date}
                      onChange={(e) => setNewRecord({...newRecord, date: e.target.value})}
                    />
                  </div>
                </div>

                {/* المؤشرات الأساسية */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      عدد النفوق اليومي
                    </label>
                    <input
                      type="number"
                      className="input-field"
                      value={newRecord.mortality}
                      onChange={(e) => setNewRecord({...newRecord, mortality: parseInt(e.target.value) || 0})}
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      كمية العلف المستهلكة (كغ)
                    </label>
                    <input
                      type="number"
                      className="input-field"
                      value={newRecord.feedConsumed}
                      onChange={(e) => setNewRecord({...newRecord, feedConsumed: parseFloat(e.target.value) || 0})}
                      min="0"
                      step="0.1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      كمية الماء المستهلكة (لتر)
                    </label>
                    <input
                      type="number"
                      className="input-field"
                      value={newRecord.waterConsumed}
                      onChange={(e) => setNewRecord({...newRecord, waterConsumed: parseFloat(e.target.value) || 0})}
                      min="0"
                      step="0.1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      متوسط الوزن (كغ)
                    </label>
                    <input
                      type="number"
                      className="input-field"
                      value={newRecord.weight}
                      onChange={(e) => setNewRecord({...newRecord, weight: parseFloat(e.target.value) || 0})}
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>

                {/* الظروف البيئية */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      درجة الحرارة (°C)
                    </label>
                    <input
                      type="number"
                      className="input-field"
                      value={newRecord.temperature}
                      onChange={(e) => setNewRecord({...newRecord, temperature: parseFloat(e.target.value) || 0})}
                      min="0"
                      step="0.1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الرطوبة النسبية (%)
                    </label>
                    <input
                      type="number"
                      className="input-field"
                      value={newRecord.humidity}
                      onChange={(e) => setNewRecord({...newRecord, humidity: parseFloat(e.target.value) || 0})}
                      min="0"
                      max="100"
                      step="0.1"
                    />
                  </div>
                </div>

                {/* الملاحظات والمشاكل */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الملاحظات
                  </label>
                  <textarea
                    className="input-field h-24"
                    value={newRecord.notes}
                    onChange={(e) => setNewRecord({...newRecord, notes: e.target.value})}
                    placeholder="ملاحظات عامة عن حالة الطيور..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    المشاكل والملاحظات الهامة
                  </label>
                  <textarea
                    className="input-field h-24"
                    value={newRecord.issues}
                    onChange={(e) => setNewRecord({...newRecord, issues: e.target.value})}
                    placeholder="أي مشاكل أو ملاحظات هامة تحتاج متابعة..."
                  />
                </div>

                {/* أزرار التنفيذ */}
                <div className="flex justify-end space-x-3 space-x-reverse pt-6 border-t">
                  <button
                    onClick={() => setShowNewRecord(false)}
                    className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    إلغاء
                  </button>
                  <button
                    onClick={handleAddRecord}
                    className="btn-primary px-6 py-3"
                    disabled={!newRecord.cycleId}
                  >
                    حفظ التسجيل
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DailyRecords
