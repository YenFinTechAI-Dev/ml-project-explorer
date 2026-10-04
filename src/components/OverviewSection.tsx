import React, { useState } from 'react';
import { 
  Sparkles, 
  HelpCircle, 
  Layers, 
  Brain, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle, 
  ArrowRight, 
  Lightbulb, 
  Code,
  Flame,
  Zap
} from 'lucide-react';
import { COMPARISON_POINTS, UPGRADE_GUIDES } from '../data/comparisonData';

interface OverviewSectionProps {
  onNavigateToCatalog: () => void;
  onNavigateToLabs: () => void;
}

export const OverviewSection: React.FC<OverviewSectionProps> = ({ 
  onNavigateToCatalog, 
  onNavigateToLabs 
}) => {
  const [activeTab, setActiveTab] = useState<'answer' | 'comparison' | 'upgrades'>('answer');

  return (
    <div className="space-y-8">
      {/* Hero Direct Answer Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950/80 via-slate-900 to-slate-950 border border-indigo-900/50 p-6 md:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-400/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-4">
            <Zap className="w-3.5 h-3.5 text-indigo-400" />
            Giải đáp trọng tâm
          </div>

          <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Ngoài phân loại Spam và làm Chatbot, <br className="hidden md:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-sky-300 to-emerald-400">
              người làm Machine Learning thực tế làm những gì?
            </span>
          </h1>

          <div className="mt-4 text-slate-300 text-sm md:text-base leading-relaxed space-y-3">
            <p>
              Câu trả lời ngắn gọn: <strong>Thế giới Machine Learning rộng lớn hơn rất nhiều!</strong> 
              Spam Filter chỉ là ví dụ &quot;Hello World&quot; kinh điển thời kỳ đầu, còn Chatbot ngày nay phần lớn chỉ là gọi API wrapper (như ChatGPT/Gemini API) chứ không phải bạn tự làm bài toán Machine Learning.
            </p>
            <p className="text-slate-300/90">
              Trong thực tế doanh nghiệp, các dự án ML cơ bản và thiết thực nhất xoay quanh 
              <strong> 4 trụ cột nghiệp vụ cốt lõi</strong>: Dự báo biến định lượng (Doanh số/Giá nhà), 
              Phân loại dữ liệu bảng (Rời bỏ/Chấm điểm tín dụng), Phân khúc khách hàng tự động (K-Means/RFM), 
              và Hệ gợi ý cá nhân hóa (Recommendation Systems).
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-3 mt-6">
            <button
              onClick={onNavigateToLabs}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition shadow-lg shadow-indigo-900/40"
            >
              <Sparkles className="w-4 h-4" />
              Thử nghiệm 5 Lab Tương tác
            </button>
            <button
              onClick={onNavigateToCatalog}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-sm transition"
            >
              <Layers className="w-4 h-4 text-sky-400" />
              Xem 7 Dự án Đầy đủ Code & Dataset
            </button>
          </div>
        </div>
      </div>

      {/* 4 Pillars Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Brain className="w-5 h-5 text-indigo-400" />
              4 Hướng đi Dự án ML Phổ biến & Giá trị nhất trong Doanh nghiệp
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Những bài toán giải quyết trực tiếp doanh thu và chi phí vận hành
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1 */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 hover:border-emerald-500/50 transition group">
            <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-800/60 flex items-center justify-center text-emerald-400 mb-3 group-hover:scale-105 transition">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">1. Dự báo số lượng</span>
            <h3 className="text-base font-bold text-white mt-1">Hồi quy (Regression)</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Dự đoán giá bán bất động sản, giá xe ô tô cũ, doanh thu siêu thị 30 ngày tới, hoặc nhu cầu đặt xe Grab theo giờ.
            </p>
            <div className="mt-3 pt-3 border-t border-slate-800 text-[11px] text-emerald-300 font-mono">
              Model: LightGBM, XGBoost, CatBoost
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 hover:border-rose-500/50 transition group">
            <div className="w-10 h-10 rounded-xl bg-rose-950/80 border border-rose-800/60 flex items-center justify-center text-rose-400 mb-3 group-hover:scale-105 transition">
              <AlertCircle className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-400">2. Phân loại thực tế</span>
            <h3 className="text-base font-bold text-white mt-1">Dữ liệu Bảng (Tabular)</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Dự đoán khách hàng sắp hủy hợp đồng (Churn), chấm điểm hồ sơ vay tín dụng ngân hàng, hoặc phát hiện giao dịch quẹt thẻ gian lận.
            </p>
            <div className="mt-3 pt-3 border-t border-slate-800 text-[11px] text-rose-300 font-mono">
              Metrics: PR-AUC, Recall, Cost Matrix
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 hover:border-purple-500/50 transition group">
            <div className="w-10 h-10 rounded-xl bg-purple-950/80 border border-purple-800/60 flex items-center justify-center text-purple-400 mb-3 group-hover:scale-105 transition">
              <Layers className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-purple-400">3. Học không giám sát</span>
            <h3 className="text-base font-bold text-white mt-1">Phân khúc Khách hàng</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Dữ liệu không có nhãn sẵn. Dùng K-Means & RFM gom nhóm hàng triệu người mua sắm thành: Khách VIP, Khách săn khuyến mãi, Khách ngủ đông.
            </p>
            <div className="mt-3 pt-3 border-t border-slate-800 text-[11px] text-purple-300 font-mono">
              Model: K-Means, DBSCAN, PCA
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 hover:border-amber-500/50 transition group">
            <div className="w-10 h-10 rounded-xl bg-amber-950/80 border border-amber-800/60 flex items-center justify-center text-amber-400 mb-3 group-hover:scale-105 transition">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">4. Cá nhân hóa</span>
            <h3 className="text-base font-bold text-white mt-1">Hệ thống Gợi ý</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Gợi ý bài hát trên Spotify, phim trên Netflix, sản phẩm kèm theo trên Shopee bằng thuật toán Collaborative Filtering và Matrix Factorization.
            </p>
            <div className="mt-3 pt-3 border-t border-slate-800 text-[11px] text-amber-300 font-mono">
              Model: SVD, Two-Tower Networks
            </div>
          </div>
        </div>
      </div>

      {/* Comparison: Why Spam/Basic Chatbot is not enough anymore? */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-3">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-500" />
              So sánh: &quot;Dự án Cũ mòn&quot; vs &quot;Dự án ML Đạt chuẩn Doanh nghiệp&quot;
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Tại sao để Spam Filter hoặc Chatbot gọi API đơn giản vào CV xin việc ngày nay ít gây ấn tượng?
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('comparison')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'comparison'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Bảng so sánh 5 yếu tố
            </button>
            <button
              onClick={() => setActiveTab('upgrades')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'upgrades'
                  ? 'bg-amber-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Cách nâng cấp nếu đã lỡ làm
            </button>
          </div>
        </div>

        {activeTab === 'comparison' && (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                  <th className="py-3 px-3 w-1/5">Khía cạnh</th>
                  <th className="py-3 px-3 w-2/5 text-rose-400">Dự án Spam / Chatbot cơ bản</th>
                  <th className="py-3 px-3 w-2/5 text-emerald-400">Dự án ML Thực chiến Chuyên nghiệp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {COMPARISON_POINTS.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/30 transition">
                    <td className="py-3.5 px-3 font-semibold text-white align-top">
                      {item.dimension}
                      <div className="text-[10px] text-slate-500 font-normal mt-0.5">{item.whyItMatters}</div>
                    </td>
                    <td className="py-3.5 px-3 text-slate-300/90 align-top bg-rose-950/10 rounded-l-lg border-l-2 border-rose-500/40">
                      {item.basicCliche}
                    </td>
                    <td className="py-3.5 px-3 text-slate-200 align-top bg-emerald-950/10 rounded-r-lg border-l-2 border-emerald-500/40 font-medium">
                      {item.industryReality}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'upgrades' && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {UPGRADE_GUIDES.map((guide, idx) => (
              <div key={idx} className="bg-slate-950/70 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
                <div>
                  <div className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-950/60 border border-amber-800/60 text-amber-400 mb-2">
                    {guide.badge}
                  </div>
                  <h4 className="text-sm font-bold text-white mb-2">{guide.upgradedTitle}</h4>
                  <div className="text-xs text-slate-400 mb-3 italic">
                    Gốc: {guide.original}
                  </div>

                  <div className="space-y-2 text-xs text-slate-300">
                    {guide.howToUpgrade.map((step, sIdx) => (
                      <div key={sIdx} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
