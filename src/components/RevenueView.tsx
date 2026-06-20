import React, { useState } from "react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  Legend,
  Cell
} from "recharts";
import { 
  DollarSign, 
  PiggyBank, 
  Percent, 
  Calculator, 
  CreditCard, 
  Coins, 
  Sparkles, 
  ArrowUpRight 
} from "lucide-react";
import { Booking, Staff, Transaction, ServiceRecord } from "../types";

interface RevenueViewProps {
  bookings: Booking[];
  staff: Staff[];
  transactions: Transaction[];
  onAddTransaction: (tx: Omit<Transaction, "id" | "dateTime">) => void;
  serviceRecords: ServiceRecord[];
  onPayServiceRecord: (recordId: string, paymentMethod: "Cash" | "Card" | "Apple Pay" | "Gift Card", tipAmount: number) => void;
}

export default function RevenueView({
  bookings,
  staff,
  transactions,
  onAddTransaction,
  serviceRecords,
  onPayServiceRecord
}: RevenueViewProps) {
  // Calculator Checkout state
  const [selectedStaffId, setSelectedStaffId] = useState(staff[0]?.id || "");
  const [customerName, setCustomerName] = useState("");
  const [nailCharge, setNailCharge] = useState("");
  const [tipAmount, setTipAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"Cash" | "Card" | "Apple Pay" | "Gift Card">("Card");
  const [checkoutNotice, setCheckoutNotice] = useState("");
  const [selectedRecordId, setSelectedRecordId] = useState<string>("");

  // Statistics calculation
  const totalServicesRevenue = transactions.reduce((sum, tx) => sum + tx.amount, 0);
  const totalTipsRevenue = transactions.reduce((sum, tx) => sum + tx.tipAmount, 0);

  // Compute stats per Technician
  const staffPayrollReports = staff.map(st => {
    // Find matching completed transactions for this thợ
    const staffTxs = transactions.filter(tx => tx.staffId === st.id);
    const servicesVolume = staffTxs.reduce((sum, tx) => sum + tx.amount, 0);
    const tipsVolume = staffTxs.reduce((sum, tx) => sum + tx.tipAmount, 0);
    
    const commissionEarned = Math.round(servicesVolume * st.commissionRate);
    const salonCut = servicesVolume - commissionEarned;
    const totalPayout = commissionEarned + tipsVolume;

    return {
      id: st.id,
      name: st.name,
      avatar: st.avatar,
      commissionRate: st.commissionRate,
      color: st.color,
      completedJobs: staffTxs.length,
      revenueGenerated: servicesVolume,
      tipsReceived: tipsVolume,
      commissionEarned,
      salonCut,
      totalPayout
    };
  });

  // Recharts Chart Mock Data: Weekly and category revenue
  const weeklyChartData = [
    { name: "Thứ Hai", "Doanh thu": 520, "Tiền Tips": 95, "Thợ Nhận": 360 },
    { name: "Thứ Ba", "Doanh thu": 640, "Tiền Tips": 120, "Thợ Nhận": 450 },
    { name: "Thứ Tư", "Doanh thu": 710, "Tiền Tips": 135, "Thợ Nhận": 490 },
    { name: "Thứ Năm", "Doanh thu": 850, "Tiền Tips": 160, "Thợ Nhận": 580 },
    { name: "Thứ Sáu (Hnay)", "Doanh thu": 1150, "Tiền Tips": 210, "Thợ Nhận": 790 },
    { name: "Thứ Bảy", "Doanh thu": 1320, "Tiền Tips": 250, "Thợ Nhận": 910 },
    { name: "Chủ Nhật", "Doanh thu": 980, "Tiền Tips": 180, "Thợ Nhận": 670 },
  ];

  // Service Category Breakdown chart
  const serviceBreakdownData = [
    { name: "Sơn Gel", value: 450 },
    { name: "Pedicure", value: 680 },
    { name: "Đắp Bột Acrylic", value: 890 },
    { name: "Nail Art", value: 180 },
    { name: "Waxing", value: 90 },
  ];

  const handleSelectRecordId = (recordId: string) => {
    setSelectedRecordId(recordId);
    if (!recordId) {
      setCustomerName("");
      setNailCharge("");
      return;
    }
    const record = serviceRecords.find(r => r.id === recordId);
    if (record) {
      setCustomerName(record.customerName);
      setNailCharge(record.amount.toString());
      setSelectedStaffId(record.staffId);
    }
  };

  const handleCheckoutFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const charge = parseFloat(nailCharge);
    if (isNaN(charge) || charge <= 0) return;

    const tip = parseFloat(tipAmount) || 0;

    if (selectedRecordId) {
      // It's a pre-recorded bill!
      onPayServiceRecord(selectedRecordId, paymentMethod, tip);
      const record = serviceRecords.find(r => r.id === selectedRecordId);
      const activeStaff = staff.find(st => st.id === selectedStaffId);
      setCheckoutNotice(`✔️ Đã thanh toán hoá đơn ghi nhận sẵn bới thợ ${activeStaff?.name} (Tổng cộng: $${charge})!`);
      setSelectedRecordId("");
    } else {
      // Ordinary direct checkout
      onAddTransaction({
        customerName: customerName.trim() || "Walk-In Khách Vãng Lai",
        customerId: "walk-in-guest",
        amount: charge,
        tipAmount: tip,
        paymentMethod,
        staffId: selectedStaffId
      });
      const activeStaff = staff.find(st => st.id === selectedStaffId);
      setCheckoutNotice(`✔️ Đã thanh toán hóa đơn $${charge} cho thợ ${activeStaff?.name} xong!`);
    }
    
    // Clear Input
    setCustomerName("");
    setNailCharge("");
    setTipAmount("");
    setTimeout(() => setCheckoutNotice(""), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {/* Metric 1 */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xs flex items-center justify-between">
          <div className="space-y-1.5">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider font-sans">Tổng Doanh Thu Dịch Vụ</p>
            <h3 className="text-3xl font-display font-extrabold text-slate-800">${totalServicesRevenue}</h3>
            <p className="text-xs font-semibold text-slate-500">Từ hóa đơn của CRM thực tế</p>
          </div>
          <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-brand-50 text-brand-500">
            <DollarSign className="h-5 w-5" />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xs flex items-center justify-between">
          <div className="space-y-1.5">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider font-sans">Tổng Tiền Tip (Hộp Tip)</p>
            <h3 className="text-3xl font-display font-extrabold text-[#059669]">${totalTipsRevenue}</h3>
            <p className="text-xs font-semibold text-slate-500">Thợ giữ 100% tiền tip</p>
          </div>
          <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-emerald-50 text-[#059669]">
            <PiggyBank className="h-5 w-5" />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xs flex items-center justify-between">
          <div className="space-y-1.5">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider font-sans">Phần Tiệm Giữ Lại</p>
            <h3 className="text-3xl font-display font-extrabold text-[#2563EB]">
              ${Math.round(staffPayrollReports.reduce((sum, st) => sum + st.salonCut, 0))}
            </h3>
            <p className="text-xs font-semibold text-slate-500">Sau khi đã chia 60/40 cho thợ</p>
          </div>
          <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-blue-50 text-[#2563EB]">
            <Percent className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Charts Layout section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Weekly Revenue Graph Area */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-100 bg-white p-6 shadow-xs space-y-4">
          <div>
            <h3 className="font-display text-lg font-extrabold text-slate-800">Biểu đồ Doanh Thu Tuần</h3>
            <p className="text-xs text-slate-500">Dữ liệu phân tích doanh thu tiệm so với thu nhập thực tế của thợ</p>
          </div>

          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyChartData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f7a" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#f43f7a" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorStaff" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip />
                <Legend iconType="circle" />
                <Area type="monotone" dataKey="Doanh thu" stroke="#f43f7a" fillOpacity={1} fill="url(#colorRev)" strokeWidth={2.5} />
                <Area type="monotone" dataKey="Thợ Nhận" stroke="#3b82f6" fillOpacity={1} fill="url(#colorStaff)" strokeWidth={2.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Categories breakdown via Simple Bar chart */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-xs space-y-4">
          <div>
            <h3 className="font-display text-lg font-extrabold text-slate-800">Phân Loại Dịch Vụ</h3>
            <p className="text-xs text-slate-500">Phân lượng tiền thu từ các gói làm nails</p>
          </div>

          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={serviceBreakdownData} layout="vertical">
                <XAxis type="number" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={11} tickLine={false} width={85} />
                <Tooltip />
                <Bar dataKey="value" fill="#f43f7a" radius={[0, 8, 8, 0]}>
                  {serviceBreakdownData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "#f43f7a" : "#ffa1bf"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Lower Split level: Employee Payroll Commissions list & Direct billing register */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 items-start">
        {/* Technicians Payroll report board */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-100 bg-white p-6 shadow-xs space-y-4">
          <div>
            <h3 className="font-display text-lg font-extrabold text-slate-800">Báo Cáo Chia Lương Thợ Nails (Payroll Commissions)</h3>
            <p className="text-xs text-slate-500">Dựa theo tỷ lệ phần trăm phân chi (commission 60% thợ / 40% chủ) và tip nhận</p>
          </div>

          <div className="space-y-4">
            {staffPayrollReports.map((report) => (
              <div 
                key={report.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border border-slate-50 bg-slate-50/50 hover:bg-slate-50 transition"
              >
                <div className="flex items-center gap-3.5">
                  <div className="h-10 w-10 overflow-hidden rounded-full border-2" style={{ borderColor: report.color }}>
                    <img src={report.avatar} alt={report.name} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">{report.name}</h4>
                    <p className="text-xs font-semibold text-slate-500 font-mono">
                       Commission {report.commissionRate * 100}% • {report.completedJobs} jobscompleted
                    </p>
                  </div>
                </div>

                {/* Payroll Numbers */}
                <div className="grid grid-cols-4 gap-4 text-center sm:text-right font-mono text-xs">
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase font-sans">Tiền Nails</p>
                    <p className="font-bold text-slate-850">${report.revenueGenerated}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase font-sans">Commission</p>
                    <p className="font-bold text-brand-600">${report.commissionEarned}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[#059669] font-bold uppercase font-sans">Tips</p>
                    <p className="font-bold text-[#059669]">${report.tipsReceived}</p>
                  </div>
                  <div className="bg-white border rounded-xl px-2.5 py-1.5 shadow-2xs">
                    <p className="text-[9px] text-[#2563EB] font-bold uppercase font-sans">Tổng Nhận</p>
                    <p className="font-black text-[#2563EB]">${report.totalPayout}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live register quick checkout terminal checkout */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-xs space-y-5">
          <div className="flex items-center gap-2 text-slate-700 border-b border-slate-50 pb-3">
            <Calculator className="h-5 w-5 text-brand-500" />
            <h3 className="font-display text-lg font-extrabold text-slate-800">Checkout Thanh Toán</h3>
          </div>

          <form onSubmit={handleCheckoutFormSubmit} className="space-y-4 text-xs font-medium text-slate-700">
            {checkoutNotice && (
              <div className="bg-emerald-50 text-emerald-800 font-bold border border-emerald-100 rounded-xl p-3 text-center">
                {checkoutNotice}
              </div>
            )}

            {/* Selector for Pre-recorded Unpaid Bills */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-550 uppercase block">Chọn hoá đơn đã ghi sẵn:</label>
              <select
                value={selectedRecordId}
                onChange={e => handleSelectRecordId(e.target.value)}
                className="w-full rounded-xl border border-rose-200 bg-rose-50/20 px-3 py-2 text-sm focus:outline-none text-rose-800 font-semibold"
              >
                <option value="" className="text-slate-800 font-normal">-- Tự nhập thủ công (Direct) --</option>
                {serviceRecords
                  .filter(r => r.status === "Unpaid")
                  .map(r => (
                    <option key={r.id} value={r.id} className="text-slate-800">
                      [{r.customerName}] - ${r.amount} ({r.staffName})
                    </option>
                  ))
                }
              </select>
              {selectedRecordId && (
                <p className="text-[10px] text-rose-500 font-bold">
                  🔗 Đang kết nối với phiếu ghi sẵn của thợ! Một số thông tin sẽ tự động điền.
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-550 uppercase">Tên Khách Hàng:</label>
              <input
                type="text"
                placeholder="Ví dụ: Khách Vãng Lai (Walk-in)"
                value={customerName}
                onChange={e => setCustomerName(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm focus:border-brand-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-550 uppercase">Tiền Làm Móng ($):</label>
                <input
                  type="number"
                  required
                  placeholder="Ví dụ: 45"
                  value={nailCharge}
                  onChange={e => setNailCharge(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm focus:border-brand-500 focus:outline-none font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-550 uppercase">Tiền Tip Thợ ($):</label>
                <input
                  type="number"
                  placeholder="Ví dụ: 10"
                  value={tipAmount}
                  onChange={e => setTipAmount(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm focus:border-brand-500 focus:outline-none font-mono"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-555 uppercase">Thợ Nhận Doanh số:</label>
              <select
                value={selectedStaffId}
                onChange={e => setSelectedStaffId(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm bg-white focus:outline-none"
              >
                {staff.map(st => (
                  <option key={st.id} value={st.id}>{st.name} ({st.role})</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-555 uppercase">Phương thức Trả tiền:</label>
              <div className="grid grid-cols-2 gap-2">
                {(["Card", "Cash", "Apple Pay", "Gift Card"] as const).map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setPaymentMethod(method)}
                    className={`px-3 py-2 text-xs font-bold rounded-xl border transition-all ${
                      paymentMethod === method
                        ? "bg-brand-50 border-brand-300 text-brand-600 scale-102"
                        : "bg-white border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold rounded-xl py-3 text-sm transition shadow-md active:scale-95"
            >
              In Receipt & Ghi Doanh Thu
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
