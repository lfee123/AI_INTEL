import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export type TabId = 'bullbear' | 'news' | 'comps' | 'filing' | 'critic' | 'memo';

interface ContentTabsProps {
  activeTab: TabId;
  onChange: (tab: TabId) => void;
  children: React.ReactNode;
}

const TABS: { id: TabId; label: string }[] = [
  { id: 'bullbear', label: 'Bull vs Bear' },
  { id: 'news', label: 'News & Sentiment' },
  { id: 'comps', label: 'Competitors' },
  { id: 'filing', label: 'SEC Filings' },
  { id: 'critic', label: 'Red Team' },
  { id: 'memo', label: 'Full Memo' },
];

export default function ContentTabs({ activeTab, onChange, children }: ContentTabsProps) {
  return (
    <div className="w-full flex flex-col h-full">
      <div className="flex items-center gap-1 border-b border-border mb-6 overflow-x-auto no-scrollbar">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`
                relative px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap
                ${isActive ? 'text-accent' : 'text-text-secondary hover:text-text-primary'}
              `}
            >
              {tab.label}
              {isActive && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
      <div className="relative flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="w-full h-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
