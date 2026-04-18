# Skill: Weather Adaptation

## Overview
Dynamic itinerary pivot logic based on real-time and forecasted weather conditions in Saigon.

## Instructions
- **Condition**: Check OpenWeatherMap API every hour for tours in progress, and 2 hours before a tour starts.
- **Thresholds**:
  - `Light Rain/Showers`: Suggest adding "Coffee Break" stop to wait it out.
  - `Heavy Rain/Thunderstorm`: Pivot the itinerary.
- **Pivot Logic**:
  - **Identify "Vỉa hè" (Street) stops**: Any stop tagged with `category: "Street Food"` or `ventilation: "Outdoor"`.
  - **Identify "Indoor" alternatives**: Search for nearby stops $(radius < 1km)$ with tags `ventilation: "AC"` or `category: "Indoor/Mall"`.
  - **Notify User**: "Trời đang đổ mưa ở Quận 1! 🌧️ Chúng tôi đã cập nhật lộ trình của bạn sang các quán có mái che để đảm bảo trải nghiệm tốt nhất."
- **Fallback**: If no indoor alternatives exist, suggest pausing the tour and offer a voucher for future use.
