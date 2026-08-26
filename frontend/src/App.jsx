import React, { useState, useMemo } from 'react';
import {
  Building2, GraduationCap, ShieldCheck, AlertTriangle, Send,
  BarChart3, PlusCircle, CheckCircle2, Sparkles, Filter, Search,
  TrendingUp, MapPin, User, LogOut, ChevronRight, X, Layers,
  DollarSign, Check, RefreshCw, ThumbsUp, Activity, FileText, CheckCircle
} from 'lucide-react';

// Districts of Jharkhand
const jharkhandDistricts = [
  "Ranchi", "Dhanbad", "East Singhbhum (Jamshedpur)", "Bokaro", 
  "Hazaribagh", "Deoghar", "Giridih", "Ramgarh", "Dumka", 
  "Palamu", "West Singhbhum", "Latehar", "Khunti", "Gumla", 
  "Simdega", "Garhwa", "Chatra", "Koderma", "Godda", 
  "Sahebganj", "Pakur", "Jamtara", "Saraikela Kharsawan", "Lohardaga"
];

// Categories
const categories = [
  "Water & Sanitation", "Rural Electrification", "Agriculture & Irrigation", 
  "Roads & Infrastructure", "Healthcare & Telemedicine", "Education & Digital Access", 
  "Forestry & Tribal Welfare", "Mining & Environmental Safety"
];

// Initial Realistic Jharkhand Dataset
const INITIAL_PROBLEMS = [
  {
    id: 'SB-JH-1001',
    title: 'Severe groundwater arsenic contamination & failing pipeline',
    description: 'Borewell water testing in 3 tribal hamlets shows 4x safe arsenic limits, causing chronic fluorosis and skin lesions among 850+ villagers.',
    district: 'Sahebganj',
    category: 'Water & Sanitation',
    urgency: 'Critical',
    status: 'In R&D',
    citizen_name: 'Budhan Soren',
    citizen_phone: '+91 98765 43210',
    assigned_university: 'BIT Mesra Innovation Lab',
    funded_by: 'Tata Steel CSR Foundation',
    upvotes: 42,
    date: '2026-03-12'
  },
  {
    id: 'SB-JH-1002',
    title: 'Frequent elephant corridor crop-raids destroying tribal farms',
    description: 'Wild elephant herds regularly breach manual trenches near Dalma sanctuary, damaging over 45 acres of paddy and threatening lives.',
    district: 'East Singhbhum (Jamshedpur)',
    category: 'Agriculture & Irrigation',
    urgency: 'High',
    status: 'Verified',
    citizen_name: 'Sunita Devi',
    citizen_phone: '+91 94312 88901',
    assigned_university: null,
    funded_by: null,
    upvotes: 29,
    date: '2026-03-14'
  },
  {
    id: 'SB-JH-1003',
    title: 'Lack of low-cost solar cold storage for lac and minor forest produce',
    description: 'Tribal harvesters face 35% post-harvest spoilage of lac, mahua, and wild honey due to absent cold chain storage facilities.',
    district: 'Khunti',
    category: 'Forestry & Tribal Welfare',
    urgency: 'Medium',
    status: 'Funded',
    citizen_name: 'Mangal Munda',
    citizen_phone: '+91 98351 22345',
    assigned_university: 'NIT Jamshedpur Rural Tech Center',
    funded_by: 'Vedanta CSR Grant',
    upvotes: 68,
    date: '2026-03-10'
  },
  {
    id: 'SB-JH-1004',
    title: 'Unmonitored coal-dust pollution causing respiratory crisis near washeries',
    description: 'Uncovered coal transport dumpers create hazardous particulate levels (PM2.5 > 280) around primary schools in Katras area.',
    district: 'Dhanbad',
    category: 'Mining & Environmental Safety',
    urgency: 'Critical',
    status: 'Submitted',
    citizen_name: 'Rajesh Karmakar',
    citizen_phone: '+91 91223 45678',
    assigned_university: null,
    funded_by: null,
    upvotes: 51,
    date: '2026-03-15'
  }
];

export default function App() {
  // Navigation & Auth States
  const [activeTab, setActiveTab] = useState('landing');
  const [currentUser, setCurrentUser] = useState(null); // Starts as Guest
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  // Challenges State
  const [problems, setProblems] = useState(INITIAL_PROBLEMS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Submit Form States
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newDistrict, setNewDistrict] = useState('Ranchi');
  const [newCategory, setNewCategory] = useState('Water & Sanitation');
  const [newUrgency, setNewUrgency] = useState('Medium');
  const [citizenName, setCitizenName] = useState('');
  const [citizenPhone, setCitizenPhone] = useState('');
  const [submitToast, setSubmitToast] = useState(false);

  // Live AI Tagger Detection
  const aiDetectedMeta = useMemo(() => {
    const text = (newTitle + ' ' + newDescription).toLowerCase();
    let cat = 'General Civic';
    let urg = 'Medium';

    if (text.includes('water') || text.includes('arsenic') || text.includes('fluoride') || text.includes('drain') || text.includes('borewell')) {
      cat = 'Water & Sanitation';
    } else if (text.includes('elephant') || text.includes('crop') || text.includes('farm') || text.includes('paddy') || text.includes('irrigation')) {
      cat = 'Agriculture & Irrigation';
    } else if (text.includes('coal') || text.includes('dust') || text.includes('pollution') || text.includes('mining') || text.includes('toxic')) {
      cat = 'Mining & Environmental Safety';
    } else if (text.includes('solar') || text.includes('electric') || text.includes('power') || text.includes('voltage')) {
      cat = 'Rural Electrification';
    } else if (text.includes('forest') || text.includes('lac') || text.includes('mahua') || text.includes('tribal')) {
      cat = 'Forestry & Tribal Welfare';
    }

    if (text.includes('death') || text.includes('poison') || text.includes('emergency') || text.includes('severe') || text.includes('critical') || text.includes('cancer')) {
      urg = 'Critical';
    } else if (text.includes('urgent') || text.includes('frequent') || text.includes('hazard') || text.includes('attack')) {
      urg = 'High';
    }

    return { detectedCategory: cat, detectedUrgency: urg };
  }, [newTitle, newDescription]);

  // Filtered List for Explorer
  const filteredProblems = useMemo(() => {
    return problems.filter((prob) => {
      const matchesSearch =
        prob.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prob.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prob.district.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDistrict = selectedDistrict === 'All' || prob.district === selectedDistrict;
      const matchesCategory = selectedCategory === 'All' || prob.category === selectedCategory;
      return matchesSearch && matchesDistrict && matchesCategory;
    });
  }, [problems, searchQuery, selectedDistrict, selectedCategory]);

  // Actions
  const handleUpvote = (id) => {
    setProblems(prev => prev.map(p => p.id === id ? { ...p, upvotes: (p.upvotes || 0) + 1 } : p));
  };

  const handleVerifyProblem = (id) => {
    setProblems(prev => prev.map(p => p.id === id ? { ...p, status: 'Verified' } : p));
  };

  const handleAssignRND = (id, university) => {
    setProblems(prev => prev.map(p => p.id === id ? { ...p, status: 'In R&D', assigned_university: university } : p));
  };

  const handleFundCSR = (id, corporate) => {
    setProblems(prev => prev.map(p => p.id === id ? { ...p, status: 'Funded', funded_by: corporate } : p));
  };

  const handleNewSubmit = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDescription.trim()) return;

    const newEntry = {
      id: `SB-JH-${Math.floor(1000 + Math.random() * 9000)}`,
      title: newTitle,
      description: newDescription,
      district: newDistrict,
      category: aiDetectedMeta.detectedCategory !== 'General Civic' ? aiDetectedMeta.detectedCategory : newCategory,
      urgency: aiDetectedMeta.detectedUrgency,
      status: 'Submitted',
      citizen_name: citizenName || 'Verified Citizen',
      citizen_phone: citizenPhone || '+91 9XXXXXXXXX',
      assigned_university: null,
      funded_by: null,
      upvotes: 1,
      date: 'Just now'
    };

    setProblems([newEntry, ...problems]);
    setShowSubmitModal(false);
    setNewTitle('');
    setNewDescription('');
    setCitizenName('');
    setCitizenPhone('');
    setSubmitToast(true);
    setTimeout(() => setSubmitToast(false), 4000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      
      {/* SUCCESS TOAST */}
      {submitToast && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-500 text-slate-950 px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-400 font-bold animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
          <span>Challenge submitted to Jharkhand Nodal Desk!</span>
        </div>
      )}

      {/* ULTRA-MODERN GLASS NAVBAR */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 py-3.5 flex items-center justify-between">
          
          {/* Logo */}
          <div onClick={() => setActiveTab('landing')} className="flex items-center gap-3 cursor-pointer select-none group">
            <div className="h-10 w-10 bg-gradient-to-tr from-emerald-500 via-teal-400 to-emerald-300 rounded-xl flex items-center justify-center text-slate-950 font-black text-xl shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-300">
              S
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold text-white tracking-tight group-hover:text-emerald-300 transition-colors">
                  SocioBridge
                </span>
                <span className="text-[10px] uppercase font-mono font-bold bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  SIH26043
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Jharkhand Multi-Stakeholder R&D Engine</p>
            </div>
          </div>

          {/* Navigation Pill */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800 shadow-inner">
            <button 
              onClick={() => setActiveTab('landing')} 
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                activeTab === 'landing' ? 'bg-slate-800 text-emerald-400 shadow-sm' : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              Overview
            </button>
            <button 
              onClick={() => setActiveTab('admin')} 
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                activeTab === 'admin' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30 shadow-sm' : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" /> Govt Verification
            </button>
            <button 
              onClick={() => setActiveTab('university')} 
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                activeTab === 'university' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30 shadow-sm' : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" /> University R&D
            </button>
            <button 
              onClick={() => setActiveTab('industry')} 
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                activeTab === 'industry' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-sm' : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" /> Industry CSR
            </button>
            <button 
              onClick={() => setActiveTab('analytics')} 
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                activeTab === 'analytics' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-sm' : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" /> Live Impact
            </button>
          </nav>

          {/* Action Controls */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setShowSubmitModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-200 hover:-translate-y-0.5 flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" /> Report Issue
            </button>

            {currentUser ? (
              <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1.5 rounded-xl">
                <div className="text-right pl-2 hidden sm:block">
                  <span className="text-xs font-bold text-white block leading-tight">{currentUser.name}</span>
                  <span className="text-[10px] text-emerald-400 font-semibold">{currentUser.role}</span>
                </div>
                <button
                  onClick={() => setShowLoginModal(true)}
                  title="Switch Persona"
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => { setCurrentUser(null); setActiveTab('landing'); }}
                  title="Logout"
                  className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowLoginModal(true)}
                className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
              >
                <User className="w-3.5 h-3.5 text-emerald-400" /> Demo Login
              </button>
            )}
          </div>
        </div>
      </header>

      {/* VIEW 1: LANDING OVERVIEW */}
      {activeTab === 'landing' && (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 flex-1 w-full">
          
          {/* HERO BANNER */}
          <section className="relative rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 p-8 sm:p-12 md:p-14 text-white shadow-2xl overflow-hidden">
            <div className="absolute -right-24 -top-24 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-3xl space-y-6 relative z-10">
              <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/25 px-3.5 py-1.5 rounded-full text-xs font-semibold text-emerald-300 shadow-inner">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                State of Jharkhand Civic R&D Infrastructure (SIH26043)
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]">
                Turning Ground Realities into <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">Funded Engineering Solutions.</span>
              </h1>

              <p className="text-sm sm:text-base text-slate-300/90 leading-relaxed max-w-2xl font-normal">
                SocioBridge connects rural and urban citizens directly with Jharkhand Government departments, university research labs (BIT Mesra, NIT Jamshedpur), and CSR partners (Tata Steel, Vedanta) to crowdsource, verify, and resolve grassroot challenges.
              </p>
              
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => setShowSubmitModal(true)}
                  className="px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-extrabold rounded-xl text-xs sm:text-sm shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-200 hover:-translate-y-0.5 flex items-center gap-2"
                >
                  <Send className="w-4 h-4" /> Submit a Local Challenge
                </button>
                <button
                  onClick={() => setActiveTab('analytics')}
                  className="px-6 py-3.5 bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white font-semibold rounded-xl text-xs sm:text-sm border border-slate-700 transition-all duration-200 backdrop-blur-md flex items-center gap-2 shadow-sm"
                >
                  <BarChart3 className="w-4 h-4 text-emerald-400" /> Live Impact Metrics
                </button>
              </div>
            </div>
          </section>

          {/* 4-STEP COLLABORATION PIPELINE */}
          <section className="space-y-5">
            <div>
              <h2 className="text-xl font-extrabold text-white tracking-tight">How SocioBridge Works</h2>
              <p className="text-xs text-slate-400">A synchronized 4-stage lifecycle from civic report to deployed hardware.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { step: '01', title: 'Citizen Intake', desc: 'Citizens report issues with real-time AI category and urgency detection.', icon: PlusCircle, badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
                { step: '02', title: 'Govt Verification', desc: 'Nodal officers validate legitimacy, prioritize urgency, and route to R&D.', icon: ShieldCheck, badge: 'bg-blue-500/10 text-blue-400 border-blue-500/30' },
                { step: '03', title: 'University R&D', desc: 'BIT Mesra & NIT Jamshedpur adopt verified issues as capstone projects.', icon: GraduationCap, badge: 'bg-purple-500/10 text-purple-400 border-purple-500/30' },
                { step: '04', title: 'Industry CSR', desc: 'Tata Steel and corporate partners pledge hardware grants and deployment.', icon: Building2, badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
              ].map((item, i) => (
                <div key={i} className="bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-slate-800 shadow-lg hover:border-slate-700 hover:-translate-y-1 transition-all duration-300 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-black text-slate-700 font-mono tracking-tighter">{item.step}</span>
                    <div className={`p-2.5 rounded-xl border ${item.badge}`}>
                      <item.icon className="w-5 h-5" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">{item.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed mt-1.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* CHALLENGE EXPLORER & FEED */}
          <section className="space-y-6">
            <div className="bg-slate-900/70 backdrop-blur-md p-5 rounded-2xl border border-slate-800 shadow-xl space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
                    <Layers className="w-5 h-5 text-emerald-400" /> Ground Reality Pipeline
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Explore verified challenges across Jharkhand's 24 districts undergoing university research or CSR sponsorship.
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl self-start md:self-auto">
                  <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                  Showing {filteredProblems.length} Active Challenges
                </div>
              </div>

              {/* Filters */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2 border-t border-slate-800">
                <div className="sm:col-span-5 relative">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by keywords, village, or problem..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs font-medium text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition"
                  />
                </div>

                <div className="sm:col-span-4">
                  <select
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs font-semibold text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition cursor-pointer"
                  >
                    <option value="All">All 24 Jharkhand Districts</option>
                    {jharkhandDistricts.map((dist) => (
                      <option key={dist} value={dist}>{dist}</option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-3">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs font-semibold text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition cursor-pointer"
                  >
                    <option value="All">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Challenges Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredProblems.map((prob) => {
                const statusStyle = 
                  prob.status === 'Verified' ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' :
                  prob.status === 'In R&D' ? 'bg-purple-500/10 text-purple-400 border-purple-500/30' :
                  prob.status === 'Funded' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                  'bg-amber-500/10 text-amber-400 border-amber-500/30';

                const urgencyStyle =
                  prob.urgency === 'High' || prob.urgency === 'Critical' ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' :
                  prob.urgency === 'Medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                  'bg-slate-800 text-slate-300 border-slate-700';

                return (
                  <div
                    key={prob.id}
                    className="bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800/90 shadow-xl hover:shadow-2xl hover:border-slate-700 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between p-5 space-y-4 group"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full border ${statusStyle}`}>
                          {prob.status}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${urgencyStyle}`}>
                          {prob.urgency} Urgency
                        </span>
                      </div>

                      <div>
                        <h3 className="font-extrabold text-white text-base leading-snug group-hover:text-emerald-300 transition-colors">
                          {prob.title}
                        </h3>
                        <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                          {prob.description}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-slate-800 text-slate-300 px-2.5 py-1 rounded-lg">
                          <MapPin className="w-3 h-3 text-emerald-400" /> {prob.district}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-slate-800 text-slate-300 px-2.5 py-1 rounded-lg">
                          {prob.category}
                        </span>
                      </div>

                      {prob.assigned_university && (
                        <div className="p-2.5 bg-purple-500/10 rounded-xl border border-purple-500/20 text-[11px] text-purple-300 flex items-center gap-2">
                          <GraduationCap className="w-4 h-4 text-purple-400 flex-shrink-0" />
                          <span className="font-medium truncate"><strong>R&D Lead:</strong> {prob.assigned_university}</span>
                        </div>
                      )}
                      {prob.funded_by && (
                        <div className="p-2.5 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-[11px] text-emerald-300 flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                          <span className="font-medium truncate"><strong>CSR Backer:</strong> {prob.funded_by}</span>
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                      <button
                        onClick={() => handleUpvote(prob.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold bg-slate-800/80 hover:bg-emerald-500/20 hover:text-emerald-300 text-slate-300 border border-slate-700 transition"
                      >
                        <ThumbsUp className="w-3.5 h-3.5 text-emerald-400" /> {prob.upvotes || 0}
                      </button>
                      <span className="text-[11px] text-slate-500 font-mono">
                        {prob.id}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </main>
      )}

      {/* VIEW 2: GOVT VERIFICATION */}
      {activeTab === 'admin' && (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 flex-1 w-full">
          <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-blue-400" /> Govt Nodal Officer Desk
              </h2>
              <p className="text-xs text-slate-400 mt-1">Verify raw citizen intake reports and approve legitimate problems for University R&D adoption.</p>
            </div>
          </div>

          <div className="grid gap-4">
            {problems.map((prob) => (
              <div key={prob.id} className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1 max-w-3xl">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-400">{prob.id}</span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">{prob.district}</span>
                    <span className="text-xs font-bold text-amber-400">{prob.status}</span>
                  </div>
                  <h3 className="text-base font-bold text-white">{prob.title}</h3>
                  <p className="text-xs text-slate-400">{prob.description}</p>
                </div>
                <div>
                  {prob.status === 'Submitted' ? (
                    <button
                      onClick={() => handleVerifyProblem(prob.id)}
                      className="px-4 py-2 bg-blue-500 hover:bg-blue-400 text-slate-950 font-bold rounded-xl text-xs transition"
                    >
                      Approve & Verify
                    </button>
                  ) : (
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Verified
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </main>
      )}

      {/* VIEW 3: UNIVERSITY R&D */}
      {activeTab === 'university' && (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 flex-1 w-full">
          <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                <GraduationCap className="w-6 h-6 text-purple-400" /> University Engineering R&D Desk
              </h2>
              <p className="text-xs text-slate-400 mt-1">BIT Mesra & NIT Jamshedpur capstone project matchmaker.</p>
            </div>
          </div>

          <div className="grid gap-4">
            {problems.filter(p => p.status === 'Verified' || p.status === 'In R&D').map((prob) => (
              <div key={prob.id} className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1 max-w-3xl">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-purple-300">{prob.category}</span>
                  <h3 className="text-base font-bold text-white">{prob.title}</h3>
                  <p className="text-xs text-slate-400">{prob.description}</p>
                </div>
                <div>
                  {!prob.assigned_university ? (
                    <button
                      onClick={() => handleAssignRND(prob.id, 'BIT Mesra Innovation Lab')}
                      className="px-4 py-2 bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold rounded-xl text-xs transition"
                    >
                      Adopt for BIT Mesra R&D
                    </button>
                  ) : (
                    <span className="text-xs font-bold text-purple-300 bg-purple-500/10 px-3 py-1.5 rounded-xl border border-purple-500/20">
                      Assigned to {prob.assigned_university}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </main>
      )}

      {/* VIEW 4: INDUSTRY CSR */}
      {activeTab === 'industry' && (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 flex-1 w-full">
          <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                <Building2 className="w-6 h-6 text-amber-400" /> Industry CSR Deployment Desk
              </h2>
              <p className="text-xs text-slate-400 mt-1">Tata Steel, Vedanta & Jindal CSR grant pledge portal.</p>
            </div>
          </div>

          <div className="grid gap-4">
            {problems.filter(p => p.status === 'In R&D' || p.status === 'Funded').map((prob) => (
              <div key={prob.id} className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1 max-w-3xl">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-amber-300">{prob.district}</span>
                  <h3 className="text-base font-bold text-white">{prob.title}</h3>
                  <p className="text-xs text-slate-400">{prob.description}</p>
                </div>
                <div>
                  {!prob.funded_by ? (
                    <button
                      onClick={() => handleFundCSR(prob.id, 'Tata Steel CSR Foundation')}
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition"
                    >
                      Pledge Tata Steel CSR Grant
                    </button>
                  ) : (
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
                      Funded by {prob.funded_by}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </main>
      )}

      {/* VIEW 5: LIVE IMPACT ANALYTICS */}
      {activeTab === 'analytics' && (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 flex-1 w-full">
          <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-emerald-400" /> State Impact Dashboard
            </h2>
            <p className="text-xs text-slate-400 mt-1">Real-time resolution metrics across Jharkhand districts.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
              <span className="text-xs font-bold text-slate-400 uppercase">Total Submissions</span>
              <p className="text-3xl font-black text-white mt-2">{problems.length}</p>
            </div>
            <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
              <span className="text-xs font-bold text-blue-400 uppercase">Govt Verified</span>
              <p className="text-3xl font-black text-blue-400 mt-2">{problems.filter(p => p.status !== 'Submitted').length}</p>
            </div>
            <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
              <span className="text-xs font-bold text-purple-400 uppercase">Active University R&D</span>
              <p className="text-3xl font-black text-purple-400 mt-2">{problems.filter(p => p.status === 'In R&D' || p.status === 'Funded').length}</p>
            </div>
            <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
              <span className="text-xs font-bold text-emerald-400 uppercase">CSR Backed Deployments</span>
              <p className="text-3xl font-black text-emerald-400 mt-2">{problems.filter(p => p.status === 'Funded').length}</p>
            </div>
          </div>
        </main>
      )}

      {/* SUBMIT MODAL WITH REAL-TIME AI TAGGER */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <PlusCircle className="w-5 h-5 text-emerald-400" /> Report Ground Challenge
                </h3>
                <p className="text-xs text-slate-400">Citizen intake system with instant NLP classification.</p>
              </div>
              <button onClick={() => setShowSubmitModal(false)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleNewSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Challenge Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Borewell water turning red with heavy sludge"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500/30 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Detailed Description</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe exact ground conditions, affected families, and village location..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500/30 focus:outline-none"
                />
              </div>

              {/* LIVE AI DETECTOR BADGE */}
              <div className="p-3 bg-slate-950/90 rounded-xl border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
                  <span className="text-[11px] text-slate-300 font-semibold">Real-Time AI Auto-Tagger:</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded-md border border-emerald-500/30">
                    {aiDetectedMeta.detectedCategory}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-rose-500/10 text-rose-400 rounded-md border border-rose-500/30">
                    {aiDetectedMeta.detectedUrgency} Urgency
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">District</label>
                  <select
                    value={newDistrict}
                    onChange={(e) => setNewDistrict(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200"
                  >
                    {jharkhandDistricts.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Your Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Ramesh Mahto"
                    value={citizenName}
                    onChange={(e) => setCitizenName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black rounded-xl text-xs shadow-lg shadow-emerald-500/25 transition mt-2"
              >
                Submit Issue to State Registry
              </button>
            </form>
          </div>
        </div>
      )}

      {/* DEMO LOGIN MODAL */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-white">Switch Demo Stakeholder</h3>
                <p className="text-xs text-slate-400">Test different role perspectives in 1-click.</p>
              </div>
              <button onClick={() => setShowLoginModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid gap-2 pt-2">
              {[
                { name: 'Dr. A. Verma (IAS)', role: 'Govt Nodal Officer', tab: 'admin', color: 'border-blue-500/40 hover:bg-blue-500/10' },
                { name: 'Prof. S. Banerjee', role: 'BIT Mesra R&D Lead', tab: 'university', color: 'border-purple-500/40 hover:bg-purple-500/10' },
                { name: 'R. K. Singhania', role: 'Tata Steel CSR Head', tab: 'industry', color: 'border-amber-500/40 hover:bg-amber-500/10' },
                { name: 'Sanjay Murmu', role: 'Rural Citizen Advocate', tab: 'landing', color: 'border-emerald-500/40 hover:bg-emerald-500/10' },
              ].map((persona, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setCurrentUser(persona);
                    setActiveTab(persona.tab);
                    setShowLoginModal(false);
                  }}
                  className={`p-3.5 rounded-xl border bg-slate-950 text-left transition flex items-center justify-between ${persona.color}`}
                >
                  <div>
                    <span className="text-xs font-bold text-white block">{persona.name}</span>
                    <span className="text-[10px] text-slate-400">{persona.role}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80 py-6 text-center text-xs text-slate-500">
        <p>SocioBridge • Jharkhand Civic-Academic-CSR Collaborative Engine • SIH26043</p>
      </footer>
    </div>
  );
}