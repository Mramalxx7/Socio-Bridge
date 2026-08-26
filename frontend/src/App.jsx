import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  GraduationCap, 
  Briefcase, 
  Users, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Search, 
  PlusCircle, 
  MapPin, 
  ShieldCheck, 
  Send, 
  Sparkles, 
  Award, 
  Layers, 
  BarChart3, 
  ArrowUpRight, 
  ThumbsUp, 
  User, 
  X,
  Database,
  CheckCircle
} from 'lucide-react';
import { supabase } from './supabaseClient';

const INITIAL_CHALLENGES = [
  {
    id: 1,
    title: "Groundwater Fluoride Contamination in Palamu Rural Habitations",
    category: "Water & Sanitation",
    location: "Palamu District",
    urgency: "Critical",
    status: "R&D in Progress",
    assignedTo: "BIT Mesra (Env. Sci. Lab)",
    csrSponsor: "Tata Steel Foundation (₹14.5L)",
    description: "Excessive fluoride concentration (>3.2 mg/L) in deep borewells across 14 Panchayats causing severe skeletal fluorosis among children. Urgent need for low-cost, decentralized adsorptive filtration media.",
    votes: 342,
    date: "2026-08-14"
  },
  {
    id: 2,
    title: "Post-Harvest Lac Shelling & Processing Machine for Tribal Self-Help Groups",
    category: "Agriculture & Livelihood",
    location: "Khunti District",
    urgency: "High",
    status: "Verified by Govt",
    assignedTo: "Seeking Academic Partner",
    csrSponsor: "Seeking CSR Grant (₹8L Required)",
    description: "Manual scraping and peeling of raw sticklac causes 40% value loss. Need a solar-powered portable peeling and grading machine for Panchayat common facility centres.",
    votes: 218,
    date: "2026-08-20"
  },
  {
    id: 3,
    title: "Coal Dust Air Quality Monitoring & Botanical Green Barrier Optimization",
    category: "Environment & Mining",
    location: "Dhanbad District",
    urgency: "High",
    status: "R&D in Progress",
    assignedTo: "IIT (ISM) Dhanbad",
    csrSponsor: "Vedanta CSR (₹25L)",
    description: "Heavy PM2.5/PM10 dispersion around overburden coal dump sites affecting residential bastis. Implementing IoT sensory mesh and native fast-canopy flora.",
    votes: 512,
    date: "2026-08-10"
  },
  {
    id: 4,
    title: "Cold Chain Breakdown in Remote Primary Health Sub-Centres",
    category: "Healthcare",
    location: "West Singhbhum",
    urgency: "Critical",
    status: "Needs Verification",
    assignedTo: "Unassigned",
    csrSponsor: "Unassigned",
    description: "Erratic grid electricity in tribal pockets leads to spoilage of neonatal vaccines. Requires phase-change material smart passive refrigeration units.",
    votes: 189,
    date: "2026-08-24"
  }
];

const PERSONAS = [
  { id: 'Citizen', name: 'Ramesh Munda', role: 'Gram Panchayat', badge: 'Rural Stakeholder' },
  { id: 'Govt Admin', name: 'Dr. S. K. Verma, IAS', role: 'District Magistrate', badge: 'Govt Verifier' },
  { id: 'University R&D', name: 'Prof. Ananya Sen', role: 'BIT Mesra Lab Lead', badge: 'Academic Lab' },
  { id: 'Industry CSR', name: 'Vikramaditya Roy', role: 'Head CSR (Tata Steel)', badge: 'Funding Partner' }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('overview'); // overview, govt, university, csr, impact
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Modals & User state
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [currentPersona, setCurrentPersona] = useState(PERSONAS[0]);

  // Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Water & Sanitation');
  const [newLocation, setNewLocation] = useState('Ranchi');
  const [newUrgency, setNewUrgency] = useState('High');
  const [newDescription, setNewDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [aiTaggingNotice, setAiTaggingNotice] = useState(false);

  // 1. Fetch Challenges from Supabase
  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('challenges')
        .select('*')
        .order('id', { ascending: false });

      if (error || !data || data.length === 0) {
        setChallenges(INITIAL_CHALLENGES);
      } else {
        setChallenges(data);
      }
    } catch (err) {
      setChallenges(INITIAL_CHALLENGES);
    } finally {
      setLoading(false);
    }
  };

  // AI Category Auto-detection
  const handleTitleChange = (val) => {
    setNewTitle(val);
    const lower = val.toLowerCase();
    if (lower.includes('water') || lower.includes('pani') || lower.includes('fluoride') || lower.includes('arsenic')) {
      setNewCategory('Water & Sanitation');
      setAiTaggingNotice(true);
    } else if (lower.includes('farmer') || lower.includes('kisan') || lower.includes('crop') || lower.includes('lac') || lower.includes('kheti')) {
      setNewCategory('Agriculture & Livelihood');
      setAiTaggingNotice(true);
    } else if (lower.includes('dust') || lower.includes('coal') || lower.includes('mine') || lower.includes('pollution')) {
      setNewCategory('Environment & Mining');
      setAiTaggingNotice(true);
    } else if (lower.includes('health') || lower.includes('hospital') || lower.includes('vaccine') || lower.includes('fever')) {
      setNewCategory('Healthcare');
      setAiTaggingNotice(true);
    }
  };

  // 2. Submit Challenge to Supabase
  const handleSubmitChallenge = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const newRecord = {
      title: newTitle,
      category: newCategory,
      location: newLocation.includes('District') ? newLocation : `${newLocation} District`,
      urgency: newUrgency,
      status: 'Needs Verification',
      description: newDescription,
      votes: 1
    };

    try {
      const { data, error } = await supabase
        .from('challenges')
        .insert([newRecord])
        .select();

      if (error) {
        setChallenges([{ ...newRecord, id: Date.now() }, ...challenges]);
      } else if (data && data.length > 0) {
        setChallenges([data[0], ...challenges]);
      }
    } catch (err) {
      setChallenges([{ ...newRecord, id: Date.now() }, ...challenges]);
    } finally {
      setSubmitting(false);
      setShowSubmitModal(false);
      setNewTitle('');
      setNewDescription('');
      setAiTaggingNotice(false);
    }
  };

  // 3. Upvote challenge
  const handleVote = async (id, currentVotes) => {
    const updatedVotes = (currentVotes || 0) + 1;
    setChallenges(challenges.map(c => c.id === id ? { ...c, votes: updatedVotes } : c));

    try {
      await supabase
        .from('challenges')
        .update({ votes: updatedVotes })
        .eq('id', id);
    } catch (err) {
      console.error(err);
    }
  };

  // 4. University Lab Claim Action
  const handleClaimLab = async (id, labName) => {
    setChallenges(challenges.map(c => c.id === id ? { ...c, status: 'R&D in Progress', assignedTo: labName } : c));
    try {
      await supabase
        .from('challenges')
        .update({ status: 'R&D in Progress', assignedTo: labName })
        .eq('id', id);
      alert(`Success! Project claimed by ${labName}`);
    } catch (err) {
      alert("Updated locally.");
    }
  };

  // 5. Industry CSR Sponsor Action
  const handleSponsorCSR = async (id, sponsorName, grantAmount) => {
    setChallenges(challenges.map(c => c.id === id ? { ...c, csrSponsor: `${sponsorName} (${grantAmount})`, status: 'Funded & Piloting' } : c));
    try {
      await supabase
        .from('challenges')
        .update({ csrSponsor: `${sponsorName} (${grantAmount})`, status: 'Funded & Piloting' })
        .eq('id', id);
      alert(`Grant of ${grantAmount} successfully allocated by ${sponsorName}!`);
    } catch (err) {
      alert("Grant allocated locally.");
    }
  };

  const filteredChallenges = challenges.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (c.description && c.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCat = selectedCategory === 'All' || c.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  // Live Metrics calculations
  const totalVotes = challenges.reduce((sum, c) => sum + (c.votes || 0), 0);
  const activeCount = challenges.length;

  return (
    <div className="min-h-screen bg-[#070e17] text-slate-100 font-sans antialiased selection:bg-teal-400 selection:text-slate-950">
      
      {/* ================= TOP NAVBAR ================= */}
      <header className="sticky top-0 z-40 bg-[#0a121e]/95 backdrop-blur-md border-b border-slate-800/80 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between py-3">
          
          {/* Brand Logo & Tag */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('overview')}>
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 font-bold text-lg shadow-inner">
              S
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight text-white">
                  SocioBridge
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-teal-950 text-teal-400 border border-teal-800 font-mono font-bold">
                  SIH26043
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Jharkhand Multi-Stakeholder R&D Engine</p>
            </div>
          </div>

          {/* Capsule Navigation Tabs */}
          <nav className="hidden lg:flex items-center bg-[#071320] p-1.5 rounded-full border border-slate-800 text-xs">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-1.5 rounded-full transition font-semibold text-xs ${
                activeTab === 'overview' ? 'bg-[#2dd4bf] text-slate-950 shadow-sm' : 'text-slate-300 hover:text-white'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('govt')}
              className={`px-3.5 py-1.5 rounded-full transition font-medium text-xs flex items-center gap-1.5 ${
                activeTab === 'govt' ? 'bg-[#2dd4bf] text-slate-950 font-semibold shadow-sm' : 'text-slate-300 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
              <span>Govt Verification</span>
            </button>
            <button
              onClick={() => setActiveTab('university')}
              className={`px-3.5 py-1.5 rounded-full transition font-medium text-xs flex items-center gap-1.5 ${
                activeTab === 'university' ? 'bg-[#2dd4bf] text-slate-950 font-semibold shadow-sm' : 'text-slate-300 hover:text-white'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5 text-teal-400" />
              <span>University R&D</span>
            </button>
            <button
              onClick={() => setActiveTab('csr')}
              className={`px-3.5 py-1.5 rounded-full transition font-medium text-xs flex items-center gap-1.5 ${
                activeTab === 'csr' ? 'bg-[#2dd4bf] text-slate-950 font-semibold shadow-sm' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5 text-teal-400" />
              <span>Industry CSR</span>
            </button>
            <button
              onClick={() => setActiveTab('impact')}
              className={`px-3.5 py-1.5 rounded-full transition font-medium text-xs flex items-center gap-1.5 ${
                activeTab === 'impact' ? 'bg-[#2dd4bf] text-slate-950 font-semibold shadow-sm' : 'text-slate-300 hover:text-white'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 text-teal-400" />
              <span>Live Impact</span>
            </button>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            {/* Mint Report Issue Button */}
            <button
              onClick={() => setShowSubmitModal(true)}
              className="flex items-center space-x-1.5 bg-[#ccfbf1] hover:bg-[#99f6e4] text-teal-950 font-bold px-4 py-2 rounded-full text-xs sm:text-sm transition-all shadow-md active:scale-95 border border-teal-200"
            >
              <PlusCircle className="w-4 h-4 text-teal-900" />
              <span>Report Issue</span>
            </button>

            {/* FIXED: Dynamic Logged-in User Button */}
            <button
              onClick={() => setShowLoginModal(true)}
              className="flex items-center space-x-2 bg-[#0e1d2d] hover:bg-[#15273b] text-teal-300 border border-teal-800/80 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition active:scale-95"
            >
              <User className="w-4 h-4 text-teal-400" />
              <span>{currentPersona.name}</span>
              <span className="text-[10px] bg-teal-950 px-1.5 py-0.5 rounded text-teal-400 hidden sm:inline">
                {currentPersona.id}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        <div className="flex lg:hidden overflow-x-auto border-t border-slate-800/80 px-3 py-1.5 gap-1 text-xs">
          {['overview', 'govt', 'university', 'csr', 'impact'].map(t => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-3 py-1 rounded-full whitespace-nowrap text-xs font-medium capitalize ${
                activeTab === t ? 'bg-[#2dd4bf] text-slate-950 font-bold' : 'text-slate-400'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </header>

      {/* ================= MAIN CONTAINER ================= */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* ================= TAB 1: OVERVIEW ================= */}
        {activeTab === 'overview' && (
          <>
            {/* Hero Card */}
            <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#0c283d] via-[#091b29] to-[#040f17] border border-cyan-900/40 p-8 md:p-12 shadow-2xl">
              <div className="max-w-3xl space-y-4">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-950/70 border border-teal-700/50 text-teal-300 text-xs font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  State of Jharkhand Civic R&D Infrastructure (SIH26043)
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
                  Turning Ground Realities into Funded Engineering Solutions.
                </h1>
                <p className="text-slate-300/90 text-xs sm:text-sm md:text-base leading-relaxed">
                  SocioBridge connects rural and urban citizens directly with Jharkhand Government departments, university research labs (BIT Mesra, NIT Jamshedpur), and CSR partners (Tata Steel, Vedanta).
                </p>
                <div className="pt-2 flex flex-wrap gap-3">
                  <button
                    onClick={() => setShowSubmitModal(true)}
                    className="bg-[#ccfbf1] hover:bg-[#99f6e4] text-teal-950 font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm transition flex items-center gap-2 shadow-lg"
                  >
                    <Send className="w-3.5 h-3.5 rotate-45 text-teal-900" />
                    Submit a Local Challenge
                  </button>
                  <button
                    onClick={() => setActiveTab('impact')}
                    className="bg-slate-800/80 hover:bg-slate-700 text-white border border-slate-700 font-semibold px-5 py-2.5 rounded-xl text-xs sm:text-sm transition flex items-center gap-2"
                  >
                    <BarChart3 className="w-3.5 h-3.5 text-teal-400" />
                    Live Impact Metrics
                  </button>
                </div>
              </div>
            </div>

            {/* How SocioBridge Works */}
            <div className="space-y-3 pt-2">
              <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-300">
                HOW SOCIOBRIDGE WORKS
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { step: "01", title: "Crowdsource Problem", desc: "Citizens & Panchayats log hyper-local issues with AI auto-tagging." },
                  { step: "02", title: "Govt Department Verify", desc: "BDOs & district magistrates validate authenticity and severity." },
                  { step: "03", title: "Academic Lab Match", desc: "Engineering colleges take verified issues as funded capstone R&D." },
                  { step: "04", title: "CSR Grant Deployment", desc: "Corporate partners fund prototype manufacturing & field pilot." },
                ].map((item, idx) => (
                  <div key={idx} className="bg-[#0b1726]/80 border border-slate-800/90 rounded-2xl p-5 space-y-2">
                    <span className="text-teal-400 font-mono font-bold text-xs bg-teal-950 border border-teal-800 px-2 py-0.5 rounded-md">{item.step}</span>
                    <h3 className="font-bold text-sm text-white">{item.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Active Challenges", val: activeCount, icon: AlertCircle, color: "text-amber-400" },
                { label: "Jharkhand Districts", val: "24 / 24", icon: MapPin, color: "text-emerald-400" },
                { label: "Community Upvotes", val: totalVotes, icon: ThumbsUp, color: "text-cyan-400" },
                { label: "Committed CSR Pool", val: "₹1.85 Cr", icon: Award, color: "text-purple-400" },
              ].map((stat, idx) => (
                <div key={idx} className="bg-[#0b1726]/80 border border-slate-800 rounded-2xl p-4 flex items-center space-x-3 shadow">
                  <div className={`p-3 rounded-xl bg-slate-900 ${stat.color}`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium">{stat.label}</p>
                    <p className="text-xl font-bold text-white">{stat.val}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Search & Filter */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-[#0b1726]/80 p-4 rounded-2xl border border-slate-800">
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  placeholder="Search challenges, districts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#070e17] border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500 transition"
                />
              </div>

              <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
                {['All', 'Water & Sanitation', 'Agriculture & Livelihood', 'Environment & Mining', 'Healthcare'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs whitespace-nowrap transition font-medium ${
                      selectedCategory === cat ? 'bg-slate-800 text-teal-300 border border-teal-500/40' : 'bg-[#070e17] text-slate-400 border border-slate-800'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Challenges Feed */}
            {loading ? (
              <div className="text-center py-16 text-slate-400 text-sm animate-pulse">Loading live database records...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredChallenges.map((item) => (
                  <div key={item.id} className="bg-[#0b1726]/90 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-4 shadow-lg">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs px-2.5 py-1 rounded-md bg-slate-900 text-slate-300 font-medium border border-slate-800">
                          {item.category}
                        </span>
                        <span className="text-[11px] px-2.5 py-0.5 rounded-full font-semibold border bg-amber-950 text-amber-300 border-amber-800">
                          {item.urgency || 'High'} Urgency
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-white leading-snug">{item.title}</h3>
                      <p className="text-xs text-slate-400 line-clamp-3">{item.description}</p>
                    </div>

                    <div className="pt-3 border-t border-slate-800/80 space-y-3 text-xs">
                      <div className="flex items-center justify-between text-slate-400">
                        <span className="flex items-center gap-1 text-slate-300 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-teal-400" />
                          {item.location}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-teal-950 text-teal-400 border border-teal-900 text-[10px] font-semibold">
                          {item.status || 'Active'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => handleVote(item.id, item.votes)}
                          className="flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 px-3 py-1.5 rounded-xl font-medium transition border border-slate-800 active:scale-95"
                        >
                          <ThumbsUp className="w-3.5 h-3.5 text-teal-400" />
                          <span>{item.votes || 0} Votes</span>
                        </button>
                        <button 
                          onClick={() => setActiveTab('university')}
                          className="text-xs font-semibold text-teal-400 hover:text-teal-300 flex items-center gap-1"
                        >
                          View R&D Labs →
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ================= TAB 2: GOVT VERIFICATION ================= */}
        {activeTab === 'govt' && (
          <div className="space-y-6">
            <div className="bg-[#0b1726] border border-slate-800 rounded-3xl p-6 md:p-8 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                Departmental Verification Queue
              </div>
              <h2 className="text-2xl font-bold text-white">District Magistrate & Block Development Portal</h2>
              <p className="text-slate-400 text-xs sm:text-sm">
                Logged in as: <strong className="text-white">{currentPersona.name}</strong> ({currentPersona.role}). Review grassroot problems and approve for university research.
              </p>
            </div>

            <div className="bg-[#0b1726]/80 border border-slate-800 rounded-2xl overflow-hidden shadow">
              <div className="p-4 border-b border-slate-800 font-bold text-sm text-white flex justify-between items-center">
                <span>Pending Verification Queue</span>
                <span className="text-xs bg-amber-950 text-amber-300 border border-amber-800 px-2 py-0.5 rounded">Action Required</span>
              </div>
              <div className="divide-y divide-slate-800">
                {challenges.map((item) => (
                  <div key={item.id} className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="space-y-1 max-w-2xl">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono bg-slate-900 text-slate-300 px-2 py-0.5 rounded">{item.location}</span>
                        <span className="text-[10px] font-bold text-teal-400">{item.status}</span>
                      </div>
                      <h4 className="font-bold text-white text-sm">{item.title}</h4>
                      <p className="text-xs text-slate-400">{item.description}</p>
                    </div>
                    <button 
                      onClick={() => alert(`Verified by ${currentPersona.name} (${currentPersona.role})!`)}
                      className="bg-[#2dd4bf] hover:bg-teal-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition"
                    >
                      Verify & Approve
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 3: UNIVERSITY R&D (INTERACTIVE) ================= */}
        {activeTab === 'university' && (
          <div className="space-y-6">
            <div className="bg-[#0b1726] border border-slate-800 rounded-3xl p-6 md:p-8 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold">
                <GraduationCap className="w-3.5 h-3.5" />
                Academic R&D Matchmaker Portal
              </div>
              <h2 className="text-2xl font-bold text-white">Claim Challenges for Capstone & Lab Research</h2>
              <p className="text-slate-400 text-xs sm:text-sm">
                Active Researcher: <strong className="text-purple-300">{currentPersona.name}</strong>. Click "Adopt Problem" to assign this project to your university lab.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {challenges.map((item) => (
                <div key={item.id} className="bg-[#0b1726]/80 border border-slate-800 rounded-2xl p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <span className="text-xs bg-purple-950 text-purple-300 border border-purple-800 px-2.5 py-1 rounded font-medium">{item.category}</span>
                    <span className="text-xs text-slate-400">{item.location}</span>
                  </div>
                  <h3 className="font-bold text-sm text-white">{item.title}</h3>
                  <p className="text-xs text-slate-400">{item.description}</p>
                  
                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-[11px] text-teal-400 font-medium">Assigned Lab: {item.assignedTo || 'Unassigned'}</span>
                    <button
                      onClick={() => handleClaimLab(item.id, `BIT Mesra (${currentPersona.name})`)}
                      className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-3.5 py-1.5 rounded-xl text-xs transition"
                    >
                      Adopt for Lab R&D
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 4: INDUSTRY CSR (INTERACTIVE) ================= */}
        {activeTab === 'csr' && (
          <div className="space-y-6">
            <div className="bg-[#0b1726] border border-slate-800 rounded-3xl p-6 md:p-8 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-semibold">
                <Briefcase className="w-3.5 h-3.5" />
                Corporate Social Responsibility (CSR) Funding
              </div>
              <h2 className="text-2xl font-bold text-white">Sponsor R&D Prototype & Field Pilot</h2>
              <p className="text-slate-400 text-xs sm:text-sm">
                Corporate Sponsor: <strong className="text-teal-300">{currentPersona.name}</strong>. Allocate direct grant funds to verified engineering challenges.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {challenges.map((item) => (
                <div key={item.id} className="bg-[#0b1726]/80 border border-slate-800 rounded-2xl p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <span className="text-xs bg-teal-950 text-teal-300 border border-teal-800 px-2.5 py-1 rounded font-medium">{item.category}</span>
                    <span className="text-xs text-slate-400">{item.location}</span>
                  </div>
                  <h3 className="font-bold text-sm text-white">{item.title}</h3>
                  <p className="text-xs text-slate-400">{item.description}</p>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-[11px] text-amber-400 font-medium">Sponsor: {item.csrSponsor || 'Seeking Grant'}</span>
                    <button
                      onClick={() => handleSponsorCSR(item.id, currentPersona.name, '₹15,00,000')}
                      className="bg-[#2dd4bf] hover:bg-teal-400 text-slate-950 font-bold px-3.5 py-1.5 rounded-xl text-xs transition"
                    >
                      Allocate ₹15L CSR Grant
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 5: LIVE IMPACT METRICS ================= */}
        {activeTab === 'impact' && (
          <div className="space-y-6">
            <div className="bg-[#0b1726] border border-slate-800 rounded-3xl p-6 md:p-8 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold">
                <BarChart3 className="w-3.5 h-3.5" />
                Real-Time Jharkhand Impact Telemetry
              </div>
              <h2 className="text-2xl font-bold text-white">Live Database Statistics & Scoreboard</h2>
              <p className="text-slate-400 text-xs sm:text-sm">
                Dynamically calculated from live Supabase entries across all 24 districts.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { title: "Total Database Issues", val: activeCount, sub: "Crowdsourced from Rural Panchayats" },
                { title: "Total Community Upvotes", val: totalVotes, sub: "Active Citizen Engagement" },
                { title: "Districts Covered", val: "24 / 24 Districts", sub: "Complete State-wide Coverage" }
              ].map((m, i) => (
                <div key={i} className="bg-[#0b1726]/80 border border-slate-800 rounded-2xl p-6 text-center space-y-2">
                  <p className="text-xs text-slate-400">{m.title}</p>
                  <p className="text-2xl font-black text-teal-400">{m.val}</p>
                  <p className="text-[11px] text-slate-500">{m.sub}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* ================= DEMO LOGIN MODAL ================= */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0b1726] border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-teal-400" />
                <h2 className="text-lg font-bold text-white">Demo Persona Login</h2>
              </div>
              <button onClick={() => setShowLoginModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Select a stakeholder role to test different permissions and role-specific workflows:
            </p>

            <div className="space-y-2.5">
              {PERSONAS.map((persona) => (
                <button
                  key={persona.id}
                  onClick={() => {
                    setCurrentPersona(persona);
                    setShowLoginModal(false);
                  }}
                  className={`w-full text-left p-3.5 rounded-2xl border transition flex items-center justify-between ${
                    currentPersona.id === persona.id ? 'bg-slate-800 border-teal-500 shadow-md' : 'bg-[#070e17] border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-white">{persona.name}</p>
                    <p className="text-[11px] text-slate-400">{persona.role}</p>
                  </div>
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-900 text-teal-400 border border-slate-700">
                    {persona.badge}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= REPORT ISSUE MODAL ================= */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0b1726] border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-teal-400" />
                Report Civic / Rural Challenge
              </h2>
              <button onClick={() => setShowSubmitModal(false)} className="text-slate-400 hover:text-white text-lg font-bold">✕</button>
            </div>

            <form onSubmit={handleSubmitChallenge} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Problem Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Severe Arsenic in Drinking Water"
                  value={newTitle}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full bg-[#070e17] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-teal-500 focus:outline-none"
                />
                {aiTaggingNotice && (
                  <p className="text-[10px] text-teal-400 mt-1 flex items-center gap-1 font-medium">
                    <Sparkles className="w-3 h-3" /> AI auto-detected Category: {newCategory}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-[#070e17] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  >
                    <option>Water & Sanitation</option>
                    <option>Agriculture & Livelihood</option>
                    <option>Environment & Mining</option>
                    <option>Healthcare</option>
                    <option>Rural Energy</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">District</label>
                  <select
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full bg-[#070e17] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  >
                    {['Ranchi', 'Palamu', 'Dhanbad', 'Khunti', 'Bokaro', 'Dumka', 'Hazaribagh', 'West Singhbhum', 'Deoghar', 'Garhwa', 'Giridih'].map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Urgency Level</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Moderate', 'High', 'Critical'].map(level => (
                    <button
                      type="button"
                      key={level}
                      onClick={() => setNewUrgency(level)}
                      className={`py-2 rounded-xl text-xs font-medium border text-center transition ${
                        newUrgency === level ? 'bg-teal-500/20 border-teal-500 text-teal-300 font-bold' : 'bg-[#070e17] border-slate-800 text-slate-400'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Detailed Description</label>
                <textarea
                  rows="3"
                  required
                  placeholder="Explain the technical difficulty, affected population, etc."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full bg-[#070e17] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button type="button" onClick={() => setShowSubmitModal(false)} className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white font-medium">Cancel</button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-[#2dd4bf] hover:bg-teal-400 text-slate-950 font-bold px-5 py-2 rounded-xl text-xs transition shadow-lg active:scale-95 disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Database className="w-3.5 h-3.5" />
                  {submitting ? 'Saving...' : 'Save to Live Database'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}