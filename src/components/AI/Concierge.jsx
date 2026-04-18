import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, X, Sparkle, MapPin, Send, RefreshCw, Bot } from 'lucide-react';
import { useConcierge } from '../../context/ConciergeContext';
import { initGemini, sendMessage, resetChat } from '../../services/gemini';
import { useLocation } from 'react-router-dom';

// --- Constants ---
const USER_LOC = [10.8411, 106.8100]; // FPT University default
const LOCATION_LABEL = 'Quận 9 (FPTU)';

const QUICK_REPLIES = [
  { label: '🍜 Muốn ăn no', text: 'Tôi đang đói và muốn ăn một bữa no, gợi ý chỗ nào ngon gần đây không?' },
  { label: '☕ Ngồi cafe code', text: 'Tôi muốn tìm quán cafe để ngồi làm việc / học bài, có wifi ổn, mở muộn.' },
  { label: '🌙 Đang đêm khuya', text: 'Đang đêm khuya rồi, có chỗ nào còn mở không?' },
  { label: '💸 Ví hẹp', text: 'Tôi cần chỗ ăn ngon mà giá rẻ, sinh viên thôi.' },
  { label: '🔥 Điểm ẩn nào hay?', text: 'Có quán nào là hidden gem, ít người biết nhưng ngon không?' },
];

// --- Sub-components ---
const TypingDots = () => (
  <div className="flex gap-1 items-center px-4 py-3">
    <div className="w-2 h-2 bg-warm-silver rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
    <div className="w-2 h-2 bg-warm-silver rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
    <div className="w-2 h-2 bg-warm-silver rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
  </div>
);

const ChatBubble = ({ msg }) => {
  const isBot = msg.role === 'bot';
  return (
    <div className={`flex gap-3 ${isBot ? '' : 'flex-row-reverse'} animate-fade-in`}>
      {isBot && (
        <div className="w-8 h-8 rounded-full bg-clay-black flex-shrink-0 flex items-center justify-center mt-1">
          <Bot size={16} className="text-slushie-500" />
        </div>
      )}
      <div
        className={`max-w-[80%] px-4 py-3 rounded-feature text-sm leading-relaxed whitespace-pre-wrap ${
          isBot
            ? 'bg-clay-white border border-oat-border text-warm-charcoal rounded-tl-none shadow-sm'
            : 'bg-clay-black text-clay-white rounded-tr-none'
        }`}
      >
        {msg.text}
      </div>
    </div>
  );
};

// --- Main Component ---
const AIConcierge = () => {
  const { startConsultation, endConsultation } = useConcierge();
  const routerLocation = useLocation();

  const [isOpen, setIsOpen] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [error, setError] = useState(null);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Auto-open on /map page
  useEffect(() => {
    if (routerLocation.pathname === '/map' && !isOpen) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        startConsultation();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [routerLocation.pathname]);

  // Initialize Gemini when panel opens
  useEffect(() => {
    if (!isOpen || isReady) return;

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    try {
      initGemini(USER_LOC, timeStr, LOCATION_LABEL);
      setIsReady(true);
      setError(null);

      // Proactive greeting as first bot message
      const hour = now.getHours();
      let greeting = '';
      if (hour >= 5 && hour < 11) greeting = `🌅 Chào buổi sáng! Mình là Chú Ổi — trợ lý ẩm thực 24h của bạn. Bạn đang ở gần **${LOCATION_LABEL}**. Sáng nay muốn ăn gì?`;
      else if (hour >= 11 && hour < 14) greeting = `☀️ Chào buổi trưa! Mình là Chú Ổi. Đang ở **${LOCATION_LABEL}** rồi, trưa nay ăn gì ngon nào?`;
      else if (hour >= 14 && hour < 19) greeting = `⛅ Chào buổi chiều! Mình là Chú Ổi. Bạn đang ở gần **${LOCATION_LABEL}** — chiều mát rồi, muốn ăn vặt hay ngồi cafe?`;
      else if (hour >= 19 && hour < 22) greeting = `🌆 Chào buổi tối! Mình là Chú Ổi. Tối nay ở **${LOCATION_LABEL}** muốn ăn gì? Tối nay mình có vài gợi ý xịn đây!`;
      else greeting = `🌙 Chào đêm khuya! Mình là Chú Ổi. ${hour >= 0 && hour < 4 ? 'Thức khuya như này' : 'Đêm muộn rồi'} mà vẫn đói hả? Ở **${LOCATION_LABEL}** vẫn còn chỗ đấy!`;

      setMessages([{ role: 'bot', text: greeting }]);
    } catch (e) {
      setError(e.message);
    }
  }, [isOpen]);

  const handleSend = async (text) => {
    const messageText = text || input.trim();
    if (!messageText || isTyping || !isReady) return;

    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: messageText }]);
    setIsTyping(true);

    try {
      const response = await sendMessage(messageText);
      setMessages(prev => [...prev, { role: 'bot', text: response }]);
    } catch (e) {
      console.error('[Concierge] Chat error:', e);
      setMessages(prev => [...prev, {
        role: 'bot',
        text: `😓 Có lỗi xảy ra: ${e.message}\n\nNhấn 🔄 để thử lại hoặc reload trang.`
      }]);
    } finally {
      setIsTyping(false);
      inputRef.current?.focus();
    }
  };

  const handleReset = () => {
    resetChat();
    setIsReady(false);
    setMessages([]);
    setError(null);
    // Re-trigger init
    setTimeout(() => setIsOpen(prev => { return prev; }), 100);
  };

  const handleClose = () => {
    setIsOpen(false);
    endConsultation();
  };

  const handleOpen = () => {
    setIsOpen(true);
    startConsultation();
  };

  return (
    <>
      {/* FAB Button */}
      <div className="fixed bottom-6 right-6 lg:bottom-12 lg:right-12 z-[60] flex flex-col items-end gap-3">
        {!isOpen && (
          <div className="bg-clay-white border-2 border-clay-black px-4 py-2 rounded-card shadow-clay text-[10px] font-bold uppercase tracking-widest animate-fade-in">
            Đói chưa? Hỏi mình đi! 🍜
          </div>
        )}
        <button
          onClick={handleOpen}
          className={`w-14 h-14 rounded-full bg-clay-black text-clay-white flex items-center justify-center shadow-2xl border-2 border-matcha-600 group overflow-hidden transition-transform active:scale-90 hover:scale-110 ${!isOpen ? 'animate-pulse-soft' : ''}`}
        >
          <Sparkles size={24} className="relative z-10" />
          <div className="absolute inset-0 bg-gradient-to-tr from-matcha-600 to-slushie-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </button>
      </div>

      {/* Backdrop */}
      <div
        onClick={handleClose}
        className={`fixed inset-0 z-[100] bg-clay-black/20 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      />

      {/* Chat Panel */}
      <div
        className={`fixed right-0 top-0 bottom-0 w-full max-w-md bg-warm-cream border-l border-oat-border shadow-2xl z-[110] flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="p-6 border-b border-oat-border bg-clay-black text-clay-white flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Sparkle size={18} className="text-slushie-500" /> Chú Ổi 🌶️
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <MapPin size={10} className="text-matcha-400" />
              <span className="text-[10px] uppercase font-bold tracking-wide-label opacity-70">
                {LOCATION_LABEL}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-matcha-400 animate-pulse" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              title="Bắt đầu lại"
              className="p-2 hover:bg-clay-white/10 rounded-full transition-colors"
            >
              <RefreshCw size={16} />
            </button>
            <button onClick={handleClose} className="p-2 hover:bg-clay-white/10 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="p-4 bg-pomegranate-50 border-b border-pomegranate-200 text-xs text-pomegranate-800 font-bold">
            ⚠️ {error}
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg, i) => (
            <ChatBubble key={i} msg={msg} />
          ))}
          {isTyping && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-clay-black flex-shrink-0 flex items-center justify-center">
                <Bot size={16} className="text-slushie-500" />
              </div>
              <div className="bg-clay-white border border-oat-border rounded-feature rounded-tl-none shadow-sm">
                <TypingDots />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Replies */}
        {messages.length <= 1 && !isTyping && isReady && (
          <div className="px-4 pb-3 flex gap-2 overflow-x-auto no-scrollbar">
            {QUICK_REPLIES.map((qr) => (
              <button
                key={qr.label}
                onClick={() => handleSend(qr.text)}
                className="flex-shrink-0 px-3 py-1.5 bg-clay-white border border-oat-border rounded-pill text-[11px] font-bold text-warm-charcoal hover:bg-clay-black hover:text-clay-white hover:border-clay-black transition-all"
              >
                {qr.label}
              </button>
            ))}
          </div>
        )}

        {/* Input Area */}
        <div className="p-4 border-t border-oat-border bg-clay-white">
          <div className="flex gap-3 items-end">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Hỏi Chú Ổi bất cứ điều gì..."
              rows={1}
              disabled={!isReady || isTyping}
              className="flex-1 resize-none bg-oat-light border border-oat-border rounded-card py-2.5 px-4 text-sm focus:outline-none focus:border-matcha-600 disabled:opacity-50 transition-colors max-h-28"
              style={{ lineHeight: '1.5' }}
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || !isReady || isTyping}
              className="w-10 h-10 rounded-full bg-clay-black text-clay-white flex items-center justify-center flex-shrink-0 disabled:opacity-40 hover:bg-matcha-700 transition-colors active:scale-90"
            >
              <Send size={16} />
            </button>
          </div>
          <p className="text-[9px] text-warm-silver text-center mt-2 uppercase tracking-widest font-bold">
            Powered by Gemini AI · 24h Food Intelligence
          </p>
        </div>
      </div>
    </>
  );
};

export default AIConcierge;
