import React, { useState } from 'react';
import { Trophy, QrCode, Grid, List, CheckCircle, Lock, Award, X } from 'lucide-react';
import Button from '../components/ui/Button';
import { QRCodeSVG } from 'qrcode.react';

const Passport = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [success, setSuccess] = useState(false);

  const stamps = [
    { id: 1, name: 'Phở Bưng', date: '18 Apr 2026', place: 'Pasteur St', unlocked: true, icon: '🍜' },
    { id: 2, name: 'Cafe Vợt', date: '18 Apr 2026', place: 'Phan Dinh Phung', unlocked: true, icon: '☕' },
    { id: 3, name: 'Cơm Tấm', unlocked: false, icon: '🍛' },
    { id: 4, name: 'Ốc Đào', unlocked: false, icon: '🐚' },
    { id: 5, name: 'Bánh Mì', unlocked: false, icon: '🥖' },
    { id: 6, name: 'Bún Mọc', unlocked: false, icon: '🥣' },
  ];

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setSuccess(true);
    }, 2000);
  };

  return (
    <div className="p-6 md:p-12 max-w-5xl mx-auto font-sans animate-fade-in">
      <header className="flex justify-between items-end mb-12">
        <div>
          <h1 className="text-4xl font-bold tracking-display-tight mb-2">Food Passport</h1>
          <p className="text-warm-silver">Your culinary journey, documented in stamps.</p>
        </div>
        <div className="flex -space-x-3">
           {[1,2,3].map(i => (
             <div key={i} className="w-10 h-10 rounded-full border-2 border-warm-cream bg-oat-light flex items-center justify-center font-bold text-xs shadow-clay">U{i}</div>
           ))}
           <div className="w-10 h-10 rounded-full border-2 border-warm-cream bg-clay-black text-clay-white flex items-center justify-center font-bold text-xs shadow-clay">+12</div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Statistics & Scan */}
        <div className="space-y-8">
           <div className="bg-clay-black text-clay-white rounded-feature p-8 shadow-clay relative overflow-hidden">
              <div className="relative z-10">
                <p className="text-[10px] font-bold uppercase tracking-wide-label text-slushie-500 mb-2">Status: Pro Gourmet</p>
                <div className="text-5xl font-bold mb-4">12 <span className="text-xl font-normal opacity-60">Stamps</span></div>
                <p className="text-sm opacity-70 mb-8 max-w-[200px]">3 more stamps to unlock the "Master Foodie" voucher bundle.</p>
                <Button 
                  onClick={() => setIsScanning(true)}
                  className="w-full bg-slushie-500 text-clay-black gap-2 hover:bg-slushie-300 transition-transform active:scale-95"
                >
                  <QrCode size={18} /> Scan Point
                </Button>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-slushie-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
           </div>

           <div className="bg-clay-white border border-oat-border rounded-feature p-8 shadow-clay">
              <h3 className="text-sm font-bold uppercase tracking-wide-label mb-6 flex items-center gap-2"><Trophy size={16} /> Challenges</h3>
              <div className="space-y-6">
                 <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-sm">Thực Thần (24h)</span>
                      <span className="text-[10px] font-bold text-matcha-600">3/5</span>
                    </div>
                    <div className="h-1.5 bg-oat-light rounded-full overflow-hidden">
                      <div className="h-full bg-matcha-600 transition-all duration-1000" style={{ width: '60%' }}></div>
                    </div>
                 </div>
                 <div className="opacity-50 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-card bg-oat-light flex items-center justify-center"><Lock size={16} /></div>
                    <div>
                      <h4 className="font-bold text-sm">Spicy Marathon</h4>
                      <p className="text-[10px] uppercase font-bold tracking-wide-label">Unlock with 5 Hot Spots</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* Stamps Grid */}
        <div className="lg:col-span-2">
           <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">Stamp Collection</h2>
              <div className="flex gap-2">
                 <button className="p-2 bg-clay-black text-clay-white rounded-standard active:scale-90 transition-transform shadow-clay"><Grid size={18} /></button>
                 <button className="p-2 bg-oat-light text-warm-charcoal rounded-standard active:scale-90 transition-transform"><List size={18} /></button>
              </div>
           </div>

           <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
              {stamps.map(stamp => (
                <div
                  key={stamp.id}
                  className={`aspect-square rounded-feature flex flex-col items-center justify-center p-6 border-2 relative transition-all duration-300 hover:-translate-y-1 ${
                    stamp.unlocked 
                    ? 'bg-clay-white border-matcha-600 shadow-clay' 
                    : 'bg-oat-light/30 border-dashed border-oat-border opacity-60'
                  }`}
                >
                  {stamp.unlocked ? (
                    <>
                      <div className="text-4xl mb-4">{stamp.icon}</div>
                      <h4 className="font-bold text-sm mb-1">{stamp.name}</h4>
                      <span className="text-[9px] font-bold uppercase tracking-wide-label text-warm-silver">{stamp.date}</span>
                      <div className="absolute top-3 right-3 text-matcha-600"><CheckCircle size={16} fill="currentColor" className="text-clay-white" /></div>
                    </>
                  ) : (
                    <>
                       <div className="w-12 h-12 rounded-full border-2 border-oat-border flex items-center justify-center mb-4">
                          <Lock size={20} className="text-oat-border" />
                       </div>
                       <h4 className="font-bold text-xs text-warm-silver">{stamp.name}</h4>
                    </>
                  )}
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* Scanning Modal Simulation */}
      {isScanning && (
        <div className="fixed inset-0 z-[100] bg-clay-black/80 backdrop-blur-md flex items-center justify-center p-6 animate-fade-in shadow-2xl">
          <div className="bg-warm-cream w-full max-w-sm rounded-feature p-12 text-center relative overflow-hidden border border-oat-border shadow-clay animate-slide-up">
            <button 
              onClick={() => setIsScanning(false)}
              className="absolute right-6 top-6 text-warm-silver hover:text-clay-black transition-colors"
            >
              <X size={24} />
            </button>
            
            {!success ? (
              <>
                <h2 className="text-2xl font-bold mb-8 tracking-display-tight">Quét mã tại quán</h2>
                <div className="w-56 h-56 mx-auto bg-clay-white rounded-card p-4 shadow-clay flex items-center justify-center relative border border-oat-border mb-8 overflow-hidden group">
                   <div className="absolute inset-0 border-[3px] border-matcha-600/20 z-0"></div>
                   {/* Corner Accents */}
                   <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-matcha-600"></div>
                   <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-matcha-600"></div>
                   <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-matcha-600"></div>
                   <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-matcha-600"></div>
                   
                   {/* Simulated QR Code (Restoring Stability) */}
                   <div className="w-[180px] h-[180px] bg-clay-black relative opacity-10 flex flex-wrap p-1 relative z-10">
                      {Array.from({ length: 144 }).map((_, i) => (
                        <div key={i} className={`w-[15px] h-[15px] ${Math.random() > 0.5 ? 'bg-clay-white' : 'bg-transparent'}`}></div>
                      ))}
                      <div className="absolute top-2 left-2 w-8 h-8 border-4 border-clay-white"></div>
                      <div className="absolute top-2 right-2 w-8 h-8 border-4 border-clay-white"></div>
                      <div className="absolute bottom-2 left-2 w-8 h-8 border-4 border-clay-white"></div>
                   </div>
                   {/* Scanning Line */}
                   <div className="absolute left-0 right-0 h-0.5 bg-matcha-600 shadow-glow pointer-events-none animate-scanning-line z-20"></div>
                </div>
                <p className="text-warm-charcoal font-medium text-sm mb-8 italic">Phát hiện: Phở Hùng Nguyễn Trãi...</p>
                <Button onClick={handleScan} className="w-full bg-clay-black text-clay-white shadow-clay">Confirm Scan</Button>
              </>
            ) : (
              <div className="animate-fade-in">
                 <div className="w-20 h-20 bg-matcha-600 rounded-full flex items-center justify-center mx-auto mb-6 text-clay-white shadow-clay scale-110">
                    <Award size={40} />
                 </div>
                 <h2 className="text-3xl font-bold mb-2 tracking-display-tight">Stamp Unlocked!</h2>
                 <p className="text-warm-silver mb-8">You've just earned the "Phở Hùng" stamp. Great job!</p>
                 <Button onClick={() => { setIsScanning(false); setSuccess(false); }} className="w-full bg-clay-black text-clay-white shadow-clay">Awesome!</Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Passport;

