import React, { useState } from "react";
import { 
  Lock, 
  User, 
  Sparkles, 
  Eye, 
  EyeOff, 
  ArrowRight,
  ShieldAlert,
  HelpCircle,
  Gem
} from "lucide-react";

interface ManagerLoginViewProps {
  onLoginSuccess: (role: "superadmin" | "admin") => void;
  onSwitchToCustomer: () => void;
}

export default function ManagerLoginView({
  onLoginSuccess,
  onSwitchToCustomer
}: ManagerLoginViewProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showHint, setShowHint] = useState(true);

  // Active sub-tab for helper instructions
  const [activeHintTab, setActiveHintTab] = useState<"admin" | "super">("admin");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Simulate validation delay for a professional premium experience
    setTimeout(() => {
      const u = username.trim().toLowerCase();
      if (u === "super" && password === "super123") {
        onLoginSuccess("superadmin");
      } else if (u === "admin" && password === "admin123") {
        onLoginSuccess("admin");
      } else {
        setError("❌ Sai tài khoản hoặc mật khẩu! Vui lòng kiểm tra lại thông tin đề xuất bên dưới.");
        setLoading(false);
      }
    }, 600);
  };

  const handleQuickLogin = (role: "superadmin" | "admin") => {
    setError("");
    setLoading(true);
    setTimeout(() => {
      onLoginSuccess(role);
    }, 550);
  };

  return (
    <div className="min-h-screen w-full bg-[#FFF5F8] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative premium background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-pink-100/40 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-rose-100/40 blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md bg-white border border-pink-100/85 rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10 space-y-6">
        
        {/* Salon Logo and Header */}
        <div className="text-center space-y-2">
          <div className="h-14 w-14 bg-gradient-to-tr from-[#874C67] to-[#dfa0be] text-white flex items-center justify-center rounded-2xl mx-auto shadow-md transform rotate-3">
            <Gem className="h-7 w-7" />
          </div>
          <div className="space-y-1">
            <span className="flex items-center justify-center gap-1 text-[10px] font-bold text-[#874C67] tracking-widest uppercase">
              <Sparkles className="h-3 w-3 text-amber-500 fill-amber-300 animate-pulse" /> DALLAS NAILS LUXURY
            </span>
            <h2 className="font-display text-2xl font-extrabold text-slate-900 tracking-tight">
              Hệ thống Quản lý Salon 🏢
            </h2>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Đăng nhập để xem lịch hẹn thợ, doanh thu trực tiếp, quản lý kho hàng và chạy trợ lý AI Salon Operator.
            </p>
          </div>
        </div>

        {/* Error notification block */}
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-700 text-xs font-semibold flex items-center gap-2.5 animate-bounce">
            <ShieldAlert className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form authentication state */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username Input Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block">
              Tên tài khoản (Username)
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
              <input
                id="username-input"
                type="text"
                required
                placeholder="Nhập tên đăng nhập quản lý..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50/20 py-3.5 pl-11 pr-4 focus:ring-1 focus:ring-pink-300 focus:border-pink-300 focus:bg-white outline-none transition"
              />
            </div>
          </div>

          {/* Password Input Field */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block">
                Mật khẩu (Password)
              </label>
              <button
                type="button"
                onClick={() => setShowHint(!showHint)}
                className="text-[10px] text-[#874C67] hover:underline font-bold flex items-center gap-0.5"
              >
                <HelpCircle className="h-3 w-3" /> Gợi ý mật khẩu?
              </button>
            </div>
            
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
              <input
                id="password-input"
                type={showPassword ? "text" : "password"}
                required
                placeholder="Nhập mật khẩu truy nhập..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50/20 py-3.5 pl-11 pr-11 focus:ring-1 focus:ring-pink-300 focus:border-pink-300 focus:bg-white outline-none transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-650 p-1 rounded-md transition"
              >
                {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
              </button>
            </div>
          </div>

          {/* Quick interactive hint drawer with One-click quick login */}
          {showHint && (
            <div className="p-3.5 bg-slate-50 border border-slate-200/60 rounded-2xl space-y-2.5 text-xs font-sans">
              <div className="flex border-b border-slate-250 pb-1.5 justify-between items-center">
                <span className="font-extrabold text-slate-800 flex items-center gap-1">
                  🔑 Tài khoản Sandbox:
                </span>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => setActiveHintTab("admin")}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                      activeHintTab === "admin" ? "bg-[#874C67] text-white" : "bg-slate-200 text-slate-600 hover:bg-slate-300"
                    }`}
                  >
                    Admin Salon
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveHintTab("super")}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                      activeHintTab === "super" ? "bg-slate-900 text-white" : "bg-slate-200 text-slate-600 hover:bg-slate-300"
                    }`}
                  >
                    SuperAdmin
                  </button>
                </div>
              </div>

              {activeHintTab === "admin" ? (
                <div className="space-y-2 animate-in fade-in duration-200">
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    <strong>Admin (Chủ tiệm Nail):</strong> Quản lý vận hành tiệm, xem lịch đặt hẹn thợ, chăm sóc khách hàng CRM, tính doanh thu và dùng trợ lý AI.
                  </p>
                  <div className="flex bg-white items-center justify-between p-2 rounded-xl border border-pink-100 font-mono text-[10px]">
                    <div>
                      <div>Username: <span className="font-bold text-slate-900 bg-slate-50 px-1 rounded">admin</span></div>
                      <div>Password: <span className="font-bold text-slate-900 bg-slate-50 px-1 rounded">admin123</span></div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleQuickLogin("admin")}
                      className="bg-[#874C67] hover:bg-[#5a3246] text-white font-extrabold text-[9px] uppercase px-2.5 py-1.5 rounded-lg tracking-wider transition-all active:scale-95 cursor-pointer"
                    >
                      🚀 Vào Admin
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2 animate-in fade-in duration-200">
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    <strong>SuperAdmin (Chủ App SaaS):</strong> Quản trị toàn sàn, quản lý gia hạn các cửa hàng, theo dõi tổng doanh thu đăng ký thuê bao & khoá tài khoản.
                  </p>
                  <div className="flex bg-white items-center justify-between p-2 rounded-xl border border-slate-200 font-mono text-[10px]">
                    <div>
                      <div>Username: <span className="font-bold text-slate-900 bg-slate-50 px-1 rounded">super</span></div>
                      <div>Password: <span className="font-bold text-slate-900 bg-slate-50 px-1 rounded">super123</span></div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleQuickLogin("superadmin")}
                      className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-[9px] uppercase px-2.5 py-1.5 rounded-lg tracking-wider transition-all active:scale-95 cursor-pointer"
                    >
                      👑 Vào Super
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Submit Action buttons */}
          <button
            id="login-submit-button"
            type="submit"
            disabled={loading}
            className="w-full bg-[#874C67] hover:bg-[#5e3247] disabled:bg-[#874C67]/60 text-white font-extrabold rounded-xl py-3.5 text-xs sm:text-sm transition-all active:scale-98 shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                CHÚNG TÔI ĐANG KẾT NỐI...
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                ĐĂNG NHẬP ADMIN / SUPERADMIN <ArrowRight className="h-4.5 w-4.5" />
              </span>
            )}
          </button>
        </form>

        {/* Client option footer */}
        <div className="pt-4 border-t border-slate-100 text-center space-y-2">
          <p className="text-[11px] text-slate-400 font-medium font-sans">Bạn là khách hàng của tiệm?</p>
          <button
            id="switch-customer-portal-button"
            onClick={onSwitchToCustomer}
            className="text-xs font-bold text-[#874C67] hover:text-[#5e3247] border border-pink-200/60 bg-pink-50/20 px-4 py-2 rounded-xl transition hover:bg-pink-50/50 w-full cursor-pointer"
          >
            💅 Vào Cổng Khách Hàng (Tích điểm, Đặt lịch)
          </button>
        </div>

      </div>

      <div className="mt-6 text-center text-[10px] text-slate-400 font-medium tracking-wide">
        Dallas Luxury NailOS v3.2 • Secure Administrative Console
      </div>
    </div>
  );
}
