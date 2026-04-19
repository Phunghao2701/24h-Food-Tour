import React, { useState } from 'react';
import { Search, MapPin, Users, Wallet, Navigation } from 'lucide-react';

const DISTRICT_OPTIONS = [
  { label: 'Gò Vấp', value: 'Gò Vấp' },
  { label: 'District 1', value: 'District 1' },
  { label: 'District 3', value: 'District 3' },
  { label: 'District 9', value: 'District 9' },
];

const SuggestionForm = ({ onSearch }) => {
  const [district, setDistrict] = useState('');
  const [people, setPeople] = useState(2);
  const [budget, setBudget] = useState(100000);
  const [distKm, setDistKm] = useState(3);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({
      district: district || 'All',
      partySize: parseInt(people),
      budgetPerPerson: parseInt(budget),
      radiusKm: parseInt(distKm),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-feature border border-oat-border bg-clay-white p-8 shadow-clay">
      <h2 className="text-2xl font-bold mb-6 tracking-heading-tight">Bạn muốn ăn gì?</h2>
      
      {/* Location */}
      <div className="mb-6">
        <label className="flex items-center gap-2 mb-2 font-bold text-[10px] uppercase tracking-wide-label text-warm-silver">
          <MapPin size={14} /> Khu vực
        </label>
        <select
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
          className="w-full rounded-card bg-oat-light border border-oat-border py-3 px-4 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-matcha-600/20 appearance-none"
        >
          <option value="">Bất kỳ đâu</option>
          {DISTRICT_OPTIONS.map((d) => (
            <option key={d.value} value={d.value}>{d.label}</option>
          ))}
        </select>
      </div>

      {/* People */}
      <div className="mb-6">
        <label className="flex items-center gap-2 mb-2 font-bold text-[10px] uppercase tracking-wide-label text-warm-silver">
          <Users size={14} /> Số người
        </label>
        <div className="flex gap-2">
          {[1, 2, 4, 6].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setPeople(n)}
              className={`flex-1 py-3 rounded-card text-sm font-bold transition-all ${
                people === n
                  ? 'bg-matcha-600 text-clay-white shadow-sm'
                  : 'bg-oat-light border border-oat-border text-warm-charcoal hover:border-matcha-600'
              }`}
            >
              {n} người
            </button>
          ))}
        </div>
      </div>

      {/* Budget */}
      <div className="mb-6">
        <label className="flex items-center gap-2 mb-2 font-bold text-[10px] uppercase tracking-wide-label text-warm-silver">
          <Wallet size={14} /> Kinh phí / người
        </label>
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-warm-charcoal whitespace-nowrap">
            {budget.toLocaleString('vi-VN')}đ
          </span>
          <input
            type="range"
            min={25000}
            max={500000}
            step={5000}
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="flex-1 accent-matcha-600"
          />
        </div>
      </div>

      {/* Distance */}
      <div className="mb-8">
        <label className="flex items-center gap-2 mb-2 font-bold text-[10px] uppercase tracking-wide-label text-warm-silver">
          <Navigation size={14} /> Khoảng cách tối đa
        </label>
        <div className="flex gap-2">
          {[1, 3, 5, 10].map((km) => (
            <button
              key={km}
              type="button"
              onClick={() => setDistKm(km)}
              className={`flex-1 py-3 rounded-card text-sm font-bold transition-all ${
                distKm === km
                  ? 'bg-matcha-600 text-clay-white shadow-sm'
                  : 'bg-oat-light border border-oat-border text-warm-charcoal hover:border-matcha-600'
              }`}
            >
              {km}km
            </button>
          ))}
        </div>
      </div>

      {/* Button */}
      <button
        type="submit"
        className="w-full py-4 rounded-card bg-clay-black text-clay-white font-bold text-lg shadow-clay transition-all hover:bg-matcha-600 hover:text-clay-white"
      >
        <Search size={20} className="inline mr-2" /> Gợi ý quán ăn
      </button>
    </form>
  );
};

export default SuggestionForm;