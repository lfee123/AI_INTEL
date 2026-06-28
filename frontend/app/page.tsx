'use client';

import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import SearchBar from '../components/home/SearchBar';
import RecentAnalyses from '../components/home/RecentAnalyses';
import HowItWorks from '../components/home/HowItWorks';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1 flex flex-col items-center pt-24 pb-12 w-full">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col items-center w-full px-6"
        >
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent mb-6">
            INSTITUTIONAL AI RESEARCH
          </span>
          <h1 className="text-6xl font-extrabold text-text-primary text-center tracking-tight mb-6">
            Know before you invest.
          </h1>
          <p className="text-lg text-text-secondary text-center max-w-2xl leading-relaxed mb-8">
            Multi-agent AI analyses every company in 60 seconds. Bull case. Bear case. Red team critique. One verdict.
          </p>
          
          <SearchBar />
          <RecentAnalyses />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="w-full mt-auto"
        >
          <HowItWorks />
        </motion.div>
      </main>
      <Footer />
    </>
  );
}
