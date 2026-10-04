import React, { useState, useMemo } from 'react';
import { Star, Film, Sparkles, UserCheck, ThumbsUp } from 'lucide-react';

interface Movie {
  id: string;
  title: string;
  genre: string;
  year: number;
}

const MOVIES: Movie[] = [
  { id: 'm1', title: 'Inception', genre: 'Sci-Fi / Trí não', year: 2010 },
  { id: 'm2', title: 'Titanic', genre: 'Lãng mạn / Kịch tính', year: 1997 },
  { id: 'm3', title: 'The Dark Knight', genre: 'Hành động / Tội phạm', year: 2008 },
  { id: 'm4', title: 'Toy Story', genre: 'Hoạt hình / Gia đình', year: 1995 },
  { id: 'm5', title: 'Interstellar', genre: 'Khoa học viễn tưởng', year: 2014 }
];

// Historical rating matrix from existing database users (0 = not rated, 1-5 = stars)
const DATABASE_USERS = [
  { name: 'Khán giả A (Fan Nolan)', ratings: { m1: 5, m2: 2, m3: 5, m4: 3, m5: 5 } },
  { name: 'Khán giả B (Thích tình cảm)', ratings: { m1: 2, m2: 5, m3: 2, m4: 4, m5: 1 } },
  { name: 'Khán giả C (Hoạt hình & Trẻ em)', ratings: { m1: 1, m2: 3, m3: 2, m4: 5, m5: 2 } },
  { name: 'Khán giả D (Phim bom tấn cân bằng)', ratings: { m1: 4, m2: 4, m3: 4, m4: 4, m5: 4 } }
];

export const RecommenderLab: React.FC = () => {
  // Current user's ratings
  const [myRatings, setMyRatings] = useState<Record<string, number>>({
    m1: 5,
    m3: 5,
    m4: 0,
    m2: 0,
    m5: 0
  });

  const handleRate = (movieId: string, star: number) => {
    setMyRatings((prev) => ({
      ...prev,
      [movieId]: prev[movieId] === star ? 0 : star
    }));
  };

  // Compute Cosine Similarity between MyRatings and each Database User
  const similarities = useMemo(() => {
    return DATABASE_USERS.map((user) => {
      // Find co-rated movies
      let dotProduct = 0;
      let normA = 0;
      let normB = 0;

      MOVIES.forEach((m) => {
        const rMine = myRatings[m.id] || 0;
        const rUser = user.ratings[m.id as keyof typeof user.ratings] || 0;

        if (rMine > 0) {
          dotProduct += rMine * rUser;
          normA += rMine * rMine;
          normB += rUser * rUser;
        }
      });

      if (normA === 0 || normB === 0) return { ...user, sim: 0 };
      const sim = dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
      return { ...user, sim: Math.max(0, sim) };
    }).sort((a, b) => b.sim - a.sim);
  }, [myRatings]);

  // Predict ratings for unrated movies using weighted average of similar users
  const recommendations = useMemo(() => {
    const unrated = MOVIES.filter((m) => !myRatings[m.id] || myRatings[m.id] === 0);

    return unrated.map((movie) => {
      let weightedSum = 0;
      let totalWeight = 0;

      similarities.forEach((u) => {
        const rating = u.ratings[movie.id as keyof typeof u.ratings] || 0;
        if (rating > 0 && u.sim > 0.1) {
          weightedSum += u.sim * rating;
          totalWeight += u.sim;
        }
      });

      const predictedScore = totalWeight > 0 ? weightedSum / totalWeight : 3.0;
      return {
        movie,
        predictedScore: Number(predictedScore.toFixed(1)),
        matchPercent: Math.min(99, Math.round((predictedScore / 5) * 100))
      };
    }).sort((a, b) => b.predictedScore - a.predictedScore);
  }, [myRatings, similarities]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 bg-amber-950/60 border border-amber-800/60 px-2.5 py-0.5 rounded-full">
              Hệ thống Gợi ý (Recommender System)
            </span>
            <span className="text-xs text-slate-400">Lọc cộng tác (Collaborative Filtering)</span>
          </div>
          <h3 className="text-xl font-bold text-white mt-1">Mô phỏng Gợi ý Phim theo phong cách Netflix / Spotify</h3>
        </div>
      </div>

      <p className="text-sm text-slate-300 mt-3 mb-4 leading-relaxed">
        Thay vì chỉ tìm kiếm từ khóa hay chatbot, các tập đoàn như Netflix, YouTube, TikTok hay Amazon dùng 
        <strong> Collaborative Filtering</strong> để tìm những người có sở thích tương đồng với bạn, từ đó dự đoán 
        những gì bạn sẽ yêu thích tiếp theo.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Rating Input Matrix */}
        <div className="lg:col-span-7 bg-slate-950/80 rounded-xl p-5 border border-slate-800">
          <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Film className="w-4 h-4 text-amber-400" />
              Bước 1: Chấm điểm các phim bạn đã xem
            </span>
            <span className="text-slate-500 font-normal lowercase">Bấm sao để vote hoặc hủy</span>
          </h4>

          <div className="space-y-3 mt-3">
            {MOVIES.map((m) => {
              const currentRating = myRatings[m.id] || 0;
              return (
                <div
                  key={m.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-900/90 border border-slate-800/80 hover:border-slate-700 transition"
                >
                  <div>
                    <div className="text-sm font-semibold text-white">{m.title}</div>
                    <div className="text-xs text-slate-400">{m.genre} • {m.year}</div>
                  </div>

                  {/* Stars */}
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => handleRate(m.id, star)}
                        className="p-1 text-slate-600 hover:text-amber-400 transition"
                      >
                        <Star
                          className={`w-5 h-5 transition-colors ${
                            star <= currentRating
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-slate-700'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="w-6 text-right text-xs font-mono font-bold text-slate-400 ml-1">
                      {currentRating > 0 ? `${currentRating}★` : '-'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Similar Users Bar */}
          <div className="mt-5 pt-4 border-t border-slate-800">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-sky-400" />
              Độ tương đồng Cosine với người dùng khác trong hệ thống
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {similarities.map((u) => (
                <div key={u.name} className="p-2 rounded bg-slate-900 border border-slate-800/80">
                  <div className="text-slate-300 truncate">{u.name}</div>
                  <div className="flex items-center justify-between mt-1">
                    <div className="w-24 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-sky-500 h-1.5 rounded-full"
                        style={{ width: `${Math.round(u.sim * 100)}%` }}
                      />
                    </div>
                    <span className="font-mono text-sky-400 font-bold">
                      {Math.round(u.sim * 100)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Real-time Recommendations Output */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-4">
          <div className="bg-slate-800/70 border border-slate-700/60 rounded-xl p-5">
            <h4 className="text-xs font-semibold text-amber-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Bước 2: Kết quả Gợi ý Phim cho bạn
            </h4>

            {recommendations.length > 0 ? (
              <div className="space-y-3">
                {recommendations.map((rec, idx) => (
                  <div
                    key={rec.movie.id}
                    className={`p-3.5 rounded-xl border transition ${
                      idx === 0
                        ? 'bg-amber-950/30 border-amber-500/50 shadow-lg shadow-amber-950/40'
                        : 'bg-slate-900/90 border-slate-800'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        {idx === 0 && (
                          <span className="inline-block px-2 py-0.5 text-[10px] font-bold text-amber-950 bg-amber-400 rounded-full mb-1">
                            🏆 Top 1 Đề xuất mạnh nhất
                          </span>
                        )}
                        <h5 className="text-sm font-bold text-white">{rec.movie.title}</h5>
                        <p className="text-xs text-slate-400">{rec.movie.genre}</p>
                      </div>

                      <div className="text-right">
                        <div className="text-lg font-black text-amber-400">
                          {rec.predictedScore} <span className="text-xs font-normal text-slate-400">/ 5★</span>
                        </div>
                        <div className="text-[11px] text-emerald-400 font-medium">
                          {rec.matchPercent}% phù hợp
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400 text-xs">
                Bạn đã chấm điểm tất cả các phim! Hãy bỏ bớt sao ở bảng bên trái để hệ thống tính toán gợi ý.
              </div>
            )}
          </div>

          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5 text-xs text-slate-300 space-y-1.5">
            <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
              <ThumbsUp className="w-4 h-4" />
              Tại sao bài toán này được các tập đoàn săn đón?
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Hệ thống gợi ý đem lại hơn <strong>35% doanh thu của Amazon</strong> và <strong>75% thời lượng xem của Netflix</strong>.
              Thành thạo Matrix Factorization (SVD) và Two-Tower Models mở ra cơ hội việc làm vô cùng lớn tại các công ty E-commerce và Streaming.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
