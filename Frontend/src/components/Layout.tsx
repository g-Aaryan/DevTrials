import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Terminal, LogOut, Trophy, Settings, History, User, Menu, X } from "lucide-react";

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const isActive = (path: string) => location.pathname === path;

  const linkClass = (path: string) =>
    `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 ${
      isActive(path)
        ? "border-emerald-500 text-emerald-400 font-semibold"
        : "border-transparent text-zinc-400 hover:text-zinc-100 hover:border-zinc-700"
    }`;

  const mobileLinkClass = (path: string) =>
    `block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors duration-200 ${
      isActive(path)
        ? "bg-zinc-800 border-emerald-500 text-emerald-400 font-semibold"
        : "border-transparent text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
    }`;

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col font-sans select-none">
      {/* Header Navigation */}
      <nav className="bg-zinc-900 border-b border-zinc-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-14">
            <div className="flex items-center">
              {/* Logo */}
              <Link to="/" className="flex items-center space-x-2 mr-8 group">
                <Terminal className="h-6 w-6 text-emerald-500 transition-transform duration-200 group-hover:scale-110" />
                <span className="font-bold text-lg tracking-wider bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                  DevTrails
                </span>
              </Link>

              {/* Desktop Nav Links */}
              {isAuthenticated && (
                <div className="hidden sm:flex sm:space-x-6 h-full">
                  <Link to="/problems" className={linkClass("/problems")}>
                    Problems
                  </Link>
                  <Link to="/submissions" className={linkClass("/submissions")}>
                    <History className="h-4 w-4 mr-1.5" />
                    My Submissions
                  </Link>
                  <Link to="/leaderboard" className={linkClass("/leaderboard")}>
                    <Trophy className="h-4 w-4 mr-1.5" />
                    Leaderboard
                  </Link>
                  {isAdmin && (
                    <Link to="/admin" className={linkClass("/admin")}>
                      <Settings className="h-4 w-4 mr-1.5 text-zinc-500" />
                      Admin
                    </Link>
                  )}
                </div>
              )}
            </div>

            {/* Right Side Buttons */}
            <div className="hidden sm:flex sm:items-center sm:space-x-4">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/profile"
                    className="flex items-center space-x-2 text-sm text-zinc-300 hover:text-zinc-100 transition-colors py-1.5 px-3 rounded-md hover:bg-zinc-800 border border-zinc-800"
                  >
                    <User className="h-4 w-4 text-emerald-500" />
                    <span className="font-medium">{user?.name}</span>
                    {isAdmin && (
                      <span className="text-[10px] uppercase font-extrabold tracking-wider bg-rose-500/10 text-rose-400 px-1.5 py-0.5 rounded border border-rose-500/20">
                        Admin
                      </span>
                    )}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center space-x-1.5 text-sm text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 py-1.5 px-3 rounded border border-transparent hover:border-rose-500/20 transition-all"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    to="/login"
                    className="text-sm text-zinc-400 hover:text-zinc-100 py-1.5 px-3 rounded transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="text-sm bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold py-1.5 px-4 rounded transition-all duration-200 shadow-sm"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center sm:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-zinc-400 hover:text-zinc-100 p-2 rounded focus:outline-none"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden border-b border-zinc-800 bg-zinc-900 px-2 pt-2 pb-3 space-y-1">
            {isAuthenticated ? (
              <>
                <Link
                  to="/problems"
                  onClick={() => setMobileMenuOpen(false)}
                  className={mobileLinkClass("/problems")}
                >
                  Problems
                </Link>
                <Link
                  to="/submissions"
                  onClick={() => setMobileMenuOpen(false)}
                  className={mobileLinkClass("/submissions")}
                >
                  My Submissions
                </Link>
                <Link
                  to="/leaderboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className={mobileLinkClass("/leaderboard")}
                >
                  Leaderboard
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className={mobileLinkClass("/admin")}
                  >
                    Admin Panel
                  </Link>
                )}
                <div className="border-t border-zinc-800 my-2 pt-2"></div>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-2 px-3 py-2 text-base font-medium text-zinc-300 hover:bg-zinc-800"
                >
                  <User className="h-5 w-5 text-emerald-500" />
                  <span>{user?.name} (Profile)</span>
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="flex w-full items-center space-x-2 px-3 py-2 text-base font-medium text-rose-400 hover:bg-rose-500/10"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <div className="flex flex-col space-y-2 p-3">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center py-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center py-2 bg-emerald-500 text-zinc-950 rounded font-bold"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>

      {/* Main Page Area */}
      <main className="flex-grow flex flex-col max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-zinc-900 border-t border-zinc-800 py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-zinc-500">
          DevTrails Coding Platform &copy; {new Date().getFullYear()} — Made with love by Aaryan Gupta
        </div>
      </footer>
    </div>
  );
};
