import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, X } from 'lucide-react';

interface CompanyInputGridProps {
  onStart: (companies: string[]) => void;
  isStarting: boolean;
}

export default function CompanyInputGrid({ onStart, isStarting }: CompanyInputGridProps) {
  const [size, setSize] = useState<2 | 4 | 8>(4);
  const [companies, setCompanies] = useState<string[]>(Array(4).fill(''));

  const handleSizeChange = (newSize: 2 | 4 | 8) => {
    setSize(newSize);
    setCompanies(prev => {
      const next = Array(newSize).fill('');
      for (let i = 0; i < Math.min(prev.length, newSize); i++) {
        next[i] = prev[i];
      }
      return next;
    });
  };

  const handleUpdate = (index: number, value: string) => {
    const next = [...companies];
    next[index] = value;
    setCompanies(next);
  };

  const canStart = companies.every(c => c.trim().length > 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (canStart) {
      onStart(companies.map(c => c.trim()));
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
      <div className="flex gap-4 mb-8">
        {[2, 4, 8].map(s => (
          <button
            key={s}
            type="button"
            onClick={() => handleSizeChange(s as 2 | 4 | 8)}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${size === s ? 'bg-accent text-white' : 'bg-surface border border-border text-text-secondary hover:text-text-primary'}`}
          >
            {s} Companies
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="w-full flex flex-col items-center gap-8">
        <div className={`grid gap-4 w-full ${size === 2 ? 'grid-cols-1 md:grid-cols-2' : size === 4 ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-4'}`}>
          {companies.map((company, i) => (
            <div key={i} className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-accent transition-colors z-10" />
              <input
                type="text"
                value={company}
                onChange={e => handleUpdate(i, e.target.value)}
                placeholder={`Company ${i + 1}`}
                required
                disabled={isStarting}
                className="w-full h-14 pl-12 pr-4 bg-surface border border-border rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
              />
              {company && !isStarting && (
                <button
                  type="button"
                  onClick={() => handleUpdate(i, '')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
        
        <button
          type="submit"
          disabled={!canStart || isStarting}
          className="px-8 py-3 bg-accent hover:bg-accent/90 text-white font-medium rounded-lg shadow-lg shadow-accent/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 mt-4"
        >
          {isStarting ? 'Initializing Tournament...' : 'Start Tournament'}
        </button>
      </form>
    </div>
  );
}
