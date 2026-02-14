
import React, { useState, useEffect } from 'react';
import { UserRole } from '../types';
import { Icons } from '../constants';

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
}

interface UploadingFile {
  id: string;
  name: string;
  progress: number;
}

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [isOnboarding, setIsOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  
  // New Farmer Form State
  const [newFarmer, setNewFarmer] = useState({
    name: '',
    location: '',
    state: '',
    landSize: '',
    crops: [] as string[],
    documents: [] as { name: string; type: string }[]
  });

  // Simulated initial state
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
      status: 'Processing',
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
        currentProgress += Math.random() * 30;
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
      }, 400);
    });

    event.target.value = '';
  };

  const handleOnboardingNext = () => setOnboardingStep(prev => Math.min(prev + 1, 4));
  const handleOnboardingBack = () => setOnboardingStep(prev => Math.max(prev - 1, 1));
  
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
      }))
    };
    setRequests([newReq, ...requests]);
    setIsOnboarding(false);
    setOnboardingStep(1);
    setNewFarmer({ name: '', location: '', state: '', landSize: '', crops: [], documents: [] });
  };

  const getDocStatusBadge = (status: Request['docVerificationStatus']) => {
    switch (status) {
      case 'SECURED':
        return <span className="inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 uppercase tracking-widest border border-emerald-200">AUTHENTICATED</span>;
      case 'PENDING':
        return <span className="inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black bg-blue-100 text-blue-800 uppercase tracking-widest border border-blue-200">IN REVIEW</span>;
      case 'FAILED':
        return <span className="inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black bg-rose-100 text-rose-800 uppercase tracking-widest border border-rose-200">REJECTED</span>;
      case 'NONE':
      default:
        return <span className="inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black bg-slate-100 text-slate-400 uppercase tracking-widest border border-slate-200">NO DATA</span>;
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
                  <th className="px-10 py-7">DOC STATUS</th>
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
                           <span className="text-xs text-rose-500 font-black uppercase tracking-widest bg-rose-50 px-3 py-1 rounded-full border border-rose-100">Pending Docs</span>
                         )}
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      {getDocStatusBadge(req.docVerificationStatus)}
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
                  onClick={() => setIsOnboarding(false)}
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
                <div className="space-y-8 animate-in slide-in-from-right duration-300">
                  <h4 className="text-3xl font-black text-slate-900 gov-heading">Step 1: Personal Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
              )}

              {onboardingStep === 2 && (
                <div className="space-y-8 animate-in slide-in-from-right duration-300">
                  <h4 className="text-3xl font-black text-slate-900 gov-heading">Step 2: Land & Location</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest">State / UT</label>
                      <select 
                        value={newFarmer.state}
                        onChange={(e) => setNewFarmer({...newFarmer, state: e.target.value})}
                        className="w-full bg-slate-50 border-3 border-slate-100 rounded-2xl p-6 text-xl font-bold outline-none focus:border-emerald-500 transition-all appearance-none"
                      >
                        <option value="">Select State</option>
                        <option value="Rajasthan">Rajasthan</option>
                        <option value="Punjab">Punjab</option>
                        <option value="Maharashtra">Maharashtra</option>
                      </select>
                    </div>
                    <div className="space-y-3">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest">District / Tehsil</label>
                      <input 
                        type="text" 
                        value={newFarmer.location}
                        onChange={(e) => setNewFarmer({...newFarmer, location: e.target.value})}
                        className="w-full bg-slate-50 border-3 border-slate-100 rounded-2xl p-6 text-xl font-bold outline-none focus:border-emerald-500 transition-all"
                        placeholder="e.g. Jhalawar"
                      />
                    </div>
                    <div className="col-span-2 space-y-3">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Total Cultivable Land Size (Hectares)</label>
                      <input 
                        type="text" 
                        value={newFarmer.landSize}
                        onChange={(e) => setNewFarmer({...newFarmer, landSize: e.target.value})}
                        className="w-full bg-slate-50 border-3 border-slate-100 rounded-2xl p-6 text-xl font-bold outline-none focus:border-emerald-500 transition-all"
                        placeholder="e.g. 12.5"
                      />
                    </div>
                  </div>
                </div>
              )}

              {onboardingStep === 3 && (
                <div className="space-y-8 animate-in slide-in-from-right duration-300">
                  <h4 className="text-3xl font-black text-slate-900 gov-heading">Step 3: Document Verification</h4>
                  <p className="text-lg text-slate-500 font-bold mb-6">Please upload clear scanned copies of supporting documents for validation.</p>
                  
                  <div className="grid grid-cols-1 gap-6">
                    {['Aadhar Identity Proof', 'State Land Registry Deed', 'Village Sarpanch Certificate'].map((docLabel) => (
                      <div key={docLabel} className="p-8 border-4 border-dashed border-slate-100 rounded-[3rem] flex items-center justify-between group hover:border-emerald-200 transition-all">
                        <div className="flex items-center gap-6">
                          <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-2xl flex items-center justify-center">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          </div>
                          <div>
                            <p className="text-xl font-black text-slate-800">{docLabel}</p>
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Required: PDF, JPG (Max 5MB)</p>
                          </div>
                        </div>
                        <label className="cursor-pointer bg-slate-900 text-white px-8 py-3 rounded-2xl text-xs font-black hover:bg-emerald-900 transition-all uppercase tracking-widest">
                          Attach File
                          <input 
                            type="file" 
                            className="hidden" 
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if(f) setNewFarmer({...newFarmer, documents: [...newFarmer.documents, { name: f.name, type: f.type }]});
                            }}
                          />
                        </label>
                      </div>
                    ))}
                    
                    {newFarmer.documents.length > 0 && (
                      <div className="pt-6 space-y-3">
                        <p className="text-xs font-black text-emerald-700 uppercase tracking-widest">Uploaded Files ({newFarmer.documents.length})</p>
                        {newFarmer.documents.map((d, i) => (
                          <div key={i} className="flex items-center gap-3 bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                            <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/></svg>
                            <span className="text-sm font-bold text-emerald-800">{d.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
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
                    <p className="text-xl text-emerald-800 font-bold max-w-lg mx-auto leading-relaxed">Identity and land records are synchronized. Upon submission, a regional inspector will be assigned for physical validation.</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-8 px-8">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Farmer Name</p>
                      <p className="text-2xl font-black text-slate-800">{newFarmer.name || 'Not provided'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Location</p>
                      <p className="text-2xl font-black text-slate-800">{newFarmer.location}, {newFarmer.state}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Registered Land</p>
                      <p className="text-2xl font-black text-slate-800">{newFarmer.landSize} Hectares</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Evidence Docket</p>
                      <p className="text-2xl font-black text-emerald-700">{newFarmer.documents.length} SECURED FILES</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-12 bg-slate-50 border-t-2 border-slate-100 flex gap-6">
              {onboardingStep > 1 && (
                <button 
                  onClick={handleOnboardingBack}
                  className="flex-1 bg-white border-4 border-slate-200 text-slate-700 font-black py-7 rounded-[2rem] hover:bg-slate-50 transition-all text-2xl uppercase tracking-[0.1em]"
                >
                  Back
                </button>
              )}
              {onboardingStep < 4 ? (
                <button 
                  onClick={handleOnboardingNext}
                  className="flex-[2] bg-emerald-950 text-white font-black py-7 rounded-[2rem] hover:bg-emerald-800 transition-all shadow-3xl shadow-emerald-900/30 text-2xl uppercase tracking-[0.1em]"
                >
                  Save & Continue
                </button>
              ) : (
                <button 
                  onClick={finishOnboarding}
                  className="flex-[2] bg-emerald-600 text-white font-black py-7 rounded-[2rem] hover:bg-emerald-500 transition-all shadow-3xl shadow-emerald-600/30 text-2xl uppercase tracking-[0.1em]"
                >
                  Finalize Registry
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Existing Verification Detail Modal (Enhanced with Multi-upload & Progress) */}
      {selectedRequest && !isOnboarding && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-8 bg-slate-900/90 backdrop-blur-xl animate-in fade-in zoom-in duration-300">
          <div className="bg-white rounded-[4rem] shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col border-8 border-white">
            <div className="p-12 border-b-2 border-slate-50 flex items-center justify-between bg-slate-50/30">
              <div>
                <p className="text-xs font-black text-emerald-700 uppercase tracking-[0.3em] mb-3">Verification Service Unit</p>
                <h3 className="text-5xl font-black text-slate-900 gov-heading tracking-tighter leading-none">{selectedRequest.name}</h3>
                <p className="text-sm font-black text-slate-400 mt-4 uppercase tracking-[0.4em]">REFERENCE DOCKET: {selectedRequest.id}</p>
              </div>
              <button 
                onClick={() => setSelectedRequest(null)}
                className="p-4 hover:bg-slate-200 rounded-[1.5rem] transition-all border-2 border-slate-100 group shadow-sm"
              >
                <svg className="w-10 h-10 text-slate-400 group-hover:text-slate-900 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-grow p-12 overflow-y-auto space-y-16">
              {/* Summary Section */}
              <div className="grid grid-cols-2 gap-12">
                <div className="space-y-3">
                  <p className="text-xs text-slate-400 uppercase font-black tracking-[0.3em]">Administrative Action</p>
                  <p className="text-2xl font-black text-slate-800 gov-heading tracking-tight">{selectedRequest.type}</p>
                </div>
                <div className="space-y-3">
                  <p className="text-xs text-slate-400 uppercase font-black tracking-[0.3em]">Docket Entry Date</p>
                  <p className="text-2xl font-black text-slate-800 gov-heading tracking-tight">{selectedRequest.date}</p>
                </div>
                <div className="col-span-2 space-y-4 p-10 bg-amber-50 rounded-[3rem] border-2 border-amber-100 shadow-inner">
                  <p className="text-xs text-amber-800 uppercase font-black tracking-[0.3em]">Current Protocol Status</p>
                  <div className="flex items-center gap-5">
                    <div className="relative flex h-5 w-5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-5 w-5 bg-amber-600"></span>
                    </div>
                    <p className="text-4xl font-black text-amber-900 tracking-tighter">{selectedRequest.status}</p>
                  </div>
                </div>
              </div>

              {/* Supporting Evidence (Enhanced) */}
              <div>
                <div className="flex items-center justify-between mb-8">
                  <h4 className="text-3xl font-black text-slate-900 flex items-center gap-4 gov-heading tracking-tight">
                    <div className="scale-125"><Icons.Shield /></div> Supporting Evidence
                  </h4>
                  <label className="cursor-pointer bg-emerald-900 hover:bg-emerald-800 text-white px-8 py-4 rounded-2xl text-xs font-black transition-all shadow-2xl shadow-emerald-900/20 uppercase tracking-[0.2em] flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    Upload Documents
                    <input 
                      type="file" 
                      multiple 
                      className="hidden" 
                      onChange={(e) => handleFileUpload(selectedRequest.id, e)} 
                    />
                  </label>
                </div>

                {/* Progress Indicators for Uploading Files */}
                {uploadingFiles.length > 0 && (
                  <div className="mb-10 space-y-4">
                    <p className="text-xs font-black text-emerald-700 uppercase tracking-[0.3em]">In-Progress Uploads</p>
                    <div className="grid grid-cols-1 gap-4">
                      {uploadingFiles.map((file) => (
                        <div key={file.id} className="p-6 bg-emerald-50 border-2 border-emerald-100 rounded-[2.5rem] animate-pulse">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-4">
                              <svg className="w-6 h-6 text-emerald-600 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              <span className="text-lg font-black text-emerald-900">{file.name}</span>
                            </div>
                            <span className="text-sm font-black text-emerald-800">{file.progress}%</span>
                          </div>
                          <div className="w-full h-3 bg-white rounded-full overflow-hidden border border-emerald-100">
                            <div 
                              className="h-full bg-emerald-500 transition-all duration-300 ease-out"
                              style={{ width: `${file.progress}%` }}
                            ></div>
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
                            <svg className="w-10 h-10 text-emerald-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-2xl font-black text-slate-800 gov-heading tracking-tight">{doc.name}</p>
                            <p className="text-xs text-slate-400 font-black uppercase tracking-[0.3em] mt-2">Authenticated on {doc.uploadedAt}</p>
                          </div>
                        </div>
                        <button className="text-xs font-black text-blue-800 uppercase tracking-[0.3em] hover:underline bg-blue-50 px-6 py-3 rounded-2xl border border-blue-100">Review Data</button>
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
              
              {/* Notes */}
              <div className="bg-blue-50 p-12 rounded-[3.5rem] border-2 border-blue-100 shadow-inner">
                <p className="text-xs font-black text-blue-900 uppercase tracking-[0.4em] mb-6">Official Adjudication Notes</p>
                <textarea 
                  className="w-full bg-white border-3 border-blue-100 rounded-[2rem] p-8 text-xl font-bold text-slate-800 outline-none focus:ring-8 focus:ring-blue-100 min-h-[200px] shadow-inner placeholder-blue-200"
                  placeholder="Record verification logs, inspector reports, or audit findings..."
                ></textarea>
              </div>
            </div>

            <div className="p-12 bg-slate-50 border-t-2 border-slate-100 flex gap-6">
              <button className="flex-[2] bg-emerald-900 text-white font-black py-7 rounded-[2rem] hover:bg-emerald-800 transition-all shadow-3xl shadow-emerald-900/30 text-2xl uppercase tracking-[0.1em]">
                Approve & Seal Docket
              </button>
              <button className="flex-1 bg-white border-4 border-slate-200 text-slate-700 font-black py-7 rounded-[2rem] hover:bg-slate-50 transition-all text-2xl uppercase tracking-[0.1em]">
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
