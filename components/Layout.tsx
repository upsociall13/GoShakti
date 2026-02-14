
import React from 'react';
import { UserRole } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  role: UserRole;
  setRole: (role: UserRole) => void;
  onNavigate: (view: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, role, setRole, onNavigate }) => {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Government Top Bar */}
      <div className="bg-slate-900 text-[10px] text-white/60 py-2 px-6 flex justify-between items-center uppercase tracking-widest font-bold border-b border-white/5">
        <span>Government of India | Digital Public Infrastructure Portal</span>
        <div className="flex gap-6">
          <span className="hover:text-white cursor-pointer transition-colors">Accessibility Options</span>
          <span className="hover:text-white cursor-pointer transition-colors">हिन्दी (Hindi)</span>
        </div>
      </div>

      {/* Main Navigation Header */}
      <header className="bg-white text-slate-900 border-b-4 border-emerald-900 py-6 px-10 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6 cursor-pointer" onClick={() => onNavigate('landing')}>
            <div className="bg-emerald-950 p-3 rounded-2xl shadow-xl transform hover:scale-105 transition-transform">
              <img src="https://picsum.photos/seed/gov/80/80" alt="Emblem" className="w-12 h-12 object-contain brightness-0 invert" />
            </div>
            <div>
              <h1 className="gov-heading text-4xl font-black tracking-tighter text-emerald-950 leading-none">GoShakti</h1>
              <p className="text-[10px] uppercase font-black tracking-[0.4em] text-emerald-800/60 mt-2">Agri-DPI & National Traceability</p>
            </div>
          </div>
          
          <div className="hidden lg:flex items-center gap-10 text-xs font-black uppercase tracking-[0.2em] text-slate-700">
            <button onClick={() => onNavigate('landing')} className="hover:text-emerald-800 transition-colors border-b-2 border-transparent hover:border-emerald-800 pb-1">Home</button>
            <button onClick={() => onNavigate('product-view')} className="hover:text-emerald-800 transition-colors border-b-2 border-transparent hover:border-emerald-800 pb-1">Traceability</button>
            <button onClick={() => onNavigate('admin')} className="hover:text-emerald-800 transition-colors border-b-2 border-transparent hover:border-emerald-800 pb-1">Officer Portal</button>
            
            <div className="h-8 w-px bg-slate-100"></div>
            
            <div className="flex items-center gap-6">
              <div className="flex flex-col items-end">
                <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-1">Access Level</span>
                <select 
                  value={role} 
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="bg-emerald-50 border-none text-emerald-900 px-3 py-1.5 rounded-xl font-black cursor-pointer focus:ring-4 focus:ring-emerald-100 outline-none text-right shadow-sm"
                >
                  <option value={UserRole.PUBLIC}>Public Guest</option>
                  <option value={UserRole.GOVT_OFFICER}>Govt. Officer</option>
                  <option value={UserRole.FARMER}>State Farmer</option>
                  <option value={UserRole.AUDITOR}>Inspector</option>
                </select>
              </div>
              <button 
                onClick={() => onNavigate('admin')}
                className="bg-emerald-950 text-white px-10 py-4 rounded-2xl font-black hover:bg-emerald-800 transition-all shadow-2xl shadow-emerald-950/30 uppercase tracking-[0.2em]"
              >
                Sign In
              </button>
            </div>
          </div>

          {/* Mobile Menu Icon Placeholder */}
          <button className="lg:hidden p-3 bg-slate-50 rounded-2xl text-slate-600">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16m-7 6h7"/></svg>
          </button>
        </div>
      </header>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-emerald-950 text-emerald-100 py-24 px-10 mt-20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-500 via-white to-emerald-500"></div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-20 text-sm">
          <div className="col-span-1 lg:col-span-1">
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-white p-2 rounded-xl">
                <img src="https://picsum.photos/seed/national/40/40" alt="Portal" className="w-10 h-10" />
              </div>
              <h3 className="text-white font-black gov-heading text-3xl tracking-tighter">GoShakti</h3>
            </div>
            <p className="leading-relaxed opacity-60 text-lg font-medium">
              Revolutionizing Bharat's agricultural foundation through digital trust, seed-to-shelf traceability, and verifiable farmer identity.
            </p>
          </div>
          <div>
            <h3 className="text-white font-black uppercase tracking-[0.3em] text-xs mb-10 text-emerald-400">Core Infrastructure</h3>
            <ul className="space-y-4 opacity-60 text-base font-bold">
              <li className="hover:text-emerald-400 cursor-pointer transition-colors">Traceability Engine</li>
              <li className="hover:text-emerald-400 cursor-pointer transition-colors">Farmer KYF Registry</li>
              <li className="hover:text-emerald-400 cursor-pointer transition-colors">Agri-Stack Integration</li>
              <li className="hover:text-emerald-400 cursor-pointer transition-colors">Logistics Verification</li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-black uppercase tracking-[0.3em] text-xs mb-10 text-emerald-400">Grievance Cell</h3>
            <ul className="space-y-4 opacity-60 text-base font-bold">
              <li className="hover:text-emerald-400 cursor-pointer transition-colors">State Nodal Officers</li>
              <li className="hover:text-emerald-400 cursor-pointer transition-colors">Farmer Helpline 1551</li>
              <li className="hover:text-emerald-400 cursor-pointer transition-colors">Report Trace Fraud</li>
              <li className="hover:text-emerald-400 cursor-pointer transition-colors">Submit Suggestions</li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-black uppercase tracking-[0.3em] text-xs mb-10 text-emerald-400">National Connect</h3>
            <div className="flex gap-6 mb-10">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-emerald-400 hover:text-emerald-950 cursor-pointer transition-all flex items-center justify-center border border-white/10">
                  <div className="w-6 h-6 bg-current rounded-sm opacity-50"></div>
                </div>
              ))}
            </div>
            <p className="text-[11px] uppercase font-black tracking-[0.5em] text-emerald-400">#DigitalBharat Initiative</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-24 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[11px] font-black uppercase tracking-[0.3em] opacity-40">
          <p>© 2024 GoShakti Platform. Designed by NIC for MoA&FW.</p>
          <div className="flex gap-10">
            <span className="hover:text-white cursor-pointer transition-colors">Privacy Rights</span>
            <span className="hover:text-white cursor-pointer transition-colors">DPI Policy</span>
            <span className="hover:text-white cursor-pointer transition-colors">Security Audit Log</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
