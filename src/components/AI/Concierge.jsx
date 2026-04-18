import React, { useState } from 'react';
import { Sparkles, X, MessageSquare, Send, Sparkle, Loader2 } from 'lucide-react';
import Button from '../ui/Button';

const AIConcierge = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Chào Phùng Hảo! I detected you might like spicy seafood tonight. Want me to summarize the best spots nearby?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    const newMsgs = [...messages, { role: 'user', text: input }];
    setMessages(newMsgs);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      setMessages([...newMsgs, { 
        role: 'assistant', 
        text: 'AI Summary: Quán Ốc Đào is famous for spicy snails but serving can be slow (avg 20m). Better try the "Nghêu hấp sả" first. Should I add it to your Night Owl itinerary?' 
      }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 lg:bottom-12 lg:right-12 z-[60] w-14 h-14 rounded-full bg-clay-black text-clay-white flex items-center justify-center shadow-2xl border-2 border-matcha-600 group overflow-hidden transition-transform active:scale-90 hover:scale-110"
      >
        <Sparkles size={24} className="relative z-10" />
        <div className="absolute inset-0 bg-gradient-to-tr from-matcha-600 to-slushie-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </button>

      {/* Backdrop */}
      <div 
        onClick={() => setIsOpen(false)}
        className={`fixed inset-0 z-[100] bg-clay-black/20 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      ></div>
      
      {/* Concierge Panel */}
      <div
        className={`fixed right-0 top-0 bottom-0 w-full max-w-md bg-warm-cream border-l border-oat-border shadow-2xl z-[110] flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="p-8 border-b border-oat-border bg-clay-black text-clay-white flex justify-between items-center relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Sparkle size={20} className="text-slushie-500" /> AI Concierge
            </h3>
            <p className="text-[10px] uppercase font-bold tracking-wide-label opacity-60">Personalized Assistant</p>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="relative z-10 p-2 hover:bg-clay-white/10 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
          <div className="absolute top-0 right-0 w-32 h-32 bg-matcha-600/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-6">
           {messages.map((m, i) => (
             <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                <div className={`max-w-[85%] p-4 rounded-feature text-sm leading-relaxed shadow-clay ${
                  m.role === 'user' 
                  ? 'bg-matcha-600 text-clay-white' 
                  : 'bg-clay-white border border-oat-border text-warm-charcoal'
                }`}>
                   {m.text}
                </div>
             </div>
           ))}
           {isTyping && (
             <div className="flex justify-start animate-fade-in">
               <div className="bg-clay-white border border-oat-border p-4 rounded-feature flex items-center gap-2 text-warm-silver text-sm">
                  <Loader2 size={16} className="animate-spin" /> AI is summarizing...
               </div>
             </div>
           )}
        </div>

        <div className="p-8 border-t border-oat-border bg-oat-light/30">
           <div className="relative">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about allergies, busy hours..."
                className="w-full bg-clay-white border border-oat-border rounded-pill py-3 pl-6 pr-14 text-sm focus:outline-none focus:border-matcha-600 shadow-inner"
              />
              <button 
                onClick={handleSend}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-clay-black text-clay-white flex items-center justify-center hover:bg-matcha-600 transition-colors"
              >
                <Send size={18} />
              </button>
           </div>
           <div className="mt-4 flex flex-wrap gap-2">
              {['Summarize Oanh Street', 'What is Spicy?', 'Quickest route'].map(hint => (
                <button 
                  key={hint}
                  onClick={() => setInput(hint)}
                  className="text-[9px] font-bold uppercase tracking-wide-label px-2 py-1 rounded-badge bg-clay-white border border-oat-border hover:border-matcha-600 transition-all active:scale-95"
                >
                  {hint}
                </button>
              ))}
           </div>
        </div>
      </div>
    </>
  );
};

export default AIConcierge;

