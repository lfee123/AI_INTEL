import { useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Trophy, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface WinnerCardProps {
  winner: string;
  score: number;
}

export default function WinnerCard({ winner, score }: WinnerCardProps) {
  useEffect(() => {
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#3B82F6', '#10B981']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#3B82F6', '#10B981']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.8, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className="max-w-md w-full mx-auto mt-12 bg-elevated border-2 border-bull rounded-2xl p-8 text-center shadow-[0_0_50px_rgba(16,185,129,0.2)] relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-bull to-transparent opacity-50" />
      
      <div className="w-16 h-16 mx-auto bg-bull/20 rounded-full flex items-center justify-center mb-6">
        <Trophy className="w-8 h-8 text-bull" />
      </div>

      <h3 className="text-sm text-text-muted font-bold uppercase tracking-[0.2em] mb-2">
        TOURNAMENT CHAMPION
      </h3>
      
      <h2 className="text-4xl font-extrabold text-text-primary mb-2">
        {winner}
      </h2>
      
      <div className="flex items-center justify-center gap-3 mb-8">
        <span className="text-sm text-text-secondary">Winning Score</span>
        <span className="text-2xl font-mono text-bull">{score}</span>
      </div>

      <Link 
        href={`/research/${winner}`}
        className="inline-flex items-center justify-center gap-2 w-full py-3 bg-accent hover:bg-accent/90 text-white rounded-lg font-medium transition-transform active:scale-95"
      >
        View Full Analysis
        <ArrowRight className="w-4 h-4" />
      </Link>
    </motion.div>
  );
}
