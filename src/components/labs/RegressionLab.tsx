import React, { useState, useMemo } from 'react';
import { RefreshCw, Plus, TrendingUp, Info, HelpCircle } from 'lucide-react';

interface Point {
  x: number; // Diện tích m2 (30 - 200)
  y: number; // Giá tỷ VNĐ (1.5 - 15)
}

const INITIAL_POINTS: Point[] = [
  { x: 40, y: 2.1 },
  { x: 55, y: 2.8 },
  { x: 65, y: 3.5 },
  { x: 75, y: 4.2 },
  { x: 85, y: 4.9 },
  { x: 100, y: 6.3 },
  { x: 120, y: 7.8 },
  { x: 140, y: 9.6 },
  { x: 160, y: 11.2 },
  { x: 180, y: 13.5 }
];

export const RegressionLab: React.FC = () => {
  const [points, setPoints] = useState<Point[]>(INITIAL_POINTS);
  const [degree, setDegree] = useState<number>(1);
  const [queryArea, setQueryArea] = useState<number>(90);

  // Polynomial fit using Least Squares
  const { coefficients, r2, rmse, predict } = useMemo(() => {
    const n = points.length;
    if (n < degree + 1) {
      return { coefficients: [0], r2: 0, rmse: 0, predict: (_x: number) => 0 };
    }

    // Prepare Vandermonde matrix X and target y
    const m = degree + 1;
    const ATA = Array.from({ length: m }, () => Array(m).fill(0));
    const ATY = Array(m).fill(0);

    for (let i = 0; i < n; i++) {
      const xi = points[i].x;
      const yi = points[i].y;
      for (let r = 0; r < m; r++) {
        for (let c = 0; c < m; c++) {
          ATA[r][c] += Math.pow(xi, r + c);
        }
        ATY[r] += yi * Math.pow(xi, r);
      }
    }

    // Gaussian elimination with partial pivoting
    const A = ATA.map((row, idx) => [...row, ATY[idx]]);
    for (let i = 0; i < m; i++) {
      let maxEl = Math.abs(A[i][i]);
      let maxRow = i;
      for (let k = i + 1; k < m; k++) {
        if (Math.abs(A[k][i]) > maxEl) {
          maxEl = Math.abs(A[k][i]);
          maxRow = k;
        }
      }
      for (let k = i; k < m + 1; k++) {
        const tmp = A[maxRow][k];
        A[maxRow][k] = A[i][k];
        A[i][k] = tmp;
      }
      if (Math.abs(A[i][i]) < 1e-12) continue;
      for (let k = i + 1; k < m; k++) {
        const c = -A[k][i] / A[i][i];
        for (let j = i; j < m + 1; j++) {
          if (i === j) A[k][j] = 0;
          else A[k][j] += c * A[i][j];
        }
      }
    }

    const coeffs = Array(m).fill(0);
    for (let i = m - 1; i >= 0; i--) {
      coeffs[i] = A[i][m] / (A[i][i] || 1e-9);
      for (let k = i - 1; k >= 0; k--) {
        A[k][m] -= A[k][i] * coeffs[i];
      }
    }

    const predictFn = (x: number) => {
      let val = 0;
      for (let d = 0; d < m; d++) {
        val += coeffs[d] * Math.pow(x, d);
      }
      return val;
    };

    // Calculate metrics
    const meanY = points.reduce((acc, p) => acc + p.y, 0) / n;
    let ssTot = 0;
    let ssRes = 0;
    points.forEach((p) => {
      const pred = predictFn(p.x);
      ssTot += Math.pow(p.y - meanY, 2);
      ssRes += Math.pow(p.y - pred, 2);
    });

    const r2Val = ssTot === 0 ? 1 : Math.max(0, 1 - ssRes / ssTot);
    const rmseVal = Math.sqrt(ssRes / n);

    return {
      coefficients: coeffs,
      r2: r2Val,
      rmse: rmseVal,
      predict: predictFn
    };
  }, [points, degree]);

  // Click SVG to add point
  const handleSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Convert pixel to data coordinates (width=500, height=280)
    // padding: left=50, right=20, top=20, bottom=40
    const padL = 50, padR = 20, padT = 20, padB = 40;
    const plotW = 500 - padL - padR;
    const plotH = 280 - padT - padB;

    if (clickX >= padL && clickX <= 500 - padR && clickY >= padT && clickY <= 280 - padB) {
      const xVal = 30 + ((clickX - padL) / plotW) * 170;
      const yVal = 16 - ((clickY - padT) / plotH) * 15;
      setPoints([...points, { x: Math.round(xVal), y: Number(Math.max(1, yVal).toFixed(1)) }]);
    }
  };

  const resetPoints = () => setPoints(INITIAL_POINTS);
  const predictedPrice = predict(queryArea);

  // SVG coordinate transformation
  const padL = 50, padR = 20, padT = 20, padB = 40;
  const plotW = 500 - padL - padR;
  const plotH = 280 - padT - padB;

  const getSvgX = (x: number) => padL + ((x - 30) / 170) * plotW;
  const getSvgY = (y: number) => padT + ((16 - y) / 15) * plotH;

  // Generate curve path
  const curvePath = useMemo(() => {
    const steps = 60;
    let d = '';
    for (let i = 0; i <= steps; i++) {
      const xVal = 30 + (i / steps) * 170;
      const yVal = predict(xVal);
      const sx = getSvgX(xVal);
      const sy = getSvgY(Math.min(18, Math.max(0, yVal)));
      if (i === 0) d += `M ${sx} ${sy}`;
      else d += ` L ${sx} ${sy}`;
    }
    return d;
  }, [predict]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2.5 py-0.5 rounded-full">
              Thực nghiệm Hồi quy (Regression Lab)
            </span>
            <span className="text-xs text-slate-400">Dự đoán biến định lượng</span>
          </div>
          <h3 className="text-xl font-bold text-white mt-1">Dự đoán Giá Nhà dựa trên Diện tích</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={resetPoints}
            className="flex items-center gap-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Khôi phục mẫu ban đầu
          </button>
        </div>
      </div>

      <p className="text-sm text-slate-300 mt-3 mb-4 leading-relaxed">
        Khác với phân loại Spam (chỉ ra nhãn Đúng/Sai), bài toán Hồi quy dự đoán một <strong>con số liên tục</strong>. 
        Bạn có thể <em>nhấp chuột trực tiếp lên đồ thị bên dưới để thêm điểm bất động sản mới</em>, 
        hoặc đổi bậc hàm số để quan sát sự thích ứng của mô hình.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Interactive Chart Canvas */}
        <div className="lg:col-span-8 flex flex-col items-center bg-slate-950/80 rounded-xl p-4 border border-slate-800/80">
          <div className="w-full flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Trục Y: Giá nhà (Tỷ VNĐ)</span>
            <span className="text-emerald-400 font-medium">💡 Nhấp chuột để thêm căn nhà mới</span>
            <span>Trục X: Diện tích (m²)</span>
          </div>

          <svg
            viewBox="0 0 500 280"
            className="w-full h-auto cursor-crosshair select-none"
            onClick={handleSvgClick}
          >
            {/* Grid lines */}
            {[2, 5, 8, 11, 14].map((val) => (
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
                  {val}T
                </text>
              </g>
            ))}

            {[50, 90, 130, 170].map((val) => (
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
                  {val}m²
                </text>
              </g>
            ))}

            {/* Regression Fitted Curve */}
            <path
              d={curvePath}
              fill="none"
              stroke="#10b981"
              strokeWidth="2.5"
              className="transition-all duration-200"
            />

            {/* Residual lines from points to curve */}
            {points.map((p, idx) => {
              const py = predict(p.x);
              return (
                <line
                  key={`res-${idx}`}
                  x1={getSvgX(p.x)}
                  y1={getSvgY(p.y)}
                  x2={getSvgX(p.x)}
                  y2={getSvgY(py)}
                  stroke="#f43f5e"
                  strokeWidth="1"
                  strokeDasharray="2,2"
                  opacity="0.5"
                />
              );
            })}

            {/* Data points */}
            {points.map((p, idx) => (
              <circle
                key={`point-${idx}`}
                cx={getSvgX(p.x)}
                cy={getSvgY(p.y)}
                r="4.5"
                fill="#38bdf8"
                stroke="#0f172a"
                strokeWidth="1.5"
                className="hover:r-6 transition-all"
              />
            ))}

            {/* Interactive Query Area Point */}
            <circle
              cx={getSvgX(queryArea)}
              cy={getSvgY(predictedPrice)}
              r="6.5"
              fill="#f59e0b"
              stroke="#ffffff"
              strokeWidth="2"
            />
          </svg>

          {/* Controls Bar */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 pt-3 border-t border-slate-800">
            <div>
              <label className="text-xs font-medium text-slate-300 flex items-center justify-between">
                <span>Bậc đa thức (Degree):</span>
                <span className="text-emerald-400 font-bold">
                  {degree === 1 ? 'Bậc 1 (Tuyến tính - Linear)' : degree === 2 ? 'Bậc 2 (Parabol)' : 'Bậc 3 (Đa thức phi tuyến)'}
                </span>
              </label>
              <div className="flex gap-2 mt-1.5">
                {[1, 2, 3].map((d) => (
                  <button
                    key={d}
                    onClick={() => setDegree(d)}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition ${
                      degree === d
                        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40'
                        : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                    }`}
                  >
                    Bậc {d}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 flex items-center justify-between">
                <span>Dự đoán thử diện tích nhà:</span>
                <span className="text-amber-400 font-bold">{queryArea} m²</span>
              </label>
              <input
                type="range"
                min="35"
                max="195"
                value={queryArea}
                onChange={(e) => setQueryArea(Number(e.target.value))}
                className="w-full mt-2 accent-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Real-time Metrics & Insights */}
        <div className="lg:col-span-4 flex flex-col justify-between gap-4">
          <div className="bg-slate-800/70 border border-slate-700/60 rounded-xl p-4">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              Kết quả dự đoán ngay lúc này
            </h4>
            <div className="bg-slate-900/90 rounded-lg p-3 border border-slate-700/50">
              <div className="text-xs text-slate-400">Căn nhà diện tích <strong className="text-white">{queryArea} m²</strong>:</div>
              <div className="text-2xl font-black text-amber-400 mt-1">
                {predictedPrice > 0 ? `${predictedPrice.toFixed(2)} Tỷ VNĐ` : 'Không hợp lệ'}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Đơn giá ước tính: ~{predictedPrice > 0 ? ((predictedPrice * 1000) / queryArea).toFixed(1) : 0} triệu/m²
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 flex items-center gap-1">
                  Hệ số R² (R-squared):
                  <HelpCircle className="w-3 h-3 text-slate-500" />
                </span>
                <span className="font-mono font-bold text-emerald-400">{(r2 * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-slate-700/50 rounded-full h-1.5">
                <div
                  className="bg-emerald-500 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, Math.max(0, r2 * 100))}%` }}
                />
              </div>

              <div className="flex justify-between items-center text-xs pt-1">
                <span className="text-slate-400">Sai số RMSE:</span>
                <span className="font-mono font-bold text-rose-400">±{rmse.toFixed(2)} Tỷ</span>
              </div>

              <div className="flex justify-between items-center text-xs pt-1">
                <span className="text-slate-400">Số điểm dữ liệu:</span>
                <span className="font-mono font-semibold text-sky-400">{points.length} bất động sản</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-4 text-xs text-slate-300 space-y-2">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">Tại sao không phải là Spam hay Chatbot?</strong>
                <p className="text-slate-400 mt-0.5">
                  Trong kinh doanh thực tế, bài toán Hồi quy xuất hiện khắp nơi: định giá xe cũ, tính cước Grab, dự báo doanh thu quý, tính hạn mức cho vay tiêu dùng.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
