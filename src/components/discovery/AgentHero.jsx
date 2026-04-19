import React, { useState } from 'react';
import { Sparkles, Bot, ArrowRight, RefreshCw, Users, Wallet, Navigation, Utensils, Coffee, ChevronRight, MapPin } from 'lucide-react';
import { useConcierge } from '../../context/ConciergeContext';

const STEPS = [
  {
    id: 'partySize',
    question: 'Đi bao nhiêu người để tui chuẩn bị chỗ nào?',
    options: [
      { label: 'Đi mình tui', value: 1, icon: <Users size={18} /> },
      { label: 'Cặp đôi', value: 2, icon: <Users size={18} /> },
      { label: 'Nhóm 4 người', value: 4, icon: <Users size={18} /> },
      { label: 'Hội nhóm 6+', value: 8, icon: <Users size={22} /> },
    ]
  },
  {
    id: 'budget',
    question: 'Kinh phí hôm nay "rủng rỉnh" không?',
    options: [
      { label: 'Tiết kiệm', value: '$', icon: <Wallet size={18} /> },
      { label: 'Vừa túi tiền', value: '$$', icon: <Wallet size={18} /> },
      { label: 'Sang chảnh luôn', value: '$$$', icon: <Wallet size={18} /> },
    ]
  },
  {
    id: 'radiusKm',
    question: 'Bạn muốn ăn gần đây hay đi xa xíu?',
    options: [
      { label: 'Sát bên (<2km)', value: 2, icon: <Navigation size={18} /> },
      { label: 'Quanh đây (<5km)', value: 5, icon: <Navigation size={18} /> },
      { label: 'Chỗ nào ngon là đi (<10km)', value: 10, icon: <Navigation size={18} /> },
    ]
  },
  {
    id: 'venueKind',
    question: 'Ưu tiên ăn no hay đi uống nước nhẹ nhàng?',
    options: [
      { label: 'Phải ăn cho no', value: 'Đồ ăn', icon: <Utensils size={18} /> },
      { label: 'Cà phê cà pháo', value: 'Nước uống', icon: <Coffee size={18} /> },
      { label: 'Gì cũng được', value: 'All', icon: <Sparkles size={18} /> },
    ]
  }
];

const AgentHero = ({ onFinish }) => {
  const { updateSearchProfile, resetSearchProfile } = useConcierge();
  const [stepIndex, setStepIndex] = useState(-1); // -1 is intro
  const [selections, setSelections] = useState({});
  const [isTyping, setIsTyping] = useState(false);

  const startQuiz = () => {
    setIsTyping(true);
    resetSearchProfile();
    setTimeout(() => {
      setIsTyping(false);
      setStepIndex(0);
    }, 600);
  };

  const handleSelect = (value) => {
    if (isTyping) return;

    const stepId = STEPS[stepIndex].id;
    const nextSelections = { ...selections, [stepId]: value };
    setSelections(nextSelections);

    // Sync with global concierge context
    updateSearchProfile({ [stepId]: value });

    if (stepIndex < STEPS.length - 1) {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setStepIndex(stepIndex + 1);
      }, 500);
    } else {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        onFinish(nextSelections);
      }, 800);
    }
  };

  const currentStep = STEPS[stepIndex];

  return (
    <div className="w-full max-w-3xl mx-auto py-12 px-6">
      <div className="relative bg-white rounded-[48px] p-10 shadow-clay border border-slate-100 overflow-hidden min-h-[500px] flex flex-col">
        {/* Background Sparkles */}
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Sparkles size={120} className="text-orange-500" />
        </div>

        {/* Chú Ổi Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-slate-800 rounded-3xl flex items-center justify-center text-white shadow-lg relative overflow-hidden group">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Cucumber" alt="Chú Ổi" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            <div className={`absolute inset-0 bg-orange-500/20 transition-opacity ${isTyping ? 'opacity-100 animate-pulse' : 'opacity-0 group-hover:opacity-100'}`} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-2xl tracking-tight text-slate-800">Chú Ổi</span>
              <span className="px-2 py-0.5 bg-orange-100 text-orange-600 text-[9px] font-bold uppercase tracking-widest rounded-full">Agent Đẹp Trai</span>
            </div>
            <p className="text-slate-400 text-sm font-medium italic">"Gợi ý thực dụng, không lòng vòng"</p>
          </div>
        </div>

        {/* Interaction Area */}
        <div className="flex-1 flex flex-col justify-center">
          {stepIndex === -1 ? (
            <div className="animate-slide-up">
              <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6 leading-tight">
                Chào bạn, tui là Chú Ổi.<br/>
                <span className="text-orange-500 underline decoration-orange-200 decoration-4 underline-offset-8 italic">Đang đói bụng</span> mà chưa biết ăn gì hả?
              </h1>
              <p className="text-slate-500 text-lg mb-10 max-w-xl leading-relaxed">
                Để tui giúp bạn chốt phương án nhanh gọn lẹ. Trả lời tui 4 câu hỏi "chân tình" này nhé!
              </p>
              <button 
                onClick={startQuiz}
                className="group px-10 py-5 bg-slate-800 text-white rounded-[24px] font-bold text-xl shadow-clay hover-clay-jump transition-all flex items-center gap-3 overflow-hidden relative"
              >
                <span className="relative z-10">Bắt đầu ngay Chú Ổi ơi!</span>
                <ChevronRight size={24} className="relative z-10 transition-transform group-hover:translate-x-1" />
                <div className="absolute inset-0 bg-orange-500 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              </button>
            </div>
          ) : isTyping ? (
            <div className="flex flex-col items-center gap-4 py-8 animate-fade-in">
               <div className="flex gap-2">
                 <div className="w-2.5 h-2.5 bg-orange-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                 <div className="w-2.5 h-2.5 bg-orange-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                 <div className="w-2.5 h-2.5 bg-orange-500 rounded-full animate-bounce"></div>
               </div>
               <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">Chú Ổi đang lục tìm quán ngon...</p>
            </div>
          ) : (
            <div className="animate-fade-in flex flex-col h-full">
              <div className="mb-10">
                 <div className="flex items-center gap-4 mb-4">
                    <div className="flex gap-1">
                      {STEPS.map((_, i) => (
                        <div key={i} className={`h-1 rounded-full transition-all duration-500 ${i <= stepIndex ? 'w-8 bg-orange-500' : 'w-4 bg-slate-100'}`} />
                      ))}
                    </div>
                    <span className="text-slate-300 text-[10px] font-black uppercase tracking-widest">{Math.round(((stepIndex + 1) / 4) * 100)}% Complete</span>
                 </div>
                 <h2 className="text-3xl font-bold text-slate-800 tracking-tight leading-snug max-w-xl">
                   {currentStep.question}
                 </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentStep.options.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleSelect(opt.value)}
                    disabled={isTyping}
                    className="flex items-center gap-4 p-6 bg-slate-50 border-2 border-transparent rounded-[28px] hover:border-orange-500 hover:bg-orange-50 hover-clay-jump transition-all group text-left disabled:opacity-50 disabled:pointer-events-none"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-slate-400 group-hover:text-orange-500 transition-colors">
                      {opt.icon}
                    </div>
                    <span className="font-bold text-lg text-slate-700 group-hover:text-slate-900">
                      {opt.label}
                    </span>
                  </button>
                ))}
              </div>

              <div className="mt-auto pt-10">
                <button 
                  onClick={() => setStepIndex(stepIndex - 1)}
                  disabled={isTyping}
                  className="flex items-center gap-2 text-slate-300 hover:text-orange-500 text-sm font-bold transition-all disabled:opacity-0"
                >
                  <ArrowRight size={18} className="rotate-180" /> Quay lại
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Trust Pills */}
      <div className="mt-8 flex flex-wrap justify-center gap-4 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
         <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-slate-200 text-xs font-bold text-slate-500">
           <RefreshCw size={14} /> Dữ liệu thời gian thực
         </div>
         <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-slate-200 text-xs font-bold text-slate-500">
           <MapPin size={14} /> Chính xác vị trí
         </div>
         <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-slate-200 text-xs font-bold text-slate-500">
           <Sparkles size={14} /> AI Chú Ổi chọn lọc
         </div>
      </div>
    </div>
  );
};

export default AgentHero;
