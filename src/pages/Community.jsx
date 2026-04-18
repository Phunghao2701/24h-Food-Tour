import React from 'react';
import { Users, Video, Heart, MessageCircle, MapPin, Plus } from 'lucide-react';
import Button from '../components/ui/Button';
import SafeImage from '../components/ui/SafeImage';

const Community = () => {
  const matches = [
    { id: 1, name: 'Alex', avatar: 'A', loc: 'District 1', dish: 'Snail shells', count: 1 },
    { id: 2, name: 'Linh', avatar: 'L', loc: 'District 3', dish: 'Phở & Coffee', count: 2 },
  ];

  const posts = [
    { 
      id: 1, 
      user: 'Foodie_Saigon', 
      location: 'Chợ Bến Thành', 
      img: 'https://images.unsplash.com/photo-1583394238711-683a5f217281?auto=format&fit=crop&q=80&w=400',
      likes: 128,
      comment: 'The broth in this hidden gem is unreal! 🍜 #localvibes'
    },
    { 
      id: 2, 
      user: 'Midnight_Snacker', 
      location: 'Quận 4', 
      img: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=400',
      likes: 254,
      comment: 'Grilled pork that smells like heaven. Found at 2 AM. #nightowl'
    }
  ];

  return (
    <div className="p-6 md:p-12 max-w-6xl mx-auto font-sans">
      <header className="mb-12 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold tracking-display-tight mb-2">Foodie Community</h1>
          <p className="text-warm-silver">Connect with other foodies and share your findings.</p>
        </div>
        <Button variant="pill" className="bg-matcha-600 text-clay-white gap-2 shadow-clay">
          <Plus size={18} /> Add Post
        </Button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Left: Matching & Challenges */}
        <div className="lg:col-span-1 space-y-8">
           <div className="bg-clay-white border border-oat-border rounded-feature p-6 shadow-clay">
              <h3 className="text-sm font-bold uppercase tracking-wide-label mb-6 flex items-center gap-2">
                <Users size={16} /> Eat With Me
              </h3>
              <div className="space-y-4">
                {matches.map(m => (
                  <div key={m.id} className="p-4 rounded-card bg-oat-light/30 border border-oat-border">
                    <div className="flex items-center gap-3 mb-3">
                       <div className="w-10 h-10 rounded-full bg-clay-black text-clay-white flex items-center justify-center font-bold text-xs">{m.avatar}</div>
                       <div>
                          <h4 className="font-bold text-sm leading-none">{m.name}</h4>
                          <span className="text-[10px] uppercase font-bold tracking-wide-label text-warm-silver">{m.loc}</span>
                       </div>
                    </div>
                    <p className="text-xs text-warm-charcoal mb-4">Wants to try: <span className="font-bold text-clay-black">{m.dish}</span></p>
                    <Button variant="ghost" className="w-full text-xs h-8">Join them</Button>
                  </div>
                ))}
              </div>
           </div>
        </div>

        {/* Center: Mini Blog Feed */}
        <div className="lg:col-span-2 space-y-8">
           <div className="flex gap-4 mb-4">
              <button className="text-sm font-bold border-b-2 border-clay-black pb-2 px-1">For You</button>
              <button className="text-sm font-bold text-warm-silver pb-2 px-1 hover:text-clay-black transition-colors">Following</button>
           </div>
           
           <div className="space-y-12">
              {posts.map(post => (
                <article key={post.id} className="bg-clay-white rounded-feature overflow-hidden border border-oat-border shadow-clay hover-clay-jump">
                   <div className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                         <div className="w-8 h-8 rounded-full bg-oat-light flex items-center justify-center font-bold text-[10px]">US</div>
                         <div>
                            <p className="text-sm font-bold leading-none">{post.user}</p>
                            <p className="text-[10px] text-warm-silver flex items-center gap-1"><MapPin size={10} /> {post.location}</p>
                         </div>
                      </div>
                      <Button variant="ghost" className="p-1 h-auto"><Plus size={16} /></Button>
                   </div>
                   <div className="aspect-[4/5] bg-oat-light relative">
                      <SafeImage src={post.img} alt="food" className="w-full h-full object-cover" />
                      <div className="absolute top-4 right-4 bg-clay-black/40 backdrop-blur-md px-2 py-1 rounded-badge text-[10px] text-clay-white font-bold uppercase flex items-center gap-1">
                        <Video size={12} /> Live Now
                      </div>
                   </div>
                   <div className="p-6">
                      <div className="flex gap-4 mb-4">
                         <button className="flex items-center gap-1 text-sm font-bold"><Heart size={20} /> {post.likes}</button>
                         <button className="flex items-center gap-1 text-sm font-bold"><MessageCircle size={20} /> 12</button>
                      </div>
                      <p className="text-sm text-warm-charcoal leading-relaxed">{post.comment}</p>
                   </div>
                </article>
              ))}
           </div>
        </div>

        {/* Right: Trending Labels */}
        <div className="lg:col-span-1 hidden lg:block">
           <div className="sticky top-24 space-y-8">
              <div className="bg-warm-cream border border-oat-border rounded-feature p-6">
                 <h3 className="text-sm font-bold uppercase tracking-wide-label mb-4">Trending Tags</h3>
                 <div className="flex flex-wrap gap-2">
                    {['#CúĐêm', '#StreetFood', '#HiddenGem', '#FineDining', '#ỐcĐào', '#SaigonFood'].map(tag => (
                      <span key={tag} className="px-3 py-1 rounded-pill bg-oat-light text-[10px] font-bold text-warm-charcoal border border-oat-border hover:bg-clay-black hover:text-clay-white transition-all cursor-pointer">
                        {tag}
                      </span>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Community;
