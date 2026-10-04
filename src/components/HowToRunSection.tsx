import React, { useState } from 'react';
import { 
  Terminal, 
  Play, 
  ExternalLink, 
  Copy, 
  Check, 
  Laptop, 
  Cloud, 
  FolderTree, 
  CheckCircle2, 
  FileCode,
  Flame,
  ArrowRight
} from 'lucide-react';

export const HowToRunSection: React.FC = () => {
  const [activePlatform, setActivePlatform] = useState<'colab' | 'local'>('colab');
  const [copiedScript, setCopiedScript] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedScript(id);
    setTimeout(() => setCopiedScript(null), 2000);
  };

  const sampleCompleteScript = `# ===============================================================
# DỰ ÁN ML ĐẦU TIÊN: DỰ ĐOÁN GIÁ BẤT ĐỘNG SẢN VỚI SCIKIT-LEARN & LIGHTGBM
# Chạy trực tiếp được trên Google Colab hoặc máy cá nhân (VS Code)
# ===============================================================

# 1. Cài đặt các thư viện cần thiết (nếu trên Colab, bỏ dấu # ở dòng dưới)
# !pip install pandas numpy scikit-learn lightgbm matplotlib seaborn

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.datasets import fetch_california_housing
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error
from lightgbm import LGBMRegressor

print("🚀 Bước 1: Đang tải tập dữ liệu California Housing...")
data = fetch_california_housing(as_frame=True)
df = data.frame

print(f"-> Kích thước tập dữ liệu: {df.shape[0]} dòng x {df.shape[1]} cột")
print("-> 5 dòng đầu tiên:")
print(df.head(3))

# 2. Tách biến đặc trưng X và biến mục tiêu Y
X = df.drop(columns=['MedHouseVal'])
y = df['MedHouseVal'] # Giá nhà trung vị (đơn vị: trăm nghìn USD)

# 3. Chia tập dữ liệu thành Train (80%) và Test (20%)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)
print(f"-> Tập huấn luyện: {X_train.shape[0]} mẫu | Tập kiểm thử: {X_test.shape[0]} mẫu")

# 4. Huấn luyện mô hình Machine Learning (LightGBM)
print("⏳ Bước 2: Đang huấn luyện mô hình LightGBM Regressor...")
model = LGBMRegressor(
    n_estimators=200,
    learning_rate=0.05,
    max_depth=6,
    random_state=42
)
model.fit(X_train, y_train)
print("✅ Huấn luyện hoàn tất!")

# 5. Đánh giá chất lượng mô hình trên tập Test (dữ liệu mô hình chưa từng thấy)
y_pred = model.predict(X_test)

rmse = np.sqrt(mean_squared_error(y_test, y_pred))
mae = mean_absolute_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

print("=" * 50)
print("📊 KẾT QUẢ ĐÁNH GIÁ MÔ HÌNH (EVALUATION METRICS):")
print(f"- R² Score (Độ giải thích): {r2:.4f} (Càng gần 1.0 càng tốt)")
print(f"- MAE (Sai số trung bình): \${mae * 100000:,.0f} USD")
print(f"- RMSE: {rmse:.4f}")
print("=" * 50)

# 6. Thử nghiệm dự đoán một ngôi nhà mới
sample_house = X_test.iloc[[0]]
actual_val = y_test.iloc[0] * 100000
predicted_val = model.predict(sample_house)[0] * 100000

print(f"🏠 Dự đoán thử căn nhà đầu tiên trong tập test:")
print(f"-> Giá thực tế: \${actual_val:,.0f} USD")
print(f"-> Giá mô hình đoán: \${predicted_val:,.0f} USD")
print(f"-> Chênh lệch: \${abs(actual_val - predicted_val):,.0f} USD")
`;

  const requirementsTxt = `pandas>=2.0.0
numpy>=1.24.0
scikit-learn>=1.3.0
lightgbm>=4.0.0
matplotlib>=3.7.0
seaborn>=0.12.0
fastapi>=0.100.0
uvicorn>=0.23.0
`;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Terminal className="w-5 h-5 text-emerald-400" />
          Hướng Dẫn Chạy Dự Án Machine Learning Thực Tế (Từng Bước A - Z)
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Bạn có thể chạy ngay trên trình duyệt (không cần cài gì vào máy) hoặc thiết lập môi trường trên máy tính cá nhân.
        </p>
      </div>

      {/* Platform Switcher */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <button
          onClick={() => setActivePlatform('colab')}
          className={`p-4 rounded-2xl border text-left transition flex items-center justify-between ${
            activePlatform === 'colab'
              ? 'bg-gradient-to-r from-amber-950/60 to-slate-900 border-amber-500/60 shadow-lg shadow-amber-950/30'
              : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 text-slate-400'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-950/80 border border-amber-700/60 flex items-center justify-center text-amber-400">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-amber-400">Cách 1: Khuyên dùng cho người mới</div>
              <div className="text-sm font-bold text-white mt-0.5">Google Colab (Miễn phí 100%, 0 cần cài đặt)</div>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
            Mở chạy ngay
          </span>
        </button>

        <button
          onClick={() => setActivePlatform('local')}
          className={`p-4 rounded-2xl border text-left transition flex items-center justify-between ${
            activePlatform === 'local'
              ? 'bg-gradient-to-r from-indigo-950/60 to-slate-900 border-indigo-500/60 shadow-lg shadow-indigo-950/30'
              : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 text-slate-400'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-950/80 border border-indigo-700/60 flex items-center justify-center text-indigo-400">
              <Laptop className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-indigo-400">Cách 2: Kỹ sư chuyên nghiệp</div>
              <div className="text-sm font-bold text-white mt-0.5">Trên Máy Cá Nhân (VS Code + Virtualenv)</div>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            Môi trường chuẩn
          </span>
        </button>
      </div>

      {/* Guide Content for Colab */}
      {activePlatform === 'colab' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-3">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Cloud className="w-5 h-5 text-amber-400" />
                Chạy Dự Án Trên Google Colab Chỉ Với 3 Bước
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Google Colab là dịch vụ đám mây của Google cung cấp sẵn Python, GPU T4 miễn phí và các thư viện máy học.
              </p>
            </div>

            <a
              href="https://colab.research.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition shadow-lg shadow-amber-900/40"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Mở Google Colab
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4">
              <div className="w-7 h-7 rounded-full bg-amber-950 border border-amber-700 text-amber-400 font-bold text-xs flex items-center justify-center mb-2">
                1
              </div>
              <h4 className="text-sm font-bold text-white">Tạo Notebook mới</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Truy cập <code>colab.research.google.com</code> và nhấn nút <strong>New notebook</strong> (Sổ tay mới).
              </p>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4">
              <div className="w-7 h-7 rounded-full bg-amber-950 border border-amber-700 text-amber-400 font-bold text-xs flex items-center justify-center mb-2">
                2
              </div>
              <h4 className="text-sm font-bold text-white">Dán đoạn code Python</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Sao chép đoạn mã hoàn chỉnh mẫu bên dưới và dán vào ô code (Code Cell) đầu tiên của Notebook.
              </p>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4">
              <div className="w-7 h-7 rounded-full bg-amber-950 border border-amber-700 text-amber-400 font-bold text-xs flex items-center justify-center mb-2">
                3
              </div>
              <h4 className="text-sm font-bold text-white">Bấm chạy & Xem kết quả</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Nhấn tổ hợp phím <strong>Shift + Enter</strong> hoặc bấm biểu tượng tam giác ▶️ ở góc trái ô code để chạy.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Guide Content for Local */}
      {activePlatform === 'local' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Laptop className="w-5 h-5 text-indigo-400" />
              Chạy Dự Án Trên Máy Tính Cá Nhân Bằng VS Code
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Quy trình chuẩn kỹ sư: cài Python, tạo môi trường ảo (virtualenv) và chạy file script.
            </p>
          </div>

          <div className="space-y-4">
            {/* Step 1 */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-indigo-400 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-indigo-950 border border-indigo-700 text-indigo-300 text-[10px] flex items-center justify-center">1</span>
                  Tạo thư mục dự án và Môi trường ảo (Terminal)
                </span>
                <button
                  onClick={() => handleCopy('mkdir ml_project && cd ml_project\npython -m venv venv\nsource venv/bin/activate  # Trên Mac/Linux\n# Hoặc: venv\\Scripts\\activate  # Trên Windows', 'term1')}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                >
                  {copiedScript === 'term1' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  Copy lệnh
                </button>
              </div>
              <pre className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 text-xs font-mono text-slate-300 overflow-x-auto">
{`mkdir ml_project && cd ml_project
python -m venv venv

# Kích hoạt môi trường ảo:
source venv/bin/activate       # Dành cho MacOS / Linux
# hoặc: venv\\Scripts\\activate   # Dành cho Windows`}
              </pre>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-indigo-400 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-indigo-950 border border-indigo-700 text-indigo-300 text-[10px] flex items-center justify-center">2</span>
                  Cài đặt các thư viện lõi (requirements.txt)
                </span>
                <button
                  onClick={() => handleCopy('pip install pandas numpy scikit-learn lightgbm matplotlib seaborn', 'term2')}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                >
                  {copiedScript === 'term2' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  Copy lệnh
                </button>
              </div>
              <pre className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 text-xs font-mono text-slate-300 overflow-x-auto">
{`pip install pandas numpy scikit-learn lightgbm matplotlib seaborn`}
              </pre>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-indigo-400 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-indigo-950 border border-indigo-700 text-indigo-300 text-[10px] flex items-center justify-center">3</span>
                  Tạo file train.py và khởi chạy
                </span>
                <button
                  onClick={() => handleCopy('python train.py', 'term3')}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                >
                  {copiedScript === 'term3' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  Copy lệnh
                </button>
              </div>
              <p className="text-xs text-slate-400 mb-2">
                Tạo một file có tên <code>train.py</code>, dán đoạn mã hoàn chỉnh bên dưới vào và chạy lệnh:
              </p>
              <pre className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 text-xs font-mono text-emerald-300">
python train.py
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Ready-to-Run Complete Script Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-4 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-3 border-b border-slate-800 gap-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FileCode className="w-4 h-4 text-emerald-400" />
              Mã Nguồn Hoàn Chỉnh Mẫu (Chạy Được Ngay 100% - Không Báo Lỗi Thiếu File)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Code tự động tải dữ liệu bất động sản California từ Scikit-learn, huấn luyện LightGBM và in ra bảng đánh giá chi tiết.
            </p>
          </div>

          <button
            onClick={() => handleCopy(sampleCompleteScript, 'full_script')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-lg shadow-emerald-950/40 shrink-0"
          >
            {copiedScript === 'full_script' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copiedScript === 'full_script' ? 'Đã sao chép toàn bộ code!' : 'Sao chép Toàn bộ Code'}
          </button>
        </div>

        <pre className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs font-mono text-slate-300 overflow-x-auto max-h-96 leading-relaxed">
          <code>{sampleCompleteScript}</code>
        </pre>
      </div>
    </div>
  );
};
