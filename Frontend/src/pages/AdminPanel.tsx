import React, { useState, useEffect } from "react";
import { problemsApi } from "../api/problems";
import { DifficultyBadge } from "../components/Badges";
import { Plus, Trash2, Edit3, Settings, Save, X, PlusCircle, AlertCircle } from "lucide-react";

interface Example {
  input: string;
  output: string;
  explanation?: string;
}

interface Testcase {
  input: string;
  output: string;
}

interface Problem {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  tags: string[];
  constraints: string[];
  examples: Example[];
  visibleTestcases: Testcase[];
  hiddenTestcases: Testcase[];
  editorial?: string;
}

export const AdminPanel: React.FC = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form toggles
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState("easy");
  const [tagsInput, setTagsInput] = useState("");
  const [constraints, setConstraints] = useState<string[]>([""]);
  const [examples, setExamples] = useState<Example[]>([{ input: "", output: "", explanation: "" }]);
  const [visibleTestcases, setVisibleTestcases] = useState<Testcase[]>([{ input: "", output: "" }]);
  const [hiddenTestcases, setHiddenTestcases] = useState<Testcase[]>([{ input: "", output: "" }]);
  const [editorial, setEditorial] = useState("");

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    setLoading(true);
    try {
      const res = await problemsApi.getProblems();
      if (res.success && Array.isArray(res.data)) {
        setProblems(res.data);
      }
    } catch (err: any) {
      setError("Failed to load problems list");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (p: Problem) => {
    setIsEditing(true);
    setEditId(p.id);
    setTitle(p.title);
    setDescription(p.description);
    setDifficulty(p.difficulty);
    setTagsInput(p.tags?.join(", ") || "");
    setConstraints(p.constraints?.length ? p.constraints : [""]);
    setExamples(p.examples?.length ? p.examples : [{ input: "", output: "", explanation: "" }]);
    setVisibleTestcases(p.visibleTestcases?.length ? p.visibleTestcases : [{ input: "", output: "" }]);
    setHiddenTestcases(p.hiddenTestcases?.length ? p.hiddenTestcases : [{ input: "", output: "" }]);
    setEditorial(p.editorial || "");
  };

  const handleCreateClick = () => {
    setIsEditing(true);
    setEditId(null);
    setTitle("");
    setDescription("");
    setDifficulty("easy");
    setTagsInput("");
    setConstraints([""]);
    setExamples([{ input: "", output: "", explanation: "" }]);
    setVisibleTestcases([{ input: "", output: "" }]);
    setHiddenTestcases([{ input: "", output: "" }]);
    setEditorial("");
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to permanently delete this problem?")) {
      try {
        await problemsApi.deleteProblem(id);
        setProblems(problems.filter((p) => p.id !== id));
      } catch (err: any) {
        alert(err.response?.data?.message || "Failed to delete problem");
      }
    }
  };

  const handleAddConstraint = () => setConstraints([...constraints, ""]);
  const handleRemoveConstraint = (index: number) => {
    setConstraints(constraints.filter((_, idx) => idx !== index));
  };
  const handleConstraintChange = (val: string, index: number) => {
    const list = [...constraints];
    list[index] = val;
    setConstraints(list);
  };

  const handleAddExample = () => setExamples([...examples, { input: "", output: "", explanation: "" }]);
  const handleRemoveExample = (index: number) => {
    setExamples(examples.filter((_, idx) => idx !== index));
  };
  const handleExampleChange = (field: keyof Example, val: string, index: number) => {
    const list = [...examples];
    list[index] = { ...list[index], [field]: val };
    setExamples(list);
  };

  const handleAddVisibleTestcase = () => setVisibleTestcases([...visibleTestcases, { input: "", output: "" }]);
  const handleRemoveVisibleTestcase = (index: number) => {
    setVisibleTestcases(visibleTestcases.filter((_, idx) => idx !== index));
  };
  const handleVisibleTestcaseChange = (field: keyof Testcase, val: string, index: number) => {
    const list = [...visibleTestcases];
    list[index] = { ...list[index], [field]: val };
    setVisibleTestcases(list);
  };

  const handleAddHiddenTestcase = () => setHiddenTestcases([...hiddenTestcases, { input: "", output: "" }]);
  const handleRemoveHiddenTestcase = (index: number) => {
    setHiddenTestcases(hiddenTestcases.filter((_, idx) => idx !== index));
  };
  const handleHiddenTestcaseChange = (field: keyof Testcase, val: string, index: number) => {
    const list = [...hiddenTestcases];
    list[index] = { ...list[index], [field]: val };
    setHiddenTestcases(list);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const payload = {
      title,
      description,
      difficulty,
      tags: tagsInput.split(",").map((s) => s.trim()).filter(Boolean),
      constraints: constraints.filter(Boolean),
      examples: examples.filter((ex) => ex.input.trim() || ex.output.trim()),
      visibleTestcases: visibleTestcases.filter((tc) => tc.input.trim() || tc.output.trim()),
      hiddenTestcases: hiddenTestcases.filter((tc) => tc.input.trim() || tc.output.trim()),
      editorial,
    };

    try {
      if (editId) {
        await problemsApi.updateProblem(editId, payload);
      } else {
        await problemsApi.createProblem(payload);
      }
      setIsEditing(false);
      fetchProblems();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to save problem");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100 flex items-center">
            <Settings className="h-5 w-5 text-emerald-500 mr-2" />
            Admin Problem Management
          </h1>
          <p className="text-sm text-zinc-400">Create, edit, and delete problems in the library</p>
        </div>
        {!isEditing && (
          <button
            onClick={handleCreateClick}
            className="inline-flex items-center bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold px-4 py-2 rounded text-xs transition"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Problem
          </button>
        )}
      </div>

      {error && (
        <div className="flex items-center space-x-2 bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded text-xs">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {isEditing ? (
        /* Create/Edit Form View */
        <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 space-y-6">
          <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
            <h3 className="text-sm font-bold text-zinc-200">
              {editId ? "Edit Problem details" : "Create New Problem"}
            </h3>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="text-zinc-400 hover:text-zinc-100 p-1.5"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Title & Difficulty */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-1">
              <label className="text-xs text-zinc-400 font-semibold uppercase tracking-wider block">Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Sum of Two Values"
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded px-4 py-2 text-sm text-zinc-100 outline-none transition"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-zinc-400 font-semibold uppercase tracking-wider block">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded px-4 py-2 text-sm text-zinc-100 outline-none transition cursor-pointer"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-xs text-zinc-400 font-semibold uppercase tracking-wider block">Description</label>
            <textarea
              required
              rows={6}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the problem details, input formats, output formats..."
              className="w-full bg-zinc-950 border border-zinc-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded px-4 py-2 text-sm text-zinc-100 outline-none transition resize-y font-sans"
            />
          </div>

          {/* Tags */}
          <div className="space-y-1">
            <label className="text-xs text-zinc-400 font-semibold uppercase tracking-wider block">Tags</label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="e.g. Array, Hash Map, Sorting (Comma separated)"
              className="w-full bg-zinc-950 border border-zinc-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded px-4 py-2 text-sm text-zinc-100 outline-none transition"
            />
          </div>

          {/* Constraints */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs text-zinc-400 font-semibold uppercase tracking-wider block">Constraints</label>
              <button
                type="button"
                onClick={handleAddConstraint}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center space-x-1"
              >
                <PlusCircle className="h-3.5 w-3.5" />
                <span>Add</span>
              </button>
            </div>
            {constraints.map((c, i) => (
              <div key={i} className="flex gap-2">
                <input
                  type="text"
                  value={c}
                  onChange={(e) => handleConstraintChange(e.target.value, i)}
                  placeholder="e.g. 1 <= n <= 10^5"
                  className="flex-grow bg-zinc-950 border border-zinc-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded px-4 py-1.5 text-xs text-zinc-100 outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveConstraint(i)}
                  className="text-rose-500 hover:text-rose-400"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Examples */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-xs text-zinc-400 font-semibold uppercase tracking-wider block">Examples</label>
              <button
                type="button"
                onClick={handleAddExample}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center space-x-1"
              >
                <PlusCircle className="h-3.5 w-3.5" />
                <span>Add Example</span>
              </button>
            </div>
            {examples.map((ex, i) => (
              <div key={i} className="bg-zinc-950/60 p-4 border border-zinc-850 rounded space-y-2 relative">
                <button
                  type="button"
                  onClick={() => handleRemoveExample(i)}
                  className="absolute right-4 top-4 text-rose-500 hover:text-rose-400"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <h4 className="text-xs font-bold text-zinc-400 mb-1">Example {i + 1}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Input"
                    value={ex.input}
                    onChange={(e) => handleExampleChange("input", e.target.value, i)}
                    className="bg-zinc-950 border border-zinc-800 rounded px-3 py-1.5 text-xs text-zinc-100 font-mono"
                  />
                  <input
                    type="text"
                    placeholder="Output"
                    value={ex.output}
                    onChange={(e) => handleExampleChange("output", e.target.value, i)}
                    className="bg-zinc-950 border border-zinc-800 rounded px-3 py-1.5 text-xs text-zinc-100 font-mono"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Explanation (Optional)"
                  value={ex.explanation || ""}
                  onChange={(e) => handleExampleChange("explanation", e.target.value, i)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-1.5 text-xs text-zinc-100 font-sans"
                />
              </div>
            ))}
          </div>

          {/* Visible Testcases */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-xs text-zinc-400 font-semibold uppercase tracking-wider block">
                Visible Test Cases (For debugging/testing)
              </label>
              <button
                type="button"
                onClick={handleAddVisibleTestcase}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center space-x-1"
              >
                <PlusCircle className="h-3.5 w-3.5" />
                <span>Add Testcase</span>
              </button>
            </div>
            {visibleTestcases.map((tc, i) => (
              <div key={i} className="flex gap-2 items-center bg-zinc-955/20 border border-zinc-850 p-2 rounded">
                <input
                  type="text"
                  placeholder="Input"
                  value={tc.input}
                  onChange={(e) => handleVisibleTestcaseChange("input", e.target.value, i)}
                  className="flex-grow bg-zinc-950 border border-zinc-800 rounded px-3 py-1 text-xs text-zinc-100 font-mono"
                />
                <input
                  type="text"
                  placeholder="Output"
                  value={tc.output}
                  onChange={(e) => handleVisibleTestcaseChange("output", e.target.value, i)}
                  className="flex-grow bg-zinc-950 border border-zinc-800 rounded px-3 py-1 text-xs text-zinc-100 font-mono"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveVisibleTestcase(i)}
                  className="text-rose-500 hover:text-rose-400 px-1"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Hidden Testcases (Secure evaluation cases) */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-xs text-rose-400 font-semibold uppercase tracking-wider block">
                Hidden Test Cases (Secured from normal users)
              </label>
              <button
                type="button"
                onClick={handleAddHiddenTestcase}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center space-x-1"
              >
                <PlusCircle className="h-3.5 w-3.5" />
                <span>Add Hidden</span>
              </button>
            </div>
            {hiddenTestcases.map((tc, i) => (
              <div key={i} className="flex gap-2 items-center bg-rose-500/5 border border-rose-500/10 p-2 rounded">
                <input
                  type="text"
                  placeholder="Hidden Input"
                  value={tc.input}
                  onChange={(e) => handleHiddenTestcaseChange("input", e.target.value, i)}
                  className="flex-grow bg-zinc-950 border border-zinc-800 rounded px-3 py-1 text-xs text-zinc-100 font-mono"
                />
                <input
                  type="text"
                  placeholder="Hidden Output"
                  value={tc.output}
                  onChange={(e) => handleHiddenTestcaseChange("output", e.target.value, i)}
                  className="flex-grow bg-zinc-950 border border-zinc-800 rounded px-3 py-1 text-xs text-zinc-100 font-mono"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveHiddenTestcase(i)}
                  className="text-rose-500 hover:text-rose-400 px-1"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Editorial */}
          <div className="space-y-1">
            <label className="text-xs text-zinc-400 font-semibold uppercase tracking-wider block">Editorial solution</label>
            <textarea
              rows={4}
              value={editorial}
              onChange={(e) => setEditorial(e.target.value)}
              placeholder="Explain the optimal solution approach (Big-O analysis, code walkthrough)..."
              className="w-full bg-zinc-950 border border-zinc-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded px-4 py-2 text-sm text-zinc-100 outline-none transition resize-y font-sans"
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-2 pt-4 border-t border-zinc-800">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="bg-zinc-850 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 font-semibold px-4 py-2 rounded text-xs transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold px-6 py-2 rounded text-xs transition flex items-center space-x-1.5 shadow-sm"
            >
              <Save className="h-3.5 w-3.5" />
              <span>Save Problem</span>
            </button>
          </div>
        </form>
      ) : (
        /* Problem Listing View */
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-zinc-800 text-sm">
            <thead className="bg-zinc-900/80 text-zinc-400 font-semibold tracking-wider text-xs text-left uppercase">
              <tr>
                <th className="px-6 py-3.5">Title</th>
                <th className="px-6 py-3.5">Difficulty</th>
                <th className="px-6 py-3.5">Tags</th>
                <th className="px-6 py-3.5 w-24 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800 bg-zinc-900/30">
              {loading ? (
                <tr>
                  <td colSpan={4} className="text-center py-10 text-zinc-500">
                    Loading problem set...
                  </td>
                </tr>
              ) : problems.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-10 text-zinc-500">
                    No problems found in library database.
                  </td>
                </tr>
              ) : (
                problems.map((p) => (
                  <tr key={p.id} className="hover:bg-zinc-850/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-zinc-200">{p.title}</td>
                    <td className="px-6 py-4">
                      <DifficultyBadge difficulty={p.difficulty} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {p.tags?.map((t) => (
                          <span
                            key={t}
                            className="bg-zinc-800 text-zinc-400 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border border-zinc-750"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center items-center space-x-3">
                        <button
                          onClick={() => handleEditClick(p)}
                          className="text-zinc-400 hover:text-emerald-400 p-1"
                          title="Edit"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="text-zinc-400 hover:text-rose-500 p-1"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
