import { GoogleGenerativeAI } from '@google/generative-ai';
import { VENUES } from '../utils/mockData';
import { calculateDistance, isVenueOpen } from '../utils/engine';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const buildVenueContext = (userLoc, timeStr) =>
  VENUES.map((venue) => {
    const isOpen = isVenueOpen(venue, timeStr);
    const distanceInMeters = userLoc ? Math.round(calculateDistance(venue.coord, userLoc)) : null;
    const distanceLabel =
      distanceInMeters == null ? '?' : distanceInMeters < 1000 ? `${distanceInMeters}m` : `${(distanceInMeters / 1000).toFixed(1)}km`;

    return `[${isOpen ? 'OPEN' : 'CLOSED'}] ${venue.name} - ${venue.category} - ${venue.district} - Distance ${distanceLabel} - Rating ${venue.review_score} - Price ${venue.price_range} - Hours ${venue.open_at}-${venue.close_at} - "${venue.summary}"`;
  }).join('\n');

const SYSTEM_INSTRUCTION = `Bạn là "Chú Ổi" - AI concierge ẩm thực của 24h Food Tour.

QUY TẮC:
1. Trả lời bằng tiếng Việt tự nhiên, có dấu.
2. Chỉ được gợi ý các quán xuất hiện trong DANH SÁCH QUÁN.
3. Mỗi gợi ý phải có: tên quán, khoảng cách, giờ mở cửa, khoảng giá và lý do phù hợp.
4. Không liệt kê dài dòng. Chọn 1 quán chính trước, thêm tối đa 2 quán dự phòng nếu cần.
5. Trả lời theo kiểu guide chủ động: đưa đề xuất, giải thích, rồi nói người dùng nên xem hoặc so sánh gì tiếp theo trên map.
6. Nếu nhắc đến quán nào, lặp lại đúng tên quán đó để hệ thống map có thể đồng bộ.
7. Nếu không có quán phù hợp, nói rõ ràng và đưa hướng thay thế.
8. Ưu tiên quán đang mở và gần nhất.
9. Giới hạn trả lời trong 6 câu.`;

let genAI = null;
let model = null;
let chatHistory = [];
let currentContext = null;

export const initGemini = (userLoc, timeStr, locationLabel, profile = {}) => {
  if (!API_KEY) {
    throw new Error('Thiếu API key. Hãy thêm VITE_GEMINI_API_KEY vào .env.local');
  }

  genAI = new GoogleGenerativeAI(API_KEY);
  model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    systemInstruction: SYSTEM_INSTRUCTION,
  });

  chatHistory = [];
  currentContext = { locationLabel, profile, timeStr, userLoc };
};

export const sendMessage = async (userMessage) => {
  if (!model || !currentContext) {
    throw new Error('Chat chưa được khởi tạo. Hãy gọi initGemini() trước.');
  }

  const now = new Date();
  const liveTimeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  const venueList = buildVenueContext(currentContext.userLoc, liveTimeStr);

  const enrichedMessage = `--- CONTEXT ---
Thời gian hiện tại: ${liveTimeStr}
Vị trí người dùng: ${currentContext.locationLabel}
Bán kính tìm kiếm ưu tiên: ${currentContext.profile.radiusKm || 'chưa chọn'} km
Số người: ${currentContext.profile.partySize || 'chưa chọn'}
Ngân sách: ${currentContext.profile.budget || 'chưa chọn'}
Khoảng giá mong muốn: ${currentContext.profile.budgetLabel || 'chưa chọn'}
Loại ưu tiên: ${currentContext.profile.venueKind || 'chưa chọn'}
Kiểu món: ${currentContext.profile.servingStyle || 'chưa chọn'}
Thời tiết: ${currentContext.profile.weatherLabel || 'chưa có dữ liệu'}

DANH SÁCH QUÁN (chỉ gợi ý từ đây):
${venueList}
--- HẾT CONTEXT ---

Yêu cầu của người dùng: ${userMessage}`;

  try {
    const chatSession = model.startChat({
      history: chatHistory,
      generationConfig: {
        maxOutputTokens: 2048,
        temperature: 0.75,
        thinkingConfig: { thinkingBudget: 0 },
      },
    });

    const result = await chatSession.sendMessage(enrichedMessage);
    const responseText = result.response.text();

    chatHistory.push(
      { role: 'user', parts: [{ text: userMessage }] },
      { role: 'model', parts: [{ text: responseText }] }
    );

    return responseText;
  } catch (error) {
    console.error('[Gemini Error]', error);
    throw new Error(error?.message || 'Lỗi không xác định từ Gemini API');
  }
};

export const updateGeminiContext = (patch = {}) => {
  if (!currentContext) return;
  currentContext = {
    ...currentContext,
    ...patch,
    profile: {
      ...(currentContext.profile || {}),
      ...(patch.profile || {}),
    },
  };
};

export const resetChat = () => {
  chatHistory = [];
  model = null;
  genAI = null;
  currentContext = null;
};
