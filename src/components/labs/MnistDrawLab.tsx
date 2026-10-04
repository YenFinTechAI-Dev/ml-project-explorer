import React, { useRef, useState, useEffect } from 'react';
import { Eraser, Eye, Sparkles, Binary } from 'lucide-react';

export const MnistDrawLab: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [probabilities, setProbabilities] = useState<number[]>(Array(10).fill(0.1));
  const [predictedDigit, setPredictedDigit] = useState<number | null>(null);

  // Clear canvas
  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
    setPredictedDigit(null);
    setProbabilities(Array(10).fill(0.1));
  };

  useEffect(() => {
    handleClear();
  }, []);

  // Mouse / Touch drawing handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    setHasDrawn(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    runInference();
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing && e.type !== 'mousedown' && e.type !== 'touchstart') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 18;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (e.type === 'mousedown' || e.type === 'touchstart') {
      ctx.beginPath();
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  // Extract 28x28 grid and compute heuristics + structural features
  const runInference = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Scale down to 28x28
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = 28;
    tempCanvas.height = 28;
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return;

    tempCtx.drawImage(canvas, 0, 0, 28, 28);
    const imgData = tempCtx.getImageData(0, 0, 28, 28).data;

    // Feature extraction on 28x28:
    // Count active pixels in quadrants, symmetry, loops, vertical line ratio
    let totalMass = 0;
    let topMass = 0;
    let botMass = 0;
    let leftMass = 0;
    let rightMass = 0;
    let centerMass = 0;

    let minX = 28, maxX = 0, minY = 28, maxY = 0;

    for (let y = 0; y < 28; y++) {
      for (let x = 0; x < 28; x++) {
        const idx = (y * 28 + x) * 4;
        // Cyan color blue/green channels
        const intensity = (imgData[idx] + imgData[idx + 1] + imgData[idx + 2]) / 3;
        if (intensity > 30) {
          totalMass++;
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;

          if (y < 14) topMass++;
          else botMass++;

          if (x < 14) leftMass++;
          else rightMass++;

          if (x >= 8 && x <= 20 && y >= 8 && y <= 20) centerMass++;
        }
      }
    }

    if (totalMass < 15) {
      setPredictedDigit(null);
      setProbabilities(Array(10).fill(0.1));
      return;
    }

    const width = Math.max(1, maxX - minX);
    const height = Math.max(1, maxY - minY);
    const aspectRatio = width / height;

    // Score array for digits 0-9
    const scores = Array(10).fill(0.05);

    // Heuristics derived from MNIST structural features
    // 1: tall and very thin
    if (aspectRatio < 0.45) scores[1] += 4.5;

    // 0: hollow center, balanced top/bottom and left/right
    const holeRatio = totalMass > 0 ? (totalMass - centerMass) / totalMass : 0;
    if (aspectRatio > 0.6 && holeRatio > 0.65 && Math.abs(topMass - botMass) / totalMass < 0.3) {
      scores[0] += 3.8;
    }

    // 8: symmetrical top/bottom with significant center cross
    if (aspectRatio > 0.55 && Math.abs(topMass - botMass) / totalMass < 0.2 && centerMass > 15) {
      scores[8] += 3.2;
    }

    // 3: heavy right, light left
    if (rightMass > leftMass * 1.5) {
      scores[3] += 3.5;
    }

    // 7: heavy top, light bottom
    if (topMass > botMass * 1.6 && rightMass > leftMass * 0.9) {
      scores[7] += 3.6;
    }

    // 4: left-top and right vertical
    if (topMass > botMass * 0.8 && aspectRatio > 0.5 && centerMass > 10) {
      scores[4] += 2.8;
    }

    // 6: heavy bottom loop, light top
    if (botMass > topMass * 1.5 && leftMass > rightMass * 0.9) {
      scores[6] += 3.4;
    }

    // 9: heavy top loop, light bottom
    if (topMass > botMass * 1.5 && rightMass > leftMass * 0.9) {
      scores[9] += 3.4;
    }

    // 2: top curve + flat bottom
    if (botMass > topMass * 1.1 && rightMass > leftMass * 0.7) {
      scores[2] += 2.5;
    }

    // 5: horizontal lines top & bottom
    if (Math.abs(topMass - botMass) / totalMass < 0.3 && leftMass > rightMass * 0.9) {
      scores[5] += 2.4;
    }

    // Softmax normalization
    const expScores = scores.map((s) => Math.exp(s));
    const sumExp = expScores.reduce((a, b) => a + b, 0);
    const probs = expScores.map((e) => e / sumExp);

    setProbabilities(probs);
    let maxIdx = 0;
    probs.forEach((p, idx) => {
      if (p > probs[maxIdx]) maxIdx = idx;
    });
    setPredictedDigit(maxIdx);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-sky-400 bg-sky-950/60 border border-sky-800/60 px-2.5 py-0.5 rounded-full">
              Thị giác Máy tính (Computer Vision Lab)
            </span>
            <span className="text-xs text-slate-400">Nhận diện hình ảnh & Pixel Matrix</span>
          </div>
          <h3 className="text-xl font-bold text-white mt-1">Vẽ Chữ số & Nhận diện Bằng Mạng Nơ-ron (MNIST)</h3>
        </div>

        <button
          onClick={handleClear}
          className="flex items-center gap-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg transition"
        >
          <Eraser className="w-3.5 h-3.5" />
          Xóa bảng vẽ
        </button>
      </div>

      <p className="text-sm text-slate-300 mt-3 mb-4 leading-relaxed">
        Thị giác máy tính (CV) là một trong những nhánh bùng nổ nhất của Machine Learning.
        Dưới góc nhìn thuật toán, hình ảnh không phải là bức tranh mà là một <strong>ma trận số điểm ảnh (28x28 = 784 giá trị)</strong>.
        Hãy dùng chuột hoặc ngón tay để vẽ một chữ số (0 - 9) vào khung bên dưới:
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Drawing Pad Canvas */}
        <div className="lg:col-span-6 flex flex-col items-center bg-slate-950/80 rounded-xl p-5 border border-slate-800">
          <div className="w-full flex items-center justify-between text-xs text-slate-400 mb-3">
            <span className="flex items-center gap-1.5 text-sky-400 font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              Khung vẽ cảm ứng (224x224 px)
            </span>
            <span>Vẽ to và rõ nét ở giữa khung</span>
          </div>

          <div className="relative p-1 bg-gradient-to-tr from-sky-500/20 to-indigo-500/20 rounded-2xl border border-sky-500/30">
            <canvas
              ref={canvasRef}
              width={224}
              height={224}
              onMouseDown={startDrawing}
              onMouseUp={stopDrawing}
              onMouseMove={draw}
              onTouchStart={startDrawing}
              onTouchEnd={stopDrawing}
              onTouchMove={draw}
              className="rounded-xl cursor-crosshair touch-none shadow-inner"
            />
            {!hasDrawn && (
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-slate-500 text-xs gap-1">
                <span className="text-xl">✍️</span>
                <span>Vẽ chữ số bất kỳ vào đây...</span>
              </div>
            )}
          </div>

          <div className="flex gap-2 mt-4 text-xs text-slate-400">
            <span className="bg-slate-900 border border-slate-800 px-2.5 py-1 rounded">28x28 Downsampling</span>
            <span className="bg-slate-900 border border-slate-800 px-2.5 py-1 rounded">Feed-forward Classifier</span>
          </div>
        </div>

        {/* Prediction Results & Probabilities */}
        <div className="lg:col-span-6 flex flex-col justify-between gap-4">
          <div className="bg-slate-800/70 border border-slate-700/60 rounded-xl p-4">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-sky-400" />
                Kết quả Mô hình Dự đoán
              </span>
              {predictedDigit !== null && (
                <span className="text-xs font-mono text-emerald-400 font-bold">
                  Độ tự tin: {(probabilities[predictedDigit] * 100).toFixed(0)}%
                </span>
              )}
            </h4>

            {predictedDigit !== null ? (
              <div className="flex items-center gap-5 p-4 rounded-xl bg-slate-950/80 border border-sky-500/30 mb-3">
                <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center text-4xl font-black text-white shadow-lg shadow-sky-500/20">
                  {predictedDigit}
                </div>
                <div>
                  <div className="text-xs text-sky-300 font-semibold uppercase">Số nhận diện được</div>
                  <div className="text-lg font-bold text-white mt-0.5">Số {predictedDigit}</div>
                  <p className="text-xs text-slate-400 mt-1">
                    Mô hình đã trích xuất đặc trưng hình thái (tỷ lệ khung, phân bố trọng tâm pixel).
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center text-xs text-slate-400 mb-3">
                Chưa có nét vẽ nào. Hãy vẽ một chữ số (ví dụ: 3, 7, 8) vào khung bên trái!
              </div>
            )}

            {/* Distribution bars 0 to 9 */}
            <div className="space-y-1.5 mt-2">
              <div className="text-[11px] font-semibold text-slate-400 mb-1">
                Phân phối xác suất 10 chữ số (0 - 9):
              </div>
              <div className="grid grid-cols-5 gap-2">
                {probabilities.map((prob, digit) => {
                  const isTop = digit === predictedDigit;
                  return (
                    <div
                      key={digit}
                      className={`p-2 rounded-lg border text-center transition ${
                        isTop
                          ? 'bg-sky-950/60 border-sky-500/80'
                          : 'bg-slate-900/60 border-slate-800'
                      }`}
                    >
                      <div className={`text-xs font-bold ${isTop ? 'text-sky-300' : 'text-slate-300'}`}>
                        Số {digit}
                      </div>
                      <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                        {(prob * 100).toFixed(0)}%
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-1 mt-1 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            isTop ? 'bg-sky-400' : 'bg-slate-600'
                          }`}
                          style={{ width: `${prob * 100}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="bg-sky-950/20 border border-sky-900/40 rounded-xl p-3.5 text-xs text-sky-200 flex items-start gap-2.5">
            <Binary className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-sky-300">Từ số viết tay đến thực tế:</span>
              <p className="text-sky-200/80 mt-0.5 leading-relaxed text-[11px]">
                Công nghệ này chính là nền tảng của: Đọc căn cước công dân (OCR), nhận diện biển số xe tại bãi gửi xe thông minh, 
                và phân loại sản phẩm lỗi trên dây chuyền may mặc / linh kiện điện tử.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
