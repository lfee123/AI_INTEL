import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

interface RecentAnalysis {
  company: string;
  ticker: string;
  verdict: string;
  score: number;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function RecentAnalyses() {
  const [recent, setRecent] = useState<RecentAnalysis[]>([]);

  useEffect(() => {
    fetch(`${API_BASE}/api/history/recent`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setRecent(data);
        }
      })
      .catch(() => {});
  }, []);

  if (recent.length === 0) return null;

  const getColor = (verdict: string) => {
    switch (verdict) {
      case 'INVEST': return 'text-bull border-bull/20 bg-bull/5';
      case 'HOLD': return 'text-hold border-hold/20 bg-hold/5';
      case 'PASS': return 'text-bear border-bear/20 bg-bear/5';
      default: return 'text-text-muted border-border bg-surface';
    }
  };

  return (
    <div className="mt-12 flex flex-col items-center">
      <p className="text-xs text-text-muted uppercase tracking-widest mb-4">Recent Analyses</p>
      <div className="flex flex-wrap justify-center gap-3">
        {recent.map((item) => (
          <Link 
            key={item.ticker + item.score} 
            href={`/research/${encodeURIComponent(item.company)}`}
            className="group flex items-center gap-3 px-4 py-2 rounded-full border border-border bg-surface hover:border-accent/50 transition-all hover:-translate-y-0.5"
          >
            <span className="font-medium text-text-primary text-sm">{item.company}</span>
            <span className="w-px h-3 bg-border" />
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider border ${getColor(item.verdict)}`}>
              {item.verdict}
            </span>
            <span className="font-mono text-sm text-text-secondary group-hover:text-text-primary transition-colors">
              {item.score}
            </span>
            <ArrowUpRight className="w-3.5 h-3.5 text-text-muted group-hover:text-accent transition-colors ml-1" />
          </Link>
        ))}
      </div>
    </div>
  );
}
