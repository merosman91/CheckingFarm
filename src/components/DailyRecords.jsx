import React, { useState, useEffect } from 'react'

const DailyRecords = () => {
  const [records, setRecords] = useState([])
  const [showNewRecord, setShowNewRecord] = useState(false)

  const [newRecord, setNewRecord] = useState({
    cycleName: '',
    date: new Date().toISOString().split('T')[0],
    mortality: 0,
    feedConsumed: 0,
    waterConsumed: 0,
    notes: ''
  })

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
      id: Date.now(),
      ...newRecord,
      createdAt: new Date().toISOString()
    }

    setRecords([...records, record])
    setShowNewRecord(false)
    setNewRecord({
      cycleName: '',
      date: new Date().toISOString().split('T')[0],
      mortality: 0,
      feedConsumed: 0,
      waterConsumed: 0,
      notes: ''
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">السجلات اليومية</h1>
          <p className="text-gray-600 mt-1">تسجيل المؤشرات اليومية للدواجن</p>
        </div>
        <button 
          className="btn-secondary"
          onClick={() => setShowNewRecord(true)}
        >
          + تسجيل يومي
        </button>
      </div>

      {/* السجلات */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">التاريخ</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">الدورة</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">النفوق</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">العلف (كغ)</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">الماء (لتر)</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {records.map((record) => (
                <tr key={record.id}>
                  <td className="px-4 py-3 text-sm text-gray-900">{record.date}</td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{record.cycleName}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{record.mortality}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{record.feedConsumed}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{record.waterConsumed}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* نافذة تسجيل جديد */}
      {showNewRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">تسجيل يومي جديد</h2>
                <button
                  onClick={() => setShowNewRecord(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    اسم الدورة
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    value={newRecord.cycleName}
                    onChange={(e) => setNewRecord({...newRecord, cycleName: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    التاريخ
                  </label>
                  <input
                    type="date"
                    className="input-field"
                    value={newRecord.date}
                    onChange={(e) => setNewRecord({...newRecord, date: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      عدد النفوق
                    </label>
                    <input
                      type="number"
                      className="input-field"
                      value={newRecord.mortality}
                      onChange={(e) => setNewRecord({...newRecord, mortality: parseInt(e.target.value) || 0})}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      العلف المستهلك (كغ)
                    </label>
                    <input
                      type="number"
                      className="input-field"
                      value={newRecord.feedConsumed}
                      onChange={(e) => setNewRecord({...newRecord, feedConsumed: parseFloat(e.target.value) || 0})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الماء المستهلك (لتر)
                  </label>
                  <input
                    type="number"
                    className="input-field"
                    value={newRecord.waterConsumed}
                    onChange={(e) => setNewRecord({...newRecord, waterConsumed: parseFloat(e.target.value) || 0})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ملاحظات
                  </label>
                  <textarea
                    className="input-field h-24"
                    value={newRecord.notes}
                    onChange={(e) => setNewRecord({...newRecord, notes: e.target.value})}
                  />
                </div>

                <div className="flex justify-end space-x-3 space-x-reverse pt-4 border-t">
                  <button
                    onClick={() => setShowNewRecord(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    إلغاء
                  </button>
                  <button
                    onClick={handleAddRecord}
                    className="btn-primary px-4 py-2"
                  >
                    حفظ
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
