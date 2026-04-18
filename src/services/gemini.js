import { GoogleGenerativeAI } from '@google/generative-ai';
import { VENUES } from '../utils/mockData';
import { isVenueOpen, calculateDistance } from '../utils/engine';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Build venue list with real-time open/closed status and distance
const buildVenueContext = (userLoc, timeStr) => {
  const lines = VENUES.map(v => {
    const isOpen = isVenueOpen(v, timeStr);
    const distM = userLoc ? Math.round(calculateDistance(v.coord, userLoc)) : null;
    const distStr = distM != null
      ? distM < 1000 ? `${distM}m` : `${(distM / 1000).toFixed(1)}km`
      : '?';
    return `[${isOpen ? 'ĐANG MỞ' : 'ĐÃ ĐÓNG'}] ${v.name} — ${v.category} — ${v.district} — Cách ${distStr} — ⭐${v.review_score} — Giá:${v.price_range} — Giờ:${v.open_at}-${v.close_at} — "${v.summary}"`;
  });
  return lines.join('\n');
};

// Concise fixed system instruction (no venue data here — injected per-message instead)
const SYSTEM_INSTRUCTION = `Bạn là "Chú Ổi" — AI Concierge ẩm thực của nền tảng 24h Food Tour. 

LUẬT BẮT BUỘC:
1. Trả lời bằng tiếng Việt tự nhiên, thân thiện như bạn bè.
2. CHỈ gợi ý các quán trong "DANH SÁCH QUÁN" được cung cấp trong mỗi tin nhắn — KHÔNG được bịa thêm địa điểm.
3. Với mỗi gợi ý, LUÔN nêu: tên quán + khoảng cách + giờ mở + lý do phù hợp với yêu cầu.
4. Chỉ gợi ý tối đa 2-3 quán để tránh làm người dùng choáng ngợp.
5. Nếu không có quán phù hợp, thành thật nói rõ và đề xuất phương án thay thế.
6. Ưu tiên quán "ĐANG MỞ" và gần nhất (khoảng cách nhỏ nhất).
7. Câu trả lời đủ chi tiết nhưng không quá 6 câu. Dùng emoji tự nhiên.`;

let genAI = null;
let model = null;
let chatHistory = [];
let currentContext = null; // { userLoc, timeStr, locationLabel }

export const initGemini = (userLoc, timeStr, locationLabel) => {
  if (!API_KEY) {
    throw new Error('Thiếu API key. Hãy thêm VITE_GEMINI_API_KEY vào file .env.local');
  }

  genAI = new GoogleGenerativeAI(API_KEY);
  model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    systemInstruction: SYSTEM_INSTRUCTION,
  });

  chatHistory = [];
  currentContext = { userLoc, timeStr, locationLabel };
};

export const sendMessage = async (userMessage) => {
  if (!model || !currentContext) {
    throw new Error('Chat chưa được khởi tạo. Hãy gọi initGemini() trước.');
  }

  // Rebuild venue context fresh on each message (catches open/closed changes + current time)
  const now = new Date();
  const liveTimeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  const venueList = buildVenueContext(currentContext.userLoc, liveTimeStr);

  // Inject venue data + context directly into the user message for reliability
  const enrichedMessage = `--- CONTEXT ---
Thời gian hiện tại: ${liveTimeStr}
Vị trí người dùng: ${currentContext.locationLabel}

DANH SÁCH QUÁN (chỉ gợi ý từ đây):
${venueList}
--- HẾT CONTEXT ---

Câu hỏi của người dùng: ${userMessage}`;

  try {
    // Create a fresh chat session with current history
    const chatSession = model.startChat({
      history: chatHistory,
      generationConfig: {
        maxOutputTokens: 2048,
        temperature: 0.75,
        // Disable thinking to prevent internal tokens from eating our output budget
        thinkingConfig: { thinkingBudget: 0 },
      },
    });

    const result = await chatSession.sendMessage(enrichedMessage);
    const responseText = result.response.text();

    // Save to history (use clean user message for display, not the enriched one)
    chatHistory.push(
      { role: 'user', parts: [{ text: userMessage }] },
      { role: 'model', parts: [{ text: responseText }] }
    );

    return responseText;
  } catch (err) {
    console.error('[Gemini Error]', err);
    throw new Error(err?.message || 'Lỗi không xác định từ Gemini API');
  }
};

export const resetChat = () => {
  chatHistory = [];
  model = null;
  genAI = null;
  currentContext = null;
};
