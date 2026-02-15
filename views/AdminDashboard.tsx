
import React, { useState, useRef } from 'react';
import { UserRole } from '../types';
import { Icons } from '../constants';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, BarChart, Bar, Cell 
} from 'recharts';

interface SupportingDocument {
  id: string;
  name: string;
  type: string;
  uploadedAt: string;
}

interface Request {
  id: string;
  name: string;
  type: string;
  date: string;
  status: string;
  documents: SupportingDocument[];
  docVerificationStatus: 'SECURED' | 'PENDING' | 'FAILED' | 'NONE';
  farmerPhoto?: string;
}

interface UploadingFile {
  id: string;
  name: string;
  progress: number;
}

// Mock Analytics Data
const REGISTRATION_DATA = [
  { day: 'Mon', count: 1200 },
  { day: 'Tue', count: 1900 },
  { day: 'Wed', count: 1600 },
  { day: 'Thu', count: 2400 },
  { day: 'Fri', count: 3100 },
  { day: 'Sat', count: 2800 },
  { day: 'Sun', count: 4200 },
];

const MATCH_DATA = [
  { day: 'Mon', matches: 85 },
  { day: 'Tue', matches: 120 },
  { day: 'Wed', matches: 98 },
  { day: 'Thu', matches: 145 },
  { day: 'Fri', matches: 160 },
  { day: 'Sat', matches: 110 },
  { day: 'Sun', matches: 190 },
];

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [isOnboarding, setIsOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [newFarmer, setNewFarmer] = useState({
    name: '',
    location: '',
    state: '',
    landSize: '',
    photoUrl: '',
    crops: [] as string[],
    documents: [] as { name: string; type: string }[]
  });

  const cropOptions = [
    "Wheat", "Rice (Paddy)", "Cotton", "Sugarcane", 
    "Pulses", "Mustard", "Maize", "Millets", "Spices", "Soybean"
  ];

  const toggleCrop = (crop: string) => {
    setNewFarmer(prev => ({
      ...prev,
      crops: prev.crops.includes(crop) 
        ? prev.crops.filter(c => c !== crop)
        : [...prev.crops, crop]
    }));
  };

  const [requests, setRequests] = useState<Request[]>([
    { 
      id: 'REQ001', 
      name: 'Amit Kumar', 
      type: 'Land Registration', 
      date: '2024-12-10', 
      status: 'Awaiting Doc Verification',
      docVerificationStatus: 'PENDING',
      documents: [
        { id: 'doc1', name: 'Land_Deed_772.pdf', type: 'application/pdf', uploadedAt: '2024-12-10' }
      ]
    },
    { 
      id: 'REQ002', 
      name: 'Sarita Devi', 
      type: 'New Farmer KYF', 
      date: '2024-12-11', 
      status: 'Pending Inspector Visit',
      docVerificationStatus: 'NONE',
      documents: []
    },
    { 
      id: 'REQ003', 
      name: 'Mehta Farms Ltd', 
      type: 'Bulk Traceability Request', 
      date: '2024-12-12', 
      status: 'Processing Final Audit',
      docVerificationStatus: 'SECURED',
      documents: [
         { id: 'doc2', name: 'Trade_License_A1.pdf', type: 'application/pdf', uploadedAt: '2024-12-12' }
      ]
    },
  ]);

  const handleFileUpload = (requestId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const fileList: File[] = Array.from(files);
    
    fileList.forEach((file: File) => {
      const uploadId = `upload-${Math.random().toString(36).substr(2, 9)}`;
      
      setUploadingFiles(prev => [...prev, { id: uploadId, name: file.name, progress: 0 }]);

      let currentProgress = 0;
      const interval = setInterval(() => {
        currentProgress += Math.random() * 25;
        if (currentProgress >= 100) {
          currentProgress = 100;
          clearInterval(interval);
          
          const newDoc: SupportingDocument = {
            id: `doc-${Math.random().toString(36).substr(2, 9)}`,
            name: file.name,
            type: file.type,
            uploadedAt: new Date().toISOString().split('T')[0]
          };

          setRequests(prev => prev.map(req => 
            req.id === requestId 
              ? { ...req, documents: [...req.documents, newDoc], docVerificationStatus: 'PENDING' }
              : req
          ));
          
          setUploadingFiles(prev => prev.filter(f => f.id !== uploadId));
          
          setSelectedRequest(prev => {
            if (prev?.id === requestId) {
              return { ...prev, documents: [...prev.documents, newDoc], docVerificationStatus: 'PENDING' };
            }
            return prev;
          });
        } else {
          setUploadingFiles(prev => prev.map(f => 
            f.id === uploadId ? { ...f, progress: Math.floor(currentProgress) } : f
          ));
        }
      }, 350);
    });

    event.target.value = '';
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewFarmer(prev => ({ ...prev, photoUrl: reader.result as string }));
        stopCamera();
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    setIsCameraActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera access denied:", err);
      setIsCameraActive(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(videoRef.current, 0, 0);
      const dataUrl = canvas.toDataURL('image/jpeg');
      setNewFarmer(prev => ({ ...prev, photoUrl: dataUrl }));
      stopCamera();
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    setIsCameraActive(false);
  };

  const handleOnboardingNext = () => {
    stopCamera();
    setOnboardingStep(prev => Math.min(prev + 1, 4));
  };
  
  const handleOnboardingBack = () => {
    stopCamera();
    setOnboardingStep(prev => Math.max(prev - 1, 1));
  };
  
  const finishOnboarding = () => {
    const newReq: Request = {
      id: `REQ-${Math.floor(Math.random() * 900) + 100}`,
      name: newFarmer.name,
      type: 'New Farmer KYF',
      date: new Date().toISOString().split('T')[0],
      status: 'Verification Pending',
      docVerificationStatus: newFarmer.documents.length > 0 ? 'PENDING' : 'NONE',
      documents: newFarmer.documents.map((d, i) => ({
        id: `d-${i}`,
        name: d.name,
        type: d.type,
        uploadedAt: new Date().toISOString().split('T')[0]
      })),
      farmerPhoto: newFarmer.photoUrl
    };
    setRequests([newReq, ...requests]);
    setIsOnboarding(false);
    setOnboardingStep(1);
    setNewFarmer({ name: '', location: '', state: '', landSize: '', photoUrl: '', crops: [], documents: [] });
  };

  const getDocStatusBadge = (status: Request['docVerificationStatus']) => {
    switch (status) {
      case 'SECURED':
        return <span className="inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 uppercase tracking-widest border border-emerald-200">SECURED</span>;
      case 'PENDING':
        return <span className="inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black bg-blue-100 text-blue-800 uppercase tracking-widest border border-blue-200">PENDING</span>;
      case 'FAILED':
        return <span className="inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black bg-rose-100 text-rose-800 uppercase tracking-widest border border-rose-200">FAILED</span>;
      case 'NONE':
      default:
        return <span className="inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black bg-slate-100 text-slate-400 uppercase tracking-widest border border-slate-200">NONE</span>;
    }
  };

  return (
    <div className="p-10 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
        <div>
          <h2 className="text-6xl md:text-8xl font-black text-slate-900 gov-heading mb-6 leading-[0.9] tracking-tighter text-emerald-950">Officer Portal</h2>
          <p className="text-2xl text-slate-500 font-bold max-w-3xl">Monitoring national agricultural identity, verification logs, and regional procurement matching.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setIsOnboarding(true)}
            className="bg-emerald-900 text-white px-10 py-5 rounded-3xl text-lg font-black hover:bg-emerald-800 transition-all shadow-2xl shadow-emerald-900/30 uppercase tracking-widest"
          >
            + New Registry
          </button>
          <button className="bg-white border-3 border-slate-200 text-slate-700 px-10 py-5 rounded-3xl text-lg font-black hover:bg-slate-50 transition-all shadow-sm uppercase tracking-widest">
            Export Analytics
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
        {[
          { label: 'Farmers Registered', value: '42,891', sub: '+12.4% Increase' },
          { label: 'Critical Audits', value: '156', sub: 'Urgent Action' },
          { label: 'Daily Trace Logs', value: '2.4M', sub: 'Real-time feed' },
          { label: 'Procurement Matches', value: '1,204', sub: 'Live Matches' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[3rem] border-2 border-slate-100 shadow-2xl flex flex-col justify-between h-56 transition-all hover:-translate-y-2">
            <div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-4">{stat.label}</p>
              <p className="text-5xl font-black text-slate-900 tracking-tighter">{stat.value}</p>
            </div>
            <div className="self-start">
              <span className="text-xs font-black text-emerald-700 uppercase bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-100">{stat.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
        <div className="bg-white p-12 rounded-[4rem] border-2 border-slate-100 shadow-xl overflow-hidden">
          <div className="flex items-center justify-between mb-10">
            <div>
              <p className="text-xs font-black text-emerald-700 uppercase tracking-[0.3em] mb-2">Network Growth</p>
              <h4 className="text-4xl font-black text-slate-900 gov-heading tracking-tight leading-none">Registration Velocity</h4>
            </div>
            <span className="text-sm font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-4 py-2 rounded-xl">Last 7 Days</span>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={REGISTRATION_DATA}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#064e3b" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#064e3b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 900, fill: '#94a3b8' }} 
                  dy={10}
                />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#064e3b', 
                    border: 'none', 
                    borderRadius: '1rem', 
                    padding: '1.5rem',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
                  }}
                  itemStyle={{ color: '#fff', fontSize: '1.5rem', fontWeight: 900 }}
                  labelStyle={{ color: '#a7f3d0', marginBottom: '0.5rem', fontWeight: 900, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.2em' }}
                />
                <Area type="monotone" dataKey="count" stroke="#064e3b" strokeWidth={4} fillOpacity={1} fill="url(#colorCount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-12 rounded-[4rem] border-2 border-slate-100 shadow-xl overflow-hidden">
          <div className="flex items-center justify-between mb-10">
            <div>
              <p className="text-xs font-black text-amber-700 uppercase tracking-[0.3em] mb-2">Market Efficiency</p>
              <h4 className="text-4xl font-black text-slate-900 gov-heading tracking-tight leading-none">Procurement Matches</h4>
            </div>
            <span className="text-sm font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-4 py-2 rounded-xl">Batch Volume</span>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MATCH_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 900, fill: '#94a3b8' }} 
                  dy={10}
                />
                <YAxis hide />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: 'none', 
                    borderRadius: '1rem', 
                    padding: '1.5rem',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
                  }}
                  itemStyle={{ color: '#fff', fontSize: '1.5rem', fontWeight: 900 }}
                  labelStyle={{ color: '#94a3b8', marginBottom: '0.5rem', fontWeight: 900, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.2em' }}
                />
                <Bar dataKey="matches" radius={[10, 10, 0, 0]}>
                  {MATCH_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === MATCH_DATA.length - 1 ? '#064e3b' : '#334155'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Workflow Tabs */}
      <div className="bg-white rounded-[4rem] border border-slate-200 shadow-[0_80px_150px_-30px_rgba(0,0,0,0.1)] overflow-hidden relative">
        <div className="flex border-b-2 border-slate-100 bg-slate-50/50">
          {['Pending Approvals', 'Approved Records', 'Farmer Matching', 'Audit Logs'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase().split(' ')[0])}
              className={`px-10 py-8 text-sm font-black uppercase tracking-[0.2em] transition-all relative ${
                activeTab === tab.toLowerCase().split(' ')[0]
                ? 'text-emerald-900'
                : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab}
              {activeTab === tab.toLowerCase().split(' ')[0] && (
                <div className="absolute bottom-0 left-0 right-0 h-2 bg-emerald-700"></div>
              )}
            </button>
          ))}
        </div>

        <div className="p-0 overflow-x-auto">
          {activeTab === 'farmer' ? (
            <div className="p-20 text-center bg-slate-50/20">
              <div className="max-w-xl mx-auto">
                 <div className="w-24 h-24 bg-emerald-100 text-emerald-700 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-xl">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                 </div>
                 <h3 className="text-4xl font-black text-slate-900 mb-6 gov-heading tracking-tight">Farmer-Buyer Match Control</h3>
                 <p className="text-xl text-slate-500 mb-10 font-bold leading-relaxed">Oversee the intelligent matching protocol between verified farmers and institutional buyers to ensure price transparency and market integrity.</p>
                 <button className="bg-emerald-900 text-white font-black px-14 py-5 rounded-3xl shadow-[0_20px_40px_rgba(6,78,59,0.3)] text-lg uppercase tracking-widest">Launch Matching Utility</button>
              </div>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-xs font-black text-slate-500 uppercase tracking-[0.3em] border-b-2 border-slate-100">
                <tr>
                  <th className="px-10 py-7">DOCKET REF</th>
                  <th className="px-10 py-7">ENTITY NAME</th>
                  <th className="px-10 py-7">SERVICE TYPE</th>
                  <th className="px-10 py-7">DOCS VERIFIED</th>
                  <th className="px-10 py-7">VERIFICATION</th>
                  <th className="px-10 py-7">PROCESS STATUS</th>
                  <th className="px-10 py-7 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-slate-50">
                {requests.map((req) => (
                  <tr key={req.id} className="hover:bg-emerald-50/50 transition-colors group">
                    <td className="px-10 py-8 font-mono text-xs font-black text-slate-400 uppercase tracking-widest">{req.id}</td>
                    <td className="px-10 py-8">
                      <p className="text-xl font-black text-slate-800 gov-heading tracking-tight">{req.name}</p>
                    </td>
                    <td className="px-10 py-8 text-base font-bold text-slate-600">{req.type}</td>
                    <td className="px-10 py-8">
                      <div className="flex -space-x-1 overflow-hidden">
                         {req.documents.length > 0 ? (
                           <span className="text-xs font-black text-slate-600 uppercase tracking-widest">
                             {req.documents.length} ATTACHED
                           </span>
                         ) : (
                           <span className="text-xs text-rose-500 font-black uppercase tracking-widest bg-rose-50 px-3 py-1 rounded-full border border-rose-100">None</span>
                         )}
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      {getDocStatusBadge(req.docVerificationStatus)}
                    </td>
                    <td className="px-10 py-8">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wide italic">{req.status}</span>
                    </td>
                    <td className="px-10 py-8 text-right">
                      <button 
                        onClick={() => setSelectedRequest(req)}
                        className="bg-slate-900 hover:bg-emerald-900 text-white text-xs font-black px-6 py-3 rounded-2xl transition-all shadow-lg shadow-slate-900/10 uppercase tracking-widest"
                      >
                        REVIEW FILE
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Multi-Step Farmer Onboarding Flow */}
      {isOnboarding && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-8 bg-emerald-950/90 backdrop-blur-xl animate-in fade-in zoom-in duration-300">
          <div className="bg-white rounded-[4rem] shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col border-8 border-emerald-900">
            {/* Header with Step Indicator */}
            <div className="p-12 border-b-2 border-slate-50 flex flex-col gap-6 bg-slate-50/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-black text-emerald-700 uppercase tracking-[0.3em] mb-2">Guided Registration Protocol</p>
                  <h3 className="text-5xl font-black text-slate-900 gov-heading tracking-tighter leading-none">KYC Onboarding</h3>
                </div>
                <button 
                  onClick={() => { stopCamera(); setIsOnboarding(false); }}
                  className="p-4 hover:bg-slate-200 rounded-[1.5rem] transition-all border-2 border-slate-100 group shadow-sm"
                >
                  <svg className="w-8 h-8 text-slate-400 group-hover:text-slate-900 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              
              <div className="flex items-center gap-4">
                {[1, 2, 3, 4].map(step => (
                  <div key={step} className="flex-1 h-3 rounded-full overflow-hidden bg-slate-200">
                    <div className={`h-full transition-all duration-500 ${onboardingStep >= step ? 'bg-emerald-600' : 'bg-transparent'}`}></div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-grow p-12 overflow-y-auto">
              {onboardingStep === 1 && (
                <div className="space-y-12 animate-in slide-in-from-right duration-300">
                  <h4 className="text-3xl font-black text-slate-900 gov-heading">Step 1: Personal Details</h4>
                  <div className="grid grid-cols-1 gap-12">
                    <div className="space-y-8">
                      <div className="space-y-3">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Full Name (As per Aadhar)</label>
                        <input 
                          type="text" 
                          value={newFarmer.name}
                          onChange={(e) => setNewFarmer({...newFarmer, name: e.target.value})}
                          className="w-full bg-slate-50 border-3 border-slate-100 rounded-2xl p-6 text-xl font-bold outline-none focus:border-emerald-500 transition-all"
                          placeholder="e.g. Rajesh Kumar"
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Contact Number</label>
                        <input 
                          type="tel" 
                          className="w-full bg-slate-50 border-3 border-slate-100 rounded-2xl p-6 text-xl font-bold outline-none focus:border-emerald-500 transition-all"
                          placeholder="+91 XXXXX XXXXX"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {onboardingStep === 2 && (
                <div className="space-y-12 animate-in slide-in-from-right duration-300">
                  <h4 className="text-3xl font-black text-slate-900 gov-heading">Step 2: Land & Profile</h4>
                  <div className="bg-slate-50/50 p-10 rounded-[3rem] border-4 border-dashed border-slate-100 flex flex-col md:flex-row items-center gap-10">
                    <div className="w-48 h-48 bg-white rounded-[2.5rem] border-4 border-slate-100 overflow-hidden relative group shadow-xl">
                      {isCameraActive ? (
                        <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                      ) : newFarmer.photoUrl ? (
                        <img src={newFarmer.photoUrl} className="w-full h-full object-cover" alt="Farmer Preview" />
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-slate-300">
                          <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                        </div>
                      )}
                      {isCameraActive && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                           <button onClick={capturePhoto} className="bg-emerald-600 text-white p-4 rounded-full shadow-2xl active:scale-95 transition-transform">
                             <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" /></svg>
                           </button>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 space-y-6">
                      <div className="space-y-2">
                        <p className="text-xl font-black text-slate-800 gov-heading">Farmer Profile Photo</p>
                        <p className="text-sm text-slate-500 font-bold">Provide a recent high-resolution portrait for identity verification and biometric mapping.</p>
                      </div>
                      <div className="flex flex-wrap gap-4">
                        <label className="cursor-pointer bg-slate-900 text-white px-8 py-4 rounded-2xl text-xs font-black hover:bg-emerald-900 transition-all uppercase tracking-widest flex items-center gap-3 shadow-xl">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
                          Upload Profile Photo
                          <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                        </label>
                        {!isCameraActive ? (
                          <button onClick={startCamera} className="bg-white border-4 border-slate-200 text-slate-700 px-8 py-4 rounded-2xl text-xs font-black hover:bg-slate-50 transition-all uppercase tracking-widest flex items-center gap-3 shadow-sm">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                            Capture via Camera
                          </button>
                        ) : (
                          <button onClick={stopCamera} className="bg-rose-100 text-rose-600 border-4 border-rose-200 px-8 py-4 rounded-2xl text-xs font-black hover:bg-rose-200 transition-all uppercase tracking-widest shadow-sm">
                            Cancel Camera
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
                    <div className="space-y-3">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest">State / UT</label>
                      <select 
                        value={newFarmer.state}
                        onChange={(e) => setNewFarmer({...newFarmer, state: e.target.value})}
                        className="w-full bg-slate-50 border-3 border-slate-100 rounded-2xl p-6 text-xl font-bold outline-none focus:border-emerald-500 transition-all appearance-none shadow-sm"
                      >
                        <option value="">Select State</option>
                        <option value="Rajasthan">Rajasthan</option>
                        <option value="Punjab">Punjab</option>
                        <option value="Maharashtra">Maharashtra</option>
                        <option value="Karnataka">Karnataka</option>
                        <option value="Tamil Nadu">Tamil Nadu</option>
                      </select>
                    </div>
                    <div className="space-y-3">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest">District / Tehsil</label>
                      <input type="text" value={newFarmer.location} onChange={(e) => setNewFarmer({...newFarmer, location: e.target.value})} className="w-full bg-slate-50 border-3 border-slate-100 rounded-2xl p-6 text-xl font-bold outline-none focus:border-emerald-500 transition-all shadow-sm" placeholder="e.g. Jhalawar" />
                    </div>
                  </div>
                </div>
              )}

              {onboardingStep === 3 && (
                <div className="space-y-8 animate-in slide-in-from-right duration-300">
                  <h4 className="text-3xl font-black text-slate-900 gov-heading">Step 3: Document Verification</h4>
                  <div className="grid grid-cols-1 gap-6">
                    {['Aadhar Identity Proof', 'State Land Registry Deed', 'Village Sarpanch Certificate'].map((docLabel) => (
                      <div key={docLabel} className="p-8 border-4 border-dashed border-slate-100 rounded-[3rem] flex items-center justify-between group hover:border-emerald-200 transition-all bg-slate-50/20">
                        <div className="flex items-center gap-6">
                          <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-2xl flex items-center justify-center shadow-inner">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          </div>
                          <div>
                            <p className="text-xl font-black text-slate-800">{docLabel}</p>
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Required: PDF, JPG, PNG (Max 10MB per file)</p>
                          </div>
                        </div>
                        <label className="cursor-pointer bg-slate-900 text-white px-8 py-3 rounded-2xl text-xs font-black hover:bg-emerald-900 transition-all uppercase tracking-widest shadow-xl">
                          Attach Files
                          <input type="file" multiple className="hidden" onChange={(e) => {
                            const files = e.target.files;
                            if(files) {
                              const newDocs = Array.from(files).map((f: File) => ({ name: f.name, type: f.type }));
                              setNewFarmer({...newFarmer, documents: [...newFarmer.documents, ...newDocs]});
                            }
                          }} />
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {onboardingStep === 4 && (
                <div className="space-y-8 animate-in slide-in-from-right duration-300">
                  <div className="text-center p-12 bg-emerald-50 rounded-[4rem] border-4 border-emerald-100 mb-10">
                    <div className="w-24 h-24 bg-emerald-600 text-white rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-2xl animate-bounce">
                      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                    <h4 className="text-5xl font-black text-emerald-950 gov-heading tracking-tighter mb-4">Verification Ready</h4>
                  </div>
                </div>
              )}
            </div>

            <div className="p-12 bg-slate-50 border-t-2 border-slate-100 flex gap-6">
              {onboardingStep > 1 && (
                <button onClick={handleOnboardingBack} className="flex-1 bg-white border-4 border-slate-200 text-slate-700 font-black py-7 rounded-[2rem] hover:bg-slate-50 transition-all text-2xl uppercase tracking-[0.1em] shadow-sm">
                  Back
                </button>
              )}
              {onboardingStep < 4 ? (
                <button onClick={handleOnboardingNext} className="flex-[2] bg-emerald-950 text-white font-black py-7 rounded-[2rem] hover:bg-emerald-800 transition-all shadow-3xl shadow-emerald-900/30 text-2xl uppercase tracking-[0.1em]">
                  Save & Continue
                </button>
              ) : (
                <button onClick={finishOnboarding} className="flex-[2] bg-emerald-600 text-white font-black py-7 rounded-[2rem] hover:bg-emerald-500 transition-all shadow-3xl shadow-emerald-600/30 text-2xl uppercase tracking-[0.1em]">
                  Finalize Registry
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Verification Detail Modal */}
      {selectedRequest && !isOnboarding && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-8 bg-slate-900/90 backdrop-blur-xl animate-in fade-in zoom-in duration-300">
          <div className="bg-white rounded-[4rem] shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col border-8 border-white">
            <div className="p-12 border-b-2 border-slate-50 flex items-center justify-between bg-slate-50/30">
              <div className="flex items-center gap-6">
                {selectedRequest.farmerPhoto && (
                  <img src={selectedRequest.farmerPhoto} className="w-20 h-20 rounded-2xl object-cover border-4 border-white shadow-xl" />
                )}
                <div>
                  <p className="text-xs font-black text-emerald-700 uppercase tracking-[0.3em] mb-3">Verification Service Unit</p>
                  <h3 className="text-5xl font-black text-slate-900 gov-heading tracking-tighter leading-none">{selectedRequest.name}</h3>
                  <p className="text-sm font-black text-slate-400 mt-4 uppercase tracking-[0.4em]">REFERENCE DOCKET: {selectedRequest.id}</p>
                </div>
              </div>
              <button onClick={() => setSelectedRequest(null)} className="p-4 hover:bg-slate-200 rounded-[1.5rem] transition-all border-2 border-slate-100 group shadow-sm">
                <svg className="w-10 h-10 text-slate-400 group-hover:text-slate-900 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="flex-grow p-12 overflow-y-auto space-y-16">
              <div>
                <div className="flex items-center justify-between mb-8">
                  <h4 className="text-3xl font-black text-slate-900 flex items-center gap-4 gov-heading tracking-tight">
                    <div className="scale-125"><Icons.Shield /></div> Supporting Evidence
                  </h4>
                  <label className="cursor-pointer bg-emerald-900 hover:bg-emerald-800 text-white px-8 py-4 rounded-2xl text-xs font-black transition-all shadow-2xl shadow-emerald-900/20 uppercase tracking-[0.2em] flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    Upload Documents
                    <input type="file" multiple className="hidden" onChange={(e) => handleFileUpload(selectedRequest.id, e)} />
                  </label>
                </div>

                {/* Enhanced Progress Indicators */}
                {uploadingFiles.length > 0 && (
                  <div className="mb-10 space-y-4">
                    <p className="text-xs font-black text-emerald-700 uppercase tracking-[0.3em] flex items-center gap-3">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
                      </span>
                      Synchronizing Data
                    </p>
                    <div className="grid grid-cols-1 gap-4">
                      {uploadingFiles.map((file) => (
                        <div key={file.id} className="p-8 bg-slate-900 text-white border-2 border-slate-800 rounded-[3rem] shadow-2xl overflow-hidden relative">
                          <div className="flex items-center justify-between mb-6 relative z-10">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-emerald-400 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                              </div>
                              <div>
                                <span className="text-lg font-black block tracking-tight">{file.name}</span>
                                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Encrypting for Ledger</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="text-3xl font-black text-emerald-400 tabular-nums">{file.progress}%</span>
                            </div>
                          </div>
                          <div className="w-full h-4 bg-white/10 rounded-full overflow-hidden border border-white/5 relative">
                            <div 
                              className="h-full bg-emerald-500 transition-all duration-300 ease-out relative overflow-hidden"
                              style={{ width: `${file.progress}%` }}
                            >
                               <div className="absolute inset-0 shimmer-progress"></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedRequest.documents.length > 0 ? (
                  <div className="grid grid-cols-1 gap-5">
                    {selectedRequest.documents.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-8 bg-slate-50 border-3 border-slate-100 rounded-[3rem] group hover:border-emerald-300 transition-all shadow-sm">
                        <div className="flex items-center gap-8">
                          <div className="bg-white p-5 rounded-[1.5rem] shadow-md border-2 border-slate-50">
                            <svg className="w-10 h-10 text-emerald-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                          </div>
                          <div>
                            <p className="text-2xl font-black text-slate-800 gov-heading tracking-tight">{doc.name}</p>
                            <p className="text-xs text-slate-400 font-black uppercase tracking-[0.3em] mt-2">Authenticated on {doc.uploadedAt}</p>
                          </div>
                        </div>
                        <button className="text-xs font-black text-blue-800 uppercase tracking-[0.3em] hover:underline bg-blue-50 px-6 py-3 rounded-2xl border border-blue-100 shadow-sm">Review Data</button>
                      </div>
                    ))}
                  </div>
                ) : (
                  uploadingFiles.length === 0 && (
                    <div className="border-4 border-dashed border-slate-100 rounded-[4rem] p-24 text-center bg-slate-50/50">
                      <p className="text-2xl text-slate-400 font-black italic">No secure evidence uploaded.</p>
                      <p className="text-lg text-slate-400 mt-4 font-bold">Please provide biometric or physical verification docs.</p>
                    </div>
                  )
                )}
              </div>
            </div>

            <div className="p-12 bg-slate-50 border-t-2 border-slate-100 flex gap-6">
              <button className="flex-[2] bg-emerald-900 text-white font-black py-7 rounded-[2rem] hover:bg-emerald-800 transition-all shadow-3xl shadow-emerald-900/30 text-2xl uppercase tracking-[0.1em]">
                Approve & Seal Docket
              </button>
              <button className="flex-1 bg-white border-4 border-slate-200 text-slate-700 font-black py-7 rounded-[2rem] hover:bg-slate-50 transition-all text-2xl uppercase tracking-[0.1em] shadow-sm">
                Request Audit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
