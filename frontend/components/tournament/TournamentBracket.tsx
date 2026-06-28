import { motion } from 'framer-motion';
import { TournamentMatchup } from '../../lib/types';
import { ArrowRight } from 'lucide-react';

interface TournamentBracketProps {
  matchups: TournamentMatchup[][];
  currentRound: number;
}

export default function TournamentBracket({ matchups, currentRound }: TournamentBracketProps) {
  // A simplified visual bracket implementation
  // Matches will be shown round by round for this simplified version
  
  return (
    <div className="w-full flex justify-center overflow-x-auto py-12 no-scrollbar">
      <div className="flex gap-16 min-w-max px-8">
        {matchups.map((round, roundIndex) => (
          <div key={roundIndex} className="flex flex-col justify-around gap-8 relative">
            {round.map((matchup, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className={`
                  w-64 bg-surface border rounded-lg p-4 flex flex-col gap-3 relative z-10
                  ${matchup.verdict === 'INVEST' ? 'border-bull shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 
                    matchup.verdict === 'PASS' ? 'border-bear/30 opacity-70' : 
                    matchup.score ? 'border-border' : 'border-border/50'}
                `}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-text-primary text-sm truncate max-w-[140px]">
                    {matchup.company}
                  </span>
                  <span className="font-mono text-sm text-text-secondary">
                    {matchup.score ? matchup.score : '--'}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider
                    ${matchup.verdict === 'INVEST' ? 'bg-bull/10 text-bull' : 
                      matchup.verdict === 'HOLD' ? 'bg-hold/10 text-hold' : 
                      matchup.verdict === 'PASS' ? 'bg-bear/10 text-bear' : 
                      'bg-base text-text-muted'}
                  `}>
                    {matchup.verdict || 'PENDING'}
                  </span>
                  {currentRound === roundIndex && !matchup.score && (
                    <span className="text-[10px] text-accent animate-pulse uppercase tracking-widest">
                      Analysing...
                    </span>
                  )}
                </div>

                {/* Draw lines to next round if there's a winner (simplified logic) */}
                {roundIndex < matchups.length - 1 && (
                  <div className="absolute top-1/2 -right-16 w-16 h-px bg-border -z-10 flex items-center justify-end">
                    {matchup.verdict === 'INVEST' && (
                      <motion.div 
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="text-bull"
                      >
                        <ArrowRight className="w-4 h-4 mr-1" />
                      </motion.div>
                    )}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
