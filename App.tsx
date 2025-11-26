import React, { useState } from 'react';
import OutlineGenerator from './components/OutlineGenerator';
import StyleRefiner from './components/StyleRefiner';
import { Layout, PenTool, GraduationCap } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'outline' | 'style'>('outline');

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg text-white shadow-lg shadow-blue-600/20">
              <GraduationCap size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 leading-none">论文结构与风格修正助手</h1>
              <p className="text-xs text-slate-500 font-medium mt-1">Academic Structure & Style Optimizer</p>
            </div>
          </div>
          <div className="text-xs text-slate-400 font-medium bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
            Powered by Gemini 2.5
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex flex-col min-h-0">
        
        {/* Tab Navigation */}
        <div className="flex p-1 bg-slate-200 rounded-xl w-fit mb-8 self-center lg:self-start border border-slate-200/50">
          <button
            onClick={() => setActiveTab('outline')}
            className={`
              flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
              ${activeTab === 'outline' 
                ? 'bg-white text-blue-700 shadow-sm' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'}
            `}
          >
            <Layout size={18} />
            框架生成
          </button>
          <button
            onClick={() => setActiveTab('style')}
            className={`
              flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
              ${activeTab === 'style' 
                ? 'bg-white text-indigo-700 shadow-sm' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'}
            `}
          >
            <PenTool size={18} />
            风格修正
          </button>
        </div>

        {/* Content View */}
        <div className="flex-1 relative">
           {/* We keep the height constrained to viewport minus header/nav for a dashboard feel if content is long */}
           <div className="absolute inset-0 pb-8">
            {activeTab === 'outline' ? (
              <OutlineGenerator />
            ) : (
              <StyleRefiner />
            )}
           </div>
        </div>
      </main>
    </div>
  );
};

export default App;
