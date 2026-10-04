import React, { useState, useMemo } from 'react';
import { ShieldAlert, Sliders, CheckCircle2, XCircle, AlertTriangle, ArrowRight } from 'lucide-react';

interface CustomerSample {
  id: number;
  tenureMonths: number;
  monthlyCharge: number;
  actualChurn: boolean;
  predictedProbability: number;
}

// Generate 50 realistic customer predictions
const GENERATED_SAMPLES: CustomerSample[] = Array.from({ length: 50 }, (_, i) => {
  const isHighRisk = i < 15; // 15 churners out of 50 (30% churn rate)
  const baseProb = isHighRisk 
    ? 0.45 + (Math.sin(i * 1.7) * 0.2 + 0.25) 
    : 0.10 + (Math.cos(i * 1.3) * 0.18 + 0.15);
  
  const prob = Math.min(0.96, Math.max(0.04, baseProb));
  return {
    id: i + 1,
    tenureMonths: isHighRisk ? Math.floor(1 + Math.random() * 8) : Math.floor(12 + Math.random() * 48),
    monthlyCharge: isHighRisk ? Math.floor(75 + Math.random() * 45) : Math.floor(30 + Math.random() * 50),
    actualChurn: isHighRisk,
    predictedProbability: Number(prob.toFixed(2))
  };
});

export const ChurnClassificationLab: React.FC = () => {
  const [threshold, setThreshold] = useState<number>(0.4);
  const [filterType, setFilterType] = useState<'all' | 'churn' | 'stay'>('all');

  const { tp, fp, fn, tn, accuracy, precision, recall, f1 } = useMemo(() => {
    let truePos = 0;
    let falsePos = 0;
    let falseNeg = 0;
    let trueNeg = 0;

    GENERATED_SAMPLES.forEach((c) => {
      const predChurn = c.predictedProbability >= threshold;
      if (c.actualChurn && predChurn) truePos++;
      else if (!c.actualChurn && predChurn) falsePos++;
      else if (c.actualChurn && !predChurn) falseNeg++;
      else trueNeg++;
    });

    const total = GENERATED_SAMPLES.length;
    const acc = (truePos + trueNeg) / total;
    const prec = truePos + falsePos > 0 ? truePos / (truePos + falsePos) : 0;
    const rec = truePos + falseNeg > 0 ? truePos / (truePos + falseNeg) : 0;
    const f1Score = prec + rec > 0 ? (2 * prec * rec) / (prec + rec) : 0;

    return {
      tp: truePos,
      fp: falsePos,
      fn: falseNeg,
      tn: trueNeg,
      accuracy: acc,
      precision: prec,
      recall: rec,
      f1: f1Score
    };
  }, [threshold]);

  const filteredSamples = useMemo(() => {
    if (filterType === 'churn') return GENERATED_SAMPLES.filter((s) => s.actualChurn);
    if (filterType === 'stay') return GENERATED_SAMPLES.filter((s) => !s.actualChurn);
    return GENERATED_SAMPLES;
  }, [filterType]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-400 bg-rose-950/60 border border-rose-800/60 px-2.5 py-0.5 rounded-full">
              Thực nghiệm Phân loại (Classification Lab)
            </span>
            <span className="text-xs text-slate-400">Điều chỉnh ngưỡng Threshold & Confusion Matrix</span>
          </div>
          <h3 className="text-xl font-bold text-white mt-1">Dự đoán Khách hàng Rời bỏ (Customer Churn)</h3>
        </div>
      </div>

      <p className="text-sm text-slate-300 mt-3 mb-4 leading-relaxed">
        Trong các bài toán như <strong>Phát hiện rời bỏ (Churn)</strong> hay <strong>Gian lận (Fraud)</strong>, 
        người làm ML không bao giờ giữ ngưỡng mặc định <code>0.5</code>. Kéo thanh trượt bên dưới để thấy sự đánh đổi 
        giữa <em>Precision (Độ chính xác cảnh báo)</em> và <em>Recall (Khả năng không bỏ sót khách hàng)</em>.
      </p>

      {/* Threshold Slider Card */}
      <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center justify-between text-xs text-slate-300 font-medium mb-1.5">
              <span className="flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-rose-400" />
                Ngưỡng quyết định (Classification Threshold):
              </span>
              <span className="font-mono text-base font-black text-rose-400">
                P ≥ {threshold.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min="0.1"
              max="0.9"
              step="0.05"
              value={threshold}
              onChange={(e) => setThreshold(parseFloat(e.target.value))}
              className="w-full accent-rose-500 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-500 mt-1">
              <span>0.10 (Bắt tối đa, chấp nhận báo nhầm)</span>
              <span>0.50 (Mặc định thường thấy)</span>
              <span>0.90 (Chỉ cảnh báo khi chắc chắn 100%)</span>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setThreshold(0.35)}
              className="px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition"
            >
              Gợi ý CSKH (0.35)
            </button>
            <button
              onClick={() => setThreshold(0.50)}
              className="px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition"
            >
              Chuẩn 0.50
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Confusion Matrix (2x2) */}
        <div className="lg:col-span-6 bg-slate-950/80 rounded-xl p-5 border border-slate-800 flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Ma trận Nhầm lẫn (Confusion Matrix)
            </h4>

            <div className="grid grid-cols-2 gap-3 text-center">
              {/* True Positive */}
              <div className="bg-emerald-950/50 border border-emerald-600/40 rounded-xl p-3.5">
                <div className="text-xs text-emerald-400 font-semibold flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  True Positive (TP)
                </div>
                <div className="text-3xl font-black text-emerald-300 mt-1">{tp}</div>
                <div className="text-[11px] text-emerald-400/80 mt-1">Khách sắp rời bỏ & Đoán đúng</div>
              </div>

              {/* False Positive */}
              <div className="bg-amber-950/40 border border-amber-600/40 rounded-xl p-3.5">
                <div className="text-xs text-amber-400 font-semibold flex items-center justify-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  False Positive (FP)
                </div>
                <div className="text-3xl font-black text-amber-300 mt-1">{fp}</div>
                <div className="text-[11px] text-amber-400/80 mt-1">Khách ở lại nhưng báo động nhầm</div>
              </div>

              {/* False Negative */}
              <div className="bg-rose-950/50 border border-rose-600/40 rounded-xl p-3.5">
                <div className="text-xs text-rose-400 font-semibold flex items-center justify-center gap-1">
                  <XCircle className="w-3.5 h-3.5" />
                  False Negative (FN)
                </div>
                <div className="text-3xl font-black text-rose-300 mt-1">{fn}</div>
                <div className="text-[11px] text-rose-400/80 mt-1">Khách bỏ đi mà mô hình KHÔNG BIẾT (Tổn thất lớn)</div>
              </div>

              {/* True Negative */}
              <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3.5">
                <div className="text-xs text-slate-300 font-semibold flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
                  True Negative (TN)
                </div>
                <div className="text-3xl font-black text-slate-200 mt-1">{tn}</div>
                <div className="text-[11px] text-slate-400 mt-1">Khách tiếp tục dùng & Đoán đúng</div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 text-xs text-slate-400">
            Tổng số mẫu: <strong>50 khách hàng</strong> (15 Churn thực tế, 35 Tiếp tục sử dụng).
          </div>
        </div>

        {/* Evaluation Metrics */}
        <div className="lg:col-span-6 flex flex-col justify-between gap-4">
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 space-y-3">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Chỉ số Đo lường Hiệu năng
            </h4>

            {/* Recall */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">
                  Recall (Độ phủ phát hiện Churn):
                </span>
                <span className="font-mono font-bold text-rose-400">
                  {(recall * 100).toFixed(1)}% ({tp}/{tp + fn})
                </span>
              </div>
              <div className="w-full bg-slate-700/50 rounded-full h-2">
                <div
                  className="bg-rose-500 h-2 rounded-full transition-all duration-200"
                  style={{ width: `${recall * 100}%` }}
                />
              </div>
            </div>

            {/* Precision */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">Precision (Độ chuẩn xác khi phát còi):</span>
                <span className="font-mono font-bold text-amber-400">
                  {(precision * 100).toFixed(1)}% ({tp}/{tp + fp || 1})
                </span>
              </div>
              <div className="w-full bg-slate-700/50 rounded-full h-2">
                <div
                  className="bg-amber-500 h-2 rounded-full transition-all duration-200"
                  style={{ width: `${precision * 100}%` }}
                />
              </div>
            </div>

            {/* F1 */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">F1-Score (Trung bình điều hòa):</span>
                <span className="font-mono font-bold text-sky-400">{(f1 * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-slate-700/50 rounded-full h-2">
                <div
                  className="bg-sky-500 h-2 rounded-full transition-all duration-200"
                  style={{ width: `${f1 * 100}%` }}
                />
              </div>
            </div>

            {/* Accuracy */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">Độ chính xác toàn cục (Accuracy):</span>
                <span className="font-mono font-bold text-slate-300">{(accuracy * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-slate-700/50 rounded-full h-1.5">
                <div
                  className="bg-slate-400 h-1.5 rounded-full transition-all duration-200"
                  style={{ width: `${accuracy * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div className="bg-rose-950/20 border border-rose-900/40 rounded-xl p-3.5 text-xs text-rose-200 flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-rose-300">Bài học thực chiến:</span>
              <p className="text-rose-200/80 mt-0.5 leading-relaxed">
                Đừng chỉ báo cáo Accuracy! Nếu tỷ lệ rời bỏ chỉ là 5%, một mô hình &quot;ngốc nghếch&quot; luôn đoán Không rời bỏ sẽ đạt 95% Accuracy nhưng vô dụng 100% trong thực tế.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
