import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Terminal,
  Cpu,
  ArrowRight,
  Zap,
  Code2,
  Shield,
  Play,
  Trophy,
  ChevronRight,
  Braces,
  Container,
  Timer,
  FileCode,
  Send,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";



/* ------------------------------------------------------------------ */
/*  Fade-in on scroll hook                                             */
/* ------------------------------------------------------------------ */
function useFadeIn() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

/* ------------------------------------------------------------------ */
/*  Typewriter code snippet                                            */
/* ------------------------------------------------------------------ */
const CODE_LINES = [
  "function twoSum(nums, target) {",
  "  const map = new Map();",
  "  for (let i = 0; i < nums.length; i++) {",
  "    const diff = target - nums[i];",
  "    if (map.has(diff)) {",
  "      return [map.get(diff), i];",
  "    }",
  "    map.set(nums[i], i);",
  "  }",
  "}",
];

const Typewriter: React.FC = () => {
  const [lines, setLines] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);

  useEffect(() => {
    if (currentLine >= CODE_LINES.length) return;

    const line = CODE_LINES[currentLine];
    if (currentChar <= line.length) {
      const timeout = setTimeout(() => {
        setLines((prev) => {
          const copy = [...prev];
          copy[currentLine] = line.slice(0, currentChar);
          return copy;
        });
        setCurrentChar((c) => c + 1);
      }, 30);
      return () => clearTimeout(timeout);
    } else {
      setCurrentLine((l) => l + 1);
      setCurrentChar(0);
      return undefined;
    }
  }, [currentLine, currentChar]);

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl shadow-emerald-500/5">
      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-800 bg-zinc-900/80">
        <span className="w-3 h-3 rounded-full bg-red-500/80" />
        <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
        <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
        <span className="ml-3 text-xs text-zinc-500 font-mono">solution.js</span>
      </div>
      {/* Code body */}
      <div className="p-5 font-mono text-sm leading-relaxed min-h-[260px]">
        {lines.map((line, i) => (
          <div key={i} className="flex">
            <span className="text-zinc-600 w-8 text-right mr-4 select-none">
              {i + 1}
            </span>
            <span className="text-emerald-300 whitespace-pre">{line}</span>
            {i === currentLine && currentLine < CODE_LINES.length && (
              <span className="inline-block w-2 h-5 bg-emerald-400 animate-pulse ml-px" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Feature card                                                       */
/* ------------------------------------------------------------------ */
interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
  delay: string;
}
const FeatureCard: React.FC<FeatureProps> = ({ icon, title, desc, delay }) => {
  const { ref, visible } = useFadeIn();
  return (
    <div
      ref={ref}
      style={{ transitionDelay: delay }}
      className={`group relative bg-zinc-900/60 backdrop-blur-sm border border-zinc-800 hover:border-emerald-500/40 p-6 rounded-2xl transition-all duration-700 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4 group-hover:bg-emerald-500/20 transition-colors">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-zinc-100 mb-2">{title}</h3>
      <p className="text-sm text-zinc-400 leading-relaxed">{desc}</p>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Step card (How it works)                                           */
/* ------------------------------------------------------------------ */
interface StepProps {
  step: number;
  icon: React.ReactNode;
  title: string;
  desc: string;
}
const StepCard: React.FC<StepProps> = ({ step, icon, title, desc }) => (
  <div className="flex flex-col items-center text-center">
    <div className="relative mb-4">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center">
        {icon}
      </div>
      <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-emerald-500 text-zinc-950 text-xs font-bold flex items-center justify-center">
        {step}
      </span>
    </div>
    <h3 className="font-bold text-zinc-100 text-lg mb-1">{title}</h3>
    <p className="text-sm text-zinc-400 max-w-xs">{desc}</p>
  </div>
);

/* ================================================================== */
/*  LANDING PAGE                                                       */
/* ================================================================== */
export const Landing: React.FC = () => {
  const { isAuthenticated } = useAuth();

  const heroFade = useFadeIn();
  const ctaFade = useFadeIn();

  return (
    <div className="min-h-screen">
      {/* ───────── Glow backdrop ───────── */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[30%] w-[600px] h-[600px] bg-emerald-500/[0.04] rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[20%] w-[500px] h-[500px] bg-teal-500/[0.03] rounded-full blur-[100px]" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* ───────── HERO ───────── */}
        <section
          ref={heroFade.ref}
          className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-16 pt-8 pb-20 transition-all duration-1000 ${
            heroFade.visible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          {/* Left copy */}
          <div className="flex-1 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/25 px-4 py-1.5 rounded-full text-emerald-400 text-xs font-semibold uppercase tracking-widest">
              <Zap className="h-3.5 w-3.5" />
              Online Judge Platform
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08]">
              Code.{" "}
              <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                Compete.
              </span>
              <br />
              Conquer.
            </h1>

            <p className="text-lg text-zinc-400 max-w-lg leading-relaxed">
              Write solutions in the Monaco editor, execute them inside Docker
              sandboxes, and climb the global leaderboard — all in real time.
            </p>

            <div className="flex flex-wrap gap-4 justify-center lg:justify-start pt-2">
              <Link
                to={isAuthenticated ? "/problems" : "/register"}
                className="group inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-zinc-950 font-bold px-7 py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/20"
              >
                Get Started
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/problems"
                className="inline-flex items-center gap-2 bg-zinc-900 border border-zinc-700 hover:border-zinc-500 text-zinc-200 px-7 py-3.5 rounded-xl transition-all"
              >
                Browse Problems
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Right — animated code */}
          <div className="flex-1 w-full max-w-xl">
            <Typewriter />
          </div>
        </section>


        {/* ───────── FEATURES ───────── */}
        <section className="py-20">
          <h2 className="text-3xl sm:text-4xl font-black text-center mb-4">
            Everything You Need to{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              Level Up
            </span>
          </h2>
          <p className="text-zinc-500 text-center max-w-lg mx-auto mb-12">
            A production-grade judge with real infrastructure behind every
            submission.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              delay="0ms"
              icon={<Code2 className="h-6 w-6 text-emerald-400" />}
              title="Monaco Editor"
              desc="Full VS Code editor experience with syntax highlighting, IntelliSense, and multi-language support."
            />
            <FeatureCard
              delay="100ms"
              icon={<Container className="h-6 w-6 text-teal-400" />}
              title="Docker Sandboxing"
              desc="Every submission runs in an isolated Docker container with strict timeouts and memory limits."
            />
            <FeatureCard
              delay="200ms"
              icon={<Timer className="h-6 w-6 text-cyan-400" />}
              title="Real-time Verdicts"
              desc="Watch your submission go from QUEUED → RUNNING → ACCEPTED with live polling updates."
            />
            <FeatureCard
              delay="300ms"
              icon={<Trophy className="h-6 w-6 text-amber-400" />}
              title="Global Leaderboard"
              desc="Earn 10/20/30 points per difficulty level and compete for the top spot on the Redis-powered rankings."
            />
          </div>
        </section>

        {/* ───────── HOW IT WORKS ───────── */}
        <section className="py-20">
          <h2 className="text-3xl sm:text-4xl font-black text-center mb-4">
            How It{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              Works
            </span>
          </h2>
          <p className="text-zinc-500 text-center max-w-md mx-auto mb-16">
            Three simple steps from code to leaderboard.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6 relative">
            {/* Connector lines (desktop only) */}
            <div className="hidden md:block absolute top-8 left-[calc(33%-40px)] w-[calc(34%+80px)] h-px bg-gradient-to-r from-emerald-500/40 via-teal-500/40 to-emerald-500/40" />

            <StepCard
              step={1}
              icon={<FileCode className="h-7 w-7 text-emerald-400" />}
              title="Write Code"
              desc="Pick a problem, choose your language, and write your solution in the built-in Monaco editor."
            />
            <StepCard
              step={2}
              icon={<Send className="h-7 w-7 text-teal-400" />}
              title="Submit"
              desc="Your code enters the BullMQ queue and gets executed inside a Docker sandbox against hidden test cases."
            />
            <StepCard
              step={3}
              icon={<CheckCircle2 className="h-7 w-7 text-cyan-400" />}
              title="Get Verdict"
              desc="Receive your verdict in real time — earn points for accepted solutions and climb the leaderboard."
            />
          </div>
        </section>

        {/* ───────── LANGUAGE SUPPORT ───────── */}
        <section className="py-16">
          <div className="bg-zinc-900/60 backdrop-blur-sm border border-zinc-800 rounded-2xl p-8 sm:p-10">
            <h2 className="text-2xl font-bold text-center mb-8">
              Supported Languages
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: "C++", icon: <Braces className="h-8 w-8" />, color: "text-blue-400" },
                { name: "Python", icon: <Terminal className="h-8 w-8" />, color: "text-yellow-400" },
                { name: "JavaScript", icon: <Code2 className="h-8 w-8" />, color: "text-amber-400" },
                { name: "Java", icon: <Cpu className="h-8 w-8" />, color: "text-red-400" },
              ].map((lang) => (
                <div
                  key={lang.name}
                  className="flex flex-col items-center gap-3 py-6 rounded-xl border border-zinc-800 hover:border-emerald-500/30 bg-zinc-950/50 hover:bg-zinc-900/50 transition-all group cursor-default"
                >
                  <span className={`${lang.color} group-hover:scale-110 transition-transform`}>
                    {lang.icon}
                  </span>
                  <span className="font-semibold text-zinc-300">{lang.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ───────── CTA ───────── */}
        <section
          ref={ctaFade.ref}
          className={`py-20 transition-all duration-1000 ${
            ctaFade.visible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-800 border border-zinc-800 p-10 sm:p-16 text-center">
            {/* Decorative glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 mb-6">
                <Shield className="h-5 w-5 text-emerald-400" />
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                  Free & Open Source
                </span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-black mb-4">
                Ready to{" "}
                <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                  Code?
                </span>
              </h2>
              <p className="text-zinc-400 max-w-md mx-auto mb-8 text-lg">
                Join the community, solve problems, and prove your skills on the
                leaderboard.
              </p>

              <Link
                to={isAuthenticated ? "/problems" : "/register"}
                className="group inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-zinc-950 font-bold px-8 py-4 rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/25 text-lg"
              >
                <Play className="h-5 w-5" />
                Start Solving
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
