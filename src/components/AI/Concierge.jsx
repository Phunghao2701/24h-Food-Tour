import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Bot, MapPin, RefreshCw, Send, Sparkle, Sparkles, X } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useConcierge } from '../../context/ConciergeContext';
import { initGemini, resetChat, sendMessage, updateGeminiContext } from '../../services/gemini';

const DEFAULT_USER_LOC = [10.8411, 106.81];
const DEFAULT_LOCATION_LABEL = 'Vị trí tạm thời';

const QUICK_REPLIES = [
  { label: 'Ăn no', text: 'Mình đang đói và muốn một bữa no.' },
  { label: 'Cafe học bài', text: 'Mình muốn tìm quán cafe để ngồi lâu, wifi ổn.' },
  { label: 'Đêm muộn', text: 'Giờ này còn quán nào mở khuya không?' },
];

const BUDGET_OPTIONS = [
  { label: 'Tiết kiệm', value: '$', helper: 'Khoảng 25.000đ - 90.000đ/người' },
  { label: 'Tầm trung', value: '$$', helper: 'Khoảng 70.000đ - 180.000đ/người' },
  { label: 'Linh hoạt', value: 'All', helper: 'Có thể co giãn theo quán hợp lý' },
];

const QUESTION_STEPS = [
  {
    key: 'radiusKm',
    question: 'Bạn muốn mình tìm trong bán kính nào?',
    options: [
      { label: '3 km', value: 3, message: 'Tìm trong bán kính 3km nhé.' },
      { label: '5 km', value: 5, message: 'Tìm trong bán kính 5km nhé.' },
      { label: '10 km', value: 10, message: 'Tìm trong bán kính 10km nhé.' },
    ],
  },
  {
    key: 'partySize',
    question: 'Mình đi bao nhiêu người?',
    options: [
      { label: '1 người', value: 1, message: 'Đi 1 người.' },
      { label: '2 người', value: 2, message: 'Đi 2 người.' },
      { label: '4 người', value: 4, message: 'Đi 4 người.' },
      { label: '6+ người', value: 6, message: 'Đi nhóm 6 người trở lên.' },
    ],
  },
  {
    key: 'budget',
    question: 'Ngân sách của bạn khoảng bao nhiêu?',
    options: BUDGET_OPTIONS.map((option) => ({
      label: option.label,
      value: option.value,
      helper: option.helper,
      message: `${option.label} nhé.`,
      extraPatch: { budgetLabel: option.helper },
    })),
  },
  {
    key: 'venueKind',
    question: 'Bạn đang ưu tiên đồ ăn hay nước uống?',
    options: [
      { label: 'Đồ ăn', value: 'Đồ ăn', message: 'Ưu tiên đồ ăn nhé.' },
      { label: 'Nước uống', value: 'Nước uống', message: 'Ưu tiên nước uống nhé.' },
      { label: 'Cả hai', value: 'All', message: 'Đồ ăn hay nước uống đều được.' },
    ],
  },
  {
    key: 'servingStyle',
    question: 'Bạn thích món nước hay món khô hơn?',
    options: [
      { label: 'Món nước', value: 'Món nước', message: 'Mình nghiêng về món nước.' },
      { label: 'Món khô', value: 'Món khô', message: 'Mình nghiêng về món khô.' },
      { label: 'Linh hoạt', value: 'All', message: 'Món nước hay món khô đều ổn.' },
    ],
  },
];

const getCurrentTimeLabel = () => {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
};

const detectWeatherMode = (temperatureC, weatherCode) => {
  if (temperatureC >= 33) return 'hot';
  if ([61, 63, 65, 80, 81, 82, 95].includes(weatherCode)) return 'rainy';
  return 'neutral';
};

const getWeatherLabel = (temperatureC, weatherMode) => {
  if (weatherMode === 'hot') return `Trời đang nóng, khoảng ${Math.round(temperatureC)}°C`;
  if (weatherMode === 'rainy') return 'Trời có mưa, nên ưu tiên chỗ ngồi trong nhà';
  return temperatureC ? `Thời tiết khá ổn, khoảng ${Math.round(temperatureC)}°C` : 'Chưa có dữ liệu thời tiết';
};

const getNextQuestion = (searchProfile) =>
  QUESTION_STEPS.find((step) => searchProfile[step.key] == null) || null;

const TypingDots = () => (
  <div className="flex items-center gap-1 px-4 py-3">
    <div className="h-2 w-2 animate-bounce rounded-full bg-warm-silver" style={{ animationDelay: '0ms' }} />
    <div className="h-2 w-2 animate-bounce rounded-full bg-warm-silver" style={{ animationDelay: '150ms' }} />
    <div className="h-2 w-2 animate-bounce rounded-full bg-warm-silver" style={{ animationDelay: '300ms' }} />
  </div>
);

const ChatBubble = ({ msg }) => {
  const isBot = msg.role === 'bot';

  return (
    <div className={`flex gap-3 ${isBot ? '' : 'flex-row-reverse'} animate-fade-in`}>
      {isBot && (
        <div className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-clay-black">
          <Bot size={16} className="text-slushie-500" />
        </div>
      )}
      <div
        className={`max-w-[80%] rounded-feature px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
          isBot
            ? 'rounded-tl-none border border-oat-border bg-clay-white text-warm-charcoal shadow-sm'
            : 'rounded-tr-none bg-clay-black text-clay-white'
        }`}
      >
        {msg.text}
        {msg.mapHint && (
          <div className="mt-3 rounded-card border border-matcha-300 bg-matcha-50 px-3 py-2 text-[11px] font-bold text-matcha-900">
            {msg.mapHint}
          </div>
        )}
      </div>
    </div>
  );
};

const AIConcierge = () => {
  const {
    botDraft,
    clearMapFocus,
    endConsultation,
    resetSearchProfile,
    searchProfile,
    seedProactivePlan,
    startConsultation,
    syncBotResponse,
    updateSearchProfile,
  } = useConcierge();
  const routerLocation = useLocation();

  const [isOpen, setIsOpen] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [error, setError] = useState(null);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const nextQuestion = useMemo(() => getNextQuestion(searchProfile), [searchProfile]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    if (routerLocation.pathname === '/map' && !isOpen) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        startConsultation();
      }, 1500);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [isOpen, routerLocation.pathname, startConsultation]);

  const syncLiveContext = useCallback(async () => {
    const timeStr = getCurrentTimeLabel();
    let profilePatch = {};

    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 8000,
            maximumAge: 300000,
          });
        });

        profilePatch = {
          ...profilePatch,
          userLoc: [position.coords.latitude, position.coords.longitude],
          locationLabel: 'Vị trí hiện tại của bạn',
          locationReady: true,
        };

        try {
          const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&current=temperature_2m,weather_code`
          );
          const weatherJson = await weatherResponse.json();
          const temperatureC = weatherJson?.current?.temperature_2m;
          const weatherCode = weatherJson?.current?.weather_code;
          const weatherMode = detectWeatherMode(temperatureC, weatherCode);

          profilePatch = {
            ...profilePatch,
            temperatureC,
            weatherMode,
            weatherLabel: getWeatherLabel(temperatureC, weatherMode),
          };
        } catch (weatherError) {
          console.warn('[Concierge] Weather lookup failed', weatherError);
        }
      } catch (locationError) {
        console.warn('[Concierge] Location lookup failed', locationError);
        profilePatch = {
          ...profilePatch,
          userLoc: DEFAULT_USER_LOC,
          locationLabel: DEFAULT_LOCATION_LABEL,
          locationReady: false,
        };
      }
    }

    updateSearchProfile(profilePatch);
    initGemini(
      profilePatch.userLoc || searchProfile.userLoc || DEFAULT_USER_LOC,
      timeStr,
      profilePatch.locationLabel || searchProfile.locationLabel || DEFAULT_LOCATION_LABEL,
      {
        ...searchProfile,
        ...profilePatch,
      }
    );

    return { profilePatch, timeStr };
  }, [searchProfile, updateSearchProfile]);

  const buildRecommendationMessage = (plan, timeStr, profile) => {
    const budgetLine = profile.budgetLabel || 'Ngân sách linh hoạt';
    const venueKindLine = profile.venueKind === 'All' ? 'cả đồ ăn lẫn nước uống' : profile.venueKind.toLowerCase();
    const servingLine = profile.servingStyle === 'All' ? 'món nước hay món khô đều được' : profile.servingStyle.toLowerCase();

    if (!plan?.primaryVenue) {
      return {
        text: `Mình đã check trong bán kính ${profile.radiusKm}km lúc ${timeStr}, nhưng chưa có quán nào trong data khớp với nhu cầu ${venueKindLine} và ${servingLine}. Nếu muốn, mình sẽ nới bán kính hoặc chuyển sang quận khác như Gò Vấp để tìm tiếp.`,
        mapHint: 'Map tạm thời chưa có điểm nào khớp bộ lọc hiện tại.',
      };
    }

    const weatherHint =
      profile.weatherMode === 'hot'
        ? 'Trời đang nóng nên mình ưu tiên chỗ dễ ngồi lâu, có cảm giác mát và đỡ bí.'
        : profile.weatherMode === 'rainy'
          ? 'Trời đang mưa nên mình ưu tiên chỗ ngồi trong nhà và vào quán dễ.'
          : 'Thời tiết đang ổn nên mình ưu tiên quán gần và dễ ghé nhất.';

    return {
      text: `Chốt nhanh nhé: với bán kính ${profile.radiusKm}km, nhóm ${profile.partySize} người, ngân sách ${budgetLine}, ưu tiên ${venueKindLine} và ${servingLine}, mình đang đẩy ${plan.primaryVenue.name} lên đầu. ${weatherHint} ${plan.followUp}`,
      mapHint: `Map đang focus ${plan.venues.map((venue) => venue.name).join(', ')}.`,
    };
  };

  useEffect(() => {
    if (!isOpen || isReady) return;

    const init = async () => {
      try {
        const { profilePatch } = await syncLiveContext();
        setIsReady(true);
        setError(null);

        const intro = [
          profilePatch.locationReady
            ? 'Mình đã lấy được vị trí hiện tại của bạn rồi, nên sẽ không còn tự nhận sai sang Quận 9 nữa.'
            : 'Mình chưa lấy được vị trí thật, nên đang dùng vị trí tạm thời và sẽ không khẳng định sai khu vực.',
          profilePatch.weatherLabel || searchProfile.weatherLabel,
          'Để gợi ý thực dụng hơn, mình sẽ hỏi nhanh bán kính, số người, ngân sách, đồ ăn hay nước uống, rồi tới món nước hay món khô.',
        ].join(' ');

        setMessages([{ role: 'bot', text: intro }]);
      } catch (e) {
        setError(e.message);
      }
    };

    init();
  }, [isOpen, isReady, searchProfile.weatherLabel, syncLiveContext]);

  useEffect(() => {
    updateGeminiContext({
      profile: searchProfile,
      locationLabel: searchProfile.locationLabel,
      userLoc: searchProfile.userLoc,
    });
  }, [searchProfile]);

  const handleProfileChoice = (step, option) => {
    const patch = { [step.key]: option.value, ...(option.extraPatch || {}) };
    const nextProfile = { ...searchProfile, ...patch };

    updateSearchProfile(patch);
    updateGeminiContext({ profile: patch });
    setMessages((prev) => [...prev, { role: 'user', text: option.message }]);

    const upcomingQuestion = getNextQuestion(nextProfile);
    if (upcomingQuestion) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'bot',
          text: upcomingQuestion.question,
        },
      ]);
      return;
    }

    const timeStr = getCurrentTimeLabel();
    const proactivePlan = seedProactivePlan({
      timeStr,
      budget: nextProfile.budget,
      partySize: nextProfile.partySize,
      radiusKm: nextProfile.radiusKm,
      userLoc: nextProfile.userLoc,
      weatherMode: nextProfile.weatherMode,
    });
    const recommendation = buildRecommendationMessage(proactivePlan, timeStr, nextProfile);
    setMessages((prev) => [...prev, { role: 'bot', ...recommendation }]);
  };

  const handleSend = async (text) => {
    const messageText = text || input.trim();
    if (!messageText || isTyping || !isReady) return;

    setInput('');
    setMessages((prev) => [...prev, { role: 'user', text: messageText }]);

    if (nextQuestion) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'bot',
          text: `${nextQuestion.question} Mình hỏi đoạn này để khỏi gợi ý lan man và sát nhu cầu hơn.`,
        },
      ]);
      return;
    }

    setIsTyping(true);

    try {
      const response = await sendMessage(messageText);
      const mentionedVenues = syncBotResponse(response);
      const mapHint = mentionedVenues.length
        ? `Mình đã đồng bộ bản đồ tới ${mentionedVenues[0].name}${mentionedVenues.length > 1 ? ` và thêm ${mentionedVenues.length - 1} điểm liên quan` : ''}.`
        : 'Nếu thấy hợp, mình sẽ tiếp tục focus quán này trên map cho bạn.';

      setMessages((prev) => [...prev, { role: 'bot', text: response, mapHint }]);
    } catch (e) {
      console.error('[Concierge] Chat error:', e);
      setMessages((prev) => [
        ...prev,
        {
          role: 'bot',
          text: `Có lỗi xảy ra: ${e.message}\n\nNhấn nút làm mới để thử lại hoặc reload trang nhé.`,
        },
      ]);
    } finally {
      setIsTyping(false);
      inputRef.current?.focus();
    }
  };

  const handleReset = () => {
    resetChat();
    resetSearchProfile();
    setIsReady(false);
    setMessages([]);
    setError(null);
    clearMapFocus();
    setTimeout(() => setIsOpen((prev) => prev), 100);
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
      <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end gap-3 lg:bottom-12 lg:right-12">
        {!isOpen && (
          <div className="animate-fade-in rounded-card border-2 border-clay-black bg-clay-white px-4 py-2 text-[10px] font-bold uppercase tracking-widest shadow-clay">
            Hỏi Chú Ổi để chốt quán nhanh
          </div>
        )}
        <button
          onClick={handleOpen}
          className={`group relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border-2 border-matcha-600 bg-clay-black text-clay-white shadow-2xl transition-transform hover:scale-110 active:scale-90 ${!isOpen ? 'animate-pulse-soft' : ''}`}
        >
          <Sparkles size={24} className="relative z-10" />
          <div className="absolute inset-0 bg-gradient-to-tr from-matcha-600 to-slushie-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </button>
      </div>

      <div
        onClick={handleClose}
        className={`fixed inset-0 z-[100] bg-clay-black/20 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
      />

      <div
        className={`fixed right-0 top-0 bottom-0 z-[110] flex w-full max-w-md flex-col border-l border-oat-border bg-warm-cream shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between border-b border-oat-border bg-clay-black p-6 text-clay-white">
          <div>
            <h3 className="flex items-center gap-2 text-lg font-bold">
              <Sparkle size={18} className="text-slushie-500" /> Chú Ổi
            </h3>
            <div className="mt-1 flex items-center gap-2">
              <MapPin size={10} className="text-matcha-400" />
              <span className="text-[10px] font-bold uppercase tracking-wide-label opacity-70">{searchProfile.locationLabel}</span>
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-matcha-400" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              title="Bắt đầu lại"
              className="rounded-full p-2 transition-colors hover:bg-clay-white/10"
            >
              <RefreshCw size={16} />
            </button>
            <button onClick={handleClose} className="rounded-full p-2 transition-colors hover:bg-clay-white/10">
              <X size={20} />
            </button>
          </div>
        </div>

        {error && (
          <div className="border-b border-pomegranate-200 bg-pomegranate-50 p-4 text-xs font-bold text-pomegranate-800">
            {error}
          </div>
        )}

        <div className="border-b border-oat-border bg-clay-white/80 px-4 py-4">
          <div className="rounded-card border border-matcha-200 bg-matcha-50 px-4 py-3 text-xs leading-relaxed text-matcha-900">
            <div className="text-[10px] font-bold uppercase tracking-widest text-matcha-700">Hồ sơ tìm kiếm</div>
            <div className="mt-2">
              {searchProfile.radiusKm ? `${searchProfile.radiusKm}km` : 'Chưa chọn bán kính'} · {searchProfile.partySize ? `${searchProfile.partySize} người` : 'Chưa chọn số người'}
            </div>
            <div className="mt-1">
              {searchProfile.budgetLabel || 'Chưa chọn ngân sách'} · {searchProfile.venueKind || 'Chưa chọn đồ ăn / nước uống'} · {searchProfile.servingStyle || 'Chưa chọn món nước / món khô'}
            </div>
            <div className="mt-1">{searchProfile.weatherLabel}</div>
          </div>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto p-6">
          {messages.map((msg, index) => (
            <ChatBubble key={`${msg.role}-${index}`} msg={msg} />
          ))}
          {isTyping && (
            <div className="flex gap-3">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-clay-black">
                <Bot size={16} className="text-slushie-500" />
              </div>
              <div className="rounded-feature rounded-tl-none border border-oat-border bg-clay-white shadow-sm">
                <TypingDots />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {nextQuestion && !isTyping && (
          <div className="mx-4 mb-3 rounded-card border border-oat-border bg-clay-white px-4 py-3">
            <div className="text-[10px] font-bold uppercase tracking-widest text-warm-silver">Chú Ổi hỏi nhanh</div>
            <div className="mt-2 text-sm font-bold text-warm-charcoal">{nextQuestion.question}</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {nextQuestion.options.map((option) => (
                <button
                  key={option.label}
                  onClick={() => handleProfileChoice(nextQuestion, option)}
                  className="rounded-pill border border-oat-border bg-oat-light px-3 py-1.5 text-[11px] font-bold text-warm-charcoal transition-all hover:border-clay-black hover:bg-clay-black hover:text-clay-white"
                  title={option.helper || option.label}
                >
                  {option.label}
                </button>
              ))}
            </div>
            {nextQuestion.key === 'budget' && (
              <p className="mt-3 text-[11px] leading-relaxed text-warm-silver">
                `Tiết kiệm` khoảng 25.000đ - 90.000đ/người, `Tầm trung` khoảng 70.000đ - 180.000đ/người.
              </p>
            )}
          </div>
        )}

        {!nextQuestion && messages.length <= 1 && !isTyping && isReady && (
          <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 pb-3">
            {QUICK_REPLIES.map((reply) => (
              <button
                key={reply.label}
                onClick={() => handleSend(reply.text)}
                className="flex-shrink-0 rounded-pill border border-oat-border bg-clay-white px-3 py-1.5 text-[11px] font-bold text-warm-charcoal transition-all hover:border-clay-black hover:bg-clay-black hover:text-clay-white"
              >
                {reply.label}
              </button>
            ))}
          </div>
        )}

        {botDraft?.cta && !isTyping && (
          <div className="mx-4 mb-3 rounded-card border border-matcha-300 bg-matcha-50 px-4 py-3 text-xs leading-relaxed text-matcha-900">
            <span className="block text-[10px] font-bold uppercase tracking-widest text-matcha-700">Map handoff</span>
            <span>{botDraft.cta}</span>
          </div>
        )}

        <div className="border-t border-oat-border bg-clay-white p-4">
          <div className="flex items-end gap-3">
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
              placeholder="Nói thêm nhu cầu của bạn..."
              rows={1}
              disabled={!isReady || isTyping}
              className="max-h-28 flex-1 resize-none rounded-card border border-oat-border bg-oat-light px-4 py-2.5 text-sm transition-colors focus:border-matcha-600 focus:outline-none disabled:opacity-50"
              style={{ lineHeight: '1.5' }}
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || !isReady || isTyping}
              className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-clay-black text-clay-white transition-colors hover:bg-matcha-700 active:scale-90 disabled:opacity-40"
            >
              <Send size={16} />
            </button>
          </div>
          <p className="mt-2 text-center text-[9px] font-bold uppercase tracking-widest text-warm-silver">
            Powered by Gemini AI · 24h Food Intelligence
          </p>
        </div>
      </div>
    </>
  );
};

export default AIConcierge;
