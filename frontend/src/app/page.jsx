/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BarChart2, MessageSquare, Zap, ArrowRight, X, Loader2, LogOut, Upload, BrainCircuit, LineChart } from 'lucide-react';

export default function LandingPage() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); 
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
    const storedUser = localStorage.getItem('synapse_user');
    if (storedUser) {
      setLoggedInUser(storedUser);
    }
  }, []);

  const handleOpenModal = (mode) => {
    setAuthMode(mode);
    setIsLoginModalOpen(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('synapse_user');
    setLoggedInUser(null);
  };

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const name = formData.get('name'); 
    
    setTimeout(() => {
      setIsProcessing(false);
      
      const displayUser = authMode === 'signup' ? (name || email.split('@')[0]) : (loggedInUser || email.split('@')[0]);
      
      localStorage.setItem('synapse_user', displayUser);
      setLoggedInUser(displayUser);
      setIsLoginModalOpen(false);
      router.push('/dashboard');
    }, 1500);
  };

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans relative overflow-x-hidden w-full">
      
      {/* Background Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/20 blur-[120px] animate-pulse pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/20 blur-[120px] animate-pulse pointer-events-none" style={{ animationDelay: '2s' }}></div>

      {/* Navbar */}
      <nav className="relative z-10 flex flex-wrap items-center justify-between p-4 md:p-6 max-w-7xl mx-auto border-b border-slate-800/50">
        <div className="flex items-center gap-2 text-blue-400 mb-4 md:mb-0">
          <BarChart2 size={32} />
          <span className="text-2xl font-bold tracking-tight text-white">SynapseBI</span>
        </div>
        
        <div className="flex items-center gap-3 md:gap-4">
          {loggedInUser ? (
            <>
              <span className="text-slate-300 font-medium hidden md:block">
                Welcome, <span className="text-white capitalize">{loggedInUser}</span>
              </span>
              <button onClick={() => router.push('/dashboard')} className="px-4 md:px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-medium transition shadow-lg shadow-blue-500/25 text-sm md:text-base">
                Dashboard
              </button>
              <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 bg-slate-800 md:bg-transparent rounded-lg md:rounded-none text-slate-300 hover:text-red-400 font-medium transition text-sm md:text-base">
                <LogOut size={18} />
                <span>Log Out</span>
              </button>
            </>
          ) : (
            <>
              <button onClick={() => handleOpenModal('login')} className="px-4 md:px-5 py-2 text-slate-300 hover:text-white font-medium transition text-sm md:text-base">
                Log In
              </button>
              <button onClick={() => handleOpenModal('signup')} className="px-5 md:px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-medium transition shadow-lg shadow-blue-500/25 text-sm md:text-base">
                Sign Up
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-5xl mx-auto px-6 pt-24 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-8">
          <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
        </div>

        <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight mb-8 text-white">
          Chat with your data. <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-indigo-400">
            Instantly.
          </span>
        </h1>
        
        <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
          No SQL. No complex BI tools. Just type your business questions in plain English and let our AI generate interactive, presentation-ready dashboards.
        </p>
        
        <button 
          onClick={() => loggedInUser ? router.push('/dashboard') : handleOpenModal('signup')}
          className="inline-flex items-center gap-2 px-8 py-4 bg-white text-slate-900 text-lg rounded-full font-bold hover:bg-slate-200 transition shadow-xl hover:-translate-y-1"
        >
          {loggedInUser ? "Go to Dashboard" : "Start for free"} <ArrowRight size={20} />
        </button>
      </main>

      {/* Features Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20 border-t border-slate-800">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Why choose SynapseBI?</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">We bridge the gap between complex datasets and actionable business insights using the power of generative AI.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 text-left">
          <div className="bg-slate-900/50 p-8 rounded-3xl border border-slate-800 hover:border-slate-700 transition">
            <div className="w-12 h-12 bg-slate-900 border border-slate-800 text-blue-400 rounded-xl flex items-center justify-center mb-6 shadow-inner">
              <MessageSquare size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">Natural Language</h3>
            <p className="text-slate-400 leading-relaxed text-sm">
              Ask questions like &quot;Show me Q3 revenue by region&quot; and let our AI handle the complex SQL queries instantly. No coding required.
            </p>
          </div>
          
          <div className="bg-slate-900/50 p-8 rounded-3xl border border-slate-800 hover:border-slate-700 transition">
            <div className="w-12 h-12 bg-slate-900 border border-slate-800 text-indigo-400 rounded-xl flex items-center justify-center mb-6 shadow-inner">
              <Zap size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">Real-Time Insights</h3>
            <p className="text-slate-400 leading-relaxed text-sm">
              Stop waiting days for reports from the data team. Upload your CSV and get immediate visual answers to drive instant decisions.
            </p>
          </div>
          
          <div className="bg-slate-900/50 p-8 rounded-3xl border border-slate-800 hover:border-slate-700 transition">
            <div className="w-12 h-12 bg-slate-900 border border-slate-800 text-purple-400 rounded-xl flex items-center justify-center mb-6 shadow-inner">
              <BarChart2 size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">Dynamic Rendering</h3>
            <p className="text-slate-400 leading-relaxed text-sm">
              Our system automatically selects and renders the perfect chart (bar, line, or pie) to match your specific dataset and query.
            </p>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="relative z-10 bg-slate-900 border-t border-slate-800 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">How it works</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">From raw data to beautiful dashboards in three simple steps.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-linear-to-r from-blue-600/0 via-blue-600/50 to-blue-600/0 z-0"></div>

            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-slate-950 border-4 border-slate-900 text-blue-500 rounded-full flex items-center justify-center mb-6 shadow-xl">
                <Upload size={32} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">1. Upload your Data</h3>
              <p className="text-slate-400 text-sm">Securely upload your business CSV files directly into the SynapseBI platform.</p>
            </div>

            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-slate-950 border-4 border-slate-900 text-indigo-500 rounded-full flex items-center justify-center mb-6 shadow-xl">
                <BrainCircuit size={32} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">2. Ask a Question</h3>
              <p className="text-slate-400 text-sm">Type what you want to know in plain English using the chat interface.</p>
            </div>

            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-slate-950 border-4 border-slate-900 text-purple-500 rounded-full flex items-center justify-center mb-6 shadow-xl">
                <LineChart size={32} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">3. View Insights</h3>
              <p className="text-slate-400 text-sm">Our AI translates your question into SQL, executes it, and draws the perfect chart.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800 bg-slate-950 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-slate-400">
            <BarChart2 size={24} className="text-blue-500" />
            <span className="text-xl font-bold text-white">SynapseBI</span>
          </div>
          <p className="text-slate-500 text-sm text-center md:text-left">
            © {new Date().getFullYear()} SynapseBI. Empowering businesses with AI-driven insights.
          </p>
          <div className="flex gap-6 text-sm font-medium text-slate-400">
            <a href="#" className="hover:text-blue-400 transition">Privacy Policy</a>
            <a href="#" className="hover:text-blue-400 transition">Terms of Service</a>
            <a href="#" className="hover:text-blue-400 transition">Contact</a>
          </div>
        </div>
      </footer>

      {/* Login / Signup Modal */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-md w-full relative shadow-2xl">
            <button onClick={() => setIsLoginModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white transition">
              <X size={20} />
            </button>
            
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600/20 text-blue-400 rounded-xl mb-4">
                <BarChart2 size={24} />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                {authMode === 'login' ? 'Welcome Back' : 'Create an Account'}
              </h2>
              <p className="text-slate-400 text-sm">
                {authMode === 'login' ? 'Enter your credentials to access your dashboards.' : 'Sign up to start chatting with your data.'}
              </p>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-4" autoComplete="off">
              {authMode === 'signup' && (
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
                  <input 
                    type="text" 
                    name="name" 
                    required 
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition" 
                  />
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Email Address</label>
                <input 
                  type="email" 
                  name="email" 
                  required 
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
                <input 
                  type="password" 
                  name="password" 
                  required 
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition" 
                />
              </div>
              
              <button type="submit" disabled={isProcessing} className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-lg px-4 py-2.5 font-medium transition flex items-center justify-center gap-2 mt-6">
                {isProcessing ? <Loader2 size={18} className="animate-spin" /> : (authMode === 'login' ? 'Log In' : 'Sign Up')}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-slate-400">
              {authMode === 'login' ? (
                <span>Don&apos;t have an account? </span>
              ) : (
                <span>Already have an account? </span>
              )}
              <button onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')} className="text-blue-400 hover:text-blue-300 font-medium transition">
                {authMode === 'login' ? 'Sign up' : 'Log in'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}