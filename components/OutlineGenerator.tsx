import React, { useState } from 'react';
import { generatePaperOutline, OutlineParams } from '../services/geminiService';
import { FileText, Loader2, Sparkles, BookOpen, Target, AlertCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const OutlineGenerator: React.FC = () => {
  const [formData, setFormData] = useState<OutlineParams>({
    topic: '',
    type: '',
    mainArguments: '',
    requirements: ''
  });
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.topic || !formData.type) {
        setError("请填写主题和论文类型。");
        return;
    }
    
    setLoading(true);
    setError(null);
    setResult('');

    try {
      const markdown = await generatePaperOutline(formData);
      setResult(markdown);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      {/* Input Section */}
      <div className="w-full lg:w-1/3 bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col gap-4 overflow-y-auto">
        <div className="flex items-center gap-2 mb-2 border-b border-slate-100 pb-4">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-slate-800">构建设置</h2>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">论文主题 / 标题 <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="topic"
              value={formData.topic}
              onChange={handleInputChange}
              placeholder="例如：新能源汽车市场增长驱动力..."
              className="w-full p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">论文类型 <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              placeholder="例如：学术综述、实证研究..."
              className="w-full p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">主要论点 / 假设</label>
            <textarea
              name="mainArguments"
              value={formData.mainArguments}
              onChange={handleInputChange}
              rows={4}
              placeholder="简述核心观点，例如：政策支持是关键因素..."
              className="w-full p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">特殊要求</label>
            <textarea
              name="requirements"
              value={formData.requirements}
              onChange={handleInputChange}
              rows={2}
              placeholder="例如：包含风险讨论..."
              className="w-full p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm resize-none"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                正在生成框架...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                生成论文框架
              </>
            )}
          </button>
        </form>
      </div>

      {/* Output Section */}
      <div className="w-full lg:w-2/3 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
         <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
            <Target className="w-5 h-5 text-emerald-600" />
            <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">生成结果</h2>
         </div>
         <div className="p-6 overflow-y-auto flex-1 academic-text leading-relaxed">
            {loading ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-3">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-200" />
                    <p className="text-sm font-sans">AI正在构建逻辑结构...</p>
                </div>
            ) : result ? (
                <article className="prose prose-slate prose-sm md:prose-base max-w-none prose-headings:font-sans prose-headings:text-slate-800 prose-p:text-slate-600 prose-li:text-slate-600">
                    <ReactMarkdown>{result}</ReactMarkdown>
                </article>
            ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-3">
                    <FileText className="w-12 h-12 text-slate-200" />
                    <p className="text-sm font-sans">请在左侧填写信息并生成框架</p>
                </div>
            )}
         </div>
      </div>
    </div>
  );
};

export default OutlineGenerator;
