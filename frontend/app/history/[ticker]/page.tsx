'use client';

import { useEffect, useState, use } from 'react';
import Navbar from '../../../components/layout/Navbar';
import ScoreTimeline from '../../../components/history/ScoreTimeline';
import DeltaSummary from '../../../components/history/DeltaSummary';
import { getHistory } from '../../../lib/api';

interface HistoryPoint {
  date: string;
  score: number;
  verdict: 'INVEST' | 'HOLD' | 'PASS';
  keyThesis: string;
}

export default function HistoryPage({ params }: { params: Promise<{ ticker: string }> }) {
  const { ticker } = use(params);
  const [data, setData] = useState<HistoryPoint[]>([]);
  const [selectedPoint, setSelectedPoint] = useState<HistoryPoint | null>(null);
  const [previousPoint, setPreviousPoint] = useState<HistoryPoint | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        // In a real app we fetch from API:
        // const res = await getHistory(ticker);
        // setData(res);
        
        // Mocking for frontend challenge
        const mockData: HistoryPoint[] = [
          { date: '2023-01-15', score: 45, verdict: 'PASS', keyThesis: 'Macro headwinds and supply chain issues.' },
          { date: '2023-04-20', score: 58, verdict: 'HOLD', keyThesis: 'Supply chain stabilizing, margins improving slightly.' },
          { date: '2023-07-22', score: 72, verdict: 'HOLD', keyThesis: 'Strong product cycle upcoming, but valuation is stretched.' },
          { date: '2023-10-18', score: 85, verdict: 'INVEST', keyThesis: 'Generative AI adoption accelerating growth beyond consensus.' },
          { date: '2024-01-12', score: 92, verdict: 'INVEST', keyThesis: 'Unprecedented demand. Clear moat. Margins expanding.' },
        ];
        
        setData(mockData);
        if (mockData.length > 0) {
          const last = mockData[mockData.length - 1];
          setSelectedPoint(last);
          setPreviousPoint(mockData[mockData.length - 2]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [ticker]);

  const handleSelect = (point: HistoryPoint) => {
    setSelectedPoint(point);
    const idx = data.findIndex(d => d.date === point.date);
    if (idx > 0) {
      setPreviousPoint(data[idx - 1]);
    } else {
      setPreviousPoint(undefined);
    }
  };

  const getDeltaText = () => {
    if (!selectedPoint || !previousPoint) return 'Initial analysis recorded. No previous baseline to compare against.';
    
    // Mock delta text logic
    const diff = selectedPoint.score - previousPoint.score;
    if (diff > 10) {
      return `Significant <span class="text-bull">positive momentum</span> driven by expanding margins and revised forward guidance. The model notes that the previous concerns regarding supply chain have been completely resolved.`;
    } else if (diff < -10) {
      return `Material <span class="text-bear">deterioration</span> in fundamentals. The previous thesis has broken down due to unexpected competitive pressure and margin compression.`;
    } else {
      return `Thesis remains largely unchanged. Minor fluctuations in score are primarily driven by standard market volatility rather than fundamental shifts in the underlying business model.`;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-base">
      <Navbar />
      
      <main className="flex-1 flex flex-col p-6 max-w-6xl w-full mx-auto">
        <div className="mb-12">
          <h1 className="text-3xl font-extrabold text-text-primary flex items-center gap-4">
            <span className="font-mono bg-surface border border-border px-3 py-1 rounded-md text-accent">
              {decodeURIComponent(ticker)}
            </span>
            Analysis History
          </h1>
          <p className="text-text-secondary mt-2">Thesis evolution and score progression over time.</p>
        </div>

        {isLoading ? (
          <div className="w-full flex items-center justify-center h-64">
            <div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full" />
          </div>
        ) : data.length > 0 && selectedPoint ? (
          <>
            <ScoreTimeline 
              data={data} 
              onSelect={handleSelect} 
              selectedDate={selectedPoint.date} 
            />
            <DeltaSummary 
              currentPoint={selectedPoint} 
              previousPoint={previousPoint} 
              aiDeltaText={getDeltaText()} 
            />
          </>
        ) : (
          <div className="text-center text-text-muted mt-20">
            No history found for this ticker.
          </div>
        )}
      </main>
    </div>
  );
}
