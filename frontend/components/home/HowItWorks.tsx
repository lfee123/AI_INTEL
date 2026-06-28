import { 
  Brain, TrendingUp, TrendingDown, Newspaper, 
  BarChart2, FileText, Shield, Calculator, FileCheck 
} from 'lucide-react';

const AGENTS = [
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

export default function HowItWorks() {
  return (
    <div className="w-full mt-24 border-t border-border bg-surface/30 backdrop-blur-sm py-12">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-10">
          <h3 className="text-sm font-semibold text-text-primary tracking-wide">THE PIPELINE</h3>
          <p className="text-text-muted mt-2 text-sm">9 specialized agents work in parallel to synthesize the final thesis.</p>
        </div>
        
        <div className="relative flex items-center justify-between w-full">
          {/* Connecting line */}
          <div className="absolute top-6 left-0 right-0 h-px bg-border -z-10" />
          
          {AGENTS.map((agent, i) => {
            const Icon = agent.icon;
            return (
              <div key={agent.id} className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-surface border border-border flex items-center justify-center shadow-lg transition-transform hover:scale-110 hover:border-text-muted cursor-default">
                  <Icon className="w-5 h-5 text-text-secondary" />
                </div>
                <span className="text-[10px] uppercase tracking-widest text-text-muted font-medium">
                  {agent.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
