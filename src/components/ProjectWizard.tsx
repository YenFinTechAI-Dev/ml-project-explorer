import React, { useState } from 'react';
import { Sparkles, Wand2, Copy, Check, FileDown, Rocket, CheckCircle2, BookmarkCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { DifficultyLevel, GeneratedProjectPlan } from '../types/ml';

const DOMAINS = [
  { id: 'fintech', name: 'Tài chính & Ngân hàng (FinTech)' },
  { id: 'ecommerce', name: 'Thương mại Điện tử & Bán lẻ' },
  { id: 'healthcare', name: 'Y tế & Chăm sóc Sức khỏe' },
  { id: 'realestate', name: 'Bất động sản & Xây dựng' },
  { id: 'logistics', name: 'Giao thông & Chuỗi cung ứng (Logistics)' },
  { id: 'agriculture', name: 'Nông nghiệp Công nghệ cao' },
  { id: 'entertainment', name: 'Âm nhạc & Truyền thông Giải trí' }
];

const DATA_TYPES = [
  { id: 'tabular', name: 'Dữ liệu Bảng (CSV, Excel, SQL)' },
  { id: 'timeseries', name: 'Chuỗi thời gian (Ngày tháng, Cổ phiếu, Doanh số)' },
  { id: 'nlp', name: 'Văn bản / Tiếng Việt (Bình luận, Hợp đồng, Tin tức)' },
  { id: 'cv', name: 'Hình ảnh (Ảnh y tế, Vệ tinh, Camera)' }
];

export const ProjectWizard: React.FC = () => {
  const [selectedDomain, setSelectedDomain] = useState('fintech');
  const [selectedLevel, setSelectedLevel] = useState<DifficultyLevel>('Beginner');
  const [selectedDataType, setSelectedDataType] = useState('tabular');
  const [plan, setPlan] = useState<GeneratedProjectPlan | null>(null);
  const [copied, setCopied] = useState(false);

  const generateProject = () => {
    // Generate tailored blueprint based on combinations
    let title = '';
    let summary = '';
    let dataset = '';
    let architecture: string[] = [];
    let techStack: string[] = [];
    let milestones: { step: string; detail: string }[] = [];
    let cvHeadline = '';

    if (selectedDomain === 'fintech') {
      if (selectedDataType === 'timeseries') {
        title = 'Dự báo Biến động Giá và Rủi ro Danh mục Đầu tư (Volatility & VaR Forecasting)';
        summary = 'Dự báo độ biến động (Volatility) của cổ phiếu VN30 và tính toán chỉ số rủi ro Value at Risk (VaR) giúp quỹ đầu tư hạn chế rủi ro danh mục.';
        dataset = 'Dữ liệu giao dịch khớp lệnh VN-Index / Yahoo Finance API (10 năm gần nhất).';
        architecture = ['GARCH Model / LSTM', 'Feature Lags (Rolling Volatility 14-30 days)', 'Monte Carlo Simulation VaR 95%'];
        techStack = ['Python', 'YFinance', 'Arch library', 'Streamlit dashboard'];
        cvHeadline = 'Phát triển mô hình dự báo rủi ro biến động danh mục chứng khoán kết hợp GARCH & LightGBM, đạt sai số dự báo VaR dưới 8% trên chuỗi thời gian 5 năm.';
      } else {
        title = 'Hệ thống Chấm điểm Tín dụng và Phê duyệt Khoản vay Tự động (Credit Scoring Model)';
        summary = 'Đánh giá xác suất vỡ nợ (Probability of Default - PD) của người nộp đơn vay tiền mặt tiêu dùng để tự động quyết định giải ngân hay từ chối.';
        dataset = 'Home Credit Default Risk (Kaggle) hoặc German Credit Data (UCI).';
        architecture = ['WoE (Weight of Evidence) & Information Value (IV)', 'Logistic Regression Scorecard + XGBoost', 'SHAP Waterfall Plot giải thích lý do từ chối'];
        techStack = ['Scikit-learn', 'Optuna', 'SHAP', 'FastAPI'];
        cvHeadline = 'Xây dựng Credit Scoring Pipeline bằng XGBoost đạt AUC-ROC 0.81, ứng dụng SHAP để tự động sinh văn bản giải trình lý do từ chối hồ sơ đạt chuẩn Basel II.';
      }
    } else if (selectedDomain === 'ecommerce') {
      if (selectedDataType === 'nlp') {
        title = 'Hệ thống Khai phá Khía cạnh Phàn nàn Khách hàng Đa kênh (Aspect-Based Sentiment Analysis)';
        summary = 'Tự động đọc 50,000 đánh giá sản phẩm trên Shopee/Lazada và phân loại sắc thái theo 4 khía cạnh: Giao hàng, Đóng gói, Chất lượng, Thái độ phục vụ.';
        dataset = 'Shopee Reviews crawled dataset hoặc UIT-VSFC tiếng Việt.';
        architecture = ['Underthesea / PyVi tokenization', 'PhoBERT pre-trained Transformer', 'Topic Modeling LDA để phát hiện vấn đề mới phát sinh'];
        techStack = ['PyTorch', 'Transformers', 'FastAPI', 'Plotly'];
        cvHeadline = 'Triển khai mô hình Aspect-Based Sentiment với PhoBERT trên 50K đánh giá tiếng Việt, phân loại chính xác 4 khía cạnh phục vụ với F1-score 0.89.';
      } else {
        title = 'Mô hình Dự đoán Giá trị Vòng đời Khách hàng (Customer Lifetime Value - LTV Prediction)';
        summary = 'Dự đoán tổng số tiền mà một khách hàng mới sẽ chi tiêu trong 12 tháng tới để tối ưu ngân sách quảng cáo tiếp thị (Customer Acquisition Cost).';
        dataset = 'Online Retail Dataset (UCI Machine Learning Repository).';
        architecture = ['BG/NBD Model (Buy ' + "Till You Die)", 'Gamma-Gamma Submodel', 'Random Forest Regressor so sánh hiệu năng'];
        techStack = ['Lifetimes library', 'Pandas', 'Scikit-learn', 'Metabase'];
        cvHeadline = 'Ứng dụng mô hình xác suất BG/NBD và LightGBM dự đoán chính xác Top 10% khách hàng có LTV cao nhất với độ lệch chuẩn chỉ 11%.';
      }
    } else if (selectedDomain === 'healthcare') {
      if (selectedDataType === 'cv') {
        title = 'Phát hiện Tổn thương Viêm phổi qua Ảnh X-quang Ngực (Pneumonia Chest X-Ray Detector)';
        summary = 'Hỗ trợ bác sĩ tuyến cơ sở sàng lọc nhanh bệnh nhân có dấu hiệu viêm phổi hoặc đốm mờ qua ảnh chụp X-quang kỹ thuật số.';
        dataset = 'Chest X-Ray Images (Pneumonia) từ Kaggle (5,863 ảnh X-quang).';
        architecture = ['ResNet-50 / EfficientNet Transfer Learning', 'Grad-CAM (Heatmap trực quan hóa vùng mô phổi bị tổn thương)', 'Model quantization ONNX'];
        techStack = ['PyTorch', 'Torchvision', 'Grad-CAM', 'Streamlit'];
        cvHeadline = 'Huấn luyện ResNet-50 kết hợp Grad-CAM giải thích vùng tổn thương trên ảnh X-quang ngực, đạt Recall 94.5% đối với ca viêm phổi nặng.';
      } else {
        title = 'Dự báo Nguy cơ Biến chứng Đái tháo đường & Đột quỵ (Cardiovascular & Diabetes Risk)';
        summary = 'Dự đoán nguy cơ biến chứng tiểu đường trong 5 năm tới dựa trên xét nghiệm sinh hóa máu, huyết áp, BMI và tiền sử gia đình.';
        dataset = 'Pima Indians Diabetes Database hoặc CDC Diabetes Health Indicators.';
        architecture = ['K-Nearest Neighbors Imputer cho giá trị thiếu', 'CatBoost Classifier (tự động xử lý biến định danh)', 'Calibration Curve hiệu chỉnh xác suất'];
        techStack = ['Scikit-learn', 'CatBoost', 'FastAPI'];
        cvHeadline = 'Xây dựng mô hình cảnh báo sớm biến chứng tim mạch với CatBoost, tối ưu hóa Calibration Curve giúp xác suất dự đoán khớp với tỷ lệ bệnh thực tế 96%.';
      }
    } else if (selectedDomain === 'agriculture') {
      title = 'Hệ thống Dự báo Năng suất Lúa & Cây lương thực theo Thời tiết và Cảm biến Đất';
      summary = 'Dự đoán sản lượng thu hoạch trước 2 tháng dựa trên dữ liệu trạm khí tượng (nhiệt độ, lượng mưa, độ ẩm đất) để chuẩn bị kho bãi và logistics xuất khẩu.';
      dataset = 'Dữ liệu thời tiết Open-Meteo API kết hợp niên giám thống kê nông nghiệp địa phương.';
      architecture = ['TimeSeriesSplit Cross-Validation', 'XGBoost với Rolling Weather Features', 'Phân tích độ nhạy của lượng mưa tới năng suất'];
      techStack = ['Python', 'XGBoost', 'Geopandas', 'FastAPI'];
      cvHeadline = 'Xây dựng hệ thống dự báo năng suất cây trồng theo điều kiện khí hậu bằng XGBoost, giảm 20% sai lệch ước tính sản lượng thu hoạch cho hợp tác xã.';
    } else {
      title = `Dự án Machine Learning Tối ưu hóa trong ${DOMAINS.find((d) => d.id === selectedDomain)?.name}`;
      summary = 'Xây dựng mô hình phân tích và dự báo giải quyết bài toán vận hành cốt lõi, tối ưu tài nguyên và tự động hóa quy trình ra quyết định.';
      dataset = 'Kaggle & Open Data Portal của ngành tương ứng.';
      architecture = ['Data Cleaning & Outlier Removal', 'Ensemble Tree Models (LightGBM/XGBoost)', 'Model Explainability với SHAP'];
      techStack = ['Python', 'Pandas', 'Scikit-learn', 'Docker'];
      cvHeadline = 'Phát triển giải pháp Machine Learning trọn gói từ ETL đến Deployment bằng LightGBM, tối ưu hóa 15% hiệu suất vận hành.';
    }

    milestones = [
      { step: 'Ngày 1 - 2: Khám phá & Dọn dẹp dữ liệu (EDA)', detail: 'Tải dataset, kiểm tra Missing Values, phân tích phân phối mục tiêu và vẽ Correlation Matrix.' },
      { step: 'Ngày 3 - 5: Kỹ thuật Đặc trưng (Feature Engineering)', detail: 'Tạo ít nhất 10 biến phái sinh mới (tỷ lệ, độ trượt thời gian, mã hóa biến chữ), chuẩn hóa dữ liệu.' },
      { step: 'Ngày 6 - 8: Huấn luyện Baseline & So sánh 3 Thuật toán', detail: 'Thiết lập mô hình cơ bản (Baseline), sau đó thử nghiệm LightGBM, CatBoost hoặc Neural Net qua 5-Fold CV.' },
      { step: 'Ngày 9 - 10: Tối ưu Tham số & Phân tích Sai số', detail: 'Chạy Optuna tinh chỉnh Hyperparameters, vẽ Confusion Matrix / PR-Curve và giải thích bằng SHAP Values.' },
      { step: 'Ngày 11 - 12: Đóng gói API & Giao diện Demo', detail: 'Viết REST API bằng FastAPI, tạo web demo Streamlit và viết tài liệu README chuẩn chỉnh trên GitHub.' }
    ];

    setPlan({
      title,
      domain: DOMAINS.find((d) => d.id === selectedDomain)?.name || '',
      summary,
      datasetRecommendation: dataset,
      coreArchitecture: architecture,
      techStack,
      milestones,
      cvHeadline
    });

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.85 }
    });
  };

  const handleCopy = () => {
    if (!plan) return;
    const text = `# BẢN ĐẶC TẢ DỰ ÁN ML: ${plan.title}
Lĩnh vực: ${plan.domain}
Tóm tắt: ${plan.summary}

## 1. Dữ liệu đề xuất
${plan.datasetRecommendation}

## 2. Kiến trúc & Kỹ thuật
${plan.coreArchitecture.map((a) => `- ${a}`).join('\n')}

## 3. Công nghệ sử dụng
${plan.techStack.join(', ')}

## 4. Kế hoạch thực hiện
${plan.milestones.map((m) => `### ${m.step}\n${m.detail}`).join('\n\n')}

## 5. Dòng giới thiệu đưa vào CV
"${plan.cvHeadline}"
`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Wand2 className="w-5 h-5 text-indigo-400" />
          Trình Tạo Ý Tưởng & Kế Hoạch Dự Án Cá Nhân Hóa (Project Generator)
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Chọn lĩnh vực bạn yêu thích và trình độ hiện tại để nhận ngay một bản kế hoạch dự án ML thực chiến hoàn chỉnh kèm lộ trình 12 ngày!
        </p>
      </div>

      {/* Generator Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Domain */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-2">
              1. Lĩnh vực bạn muốn giải quyết:
            </label>
            <select
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              {DOMAINS.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* Level */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-2">
              2. Trình độ kinh nghiệm hiện tại:
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {(['Beginner', 'Intermediate', 'Advanced'] as DifficultyLevel[]).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setSelectedLevel(lvl)}
                  className={`py-2 text-xs font-semibold rounded-lg transition ${
                    selectedLevel === lvl
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                  }`}
                >
                  {lvl === 'Beginner' ? 'Cơ bản' : lvl === 'Intermediate' ? 'Trung cấp' : 'Nâng cao'}
                </button>
              ))}
            </div>
          </div>

          {/* Data Type */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-2">
              3. Loại dữ liệu bạn muốn thực hành:
            </label>
            <select
              value={selectedDataType}
              onChange={(e) => setSelectedDataType(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              {DATA_TYPES.map((dt) => (
                <option key={dt.id} value={dt.id}>
                  {dt.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={generateProject}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition shadow-lg shadow-indigo-950/50 cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          Tạo Bản Thiết Kế Dự Án & Lộ Trình Thực Hiện
        </button>
      </div>

      {/* Generated Result Card */}
      {plan && (
        <div className="bg-slate-900 border border-indigo-500/40 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-indigo-950 border border-indigo-800 text-indigo-400">
                  {plan.domain}
                </span>
                <span className="text-xs text-slate-400">Cấp độ: {selectedLevel}</span>
              </div>
              <h3 className="text-xl md:text-2xl font-black text-white">{plan.title}</h3>
            </div>

            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition shrink-0"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Đã sao chép Markdown!' : 'Sao chép Bản Kế hoạch'}
            </button>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed font-medium">
            {plan.summary}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Dataset & Tech */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-sky-400 mb-1">
                  Bộ dữ liệu đề xuất:
                </h4>
                <p className="text-xs text-slate-300">{plan.datasetRecommendation}</p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400 mb-1.5">
                  Tech Stack khuyên dùng:
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {plan.techStack.map((t) => (
                    <span key={t} className="px-2.5 py-1 text-xs font-mono rounded-lg bg-slate-800 text-purple-300 border border-slate-700">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1.5">
                  Kiến trúc & Kỹ thuật cốt lõi:
                </h4>
                <ul className="space-y-1 text-xs text-slate-300">
                  {plan.coreArchitecture.map((a, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span>{a}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Milestones */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3 flex items-center gap-1.5">
                <Rocket className="w-4 h-4" />
                Lộ trình 12 ngày thực hiện từng bước
              </h4>
              <div className="space-y-3">
                {plan.milestones.map((m, idx) => (
                  <div key={idx} className="text-xs">
                    <div className="font-semibold text-slate-200 flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full bg-indigo-950 border border-indigo-700 text-indigo-400 text-[10px] font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      {m.step}
                    </div>
                    <div className="text-slate-400 pl-6 mt-0.5 leading-relaxed">{m.detail}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CV Bullet Point */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 to-slate-900 border border-emerald-500/40 flex items-start gap-3">
            <BookmarkCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Câu thần thánh để ghi vào CV / LinkedIn:
              </span>
              <p className="text-xs text-emerald-200/90 mt-1 italic font-medium leading-relaxed">
                &quot;{plan.cvHeadline}&quot;
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
