import React, { useState } from "react";
import { 
  Gift, 
  MessageSquare, 
  Plus, 
  Send, 
  History, 
  Sliders, 
  Mail, 
  Smartphone,
  Sparkles,
  CheckCircle2,
  Trash2,
  Ticket
} from "lucide-react";
import { Customer, Coupon, SMSLog } from "../types";

interface LoyaltySMSViewProps {
  customers: Customer[];
  coupons: Coupon[];
  smsLogs: SMSLog[];
  onAddCoupon: (coupon: Omit<Coupon, "id" | "active">) => void;
  onDeleteCoupon: (couponId: string) => void;
  onSendSimulatedSMS: (log: Omit<SMSLog, "id" | "sentAt" | "status">) => Promise<boolean>;
}

export default function LoyaltySMSView({
  customers,
  coupons,
  smsLogs,
  onAddCoupon,
  onDeleteCoupon,
  onSendSimulatedSMS
}: LoyaltySMSViewProps) {
  // Coupon Form state
  const [couponCode, setCouponCode] = useState("");
  const [discountType, setDiscountType] = useState<"Percent" | "Fixed">("Percent");
  const [discountValue, setDiscountValue] = useState("");
  const [minSpend, setMinSpend] = useState("");
  const [expiryDate, setExpiryDate] = useState("2026-08-31");
  const [couponNotice, setCouponNotice] = useState("");

  // SMS Form state
  const [selectedSMSCampaign, setSelectedSMSCampaign] = useState<string>("Booking Confirmed");
  const [selectedRecipientId, setSelectedRecipientId] = useState<string>(customers[0]?.id || "");
  const [customSMSBody, setCustomSMSBody] = useState("");
  const [isSendingSMSMsg, setIsSendingSMSMsg] = useState(false);
  const [smsNotice, setSmsNotice] = useState("");

  // Pre-configured campaigns messages templates
  const CAMPAIGN_TEMPLATES: Record<string, string> = {
    "Booking Confirmed": "Chào {{customer_name}}, lịch hẹn của bạn cho dịch vụ {{service}} vào {{time}} đã được đặt thành công! Gặp bạn tại NailOS Salon. ĐT: +1 (650) 441-2091.",
    "Reminder 24h": "Hi {{customer_name}}, mến nhắc bạn cuộc hẹn nails lúc {{time}} ngày mai. Vui lòng phản hồi 'C' để xác nhận hoặc gọị điện dời lịch hẹn. NailOS Salon.",
    "Miss You Offer": "Chào {{customer_name}}, tiệm nhớ bạn quá! Đã lâu tiệm chưa được làm móng cho bạn. Nhập mã {{coupon_code}} giảm ngay $10 cho lần ghé tiếp theo. Đặt lịch tại: simplebook.ly/nailos",
    "Birthday Wish": "Chúc mừng Sinh Nhật {{customer_name}}! NailOS Salon thân gửi mã tặng voucher giảm {{discount}}% cho dịch vụ bạn làm trong cả tuần này! Code: {{coupon_code}}.",
    "Promotion": "ƯU ĐÃI HÈ: Giảm {{discount}}% dịch vụ Pedicure Organic & Gel Mani thạch đào cho móng tay thêm rực rỡ! Đặt chỗ hôm nay qua code {{coupon_code}}."
  };

  const currentTemplate = CAMPAIGN_TEMPLATES[selectedSMSCampaign] || "";

  // Compile prompt placeholders dynamically based on selector variables
  const compileSMSMessage = (template: string) => {
    const cust = customers.find(c => c.id === selectedRecipientId) || customers[0];
    if (!cust) return template;

    let res = template
      .replace(/{{customer_name}}/g, cust.name)
      .replace(/{{service}}/g, "Premium Gel Manicure")
      .replace(/{{time}}/g, "10:30 AM Thứ Sáu")
      .replace(/{{coupon_code}}/g, coupons[0]?.code || "WELCOME10")
      .replace(/{{discount}}/g, coupons[0]?.discountType === "Percent" ? coupons[0].discountValue.toString() : "10");

    return res;
  };

  const handleCreateCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim() || !discountValue) return;

    onAddCoupon({
      code: couponCode.trim().toUpperCase(),
      discountType,
      discountValue: parseInt(discountValue) || 10,
      minSpend: parseInt(minSpend) || 0,
      expiryDate,
    });

    setCouponCode("");
    setDiscountValue("");
    setMinSpend("");
    setCouponNotice("✔️ Đã tạo code voucher thành công!");
    setTimeout(() => setCouponNotice(""), 3000);
  };

  const handleTriggerSMSSendSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const recipient = customers.find(c => c.id === selectedRecipientId);
    if (!recipient) return;

    const finalMsg = customSMSBody || compileSMSMessage(currentTemplate);
    setIsSendingSMSMsg(true);

    const success = await onSendSimulatedSMS({
      customerName: recipient.name,
      phone: recipient.phone,
      type: selectedSMSCampaign as any,
      message: finalMsg
    });

    setIsSendingSMSMsg(false);
    if (success) {
      setSmsNotice(`🎉 Đã bắn tin SMS tới ${recipient.name} (${recipient.phone}) thành công!`);
      setCustomSMSBody(""); // Clear custom edits
      setTimeout(() => setSmsNotice(""), 4000);
    } else {
      setSmsNotice(`❌ Gửi SMS thất bại. Kiểm tra lại kết nối.`);
      setTimeout(() => setSmsNotice(""), 4000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Visual Header */}
      <div>
        <h2 className="font-display text-2xl font-extrabold text-slate-800">Loyalty & SMS Marketing</h2>
        <p className="text-sm text-slate-500">
          Chương trình chăm sóc khách quen tự động, kích cầu quay lại và quản lý mã giảm giá Coupon
        </p>
      </div>

      {/* Main double column layouts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 items-start">
        {/* Left Side: SMS Automatic Campaigns Launcher */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-50 pb-3 text-slate-850">
              <Smartphone className="h-5 w-5 text-brand-500" />
              <h3 className="font-display text-lg font-extrabold">SMS Marketing Automation</h3>
            </div>

            <form onSubmit={handleTriggerSMSSendSubmit} className="space-y-4 text-xs font-semibold text-slate-700">
              {smsNotice && (
                <div className={`p-3 text-center rounded-xl font-bold ${
                  smsNotice.startsWith("❌") ? "bg-rose-50 text-rose-800 border border-rose-100" : "bg-emerald-50 text-emerald-800 border border-emerald-100"
                }`}>
                  {smsNotice}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Choose Trigger Template Campaign */}
                <div className="space-y-1.5">
                  <label className="text-slate-500 uppercase font-mono">1. Kịch Bản Gửi (Template):</label>
                  <select
                    value={selectedSMSCampaign}
                    onChange={(e) => {
                      setSelectedSMSCampaign(e.target.value);
                      setCustomSMSBody(""); // Reset edits
                    }}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm bg-white focus:outline-none"
                  >
                    <option value="Booking Confirmed">Xác Nhận Lịch Hẹn (Booking Confirmed)</option>
                    <option value="Reminder 24h">Nhắc lịch 24 Giờ Trước (24h Reminder)</option>
                    <option value="Miss You Offer">Khách Quay Lại (Miss You Co-offer)</option>
                    <option value="Birthday Wish">Chúc mừng Sinh Nhật Khách (Birthday Wish)</option>
                    <option value="Promotion">Khuyến mãi Quảng bá hè (Summer Promo)</option>
                  </select>
                </div>

                {/* Choose Recipient Customer */}
                <div className="space-y-1.5">
                  <label className="text-slate-500 uppercase font-mono">2. Chọn Người Nhận (CRM Target):</label>
                  <select
                    value={selectedRecipientId}
                    onChange={(e) => setSelectedRecipientId(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm bg-white focus:outline-none"
                  >
                    {customers.map(c => (
                      <option key={c.id} value={c.id}>{c.name} ({c.phone} - {c.tier})</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Message preview block with dynamically compiled data placeholder templates */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-slate-500 uppercase font-mono">3. Nội dung chuẩn bị soạn gửi (SMS Box Preview):</label>
                  <span className="text-[10px] text-brand-500 font-mono flex items-center gap-0.5">
                    <Sparkles className="h-3.5 w-3.5" /> Biên tập tự động biến số
                  </span>
                </div>

                <div className="relative">
                  <textarea
                    value={customSMSBody || compileSMSMessage(currentTemplate)}
                    onChange={(e) => setCustomSMSBody(e.target.value)}
                    rows={4}
                    maxLength={160}
                    className="w-full p-4 text-xs font-mono border border-slate-200 focus:border-brand-500 rounded-2xl focus:outline-none"
                  />
                  <span className="absolute bottom-2.5 right-3 text-[10px] font-bold text-slate-400 font-mono">
                    {customSMSBody ? customSMSBody.length : compileSMSMessage(currentTemplate).length}/160 ký tự 
                  </span>
                </div>
                <p className="text-[10pt] text-slate-400 font-sans mt-0.5 font-normal">
                  Chế độ sandbox mô phỏng đầu số nhắn tin ngắn của nhà mạng Mỹ Twilio. Toàn bộ tin sẽ được lưu vết xuống logs gửi lịch sử.
                </p>
              </div>

              <button
                type="submit"
                disabled={isSendingSMSMsg}
                className="w-full bg-slate-900 border hover:bg-slate-800 disabled:bg-slate-350 text-white font-extrabold rounded-xl py-3 text-sm transition flex items-center justify-center gap-1.5 shadow"
              >
                <Send className="h-4 w-4" /> {isSendingSMSMsg ? "Đang phát sóng tin..." : "Nhấn để Nhắn Tin SMS"}
              </button>
            </form>
          </div>

          {/* Historical Logs Sent box */}
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-slate-850">
              <History className="h-5 w-5 text-slate-400" />
              <h3 className="font-display text-lg font-extrabold">Nhật Ký Chiến Dịch SMS Sent Logs</h3>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-50">
              <table className="w-full text-left text-[11px] font-medium text-slate-750">
                <thead>
                  <tr className="bg-slate-50 font-mono font-bold text-slate-450 uppercase text-[9px] tracking-wider border-b border-slate-150">
                    <th className="p-3">Khách Nhận</th>
                    <th className="p-3">Loại Tin</th>
                    <th className="p-3">Nội Dung</th>
                    <th className="p-3">Trạng thái (Twilio)</th>
                    <th className="p-3 text-right">Giờ Phát</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-slate-700">
                  {smsLogs.map((log) => {
                    const [, time] = log.sentAt.split("T");
                    const timeStr = time.substring(0, 5);
                    return (
                      <tr key={log.id} className="hover:bg-slate-50/50 transition">
                        <td className="p-3">
                          <p className="font-bold text-slate-800">{log.customerName}</p>
                          <p className="text-[9px] text-slate-400 font-mono">{log.phone}</p>
                        </td>
                        <td className="p-3">
                          <span className="font-semibold bg-slate-100 px-1.5 py-0.5 rounded-md text-[10px] text-slate-600 inline-block font-sans whitespace-nowrap">
                            {log.type}
                          </span>
                        </td>
                        <td className="p-3 text-slate-500 max-w-xs truncate" title={log.message}>{log.message}</td>
                        <td className="p-3">
                          <span className="inline-flex items-center gap-0.5 bg-emerald-50 text-emerald-700 font-bold px-1.5 py-0.5 rounded-full text-[9px] border border-emerald-100">
                            Sent ✓
                          </span>
                        </td>
                        <td className="p-3 text-right font-mono text-slate-400">{timeStr}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Side: Coupons & Discount Manager panel */}
        <div className="space-y-6">
          {/* Points Rules Info box */}
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-slate-850">
              <Gift className="h-5 w-5 text-brand-500" />
              <h3 className="font-display font-extrabold text-sm uppercase tracking-wide">Chế độ Thân Thiết Loyalty Rules</h3>
            </div>
            
            <div className="space-y-3.5 text-xs text-slate-600">
              <p className="leading-relaxed">Cơ chế quy điểm tự động tăng hạng cho Salon:</p>
              <ul className="space-y-2 font-semibold">
                <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 bg-brand-500 rounded-full" /> 1 USD Chi Tiêu = 1 Point</li>
                <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 bg-slate-400 rounded-full" /> Hạng Silver = 100-300 Points</li>
                <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 bg-amber-500 rounded-full" /> Hạng Gold = 300-800 Points</li>
                <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 bg-slate-900 rounded-full" /> Hạng Platinum = 800+ Points</li>
              </ul>
              <div className="bg-slate-50 rounded-xl p-3 leading-tight font-sans italic text-[11px]">
                💡 Khi thợ nails đánh trạng thái Completed cho đặt lịch móng, hệ thống cộng điểm tích lũy ngay cho khách hàng.
              </div>
            </div>
          </div>

          {/* Create Vouchers / Code Manager block */}
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-slate-850">
              <Ticket className="h-5 w-5 text-brand-500" />
              <h3 className="font-display font-extrabold text-sm uppercase tracking-wide">Quản Lý Mã Giảm Giá</h3>
            </div>

            {couponNotice && (
              <div className="p-2.5 text-center bg-emerald-50 text-emerald-800 font-bold border border-emerald-100 rounded-xl text-xs">
                {couponNotice}
              </div>
            )}

            <form onSubmit={handleCreateCouponSubmit} className="space-y-3 text-xs font-medium text-slate-700">
              <div className="space-y-1">
                <label className="font-bold text-slate-450 uppercase">Mã Code:</label>
                <input
                  type="text"
                  required
                  placeholder="Vd: SUMMER40OFF"
                  value={couponCode}
                  onChange={e => setCouponCode(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-1.5 focus:outline-none focus:border-brand-500 uppercase font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="font-bold text-slate-450 uppercase">Kiểu Giảm:</label>
                  <select
                    value={discountType}
                    onChange={e => setDiscountType(e.target.value as any)}
                    className="w-full rounded-xl border border-slate-200 px-2 py-1.5 bg-white focus:outline-none focus:border-brand-500"
                  >
                    <option value="Percent">Phần trăm (%)</option>
                    <option value="Fixed">Số tiền cố định ($)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-450 uppercase">Trị giá Giảm:</label>
                  <input
                    type="number"
                    required
                    placeholder="Vd: 15"
                    value={discountValue}
                    onChange={e => setDiscountValue(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-1.5 focus:outline-none focus:border-brand-500 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-450 uppercase">Hóa đơn tối thiểu để áp dụng ($):</label>
                <input
                  type="number"
                  placeholder="Vd: 30 (bỏ trống = 0)"
                  value={minSpend}
                  onChange={e => setMinSpend(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-1.5 focus:outline-none focus:border-brand-500 font-mono"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold rounded-xl py-2.5 transition"
              >
                Tạo Voucher Mới
              </button>
            </form>

            <div className="pt-3 border-t border-slate-50 space-y-2">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Danh sách Code Hoạt động:</p>
              <div className="space-y-2 max-h-44 overflow-y-auto">
                {coupons.map((cp) => (
                  <div key={cp.id} className="flex justify-between items-center bg-slate-50 rounded-xl p-2.5 border border-slate-100">
                    <div>
                      <span className="font-mono font-bold text-xs bg-white px-2 py-0.5 border rounded-md text-slate-800 tracking-wider">
                        {cp.code}
                      </span>
                      <p className="text-[10px] text-slate-500 mt-1">
                        Giảm {cp.discountValue}{cp.discountType === "Percent" ? "%" : "$"} (Min ${cp.minSpend})
                      </p>
                    </div>
                    <button
                      onClick={() => onDeleteCoupon(cp.id)}
                      className="text-slate-400 hover:text-rose-600 transition p-1"
                    >
                      <Trash2 className="h-4.5 w-4.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
