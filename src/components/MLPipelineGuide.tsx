import React, { useState } from 'react';
import { 
  Database, 
  Search, 
  Wrench, 
  Cpu, 
  BarChart3, 
  Rocket, 
  CheckCircle2, 
  ChevronRight,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';

interface Stage {
  number: string;
  title: string;
  timeSpent: string;
  icon: React.ReactNode;
  summary: string;
  keyActions: string[];
  commonMistakes: string[];
  recommendedTools: string[];
}

const PIPELINE_STAGES: Stage[] = [
  {
    number: '01',
    title: 'Xác định Bài toán & Thu thập Dữ liệu (Problem Framing & Data Sourcing)',
    timeSpent: '15% tổng thời gian',
    icon: <Database className="w-5 h-5 text-sky-400" />,
    summary: 'Biến câu hỏi kinh doanh mơ hồ thành bài toán Machine Learning cụ thể (Hồi quy, Phân loại, hay Phân cụm).',
    keyActions: [
      'Xác định rõ biến mục tiêu (Target Variable Y) và những biến đặc trưng (Features X) có thể lấy được ở thời điểm dự đoán.',
      'Thu thập dữ liệu từ Database SQL nội bộ, file log, API bên thứ ba hoặc bộ dữ liệu mở (Kaggle/UCI).',
      'Định lượng giá trị kinh doanh: Mô hình sẽ giúp tiết kiệm bao nhiêu tiền hoặc tăng bao nhiêu phần trăm doanh thu?'
    ],
    commonMistakes: [
      'Chưa hiểu rõ bài toán đã vội vàng tải dữ liệu về train.',
      'Sử dụng các biến xuất hiện SAU KHI sự kiện xảy ra (Data Leakage / Target Leakage).'
    ],
    recommendedTools: ['PostgreSQL', 'Pandas', 'DVC (Data Version Control)', 'SQLAlchemy']
  },
  {
    number: '02',
    title: 'Khám phá Dữ liệu & Tiền xử lý (EDA & Data Cleaning)',
    timeSpent: '35% tổng thời gian',
    icon: <Search className="w-5 h-5 text-indigo-400" />,
    summary: 'Tìm hiểu phân phối, phát hiện ngoại lai (Outliers), xử lý giá trị thiếu (Missing values) và kiểm tra tính cân bằng dữ liệu.',
    keyActions: [
      'Phân tích phân phối của biến mục tiêu (Skewness, Kurtosis). Áp dụng Log Transform nếu bị lệch mạnh.',
      'Xử lý giá trị bị khuyết (Imputation): Điền Median/Mean hoặc dùng KNNImputer.',
      'Phát hiện và quyết định cách xử lý Outliers bằng IQR hoặc Z-score.',
      'Vẽ ma trận tương quan (Heatmap Pearson/Spearman) để phát hiện đa cộng tuyến.'
    ],
    commonMistakes: [
      'Tự tiện xóa các hàng có giá trị thiếu mà không tìm hiểu nguyên nhân tại sao dữ liệu bị thiếu.',
      'Áp dụng StandardScaler TRƯỚC KHI chia tập Train/Test (làm rò rỉ thông tin của tập test vào train).'
    ],
    recommendedTools: ['Seaborn', 'Matplotlib', 'YData Profiling', 'Missingno']
  },
  {
    number: '03',
    title: 'Kỹ thuật Đặc trưng (Feature Engineering)',
    timeSpent: '25% tổng thời gian',
    icon: <Wrench className="w-5 h-5 text-emerald-400" />,
    summary: 'Yếu tố quyết định 80% độ chính xác của mô hình: biến dữ liệu thô thành các biến có ý nghĩa cao.',
    keyActions: [
      'Tạo các biến tích hợp: Tỷ lệ (Ratio), Tổng số ngày (Recency), Độ lệch so với mức trung bình.',
      'Với chuỗi thời gian: Tạo Lag features (doanh số 7 ngày trước) và Rolling window statistics (trung bình trượt 14 ngày).',
      'Với dữ liệu phân loại (Categorical): Target Encoding, Frequency Encoding hoặc One-Hot Encoding.',
      'Lựa chọn đặc trưng (Feature Selection): Loại bỏ biến nhiễu bằng Random Forest Feature Importance hoặc Permutation Importance.'
    ],
    commonMistakes: [
      'Tạo quá nhiều biến (Curse of Dimensionality) khiến mô hình bị Overfitting nặng.',
      'Không lưu lại transformer/scaler để áp dụng đồng nhất lúc dự đoán dữ liệu mới.'
    ],
    recommendedTools: ['Scikit-learn Pipelines', 'Category Encoders', 'Feature-engine']
  },
  {
    number: '04',
    title: 'Huấn luyện & Tối ưu Tham số (Model Training & Tuning)',
    timeSpent: '15% tổng thời gian',
    icon: <Cpu className="w-5 h-5 text-purple-400" />,
    summary: 'Xây dựng mô hình Baseline đơn giản trước, sau đó thử nghiệm các thuật toán mạnh mẽ và tối ưu Hyperparameters.',
    keyActions: [
      'Bắt đầu với Baseline đơn giản (Linear Regression / Logistic Regression) làm mốc so sánh.',
      'Thử nghiệm các họ thuật toán cây quyết định mạnh mẽ: LightGBM, XGBoost, CatBoost.',
      'Sử dụng K-Fold Stratified Cross-Validation (hoặc TimeSeriesSplit cho chuỗi thời gian).',
      'Tối ưu siêu tham số tự động bằng Bayesian Optimization (Optuna).'
    ],
    commonMistakes: [
      'Vừa vào đã dùng Deep Learning phức tạp trong khi dữ liệu bảng thì LightGBM/XGBoost chạy nhanh và tốt hơn gấp nhiều lần.',
      'Sử dụng K-Fold ngẫu nhiên trên dữ liệu chuỗi thời gian.'
    ],
    recommendedTools: ['LightGBM', 'XGBoost', 'CatBoost', 'Optuna', 'Scikit-learn']
  },
  {
    number: '05',
    title: 'Đánh giá Đa chiều & Giải thích (Evaluation & SHAP Explainability)',
    timeSpent: '5% tổng thời gian',
    icon: <BarChart3 className="w-5 h-5 text-amber-400" />,
    summary: 'Không chỉ nhìn vào Accuracy! Đo lường theo tổn thất kinh doanh và giải thích tại sao mô hình đưa ra quyết định đó.',
    keyActions: [
      'Đánh giá bằng ROC-AUC, PR-AUC, F1-Score, RMSE, WAPE tùy theo bài toán.',
      'Lập Ma trận chi phí kinh doanh (Cost-sensitive Analysis): Chi phí mất 1 khách hàng vs Chi phí tặng voucher.',
      'Tối ưu hóa ngưỡng quyết định (Threshold Tuning).',
      'Sử dụng SHAP (SHapley Additive exPlanations) để chỉ ra biến nào ảnh hưởng mạnh nhất tới kết quả.'
    ],
    commonMistakes: [
      'Báo cáo 98% Accuracy cho sếp khi tỷ lệ dữ liệu dương tính chỉ có 1%.',
      'Xem mô hình như chiếc hộp đen không thể giải thích cho ban giám đốc.'
    ],
    recommendedTools: ['SHAP', 'LIME', 'Yellowbrick', 'Scikit-plot']
  },
  {
    number: '06',
    title: 'Triển khai & Giám sát (Deployment & Basic MLOps)',
    timeSpent: '5% tổng thời gian',
    icon: <Rocket className="w-5 h-5 text-rose-400" />,
    summary: 'Đưa mô hình từ file code cá nhân thành sản phẩm có thể tương tác: REST API, Giao diện web, hoặc Docker Container.',
    keyActions: [
      'Đóng gói model thành file pickle/joblib/onnx.',
      'Viết REST API bằng FastAPI với kiểm tra kiểu dữ liệu đầu vào bằng Pydantic.',
      'Tạo giao diện web demo trực quan bằng Streamlit hoặc React để đồng nghiệp trải nghiệm.',
      'Đóng gói thành Docker Container sẵn sàng deploy lên Cloud (GCP / AWS / Render).'
    ],
    commonMistakes: [
      'Để toàn bộ code trong Jupyter Notebook mà không tách thành mã nguồn dạng modular (.py).',
      'Không xử lý ngoại lệ (Exception Handling) khi người dùng nhập dữ liệu thiếu hoặc sai định dạng vào API.'
    ],
    recommendedTools: ['FastAPI', 'Streamlit', 'Docker', 'MLflow', 'Pydantic']
  }
];

export const MLPipelineGuide: React.FC = () => {
  const [selectedStage, setSelectedStage] = useState<number>(0);
  const stage = PIPELINE_STAGES[selectedStage];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Rocket className="w-5 h-5 text-rose-400" />
          Quy trình Chuẩn một Dự án ML trong Doanh nghiệp (End-to-End Pipeline)
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Machine Learning không chỉ là gọi <code className="text-rose-300">model.fit()</code>. Đây là 6 giai đoạn thực tế mà kỹ sư ML trải qua:
        </p>
      </div>

      {/* Stepper Header Pills */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
        {PIPELINE_STAGES.map((s, idx) => (
          <button
            key={s.number}
            onClick={() => setSelectedStage(idx)}
            className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
              selectedStage === idx
                ? 'bg-slate-800 border-indigo-500 shadow-lg shadow-indigo-950/40'
                : 'bg-slate-900/80 border-slate-800 hover:bg-slate-800/60 text-slate-400'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className={`text-xs font-mono font-bold ${selectedStage === idx ? 'text-indigo-400' : 'text-slate-500'}`}>
                {s.number}
              </span>
              <div className="scale-75">{s.icon}</div>
            </div>
            <div className={`text-xs font-semibold mt-2 line-clamp-2 ${selectedStage === idx ? 'text-white' : 'text-slate-300'}`}>
              {s.title.split('(')[0]}
            </div>
          </button>
        ))}
      </div>

      {/* Detail Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center">
              {stage.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider">
                  Bước {stage.number}
                </span>
                <span className="text-xs text-slate-400">• Thời lượng: {stage.timeSpent}</span>
              </div>
              <h3 className="text-lg md:text-xl font-bold text-white mt-0.5">{stage.title}</h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              disabled={selectedStage === 0}
              onClick={() => setSelectedStage((prev) => Math.max(0, prev - 1))}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 text-slate-300 hover:text-white disabled:opacity-40 disabled:pointer-events-none transition"
            >
              ← Bước trước
            </button>
            <button
              disabled={selectedStage === PIPELINE_STAGES.length - 1}
              onClick={() => setSelectedStage((prev) => Math.min(PIPELINE_STAGES.length - 1, prev + 1))}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-40 disabled:pointer-events-none transition"
            >
              Bước tiếp theo →
            </button>
          </div>
        </div>

        <p className="text-sm text-slate-300 mt-4 leading-relaxed font-medium">
          {stage.summary}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Key Actions */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-3 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Nhiệm vụ Cốt lõi Cần Thực hiện
            </h4>
            <div className="space-y-2.5 text-xs text-slate-300">
              {stage.keyActions.map((act, idx) => (
                <div key={idx} className="flex items-start gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 mt-1.5" />
                  <span className="leading-relaxed">{act}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Common Mistakes */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 mb-3 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              Lỗi Sai Kinh điển Cần Tránh
            </h4>
            <div className="space-y-2.5 text-xs text-slate-300">
              {stage.commonMistakes.map((mistake, idx) => (
                <div key={idx} className="flex items-start gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0 mt-1.5" />
                  <span className="leading-relaxed">{mistake}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tools */}
        <div className="mt-5 pt-4 border-t border-slate-800 flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400 font-semibold mr-1">Công cụ & Thư viện khuyên dùng:</span>
          {stage.recommendedTools.map((t) => (
            <span key={t} className="px-2.5 py-1 text-xs font-mono font-medium rounded-lg bg-slate-800 text-sky-300 border border-slate-700/60">
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
