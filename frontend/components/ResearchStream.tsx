import React from 'react';
import { AgentUpdate } from '../lib/useResearchStream';
import { Activity, CheckCircle, Circle, RefreshCw } from 'lucide-react';

interface Props {
  updates: AgentUpdate[];
  isStreaming: boolean;
  company: string;
}

const AGENTS = [
  "planner", "news", "comps", "filing", "bull", "bear", "critic", "scorer", "reflection", "memo"
];

const AGENT_NAMES: Record<string, string> = {
  planner: "Planning Agent",
  news: "News Sentiment Agent",
  comps: "Competitor Comparison Agent",
  filing: "Filing Analysis Agent",
  bull: "Bull Case Agent",
  bear: "Bear Case Agent",
  critic: "Red Team Critic",
  scorer: "Investment Scorer",
  reflection: "Reflection Loop",
  memo: "Memo Writer"
};

export default function ResearchStream({ updates, isStreaming, company }: Props) {
  // Track which agents have started and finished based on events
  const agentStatus = new Map<string, 'pending' | 'running' | 'completed'>();
  
  AGENTS.forEach(a => agentStatus.set(a, 'pending'));
  
  updates.forEach(u => {
    if (u.agent) {
      agentStatus.set(u.agent, 'running');
    }
  });
  
  // A simple heuristic: if an agent appears before another in standard sequence, it might be done.
  // Actually, without an explicit 'completed' event, we can assume it's done if the *next* agent starts.
  // For simplicity, we just mark running if we see an update.
  
  return (
    <div className="bg-gray-900 rounded-xl p-6 shadow-2xl border border-gray-800">
      <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <Activity className={isStreaming ? "animate-pulse text-green-400" : "text-gray-500"} />
        Live Agent Stream {company && `- ${company}`}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
        {AGENTS.map((agent) => {
          const status = agentStatus.get(agent);
          const hasUpdates = updates.some(u => u.agent === agent);
          
          return (
            <div 
              key={agent} 
              className={`p-4 rounded-lg border transition-all duration-500 flex flex-col items-center text-center gap-2
                ${hasUpdates 
                  ? 'bg-blue-900/20 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.3)]' 
                  : 'bg-gray-800/50 border-gray-700 opacity-50'}
              `}
            >
              {hasUpdates && !isStreaming ? (
                <CheckCircle className="text-green-400" size={24} />
              ) : hasUpdates ? (
                <RefreshCw className="text-blue-400 animate-spin" size={24} />
              ) : (
                <Circle className="text-gray-600" size={24} />
              )}
              <span className="text-sm font-semibold text-gray-200">{AGENT_NAMES[agent]}</span>
            </div>
          );
        })}
      </div>
      
      <div className="bg-black/50 rounded-lg p-4 h-[300px] overflow-y-auto font-mono text-sm">
        {updates.length === 0 ? (
          <div className="text-gray-500 italic">Waiting to begin research pipeline...</div>
        ) : (
          updates.map((update, idx) => (
            <div key={idx} className="mb-3 border-l-2 border-blue-500 pl-3 py-1">
              <span className="text-blue-400 font-bold uppercase mr-2">[{update.agent}]</span>
              <span className="text-gray-300">
                {update.status || "Processing..."}
              </span>
              {update.content && (
                <div className="mt-2 text-gray-400 pl-4 border-l border-gray-700 italic">
                  {update.content.substring(0, 150)}...
                </div>
              )}
              {update.agent === 'news' && update.sentiment_score !== undefined && (
                <div className="mt-1 text-yellow-400">Score: {update.sentiment_score.toFixed(1)}</div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
