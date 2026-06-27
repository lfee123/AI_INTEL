"use client";

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useResearchStream } from '@/lib/useResearchStream';
import ResearchStream from '@/components/ResearchStream';
import InvestmentScoreDial from '@/components/InvestmentScoreDial';
import BullBearDebate from '@/components/BullBearDebate';
import InvestmentMemo from '@/components/InvestmentMemo';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function ResearchPage() {
  const pathname = usePathname();
  const companySlug = pathname.split('/').pop() || '';
  const company = decodeURIComponent(companySlug);
  
  const { updates, startResearch, isStreaming, error, finalState } = useResearchStream();
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (company && !started) {
      startResearch(company);
      setStarted(true);
    }
  }, [company, started, startResearch]);

  // Extract latest state from updates or finalState
  let currentState: any = finalState || {};
  if (!finalState && updates.length > 0) {
    // try to accumulate state naively from updates if we wanted, 
    // but the backend sends the state in final event.
    // For intermediate UI, we use the agent updates.
  }
  
  const bullUpdate = [...updates].reverse().find(u => u.agent === 'bull' && u.content);
  const bearUpdate = [...updates].reverse().find(u => u.agent === 'bear' && u.content);
  const scoreUpdate = finalState ? { score: finalState.investment_score, verdict: finalState.verdict, sub_scores: finalState.sub_scores } : [...updates].reverse().find(u => u.agent === 'scorer');

  return (
    <main className="min-h-screen bg-[#0B0F19] text-gray-100 p-8 font-sans selection:bg-blue-500/30">
      <div className="max-w-7xl mx-auto">
        <Link href="/" className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-8 font-semibold transition-colors">
          <ChevronLeft size={20} /> Back to Search
        </Link>
        
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              {company}
            </h1>
            <p className="text-gray-400 mt-2 text-lg">Live AI Research & Due Diligence</p>
          </div>
          {isStreaming && (
            <div className="flex items-center gap-2 bg-blue-900/30 text-blue-400 px-4 py-2 rounded-full border border-blue-800 animate-pulse">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
              </span>
              Agents Active
            </div>
          )}
        </div>
        
        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 p-4 rounded-lg mb-8">
            <strong>Error:</strong> {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <ResearchStream updates={updates} isStreaming={isStreaming} company={company} />
          </div>
          <div>
            {(scoreUpdate || finalState) ? (
              <InvestmentScoreDial 
                score={scoreUpdate?.score || finalState?.investment_score || 0} 
                verdict={scoreUpdate?.verdict || finalState?.verdict || 'HOLD'} 
                subScores={scoreUpdate?.sub_scores || finalState?.sub_scores || {}} 
              />
            ) : (
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 shadow-2xl h-full flex items-center justify-center text-gray-500 flex-col gap-4">
                <div className="w-16 h-16 border-4 border-gray-800 border-t-blue-500 rounded-full animate-spin"></div>
                <p>Computing Investment Score...</p>
              </div>
            )}
          </div>
        </div>

        <BullBearDebate 
          bullThesis={finalState?.bull_thesis || bullUpdate?.content} 
          bearThesis={finalState?.bear_thesis || bearUpdate?.content} 
        />
        
        {finalState?.memo && (
          <InvestmentMemo memoHtml={finalState.memo} ticker={finalState.ticker} />
        )}
      </div>
    </main>
  );
}
