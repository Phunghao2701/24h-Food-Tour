import React, { useState } from 'react';
import { Users, Wallet, Navigation, Utensils, Coffee, Sparkles, ChevronRight, ChevronLeft } from 'lucide-react';

const STEPS = [
  {
    id: 'people',
    title: 'Đi bao nhiêu người?',
    options: [
      { label: '1 người', value: 1, icon: <Users size={24} /> },
      { label: '2 người', value: 2, icon: <Users size={24} /> },
      { label: '4 người', value: 4, icon: <Users size={24} /> },
      { label: '6+ người', value: 8, icon: <Users size={32} /> },
    ]
  },
  {
    id: 'budget',
    title: 'Kinh phí thế nào?',
    options: [
      { label: 'Tiết kiệm', value: '$', icon: <Wallet size={24} className="text-matcha-600" /> },
      { label: 'Tầm trung', value: '$$', icon: <Wallet size={24} className="text-orange-500" /> },
      { label: 'Sang chảnh', value: '$$$', icon: <Wallet size={24} className="text-pomegranate-500" /> },
    ]
  },
  {
    id: 'distance',
    title: 'Khoảng cách bao xa?',
    options: [
      { label: 'Gần xịt (<2km)', value: 2, icon: <Navigation size={24} /> },
      { label: 'Vừa tầm (<5km)', value: 5, icon: <Navigation size={24} /> },
      { label: 'Xa cũng ổn (<10km)', value: 10, icon: <Navigation size={24} /> },
    ]
  },
  {
    id: 'kind',
    title: 'Bạn thèm món gì?',
    options: [
      { label: 'Ăn no', value: 'Đồ ăn', icon: <Utensils size={24} /> },
      { label: 'Cà phê/Nước', value: 'Nước uống', icon: <Coffee size={24} /> },
      { label: 'Gì cũng được', value: 'All', icon: <Sparkles size={24} /> },
    ]
  }
];

const HungryQuiz = ({ onFinish }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState({});

  const handleSelect = (value) => {
    const newSelections = { ...selections, [STEPS[currentStep].id]: value };
    setSelections(newSelections);

    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onFinish(newSelections);
    }
  };

  const step = STEPS[currentStep];

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Progress */}
      <div className="flex gap-2 mb-12">
        {STEPS.map((_, idx) => (
          <div 
            key={idx} 
            className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
              idx <= currentStep ? 'bg-matcha-600' : 'bg-oat-border/30'
            }`}
          />
        ))}
      </div>

      {/* Question */}
      <div className="text-center mb-12 animate-slide-up">
        <h2 className="text-4xl font-bold text-clay-black mb-4 tracking-tight">
          {step.title}
        </h2>
        <p className="text-warm-silver font-medium italic">
          Bước {currentStep + 1} / {STEPS.length}
        </p>
      </div>

      {/* Options */}
      <div className="grid grid-cols-2 gap-4 animate-fade-in">
        {step.options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => handleSelect(opt.value)}
            className="flex flex-col items-center justify-center p-8 bg-white border-2 border-slate-100 rounded-[32px] shadow-sm hover:border-matcha-600 hover:bg-matcha-50 hover-clay-jump transition-all group"
          >
            <div className="p-4 rounded-2xl bg-slate-50 group-hover:bg-white text-slate-400 group-hover:text-matcha-600 mb-4 transition-colors">
              {opt.icon}
            </div>
            <span className="font-bold text-lg text-clay-black group-hover:text-matcha-700">
              {opt.label}
            </span>
          </button>
        ))}
      </div>

      {/* Back Button */}
      {currentStep > 0 && (
        <button 
          onClick={() => setCurrentStep(currentStep - 1)}
          className="mt-12 flex items-center gap-2 mx-auto text-warm-silver hover:text-clay-black font-bold transition-colors"
        >
          <ChevronLeft size={20} /> Quay lại
        </button>
      )}
    </div>
  );
};

export default HungryQuiz;
