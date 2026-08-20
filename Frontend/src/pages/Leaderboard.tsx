import React, { useState, useEffect } from "react";
import { leaderboardApi } from "../api/leaderboard";
import { useAuth } from "../context/AuthContext";
import { Trophy, Medal, AlertTriangle, ArrowLeft, ArrowRight, User, Search } from "lucide-react";

interface LeaderboardUser {
  rank: number;
  username: string;
  score: number;
}

export const Leaderboard: React.FC = () => {
  const { user } = useAuth();
  
  // List states
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const limit = 10;

  // Personal standing states
  const [myScore, setMyScore] = useState<number | null>(null);
  const [myRank, setMyRank] = useState<number | null>(null);

  // Search states
  const [searchUserId, setSearchUserId] = useState("");
  const [searchResult, setSearchResult] = useState<{ rank: number | null; score: number } | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    fetchLeaderboard();
    fetchMyStanding();
  }, [page]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await leaderboardApi.getLeaderboard({ page, limit });
      if (res.success && res.data) {
        const rawUsers = res.data.users || [];
        setTotal(res.data.total || 0);

        // Parse flat Redis WITHSCORES array: ["user1", "100", "user2", "50"]
        const parsed: LeaderboardUser[] = [];
        let rankCounter = (page - 1) * limit + 1;
        
        for (let i = 0; i < rawUsers.length; i += 2) {
          if (rawUsers[i] && rawUsers[i + 1]) {
            parsed.push({
              rank: rankCounter++,
              username: rawUsers[i],
              score: Number(rawUsers[i + 1]),
            });
          }
        }
        setUsers(parsed);
      } else {
        setError("Failed to fetch global leaderboard");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to load leaderboard");
    } finally {
      setLoading(false);
    }
  };

  const fetchMyStanding = async () => {
    if (!user?.id) return;
    try {
      const scoreRes = await leaderboardApi.getUserScore(user.id);
      const rankRes = await leaderboardApi.getUserRank(user.id);
      if (scoreRes.success && scoreRes.data) {
        setMyScore(scoreRes.data.score || 0);
      }
      if (rankRes.success && rankRes.data) {
        setMyRank(rankRes.data.rank || null);
      }
    } catch (e) {
      console.warn("Personal standing rank not registered in Redis yet.", e);
    }
  };

  const handleSearchUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchUserId.trim()) return;

    setSearchLoading(true);
    setSearchError(null);
    setSearchResult(null);

    try {
      const scoreRes = await leaderboardApi.getUserScore(searchUserId.trim());
      const rankRes = await leaderboardApi.getUserRank(searchUserId.trim());
      
      if (scoreRes.success && rankRes.success) {
        setSearchResult({
          rank: rankRes.data.rank || null,
          score: scoreRes.data.score || 0
        });
      } else {
        setSearchError("Rank records not found for this ID");
      }
    } catch (err: any) {
      setSearchError(err.response?.data?.message || "User not found on the leaderboard");
    } finally {
      setSearchLoading(false);
    }
  };

  const getMedalColor = (rank: number) => {
    if (rank === 1) return "text-yellow-400";
    if (rank === 2) return "text-zinc-400";
    if (rank === 3) return "text-amber-650";
    return "text-zinc-600";
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-100 flex items-center">
          <Trophy className="h-5 w-5 text-emerald-500 mr-2" />
          Global Leaderboard
        </h1>
        <p className="text-sm text-zinc-400">Top coding developers ranked by accepted solutions</p>
      </div>

      {/* Grid containing Personal Standing & Search Filter */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Personal Standing Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-emerald-500/10 p-2.5 rounded-full border border-emerald-500/25">
              <User className="h-5 w-5 text-emerald-500" />
            </div>
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Your Standing</h3>
              <p className="text-sm font-bold text-zinc-200">{user?.name || "Developer"}</p>
            </div>
          </div>
          <div className="text-right font-mono text-xs">
            <div>Score: <strong className="text-emerald-400 text-sm">{myScore !== null ? myScore : 0} pts</strong></div>
            <div className="mt-0.5">Rank: <strong className="text-zinc-300 text-sm">{myRank !== null ? `#${myRank}` : "Unranked"}</strong></div>
          </div>
        </div>

        {/* Find user standing form */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5 flex flex-col justify-center">
          <form onSubmit={handleSearchUser} className="flex gap-2">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
              <input
                type="text"
                required
                value={searchUserId}
                onChange={(e) => setSearchUserId(e.target.value)}
                placeholder="Find Rank by User ID..."
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded pl-9 pr-3 py-1.5 text-xs text-zinc-100 placeholder-zinc-600 outline-none transition"
              />
            </div>
            <button
              type="submit"
              disabled={searchLoading}
              className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-750 text-zinc-200 px-4 py-1.5 rounded text-xs transition font-semibold"
            >
              Search
            </button>
          </form>

          {/* Search Result Overlay */}
          {searchLoading && <div className="text-[11px] text-zinc-500 mt-2">Searching...</div>}
          {searchError && <div className="text-[11px] text-rose-400 mt-2">{searchError}</div>}
          {searchResult && (
            <div className="mt-2 text-xs bg-zinc-950 border border-zinc-800 p-2.5 rounded flex justify-between items-center">
              <span className="font-mono text-zinc-400 text-[10px] truncate max-w-[200px]" title={searchUserId}>
                ID: {searchUserId}
              </span>
              <span className="font-mono text-zinc-300">
                Rank: <strong className="text-emerald-400">{searchResult.rank !== null ? `#${searchResult.rank}` : "Unranked"}</strong> | Score: <strong className="text-emerald-400">{searchResult.score} pts</strong>
              </span>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="flex items-center space-x-2 bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded text-sm">
          <AlertTriangle className="h-5 w-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-800 border-t-emerald-500"></div>
        </div>
      ) : users.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-12 text-center text-zinc-500">
          No records found on the leaderboard yet.
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-zinc-800 text-sm">
              <thead className="bg-zinc-900/80 text-zinc-400 font-semibold tracking-wider text-xs text-left uppercase">
                <tr>
                  <th className="px-6 py-3.5 w-24 text-center">Rank</th>
                  <th className="px-6 py-3.5">Developer</th>
                  <th className="px-6 py-3.5 w-32 text-right">Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800 bg-zinc-900/30">
                {users.map((item) => (
                  <tr key={item.username} className="hover:bg-zinc-850/50 transition-colors">
                    <td className="px-6 py-4 text-center font-mono font-bold flex justify-center items-center">
                      {item.rank <= 3 ? (
                        <Medal className={`h-5 w-5 ${getMedalColor(item.rank)}`} />
                      ) : (
                        <span className="text-zinc-500">{item.rank}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 font-semibold text-zinc-200">
                      {item.username}
                    </td>
                    <td className="px-6 py-4 text-right font-mono font-bold text-emerald-400">
                      {item.score}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {total > limit && (
            <div className="flex justify-between items-center text-xs text-zinc-500 px-2 py-2">
              <button
                disabled={page === 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                className="inline-flex items-center space-x-1 hover:text-zinc-200 disabled:opacity-40 disabled:hover:text-zinc-500 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Prev</span>
              </button>
              <span>
                Page {page} of {Math.ceil(total / limit)}
              </span>
              <button
                disabled={page * limit >= total}
                onClick={() => setPage(p => p + 1)}
                className="inline-flex items-center space-x-1 hover:text-zinc-200 disabled:opacity-40 disabled:hover:text-zinc-500 transition-colors"
              >
                <span>Next</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
