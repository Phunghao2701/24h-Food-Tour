import { GoogleGenerativeAI } from '@google/generative-ai';

const key = 'AIzaSyD9qReKYUlkHeT1KElvCLdI1zdYuAmRjfk';
const genAI = new GoogleGenerativeAI(key);

const SYSTEM = `Bạn là "Chú Ổi" — AI Concierge ẩm thực của nền tảng 24h Food Tour.
LUẬT: CHỈ gợi ý quán trong DANH SÁCH được cung cấp trong tin nhắn. Trả lời tiếng Việt, tự nhiên, tối đa 5 câu. Luôn nêu tên quán + khoảng cách + lý do.`;

const model = genAI.getGenerativeModel({
  model: 'gemini-2.5-flash',
  systemInstruction: SYSTEM,
});

const chat = model.startChat({
  generationConfig: {
    maxOutputTokens: 2048,
    temperature: 0.75,
    thinkingConfig: { thinkingBudget: 0 },
  },
});

const msg = `--- CONTEXT ---
Thời gian: 16:25 (buổi chiều)
Vị trí: Quận 9 (FPTU)

DANH SÁCH QUÁN:
[ĐANG MỞ] Yes Cafe — Hidden Gem — Quận 9 — Cách 400m — ⭐4.5 — Giá:$ — Giờ:00:00-23:59 — Sanctuary sinh viên, wifi tốt, bán cơm và snack
[ĐANG MỞ] TRẠM 24h — Street Food — Quận 9 — Cách 800m — ⭐4.2 — Giá:$ — Giờ:00:00-23:59 — Ăn uống đủ thứ, 24/7
[ĐANG MỞ] Trân Kỳ Coffee & Tea — Hidden Gem — Quận 9 — Cách 1.1km — ⭐4.6 — Giá:$ — Giờ:00:00-23:59 — Vintage, cà phê và đồ ăn nhẹ
[ĐÃ ĐÓNG] The Gantry — Fine Dining — Quận 1 — Cách 12km — ⭐4.9 — Giá:$$$ — Giờ:11:00-23:00
[ĐÃ ĐÓNG] Hẻm 158 Pasteur — Hidden Gem — Quận 1 — Cách 11km — ⭐4.8 — Giá:$ — Giờ:06:00-22:00
--- HẾT CONTEXT ---

Câu hỏi: Tôi đang đói và muốn ăn một bữa no, gợi ý chỗ nào ngon gần đây không?`;

const result = await chat.sendMessage(msg);
const text = result.response.text();
console.log('=== BOT RESPONSE ===');
console.log(text);
console.log('=== TOKEN COUNT ===', text.length, 'chars');
