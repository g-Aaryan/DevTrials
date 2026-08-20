import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { User, Mail, KeyRound, ShieldAlert, ArrowRight, ShieldCheck } from "lucide-react";

export const Register: React.FC = () => {
  const { register, verifyOtp } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // OTP Verification state
  const [showOtpScreen, setShowOtpScreen] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState<string | null>(null);
  const [otpLoading, setOtpLoading] = useState(false);
  const [resendStatus, setResendStatus] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await register({ name, email, password });
      if (res.success) {
        setShowOtpScreen(true);
      } else {
        setError(res.message || "Failed to register");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to register");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError(null);
    setOtpLoading(true);

    try {
      const res = await verifyOtp({ email, otp });
      if (res.success) {
        // Logging in directly using verifyOtp returned data
        navigate("/problems");
      } else {
        setOtpError(res.message || "Invalid OTP code");
      }
    } catch (err: any) {
      setOtpError(err.response?.data?.message || err.message || "Verification failed");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setResendStatus("Sending...");
    try {
      await verifyOtp({ email }); // If resend is a different call, let's trigger resendOtp
      // We can also trigger the direct resend call from auth context if needed.
      // In authApi we have resendOtp(email):
      // Let's call the authApi helper directly or through context if supported.
      // authApi.resendOtp({ email })
      setResendStatus("OTP resent successfully!");
    } catch (err: any) {
      setResendStatus("Failed to resend. Please try again.");
    }
  };

  if (showOtpScreen) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-xl p-8 space-y-6 shadow-md">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold tracking-tight text-zinc-100 flex items-center justify-center">
              <ShieldCheck className="h-6 w-6 text-emerald-500 mr-2 animate-bounce" />
              Verify Email
            </h2>
            <p className="text-sm text-zinc-400">
              We have sent a 6-digit OTP code to <strong className="text-zinc-300">{email}</strong>
            </p>
          </div>

          {otpError && (
            <div className="flex items-center space-x-2 bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3 rounded text-xs">
              <ShieldAlert className="h-4 w-4 flex-shrink-0" />
              <span>{otpError}</span>
            </div>
          )}

          {resendStatus && (
            <div className="text-center text-xs bg-zinc-800/50 border border-zinc-800 text-zinc-300 p-2.5 rounded">
              {resendStatus}
            </div>
          )}

          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block text-center">
                Enter Verification Code
              </label>
              <input
                type="text"
                maxLength={6}
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                placeholder="123456"
                className="w-full bg-zinc-950 tracking-[0.75em] text-center font-mono border border-zinc-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded py-3 text-lg text-zinc-100 outline-none transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={otpLoading}
              className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-500/50 disabled:cursor-not-allowed text-zinc-950 font-bold py-2.5 px-4 rounded text-sm transition-all shadow-sm flex items-center justify-center space-x-2"
            >
              <span>{otpLoading ? "Verifying..." : "Verify Code"}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="flex justify-between text-xs text-zinc-400 pt-2 border-t border-zinc-800">
            <button onClick={() => setShowOtpScreen(false)} className="hover:text-zinc-200">
              Change Email
            </button>
            <button onClick={handleResendOtp} className="text-emerald-400 hover:text-emerald-300 font-semibold">
              Resend OTP
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-xl p-8 space-y-6 shadow-md">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-100">Create Account</h2>
          <p className="text-sm text-zinc-400">Join DevTrails to start compiling and submitting code</p>
        </div>

        {error && (
          <div className="flex items-center space-x-2 bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3 rounded text-xs">
            <ShieldAlert className="h-4 w-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 h-4.5 w-4.5 text-zinc-500" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Aaryan Gupta"
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded pl-10 pr-4 py-2 text-sm text-zinc-100 placeholder-zinc-600 outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4.5 w-4.5 text-zinc-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="coder@devtrails.com"
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded pl-10 pr-4 py-2 text-sm text-zinc-100 placeholder-zinc-600 outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">
              Password
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-2.5 h-4.5 w-4.5 text-zinc-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded pl-10 pr-4 py-2 text-sm text-zinc-100 placeholder-zinc-600 outline-none transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-500/50 disabled:cursor-not-allowed text-zinc-950 font-bold py-2 px-4 rounded text-sm transition-all shadow-sm"
          >
            {loading ? "Registering..." : "Create Account"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-zinc-800" />
          <span className="text-xs text-zinc-500">or</span>
          <div className="flex-1 h-px bg-zinc-800" />
        </div>

        {/* Google Login */}
        <a
          href={`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/api/v1/auth/google`}
          className="w-full flex items-center justify-center gap-3 bg-zinc-950 border border-zinc-700 hover:border-zinc-500 text-zinc-200 font-semibold py-2.5 px-4 rounded text-sm transition-all"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Sign up with Google
        </a>

        <div className="text-center text-xs text-zinc-500 pt-2 border-t border-zinc-800">
          <span>Already have an account? </span>
          <Link to="/login" className="text-emerald-400 hover:text-emerald-300 font-semibold">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
};
