import React, { useState } from "react";
import { 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  HelpCircle, 
  FileText, 
  Download, 
  ShieldCheck, 
  AlertTriangle,
  Building2,
  Lock
} from "lucide-react";
import { Tenant } from "../types";

interface BillingViewProps {
  currentTenant: Tenant;
  onSubscribeTenant: (id: string, plan: "monthly" | "yearly") => void;
}

export default function BillingView({
  currentTenant,
  onSubscribeTenant
}: BillingViewProps) {
  // Plan selected for custom checkout simulation
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "yearly">("monthly");
  const [cardNumber, setCardNumber] = useState("4242 •••• •••• 4242");
  const [cardExpiry, setCardExpiry] = useState("12/28");
  const [cardCVC, setCardCVC] = useState("127");
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const start = new Date(currentTenant.trialStartDate);
  const now = new Date();
  const elapsedDays = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  const totalTrialDays = 90;
  const daysRemaining = Math.max(0, totalTrialDays - elapsedDays);
  const isTrialExpired = elapsedDays >= totalTrialDays && currentTenant.subscriptionStatus === "Trial";

  // Simulate payment processing
  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
      onSubscribeTenant(currentTenant.id, selectedPlan);
      setLoading(false);
      setPaymentSuccess(true);
      setTimeout(() => {
        setPaymentSuccess(false);
      }, 4050);
    }, 1500);
  };

  // Simulated invoice reports
  const mockInvoices = [
    {
      id: "INV-2026-004",
      date: "2026-06-15",
      amount: currentTenant.subscriptionStatus === "Active" ? (currentTenant.billingPlan === "monthly" ? 9.9 : 99) : 0,
      status: currentTenant.subscriptionStatus === "Active" ? "Paid" : "Pending",
      plan: currentTenant.billingPlan === "monthly" ? "Hàng tháng" : "Hàng năm",
    },
    {
      id: "INV-2026-001",
      date: currentTenant.registrationDate,
      amount: 0,
      status: "Trial active",
      plan: "Dùng thử 90 ngày",
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Visual Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <span className="text-[10px] font-extrabold uppercase bg-slate-100 border border-slate-205 px-3 py-1.5 rounded-lg text-slate-500 tracking-wider">
            💳 Cổng Đối Tác & Bản Quyền
          </span>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900 mt-2">
            Gia Hạn Bản Quyền & Hoá Đơn Salon
          </h2>
          <p className="text-xs text-slate-500 font-sans">
            Quản lý thanh toán, xem trạng thái hợp đồng sử dụng phần mềm NailOS SaaS
          </p>
        </div>
      </div>

      {/* Trial expired alert box */}
      {isTrialExpired && (
        <div className="bg-rose-50 border border-rose-200 rounded-3xl p-5 flex items-start gap-4">
          <div className="h-10 w-10 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-600 shrink-0">
            <Lock className="h-5.5 w-5.5" />
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-black text-rose-850 uppercase tracking-wider">Bản dùng thử đã hết hạn ⚠️</h4>
            <p className="text-xs text-rose-700 leading-relaxed font-semibold">
              Hiện tại tiệm <strong>{currentTenant.name}</strong> đã sử dụng quá thời gian dùng thử 90 ngày của NailOS. Để khôi phục quyền truy cập đầy đủ vào các phân hệ đặt lịch, tính lương, chấm công thợ và CRM quảng cáo, vui lòng thực hiện thanh toán kích hoạt phí ngay bên dưới!
            </p>
          </div>
        </div>
      )}

      {/* Main split grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Active Subscription Status profile */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-150 p-6 shadow-sm space-y-5">
            <h3 className="font-display text-sm font-bold text-slate-900 border-b border-slate-50 pb-3 flex items-center gap-2">
              <Building2 className="h-4.5 w-4.5 text-[#874C67]" />
              Chi tiết Đăng Ký Gói Cước
            </h3>

            <div className="space-y-4">
              <div className="flex justify-between items-center bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <span className="text-xs text-slate-500 font-semibold">Trạng thái hiện tại:</span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold font-sans ${
                  currentTenant.subscriptionStatus === "Active" 
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : isTrialExpired 
                      ? "bg-rose-50 text-rose-700 border border-rose-200 animate-pulse"
                      : "bg-blue-50 text-blue-700 border border-blue-200"
                }`}>
                  {currentTenant.subscriptionStatus === "Active" 
                    ? `Đang chạy (Gói ${currentTenant.billingPlan === "monthly" ? "Tháng" : "Năm"})`
                    : isTrialExpired 
                      ? "Đã Khóa Hết Hạn" 
                      : `Dùng thử (còn ${daysRemaining} ngày)`
                  }
                </span>
              </div>

              {/* Progress bar info for Trial */}
              {currentTenant.subscriptionStatus === "Trial" && (
                <div className="space-y-1.5 p-1 bg-slate-50/50 rounded-2xl border border-slate-100">
                  <div className="flex justify-between text-[11px] font-bold text-slate-500 px-1">
                    <span>Thời hạn dùng thử:</span>
                    <span>{elapsedDays}/90 ngày đã qua</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-300 ${
                        isTrialExpired ? "bg-rose-500" : "bg-brand-500"
                      }`}
                      style={{ width: `${Math.min(100, (elapsedDays / 90) * 100)}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 font-semibold pl-1">
                    Hệ thống tự động kích hoạt 90 ngày dùng thử đầy đủ tính năng khi lập cửa hàng mới.
                  </p>
                </div>
              )}

              {/* Text Fields details */}
              <div className="space-y-3 pt-2 text-xs font-sans text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-400 font-semibold font-sans">Mã Salon Liên Kết:</span>
                  <span className="font-mono font-bold text-slate-800">{currentTenant.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-semibold font-sans">Chi nhánh:</span>
                  <span className="font-bold text-slate-800">{currentTenant.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-semibold font-sans">Chủ sở hữu:</span>
                  <span className="font-bold text-slate-800">{currentTenant.ownerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-semibold font-sans">Email chủ tiệm:</span>
                  <span className="font-medium text-slate-700">{currentTenant.ownerEmail}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-semibold font-sans">Ngày đăng ký:</span>
                  <span className="font-mono font-bold text-slate-700">{currentTenant.registrationDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-semibold font-sans">Kỳ thanh toán tới:</span>
                  <span className="font-mono font-bold text-emerald-600">
                    {new Date(new Date(currentTenant.trialStartDate).getTime() + 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Secure Credit Card Stripe Simulation */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-150 p-6 shadow-sm space-y-5">
            <h3 className="font-display text-sm font-bold text-slate-900 border-b border-slate-50 pb-3 flex items-center gap-2">
              <CreditCard className="h-4.5 w-4.5 text-slate-700" />
              Cổng Kênh Đóng Phí Bản Quyền (Visa, Master, Stripe)
            </h3>

            {/* Payment success alert */}
            {paymentSuccess && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl p-4 text-xs font-bold flex items-center gap-2.5 animate-bounce">
                <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0" />
                <span>🎉 Đóng phí kích hoạt gia hạn thành công! Phần mềm đã gia hạn kỳ sử dụng tự động.</span>
              </div>
            )}

            <form onSubmit={handlePaymentSubmit} className="space-y-4 text-xs font-semibold text-slate-600 font-sans">
              
              {/* Plan Picker cards */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-450 uppercase font-black block">Chọn gói gia hạn dịch vụ:</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedPlan("monthly")}
                    className={`p-4 rounded-2xl border text-left transition relative flex flex-col justify-between ${
                      selectedPlan === "monthly" 
                        ? "border-[#874C67] bg-[#874C67]/5 ring-1 ring-[#874C67] text-slate-900" 
                        : "border-slate-150 bg-white text-slate-500 hover:border-slate-350"
                    }`}
                  >
                    <div>
                      <h4 className="text-xs font-bold text-slate-950">Gói Tháng Tiêu Chuẩn</h4>
                      <p className="text-[10px] text-slate-400 mt-1">Duy trì và backup dữ liệu hàng tháng</p>
                    </div>
                    <div className="text-xl font-black text-[#874C67] mt-3">
                      $9.9 <span className="text-[10px] font-bold text-slate-400">/tháng</span>
                    </div>
                    {selectedPlan === "monthly" && (
                      <CheckCircle2 className="h-4 w-4 text-[#874C67] absolute top-4 right-4" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedPlan("yearly")}
                    className={`p-4 rounded-2xl border text-left transition relative flex flex-col justify-between ${
                      selectedPlan === "yearly" 
                        ? "border-[#874C67] bg-[#874C67]/5 ring-1 ring-[#874C67] text-slate-900" 
                        : "border-slate-150 bg-white text-slate-500 hover:border-slate-350"
                    }`}
                  >
                    <div>
                      <h4 className="text-xs font-bold text-slate-950">Gói Năm Khuyên Dùng 🔥</h4>
                      <p className="text-[10px] text-slate-400 mt-1">Tiết kiệm 17% ngân sách vận hành</p>
                    </div>
                    <div className="text-xl font-black text-[#874C67] mt-3">
                      $99 <span className="text-[10px] font-bold text-slate-400">/năm</span>
                    </div>
                    {selectedPlan === "yearly" && (
                      <CheckCircle2 className="h-4 w-4 text-[#874C67] absolute top-4 right-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Payment inputs fields */}
              <div className="p-4 bg-slate-50 border border-slate-150 rounded-2xl space-y-3">
                <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">🔒 Thẻ Kết Nối Bảo mật Stripe:</span>
                
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 block">SỐ THẺ THANH TOÁN (CREDIT CARD NUMBER):</label>
                  <input
                    type="text"
                    required
                    value={cardNumber}
                    onChange={e => setCardNumber(e.target.value)}
                    className="w-full bg-white border border-slate-200 px-3.5 py-2.5 rounded-xl font-mono focus:outline-none focus:border-brand-500 font-bold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 block">THỜI HẠN (MM/YY):</label>
                    <input
                      type="text"
                      required
                      value={cardExpiry}
                      onChange={e => setCardExpiry(e.target.value)}
                      className="w-full bg-white border border-slate-200 px-3.5 py-2.5 rounded-xl font-mono focus:outline-none focus:border-brand-500 font-bold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 block">MÃ CVC / CVV:</label>
                    <input
                      type="text"
                      required
                      value={cardCVC}
                      onChange={e => setCardCVC(e.target.value)}
                      className="w-full bg-white border border-slate-200 px-3.5 py-2.5 rounded-xl font-mono focus:outline-none focus:border-brand-500 font-bold"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#874C67] hover:bg-[#5a3246] disabled:bg-slate-400 text-white font-extrabold rounded-xl py-3.5 text-xs tracking-wider transition-all cursor-pointer shadow-md uppercase"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-1.5">
                    <Clock className="h-4.5 w-4.5 animate-spin" /> THỰC THI CHUYỂN TIỀN SANDBOX...
                  </span>
                ) : (
                  <span>💳 Xác Nhận Gia Hạn • ${selectedPlan === "monthly" ? "9.9" : "99"}</span>
                )}
              </button>
            </form>
          </div>
        </div>

      </div>

      {/* Invoice Records Block */}
      <div className="bg-white rounded-3xl border border-slate-150 p-6 shadow-sm space-y-4">
        <h3 className="font-display text-sm font-bold text-slate-900 border-b border-slate-50 pb-3 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <FileText className="h-4.5 w-4.5 text-[#874C67]" />
            Lịch Sử Hóa Đơn Đóng Phí Bản Quyền ({mockInvoices.length})
          </span>
          <span className="text-[10px] text-slate-400">Tự động kết xuất sao kê</span>
        </h3>

        <div className="overflow-x-auto text-xs">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 text-left font-bold font-sans">
                <th className="py-2.5 px-3">Mã Hóa Đơn</th>
                <th className="py-2.5 px-3">Ngày Lập</th>
                <th className="py-2.5 px-3">Sản phẩm / Plan</th>
                <th className="py-2.5 px-3">Số tiền</th>
                <th className="py-2.5 px-3">Trạng thái</th>
                <th className="py-2.5 px-3 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {mockInvoices.map((inv) => (
                <tr key={inv.id} className="border-b border-slate-100 text-slate-700 hover:bg-slate-50">
                  <td className="py-3 px-3 font-mono font-bold text-slate-900">{inv.id}</td>
                  <td className="py-3 px-3 font-mono text-slate-500">{inv.date}</td>
                  <td className="py-3 px-3 font-semibold text-slate-850">{inv.plan}</td>
                  <td className="py-3 px-3 font-mono font-bold text-slate-900">${inv.amount}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      inv.status === "Paid" 
                        ? "bg-emerald-50 text-emerald-700" 
                        : "bg-blue-50 text-blue-700"
                    }`}>
                      {inv.status === "Paid" ? "Đã Thanh Toán ✓" : "Kích hoạt Thử Nghiệm ✓"}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => alert(`Simulated Invoice PDF download for ${inv.id}`)}
                      className="text-[#874C67] hover:bg-[#874C67]/10 p-1.5 rounded-lg transition-all"
                      title="Tải hóa đơn VAT (PDF)"
                    >
                      <Download className="h-4 w-4 inline" /> Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
