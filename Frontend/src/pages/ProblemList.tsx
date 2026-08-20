import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { problemsApi } from "../api/problems";
import { DifficultyBadge } from "../components/Badges";
import { Search, SlidersHorizontal, BookOpen, AlertTriangle } from "lucide-react";

interface Problem {
  id: string;
  title: string;
  difficulty: string;
  tags: string[];
}

export const ProblemList: React.FC = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState<string>("");
  const [selectedTag, setSelectedTag] = useState<string>("");
  const [allTags, setAllTags] = useState<string[]>([]);

  useEffect(() => {
    fetchProblems();
  }, [search, difficulty, selectedTag]);

  const fetchProblems = async () => {
    setLoading(true);
    setError(null);
    try {
      const params: any = {};
      if (search) params.search = search;
      if (difficulty) params.difficulty = difficulty;
      if (selectedTag) params.tag = selectedTag;

      const res = await problemsApi.getProblems(params);
      if (res.success && Array.isArray(res.data)) {
        setProblems(res.data);
        
        // Dynamically extract unique tags for the filtering panel
        const tags = new Set<string>();
        res.data.forEach((p: Problem) => {
          if (p.tags) p.tags.forEach(t => tags.add(t));
        });
        setAllTags(Array.from(tags));
      } else {
        setError("Failed to retrieve problem set");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to load problems");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100 flex items-center">
            <BookOpen className="h-5 w-5 text-emerald-500 mr-2" />
            Problem Library
          </h1>
          <p className="text-sm text-zinc-400">Choose a problem to code and submit</p>
        </div>
      </div>

      {/* Filter / Search Panel */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-grow relative">
            <Search className="absolute left-3 top-2.5 h-4.5 w-4.5 text-zinc-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search problems by name..."
              className="w-full bg-zinc-950 border border-zinc-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded pl-10 pr-4 py-2 text-sm text-zinc-100 placeholder-zinc-600 outline-none transition-all"
            />
          </div>

          {/* Difficulty Filters */}
          <div className="flex items-center space-x-1.5 flex-shrink-0">
            <SlidersHorizontal className="h-4 w-4 text-zinc-500 mr-1" />
            {["", "easy", "medium", "hard"].map((level) => (
              <button
                key={level}
                onClick={() => setDifficulty(level)}
                className={`text-xs px-3 py-1.5 rounded font-semibold capitalize border transition-all ${
                  difficulty === level
                    ? "bg-emerald-500 text-zinc-950 border-emerald-500 font-bold"
                    : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-100 hover:border-zinc-700"
                }`}
              >
                {level || "All"}
              </button>
            ))}
          </div>
        </div>

        {/* Tag Filters */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-zinc-850">
            <span className="text-xs text-zinc-500 mr-1.5 font-medium">Popular tags:</span>
            <button
              onClick={() => setSelectedTag("")}
              className={`text-[11px] px-2.5 py-0.5 rounded-full border transition-all ${
                selectedTag === ""
                  ? "bg-zinc-850 border-zinc-700 text-zinc-200"
                  : "bg-zinc-950/40 border-transparent text-zinc-500 hover:text-zinc-300"
              }`}
            >
              All
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`text-[11px] px-2.5 py-0.5 rounded-full border transition-all ${
                  selectedTag === tag
                    ? "bg-zinc-800 border-zinc-700 text-zinc-200 font-medium"
                    : "bg-zinc-950/40 border-transparent text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Problem Grid List */}
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
      ) : problems.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-12 text-center text-zinc-500">
          No problems found matching your filters.
        </div>
      ) : (
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-zinc-800 text-sm">
            <thead className="bg-zinc-900/80 text-zinc-400 font-semibold tracking-wider text-xs text-left uppercase">
              <tr>
                <th className="px-6 py-3.5">Title</th>
                <th className="px-6 py-3.5 w-32">Difficulty</th>
                <th className="px-6 py-3.5">Tags</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800 bg-zinc-900/30">
              {problems.map((problem) => (
                <tr key={problem.id} className="hover:bg-zinc-850/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-zinc-200">
                    <Link
                      to={`/problems/${problem.id}`}
                      className="hover:text-emerald-400 transition-colors"
                    >
                      {problem.title}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <DifficultyBadge difficulty={problem.difficulty} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {problem.tags?.map((t) => (
                        <span
                          key={t}
                          className="bg-zinc-800 text-zinc-400 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border border-zinc-750"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
