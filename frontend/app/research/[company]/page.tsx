'use client';

import { useEffect, useState, use } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../../../components/layout/Navbar';
import { useResearchStream } from '../../../hooks/useResearchStream';
import AgentPipeline from '../../../components/research/AgentPipeline';
import ResearchSidebar from '../../../components/research/ResearchSidebar';
import ContentTabs, { TabId } from '../../../components/research/ContentTabs';
import BullBearDebate from '../../../components/research/BullBearDebate';
import NewsTab from '../../../components/research/NewsTab';
import CompetitorTable from '../../../components/research/CompetitorTable';
import FilingTab from '../../../components/research/FilingTab';
import RedTeamTab from '../../../components/research/RedTeamTab';
import MemoTab from '../../../components/research/MemoTab';

export default function ResearchPage({ params }: { params: Promise<{ company: string }> }) {
  const { company } = use(params);
  const [activeTab, setActiveTab] = useState<TabId>('bullbear');
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({ message: '', visible: false });

  const {
    startStream,
    isComplete,
    error,
    agents,
    resolvedCompany,
    scoreData,
    newsData,
    compsData,
    filingData,
    criticData
  } = useResearchStream();

  useEffect(() => {
    if (company) {
      startStream(decodeURIComponent(company));
    }
  }, [company, startStream]);

  useEffect(() => {
    if (isComplete && scoreData) {
      setToast({ message: `Analysis complete — ${resolvedCompany?.name || decodeURIComponent(company)} scored ${scoreData.score}/100`, visible: true });
      const timer = setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 4000);
      return () => clearTimeout(timer);
    }
  }, [isComplete, scoreData, resolvedCompany, company]);

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'bullbear':
        return (
          <BullBearDebate 
            bullContent={agents.bull?.content} 
            bearContent={agents.bear?.content} 
          />
        );
      case 'news':
        return <NewsTab data={newsData || undefined} />;
      case 'comps':
        return <CompetitorTable data={compsData || undefined} targetCompany={resolvedCompany?.name || decodeURIComponent(company)} />;
      case 'filing':
        return <FilingTab data={filingData || undefined} />;
      case 'critic':
        return <RedTeamTab data={criticData || undefined} reflectionStatus={agents.reflection?.status === 'active' ? 'Reflection loop triggered — re-running analysis' : undefined} />;
      case 'memo':
        return <MemoTab content={agents.memo?.content} companySlug={company} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Navbar />
      
      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
        <ResearchSidebar 
          companySlug={company}
          resolvedCompany={resolvedCompany}
          scoreData={scoreData}
          isComplete={isComplete}
          agents={agents}
        />
        
        <main className="flex-1 flex flex-col p-6 overflow-y-auto bg-base">
          <div className="max-w-6xl w-full mx-auto">
            
            {error && (
              <div className="mb-6 bg-bear/10 border border-bear text-bear p-4 rounded-lg flex items-center justify-between">
                <div>
                  <h4 className="font-bold mb-1">Error</h4>
                  <p className="text-sm">{error}</p>
                </div>
                <button 
                  onClick={() => startStream(decodeURIComponent(company))}
                  className="px-4 py-2 bg-bear text-white text-sm rounded-md font-medium hover:bg-bear/90"
                >
                  Retry
                </button>
              </div>
            )}
            
            <AgentPipeline agents={agents} />
            
            <div className="mt-8">
              <ContentTabs activeTab={activeTab} onChange={setActiveTab}>
                {renderActiveTabContent()}
              </ContentTabs>
            </div>
            
          </div>
        </main>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast.visible && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: 20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-6 right-6 bg-surface border border-border shadow-2xl p-4 rounded-lg flex items-center gap-3 z-50"
          >
            <div className="w-2 h-2 rounded-full bg-bull animate-pulse" />
            <span className="text-sm font-medium text-text-primary">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
