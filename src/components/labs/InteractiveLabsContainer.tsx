import React, { useState } from 'react';
import { TrendingUp, Users, ShieldAlert, Film, PenTool } from 'lucide-react';
import { RegressionLab } from './RegressionLab';
import { KMeansLab } from './KMeansLab';
import { ChurnClassificationLab } from './ChurnClassificationLab';
import { RecommenderLab } from './RecommenderLab';
import { MnistDrawLab } from './MnistDrawLab';

export const InteractiveLabsContainer: React.FC = () => {
  const [activeLab, setActiveLab] = useState<'regression' | 'kmeans' | 'churn' | 'recommender' | 'mnist'>('regression');

  return (
    <div className="space-y-6">
      {/* Sub-tabs for labs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-950/80 border border-slate-800 rounded-xl">
        <button
          onClick={() => setActiveLab('regression')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold transition ${
            activeLab === 'regression'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          Lab 1: Hồi quy Giá Nhà (Regression)
        </button>

        <button
          onClick={() => setActiveLab('kmeans')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold transition ${
            activeLab === 'kmeans'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-900/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          Lab 2: Phân khúc Khách hàng (K-Means)
        </button>

        <button
          onClick={() => setActiveLab('churn')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold transition ${
            activeLab === 'churn'
              ? 'bg-rose-600 text-white shadow-md shadow-rose-900/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          Lab 3: Dự đoán Rời bỏ & Threshold (Classification)
        </button>

        <button
          onClick={() => setActiveLab('recommender')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold transition ${
            activeLab === 'recommender'
              ? 'bg-amber-600 text-white shadow-md shadow-amber-900/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Film className="w-4 h-4" />
          Lab 4: Gợi ý Phim (Recommendation)
        </button>

        <button
          onClick={() => setActiveLab('mnist')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold transition ${
            activeLab === 'mnist'
              ? 'bg-sky-600 text-white shadow-md shadow-sky-900/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <PenTool className="w-4 h-4" />
          Lab 5: Bảng vẽ Thị giác Máy tính (MNIST)
        </button>
      </div>

      {/* Render active lab */}
      {activeLab === 'regression' && <RegressionLab />}
      {activeLab === 'kmeans' && <KMeansLab />}
      {activeLab === 'churn' && <ChurnClassificationLab />}
      {activeLab === 'recommender' && <RecommenderLab />}
      {activeLab === 'mnist' && <MnistDrawLab />}
    </div>
  );
};
