export interface ComparisonPoint {
  dimension: string;
  basicCliche: string;
  industryReality: string;
  whyItMatters: string;
}

export const COMPARISON_POINTS: ComparisonPoint[] = [
  {
    dimension: 'Bản chất bài toán',
    basicCliche: 'Chỉ dừng ở "Phân loại Spam email" (Naive Bayes) hoặc gọi API OpenAI/Gemini để làm Chatbot hỏi đáp thông thường.',
    industryReality: 'Giải quyết bài toán kinh doanh thật: Định giá bất động sản, dự báo chuỗi cung ứng, phát hiện gian lận thẻ tín dụng, phân khúc khách hàng mua sắm, chuẩn đoán y tế.',
    whyItMatters: 'Nhà tuyển dụng muốn thấy bạn hiểu cách dùng ML tạo ra doanh thu hoặc tiết kiệm tiền cho công ty, chứ không phải giải bài tập mẫu.'
  },
  {
    dimension: 'Xử lý dữ liệu (Data Pipeline)',
    basicCliche: 'Tải file CSV đã dọn sạch sẵn trên mạng, chỉ gọi df.dropna() rồi đưa ngay vào mô hình.',
    industryReality: '80% thời gian là: Xử lý dữ liệu mất cân bằng (Imbalanced data như lừa đảo 0.1%), trích xuất đặc trưng (Feature Engineering), xử lý ngoại lai (Outliers), chống rò rỉ dữ liệu (Data Leakage).',
    whyItMatters: 'Mô hình xịn đến mấy mà dữ liệu vào "rác" thì kết quả ra cũng là "rác" (Garbage In, Garbage Out).'
  },
  {
    dimension: 'Thước đo đánh giá (Evaluation)',
    basicCliche: 'Chỉ nhìn vào mỗi con số Accuracy (Độ chính xác). Ví dụ: 99% accuracy trong bài toán lừa đảo thực ra là đoán tất cả đều không lừa đảo!',
    industryReality: 'Đánh giá đa chiều: Precision-Recall Curve, ROC-AUC, F1-Score, RMSE/MAE (đơn vị tiền tệ), chi phí tổn thất kinh doanh (Cost Matrix), độ trễ (Latency).',
    whyItMatters: 'Hiểu được đánh đổi giữa bỏ sót kẻ gian (False Negative) và làm phiền khách thật (False Positive).'
  },
  {
    dimension: 'Giải thích mô hình (Explainability)',
    basicCliche: 'Xem mô hình như "hộp đen" (Black box), ra kết quả là xong mà không biết tại sao.',
    industryReality: 'Sử dụng SHAP Values, LIME, Feature Importance để trả lời câu hỏi của ban giám đốc: "Tại sao từ chối cho khách hàng này vay tiền?".',
    whyItMatters: 'Tuân thủ đạo đức AI, pháp lý ngân hàng và giúp đội ngũ nghiệp vụ tin tưởng đưa mô hình vào vận hành.'
  },
  {
    dimension: 'Triển khai (Deployment & MLOps)',
    basicCliche: 'Code dừng lại ở file Jupyter Notebook (.ipynb), chỉ chạy được trên máy cá nhân.',
    industryReality: 'Đóng gói thành REST API (FastAPI / Flask), container hóa bằng Docker, tạo giao diện trực quan (Streamlit / React) và giám sát suy giảm chất lượng dữ liệu (Data Drift).',
    whyItMatters: 'Một mô hình không được deploy thì chỉ là đồ án trong ngăn kéo, không tạo ra giá trị sản xuất.'
  }
];

export const UPGRADE_GUIDES = [
  {
    original: 'Nếu bạn đã lỡ làm "Bộ lọc thư rác (Spam Filter)"',
    badge: 'Nâng cấp từ Spam',
    upgradedTitle: 'Hệ thống Kiểm duyệt Nội dung Độc hại & Phát hiện Tin nhắn Lừa đảo (Phishing & Toxicity Guard)',
    howToUpgrade: [
      'Thay vì dùng CountVectorizer + Naive Bayes cổ điển, hãy nâng cấp lên PhoBERT hoặc RoBERTa để hiểu ngữ cảnh tiếng Việt.',
      'Bổ sung phân loại đa nhãn (Multi-label): Nhận diện đồng thời spam, tin nhắn độc hại (hate speech), link giả mạo ngân hàng (phishing), số điện thoại lừa đảo.',
      'Xây dựng pipeline xử lý real-time với FastAPI hoặc Kafka, có cơ chế whitelist/blacklist và cho phép người dùng báo cáo sai (Human-in-the-loop).'
    ]
  },
  {
    original: 'Nếu bạn đã lỡ làm "Chatbot hỏi đáp cơ bản"',
    badge: 'Nâng cấp từ Chatbot',
    upgradedTitle: 'Hệ thống Trợ lý Tri thức Doanh nghiệp RAG (Retrieval-Augmented Generation với Vector Database)',
    howToUpgrade: [
      'Không chỉ gọi prompt đơn thuần! Hãy tự xây dựng pipeline RAG: Đọc tài liệu PDF hợp đồng/nội quy công ty, cắt đoạn (chunking), đánh chỉ mục vào Vector DB (Chroma/FAISS).',
      'Tích hợp Reranker mô hình (Cross-Encoder) để lọc ra đoạn văn bản liên quan nhất trước khi tổng hợp câu trả lời.',
      'Xây dựng bộ kiểm định độ chính xác (RAGAS evaluation: Faithfulness, Answer Relevance) để chứng minh bot không bị "ảo giác" (hallucination).'
    ]
  }
];
