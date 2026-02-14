
import React, { useState } from 'react';
import { Icons } from '../constants';

interface LandingProps {
  onScanFarmer: () => void;
  onScanProduct: () => void;
  onLoginClick?: () => void;
}

const Landing: React.FC<LandingProps> = ({ onScanFarmer, onScanProduct, onLoginClick }) => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[800px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1590001158193-7f3942007bc4?auto=format&fit=crop&q=80&w=1600" 
            alt="Indian Rural Farm" 
            className="w-full h-full object-cover brightness-[0.3]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-900/40 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center text-white">
          <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20 mb-10 animate-in slide-in-from-top duration-700 shadow-2xl">
            <Icons.Verified />
            <span className="text-sm font-black uppercase tracking-[0.3em] text-emerald-400">Official National DPI Portal</span>
          </div>
          <h1 className="text-7xl md:text-9xl lg:text-[10rem] font-black gov-heading mb-10 drop-shadow-2xl leading-[0.85] tracking-tighter">
            GoShakti: <br/> Empowering <span className="text-emerald-400">Bharat</span>
          </h1>
          <p className="text-2xl md:text-4xl opacity-90 max-w-5xl mx-auto mb-14 leading-relaxed font-light drop-shadow-lg text-emerald-50/80">
            Secure farmer identity, transparent supply chains, and direct digital connections for 140 million Indian households.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
            <button 
              onClick={onLoginClick}
              className="w-full sm:w-auto bg-amber-600 hover:bg-amber-500 text-white font-black py-6 px-14 rounded-3xl shadow-[0_30px_60px_rgba(180,83,9,0.4)] transition-all transform hover:-translate-y-2 active:scale-95 text-xl"
            >
              Member Portal Login
            </button>
            <button 
              onClick={onScanProduct}
              className="w-full sm:w-auto bg-white/5 backdrop-blur-2xl hover:bg-white/20 text-white font-black py-6 px-14 rounded-3xl border-2 border-white/20 transition-all text-xl"
            >
              Trace Your Produce
            </button>
          </div>
        </div>
      </section>

      {/* Enhanced Farmer Matching Section */}
      <section className="bg-emerald-950 py-32 px-6 relative overflow-hidden border-y-8 border-emerald-900">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-emerald-900/20 skew-x-12 transform origin-top-right pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-6xl md:text-8xl font-black text-white gov-heading mb-8 tracking-tighter">
              Direct Farmer <span className="text-emerald-400 underline decoration-amber-500 underline-offset-8">Matching</span>
            </h2>
            <p className="text-2xl text-emerald-100/70 max-w-4xl mx-auto font-medium leading-relaxed">
              Connect with India's most trusted agrarian network. Our algorithm matches bulk procurement needs with verified KYF credentials.
            </p>
          </div>

          <div className="bg-white p-8 md:p-12 rounded-[3.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] max-w-5xl mx-auto border border-emerald-800">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-grow relative">
                <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                  <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                </div>
                <input 
                  type="text" 
                  placeholder="What are you sourcing? (e.g. Organic Millet, Pepper, Basmati...)" 
                  className="w-full bg-slate-50 border-3 border-slate-200 rounded-3xl py-7 pl-16 pr-8 text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none transition-all text-xl font-bold"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button className="bg-emerald-900 hover:bg-emerald-800 text-white font-black px-12 py-7 rounded-3xl transition-all shadow-2xl text-xl whitespace-nowrap">
                Match Farmers
              </button>
            </div>
            
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <span className="text-emerald-900 text-sm font-black uppercase tracking-widest px-2">Top Direct Sources:</span>
              {['Kodaikanal Honey', 'Kashmiri Walnuts', 'Bhopal Pulses', 'Sikkim Ginger'].map(tag => (
                <button 
                  key={tag} 
                  onClick={() => setSearchQuery(tag)}
                  className="text-sm font-black text-emerald-700 bg-emerald-50 border-2 border-emerald-100 px-4 py-2 rounded-2xl hover:bg-emerald-100 transition-all"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Detailed Match Results */}
          <div className="mt-24 grid grid-cols-1 lg:grid-cols-3 gap-10">
            {[
              { name: "Suresh Patil", location: "Sangli, MH", crop: "Organic Turmeric", capacity: "50 Tons", rating: "4.9", img: "https://picsum.photos/seed/patil/500/400" },
              { name: "Meena Swaminathan", location: "Coimbatore, TN", crop: "Virgin Coconut", capacity: "12 Tons", rating: "5.0", img: "https://picsum.photos/seed/meena/500/400" },
              { name: "Gurmukh Singh", location: "Ludhiana, PB", crop: "Long Grain Basmati", capacity: "200 Tons", rating: "4.8", img: "https://picsum.photos/seed/gurmukh/500/400" }
            ].map((match, i) => (
              <div key={i} className="bg-emerald-900/40 backdrop-blur-md border-2 border-white/5 rounded-[3rem] overflow-hidden group hover:border-emerald-400/50 transition-all shadow-2xl">
                <div className="h-64 relative">
                  <img src={match.img} alt={match.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                  <div className="absolute top-6 right-6 bg-amber-500 text-emerald-950 text-xs font-black px-4 py-2 rounded-xl shadow-xl">KYF CERTIFIED</div>
                </div>
                <div className="p-10">
                  <h4 className="text-3xl font-black text-white mb-2 gov-heading tracking-tight">{match.name}</h4>
                  <p className="text-emerald-300 text-lg font-bold mb-6 flex items-center gap-2">
                    <Icons.Location /> {match.location}
                  </p>
                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/60 font-bold uppercase tracking-widest">Main Product</span>
                      <span className="text-emerald-400 font-black">{match.crop}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/60 font-bold uppercase tracking-widest">Avail. Stock</span>
                      <span className="text-emerald-400 font-black">{match.capacity}</span>
                    </div>
                  </div>
                  <button className="w-full bg-white/10 hover:bg-emerald-400 hover:text-emerald-950 text-white font-black py-4 rounded-2xl border border-white/10 transition-all text-sm uppercase tracking-[0.2em]">
                    Request Procurement
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Actions Section */}
      <section className="max-w-7xl mx-auto px-6 -mt-20 relative z-20 mb-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            { 
              title: "Member Login", 
              desc: "Authentication gateway for Farmers, Officers, and Institutional Buyers with biometric integration.",
              icon: (
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
              ),
              color: "blue",
              action: onLoginClick
            },
            { 
              title: "Verify Identity", 
              desc: "Scan the QR code on any National KYF Identity Card to confirm authenticity and land registration data.",
              icon: (
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
              ),
              color: "emerald",
              action: onScanFarmer
            },
            { 
              title: "Trace Produce", 
              desc: "From harvest time to pesticide logs. Access the full seat-to-shelf journey of any agricultural batch.",
              icon: (
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              ),
              color: "amber",
              action: onScanProduct
            }
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-12 rounded-[4rem] shadow-[0_60px_100px_-20px_rgba(0,0,0,0.1)] border border-slate-100 flex flex-col items-center text-center group transition-all hover:scale-[1.02]">
              <div className={`w-24 h-24 bg-${item.color}-50 text-${item.color}-700 rounded-[2rem] flex items-center justify-center mb-10 transform group-hover:rotate-12 transition-transform shadow-lg border border-${item.color}-100`}>
                {item.icon}
              </div>
              <h3 className="text-4xl font-black text-slate-900 mb-6 gov-heading tracking-tight">{item.title}</h3>
              <p className="text-lg text-slate-500 mb-10 leading-relaxed font-medium">{item.desc}</p>
              <button onClick={item.action} className={`mt-auto text-${item.color}-700 font-black text-xl flex items-center gap-3 hover:gap-5 transition-all uppercase tracking-widest`}>
                Proceed <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l12 12-12 12" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Trust Section */}
      <section className="bg-slate-50 py-40 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-24">
          <div className="lg:w-1/2 relative">
            <div className="absolute -top-16 -left-16 w-64 h-64 bg-emerald-200 rounded-full blur-[100px] opacity-30"></div>
            <div className="relative z-10 p-3 bg-white rounded-[4rem] shadow-2xl">
               <img 
                src="https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&q=80&w=1200" 
                alt="Indian Agriculture Technology" 
                className="rounded-[3.8rem] w-full h-[650px] object-cover shadow-inner"
              />
            </div>
            <div className="absolute -bottom-12 -right-12 bg-emerald-900 p-10 rounded-[3rem] shadow-2xl z-20 border-4 border-emerald-800 animate-bounce-slow">
              <p className="text-7xl font-black text-emerald-400 leading-none">42K+</p>
              <p className="text-sm font-black text-emerald-200/50 uppercase tracking-[0.3em] mt-3">Verified Farm Dockets</p>
            </div>
          </div>
          <div className="lg:w-1/2">
            <h2 className="text-6xl md:text-8xl font-black text-slate-900 gov-heading mb-10 leading-[0.95] tracking-tighter">
              Restoring <span className="text-emerald-800 italic">Faith</span> in the Soil
            </h2>
            <p className="text-2xl text-slate-600 mb-12 leading-relaxed font-medium">
              GoShakti is more than a database; it's a movement to dignify Indian farmers by providing them a cryptographically secure voice in the global marketplace.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
              {[
                { title: 'DPI Protocol', desc: 'Built on India Stack standards for seamless interoperability.' },
                { title: 'Subsidies Link', desc: 'Direct mapping to PM-KISAN and state-level subsidy dockets.' },
                { title: 'Zero Middlemen', desc: 'Farmer matching eliminates hidden layers in supply chain.' },
                { title: 'Organic Chain', desc: 'NPOP and Jaivik Bharat certifications verified on-chain.' }
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-md">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                  </div>
                  <div>
                    <h4 className="text-2xl font-black text-slate-900 mb-2 gov-heading">{item.title}</h4>
                    <p className="text-base text-slate-500 font-bold leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
