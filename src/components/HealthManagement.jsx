import React, { useState, useEffect } from 'react'

const HealthManagement = () => {
  const [vaccinations, setVaccinations] = useState([])
  const [treatments, setTreatments] = useState([])
  const [diseaseReports, setDiseaseReports] = useState([])
  const [activeTab, setActiveTab] = useState('vaccinations')
  const [showNewRecord, setShowNewRecord] = useState(false)
  const [selectedCycle, setSelectedCycle] = useState('')

  const [newRecord, setNewRecord] = useState({
    type: 'vaccination',
    cycleId: '',
    date: new Date().toISOString().split('T')[0],
    vaccineName: '',
    dose: '',
    method: '',
    notes: '',
    mortality: 0,
    symptoms: '',
    diagnosis: '',
    medicine: '',
    dosage: '',
    duration: ''
  })

  useEffect(() => {
    // تحميل البيانات من localStorage
    const savedData = localStorage.getItem('healthData')
    if (savedData) {
      const data = JSON.parse(savedData)
      setVaccinations(data.vaccinations || [])
      setTreatments(data.treatments || [])
      setDiseaseReports(data.diseaseReports || [])
    }
  }, [])

  useEffect(() => {
    // حفظ البيانات في localStorage
    const data = {
      vaccinations,
      treatments,
      diseaseReports
    }
    localStorage.setItem('healthData', JSON.stringify(data))
  }, [vaccinations, treatments, diseaseReports])

  const [cycles] = useState([
    { id: 1, name: 'الدورة الشتوية', birds: 5000 },
    { id: 2, name: 'الدورة الربيعية', birds: 7500 },
    { id: 3, name: 'الدورة الصيفية', birds: 6000 },
  ])

  const vaccines = [
    'نيوكاسل', 'إنفلونزا الطيور', 'جدري الطيور', 'ماريك', 'جامبرو', 'برونشيت'
  ]

  const handleAddRecord = () => {
    const record = {
      id: newRecord.type === 'vaccination' ? vaccinations.length + 1 : 
           newRecord.type === 'treatment' ? treatments.length + 1 :
           diseaseReports.length + 1,
      ...newRecord,
      status: 'completed',
      createdAt: new Date().toISOString()
    }

    if (newRecord.type === 'vaccination') {
      setVaccinations([...vaccinations, record])
    } else if (newRecord.type === 'treatment') {
      setTreatments([...treatments, record])
    } else {
      setDiseaseReports([...diseaseReports, record])
    }

    setShowNewRecord(false)
    setNewRecord({
      type: 'vaccination',
      cycleId: '',
      date: new Date().toISOString().split('T')[0],
      vaccineName: '',
      dose: '',
      method: '',
      notes: '',
      mortality: 0,
      symptoms: '',
      diagnosis: '',
      medicine: '',
      dosage: '',
      duration: ''
    })
  }

  const pendingVaccinations = vaccinations.filter(v => v.status === 'pending')
  const upcomingTreatments = treatments.filter(t => new Date(t.date) > new Date())

  // دالة مساعدة لعرض الأيقونات
  const Icon = ({ name, className = "w-5 h-5", ...props }) => (
    <img 
      src={`/icons/${name}.svg`} 
      alt={name}
      className={className}
      {...props}
    />
  )

  return (
    <div className="space-y-6">
      {/* رأس الصفحة */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">إدارة الصحة</h1>
          <p className="text-gray-600 mt-1">تتبع التطعيمات والعلاجات وصحة الطيور</p>
        </div>
        <div className="flex items-center space-x-3 space-x-reverse">
          <button 
            className="btn-secondary flex items-center"
            onClick={() => setShowNewRecord(true)}
          >
            <Icon name="plus" className="w-4 h-4 ml-2" />
            تسجيل جديد
          </button>
        </div>
      </div>

      {/* بطاقات الإحصائيات */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">التطعيمات المكتملة</p>
              <p className="text-2xl font-bold text-gray-800 mt-2">
                {vaccinations.filter(v => v.status === 'completed').length}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-blue-50">
              <Icon name="syringe" className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">علاجات نشطة</p>
              <p className="text-2xl font-bold text-gray-800 mt-2">
                {treatments.filter(t => t.status === 'active').length}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-green-50">
              <Icon name="heart" className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">تقارير الأمراض</p>
              <p className="text-2xl font-bold text-gray-800 mt-2">
                {diseaseReports.length}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-yellow-50">
              <Icon name="alert-triangle" className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">معدل النفوق</p>
              <p className="text-2xl font-bold text-gray-800 mt-2">
                1.2%
              </p>
              <p className="text-sm text-gray-500 mt-1">من إجمالي الطيور</p>
            </div>
            <div className="p-3 rounded-lg bg-red-50">
              <Icon name="activity" className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* تنقل بين التبويبات */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 space-x-reverse">
          {[
            { id: 'vaccinations', label: 'التطعيمات', icon: 'syringe' },
            { id: 'treatments', label: 'العلاجات', icon: 'heart' },
            { id: 'diseases', label: 'تقارير الأمراض', icon: 'alert-triangle' },
            { id: 'alerts', label: 'التنبيهات', icon: 'clock' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Icon name={tab.icon} className="w-4 h-4 ml-2" />
              {tab.label}
              {tab.id === 'alerts' && pendingVaccinations.length > 0 && (
                <span className="mr-2 bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                  {pendingVaccinations.length}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* محتوى التبويبات */}
      <div className="space-y-6">
        {activeTab === 'vaccinations' && (
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">جدول التطعيمات</h2>
              <div className="flex space-x-2 space-x-reverse">
                <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Icon name="filter" className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Icon name="download" className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {vaccinations.length === 0 ? (
              <div className="text-center py-12">
                <Icon name="syringe" className="mx-auto w-12 h-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">لا توجد تطعيمات مسجلة</h3>
                <p className="mt-2 text-gray-500">ابدأ بتسجيل تطعيمات جديدة للدورات النشطة.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        الدورة
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        نوع التطعيم
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        التاريخ
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        الجرعة
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        الطريقة
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        الحالة
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        الإجراءات
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {vaccinations.map((vac) => (
                      <tr key={vac.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">
                            {cycles.find(c => c.id == vac.cycleId)?.name || 'غير محدد'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{vac.vaccineName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {vac.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{vac.dose}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {vac.method}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 text-xs rounded-full ${
                            vac.status === 'completed' 
                              ? 'bg-green-100 text-green-800' 
                              : vac.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {vac.status === 'completed' ? 'مكتمل' : 
                             vac.status === 'pending' ? 'معلق' : 'ملغى'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2 space-x-reverse">
                            <button className="text-blue-600 hover:text-blue-900">
                              <Icon name="edit" className="w-4 h-4" />
                            </button>
                            <button className="text-red-600 hover:text-red-900">
                              <Icon name="trash-2" className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'treatments' && (
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">العلاجات المستمرة</h2>
            {treatments.length === 0 ? (
              <div className="text-center py-12">
                <Icon name="heart" className="mx-auto w-12 h-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">لا توجد علاجات مسجلة</h3>
              </div>
            ) : (
              <div className="space-y-4">
                {treatments.map((treatment) => (
                  <div key={treatment.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-800">{treatment.medicine}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          التشخيص: {treatment.diagnosis}
                        </p>
                        <div className="flex items-center mt-2 space-x-4 space-x-reverse">
                          <span className="text-sm text-gray-500">
                            <Icon name="calendar" className="w-3 h-3 inline ml-1" />
                            {treatment.date}
                          </span>
                          <span className="text-sm text-gray-500">
                            الجرعة: {treatment.dosage}
                          </span>
                          <span className="text-sm text-gray-500">
                            المدة: {treatment.duration} يوم
                          </span>
                        </div>
                      </div>
                      <span className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                        مستمر
                      </span>
                    </div>
                    {treatment.notes && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700">{treatment.notes}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'diseases' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">تقارير الأمراض</h2>
              <div className="space-y-4">
                {diseaseReports.slice(0, 3).map((report) => (
                  <div key={report.id} className="p-4 border border-red-100 rounded-lg bg-red-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-red-800">{report.diagnosis}</h3>
                        <p className="text-sm text-red-600 mt-1">
                          الأعراض: {report.symptoms}
                        </p>
                        <p className="text-sm text-red-600 mt-1">
                          النفوق: {report.mortality} طائر
                        </p>
                      </div>
                      <span className="px-3 py-1 text-xs rounded-full bg-red-100 text-red-800">
                        {new Date(report.date).toLocaleDateString('ar-SA')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">إحصائيات الصحة</h2>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">معدل التعافي</span>
                    <span className="text-sm font-medium">92%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: '92%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">التطعيمات المكتملة</span>
                    <span className="text-sm font-medium">85%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">تكاليف العلاج</span>
                    <span className="text-sm font-medium">2,400 ر.س</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-500 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'alerts' && (
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">التنبيهات والتذكيرات</h2>
            <div className="space-y-4">
              {pendingVaccinations.length > 0 ? (
                pendingVaccinations.map((vac) => (
                  <div key={vac.id} className="p-4 border border-yellow-200 rounded-lg bg-yellow-50">
                    <div className="flex items-center">
                      <Icon name="clock" className="w-5 h-5 text-yellow-600 ml-3" />
                      <div className="flex-1">
                        <h3 className="font-medium text-yellow-800">تطعيم معلق</h3>
                        <p className="text-sm text-yellow-700 mt-1">
                          {vac.vaccineName} - {cycles.find(c => c.id == vac.cycleId)?.name}
                        </p>
                      </div>
                      <button className="text-yellow-700 hover:text-yellow-900 text-sm font-medium">
                        تأكيد الإنجاز
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Icon name="check-circle" className="mx-auto w-12 h-12 text-green-400" />
                  <h3 className="mt-4 text-lg font-medium text-gray-900">لا توجد تنبيهات حالية</h3>
                  <p className="mt-2 text-gray-500">جميع المهام محدثة ومكتملة.</p>
                </div>
              )}

              {upcomingTreatments.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">علاجات قادمة</h3>
                  {upcomingTreatments.map((treatment) => (
                    <div key={treatment.id} className="p-3 border border-blue-200 rounded-lg bg-blue-50 mb-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-blue-800">{treatment.medicine}</p>
                          <p className="text-sm text-blue-700">{treatment.diagnosis}</p>
                        </div>
                        <span className="text-sm text-blue-600">
                          {new Date(treatment.date).toLocaleDateString('ar-SA')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* نافذة تسجيل جديد */}
      {showNewRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">تسجيل صحي جديد</h2>
                <button
                  onClick={() => setShowNewRecord(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              {/* نوع التسجيل */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">نوع التسجيل</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'vaccination', label: 'تطعيم', icon: 'syringe' },
                    { value: 'treatment', label: 'علاج', icon: 'heart' },
                    { value: 'disease', label: 'مرض', icon: 'alert-triangle' }
                  ].map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setNewRecord({...newRecord, type: type.value})}
                      className={`p-4 border rounded-lg flex flex-col items-center transition-colors ${
                        newRecord.type === type.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <Icon name={type.icon} className={`w-6 h-6 mb-2 ${
                        newRecord.type === type.value ? 'text-blue-600' : 'text-gray-400'
                      }`} />
                      <span className={`font-medium ${
                        newRecord.type === type.value ? 'text-blue-700' : 'text-gray-700'
                      }`}>
                        {type.label}
                      </span>
                    </button>
                  ))}
                </div>
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

                {/* تفاصيل حسب النوع */}
                {newRecord.type === 'vaccination' && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          نوع التطعيم *
                        </label>
                        <select
                          className="input-field"
                          value={newRecord.vaccineName}
                          onChange={(e) => setNewRecord({...newRecord, vaccineName: e.target.value})}
                        >
                          <option value="">اختر التطعيم</option>
                          {vaccines.map(vaccine => (
                            <option key={vaccine} value={vaccine}>{vaccine}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          الجرعة
                        </label>
                        <input
                          type="text"
                          className="input-field"
                          value={newRecord.dose}
                          onChange={(e) => setNewRecord({...newRecord, dose: e.target.value})}
                          placeholder="مثال: 0.5 مل"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        طريقة التطعيم
                      </label>
                      <select
                        className="input-field"
                        value={newRecord.method}
                        onChange={(e) => setNewRecord({...newRecord, method: e.target.value})}
                      >
                        <option value="">اختر الطريقة</option>
                        <option value="حقن">حقن</option>
                        <option value="شرب">شرب</option>
                        <option value="رش">رش</option>
                        <option value="حقن تحت الجلد">حقن تحت الجلد</option>
                      </select>
                    </div>
                  </>
                )}

                {newRecord.type === 'treatment' && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          الدواء *
                        </label>
                        <input
                          type="text"
                          className="input-field"
                          value={newRecord.medicine}
                          onChange={(e) => setNewRecord({...newRecord, medicine: e.target.value})}
                          placeholder="اسم الدواء"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          التشخيص *
                        </label>
                        <input
                          type="text"
                          className="input-field"
                          value={newRecord.diagnosis}
                          onChange={(e) => setNewRecord({...newRecord, diagnosis: e.target.value})}
                          placeholder="تشخيص الحالة"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          الجرعة
                        </label>
                        <input
                          type="text"
                          className="input-field"
                          value={newRecord.dosage}
                          onChange={(e) => setNewRecord({...newRecord, dosage: e.target.value})}
                          placeholder="مثال: 1 جم/لتر"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          المدة (أيام)
                        </label>
                        <input
                          type="number"
                          className="input-field"
                          value={newRecord.duration}
                          onChange={(e) => setNewRecord({...newRecord, duration: e.target.value})}
                          min="1"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          عدد النفوق
                        </label>
                        <input
                          type="number"
                          className="input-field"
                          value={newRecord.mortality}
                          onChange={(e) => setNewRecord({...newRecord, mortality: parseInt(e.target.value) || 0})}
                          min="0"
                        />
                      </div>
                    </div>
                  </>
                )}

                {newRecord.type === 'disease' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        التشخيص *
                      </label>
                      <input
                        type="text"
                        className="input-field"
                        value={newRecord.diagnosis}
                        onChange={(e) => setNewRecord({...newRecord, diagnosis: e.target.value})}
                        placeholder="تشخيص المرض"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        الأعراض *
                      </label>
                      <textarea
                        className="input-field h-24"
                        value={newRecord.symptoms}
                        onChange={(e) => setNewRecord({...newRecord, symptoms: e.target.value})}
                        placeholder="وصف الأعراض الظاهرة"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          عدد النفوق
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
                          العلاج المتبع
                        </label>
                        <input
                          type="text"
                          className="input-field"
                          value={newRecord.medicine}
                          onChange={(e) => setNewRecord({...newRecord, medicine: e.target.value})}
                          placeholder="العلاج المستخدم"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* ملاحظات عامة */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ملاحظات
                  </label>
                  <textarea
                    className="input-field h-32"
                    value={newRecord.notes}
                    onChange={(e) => setNewRecord({...newRecord, notes: e.target.value})}
                    placeholder="أي ملاحظات إضافية..."
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
                    disabled={!newRecord.cycleId || !newRecord.date || 
                      (newRecord.type === 'vaccination' && !newRecord.vaccineName) ||
                      (newRecord.type === 'treatment' && (!newRecord.medicine || !newRecord.diagnosis)) ||
                      (newRecord.type === 'disease' && (!newRecord.diagnosis || !newRecord.symptoms))}
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

export default HealthManagement
