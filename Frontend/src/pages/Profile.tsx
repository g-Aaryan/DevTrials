import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { leaderboardApi } from "../api/leaderboard";
import { submissionsApi } from "../api/submissions";
import { User, Mail, Award, CheckCircle, Code, Shield } from "lucide-react";

export const Profile: React.FC = () => {
  const { user } = useAuth();
  const [score, setScore] = useState<number>(0);
  const [rank, setRank] = useState<number | null>(null);
  const [solvedCount, setSolvedCount] = useState<number>(0);
  const [totalSubmissions, setTotalSubmissions] = useState<number>(0);

  useEffect(() => {
    if (user?.id) {
      fetchProfileStats();
    }
  }, [user]);

  const fetchProfileStats = async () => {
    try {
      // 1. Fetch score and rank
      try {
        const scoreRes = await leaderboardApi.getUserScore(user!.id);
        if (scoreRes.success && scoreRes.data) {
          setScore(scoreRes.data.score || 0);
        }

        const rankRes = await leaderboardApi.getUserRank(user!.id);
        if (rankRes.success && rankRes.data) {
          setRank(rankRes.data.rank || null);
        }
      } catch (err) {
        console.warn("Failed to load leaderboard rank/score. Redis might be unpopulated.", err);
      }

      // 2. Fetch submission statistics
      const subRes = await submissionsApi.getMySubmissions();
      if (subRes.success && Array.isArray(subRes.data)) {
        setTotalSubmissions(subRes.data.length);
        const solved = new Set(
          subRes.data
            .filter((sub: any) => sub.verdict === "ACCEPTED")
            .map((sub: any) => sub.problemId)
        );
        setSolvedCount(solved.size);
      }
    } catch (err: any) {
      console.error("Error building profile statistics details:", err);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Profile Summary Card */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 flex flex-col md:flex-row items-center md:items-start gap-6 shadow-md">
        <div className="bg-emerald-500/10 p-4 rounded-full border border-emerald-500/20 flex-shrink-0">
          <User className="h-16 w-16 text-emerald-500" />
        </div>
        <div className="space-y-3 text-center md:text-left flex-grow">
          <div className="flex flex-col md:flex-row md:items-center gap-2">
            <h1 className="text-2xl font-bold text-zinc-100">{user.name}</h1>
            <span className="inline-flex self-center items-center space-x-1 text-[10px] font-extrabold uppercase tracking-widest bg-zinc-800 border border-zinc-700 px-2 py-0.5 rounded text-zinc-400">
              <Shield className="h-3 w-3 mr-0.5" />
              {user.role}
            </span>
          </div>
          <div className="flex items-center justify-center md:justify-start space-x-2 text-zinc-400 text-sm">
            <Mail className="h-4 w-4" />
            <span>{user.email}</span>
          </div>
          <p className="text-xs text-zinc-500">Member ID: {user.id}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {/* Stat 1 */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5 flex flex-col items-center justify-center space-y-1.5 shadow-sm text-center">
          <Award className="h-6 w-6 text-emerald-500" />
          <span className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">Score</span>
          <span className="text-2xl font-mono font-extrabold text-zinc-100">{score}</span>
        </div>

        {/* Stat 2 */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5 flex flex-col items-center justify-center space-y-1.5 shadow-sm text-center">
          <Award className="h-6 w-6 text-cyan-400" />
          <span className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">Global Rank</span>
          <span className="text-2xl font-mono font-extrabold text-zinc-100">
            {rank !== null ? `#${rank}` : "Unranked"}
          </span>
        </div>

        {/* Stat 3 */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5 flex flex-col items-center justify-center space-y-1.5 shadow-sm text-center">
          <CheckCircle className="h-6 w-6 text-emerald-400" />
          <span className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">Solved Problems</span>
          <span className="text-2xl font-mono font-extrabold text-zinc-100">{solvedCount}</span>
        </div>

        {/* Stat 4 */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5 flex flex-col items-center justify-center space-y-1.5 shadow-sm text-center">
          <Code className="h-6 w-6 text-teal-400" />
          <span className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">Total Submissions</span>
          <span className="text-2xl font-mono font-extrabold text-zinc-100">{totalSubmissions}</span>
        </div>
      </div>
    </div>
  );
};
