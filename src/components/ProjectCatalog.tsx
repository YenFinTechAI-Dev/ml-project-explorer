import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  ExternalLink, 
  Code, 
  Check, 
  Copy, 
  Clock, 
  TrendingUp, 
  Database, 
  Target, 
  Layers, 
  X,
  FileText,
  Award
} from 'lucide-react';
import { MLProject, ProjectCategory } from '../types/ml';
import { ML_PROJECTS } from '../data/projectData';

const CATEGORIES: { id: 'all' | ProjectCategory; label: string }[] = [
  { id: 'all', label: 'Tất cả (7 Hướng)' },
  { id: 'regression', label: 'Hồi quy (Giá nhà / Doanh thu)' },
  { id: 'classification', label: 'Phân loại (Churn / Tín dụng)' },
  { id: 'clustering', label: 'Phân cụm (RFM E-commerce)' },
  { id: 'recommendation', label: 'Hệ gợi ý (Phim & Mua sắm)' },
  { id: 'anomaly', label: 'Bất thường (Gian lận thẻ)' },
  { id: 'timeseries', label: 'Chuỗi thời gian (Forecasting)' },
  { id: 'nlp', label: 'NLP tiếng Việt' },
  { id: 'cv', label: 'Thị giác máy tính (CV)' }
];

export const ProjectCatalog: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | ProjectCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeProject, setActiveProject] = useState<MLProject | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  const filteredProjects = useMemo(() => {
    return ML_PROJECTS.filter((p) => {
      const matchCat = selectedCategory === 'all' || p.category === selectedCategory;
      const matchQuery = 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchQuery;
    });
  }, [selectedCategory, searchQuery]);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-400" />
            Thư viện 7 Hướng Dự án ML Thực chiến (Kèm Code & Dataset Chuẩn)
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Mỗi đề tài đều giải quyết bài toán kinh doanh cụ thể, có thước đo chuẩn và mẫu code Python chạy ngay
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm kiếm dự án, thuật toán, tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              selectedCategory === cat.id
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/40'
                : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800/80'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Project Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredProjects.map((p) => (
          <div
            key={p.id}
            onClick={() => setActiveProject(p)}
            className="bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-5 flex flex-col justify-between cursor-pointer transition group hover:shadow-xl hover:shadow-indigo-950/20"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-950/60 border border-indigo-800/60 px-2 py-0.5 rounded-full">
                  {p.categoryName}
                </span>
                <span className="text-[11px] text-slate-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {p.estimatedTime}
                </span>
              </div>

              <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition">
                {p.title}
              </h3>

              <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                {p.shortDesc}
              </p>

              {/* Algorithm Baseline vs Advanced */}
              <div className="mt-3 p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80 text-[11px] space-y-1">
                <div className="text-slate-400 flex items-center justify-between">
                  <span>Mô hình đề xuất:</span>
                  <span className="font-semibold text-slate-200">{p.algorithms.advanced}</span>
                </div>
                <div className="text-slate-400 flex items-center justify-between">
                  <span>Tập dữ liệu:</span>
                  <span className="font-semibold text-sky-400">{p.datasets[0].source}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <div className="flex flex-wrap gap-1">
                {p.tags.slice(0, 2).map((t, idx) => (
                  <span key={idx} className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded">
                    #{t}
                  </span>
                ))}
              </div>
              <span className="text-xs font-semibold text-indigo-400 flex items-center gap-1 group-hover:translate-x-1 transition">
                Chi tiết & Code →
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Project Detail Modal */}
      {activeProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Close Button */}
            <button
              onClick={() => setActiveProject(null)}
              className="absolute top-6 right-6 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="pr-12">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-950/60 border border-indigo-800/60 px-3 py-1 rounded-full">
                  {activeProject.categoryName}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  Thời lượng ước tính: {activeProject.estimatedTime}
                </span>
              </div>
              <h2 className="text-2xl font-black text-white">{activeProject.title}</h2>
              <p className="text-sm text-slate-300 mt-2">{activeProject.businessProblem}</p>
            </div>

            {/* CV Highlight Tip Box */}
            <div className="mt-5 p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 to-slate-900 border border-amber-500/40 flex items-start gap-3">
              <Award className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  Cách trình bày ấn tượng vào CV / Resume
                </span>
                <p className="text-xs text-amber-200/90 mt-1 leading-relaxed">
                  {activeProject.cvHighlightTip}
                </p>
              </div>
            </div>

            {/* Tabs & Content */}
            <div className="mt-6 space-y-6">
              {/* Datasets */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                  <Database className="w-4 h-4 text-sky-400" />
                  Bộ Dữ liệu Thực tế Được Khuyên Dùng
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {activeProject.datasets.map((ds, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                      <div className="flex items-center justify-between text-xs">
                        <strong className="text-white">{ds.name}</strong>
                        <span className="text-sky-400 font-semibold">{ds.source}</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">{ds.description}</p>
                      <div className="text-[11px] text-slate-500 mt-2 font-mono">Quy mô: {ds.size}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Metrics */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-emerald-400" />
                  Chỉ số Đánh giá & Mục tiêu (Metrics & Benchmarks)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {activeProject.metrics.map((m, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                      <div className="text-xs font-bold text-white">{m.name}</div>
                      <div className="text-xs font-mono text-emerald-400 font-bold mt-0.5">Mục tiêu: {m.target}</div>
                      <p className="text-[11px] text-slate-400 mt-1 leading-snug">{m.explanation}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pipeline Steps */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-purple-400" />
                  Quy trình Pipeline 5 bước thực hiện
                </h3>
                <div className="space-y-2">
                  {activeProject.pipelineSteps.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs">
                      <span className="w-5 h-5 rounded-full bg-indigo-900/60 border border-indigo-700/60 text-indigo-300 font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <span className="text-slate-300 mt-0.5">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Python Code Snippet */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Code className="w-4 h-4 text-indigo-400" />
                    Mẫu Code Python Khởi chạy Ngay (Scikit-Learn / PyTorch / LightGBM)
                  </h3>
                  <button
                    onClick={() => handleCopyCode(activeProject.pythonCodeSnippet)}
                    className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-white bg-indigo-950/60 border border-indigo-800/60 px-3 py-1 rounded-lg transition"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedCode ? 'Đã sao chép!' : 'Copy Code'}
                  </button>
                </div>

                <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-slate-300 font-mono text-xs overflow-x-auto leading-relaxed">
                  <code>{activeProject.pythonCodeSnippet}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
