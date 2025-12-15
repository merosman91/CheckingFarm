import React, { useState } from 'react';
import {
  FiCheckCircle, FiX, FiCoffee, FiShield, FiZap,
  FiDownload, FiGlobe, FiSmartphone, FiDatabase
} from 'react-icons/fi';
import { MdPoultry, MdCelebration, MdSecurity } from 'react-icons/md';

const WelcomeModal = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showTour, setShowTour] = useState(false);

  if (!isOpen) return null;

  const features = [
    {
      icon: <MdPoultry className="w-8 h-8" />,
      title: 'إدارة متكاملة للدواجن',
      description: 'إدارة كاملة لدورة حياة الدواجن من البداية حتى النهاية'
    },
    {
      icon: <FiDatabase className="w-8 h-8" />,
      title: 'سجلات تفصيلية',
      description: 'تسجيل ومتابعة كافة البيانات اليومية والإنتاجية'
    },
    {
      icon: <FiShield className="w-8 h-8" />,
      title: 'نظام صحي متكامل',
      description: 'متابعة الصحة والتحصينات والأدوية بشكل منظم'
    },
    {
      icon: <FiDownload className="w-8 h-8" />,
      title: 'نسخ احتياطي آمن',
      description: 'حماية بياناتك مع إمكانية الاستعادة في أي وقت'
    }
  ];

  const steps = [
    {
      title: 'مرحباً بك في دواجني!',
      content: 'نظام إدارة مزارع الدواجن المتكامل يساعدك على إدارة مزرعتك بكفاءة واحترافية.',
      image: '🐔'
    },
    {
      title: 'ابدأ بإضافة دورتك الأولى',
      content: 'قم بإضافة دورة إنتاج جديدة لتبدأ في تسجيل بيانات مزرعتك.',
      image: '📅'
    },
    {
      title: 'تتبع السجلات اليومية',
      content: 'سجل النفوق، الوزن، استهلاك العلف والماء يومياً لمتابعة أداء المزرعة.',
      image: '📝'
    },
    {
      title: 'استفد من التقارير',
      content: 'احصل على تقارير وتحليلات تفصيلية تساعدك في اتخاذ القرارات الصحيحة.',
      image: '📊'
    }
  ];

  const handleStartTour = () => {
    setShowTour(true);
    setCurrentStep(1);
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowTour(false);
      onClose();
    }
  };

  const handleSkip = () => {
    setShowTour(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* شريط العنوان */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white p-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <MdPoultry className="w-10 h-10 text-yellow-300 animate-pulse" />
              <div>
                <h2 className="text-2xl font-bold">دواجني</h2>
                <p className="text-primary-200">إدارة مزارع الدواجن اللاحم</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-yellow-300 transition-colors"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>
        </div>

        {showTour ? (
          /* جولة التعريف */
          <div className="p-8">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4 animate-bounce">
                {steps[currentStep - 1].image}
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                {steps[currentStep - 1].title}
              </h3>
              <p className="text-gray-600 text-lg">
                {steps[currentStep - 1].content}
              </p>
            </div>

            {/* مؤشر التقدم */}
            <div className="flex justify-center mb-8">
              <div className="flex gap-2">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full ${currentStep === index + 1 ? 'bg-primary-600' : 'bg-gray-300'}`}
                  />
                ))}
              </div>
            </div>

            {/* الأزرار */}
            <div className="flex justify-between">
              <button
                onClick={handleSkip}
                className="px-6 py-3 text-gray-600 hover:text-gray-800"
              >
                تخطي
              </button>
              
              <div className="flex gap-4">
                {currentStep > 1 && (
                  <button
                    onClick={() => setCurrentStep(currentStep - 1)}
                    className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    السابق
                  </button>
                )}
                
                <button
                  onClick={handleNext}
                  className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2"
                >
                  {currentStep === steps.length ? 'البدء' : 'التالي'}
                  {currentStep === steps.length && <MdCelebration />}
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* شاشة الترحيب الرئيسية */
          <div className="p-8">
            {/* رسالة الترحيب */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mb-4">
                <MdCelebration className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                تهانينا! تم تثبيت دواجني بنجاح
              </h3>
              <p className="text-gray-600">
                أنت الآن على وشك البدء في إدارة مزرعتك بشكل أكثر احترافية وكفاءة
              </p>
            </div>

            {/* الميزات */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="p-3 bg-white rounded-lg shadow-sm">
                    <div className="text-primary-600">
                      {feature.icon}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 mb-2">{feature.title}</h4>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* معلومات سريعة */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-8">
              <div className="flex items-center gap-3 mb-4">
                <FiZap className="w-6 h-6 text-blue-600" />
                <h4 className="font-bold text-gray-800">ابدأ سريعاً</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-3xl mb-2">📅</div>
                  <p className="text-sm text-gray-600">أضف دورة إنتاج</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-2">📝</div>
                  <p className="text-sm text-gray-600">سجل بيانات يومية</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-2">📊</div>
                  <p className="text-sm text-gray-600">تابع التقارير</p>
                </div>
              </div>
            </div>

            {/* تلميحات مفيدة */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 mb-8">
              <div className="flex items-center gap-3 mb-4">
                <FiCoffee className="w-6 h-6 text-green-600" />
                <h4 className="font-bold text-gray-800">نصائح للبدء</h4>
              </div>
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <FiCheckCircle className="text-green-500" />
                  <span className="text-sm text-gray-700">ابدأ بإضافة دورة إنتاج جديدة</span>
                </li>
                <li className="flex items-center gap-2">
                  <FiCheckCircle className="text-green-500" />
                  <span className="text-sm text-gray-700">قم بتسجيل السجل اليومي بانتظام</span>
                </li>
                <li className="flex items-center gap-2">
                  <FiCheckCircle className="text-green-500" />
                  <span className="text-sm text-gray-700">أنشئ نسخة احتياطية دورية</span>
                </li>
                <li className="flex items-center gap-2">
                  <FiCheckCircle className="text-green-500" />
                  <span className="text-sm text-gray-700">استخدم التقارير لمتابعة الأداء</span>
                </li>
              </ul>
            </div>

            {/* الأزرار */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleStartTour}
                className="px-8 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <FiGlobe className="w-5 h-5" />
                جولة تعريفية
              </button>
              
              <button
                onClick={onClose}
                className="px-8 py-3 border-2 border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 transition-all flex items-center justify-center gap-2"
              >
                <FiSmartphone className="w-5 h-5" />
                البدء الآن
              </button>
            </div>

            {/* تذييل */}
            <div className="text-center mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-center gap-2 text-gray-500 mb-2">
                <MdSecurity className="w-4 h-4" />
                <p className="text-sm">بياناتك محفوظة محلياً ولن يتم مشاركتها</p>
              </div>
              <p className="text-xs text-gray-400">
                للإبلاغ عن مشكلة أو اقتراح تحسين: support@douajny.com
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WelcomeModal;
