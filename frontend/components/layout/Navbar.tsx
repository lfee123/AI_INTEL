import Link from 'next/link';
import { useApiHealth } from '../../hooks/useApiHealth';
import { Hexagon } from 'lucide-react';

export default function Navbar() {
  const isHealthy = useApiHealth();

  return (
    <nav className="w-full flex items-center justify-between px-6 py-4 border-b border-border bg-base/80 backdrop-blur-md sticky top-0 z-50">
      <Link href="/" className="flex items-center gap-2 text-accent group transition-transform hover:scale-105 active:scale-95">
        <Hexagon className="w-5 h-5 fill-accent/20" />
        <span className="font-sans font-bold text-lg tracking-tight">AlphaIntel</span>
      </Link>
      <div className="flex items-center gap-6">
        <Link href="/tournament" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
          Tournament
        </Link>
        <Link href="/history/AAPL" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
          History
        </Link>
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              isHealthy === null
                ? 'bg-text-muted animate-pulse'
                : isHealthy
                ? 'bg-bull'
                : 'bg-bear'
            }`}
            title={isHealthy ? 'API Online' : 'API Offline'}
          />
          <span className="text-xs text-text-muted uppercase tracking-widest">
            {isHealthy === null ? 'CHECKING' : isHealthy ? 'ONLINE' : 'OFFLINE'}
          </span>
        </div>
      </div>
    </nav>
  );
}
