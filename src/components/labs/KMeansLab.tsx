import React, { useState, useMemo } from 'react';
import { Users, Play, SkipForward, RotateCcw, Award } from 'lucide-react';

interface CustomerPoint {
  id: number;
  freq: number; // Tần suất mua hàng (1 - 50 lần/năm)
  spend: number; // Tổng chi tiêu ($100 - $5000)
  cluster: number;
}

interface Centroid {
  freq: number;
  spend: number;
  color: string;
  name: string;
}

const CLUSTER_METADATA = [
  { color: '#ef4444', name: 'Khách VIP (Chi đậm, Mua nhiều)' },
  { color: '#3b82f6', name: 'Khách Tiềm năng (Mua thường xuyên, Giá trị vừa)' },
  { color: '#10b981', name: 'Khách Săn Khuyến Mãi (Mua nhiều lần nhưng giá trị thấp)' },
  { color: '#f59e0b', name: 'Khách Ngủ Đông (Lâu ngày không mua, chi ít)' },
  { color: '#a855f7', name: 'Khách Vãng Lai / Mua ngẫu nhiên' }
];

// Generate synthetic clusters
const generateData = (): CustomerPoint[] => {
  const points: CustomerPoint[] = [];
  let id = 1;

  // Group 1: High freq, high spend (VIP)
  for (let i = 0; i < 18; i++) {
    points.push({
      id: id++,
      freq: Math.floor(35 + Math.random() * 14),
      spend: Math.floor(3200 + Math.random() * 1500),
      cluster: 0
    });
  }
  // Group 2: High freq, low spend (Bargain hunters)
  for (let i = 0; i < 22; i++) {
    points.push({
      id: id++,
      freq: Math.floor(25 + Math.random() * 20),
      spend: Math.floor(300 + Math.random() * 700),
      cluster: 0
    });
  }
  // Group 3: Low freq, low spend (Dormant / casual)
  for (let i = 0; i < 25; i++) {
    points.push({
      id: id++,
      freq: Math.floor(2 + Math.random() * 12),
      spend: Math.floor(150 + Math.random() * 600),
      cluster: 0
    });
  }
  // Group 4: Low freq, high spend (Occasional big spenders)
  for (let i = 0; i < 15; i++) {
    points.push({
      id: id++,
      freq: Math.floor(4 + Math.random() * 10),
      spend: Math.floor(2600 + Math.random() * 1800),
      cluster: 0
    });
  }

  return points;
};

export const KMeansLab: React.FC = () => {
  const [points, setPoints] = useState<CustomerPoint[]>(generateData());
  const [k, setK] = useState<number>(3);
  const [step, setStep] = useState<number>(0);
  const [centroids, setCentroids] = useState<Centroid[]>(() => {
    return [
      { freq: 10, spend: 1000, color: CLUSTER_METADATA[0].color, name: CLUSTER_METADATA[0].name },
      { freq: 40, spend: 3500, color: CLUSTER_METADATA[1].color, name: CLUSTER_METADATA[1].name },
      { freq: 30, spend: 600, color: CLUSTER_METADATA[2].color, name: CLUSTER_METADATA[2].name }
    ];
  });

  // Re-seed centroids
  const reseedCentroids = (newK: number) => {
    const newCentroids: Centroid[] = [];
    for (let i = 0; i < newK; i++) {
      newCentroids.push({
        freq: Math.floor(5 + Math.random() * 40),
        spend: Math.floor(300 + Math.random() * 4000),
        color: CLUSTER_METADATA[i].color,
        name: CLUSTER_METADATA[i].name
      });
    }
    setCentroids(newCentroids);
    setStep(0);
    // Reset point clusters
    setPoints(points.map((p) => ({ ...p, cluster: -1 })));
  };

  // Run 1 step of K-Means
  const runOneStep = () => {
    // 1. Assign each point to closest centroid
    const updatedPoints = points.map((p) => {
      let minDist = Infinity;
      let closestCluster = 0;

      centroids.forEach((c, idx) => {
        // Normalized Euclidean distance (freq / 50, spend / 5000)
        const dFreq = (p.freq - c.freq) / 50;
        const dSpend = (p.spend - c.spend) / 5000;
        const dist = Math.sqrt(dFreq * dFreq + dSpend * dSpend);
        if (dist < minDist) {
          minDist = dist;
          closestCluster = idx;
        }
      });
      return { ...p, cluster: closestCluster };
    });

    // 2. Recompute centroids as mean of points in each cluster
    const updatedCentroids = centroids.map((c, idx) => {
      const clusterMembers = updatedPoints.filter((p) => p.cluster === idx);
      if (clusterMembers.length === 0) return c;

      const avgFreq = clusterMembers.reduce((sum, p) => sum + p.freq, 0) / clusterMembers.length;
      const avgSpend = clusterMembers.reduce((sum, p) => sum + p.spend, 0) / clusterMembers.length;

      return {
        ...c,
        freq: Math.round(avgFreq),
        spend: Math.round(avgSpend)
      };
    });

    setPoints(updatedPoints);
    setCentroids(updatedCentroids);
    setStep((prev) => prev + 1);
  };

  // Run full convergence
  const runFullConvergence = () => {
    let curPoints = [...points];
    let curCentroids = [...centroids];

    for (let iter = 0; iter < 10; iter++) {
      // Step 1: Assign
      curPoints = curPoints.map((p) => {
        let minDist = Infinity;
        let closest = 0;
        curCentroids.forEach((c, idx) => {
          const dFreq = (p.freq - c.freq) / 50;
          const dSpend = (p.spend - c.spend) / 5000;
          const dist = Math.sqrt(dFreq * dFreq + dSpend * dSpend);
          if (dist < minDist) {
            minDist = dist;
            closest = idx;
          }
        });
        return { ...p, cluster: closest };
      });

      // Step 2: Update centroids
      curCentroids = curCentroids.map((c, idx) => {
        const members = curPoints.filter((p) => p.cluster === idx);
        if (members.length === 0) return c;
        return {
          ...c,
          freq: Math.round(members.reduce((s, p) => s + p.freq, 0) / members.length),
          spend: Math.round(members.reduce((s, p) => s + p.spend, 0) / members.length)
        };
      });
    }

    setPoints(curPoints);
    setCentroids(curCentroids);
    setStep((prev) => prev + 10);
  };

  // SVG coordinates
  const padL = 50, padR = 25, padT = 20, padB = 40;
  const plotW = 500 - padL - padR;
  const plotH = 280 - padT - padB;

  const getSvgX = (freq: number) => padL + (freq / 50) * plotW;
  const getSvgY = (spend: number) => padT + ((5000 - spend) / 5000) * plotH;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-purple-400 bg-purple-950/60 border border-purple-800/60 px-2.5 py-0.5 rounded-full">
              Học không giám sát (Clustering Lab)
            </span>
            <span className="text-xs text-slate-400">Không cần gán nhãn trước</span>
          </div>
          <h3 className="text-xl font-bold text-white mt-1">Phân khúc Khách hàng E-Commerce bằng K-Means</h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => reseedCentroids(k)}
            className="flex items-center gap-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Khởi tạo lại tâm
          </button>
        </div>
      </div>

      <p className="text-sm text-slate-300 mt-3 mb-4 leading-relaxed">
        Trong thực tế, doanh nghiệp có hàng triệu người dùng nhưng <strong>không hề có nhãn sẵn</strong>. 
        K-Means tự động tìm ra các nhóm khách hàng có hành vi tương đồng để phòng Marketing gửi khuyến mãi phù hợp.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* SVG Plot */}
        <div className="lg:col-span-8 flex flex-col items-center bg-slate-950/80 rounded-xl p-4 border border-slate-800/80">
          <div className="w-full flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Trục Y: Tổng chi tiêu ($)</span>
            <span className="text-purple-400 font-medium">K = {k} Cụm | Bước lặp: {step}</span>
            <span>Trục X: Số lần mua sắm/năm</span>
          </div>

          <svg viewBox="0 0 500 280" className="w-full h-auto select-none">
            {/* Grid */}
            {[1000, 2500, 4000].map((val) => (
              <g key={`y-${val}`}>
                <line
                  x1={padL}
                  y1={getSvgY(val)}
                  x2={500 - padR}
                  y2={getSvgY(val)}
                  stroke="#334155"
                  strokeDasharray="3,3"
                  strokeWidth="0.8"
                />
                <text x={padL - 8} y={getSvgY(val) + 4} fill="#64748b" fontSize="10" textAnchor="end">
                  ${val}
                </text>
              </g>
            ))}

            {[10, 25, 40].map((val) => (
              <g key={`x-${val}`}>
                <line
                  x1={getSvgX(val)}
                  y1={padT}
                  x2={getSvgX(val)}
                  y2={280 - padB}
                  stroke="#334155"
                  strokeDasharray="3,3"
                  strokeWidth="0.8"
                />
                <text x={getSvgX(val)} y={280 - padB + 16} fill="#64748b" fontSize="10" textAnchor="middle">
                  {val} lần
                </text>
              </g>
            ))}

            {/* Customer Points */}
            {points.map((p) => {
              const color = p.cluster >= 0 ? centroids[p.cluster]?.color || '#94a3b8' : '#64748b';
              return (
                <circle
                  key={p.id}
                  cx={getSvgX(p.freq)}
                  cy={getSvgY(p.spend)}
                  r="4"
                  fill={color}
                  opacity="0.85"
                  stroke="#0f172a"
                  strokeWidth="1"
                  className="transition-colors duration-300"
                />
              );
            })}

            {/* Centroids (Big Pulsing Crosses) */}
            {centroids.map((c, idx) => (
              <g key={`centroid-${idx}`} className="transition-all duration-300">
                <circle
                  cx={getSvgX(c.freq)}
                  cy={getSvgY(c.spend)}
                  r="9"
                  fill={c.color}
                  stroke="#ffffff"
                  strokeWidth="2.5"
                  className="drop-shadow-lg"
                />
                <text
                  x={getSvgX(c.freq)}
                  y={getSvgY(c.spend) + 3.5}
                  fill="#ffffff"
                  fontSize="9"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  C{idx + 1}
                </text>
              </g>
            ))}
          </svg>

          {/* Stepper Controls */}
          <div className="w-full flex flex-wrap items-center justify-between gap-3 mt-3 pt-3 border-t border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Chọn số cụm (k):</span>
              {[2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  onClick={() => {
                    setK(num);
                    reseedCentroids(num);
                  }}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md transition ${
                    k === num
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  k = {num}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={runOneStep}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg transition border border-slate-700"
              >
                <SkipForward className="w-3.5 h-3.5 text-purple-400" />
                Bước tiếp theo (Next Step)
              </button>
              <button
                onClick={runFullConvergence}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold rounded-lg transition shadow-lg shadow-purple-900/40"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                Hội tụ hoàn toàn
              </button>
            </div>
          </div>
        </div>

        {/* Cluster Personas Explanations */}
        <div className="lg:col-span-4 flex flex-col justify-between gap-3">
          <div className="bg-slate-800/70 border border-slate-700/60 rounded-xl p-4">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-purple-400" />
              Chân dung khách hàng theo từng cụm
            </h4>

            <div className="space-y-2.5">
              {centroids.map((c, idx) => {
                const count = points.filter((p) => p.cluster === idx).length;
                const percent = ((count / points.length) * 100).toFixed(0);
                return (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg border border-slate-700/60 bg-slate-900/80 flex items-start gap-3"
                  >
                    <div
                      className="w-3.5 h-3.5 rounded-full shrink-0 mt-1"
                      style={{ backgroundColor: c.color }}
                    />
                    <div className="flex-1 text-xs">
                      <div className="flex items-center justify-between">
                        <strong className="text-slate-200">Cụm {idx + 1}</strong>
                        <span className="font-mono text-purple-300 font-medium">
                          {count} khách ({percent}%)
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Tâm cụm: ~{c.freq} đơn/năm • Chi trung bình ~${c.spend}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-purple-950/30 border border-purple-800/40 rounded-xl p-3.5 text-xs text-purple-200">
            <div className="flex items-center gap-1.5 font-semibold text-purple-300 mb-1">
              <Award className="w-4 h-4" />
              Ý nghĩa trong CV phỏng vấn
            </div>
            <p className="text-purple-300/80 leading-relaxed">
              Bạn có thể nói: <em>&quot;Em áp dụng K-Means kết hợp RFM để phân nhóm khách hàng, tối ưu số cụm k bằng Silhouette Score và đề xuất chiến dịch marketing cá nhân hóa cho từng nhóm.&quot;</em>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
