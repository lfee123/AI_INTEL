'use client';

import { useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import CompanyInputGrid from '../../components/tournament/CompanyInputGrid';
import TournamentBracket from '../../components/tournament/TournamentBracket';
import WinnerCard from '../../components/tournament/WinnerCard';
import { TournamentMatchup } from '../../lib/types';
import { startTournament as apiStartTournament } from '../../lib/api';

export default function TournamentPage() {
  const [isStarting, setIsStarting] = useState(false);
  const [matchups, setMatchups] = useState<TournamentMatchup[][]>([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [winner, setWinner] = useState<{ company: string; score: number } | null>(null);

  const handleStart = async (companies: string[]) => {
    setIsStarting(true);
    try {
      // In a real scenario, this might trigger a background job or stream SSE
      // For now, we mock the progression since backend isn't real-time streaming the tournament
      const data = await apiStartTournament({ companies });
      
      // We expect the backend to return the full bracket or we simulate it here
      // For this frontend exercise, let's simulate the bracket UI progression
      simulateTournament(companies);
    } catch (error) {
      console.error(error);
      setIsStarting(false);
    }
  };

  const simulateTournament = (companies: string[]) => {
    // Generate initial round
    const initialRound = companies.map(c => ({ company: c }));
    setMatchups([initialRound]);
    
    // Simulate analyzing...
    setTimeout(() => {
      const scoredRound = initialRound.map(c => ({
        company: c.company,
        score: Math.floor(Math.random() * 60) + 40,
        verdict: (Math.random() > 0.5 ? 'INVEST' : 'PASS') as 'INVEST' | 'PASS'
      }));
      setMatchups([scoredRound]);

      const winners = scoredRound.filter(c => c.verdict === 'INVEST');
      
      if (winners.length > 0) {
        // Sort by score and pick top
        const top = winners.sort((a, b) => b.score - a.score)[0];
        setTimeout(() => {
          setWinner({ company: top.company, score: top.score });
          setIsStarting(false);
        }, 1500);
      } else {
        setIsStarting(false);
      }
    }, 3000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-base">
      <Navbar />
      
      <main className="flex-1 flex flex-col p-6 max-w-6xl w-full mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-text-primary mb-4 tracking-tight">
            Investment Tournament
          </h1>
          <p className="text-text-secondary">
            Pit companies against each other. Only the strongest thesis wins.
          </p>
        </div>

        {matchups.length === 0 && !winner ? (
          <CompanyInputGrid onStart={handleStart} isStarting={isStarting} />
        ) : (
          <div className="w-full flex flex-col items-center">
            {winner ? (
              <WinnerCard winner={winner.company} score={winner.score} />
            ) : (
              <TournamentBracket matchups={matchups} currentRound={currentRound} />
            )}
          </div>
        )}
      </main>
    </div>
  );
}
