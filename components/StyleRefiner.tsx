import React, { useState } from 'react';
import { refineAcademicStyle, StyleParams } from '../services/geminiService';
import { PenTool, Loader2, Wand2, ArrowRight, ClipboardCheck, AlertCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const StyleRefiner: React.FC = () => {
  const [formData, setFormData] = useState<StyleParams>({
    goal: '使表达更简洁有力',
    text: ''
  });
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const goals = [
    '使表达更简洁有力',
    '使文本更具批判性',
    '使语气更地道自然',
    '提升专业术语准确性',
    '增强逻辑连贯性'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.text.trim()) {
        setError("请输入需要修正的文本。");
        return;
    }
    
    setLoading(true);
    setError(null);
    setResult(''); // Clear previous results immediately

    try {
      const markdown = await refineAcademicStyle(formData);
      setResult(markdown);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full gap-6">
       {/* Top Controls */}
       <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-slate-700 mb-1">修正目标</label>
            <select
              name="goal"
              value={formData.goal}
              onChange={handleInputChange}
              className="w-full p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm bg-white"
            >
              {goals.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <button
            onClick={handleSubmit}
            disabled={loading || !formData.text}
            className="py-2.5 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed h-[42px]"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
            开始润色
          </button>
       </div>

       {error && (
            <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg flex items-center gap-2 border border-red-100">
                <AlertCircle className="w-4 h-4" />
                {error}
            </div>
       )}

       {/* Main Workspace */}
       <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
          
          {/* Input Text Area */}
          <div className="flex-1 flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
             <div className="p-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <PenTool className="w-4 h-4 text-slate-500" />
                    <span className="text-sm font-medium text-slate-600">原稿输入</span>
                </div>
                <span className="text-xs text-slate-400">{formData.text.length} 字符</span>
             </div>
             <textarea
                name="text"
                value={formData.text}
                onChange={handleInputChange}
                placeholder="在此处粘贴您的草稿或AI生成的段落..."
                className="flex-1 w-full p-4 resize-none outline-none text-slate-700 leading-relaxed font-sans text-base focus:bg-slate-50 transition-colors"
             />
          </div>

          {/* Arrow Separator (Visual only) */}
          <div className="hidden lg:flex flex-col justify-center items-center text-slate-300">
             <ArrowRight className="w-6 h-6" />
          </div>

          {/* Output Area */}
          <div className="flex-1 flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
             <div className="p-3 bg-indigo-50 border-b border-indigo-100 flex items-center gap-2">
                <ClipboardCheck className="w-4 h-4 text-indigo-600" />
                <span className="text-sm font-medium text-indigo-800">修正结果与分析</span>
             </div>
             <div className="flex-1 p-6 overflow-y-auto bg-white academic-text">
                {loading ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-3">
                        <Loader2 className="w-8 h-8 animate-spin text-indigo-200" />
                        <p className="text-sm font-sans">正在消除AI痕迹...</p>
                    </div>
                ) : result ? (
                    <article className="prose prose-indigo prose-sm max-w-none prose-headings:font-sans prose-p:text-slate-700">
                        <ReactMarkdown>{result}</ReactMarkdown>
                    </article>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-3 opacity-50">
                        <div className="w-16 h-2 bg-slate-100 rounded-full"></div>
                        <div className="w-24 h-2 bg-slate-100 rounded-full"></div>
                        <div className="w-12 h-2 bg-slate-100 rounded-full"></div>
                    </div>
                )}
             </div>
          </div>

       </div>
    </div>
  );
};

export default StyleRefiner;
