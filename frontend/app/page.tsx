"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Zap, BarChart2, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const [company, setCompany] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (company.trim()) {
      router.push(`/research/${encodeURIComponent(company.trim())}`);
    }
  };

  return (
    <main className="min-h-screen bg-[#0B0F19] text-gray-100 font-sans selection:bg-blue-500/30 flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 mt-20">
        <div className="text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-900/30 border border-blue-500/30 text-blue-400 mb-8 font-semibold tracking-wide">
            <Zap size={18} /> AlphaIntel AI Pipeline v1.0
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">
            Institutional-Grade <br/>
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent">
              Investment Research
            </span>
          </h1>
          
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Deploy a swarm of AI agents to analyze SEC filings, market data, news sentiment, and competitor comps in seconds. Get an instant, unbiased investment verdict.
          </p>

          <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto w-full group">
            <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
              <Search className="text-gray-500 group-focus-within:text-blue-500 transition-colors" size={24} />
            </div>
            <input
              type="text"
              className="w-full bg-gray-900 border-2 border-gray-800 text-white placeholder-gray-500 rounded-2xl pl-16 pr-32 py-5 text-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all shadow-2xl"
              placeholder="Enter a company name or ticker..."
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
            <button
              type="submit"
              className="absolute right-3 top-3 bottom-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl px-8 transition-colors text-lg"
            >
              Analyze
            </button>
          </form>

          <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-4 text-sm font-medium">
            <Link 
              href="/tournament"
              className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 px-6 py-3 rounded-lg transition-colors w-full sm:w-auto justify-center"
            >
              <BarChart2 size={18} className="text-purple-400" />
              Tournament Mode (Beta)
            </Link>
          </div>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="w-full max-w-7xl mx-auto p-8 grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        <div className="bg-gray-900 border border-gray-800 p-8 rounded-2xl">
          <div className="bg-blue-900/30 w-12 h-12 rounded-lg flex items-center justify-center mb-6 border border-blue-500/30">
            <BarChart2 className="text-blue-400" />
          </div>
          <h3 className="text-xl font-bold mb-3">Multi-Agent Debate</h3>
          <p className="text-gray-400">Bull and Bear agents construct opposing theses, verified by a Red Team Critic to eliminate confirmation bias.</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 p-8 rounded-2xl">
          <div className="bg-purple-900/30 w-12 h-12 rounded-lg flex items-center justify-center mb-6 border border-purple-500/30">
            <Zap className="text-purple-400" />
          </div>
          <h3 className="text-xl font-bold mb-3">Live Streaming</h3>
          <p className="text-gray-400">Watch the research pipeline execute in real-time. See exactly what each agent is analyzing via Server-Sent Events.</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 p-8 rounded-2xl">
          <div className="bg-green-900/30 w-12 h-12 rounded-lg flex items-center justify-center mb-6 border border-green-500/30">
            <ShieldAlert className="text-green-400" />
          </div>
          <h3 className="text-xl font-bold mb-3">Investment Memos</h3>
          <p className="text-gray-400">Automatically generate and download institutional-quality PDF Investment Memos complete with scoring and verdicts.</p>
        </div>
      </div>
    </main>
  );
}
