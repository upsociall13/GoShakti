
import React from 'react';
import { ProductTrace } from '../types';
import { Icons } from '../constants';

const MOCK_PRODUCT: ProductTrace = {
  productId: "PRD-RAJ-2024-X451",
  productName: "Premium Wheat Grain (Variety GW-322)",
  farmerId: "KYF-IN-2024-9912",
  harvestDate: "Oct 24, 2024",
  batchNumber: "B-22/W-R1",
  qualityCert: "FSSAI Grade-A, NPOP Organic",
  originLocation: "Jhalawar APMC Hub",
  currentStatus: "En-route to Distribution",
  imageUrl: "https://picsum.photos/seed/wheat/600/400"
};

const ProductProvenance: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto p-8 md:py-24 space-y-20">
      {/* Header Info */}
      <div className="bg-white rounded-[5rem] shadow-[0_120px_200px_-50px_rgba(0,0,0,0.25)] border-4 border-white overflow-hidden relative group">
        <div className="h-[500px] relative">
           <img src={MOCK_PRODUCT.imageUrl} alt="Product" className="w-full h-full object-cover brightness-[0.7] group-hover:scale-105 transition-transform duration-1000" />
           <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/40 to-transparent"></div>
           <div className="absolute bottom-16 left-16 right-16">
             <div className="flex items-center gap-4 mb-8">
                <span className="bg-amber-400 text-emerald-950 text-xs font-black px-6 py-2.5 rounded-full uppercase tracking-[0.3em] shadow-2xl">
                  Batch Authenticity Verified
                </span>
                <div className="h-0.5 w-16 bg-white/20"></div>
                <span className="text-white/60 text-xs font-black uppercase tracking-[0.3em]">Quality Seal: L-442</span>
             </div>
             <h2 className="text-7xl md:text-8xl lg:text-9xl font-black text-white gov-heading tracking-tighter leading-[0.9] drop-shadow-2xl">{MOCK_PRODUCT.productName}</h2>
           </div>
        </div>
        <div className="p-16 flex flex-wrap items-center justify-between gap-12 bg-emerald-950 border-t border-white/10">
          <div className="space-y-3">
            <p className="text-xs text-emerald-400/60 uppercase font-black tracking-[0.4em]">Batch Identity Number</p>
            <p className="text-4xl font-black text-white font-mono tracking-tighter">{MOCK_PRODUCT.batchNumber}</p>
          </div>
          <div className="flex gap-12">
             <div className="text-right space-y-2">
                <p className="text-xs text-emerald-400/60 uppercase font-black tracking-[0.4em]">Grading</p>
                <p className="text-4xl font-black text-amber-400 gov-heading">Grade-A+</p>
             </div>
             <div className="h-16 w-0.5 bg-white/10"></div>
             <div className="text-right space-y-2">
                <p className="text-xs text-emerald-400/60 uppercase font-black tracking-[0.4em]">Provenance</p>
                <p className="text-4xl font-black text-white gov-heading tracking-tight">Rajasthan</p>
             </div>
          </div>
        </div>
      </div>

      {/* Traceability Timeline */}
      <div className="bg-white rounded-[5rem] shadow-2xl border border-slate-100 p-20">
        <h3 className="text-5xl md:text-6xl font-black text-slate-900 mb-20 flex items-center gap-6 gov-heading tracking-tighter leading-none">
          <div className="scale-[1.8] text-emerald-700"><Icons.Shield /></div> Seed-to-Shelf Audit
        </h3>
        
        <div className="space-y-24 relative">
          <div className="absolute left-[38px] top-6 bottom-6 w-2.5 bg-slate-50 rounded-full"></div>
          
          {/* Timeline Step 1 */}
          <div className="flex items-start gap-16 relative group">
            <div className="w-20 h-20 rounded-[2rem] bg-emerald-950 text-emerald-400 border-8 border-white flex items-center justify-center z-10 shadow-2xl group-hover:scale-110 transition-transform">
              <div className="w-5 h-5 rounded-full bg-emerald-400 animate-pulse"></div>
            </div>
            <div className="flex-grow">
              <p className="text-xs font-black text-emerald-600 uppercase tracking-[0.4em] mb-4">Origin Hub Certification</p>
              <h4 className="text-4xl font-black text-slate-900 gov-heading tracking-tight leading-none mb-3">Harvested by Rajeshwar Singh Rathore</h4>
              <p className="text-2xl text-slate-400 font-bold italic">{MOCK_PRODUCT.harvestDate} • {MOCK_PRODUCT.originLocation}</p>
              <button className="mt-8 bg-emerald-950 text-white text-xs font-black px-10 py-4 rounded-2xl shadow-xl hover:bg-emerald-900 transition-all uppercase tracking-[0.3em]">
                Explore Farmer Credentials
              </button>
            </div>
          </div>

          {/* Timeline Step 2 */}
          <div className="flex items-start gap-16 relative group">
            <div className="w-20 h-20 rounded-[2rem] bg-blue-900 text-blue-400 border-8 border-white flex items-center justify-center z-10 shadow-2xl group-hover:scale-110 transition-transform">
              <div className="w-5 h-5 rounded-full bg-blue-400"></div>
            </div>
            <div className="flex-grow">
              <p className="text-xs font-black text-blue-600 uppercase tracking-[0.4em] mb-4">Compliance & Laboratory Review</p>
              <h4 className="text-4xl font-black text-slate-900 gov-heading tracking-tight leading-none mb-3">Certified NPOP Organic Standard</h4>
              <p className="text-2xl text-slate-400 font-bold italic">Oct 28, 2024 • State Regional Lab (Jhalawar)</p>
              <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
                 {[
                   { k: "Moisture Content", v: "11.2%" },
                   { k: "Pesticide Residue", v: "0.0% (Clean)" },
                   { k: "Protein Profile", v: "13.5%" }
                 ].map(item => (
                   <div key={item.k} className="bg-slate-50 p-8 rounded-[2.5rem] border-2 border-slate-100 text-center transition-all hover:bg-white hover:shadow-xl">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3">{item.k}</p>
                      <p className="text-3xl font-black text-blue-900 gov-heading">{item.v}</p>
                   </div>
                 ))}
              </div>
            </div>
          </div>

          {/* Timeline Step 3 */}
          <div className="flex items-start gap-16 relative group">
            <div className="w-20 h-20 rounded-[2rem] bg-amber-600 text-amber-200 border-8 border-white flex items-center justify-center z-10 shadow-2xl group-hover:scale-110 transition-transform">
              <div className="w-5 h-5 rounded-full bg-amber-200"></div>
            </div>
            <div className="flex-grow">
              <p className="text-xs font-black text-amber-700 uppercase tracking-[0.4em] mb-4">Logistics Authenticated</p>
              <h4 className="text-4xl font-black text-slate-900 gov-heading tracking-tight leading-none mb-3">Bulk Distribution Hub Release</h4>
              <p className="text-2xl text-slate-400 font-bold italic">Nov 05, 2024 • Central Agri-Storage Complex</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-emerald-950 text-emerald-50 rounded-[5rem] p-20 flex flex-col md:flex-row gap-12 shadow-3xl relative overflow-hidden border-4 border-emerald-900">
        <div className="absolute right-0 bottom-0 h-64 w-64 bg-emerald-400/5 rounded-full blur-[100px]"></div>
        <div className="flex-shrink-0 w-24 h-24 bg-white/5 rounded-[2rem] flex items-center justify-center border border-white/10">
          <svg className="h-12 w-12 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        </div>
        <div>
          <h4 className="text-3xl font-black uppercase tracking-[0.3em] mb-6 gov-heading text-emerald-400">Security Commitment</h4>
          <p className="text-2xl opacity-70 leading-relaxed font-bold italic">
            "Your health is our harvest. GoShakti ensures that every gram of grain is backed by a verifiable digital signature, protecting you from fraud and honoring the farmer's toil."
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductProvenance;
