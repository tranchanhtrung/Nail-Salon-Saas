import React, { useState } from "react";
import { 
  Building2, 
  Plus, 
  Sparkles, 
  CreditCard, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Calendar, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  ShieldAlert,
  Sliders,
  DollarSign,
  Activity,
  Megaphone,
  Pocket,
  Trash2,
  Lock,
  Unlock,
  Coins
} from "lucide-react";
import { Tenant } from "../types";

interface SaasHubViewProps {
  tenants: Tenant[];
  activeTenantId: string;
  onSelectTenant: (id: string) => void;
  onAddTenant: (tenant: Omit<Tenant, "id" | "registrationDate" | "subscriptionStatus">) => void;
  onSubscribeTenant: (id: string, plan: "monthly" | "yearly") => void;
  onResetTrial: (id: string, daysAgo: number) => void;
  onToggleLockTenant: (id: string) => void;
  systemAnnouncement: string;
  onChangeSystemAnnouncement: (msg: string) => void;
  auditLogs: { id: string; event: string; timestamp: string; type: "info" | "success" | "warning" | "danger" }[];
}

export default function SaasHubView({
  tenants,
  activeTenantId,
  onSelectTenant,
  onAddTenant,
  onSubscribeTenant,
  onResetTrial,
  onToggleLockTenant,
  systemAnnouncement,
  onChangeSystemAnnouncement,
  auditLogs
}: SaasHubViewProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [payModalOpen, setPayModalOpen] = useState<Tenant | null>(null);

  // Active workspace tab for SuperAdmin
  const [sysTab, setSysTab] = useState<"tenants" | "settings" | "logs">("tenants");

  // Form states for new salon
  const [newName, setNewName] = useState("");
  const [newOwner, setNewOwner] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [newTrialOffset, setNewTrialOffset] = useState("0"); // 0 Days ago = Fresh trial

  // Selected billing plan for payment
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "yearly">("monthly");
  const [cardNumber, setCardNumber] = useState("4242 •••• •••• 4242");
  const [cardExpiry, setCardExpiry] = useState("12/28");
  const [cardCVC, setCardCVC] = useState("127");
  const [submittingPayment, setSubmittingPayment] = useState(false);

  // Broadcaster setting
  const [announcementText, setAnnouncementText] = useState(systemAnnouncement);

  // Price Catalog values
  const [monthlyPrice, setMonthlyPrice] = useState(9.9);
  const [yearlyPrice, setYearlyPrice] = useState(99);

  const activeTenant = tenants.find(t => t.id === activeTenantId) || tenants[0];

  const handleCreateTenantSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newOwner.trim()) return;

    onAddTenant({
      name: newName,
      ownerName: newOwner,
      ownerEmail: newEmail || "owner@example.com",
      phone: newPhone || "+1 (555) 019-2831",
      location: newLocation || "Dallas, TX",
      trialStartDate: new Date(Date.now() - parseInt(newTrialOffset) * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
    });

    // Clear form
    setNewName("");
    setNewOwner("");
    setNewEmail("");
    setNewPhone("");
    setNewLocation("");
    setNewTrialOffset("0");
    setModalOpen(false);
  };

  const calculateTrialStats = (tenant: Tenant) => {
    const start = new Date(tenant.trialStartDate);
    const now = new Date();
    const elapsedMs = now.getTime() - start.getTime();
    const elapsedDays = Math.floor(elapsedMs / (1000 * 60 * 60 * 24));
    
    const totalTrialDays = 90;
    const daysRemaining = Math.max(0, totalTrialDays - elapsedDays);
    const isExpired = elapsedDays >= totalTrialDays && tenant.subscriptionStatus === "Trial";

    return {
      elapsedDays,
      daysRemaining,
      isExpired
    };
  };

  const handlePaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payModalOpen) return;
    setSubmittingPayment(true);
    
    setTimeout(() => {
      onSubscribeTenant(payModalOpen.id, selectedPlan);
      setSubmittingPayment(false);
      setPayModalOpen(null);
    }, 1200);
  };

  const handleBroadcastAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    onChangeSystemAnnouncement(announcementText);
    alert("📢 Khởi tạo phát thông báo toàn cầu thành công! Nội dung mới đã được cập nhật.");
  };

  // SaaS Financial aggregate metrics
  const totalSalonsCount = tenants.length;
  const trialSalonsCount = tenants.filter(t => t.subscriptionStatus === "Trial").length;
  const activeSalonsCount = tenants.filter(t => t.subscriptionStatus === "Active").length;
  const lockedSalonsCount = tenants.filter(t => t.isLocked).length;

  const currentMRR = tenants.reduce((mrr, t) => {
    if (t.subscriptionStatus === "Active") {
      if (t.billingPlan === "monthly") return mrr + monthlyPrice;
      if (t.billingPlan === "yearly") return mrr + (yearlyPrice / 12);
    }
    return mrr;
  }, 0);

  const accumulatedSaaSRevenue = tenants.reduce((rev, t) => {
    if (t.subscriptionStatus === "Active") {
      if (t.billingPlan === "monthly") return rev + monthlyPrice;
      if (t.billingPlan === "yearly") return rev + yearlyPrice;
    }
    return rev;
  }, 350.5); // base simulated seed sales

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* SaaS Admin Title Bar */}
      <div className="bg-[#1e1b19] rounded-3xl border border-slate-800 p-6 sm:p-8 text-white relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 h-48 w-48 rounded-full bg-amber-500/15 blur-2xl" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 h-48 w-48 rounded-full bg-pink-500/10 blur-2xl" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-3 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/20 border border-amber-500/30 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-amber-300">
              <ShieldAlert className="h-3 w-3" /> CỔNG QUẢN TRỊ VIÊN CẤP CAO (SUPERADMIN)
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight">
              Bảng Tổng Quan Toàn Sàn NailOS SaaS
            </h2>
            <p className="text-xs sm:text-sm font-medium text-slate-300 leading-relaxed font-sans">
              Chào mừng, <strong>Chủ App (SuperAdmin)</strong>. Phân hệ điều hành này cho phép quản lý tất cả chi nhánh Salon đã khởi tạo, gia hạn thời gian dùng thử của đại lý, tùy biến biểu phí dịch vụ của toàn nền tảng và gỡ lỗi kỹ thuật trong hộp cát.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 shrink-0 backdrop-blur-md">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Doanh thu Thuê bao SaaS:</div>
            <div className="text-2xl font-black text-amber-400 mt-1 font-mono">${currentMRR.toFixed(1)}/tháng MRR</div>
            <p className="text-[10px] text-slate-400 font-bold mt-1">Sức khỏe tài chính: Khỏe mạnh ✓</p>
          </div>
        </div>
      </div>

      {/* SaaS Live Financial KPIs widget */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl border border-slate-150 p-5 shadow-xs space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Tổng chi nhánh Salon</span>
            <span className="p-2 rounded-xl bg-slate-50 text-slate-700 font-bold text-xs">A-Z</span>
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">{totalSalonsCount} Cửa hàng</div>
          <p className="text-[10px] text-slate-500 font-semibold">{activeSalonsCount} trả phí • {trialSalonsCount} dùng thử</p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-150 p-5 shadow-xs space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Doanh số nền tảng</span>
            <span className="p-2 rounded-xl bg-amber-50 text-amber-700">
              <Coins className="h-4 w-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">${accumulatedSaaSRevenue.toFixed(1)}</div>
          <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
            <span>✓ Đạt mốc lợi nhuận đề ra</span>
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-150 p-5 shadow-xs space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Giá trị gói thuê</span>
            <span className="p-2 rounded-xl bg-purple-50 text-purple-700">
              <CreditCard className="h-4 w-4" />
            </span>
          </div>
          <div className="text-lg font-extrabold text-slate-900 font-sans">${monthlyPrice}/tháng • ${yearlyPrice}/năm</div>
          <p className="text-[10px] text-slate-500 font-semibold">Cấu hình cập nhật toàn sàn</p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-150 p-5 shadow-xs space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Tiệm đang tạm khóa</span>
            <span className="p-2 rounded-xl bg-rose-50 text-rose-700">
              <Lock className="h-4 w-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">{lockedSalonsCount} Tiệm</div>
          <p className="text-[10px] text-rose-600 font-bold">Kích hoạt hạn chế do nợ phí</p>
        </div>
      </div>

      {/* Sub-tab selectors */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setSysTab("tenants")}
          className={`px-5 py-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 cursor-pointer ${
            sysTab === "tenants" 
              ? "border-[#874C67] text-[#874C67] font-black" 
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Building2 className="h-4 w-4" /> 1. Cơ sở Tiệm Nails ({tenants.length})
        </button>
        <button
          onClick={() => setSysTab("settings")}
          className={`px-5 py-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 cursor-pointer ${
            sysTab === "settings" 
              ? "border-[#874C67] text-[#874C67] font-black" 
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Sliders className="h-4 w-4" /> 2. Cài Đặt Hệ Thống & Broadcast
        </button>
        <button
          onClick={() => setSysTab("logs")}
          className={`px-5 py-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 cursor-pointer ${
            sysTab === "logs" 
              ? "border-[#874C67] text-[#874C67] font-black" 
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Activity className="h-4 w-4" /> 3. Nhật Ký Hoạt Động (Audit Logs)
        </button>
      </div>

      {/* RENDER ACTIVE SUPERADMIN SUBTAB */}
      {sysTab === "tenants" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h3 className="font-display font-bold text-slate-900 text-sm">
              📂 QUẢN LÝ QUY HOẠCH CHI NHÁNH & GIA HẠN DÙNG THỬ
            </h3>
            <button
              onClick={() => setModalOpen(true)}
              className="bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-xs py-2 px-4 rounded-xl flex items-center gap-1 tracking-wider transition-all cursor-pointer"
            >
              <Plus className="h-4 w-4" /> THÊM CHỦ TIỆM SALON MỚI
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {tenants.map((tenant) => {
              const { elapsedDays, daysRemaining, isExpired } = calculateTrialStats(tenant);
              const isSelected = tenant.id === activeTenantId;

              let badgeColor = "bg-emerald-50 text-emerald-800 border-emerald-100";
              let statusText = "Hoạt Động (Đã Đóng Phí)";

              if (tenant.subscriptionStatus === "Trial") {
                if (isExpired) {
                  badgeColor = "bg-rose-50 text-rose-800 border-rose-200 animate-pulse";
                  statusText = "Dùng Thử Quá Hạn";
                } else {
                  badgeColor = "bg-blue-50 text-blue-800 border-blue-100";
                  statusText = `Trial (còn ${daysRemaining} ngày)`;
                }
              }

              if (tenant.isLocked) {
                badgeColor = "bg-red-550 text-white border-red-650";
                statusText = "TẠM KHÓA HOẠT ĐỘNG 🔒";
              }

              return (
                <div 
                  key={tenant.id} 
                  className={`bg-white rounded-3xl border p-5 flex flex-col justify-between transition-all duration-300 relative ${
                    tenant.isLocked ? "bg-slate-50 border-rose-200 opacity-90" : "border-slate-150 hover:shadow-md"
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-display font-bold text-slate-950">{tenant.name}</h4>
                        <span className="font-mono text-[9px] font-bold text-slate-400 uppercase tracking-widest block mt-0.5">
                          SALON ID: {tenant.id}
                        </span>
                      </div>
                      <span className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-lg border ${badgeColor}`}>
                        {statusText}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-605 font-sans border-t border-slate-50 pt-3">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Chủ tiệm:</span>
                        <strong className="text-slate-8 w-36 text-right truncate">{tenant.ownerName}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Email:</span>
                        <span className="text-slate-600 truncate w-36 text-right">{tenant.ownerEmail}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Vị trí:</span>
                        <span className="text-slate-600 truncate w-32 text-right">{tenant.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Gói dùng:</span>
                        <span className="font-bold text-[#874C67]">
                          {tenant.subscriptionStatus === "Active" 
                            ? `Plan ${tenant.billingPlan === "monthly" ? "Tháng" : "Năm"}`
                            : "Gói Lửng Thử 90 ngày"
                          }
                        </span>
                      </div>
                    </div>

                    {/* Simulation tools for SuperAdmin to test easily */}
                    <div className="p-3 bg-slate-50 border border-slate-150 rounded-2xl space-y-2">
                      <span className="text-[10px] uppercase font-black text-slate-450 block">⚙️ Đồ chơi quản lý Sandbox (SuperAdmin Only):</span>
                      
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => onResetTrial(tenant.id, 0)}
                          className="bg-white border border-slate-205 py-1 px-1.5 text-[9px] font-bold text-slate-700 hover:bg-slate-100 rounded-md transition duration-150 flex-1 cursor-pointer"
                          title="Hôm nay"
                        >
                          Fresh Trial
                        </button>
                        <button
                          onClick={() => onResetTrial(tenant.id, 91)}
                          className="bg-slate-900 py-1 px-1.5 text-[9px] font-bold text-white hover:bg-slate-800 rounded-md transition duration-150 flex-1 cursor-pointer"
                          title="Hết hạn dùng thử"
                        >
                          Trigger Expired
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3.5 border-t border-slate-105 flex gap-2">
                    {/* Select active sandbox database */}
                    {!isSelected ? (
                      <button
                        onClick={() => {
                          onSelectTenant(tenant.id);
                          alert(`Đã kết nối cơ sở dữ liệu hiện hành của: ${tenant.name}`);
                        }}
                        className="flex-1 bg-[#874C67] hover:bg-[#5a3246] text-white font-extrabold text-[11px] py-2 px-3 rounded-xl transition cursor-pointer text-center"
                      >
                        ⚡ Kết nối data tiệm này
                      </button>
                    ) : (
                      <span className="flex-1 bg-emerald-50 text-emerald-700 font-bold text-[11px] py-1.5 px-3 rounded-xl flex items-center justify-center">
                        ✓ Đang thao tác
                      </span>
                    )}

                    {/* Suspension/Lock toggler */}
                    <button
                      onClick={() => onToggleLockTenant(tenant.id)}
                      className={`px-3 rounded-xl border flex items-center justify-center transition cursor-pointer ${
                        tenant.isLocked 
                          ? "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100" 
                          : "bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100"
                      }`}
                      title={tenant.isLocked ? "Bỏ chặn / Mở khóa hoạt động" : "Tạm khóa hoạt động do nợ phí"}
                    >
                      {tenant.isLocked ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {sysTab === "settings" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Announcement Customizer card */}
          <div className="bg-white rounded-3xl border border-slate-150 p-6 shadow-sm space-y-4">
            <h3 className="font-display font-bold text-slate-950 text-sm flex items-center gap-2">
              <Megaphone className="h-4.5 w-4.5 text-[#874C67]" />
              Phát thông báo Hệ Thống (Broadcast Message Station)
            </h3>
            <p className="text-xs text-slate-500 font-sans">
              Nội dung phát thông báo sẽ chạy trực tiếp trên dải chạy ngang đầu trang ở toàn bộ giao diện quản trị Admin của các salon Nails liên kết! Dùng để nhắc nhở bảo trì mảng máy chủ hoặc thông báo tính năng AI mới.
            </p>

            <form onSubmit={handleBroadcastAnnouncement} className="space-y-4 text-xs font-semibold text-slate-600 font-sans">
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 font-black block uppercase">Dòng chữ hiển thị trên dải tin:</label>
                <textarea
                  value={announcementText}
                  onChange={e => setAnnouncementText(e.target.value)}
                  placeholder="Nhập nội dung thông báo... Ví dụ: ⚠️ Chú ý: Cổng thanh toán Stripe bảo trì định kỳ từ 1:00 đến 3:00 sáng chủ nhật."
                  className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#874C67] min-h-[90px]"
                />
              </div>

              <button
                type="submit"
                className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl uppercase tracking-wider transition cursor-pointer"
              >
                📢 Phát thông báo ngay
              </button>
            </form>
          </div>

          {/* Pricing Catalog Overrides Card */}
          <div className="bg-white rounded-3xl border border-slate-150 p-6 shadow-sm space-y-4">
            <h3 className="font-display font-bold text-slate-950 text-sm flex items-center gap-2">
              <Sliders className="h-4.5 w-4.5 text-[#874C67]" />
              Cấu hình Thẻ giá Thuê Bao & Trial (Pricing configuration)
            </h3>
            <p className="text-xs text-slate-500 font-sans">
              Cập nhật giá bán các gói dịch vụ và các điều khoản dùng thử miễn phí mặc định cho chủ phòng Salon.
            </p>

            <div className="space-y-4 text-xs font-semibold text-slate-600 font-sans">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 font-bold block uppercase">Phí theo Tháng (USD):</label>
                  <input
                    type="number"
                    step="0.1"
                    value={monthlyPrice}
                    onChange={e => setMonthlyPrice(parseFloat(e.target.value) || 0)}
                    className="w-full border border-slate-200 px-3 py-2 rounded-xl text-slate-900"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 font-bold block uppercase">Phí theo Năm (USD):</label>
                  <input
                    type="number"
                    step="1"
                    value={yearlyPrice}
                    onChange={e => setYearlyPrice(parseInt(e.target.value) || 0)}
                    className="w-full border border-slate-200 px-3 py-2 rounded-xl text-slate-900"
                  />
                </div>
              </div>

              <div className="p-3.5 bg-amber-50/55 border border-amber-100 rounded-xl flex items-start gap-2.5">
                <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-[11px] text-amber-900 font-semibold leading-relaxed">
                  Lưu ý: Thay đổi biểu giá trị thuê bao sẽ áp dụng ngay tức thì cho mọi quy trình thanh toán Stripe/Visa mới tạo trên nền tảng. Các hóa đơn cũ vẫn sẽ giữ lại giá trị ban đầu.
                </p>
              </div>

              <button
                type="button"
                onClick={() => alert("✓ Đã sao lưu cài đặt biểu phí dịch vụ NailOS thành công.")}
                className="bg-[#874C67] hover:bg-[#5a3246] text-white font-extrabold text-xs px-5 py-2.5 rounded-xl uppercase tracking-wider transition cursor-pointer"
              >
                💾 Sao lưu cài đặt
              </button>
            </div>
          </div>
        </div>
      )}

      {sysTab === "logs" && (
        <div className="bg-white rounded-3xl border border-slate-150 p-6 shadow-sm space-y-4">
          <div className="flex border-b border-slate-50 pb-3 justify-between items-center">
            <h3 className="font-display font-bold text-slate-950 text-sm">
              📜 LỊCH SỬ GIAO DỊCH SAAS & HOẠT ĐỘNG HỆ THỐNG (AUDIT TRAIL)
            </h3>
            <span className="text-[10px] font-mono font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full animate-pulse">
              ● Hệ thống giám sát trực tiếp
            </span>
          </div>

          <div className="max-h-[350px] overflow-y-auto space-y-3 font-mono text-xs text-slate-600">
            {auditLogs.map((log) => {
              let typeBadge = "bg-slate-100 text-slate-800 border-slate-200";
              if (log.type === "success") typeBadge = "bg-emerald-50 text-emerald-800 border-emerald-200";
              if (log.type === "warning") typeBadge = "bg-amber-50 text-amber-800 border-amber-200";
              if (log.type === "danger") typeBadge = "bg-rose-50 text-rose-800 border-rose-250";

              return (
                <div key={log.id} className="p-3 bg-slate-50/50 border border-slate-100 rounded-2xl flex items-start gap-3 hover:bg-slate-50 transition-all">
                  <span className={`px-2.5 py-1 rounded-lg border text-[10.5px] font-extrabold font-mono shrink-0 ${typeBadge}`}>
                    {log.type.toUpperCase()}
                  </span>
                  <div className="space-y-1">
                    <p className="text-slate-800 leading-normal font-sans font-medium">{log.event}</p>
                    <span className="text-[10px] text-slate-400 font-bold block">{log.timestamp}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* NEW TENANT REGISTER MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 max-w-lg w-full shadow-2xl relative space-y-5 animate-in zoom-in-95 duration-200">
            <div className="text-center space-y-1.5 pb-2 border-b border-slate-50">
              <h3 className="font-display text-xl font-extrabold text-slate-900">Đăng Ký Salon Mới Trên Hệ Thống SaaS</h3>
              <p className="text-xs text-slate-500">Khởi tạo dữ liệu CRM riêng biệt cho chi nhánh của bạn</p>
            </div>

            <form onSubmit={handleCreateTenantSubmit} className="space-y-4 text-xs font-semibold text-slate-600 font-sans">
              <div className="space-y-1.5">
                <label className="font-extrabold text-[#874C67] uppercase text-[10px]">Tên Hair / Nail Salon:</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Paris Nails & Lash Spa"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-extrabold text-[#874C67] uppercase text-[10px]">Tên Chủ Sở Hữu (Chủ Tiệm):</label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: Tran Chanh Trung"
                    value={newOwner}
                    onChange={e => setNewOwner(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-extrabold text-[#874C67] uppercase text-[10px]">Số điện thoại liên hệ:</label>
                  <input
                    type="tel"
                    placeholder="Ví dụ: +1 (650) 412-2900"
                    value={newPhone}
                    onChange={e => setNewPhone(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-extrabold text-[#874C67] uppercase text-[10px]">Địa chỉ email liên kết:</label>
                <input
                  type="email"
                  placeholder="Ví dụ: trung.nailos@gmail.com"
                  value={newEmail}
                  onChange={e => setNewEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-extrabold text-[#874C67] uppercase text-[10px]">Địa chỉ / Chi nhánh:</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Dallas, Texas, USA"
                  value={newLocation}
                  onChange={e => setNewLocation(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-extrabold text-[#874C67] uppercase text-[10px]">Thời Gian Khởi Thủy Dùng Thử:</label>
                <select
                  value={newTrialOffset}
                  onChange={e => setNewTrialOffset(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 bg-white focus:outline-none focus:border-brand-500 font-bold"
                >
                  <option value="0">Đăng ký mới hôm nay (Bắt đầu 90 ngày Trial miễn phí)</option>
                  <option value="45">Đã đăng ký 45 ngày trước (Còn 45 ngày Trial)</option>
                  <option value="91">Đã đăng ký 91 ngày trước (Khóa dùng thử để thử nộp phí ngay)</option>
                </select>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-brand-500 hover:bg-brand-600 text-white font-extrabold py-3 rounded-xl transition cursor-pointer"
                >
                  Khởi Tạo Cơ Sở Cửa Hàng 🚀
                </button>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl transition cursor-pointer"
                >
                  Hủy Bỏ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
