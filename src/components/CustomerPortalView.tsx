import React, { useState } from "react";
import { 
  Sparkles, 
  Search, 
  Calendar, 
  Heart, 
  Gift, 
  Star, 
  UserCheck, 
  ChevronRight, 
  Phone, 
  Clock, 
  DollarSign, 
  Copy, 
  MessageSquare,
  ThumbsUp,
  Tag,
  MapPin,
  Compass,
  ArrowRight,
  ShieldCheck,
  Award,
  Trash2,
  ShieldAlert,
  Info
} from "lucide-react";
import { Service, Staff, Customer, Coupon, Booking, Tenant } from "../types";
import IntroView from "./IntroView";

interface CustomerPortalViewProps {
  currentTenant: Tenant;
  services: Service[];
  staff: Staff[];
  customers: Customer[];
  coupons: Coupon[];
  onAddBooking: (booking: Omit<Booking, "id">) => void;
  onAddCustomer: (customer: Omit<Customer, "id" | "points" | "tier" | "visitCount" | "totalSpent">) => void;
  onDeleteCustomer: (customerId: string) => void;
}

export default function CustomerPortalView({
  currentTenant,
  services,
  staff,
  customers,
  coupons,
  onAddBooking,
  onAddCustomer,
  onDeleteCustomer
}: CustomerPortalViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<"intro" | "menu" | "loyalty" | "coupons" | "review" | "register" | "compliance">("intro");

  // 4. Registration states
  const [regPhone, setRegPhone] = useState("");
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regAddress, setRegAddress] = useState("");
  const [regBirthday, setRegBirthday] = useState("1995-01-01");
  const [regSuccess, setRegSuccess] = useState("");
  const [regError, setRegError] = useState("");

  // GDPR Compliance deletion states
  const [delPhone, setDelPhone] = useState("");
  const [foundCustomerDel, setFoundCustomerDel] = useState<any | null>(null);
  const [delSuccess, setDelSuccess] = useState("");
  const [delError, setDelError] = useState("");

  const handleVerifyDeletePhone = (e: React.FormEvent) => {
    e.preventDefault();
    setDelError("");
    setDelSuccess("");
    setFoundCustomerDel(null);

    const checkPhone = delPhone.replace(/[^0-9]/g, "");
    if (!checkPhone) {
      setDelError("❌ Vui lòng nhập số điện thoại hợp lệ!");
      return;
    }

    const match = customers.find(c => c.phone.replace(/[^0-9]/g, "") === checkPhone);
    if (!match) {
      setDelError("❌ Không tìm thấy hồ sơ thành viên nào khớp với số điện thoại này!");
    } else {
      setFoundCustomerDel(match);
    }
  };

  const handleExecuteDeleteAccount = (customerId: string) => {
    onDeleteCustomer(customerId);
    setDelSuccess("🎉 Đã thực hiện xóa vĩnh viễn tài khoản thành công! Toàn bộ điểm tích lũy và thông tin cá nhân của bạn đã được xóa khỏi cơ sở dữ liệu Dallas Nails CRM.");
    setFoundCustomerDel(null);
    setDelPhone("");
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError("");
    setRegSuccess("");

    if (!regName.trim() || !regPhone.trim()) {
      setRegError("❌ Vui lòng điền họ tên và số điện thoại!");
      return;
    }

    // Check if phone already exists
    const normalizedPhone = regPhone.replace(/[^0-9]/g, "");
    if (!normalizedPhone) {
      setRegError("❌ Số điện thoại không hợp lệ!");
      return;
    }
    
    const exists = customers.some(c => c.phone.replace(/[^0-9]/g, "") === normalizedPhone);
    if (exists) {
      setRegError("❌ Số điện thoại này đã được đăng ký thành viên trước đây! Bạn có thể quay lại tab Loyalty để tra cứu điểm.");
      return;
    }

    // Call onAddCustomer to save
    onAddCustomer({
      name: regName.trim(),
      phone: regPhone.trim(),
      email: regEmail.trim() || "member@example.com",
      address: regAddress.trim() || undefined,
      birthday: regBirthday,
      notes: "Đăng ký trực tuyến bởi Khách hàng",
      lastVisitDate: new Date().toISOString().split("T")[0]
    });

    setRegSuccess(`🎉 Chúc mừng ${regName.trim()} đã đăng ký thành viên Dallas Nails thành công! Bạn nhận được ngay 50 điểm tích lũy chào mừng.`);
    
    // Clear registration fields
    setRegName("");
    setRegPhone("");
    setRegEmail("");
    setRegAddress("");
    setRegBirthday("1995-01-01");
  };

  // 1. Online Booking modal state
  const [bookModalOpen, setBookModalOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState(services[0]?.id || "");
  const [selectedStaffId, setSelectedStaffId] = useState(staff[0]?.id || "");
  const [bookingDate, setBookingDate] = useState("2026-06-20");
  const [bookingTime, setBookingTime] = useState("10:00");
  const [custName, setCustName] = useState("");
  const [custPhone, setCustPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [bookSuccess, setBookSuccess] = useState("");

  // 2. Loyalty lookup state
  const [lookupPhone, setLookupPhone] = useState("");
  const [foundCustomer, setFoundCustomer] = useState<Customer | null>(null);
  const [lookupError, setLookupError] = useState("");

  // 3. Review state
  const [reviewStaffId, setReviewStaffId] = useState(staff[0]?.id || "");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState("");

  // Category tags
  const [selectedCat, setSelectedCat] = useState("Tất Cả");
  const categories = ["Tất Cả", "Gel", "Pedicure", "Acrylic", "Nail Art", "Waxing", "Other"];

  // Handle Online booking submit
  const handleOnlineBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!custName.trim() || !custPhone.trim()) {
      alert("Vui lòng nhập tên và SĐT của bạn!");
      return;
    }

    const srv = services.find(s => s.id === selectedServiceId);
    const stf = staff.find(st => st.id === selectedStaffId);

    if (!srv || !stf) return;

    // Check if this phone exists in customers. If not, auto-create a loyalty account!
    let customerId = "custom-guest";
    const existing = customers.find(c => c.phone.replace(/[^0-9]/g, "") === custPhone.replace(/[^0-9]/g, ""));
    
    if (existing) {
      customerId = existing.id;
    } else {
      // Create a temporary guest account on booking completion or register them
      customerId = "custom-guest";
    }

    onAddBooking({
      customerId,
      customerName: custName.trim(),
      customerPhone: custPhone.trim(),
      serviceId: srv.id,
      serviceName: srv.name,
      staffId: stf.id,
      staffName: stf.name,
      dateTime: `${bookingDate}T${bookingTime}:00`,
      status: "Pending", // Online bookings start as Pending for the store to confirm
      price: srv.price,
      notes: notes.trim() || undefined
    });

    setBookSuccess(`🎉 Đặt lịch thành công! Dallas Salon đã ghi nhận lịch hẹn lúc ${bookingTime} ngày ${bookingDate}. Chúng tôi sẽ gửi tin nhắn SMS xác nhận.`);
    setTimeout(() => {
      setBookSuccess("");
      setBookModalOpen(false);
      setCustName("");
      setCustPhone("");
      setNotes("");
    }, 4500);
  };

  // Handle Loyalty Lookup
  const handleLoyaltyLookup = (e: React.FormEvent) => {
    e.preventDefault();
    setFoundCustomer(null);
    setLookupError("");

    if (!lookupPhone.trim()) return;

    const normalizedSearch = lookupPhone.replace(/[^0-9]/g, "");
    const client = customers.find(c => c.phone.replace(/[^0-9]/g, "") === normalizedSearch);

    if (client) {
      setFoundCustomer(client);
    } else {
      setLookupError("❌ Không tìm thấy số điện thoại thành viên này trong CRM. Hãy thử kiểm tra lại số!");
    }
  };

  // Handle Submit Review
  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const stf = staff.find(st => st.id === reviewStaffId);
    if (!stf) return;

    setReviewSuccess(`💖 Cảm ơn đánh giá ${reviewRating} Sao của bạn dành cho thợ ${stf.name}! Sự hài lòng của bạn là động lực của chúng tôi.`);
    setTimeout(() => {
      setReviewSuccess("");
      setReviewComment("");
    }, 4000);
  };

  // Filter products by tag
  const filteredServices = services.filter(s => {
    if (selectedCat === "Tất Cả") return true;
    return s.category === selectedCat;
  });

  // Calculate tier points progression
  const getPointsProgress = (points: number, tier: string) => {
    if (tier === "Platinum") return 100;
    if (tier === "Gold") return ((points - 300) / 500) * 100;
    if (tier === "Silver") return ((points - 100) / 200) * 100;
    return (points / 100) * 100;
  };

  const getNextTier = (tier: string) => {
    if (tier === "Platinum") return "Max Tier";
    if (tier === "Gold") return "Platinum (800 điểm)";
    if (tier === "Silver") return "Gold (300 điểm)";
    return "Silver (100 điểm)";
  };

  return (
    <div className="space-y-6">
      {/* Visual Portal Banner */}
      <div className="bg-gradient-to-r from-[#4E2D3E] via-[#874C67] to-[#4E2D3E] text-white rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none">
          <Compass className="h-64 w-64 -mr-10 -mt-10" />
        </div>
        
        <div className="space-y-3 max-w-xl z-10">
          <span className="flex items-center gap-1.5 text-xs font-bold text-brand-200 tracking-widest uppercase">
            <Sparkles className="h-4 w-4 animate-spin-slow text-gold-200" /> LUXE BEAUTY CLIENT PORTAL
          </span>
          <h2 className="font-display text-2xl sm:text-4xl font-semibold tracking-tight text-[#FFF0F4]">
            Dallas Luxury Salon & Spa ✨
          </h2>
          <p className="text-sm font-medium text-slate-100 leading-relaxed font-sans">
            Trải nghiệm dịch vụ làm móng Luxury, đắp bột và chăm sóc massage organic chuẩn Mỹ. Tích lũy điểm nhận thưởng hấp dẫn cho mỗi lần ghé thăm!
          </p>
          <div className="flex flex-wrap gap-2 pt-2 text-[10px] sm:text-xs">
            <span className="bg-white/10 px-3 py-1 rounded-full border border-white/5">📍 Dallas, TX 75201</span>
            <span className="bg-white/10 px-3 py-1 rounded-full border border-white/5">📞 +1 (408) 555-0100</span>
            <span className="bg-white/10 px-3 py-1 rounded-full border border-white/5">⭐️ Rate: 4.9/5 ★</span>
          </div>
        </div>

        <div className="shrink-0 flex flex-col gap-3 z-10 self-start md:self-auto">
          <button
            onClick={() => setBookModalOpen(true)}
            className="rounded-full bg-gold-200 text-gold-600 hover:bg-gold-100 font-extrabold px-6 py-3.5 text-xs tracking-wider transition hover:scale-105 active:scale-95 shadow-lg flex items-center gap-2"
          >
            <Calendar className="h-4 w-4" /> ĐẶT LỊCH HẸN ONLINE
          </button>
        </div>
      </div>

      {/* Sub Tabs Selection menu */}
      <div className="flex border-b border-pink-100 gap-1 overflow-x-auto pb-px">
        {[
          { id: "intro", label: "✨ Giới thiệu", icon: Compass },
          { id: "menu", label: "💅 Bảng giá & Combo", icon: Sparkles },
          { id: "loyalty", label: "💎 Điểm thưởng Loyalty", icon: Award },
          { id: "coupons", label: "🎁 Ưu đãi & Voucher", icon: Tag },
          { id: "review", label: "✍️ Đánh giá Thợ", icon: MessageSquare },
          { id: "register", label: "📝 Đăng ký Thành viên", icon: UserCheck },
          { id: "compliance", label: "🛡️ Quyền riêng tư & Store Options", icon: ShieldCheck }
        ].map((sub) => (
          <button
            key={sub.id}
            onClick={() => setActiveSubTab(sub.id as any)}
            className={`px-5 py-3 text-xs font-extrabold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
              activeSubTab === sub.id
                ? "border-[#874C67] text-[#874C67] font-semibold"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <sub.icon className="h-4 w-4" /> {sub.label}
          </button>
        ))}
      </div>

      {/* RENDER VIEW ACCORDING TO PORTAL SUB-TAB */}
      {activeSubTab === "intro" && (
        <IntroView 
          currentTenant={currentTenant}
          services={services}
          staff={staff}
          onBookNow={() => {
            setBookModalOpen(true);
          }}
        />
      )}

      {activeSubTab === "menu" && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h3 className="font-display text-xl font-bold text-slate-900">Bảng Giá Trực Tuyến</h3>
              <p className="text-xs text-slate-500 mt-1">
                Tất cả dịch vụ đều đi kèm gói ngâm chân muối khoáng hồng Himalaya và massage tinh dầu nhẹ dịu.
              </p>
            </div>

            {/* Category selection bar */}
            <div className="flex flex-wrap gap-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCat(cat)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-full border transition-all ${
                    selectedCat === cat
                      ? "bg-[#874C67] border-[#874C67] text-white"
                      : "border-slate-150 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {cat === "Tất Cả" ? "Tất cả" : cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredServices.map((srv) => (
              <div 
                key={srv.id} 
                className="bg-white p-5 rounded-2xl border border-slate-100 hover:border-pink-200 hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start gap-4">
                    <span className="bg-slate-50 text-slate-500 text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                      {srv.category}
                    </span>
                    <span className="font-display font-extrabold text-[#874C67] text-lg">${srv.price}</span>
                  </div>
                  <h4 className="font-bold text-slate-850 text-base mt-2">{srv.name}</h4>
                  <p className="text-slate-500 text-xs font-medium leading-relaxed mt-1.5">
                    Liệu trình móng cao cấp chuẩn y khoa. Sơn màu gel bền lâu bảo hành hoàn toàn miễn phí lên đến 7 ngày dặm màu.
                  </p>
                </div>

                <div className="mt-5 pt-3.5 border-t border-slate-50 flex items-center justify-between text-xs font-bold text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-slate-300" /> {srv.durationMinutes} phút
                  </span>
                  <button
                    onClick={() => {
                      setSelectedServiceId(srv.id);
                      setBookModalOpen(true);
                    }}
                    className="text-[#874C67] hover:text-[#5e3247] flex items-center gap-1 hover:underline"
                  >
                    Bắt đầu đặt <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSubTab === "loyalty" && (
        <div className="max-w-2xl mx-auto rounded-3xl border border-slate-100 bg-white p-6 sm:p-8 shadow-xs space-y-6">
          <div className="text-center space-y-2">
            <div className="h-12 w-12 bg-pink-50 border border-pink-100 text-[#874C67] flex items-center justify-center rounded-full mx-auto">
              <Award className="h-6 w-6" />
            </div>
            <h3 className="font-display text-xl font-bold text-slate-900">Tra Cứu Khách Hàng Thân Thiết (CRM Members)</h3>
            <p className="text-xs text-slate-500">
              Nhập số điện thoại đã đăng ký tại tiệm để kiểm tra cấp bậc thành viên, điểm tích lũy và thẻ quà tặng.
            </p>
          </div>

          <form onSubmit={handleLoyaltyLookup} className="flex gap-2 max-w-md mx-auto">
            <div className="relative flex-1">
              <Phone className="absolute left-3.5 top-3 h-4.5 w-4.5 text-slate-400" />
              <input
                type="text"
                placeholder="Nhập SĐT của bạn (ví dụ: 650 441 2091)"
                value={lookupPhone}
                onChange={e => setLookupPhone(e.target.value)}
                className="w-full text-sm rounded-xl border border-slate-250 py-2.5 pl-10 pr-4 focus:ring-1 focus:ring-pink-300 focus:outline-hidden"
              />
            </div>
            <button
              type="submit"
              className="bg-[#874C67] hover:bg-[#5e3247] text-white font-extrabold px-6 rounded-xl text-xs transition transition-all active:scale-95"
            >
              Kiểm Tra
            </button>
          </form>

          {lookupError && (
            <div className="p-3 bg-rose-50 border border-rose-100 text-rose-700 text-xs font-semibold text-center rounded-xl">
              {lookupError}
            </div>
          )}

          {foundCustomer && (
            <div className="p-5 sm:p-6 bg-[#fcf8fa]/80 border border-pink-100 rounded-2xl space-y-5 animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <p className="text-[10px] text-slate-400 font-extrabold uppercase">Thành viên Luxury</p>
                  <h4 className="font-display text-xl font-bold text-slate-900">{foundCustomer.name}</h4>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">{foundCustomer.phone}</p>
                </div>
                <div className="text-right">
                  <span className="px-3 py-1 bg-[#874C67] text-white font-extrabold rounded-full text-xs uppercase tracking-wider">
                    {foundCustomer.tier} Member
                  </span>
                </div>
              </div>

              {/* Progress Bar Tier */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-600">
                  <span>Tích lũy: <span className="font-display font-extrabold text-[#874C67] text-sm">{foundCustomer.points} Điểm</span></span>
                  <span>Cấp tiếp theo: <span className="text-slate-800">{getNextTier(foundCustomer.tier)}</span></span>
                </div>
                
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#dfa0be] to-[#874C67] rounded-full transition-all duration-500"
                    style={{ width: `${getPointsProgress(foundCustomer.points, foundCustomer.tier)}%` }}
                  ></div>
                </div>
              </div>

              {/* Member Benefit Cards */}
              <div className="grid grid-cols-2 gap-3.5 pt-2">
                <div className="bg-white p-3 rounded-xl border border-slate-100 text-xs">
                  <p className="font-bold text-slate-455 uppercase text-[9px]">Tổng chi tiêu</p>
                  <p className="text-base font-extrabold text-slate-800 mt-1">${foundCustomer.totalSpent}</p>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-100 text-xs">
                  <p className="font-bold text-slate-455 uppercase text-[9px]">Tổng số lần ghé</p>
                  <p className="text-base font-extrabold text-slate-800 mt-1">{foundCustomer.visitCount} Lần</p>
                </div>
              </div>

              <div className="p-3 bg-white border border-pink-50 rounded-xl space-y-1">
                <p className="text-[9px] uppercase text-slate-400 font-bold">Ghi chú chăm sóc riêng từ nghệ sĩ Dallas:</p>
                <p className="text-xs leading-relaxed text-slate-700 italic font-medium">"{foundCustomer.notes || "Không có yêu cầu đặc biệt."}"</p>
              </div>
            </div>
          )}
        </div>
      )}

      {activeSubTab === "coupons" && (
        <div className="space-y-5">
          <div className="space-y-1">
            <h3 className="font-display text-xl font-bold text-slate-900">Mã Giảm Giá Active</h3>
            <p className="text-xs text-slate-500">Hãy đưa mã này cho thu ngân lúc tính tiền hoặc khi thanh toán hóa đơn để hưởng ưu đãi.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {coupons.map((cp) => (
              <div 
                key={cp.id}
                className="bg-white rounded-2xl border border-brand-100/40 overflow-hidden flex shadow-xs hover:border-pink-200 transition"
              >
                {/* Visual discount left side */}
                <div className="bg-gradient-to-br from-[#874C67] to-[#e8a0bf] text-white p-5 w-1/3 flex flex-col justify-center items-center text-center space-y-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-wide opacity-80">Discount</span>
                  <span className="font-display text-2xl font-black">
                    {cp.discountType === "Percent" ? `${cp.discountValue}%` : `$${cp.discountValue}`}
                  </span>
                </div>

                {/* Right side info */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">Ưu Đãi Đặc Quyền Của Bạn</h4>
                    <p className="text-[11px] text-slate-455 mt-1">Đơn tối thiểu: <span className="font-bold">${cp.minSpend}</span></p>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">HSD: {cp.expiryDate}</p>
                  </div>
                  <div className="flex items-center justify-between gap-2.5 pt-2.5 border-t border-slate-50">
                    <span className="font-mono font-bold text-xs bg-slate-100 px-2.5 py-1 rounded-md text-slate-700 select-all">
                      {cp.code}
                    </span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(cp.code);
                        alert(`Successfully copied code: ${cp.code}!`);
                      }}
                      className="text-brand-500 hover:text-brand-600 font-bold text-xs flex items-center gap-1"
                    >
                      <Copy className="h-3.5 w-3.5" /> Copy
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {coupons.length === 0 && (
              <div className="p-10 text-center rounded-2xl border border-dashed border-slate-200 bg-white">
                Chưa có mã khuyến mãi nào hôm nay.
              </div>
            )}
          </div>
        </div>
      )}

      {activeSubTab === "review" && (
        <div className="max-w-xl mx-auto bg-white rounded-3xl border border-slate-100 p-6 shadow-xs space-y-5">
          <div className="space-y-1.5 border-b border-slate-50 pb-3">
            <h3 className="font-display text-lg font-bold text-slate-800 flex items-center gap-1.5">
              <Star className="h-5 w-5 text-gold-500 fill-gold-500" /> Đánh Giá Chất Lượng Phục vụ thợ Nails
            </h3>
            <p className="text-xs text-slate-500">Ý kiến đóng góp giúp chúng tôi không ngừng nâng tầm dịch vụ của chi nhánh Dallas.</p>
          </div>

          {reviewSuccess && (
            <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs font-bold text-center rounded-xl animate-pulse">
              {reviewSuccess}
            </div>
          )}

          <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs font-medium text-slate-705">
            <div className="space-y-1.5">
              <label className="font-bold uppercase tracking-wider text-slate-500">1. Chọn Thợ Nails Phục vụ bạn:</label>
              <select
                value={reviewStaffId}
                onChange={e => setReviewStaffId(e.target.value)}
                className="w-full rounded-xl border border-slate-250 bg-slate-50/25 px-3 py-2.5 text-sm outline-none"
              >
                {staff.map(st => (
                  <option key={st.id} value={st.id}>{st.name} ({st.role})</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold uppercase tracking-wider text-slate-500 block">2. Đánh Giá Mức Độ Hài Lòng:</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setReviewRating(num)}
                    className={`h-9 w-9 rounded-xl font-bold font-mono text-sm border flex items-center justify-center transition-all ${
                      reviewRating === num
                        ? "bg-gold-500 border-gold-500 text-white shadow-xs"
                        : "bg-white border-slate-200 hover:bg-slate-50 text-slate-700"
                    }`}
                  >
                    {num} ★
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold uppercase tracking-wider text-slate-500 block">3. Lời Nhận Xét / Góp Ý Thêm (Tùy chọn):</label>
              <textarea
                placeholder="Ví dụ: Thiết kế móng rất đẹp, dũa mịn phao tay thợ làm vô cùng cẩn thận thoải mái..."
                rows={3}
                value={reviewComment}
                onChange={e => setReviewComment(e.target.value)}
                className="w-full rounded-xl border border-slate-250 px-3.5 py-2.5 outline-none focus:border-pink-300"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#874C67] hover:bg-[#5e3247] text-white font-extrabold rounded-xl py-3 text-sm transition active:scale-95"
            >
              Gửi Đánh Giá Của Bạn
            </button>
          </form>
        </div>
      )}

      {activeSubTab === "register" && (
        <div className="max-w-xl mx-auto bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="text-center space-y-2 pb-3 border-b border-slate-50">
            <div className="h-12 w-12 bg-pink-50 border border-pink-100 text-[#874C67] flex items-center justify-center rounded-full mx-auto">
              <UserCheck className="h-6 w-6" />
            </div>
            <h3 className="font-display text-xl font-bold text-slate-900">Đăng Ký Thành Viên Dallas Nails</h3>
            <p className="text-xs text-slate-500">
              Chương trình khách hàng thân thiết Dallas CRM: Đăng ký thành viên nhận ngay 50 Điểm thưởng Loyalty chào mừng và nhận mã quà tặng hấp dẫn!
            </p>
          </div>

          {regSuccess && (
            <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs font-bold text-center rounded-xl space-y-2 animate-bounce">
              <p>{regSuccess}</p>
              <button 
                onClick={() => {
                  setLookupPhone("");
                  setActiveSubTab("loyalty");
                }} 
                className="bg-[#874C67] text-white px-3 py-1 rounded-lg text-[10px] uppercase font-bold hover:bg-[#5e3247] transition cursor-pointer"
              >
                Tra cứu Điểm ngay 🔍
              </button>
            </div>
          )}

          {regError && (
            <div className="p-3 bg-rose-50 border border-rose-100 text-rose-700 text-xs font-semibold text-center rounded-xl">
              {regError}
            </div>
          )}

          <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs font-medium text-slate-700 font-sans">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-500 uppercase">Họ và Tên (Họ tên):</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Tiffany Cooper"
                  value={regName}
                  onChange={e => setRegName(e.target.value)}
                  className="w-full rounded-xl border border-slate-250 bg-slate-50/25 px-3.5 py-2.5 text-sm outline-none focus:border-pink-300 focus:bg-white transition"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-500 uppercase">Số Điện Thoại:</label>
                <input
                  type="phone"
                  required
                  placeholder="Ví dụ: +1 (650) 321-1182"
                  value={regPhone}
                  onChange={e => setRegPhone(e.target.value)}
                  className="w-full rounded-xl border border-slate-255 bg-slate-50/25 px-3.5 py-2.5 text-sm outline-none focus:border-pink-300 focus:bg-white transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-500 uppercase">Địa chỉ Email:</label>
                <input
                  type="email"
                  placeholder="Ví dụ: tiffany@example.com"
                  value={regEmail}
                  onChange={e => setRegEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-250 bg-slate-50/25 px-3.5 py-2.5 text-sm outline-none focus:border-pink-300 focus:bg-white transition"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-500 uppercase">Ngày sinh nhật:</label>
                <input
                  type="date"
                  value={regBirthday}
                  onChange={e => setRegBirthday(e.target.value)}
                  className="w-full rounded-xl border border-slate-250 bg-slate-50/25 px-3.5 py-2.5 text-sm outline-none focus:border-pink-300 focus:bg-white font-mono transition"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-500 uppercase">Địa chỉ Thường Trú:</label>
              <input
                type="text"
                placeholder="Ví dụ: 123 Luxury Dr, Dallas, TX"
                value={regAddress}
                onChange={e => setRegAddress(e.target.value)}
                className="w-full rounded-xl border border-slate-250 bg-slate-50/25 px-3.5 py-2.5 text-sm outline-none focus:border-pink-300 focus:bg-white transition"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#874C67] hover:bg-[#5e3247] text-white font-extrabold rounded-xl py-3.5 text-xs sm:text-sm shadow-md transition active:scale-95 cursor-pointer uppercase tracking-wider"
            >
              ĐĂNG KÝ THÀNH VIÊN NGAY 🌸
            </button>
          </form>
        </div>
      )}

      {activeSubTab === "compliance" && (
        <div className="max-w-xl mx-auto space-y-6">
          {/* General policy details */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-xs space-y-5">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-105">
              <div className="h-10 w-10 bg-emerald-50 rounded-xl text-emerald-600 flex items-center justify-center shrink-0">
                <ShieldCheck className="h-5.5 w-5.5" />
              </div>
              <div>
                <h3 className="font-display text-sm sm:text-base font-bold text-slate-900">Quyền Riêng Tư & Thỏa Thuận Store</h3>
                <p className="text-[10px] text-slate-400">Dallas Nails App Store & Google Play Quality Standards Hub</p>
              </div>
            </div>

            <div className="space-y-4 text-xs font-medium text-slate-600 leading-relaxed font-sans">
              <div className="p-3.5 bg-slate-50 rounded-2xl flex items-start gap-2.5">
                <Info className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                <p className="text-[11px]">
                  Ứng dụng <strong>Dallas Nails Luxury System</strong> thu thập các dữ liệu cơ bản dạng văn bản để lưu trữ hồ sơ CRM phục vụ việc tích lũy điểm thưởng (Loyalty) và xếp hạng thành viên (Bronze/Silver/Gold/Platinum) tự động cho người dùng.
                </p>
              </div>

              {/* CRM stored dataset disclosure */}
              <div className="space-y-2">
                <p className="font-extrabold text-slate-700 uppercase tracking-wider text-[10px]">Dữ Liệu Thu Thập Được Mã Hóa Cục Bộ:</p>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2 border border-slate-100 rounded-xl bg-slate-50/30">
                    <span className="font-bold text-[#874C67] block">📱 Số Điện Thoại</span>
                    Dùng để tra cứu điểm Loyalty & SMS nhắc hẹn.
                  </div>
                  <div className="p-2 border border-slate-100 rounded-xl bg-slate-50/30">
                    <span className="font-bold text-[#874C67] block">👤 Họ và Tên</span>
                    Danh tính định danh trên thẻ thành viên Dallas.
                  </div>
                  <div className="p-2 border border-slate-100 rounded-xl bg-slate-50/30">
                    <span className="font-bold text-[#874C67] block">✉️ Địa chỉ Email</span>
                    Gửi biên lai thanh toán hóa đơn nails tự động.
                  </div>
                  <div className="p-2 border border-slate-100 rounded-xl bg-slate-50/30">
                    <span className="font-bold text-[#874C67] block">📍 Địa Chỉ Thường Trú</span>
                    Phục vụ vận chuyển quà tặng tri ân VIP độc quyền.
                  </div>
                </div>
              </div>

              {/* Developer contact support block */}
              <div className="p-3.5 bg-rose-50/30 border border-rose-100/50 rounded-2xl space-y-2">
                <p className="font-extrabold text-rose-800 text-[10px] uppercase tracking-wider">Hỗ Trợ Kỹ Thuật & Pháp Lý:</p>
                <ul className="space-y-1 text-[11px] text-slate-600 list-disc list-inside">
                  <li><strong>Tổng đài hỗ trợ:</strong> +1 (408) 555-0100</li>
                  <li><strong>Email nhà phát triển:</strong> support@luxury-dallasnails.com</li>
                  <li><strong>Địa chỉ hoạt động:</strong> 123 Luxury Dr, Dallas, TX 75201</li>
                  <li><strong>Phiên bản ứng dụng:</strong> NailOS Build v3.2.1 Stable (App Store Compliant)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Interactive account & CRM deletion form according to Store criteria */}
          <div className="bg-white rounded-3xl border border-rose-100 p-6 sm:p-8 shadow-xs space-y-5">
            <div className="flex items-center gap-3 pb-3 border-b border-rose-50">
              <div className="h-10 w-10 bg-rose-50 rounded-xl text-rose-600 flex items-center justify-center shrink-0">
                <Trash2 className="h-5.5 w-5.5" />
              </div>
              <div>
                <h3 className="font-display text-sm sm:text-base font-bold text-slate-900">Yêu Cầu Xóa Tài Khoản & Hồ Sơ Dữ Liệu</h3>
                <p className="text-[10px] text-slate-400">Đơn phương rút khỏi hệ thống CRM của Dallas Nails trực tuyến</p>
              </div>
            </div>

            {delSuccess && (
              <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs font-bold text-center rounded-xl">
                {delSuccess}
              </div>
            )}

            {delError && (
              <div className="p-3 bg-rose-50 border border-rose-100 text-rose-700 text-xs font-semibold text-center rounded-xl">
                {delError}
              </div>
            )}

            {!foundCustomerDel ? (
              <form onSubmit={handleVerifyDeletePhone} className="space-y-3">
                <p className="text-xs text-slate-500">
                  Nhập số điện thoại đã đăng ký của bạn để hệ thống định vị tài khoản Loyalty CRM thích hợp trước khi xóa.
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="phone"
                    required
                    placeholder="Ví dụ: +1 (650) 321-1182"
                    value={delPhone}
                    onChange={e => setDelPhone(e.target.value)}
                    className="flex-1 rounded-xl border border-slate-200 bg-slate-50/20 px-3.5 py-2.5 text-xs outline-none focus:border-rose-300 focus:bg-white transition"
                  />
                  <button
                    type="submit"
                    className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold px-5 py-2.5 rounded-xl text-xs transition whitespace-nowrap cursor-pointer"
                  >
                    🔍 Định vị Tài khoản
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4 p-4 bg-rose-50/25 border border-rose-100 rounded-2xl animate-in fade-in duration-200">
                <div className="text-xs space-y-1.5 text-slate-700">
                  <p className="font-bold text-[#874C67] uppercase tracking-wider text-[10px]">Hồ sơ tìm thấy:</p>
                  <p><strong>Họ và tên:</strong> {foundCustomerDel.name}</p>
                  <p><strong>Số điện thoại:</strong> {foundCustomerDel.phone}</p>
                  <p><strong>Ngày sinh:</strong> {foundCustomerDel.birthday}</p>
                  <p><strong>Hạng thành viên:</strong> <span className="font-bold underline text-slate-900">{foundCustomerDel.tier}</span> ({foundCustomerDel.points} Điểm thưởng)</p>
                </div>

                <div className="p-3 bg-rose-100/40 border border-rose-200/50 text-rose-800 text-[11px] font-bold rounded-xl space-y-1">
                  <p className="flex items-center gap-1.5 uppercase text-rose-900">
                    <ShieldAlert className="h-4 w-4 text-rose-600" /> CẢNH BÁO MẤT QUYỀN LỢI & DỮ LIỆU:
                  </p>
                  <ul className="list-disc list-inside space-y-0.5">
                    <li>Toàn bộ {foundCustomerDel.points} Điểm Loyalty tích lũy của bạn sẽ bị hủy vĩnh viễn.</li>
                    <li>Lịch sử làm móng, thông tin coupon và ưu đãi cá nhân sẽ bị xóa ngay lập tức.</li>
                    <li>Sẽ không thể phục hồi dữ liệu này sau khi quá trình hoàn tất.</li>
                  </ul>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleExecuteDeleteAccount(foundCustomerDel.id)}
                    className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition cursor-pointer shadow-xs uppercase tracking-wider"
                  >
                    🗑️ Cam Kết Xóa Vĩnh Viễn Tài Khoản
                  </button>
                  <button
                    onClick={() => {
                      setFoundCustomerDel(null);
                      setDelPhone("");
                    }}
                    className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold py-2.5 px-4 rounded-xl text-xs transition"
                  >
                    Hủy Bỏ
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}


      {/* BOOKING MODAL FOR CUSTOMER */}
      {bookModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white p-6 shadow-2xl animate-in fade-in-50 zoom-in-95 duration-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-50 pb-3">
              <div>
                <h3 className="font-display text-lg font-bold text-slate-800">Đặt Lịch Hẹn Trực Tuyến</h3>
                <p className="text-[10px] text-slate-400">Chọn lịch, chúng tôi phục vụ chu đáo nhất</p>
              </div>
              <button 
                onClick={() => setBookModalOpen(false)}
                className="rounded-full p-1 text-slate-400 hover:bg-slate-50"
              >
                ✕
              </button>
            </div>

            {bookSuccess && (
              <div className="p-3.5 bg-brand-50 border border-brand-100/30 text-brand-700 font-bold rounded-xl text-xs text-center">
                {bookSuccess}
              </div>
            )}

            <form onSubmit={handleOnlineBookingSubmit} className="space-y-4 text-xs font-medium text-slate-700">
              <div>
                <label className="block font-bold text-slate-500 mb-1">Tên Của Bạn *</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Jenny Nguyen"
                  value={custName}
                  onChange={e => setCustName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-500 mb-1">SĐT Di Động Để SMS Nhắc Hẹn *</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: (650) 441-2091"
                  value={custPhone}
                  onChange={e => setCustPhone(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-500 mb-1">Dịch Vụ Muốn Làm *</label>
                  <select
                    value={selectedServiceId}
                    onChange={e => setSelectedServiceId(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs bg-white"
                  >
                    {services.map(s => (
                      <option key={s.id} value={s.id}>{s.name} (${s.price})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-500 mb-1">Thợ Yêu Thích *</label>
                  <select
                    value={selectedStaffId}
                    onChange={e => setSelectedStaffId(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs bg-white"
                  >
                    {staff.map(st => (
                      <option key={st.id} value={st.id}>{st.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-500 mb-1 font-sans">Ngày lấy lịch *</label>
                  <input
                    type="date"
                    required
                    value={bookingDate}
                    onChange={e => setBookingDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-xs text-slate-850"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-500 mb-1 font-sans">Giờ đón khách *</label>
                  <input
                    type="time"
                    required
                    value={bookingTime}
                    onChange={e => setBookingTime(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-xs text-slate-850"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-550 mb-1">Ghi chú riêng gửi thợ Dallas (Form móng tay, Loại da mỏng...):</label>
                <textarea
                  rows={2}
                  placeholder="Ví dụ: Chỉ vẽ hoa nhỏ ngón áp út, dã tay mỏng dũa nhẹ, uống trà nóng..."
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs"
                />
              </div>

              <div className="pt-3 border-t border-slate-50 flex justify-end gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setBookModalOpen(false)}
                  className="rounded-full border border-slate-205 px-5 py-2.5 font-bold text-slate-600 hover:bg-slate-50"
                >
                  Đóng Bảng
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-[#874C67] text-white font-extrabold px-6 py-2.5 transition shadow"
                >
                  Xác Nhận Đặt Lịch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
