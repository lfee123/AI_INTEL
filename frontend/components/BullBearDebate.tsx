import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface Props {
  bullThesis?: string;
  bearThesis?: string;
}

export default function BullBearDebate({ bullThesis, bearThesis }: Props) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      <div className="bg-green-900/10 border border-green-800/50 p-6 rounded-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <TrendingUp size={100} className="text-green-500" />
        </div>
        <h3 className="text-xl font-bold text-green-400 mb-4 flex items-center gap-2">
          <TrendingUp /> The Bull Case
        </h3>
        <div className="text-gray-300 whitespace-pre-wrap text-sm relative z-10">
          {bullThesis || <span className="italic text-gray-600">Waiting for Bull Agent...</span>}
        </div>
      </div>
      
      <div className="bg-red-900/10 border border-red-800/50 p-6 rounded-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <TrendingDown size={100} className="text-red-500" />
        </div>
        <h3 className="text-xl font-bold text-red-400 mb-4 flex items-center gap-2">
          <TrendingDown /> The Bear Case
        </h3>
        <div className="text-gray-300 whitespace-pre-wrap text-sm relative z-10">
          {bearThesis || <span className="italic text-gray-600">Waiting for Bear Agent...</span>}
        </div>
      </div>
    </div>
  );
}
