"use client";

import { useState, useEffect } from 'react';
import { Send, Loader2, BarChart2, Upload, Database, CheckCircle2, Menu, Plus, MessageSquare, LogOut } from 'lucide-react';
import DynamicChart from '@/components/DynamicChart';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function Dashboard() {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [activeDataset, setActiveDataset] = useState(null);
  const [conversation, setConversation] = useState([]);
  const [currentDashboard, setCurrentDashboard] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [chatHistory, setChatHistory] = useState([]);
  const [userName, setUserName] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
    const storedUser = localStorage.getItem('synapse_user');
    if (storedUser) {
      setUserName(storedUser);
    } else {
      router.push('/');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('synapse_user');
    router.push('/');
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setActiveDataset(file.name);
    setIsUploading(true);
    setConversation((prev) => [...prev, { role: 'ai', content: `Uploading ${file.name}...` }]);

    try {
      const formData = new FormData();
      formData.append('file', file);
      await axios.post('http://localhost:8000/api/upload', formData);
      setIsUploading(false);
      setConversation((prev) => [...prev, { role: 'ai', content: "File ready! What's your first question?" }]);
    } catch (error) {
      setIsUploading(false);
      setConversation((prev) => [...prev, { role: 'ai', content: "Upload failed. Is the backend running?" }]);
    }
  };

  const handleSend = async () => {
    if (!prompt.trim() || !activeDataset) return;
    
    const currentPrompt = prompt;
    setConversation((prev) => [...prev, { role: 'user', content: currentPrompt }]);
    setPrompt('');
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:8000/api/query', { query: currentPrompt });
      const { message, chartData, chartType, dataKeys } = response.data;
      setConversation((prev) => [...prev, { role: 'ai', content: message }]);
      setCurrentDashboard({ chartData, chartType, dataKeys });
      setChatHistory((prev) => [currentPrompt, ...prev]);
    } catch (error) {
      setConversation((prev) => [...prev, { role: 'ai', content: "Error processing query." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-gray-50 overflow-hidden">
      
      {!isMounted ? (
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <Loader2 className="animate-spin text-blue-600" size={48} />
        </div>
      ) : (
        <>
          {/* SIDEBAR */}
          <aside className={`${isSidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 bg-gray-900 flex flex-col overflow-hidden shrink-0`}>
            <div className="w-64 flex flex-col h-full">
              <div className="p-6 text-white font-bold text-sm tracking-widest uppercase opacity-60">History</div>
              <div className="px-4 mb-4">
                <button onClick={() => {setConversation([]); setCurrentDashboard(null);}} className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-500 transition">
                  <Plus size={18}/> New Analysis
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-4 space-y-2">
                {chatHistory.map((item, i) => (
                  <div key={i} className="p-3 bg-gray-800/50 rounded-lg text-gray-300 text-sm truncate cursor-pointer hover:bg-gray-800">
                    {item}
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white uppercase">
                    {userName ? userName.charAt(0) : 'U'}
                  </div>
                  <div className="text-white text-sm font-medium capitalize">{userName}</div>
                </div>
                <button onClick={handleLogout} className="text-gray-500 hover:text-red-400 transition">
                  <LogOut size={20} />
                </button>
              </div>
            </div>
          </aside>

          {/* CHAT AREA */}
          <section className="w-100 flex flex-col bg-white border-r border-gray-200">
            <header className="p-5 border-b flex items-center justify-between bg-white">
              <div className="flex items-center gap-3">
                <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-gray-100 rounded-lg"><Menu size={20}/></button>
                <span className="font-bold text-gray-800">SynapseBI AI</span>
              </div>
            </header>

            <div className="p-4 bg-gray-50/50 border-b flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                    <Database size={14} /> {activeDataset || "No Data"}
                </div>
                <label className="text-xs bg-white border px-3 py-1.5 rounded-lg font-bold cursor-pointer hover:bg-gray-50 transition shadow-sm">
                    {isUploading ? "..." : "Upload CSV"}
                    <input type="file" className="hidden" onChange={handleFileUpload} />
                </label>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {conversation.map((msg, i) => (
                <div key={i} className={`p-4 rounded-2xl text-sm leading-relaxed ${msg.role === 'user' ? 'bg-blue-600 text-white ml-auto' : 'bg-gray-100 text-gray-800 mr-auto'} max-w-[85%]`}>
                  {msg.content}
                </div>
              ))}
              {isLoading && <Loader2 className="animate-spin text-blue-600 mx-auto" />}
            </div>

            <div className="p-5 border-t">
              <div className="relative">
                <input 
                  className="w-full bg-gray-100 border-none rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-blue-600 transition outline-none" 
                  placeholder="Ask a question..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                />
                <button onClick={handleSend} className="absolute right-3 top-2.5 p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition">
                  <Send size={20}/>
                </button>
              </div>
            </div>
          </section>

          {/* CANVAS */}
          <main className="flex-1 bg-gray-50 p-10 overflow-y-auto">
            <h1 className="text-2xl font-bold text-gray-800 mb-8">Visualization Canvas</h1>
            {currentDashboard ? (
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 w-full h-[60vh] min-h-100">
                <DynamicChart 
                  data={currentDashboard.chartData} 
                  type={currentDashboard.chartType} 
                  dataKeys={currentDashboard.dataKeys} 
                />
              </div>
            ) : (
              <div className="h-[60vh] flex flex-col items-center justify-center text-gray-400 italic">
                <BarChart2 size={80} className="mb-4 opacity-20" />
                <p>Select a dataset and ask a question to generate charts.</p>
              </div>
            )}
          </main>
        </>
      )}
    </div>
  );
}