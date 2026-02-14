
import React from 'react';
import { FarmerProfile as IFarmerProfile } from '../types';
import { Icons } from '../constants';

const MOCK_FARMER: IFarmerProfile = {
  kyfId: "KYF-IN-2024-9912",
  name: "Rajeshwar Singh Rathore",
  location: "Jhalawar District, Rajasthan",
  state: "Rajasthan",
  photoUrl: "https://picsum.photos/seed/farmer1/300/300",
  verificationStatus: 'VERIFIED',
  primaryCrops: ["Organic Wheat", "Mustard", "Cumin"],
  landSize: "4.5 Hectares",
  joinedDate: "Mar 2022",
  lastUpdated: "Dec 12, 2024"
};

const FarmerProfile: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-8 md:py-24">
      {/* Identity Card */}
      <div className="bg-white rounded-[5rem] shadow-[0_100px_150px_-50px_rgba(0,0,0,0.2)] overflow-hidden border-4 border-white">
        <div className="bg-emerald-900 h-64 relative">
          <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 border-[16px] border-white rounded-[4rem] overflow-hidden shadow-3xl">
            <img src={MOCK_FARMER.photoUrl} alt={MOCK_FARMER.name} className="w-64 h-64 object-cover" />
          </div>
          {/* Decorative government accent */}
          <div className="absolute top-8 right-8 text-white/10 uppercase font-black text-6xl tracking-[0.5em] pointer-events-none overflow-hidden whitespace-nowrap">
             GOSHA KTI-DPI
          </div>
        </div>
        
        <div className="pt-40 pb-20 px-16 text-center">
          <div className="flex items-center justify-center gap-6 mb-4">
            <h2 className="text-6xl md:text-8xl font-black text-slate-900 gov-heading tracking-tighter leading-none">{MOCK_FARMER.name}</h2>
            <div className="scale-[2.5] text-emerald-500">
               <Icons.Verified />
            </div>
          </div>
          <p className="text-emerald-800 font-mono text-xl font-black uppercase tracking-[0.4em] mb-12 bg-emerald-50 inline-block px-10 py-3 rounded-full border-2 border-emerald-100 shadow-sm">
            NATIONAL ID: {MOCK_FARMER.kyfId}
          </p>

          <div className="flex flex-wrap justify-center gap-6 mb-20">
            <span className="bg-emerald-950 text-white text-sm font-black px-8 py-3 rounded-2xl border-2 border-emerald-950 uppercase tracking-[0.3em] shadow-2xl">
              Active Registry
            </span>
            <span className="bg-blue-700 text-white text-sm font-black px-8 py-3 rounded-2xl border-2 border-blue-700 uppercase tracking-[0.3em] shadow-2xl">
              Govt. Authenticated
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 text-left border-t-4 border-slate-50 pt-16">
            <div className="space-y-4">
              <p className="text-xs text-slate-400 uppercase font-black tracking-[0.4em]">Agricultural Zone</p>
              <p className="text-3xl font-black text-slate-800 gov-heading tracking-tight leading-tight">{MOCK_FARMER.location}</p>
            </div>
            <div className="space-y-4">
              <p className="text-xs text-slate-400 uppercase font-black tracking-[0.4em]">Official Land Area</p>
              <p className="text-3xl font-black text-slate-800 gov-heading tracking-tight leading-tight">{MOCK_FARMER.landSize}</p>
            </div>
            <div className="col-span-1 md:col-span-2 space-y-8">
              <p className="text-xs text-slate-400 uppercase font-black tracking-[0.4em]">Certified Crop Specializations</p>
              <div className="flex flex-wrap gap-4">
                {MOCK_FARMER.primaryCrops.map(crop => (
                  <span key={crop} className="bg-white text-emerald-950 text-lg px-10 py-4 rounded-[1.5rem] font-black border-4 border-emerald-50 shadow-sm">
                    {crop}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Verification Footer */}
        <div className="bg-emerald-950 p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="scale-[2] text-emerald-400">
               <Icons.Shield />
            </div>
            <div>
              <span className="text-sm font-black text-white uppercase tracking-[0.4em] block">Immutable National Profile</span>
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest mt-1">Status: Active & Audited</span>
            </div>
          </div>
          <div className="text-center md:text-right">
             <p className="text-xs text-white/40 font-black italic tracking-widest uppercase">Verified on {MOCK_FARMER.lastUpdated}</p>
             <p className="text-[10px] text-emerald-400 font-mono mt-2 uppercase tracking-tighter">Blockchain Hash: 0xFD82...X992L</p>
          </div>
        </div>
      </div>

      <div className="mt-16 text-center px-16">
        <p className="text-lg text-slate-400 leading-relaxed font-bold italic">
          "This identity is the digital seed for a transparent future. GoShakti ensures that every farmer in Bharat is recognized, respected, and rewarded."
        </p>
      </div>
    </div>
  );
};

export default FarmerProfile;
