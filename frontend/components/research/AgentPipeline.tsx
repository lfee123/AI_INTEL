import { motion } from 'framer-motion';
import { 
  Brain, TrendingUp, TrendingDown, Newspaper, 
  BarChart2, FileText, Shield, Calculator, FileCheck, Check
} from 'lucide-react';
import { AgentType } from '../../lib/types';

interface AgentState {
  status: 'idle' | 'active' | 'complete' | 'error';
  completionTimeMs?: number;
  error?: string;
  data?: any;
}

interface AgentPipelineProps {
  agents: Record<AgentType, AgentState>;
}

const AGENT_ORDER: { id: AgentType; icon: any; label: string }[] = [
  { id: 'planner', icon: Brain, label: 'PLANNER' },
  { id: 'bull', icon: TrendingUp, label: 'BULL' },
  { id: 'bear', icon: TrendingDown, label: 'BEAR' },
  { id: 'news', icon: Newspaper, label: 'NEWS' },
  { id: 'comps', icon: BarChart2, label: 'COMPS' },
  { id: 'filing', icon: FileText, label: 'FILING' },
  { id: 'critic', icon: Shield, label: 'CRITIC' },
  { id: 'scorer', icon: Calculator, label: 'SCORER' },
  { id: 'memo', icon: FileCheck, label: 'MEMO' },
];

export default function AgentPipeline({ agents }: AgentPipelineProps) {
  return (
    <div className="w-full flex items-center justify-between relative px-2 py-6 mb-8 bg-surface border border-border rounded-xl shadow-lg">
      <div className="absolute top-1/2 left-8 right-8 h-px bg-border -translate-y-1/2 -z-10" />
      
      {AGENT_ORDER.map((agentConfig, index) => {
        const state = agents[agentConfig.id];
        const isComplete = state?.status === 'complete';
        const isActive = state?.status === 'active';
        const isError = state?.status === 'error';
        const Icon = agentConfig.icon;

        return (
          <div key={agentConfig.id} className="relative flex flex-col items-center group">
            {index > 0 && (
              <div 
                className={`absolute top-1/2 right-1/2 w-full h-px -translate-y-1/2 -z-10 transition-colors duration-500
                ${agents[AGENT_ORDER[index - 1].id]?.status === 'complete' ? 'bg-bull' : 'bg-transparent'}`} 
              />
            )}
            
            <motion.div
              initial={false}
              animate={{
                scale: isActive ? 1.05 : 1,
                boxShadow: isActive ? '0 0 15px rgba(59, 130, 246, 0.5)' : 'none',
              }}
              transition={{ repeat: isActive ? Infinity : 0, repeatType: 'reverse', duration: 0.8 }}
              className={`
                w-10 h-10 rounded-full flex items-center justify-center border transition-colors duration-300 relative
                ${isComplete ? 'bg-bull border-bull text-white' : 
                  isActive ? 'bg-accent border-accent text-white' : 
                  isError ? 'bg-bear border-bear text-white' :
                  'bg-base border-border text-text-muted'}
              `}
            >
              {isComplete ? (
                <Check className="w-5 h-5" />
              ) : (
                <Icon className="w-5 h-5" />
              )}
            </motion.div>
            
            <div className="mt-3 text-center absolute top-12 whitespace-nowrap">
              <span className={`text-[9px] font-bold tracking-widest block transition-colors
                ${isActive ? 'text-accent' : isComplete ? 'text-bull' : isError ? 'text-bear' : 'text-text-muted'}
              `}>
                {agentConfig.label}
              </span>
              
              {isActive && (
                <span className="text-[10px] text-accent animate-pulse">...</span>
              )}
              {isComplete && state?.completionTimeMs !== undefined && (
                <span className="text-[9px] text-text-secondary font-mono block">
                  {state.completionTimeMs}ms
                </span>
              )}
            </div>

            {/* Tooltip on complete */}
            {isComplete && (
              <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-full mb-3 left-1/2 -translate-x-1/2 w-48 bg-elevated border border-border rounded-lg p-2 text-xs text-text-secondary shadow-xl z-50 pointer-events-none">
                {agentConfig.label} agent completed successfully.
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
