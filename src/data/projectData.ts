import { MLProject } from '../types/ml';

export const ML_PROJECTS: MLProject[] = [
  {
    id: 'real-estate-pricing',
    title: 'Dự đoán giá Bất động sản & Phân tích định giá',
    category: 'regression',
    categoryName: 'Hồi quy (Regression)',
    shortDesc: 'Dự đoán giá bán căn hộ/nhà đất dựa trên diện tích, vị trí địa lý, tiện ích và năm xây dựng.',
    businessProblem: 'Doanh nghiệp môi giới hoặc sàn thương mại điện tử cần định giá tự động, chính xác để phát hiện bất động sản đang bán dưới giá thị trường hoặc bị định giá quá cao.',
    difficulty: 'Beginner',
    estimatedTime: '1 - 2 tuần',
    datasets: [
      {
        name: 'House Prices: Advanced Regression Techniques',
        source: 'Kaggle',
        description: '79 biến đặc trưng mô tả ngôi nhà tại Ames, Iowa (diện tích sàn, chất lượng nội thất, khu vực, garage).',
        size: '1,460 dòng train / 1,459 test'
      },
      {
        name: 'California Housing Dataset',
        source: 'Scikit-learn built-in / StatLib',
        description: 'Dữ liệu điều tra dân số California với tọa độ kinh độ/vĩ độ, thu nhập trung bình và giá nhà.',
        size: '20,640 mẫu'
      }
    ],
    features: ['Diện tích đất & sàn', 'Kinh độ/Vĩ độ (Coordinates)', 'Số phòng ngủ & WC', 'Khoảng cách tới trường học/trung tâm', 'Năm xây dựng & cải tạo'],
    algorithms: {
      baseline: 'Linear Regression, Ridge / Lasso (xử lý đa cộng tuyến)',
      advanced: 'XGBoost Regressor, LightGBM, CatBoost',
      deepLearning: 'Multi-layer Perceptron (MLP) với Tabular Embeddings'
    },
    metrics: [
      { name: 'RMSE (Root Mean Squared Error)', target: '< 0.12 (log scale)', explanation: 'Đo lường độ lệch trung bình giữa giá dự đoán và giá thực tế, phạt nặng sai số lớn.' },
      { name: 'MAE (Mean Absolute Error)', target: '< $15,000', explanation: 'Sai số trung bình tuyệt đối, rất dễ giải thích cho sếp và khách hàng.' },
      { name: 'R² Score (R-squared)', target: '> 0.88', explanation: 'Tỷ lệ phương sai của giá nhà được giải thích bởi mô hình.' }
    ],
    pipelineSteps: [
      'Xử lý khuyết thiếu (Imputation) cho các biến diện tích, vật liệu.',
      'Log Transform biến mục tiêu (SalePrice) để đưa phân phối về chuẩn.',
      'Target Encoding hoặc One-Hot Encoding cho các biến phân loại (khu vực, loại mái).',
      'Feature Engineering: Tính tổng diện tích sử dụng, tuổi thọ nhà.',
      'Huấn luyện LightGBM / XGBoost và so sánh Cross-Validation 5-folds.'
    ],
    pythonCodeSnippet: `import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import StandardScaler
from lightgbm import LGBMRegressor
from sklearn.metrics import mean_squared_error, r2_score

# 1. Tải & Tiền xử lý dữ liệu
df = pd.read_csv('housing.csv')
X = df.drop(columns=['SalePrice'])
y = np.log1p(df['SalePrice']) # Log transform giảm skewness

# 2. Xử lý giá trị thiếu & Encoding đơn giản
X = pd.get_dummies(X, drop_first=True).fillna(X.median(numeric_only=True))

# 3. Chia tập train / test
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 4. Huấn luyện mô hình Gradient Boosting
model = LGBMRegressor(n_estimators=300, learning_rate=0.05, max_depth=6, random_state=42)
model.fit(X_train, y_train)

# 5. Đánh giá kết quả
preds = model.predict(X_test)
rmse = np.sqrt(mean_squared_error(np.expm1(y_test), np.expm1(preds)))
r2 = r2_score(y_test, preds)
print(f"Test RMSE: \${rmse:,.2f} | R2 Score: {r2:.4f}")`,
    cvHighlightTip: 'Nhấn mạnh: "Áp dụng Feature Engineering cho tọa độ địa lý và xây dựng pipeline LightGBM đạt R² 0.91, giảm sai số MAE xuống 12% so với baseline linear."',
    tags: ['Tabular Data', 'Regression', 'LightGBM', 'Feature Engineering', 'Kaggle Classic']
  },
  {
    id: 'customer-churn-telecom',
    title: 'Dự đoán Khách hàng Rời bỏ (Customer Churn Prediction)',
    category: 'classification',
    categoryName: 'Phân loại Bảng (Tabular Classification)',
    shortDesc: 'Phát hiện sớm người dùng có nguy cơ hủy dịch vụ viễn thông/SaaS để đội CSKH kịp thời can thiệp giữ chân.',
    businessProblem: 'Chi phí thu hút 1 khách hàng mới đắt gấp 5-7 lần chi phí giữ chân khách hàng cũ. Dự đoán trước 30 ngày giúp công ty gửi voucher/chăm sóc đặc biệt giảm thiểu tổn thất doanh thu.',
    difficulty: 'Beginner',
    estimatedTime: '1 - 2 tuần',
    datasets: [
      {
        name: 'Telco Customer Churn',
        source: 'IBM / Kaggle',
        description: '7,043 khách hàng với thông tin hợp đồng (tháng/năm), hình thức thanh toán, số lần gọi hỗ trợ kỹ thuật, cước phí.',
        size: '7,043 dòng x 21 cột'
      },
      {
        name: 'Bank Customer Churn Dataset',
        source: 'Kaggle',
        description: 'Dữ liệu 10,000 khách hàng ngân hàng (số dư, số sản phẩm, thẻ tín dụng, quốc gia, tuổi).',
        size: '10,000 dòng'
      }
    ],
    features: ['Thời gian gắn bó (Tenure)', 'Loại hợp đồng (Tháng-tới-tháng vs 1-2 năm)', 'Cước phí hàng tháng (MonthlyCharges)', 'Dịch vụ phụ trợ (Bảo mật internet, backup)', 'Số lần khiếu nại CSKH'],
    algorithms: {
      baseline: 'Logistic Regression, Decision Tree',
      advanced: 'Random Forest, CatBoost Classifier (hỗ trợ biến phân loại xuất sắc)',
      deepLearning: 'TabNet (kiến trúc Deep Learning cho dữ liệu bảng)'
    },
    metrics: [
      { name: 'ROC-AUC', target: '> 0.85', explanation: 'Khả năng phân biệt giữa khách sắp hủy và khách tiếp tục dùng ở mọi ngưỡng xác suất.' },
      { name: 'Recall (Độ nhạy)', target: '> 0.80', explanation: 'Quan trọng nhất: Không được bỏ sót khách hàng sắp rời bỏ (hạn chế False Negative).' },
      { name: 'F1-Score', target: '> 0.75', explanation: 'Cân bằng giữa Precision (tỷ lệ dự đoán đúng) và Recall.' }
    ],
    pipelineSteps: [
      'Phát hiện mất cân bằng dữ liệu (Imbalanced Classes: churn chiếm ~26%).',
      'Áp dụng kỹ thuật SMOTE hoặc chỉnh class_weight="balanced" trong mô hình.',
      'Phân tích SHAP Values để giải thích lý do cụ thể vì sao khách hàng này có nguy cơ churn.',
      'Tối ưu ngưỡng phân loại (Classification Threshold Tuning) theo bài toán chi phí doanh nghiệp.',
      'Đóng gói API bằng FastAPI nhận JSON thông tin khách hàng và trả về xác suất rủi ro.'
    ],
    pythonCodeSnippet: `from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, roc_auc_score
from sklearn.model_selection import train_test_split
import pandas as pd

df = pd.read_csv('telco_churn.csv')
df['TotalCharges'] = pd.to_numeric(df['TotalCharges'], errors='coerce').fillna(0)

X = pd.get_dummies(df.drop(columns=['customerID', 'Churn']), drop_first=True)
y = df['Churn'].apply(lambda x: 1 if x == 'Yes' else 0)

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, stratify=y, random_state=42)

# Xử lý mất cân bằng qua class_weight
clf = RandomForestClassifier(n_estimators=200, class_weight='balanced', random_state=42)
clf.fit(X_train, y_train)

y_proba = clf.predict_proba(X_test)[:, 1]
# Đặt ngưỡng 0.4 để ưu tiên bắt trọn khách hàng có rủi ro (tăng Recall)
y_pred = (y_proba >= 0.4).astype(int)

print(f"ROC-AUC: {roc_auc_score(y_test, y_proba):.3f}")
print(classification_report(y_test, y_pred))`,
    cvHighlightTip: 'Nhấn mạnh: "Tối ưu hóa Decision Threshold và sử dụng SHAP Value để giải thích nguyên nhân rời bỏ dịch vụ, giúp bộ phận CSKH cứu vãn ước tính 18% khách hàng rủi ro."',
    tags: ['Classification', 'Customer Retention', 'SHAP Values', 'Imbalanced Data', 'Fintech / Telecom']
  },
  {
    id: 'customer-segmentation-rfm',
    title: 'Phân khúc Khách hàng bằng Học không giám sát (RFM Clustering)',
    category: 'clustering',
    categoryName: 'Phân cụm (Unsupervised Clustering)',
    shortDesc: 'Gom nhóm hàng triệu khách hàng thương mại điện tử dựa trên hành vi mua sắm (Recency, Frequency, Monetary).',
    businessProblem: 'Doanh nghiệp không thể gửi cùng một email khuyến mãi cho khách VIP và khách mới chỉ mua một lần. Cần tự động phân khúc thành: Khách hàng trung thành, Khách tiềm năng, Khách sắp mất, Khách săn hàng giảm giá.',
    difficulty: 'Beginner',
    estimatedTime: '1 tuần',
    datasets: [
      {
        name: 'Online Retail II Dataset',
        source: 'UCI Machine Learning Repository',
        description: 'Tất cả các giao dịch phát sinh từ một nhà bán lẻ trực tuyến tại Anh từ 2009 đến 2011.',
        size: '541,909 hóa đơn giao dịch'
      },
      {
        name: 'Mall Customer Segmentation Data',
        source: 'Kaggle',
        description: 'Dữ liệu khách hàng trung tâm thương mại: Tuổi, Thu nhập hàng năm, Điểm chi tiêu (1-100).',
        size: '200 mẫu (thích hợp học tập trực quan)'
      }
    ],
    features: ['Recency (Số ngày kể từ lần mua cuối)', 'Frequency (Tổng số lần phát sinh đơn hàng)', 'Monetary (Tổng số tiền đã chi tiêu)', 'Tỷ lệ trả hàng (Return rate)', 'Giờ mua sắm phổ biến'],
    algorithms: {
      baseline: 'K-Means Clustering (áp dụng Elbow method & Silhouette Score)',
      advanced: 'DBSCAN (phát hiện cụm mật độ bất kỳ & lọc nhiễu), Gaussian Mixture Models (GMM)',
      deepLearning: 'Autoencoders nén biểu diễn không gian ẩn (Latent Representation) trước khi gom cụm'
    },
    metrics: [
      { name: 'Silhouette Score', target: '> 0.55', explanation: 'Đo lường độ tách biệt giữa các cụm và độ gắn kết bên trong từng cụm.' },
      { name: 'Elbow Method (Inertia)', target: 'Điểm gãy tối ưu (thường k=3 đến 5)', explanation: 'Xác định số lượng cụm k tự nhiên trong dữ liệu.' },
      { name: 'Business Interpretability', target: 'Đạt 100%', explanation: 'Mỗi cụm phải có chân dung khách hàng rõ ràng để phòng Marketing hành động.' }
    ],
    pipelineSteps: [
      'Từ bảng lịch sử giao dịch thô, nhóm theo CustomerID để tính 3 chỉ số RFM.',
      'Xử lý outliers (loại bỏ giá trị tiền âm hoặc giao dịch bất thường).',
      'Chuẩn hóa Log Transformation và StandardScaler vì phân phối tiền và tần suất thường lệch phải (right-skewed).',
      'Chạy K-Means với k từ 2 đến 10, vẽ biểu đồ Elbow & Silhouette để chọn k tối ưu.',
      'Gắn nhãn Persona cho từng cụm (ví dụ: Cụm 0 = "Khách hàng VIP", Cụm 1 = "Khách hàng ngủ đông").'
    ],
    pythonCodeSnippet: `import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score

# 1. Giả sử đã tổng hợp bảng RFM
rfm = pd.read_csv('rfm_features.csv') # columns: ['Recency', 'Frequency', 'Monetary']

# 2. Log-transform và chuẩn hóa
rfm_log = np.log1p(rfm[['Recency', 'Frequency', 'Monetary']])
scaler = StandardScaler()
rfm_scaled = scaler.fit_transform(rfm_log)

# 3. K-Means với k=4
kmeans = KMeans(n_clusters=4, init='k-means++', random_state=42)
rfm['Cluster'] = kmeans.fit_predict(rfm_scaled)

score = silhouette_score(rfm_scaled, rfm['Cluster'])
print(f"Silhouette Score: {score:.3f}")

# 4. Phân tích chân dung từng cụm
profile = rfm.groupby('Cluster').agg({
    'Recency': 'mean',
    'Frequency': 'mean',
    'Monetary': ['mean', 'count']
}).round(1)
print(profile)`,
    cvHighlightTip: 'Nhấn mạnh: "Xây dựng hệ thống phân khúc tự động RFM Clustering bằng K-Means và PCA, đề xuất chiến lược tiếp thị cá nhân hóa cho 4 nhóm khách hàng mục tiêu."',
    tags: ['Unsupervised', 'K-Means', 'Customer Segmentation', 'RFM Analysis', 'E-commerce']
  },
  {
    id: 'recommendation-system',
    title: 'Hệ thống Gợi ý Phim & Sản phẩm (Recommendation System)',
    category: 'recommendation',
    categoryName: 'Hệ gợi ý (Recommendation Engine)',
    shortDesc: 'Gợi ý phim hoặc món hàng tương thích cao nhất với sở thích cá nhân của người dùng.',
    businessProblem: 'Người dùng bị "ngợp" trước hàng triệu bộ phim hoặc sản phẩm. Hệ thống gợi ý giúp tăng thời lượng xem (Watch time) và tỷ lệ chuyển đổi mua hàng (Conversion rate) như Netflix, YouTube hay Spotify.',
    difficulty: 'Intermediate',
    estimatedTime: '2 - 3 tuần',
    datasets: [
      {
        name: 'MovieLens 100K / 1M Dataset',
        source: 'GroupLens Research',
        description: '100,000 đánh giá (1-5 sao) từ 943 người dùng trên 1,682 bộ phim kinh điển.',
        size: '100,000 ratings'
      },
      {
        name: 'Amazon Product Reviews',
        source: 'Stanford SNAP / Kaggle',
        description: 'Đánh giá sản phẩm theo từng ngành hàng (Sách, Đồ điện tử, Thời trang).',
        size: 'Hàng triệu review'
      }
    ],
    features: ['Ma trận User - Item Rating', 'Thể loại phim (Genres)', 'Độ tương đồng Cosine giữa người dùng / vật phẩm', 'Thời điểm đánh giá (Timestamp)', 'Mức độ tương tác gần đây'],
    algorithms: {
      baseline: 'User-based / Item-based Collaborative Filtering (Cosine Similarity)',
      advanced: 'Matrix Factorization (SVD / FunkSVD), Alternating Least Squares (ALS)',
      deepLearning: 'Neural Collaborative Filtering (NCF), Two-Tower Neural Networks (Google standard)'
    },
    metrics: [
      { name: 'RMSE', target: '< 0.87', explanation: 'Sai số dự đoán số điểm sao mà người dùng sẽ chấm cho bộ phim.' },
      { name: 'Precision@K & Recall@K', target: 'P@10 > 0.25', explanation: 'Tỷ lệ phim thực sự yêu thích nằm trong danh sách top 10 gợi ý.' },
      { name: 'NDCG@K (Normalized Discounted Cumulative Gain)', target: '> 0.75', explanation: 'Đánh giá việc đặt gợi ý hay nhất lên đầu danh sách.' }
    ],
    pipelineSteps: [
      'Xây dựng ma trận thưa (Sparse Matrix) User x Item.',
      'Giải quyết bài toán Cold-Start (Người dùng mới chưa có lịch sử đánh giá).',
      'Áp dụng SVD (Singular Value Decomposition) để phân rã ma trận thành các yếu tố tiềm ẩn (Latent factors).',
      'Xây dựng hàm Top-K Recommendation loại trừ những phim người dùng đã xem.',
      'Tạo demo web tương tác cho phép chọn 3 phim yêu thích và nhận ngay 5 phim đề xuất tương tự.'
    ],
    pythonCodeSnippet: `import numpy as np
from surprise import Dataset, Reader, SVD
from surprise.model_selection import cross_validate

# 1. Sử dụng thư viện scikit-surprise chuyên cho Recommender
data = Dataset.load_builtin('ml-100k')

# 2. Sử dụng thuật toán SVD (Matrix Factorization)
algo = SVD(n_factors=50, n_epochs=25, lr_all=0.005, reg_all=0.02)

# 3. Đánh giá 5-fold cross-validation
results = cross_validate(algo, data, measures=['RMSE', 'MAE'], cv=5, verbose=False)
print(f"Mean RMSE: {results['test_rmse'].mean():.4f}")
print(f"Mean MAE:  {results['test_mae'].mean():.4f}")

# 4. Dự đoán điểm cho User 196 với Item 302
trainset = data.build_full_trainset()
algo.fit(trainset)
prediction = algo.predict(uid='196', iid='302')
print(f"Estimated rating: {prediction.est:.2f}/5.0")`,
    cvHighlightTip: 'Nhấn mạnh: "Triển khai thuật toán Matrix Factorization SVD và tối ưu hóa Cold-Start bằng Hybrid Content-Based Filtering, đạt RMSE 0.86 trên benchmark MovieLens."',
    tags: ['Collaborative Filtering', 'Matrix Factorization', 'SVD', 'Surprise Lib', 'Personalization']
  },
  {
    id: 'fraud-detection-imbalanced',
    title: 'Phát hiện Gian lận Thẻ tín dụng & Dữ liệu Cực kỳ Lệch (Fraud Detection)',
    category: 'anomaly',
    categoryName: 'Phát hiện Bất thường (Anomaly Detection)',
    shortDesc: 'Phát hiện giao dịch quẹt thẻ bất thường / lừa đảo giữa hàng trăm ngàn giao dịch bình thường (tỷ lệ gian lận < 0.17%).',
    businessProblem: 'Mỗi năm các ngân hàng thiệt hại hàng tỷ USD do gian lận thẻ. Nếu chặn nhầm khách thật sẽ gây khó chịu, nhưng bỏ lọt kẻ gian thì ngân hàng phải bồi thường tiền.',
    difficulty: 'Intermediate',
    estimatedTime: '2 tuần',
    datasets: [
      {
        name: 'Credit Card Fraud Detection Dataset',
        source: 'ULB Machine Learning Group / Kaggle',
        description: '284,807 giao dịch thẻ tín dụng Châu Âu, trong đó chỉ có 492 giao dịch gian lận (0.172%). Các biến đã được ẩn danh qua PCA (V1-V28).',
        size: '284,807 dòng'
      }
    ],
    features: ['V1 đến V28 (PCA transformed components)', 'Amount (Số tiền giao dịch)', 'Time (Khoảng cách thời gian)', 'Địa điểm lạ hoặc tần suất quẹt thẻ đột biến'],
    algorithms: {
      baseline: 'Logistic Regression với điều chỉnh class weights',
      advanced: 'Isolation Forest, One-Class SVM, LightGBM / XGBoost với focal loss',
      deepLearning: 'Autoencoder (học tái tạo giao dịch thường, giao dịch lỗi tái tạo cao = gian lận)'
    },
    metrics: [
      { name: 'PR-AUC (Precision-Recall AUC)', target: '> 0.82', explanation: 'Tối quan trọng cho dữ liệu mất cân bằng cực nặng (ROC-AUC dễ bị ảo do số lượng True Negative quá lớn).' },
      { name: 'Recall', target: '> 0.85', explanation: 'Bắt được ít nhất 85% các vụ lừa đảo thực tế.' },
      { name: 'Precision', target: '> 0.75', explanation: 'Giảm thiểu tỷ lệ báo động giả làm khóa nhầm thẻ khách hàng VIP.' }
    ],
    pipelineSteps: [
      'Phân tích tính chất Imbalanced (0.17% fraud). Tuyệt đối không dùng Accuracy làm thước đo.',
      'Sử dụng RobustScaler cho biến Amount và Time để chống chịu outliers.',
      'Thử nghiệm 2 hướng tiếp cận: Học có giám sát (XGBoost + SMOTE) và Học không giám sát (Isolation Forest / Autoencoder).',
      'Vẽ đường cong Precision-Recall Curve để chọn ngưỡng quyết định tối ưu theo ma trận tổn thất chi phí.',
      'Kiểm định mô hình trên tập Out-of-time validation.'
    ],
    pythonCodeSnippet: `import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, average_precision_score
from xgboost import XGBClassifier

# 1. Đọc dữ liệu
df = pd.read_csv('creditcard.csv')
X = df.drop(columns=['Class'])
y = df['Class']

# 2. Phân chia bảo toàn tỷ lệ (stratify)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, stratify=y, random_state=42)

# 3. Tính tỷ lệ âm / dương để gán scale_pos_weight cho XGBoost
scale_weight = (len(y_train) - sum(y_train)) / sum(y_train)

model = XGBClassifier(scale_pos_weight=scale_weight, n_estimators=150, max_depth=5, learning_rate=0.08)
model.fit(X_train, y_train)

y_proba = model.predict_proba(X_test)[:, 1]
pr_auc = average_precision_score(y_test, y_proba)
print(f"PR-AUC (Precision-Recall AUC): {pr_auc:.4f}")
print(classification_report(y_test, (y_proba > 0.5).astype(int), digits=4))`,
    cvHighlightTip: 'Nhấn mạnh: "Xử lý bài toán gian lận với tỷ lệ cực thấp 0.17%, tối ưu PR-AUC đạt 0.86 và giảm 35% tỷ lệ báo động giả (False Positive) bằng XGBoost kết hợp Cost-Sensitive Learning."',
    tags: ['Anomaly Detection', 'Imbalanced Data', 'XGBoost', 'PR-AUC', 'Fintech & Security']
  },
  {
    id: 'time-series-forecasting',
    title: 'Dự báo Doanh số & Nhu cầu Chuỗi thời gian (Sales & Demand Forecasting)',
    category: 'timeseries',
    categoryName: 'Dự báo Chuỗi thời gian (Time Series)',
    shortDesc: 'Dự đoán sản lượng tiêu thụ hàng hóa hoặc doanh số chuỗi siêu thị trong 30 ngày tới.',
    businessProblem: 'Nếu nhập quá nhiều hàng thì đọng vốn và hết hạn sử dụng; nếu nhập quá ít thì đứt hàng và mất khách. Dự báo chính xác nhu cầu theo mùa vụ, ngày lễ và khuyến mãi giúp chuỗi cung ứng tiết kiệm hàng triệu USD.',
    difficulty: 'Intermediate',
    estimatedTime: '2 tuần',
    datasets: [
      {
        name: 'Store Sales - Time Series Forecasting',
        source: 'Corporación Favorita / Kaggle',
        description: 'Dữ liệu doanh số hàng nghìn mặt hàng tại chuỗi siêu thị lớn ở Ecuador, kèm giá dầu, ngày lễ tết.',
        size: '3,000,000+ bản ghi'
      },
      {
        name: 'Rossmann Store Sales',
        source: 'Kaggle',
        description: 'Dự đoán doanh số hơn 1,115 cửa hàng thuốc tại Đức dựa trên chương trình giảm giá và trường học nghỉ lễ.',
        size: '1,000,000+ dòng'
      }
    ],
    features: ['Lag Features (Doanh số 7 ngày trước, 14 ngày trước, 30 ngày trước)', 'Rolling Means (Trung bình trượt 7 ngày, 30 ngày)', 'Lịch ngày trong tuần, tháng, mùa vụ', 'Sự kiện khuyến mãi & Ngày lễ quốc gia'],
    algorithms: {
      baseline: 'ARIMA, SARIMAX, Facebook Prophet',
      advanced: 'LightGBM với Lags & Rolling Window Features (công thức vô địch Kaggle Time Series)',
      deepLearning: 'Temporal Fusion Transformer (TFT), N-BEATS, LSTM'
    },
    metrics: [
      { name: 'RMSLE (Root Mean Squared Log Error)', target: '< 0.38', explanation: 'Phạt sai số dự đoán tỷ lệ phần trăm thay vì giá trị tuyệt đối.' },
      { name: 'WAPE (Weighted Absolute Percentage Error)', target: '< 15%', explanation: 'Thước đo tiêu chuẩn trong quản trị chuỗi cung ứng bán lẻ.' },
      { name: 'MAE', target: '< 25 đơn vị', explanation: 'Sai số số lượng sản phẩm dự đoán trung bình.' }
    ],
    pipelineSteps: [
      'Kiểm tra tính dừng (Stationarity) bằng Augmented Dickey-Fuller (ADF) test.',
      'Phân tích thành phần: Trend (Xu thế), Seasonality (Mùa vụ), Residual (Nhiễu).',
      'Tạo Feature Engineering: Lag 1..14, Rolling Mean/Std, Ngày trong tuần, Cuối tuần, Khuyến mãi.',
      'Sử dụng TimeSeriesSplit (tuyệt đối không dùng k-fold ngẫu nhiên vì rò rỉ dữ liệu tương lai).',
      'Huấn luyện LightGBM và dự báo đệ quy (recursive multi-step forecasting) cho 30 ngày.'
    ],
    pythonCodeSnippet: `import pandas as pd
import numpy as np
from lightgbm import LGBMRegressor
from sklearn.metrics import mean_squared_log_error

# 1. Tạo Lag features từ chuỗi thời gian
df = pd.read_csv('sales.csv', parse_dates=['date']).sort_values('date')
for lag in [1, 7, 14, 28]:
    df[f'lag_{lag}'] = df.groupby('store_id')['sales'].shift(lag)

df['rolling_mean_7'] = df.groupby('store_id')['sales'].shift(1).rolling(7).mean()
df['dayofweek'] = df['date'].dt.dayofweek
df = df.dropna()

# 2. Chia tập Train/Val theo trục thời gian (Không shuffle!)
split_date = '2023-10-01'
train = df[df['date'] < split_date]
val = df[df['date'] >= split_date]

features = [c for c in df.columns if c not in ['date', 'sales', 'store_id']]
model = LGBMRegressor(n_estimators=300, learning_rate=0.03)
model.fit(train[features], train['sales'])

val_preds = np.maximum(0, model.predict(val[features]))
rmsle = np.sqrt(mean_squared_log_error(val['sales'], val_preds))
print(f"Validation RMSLE: {rmsle:.4f}")`,
    cvHighlightTip: 'Nhấn mạnh: "Xây dựng pipeline dự báo đa bước bằng LightGBM với 35+ Lag & Rolling features, tuân thủ TimeSeriesSplit nghiêm ngặt và giảm WAPE xuống dưới 14%."',
    tags: ['Time Series', 'Sales Forecasting', 'Feature Engineering', 'LightGBM', 'Supply Chain']
  },
  {
    id: 'vietnamese-sentiment-analysis',
    title: 'Phân tích Cảm xúc Đánh giá Khách hàng E-commerce (Sentiment Analysis ngoài Chatbot & Spam)',
    category: 'nlp',
    categoryName: 'Xử lý Ngôn ngữ Tự nhiên (NLP)',
    shortDesc: 'Tự động phân loại hàng chục nghìn đánh giá Shopee/Tiki thành Tích cực, Tiêu cực hoặc Trung lập và bóc tách khía cạnh sản phẩm (Aspect-based).',
    businessProblem: 'Thương hiệu muốn biết khách hàng đang phàn nàn về điều gì: chất lượng đóng gói, thái độ shipper, hay độ bền sản phẩm để kịp thời cải thiện thay vì đọc thủ công từng comment.',
    difficulty: 'Intermediate',
    estimatedTime: '2 tuần',
    datasets: [
      {
        name: 'UIT-VSFC (Vietnamese Students’ Feedback Corpus)',
        source: 'VNU-HCM UIT',
        description: 'Tập dữ liệu hơn 16,000 câu phản hồi tiếng Việt được dán nhãn cảm xúc (Positive, Negative, Neutral).',
        size: '16,000+ câu'
      },
      {
        name: 'Shopee Reviews Vietnamese Dataset',
        source: 'Kaggle / Crawled open-source',
        description: 'Đánh giá sản phẩm tiếng Việt trên sàn thương mại điện tử với nhiều từ viết tắt, teencode, icon.',
        size: '50,000 bình luận'
      }
    ],
    features: ['Văn bản bình luận đã chuẩn hóa teencode', 'TF-IDF n-grams (1-3 từ)', 'Độ dài câu và số lượng biểu tượng cảm xúc (emoji count)', 'PhoBERT Contextual Embeddings'],
    algorithms: {
      baseline: 'TF-IDF + LinearSVC / Logistic Regression',
      advanced: 'Bi-LSTM với FastText tiếng Việt pre-trained',
      deepLearning: 'Fine-tuning PhoBERT (Pre-trained RoBERTa for Vietnamese của VinAI)'
    },
    metrics: [
      { name: 'Macro F1-Score', target: '> 0.88', explanation: 'Đánh giá đồng đều cả 3 lớp: Tích cực, Tiêu cực và Trung tính (thường lớp Trung tính khó nhất).' },
      { name: 'Accuracy', target: '> 90%', explanation: 'Tỷ lệ đoán đúng nhãn cảm xúc toàn cục.' },
      { name: 'Inference Latency', target: '< 30ms/câu', explanation: 'Đảm bảo xử lý hàng nghìn comment mỗi phút trong luồng streaming.' }
    ],
    pipelineSteps: [
      'Tiền xử lý tiếng Việt: Chuẩn hóa Unicode dựng sẵn, chuyển chữ thường, thay thế teencode ("ko" -> "không", "đc" -> "được").',
      'Tách từ tiếng Việt bằng thư viện PyVi hoặc Underthesea (ví dụ: "máy_tính", "giao_hàng").',
      'Chuyển đổi văn bản thành vector bằng PhoBERT tokenizer.',
      'Fine-tune mô hình HuggingFace Transformers với Trainer API.',
      'Trực quan hóa WordCloud các từ khóa phàn nàn nhiều nhất của khách hàng theo từng danh mục.'
    ],
    pythonCodeSnippet: `from transformers import AutoTokenizer, AutoModelForSequenceClassification, pipeline
import torch

# 1. Sử dụng mô hình PhoBERT pre-trained cho tiếng Việt
model_name = "vinai/phobert-base"
tokenizer = AutoTokenizer.from_pretrained(model_name)

# 2. Giả lập pipeline phân loại cảm xúc (Tích cực / Tiêu cực)
# Có thể fine-tune với Hugging Face Trainer trên tập dữ liệu UIT-VSFC
print("Mô hình sẵn sàng phân loại đánh giá Shopee:")
test_reviews = [
    "Hàng đóng gói cẩn thận, giao nhanh, chất lượng rất ổn áp!",
    "Mua về dùng 2 ngày đã hỏng nút nguồn, nhắn tin shop không thèm trả lời."
]
for rev in test_reviews:
    inputs = tokenizer(rev, return_tensors="pt", truncation=True, max_length=128)
    print(f"Text: '{rev[:40]}...' -> Tokens count: {inputs['input_ids'].shape[1]}")`,
    cvHighlightTip: 'Nhấn mạnh: "Xây dựng pipeline xử lý ngôn ngữ tiếng Việt (chuẩn hóa teencode, tách từ bằng Underthesea) và fine-tune PhoBERT đạt F1-score 0.90, trích xuất chính xác 5 khía cạnh phàn nàn cốt lõi của khách."',
    tags: ['NLP', 'Vietnamese NLP', 'PhoBERT', 'Sentiment Analysis', 'Aspect-based']
  },
  {
    id: 'crop-disease-computer-vision',
    title: 'Nhận diện Sâu bệnh Cây trồng qua Ảnh lá (Computer Vision Classification)',
    category: 'cv',
    categoryName: 'Thị giác Máy tính (Computer Vision)',
    shortDesc: 'Nông dân chụp ảnh lá cây (cà chua, khoai tây, ngô) bằng điện thoại để nhận diện ngay loại bệnh và hướng xử lý.',
    businessProblem: 'Dịch bệnh thực vật làm giảm 20-40% sản lượng nông nghiệp toàn cầu. Nông dân thường thiếu kỹ sư nông nghiệp chẩn đoán kịp thời, dẫn đến phun nhầm thuốc trừ sâu gây lãng phí và hại đất.',
    difficulty: 'Intermediate',
    estimatedTime: '2 - 3 tuần',
    datasets: [
      {
        name: 'PlantVillage Dataset',
        source: 'Penn State University / Kaggle',
        description: '54,303 ảnh lá cây thuộc 14 loại cây trồng và 38 lớp bệnh khác nhau (khỏe mạnh, đốm lá, nấm mốc, rỉ sắt).',
        size: '54,303 hình ảnh'
      }
    ],
    features: ['Pixel màu RGB của lá cây', 'Cấu trúc gân lá và vùng tổn thương', 'Data Augmentation (xoay, lật, đổi độ sáng để chống overfitting)'],
    algorithms: {
      baseline: 'Custom Convolutional Neural Network (CNN) 4 lớp',
      advanced: 'Transfer Learning với MobileNetV3 (nhẹ, chạy được trên mobile)',
      deepLearning: 'EfficientNet-B2 hoặc ResNet50 fine-tuning'
    },
    metrics: [
      { name: 'Top-1 Accuracy', target: '> 96%', explanation: 'Tỷ lệ ảnh lá được chẩn đoán chính xác loại bệnh trên tập Test chưa từng thấy.' },
      { name: 'Model Size', target: '< 20 MB', explanation: 'Kích thước mô hình gọn nhẹ để có thể chạy offline trên app điện thoại nông dân (TensorFlow Lite / ONNX).' },
      { name: 'Inference Time', target: '< 50ms', explanation: 'Phản hồi tức thì khi người dùng bấm chụp.' }
    ],
    pipelineSteps: [
      'Chuẩn hóa kích thước ảnh về 224x224 và normalize giá trị pixel về [0, 1].',
      'Áp dụng Data Augmentation: RandomRotation, RandomHorizontalFlip, ColorJitter.',
      'Sử dụng Transfer Learning: Tải trọng số pre-trained ImageNet của MobileNetV3, đóng băng các tầng đầu và huấn luyện classification head.',
      'Fine-tune toàn bộ mạng với learning rate nhỏ (1e-4) trong 10 epochs.',
      'Chuyển đổi mô hình sang ONNX / TFLite để nhúng vào ứng dụng web/di động.'
    ],
    pythonCodeSnippet: `import torch
import torchvision.models as models
import torch.nn as nn

# 1. Khởi tạo mô hình nhẹ tối ưu cho thiết bị di động (MobileNetV3)
model = models.mobilenet_v3_small(weights='DEFAULT')

# 2. Đóng băng các tầng feature extractor để Transfer Learning
for param in model.features.parameters():
    param.requires_grad = False

# 3. Thay thế tầng phân loại cuối cùng cho 38 loại bệnh cây trồng
num_features = model.classifier[3].in_features
model.classifier[3] = nn.Sequential(
    nn.Linear(num_features, 128),
    nn.ReLU(),
    nn.Dropout(0.2),
    nn.Linear(128, 38) # 38 lớp bệnh của PlantVillage
)

print(f"Tổng số tham số cần huấn luyện: {sum(p.numel() for p in model.parameters() if p.requires_grad):,}")`,
    cvHighlightTip: 'Nhấn mạnh: "Áp dụng Transfer Learning với MobileNetV3 trên tập 54,000 ảnh lá cây, đạt Accuracy 97.2% và tối ưu hóa mô hình sang TFLite chỉ 14MB phục vụ chẩn đoán real-time trên mobile."',
    tags: ['Computer Vision', 'Deep Learning', 'PyTorch', 'Transfer Learning', 'Edge AI']
  }
];
