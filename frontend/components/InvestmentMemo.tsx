import React from 'react';
import { Download, FileText } from 'lucide-react';

interface Props {
  memoHtml?: string;
  ticker?: string;
}

export default function InvestmentMemo({ memoHtml, ticker }: Props) {
  if (!memoHtml) return null;
  
  const handleDownload = () => {
    if (!ticker) return;
    window.open(`http://localhost:8000/api/memo/${ticker}`, '_blank');
  };

  return (
    <div className="bg-white rounded-xl p-8 mt-8 shadow-2xl text-gray-900">
      <div className="flex justify-between items-center mb-8 border-b pb-4 border-gray-200">
        <h2 className="text-3xl font-black text-gray-800 flex items-center gap-3">
          <FileText className="text-blue-600" size={32} />
          Final Investment Memo
        </h2>
        <button 
          onClick={handleDownload}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors"
        >
          <Download size={20} /> Download PDF
        </button>
      </div>
      
      <div 
        className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-a:text-blue-600"
        dangerouslySetInnerHTML={{ __html: memoHtml }}
      />
    </div>
  );
}
