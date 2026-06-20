import React, { useState } from "react";
import { 
  CalendarCheck, 
  Clock, 
  User, 
  Trash2, 
  Scissors, 
  ChevronLeft, 
  ChevronRight,
  Info,
  Calendar as LucideCalendar,
  CreditCard,
  DollarSign,
  Receipt,
  Sparkles,
  CheckCircle2,
  Award,
  ShieldAlert
} from "lucide-react";
import { Booking, BookingStatus, Service, Staff, Customer, Transaction } from "../types";

interface CalendarViewProps {
  bookings: Booking[];
  services: Service[];
  staff: Staff[];
  customers: Customer[];
  transactions: Transaction[];
  onAddBooking: (booking: Omit<Booking, "id">) => void;
  onUpdateStatus: (bookingId: string, status: BookingStatus) => void;
  onDeleteBooking: (bookingId: string) => void;
  onCheckoutBooking?: (
    bookingId: string,
    finalAmount: number,
    tipAmount: number,
    paymentMethod: "Cash" | "Card" | "Apple Pay" | "Gift Card"
  ) => void;
  quickBookOpen: boolean;
  setQuickBookOpen: (open: boolean) => void;
}

export default function CalendarView({
  bookings,
  services,
  staff,
  customers,
  transactions,
  onAddBooking,
  onUpdateStatus,
  onDeleteBooking,
  onCheckoutBooking,
  quickBookOpen,
  setQuickBookOpen
}: CalendarViewProps) {
  const [selectedDate, setSelectedDate] = useState("2026-06-19"); // Starting mock date
  const [selectedStaffFilter, setSelectedStaffFilter] = useState<string>("all");

  // Checkout & Bill States
  const [checkoutBooking, setCheckoutBookingState] = useState<Booking | null>(null);
  const [checkoutFinalPrice, setCheckoutFinalPrice] = useState("");
  const [checkoutTip, setCheckoutTip] = useState("");
  const [checkoutPayment, setCheckoutPayment] = useState<"Card" | "Cash" | "Apple Pay" | "Gift Card">("Card");
  const [checkoutNotice, setCheckoutNotice] = useState("");
  
  const [viewingTransaction, setViewingTransaction] = useState<Transaction | null>(null);

  // Booking Form State
  const [customerSearch, setCustomerSearch] = useState("");
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [serviceId, setServiceId] = useState(services[0]?.id || "");
  const [selectedStaffId, setSelectedStaffId] = useState(staff[0]?.id || "");
  const [bookingTime, setBookingTime] = useState("10:00");
  const [bookingNotes, setBookingNotes] = useState("");

  const timeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", 
    "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", 
    "16:00", "16:30", "17:00", "17:30", "18:00"
  ];

  const dateSwitcherOptions = [
    { day: "Thứ 4", date: "2026-06-17" },
    { day: "Thứ 5", date: "2026-06-18" },
    { day: "Hôm nay (Thứ 6)", date: "2026-06-19" },
    { day: "Thứ 7", date: "2026-06-20" },
    { day: "Chủ Nhật", date: "2026-06-21" },
  ];

  // Filter Bookings matching both selected Date and staff
  const filteredBookings = bookings.filter(b => {
    const isSameDate = b.dateTime.startsWith(selectedDate);
    const isSameStaff = selectedStaffFilter === "all" || b.staffId === selectedStaffFilter;
    return isSameDate && isSameStaff;
  });

  // Handle client selection from search results
  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(customerSearch.toLowerCase()) || 
    c.phone.includes(customerSearch)
  );

  const selectExistingCustomer = (c: Customer) => {
    setSelectedCustomerId(c.id);
    setCustomerName(c.name);
    setCustomerPhone(c.phone);
    setCustomerSearch(""); // Clear search bar input
  };

  const handleCreateBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) return;

    const matchedService = services.find(s => s.id === serviceId);
    const matchedStaff = staff.find(st => st.id === selectedStaffId);

    onAddBooking({
      customerId: selectedCustomerId || "custom-guest",
      customerName,
      customerPhone,
      serviceId,
      serviceName: matchedService ? matchedService.name : "Custom nail work",
      staffId: selectedStaffId,
      staffName: matchedStaff ? matchedStaff.name : "Anyone",
      dateTime: `${selectedDate}T${bookingTime}:00`,
      status: "Confirmed",
      price: matchedService ? matchedService.price : 40,
      notes: bookingNotes,
    });

    // Reset Form
    setCustomerName("");
    setCustomerPhone("");
    setSelectedCustomerId("");
    setBookingNotes("");
    setQuickBookOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Date Switcher and View Filters Panel */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-white border border-slate-100 p-4 rounded-2xl shadow-xs">
        {/* Quick Date Tab Switchers */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
          {dateSwitcherOptions.map((opt) => (
            <button
              key={opt.date}
              onClick={() => setSelectedDate(opt.date)}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all shrink-0 ${
                selectedDate === opt.date
                  ? "bg-brand-500 text-white shadow-md shadow-brand-500/15"
                  : "bg-slate-50 text-slate-500 hover:bg-slate-100"
              }`}
            >
              {opt.day} <span className="font-mono font-normal block text-[10px] opacity-90">{opt.date.split("-")[2]}/{opt.date.split("-")[1]}</span>
            </button>
          ))}
        </div>

        {/* Staff Column Profile Filters */}
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">Lọc theo Thợ:</label>
          <select
            value={selectedStaffFilter}
            onChange={(e) => setSelectedStaffFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold focus:outline-none"
          >
            <option value="all">Tất cả nhân viên</option>
            {staff.map(st => (
              <option key={st.id} value={st.id}>{st.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Split Column: Calendar View timeline & Add Booking Form side-by-side */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 items-start">
        {/* Left 2 Columns: Schedule Grid Timeline */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-display text-lg font-extrabold text-slate-800">Bảng Sắp Lịch</h3>
                <p className="text-xs text-slate-500">
                  Lịch hẹn ngày <span className="text-slate-850 font-bold underline">{selectedDate}</span>
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 font-mono">
                  <Info className="h-3 w-3" /> CLICK TRỰC TIẾP ĐỂ ĐỔI TRẠNG THÁI
                </span>
              </div>
            </div>

            {/* Simulated Grid list of Hours */}
            <div className="space-y-1 relative border-l border-slate-100 pl-4 py-2">
              {timeSlots.map((time) => {
                // Find any booking that starts at this hour/minute
                const slotBookings = filteredBookings.filter(b => b.dateTime.includes(`T${time}`));
                
                return (
                  <div key={time} className="group relative flex items-start gap-4 min-h-[68px] py-1 border-b border-slate-50 last:border-0">
                    {/* Time Label */}
                    <span className="font-mono text-xs font-bold text-slate-400 w-12 text-right pt-2.5 shrink-0 group-hover:text-brand-500 transition">
                      {time}
                    </span>

                    {/* Booking container card inside timeline */}
                    <div className="flex-1 flex gap-2">
                      {slotBookings.length === 0 ? (
                        <button
                          onClick={() => {
                            setBookingTime(time);
                            setQuickBookOpen(true);
                          }}
                          className="w-full text-left py-2 px-3 rounded-xl border border-dashed border-slate-100 hover:border-brand-300 hover:bg-brand-50/10 text-[11px] font-bold text-slate-300 hover:text-brand-500 transition cursor-pointer self-stretch"
                        >
                          + Nhấp để chèn đặt lịch móng mới...
                        </button>
                      ) : (
                        slotBookings.map((b) => {
                          const technician = staff.find(st => st.id === b.staffId);
                          let statusTheme = "bg-amber-500/10 text-amber-700 border-amber-200";
                          if (b.status === "Completed") statusTheme = "bg-emerald-500/10 text-emerald-700 border-emerald-200";
                          if (b.status === "Confirmed") statusTheme = "bg-blue-500/10 text-blue-700 border-blue-200";
                          if (b.status === "Cancelled") statusTheme = "bg-rose-500/10 text-rose-700 border-rose-200";

                          return (
                            <div
                              key={b.id}
                              className="w-full rounded-2xl border bg-white p-3.5 shadow-2xs hover:shadow-xs transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative overflow-hidden"
                              style={{ borderLeftColor: technician?.color || "#e2e8f0", borderLeftWidth: '5px' }}
                            >
                              <div className="space-y-1.5 flex-1">
                                <div className="flex items-center gap-1.5">
                                  <h4 className="font-bold text-slate-800 text-sm leading-tight">{b.customerName}</h4>
                                  <span className="font-mono text-[10px] text-slate-400 font-bold">{b.customerPhone}</span>
                                </div>
                                <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs">
                                  <span className="font-bold text-slate-700 flex items-center gap-1">
                                    <Scissors className="h-3 w-3 text-brand-400" /> {b.serviceName}
                                  </span>
                                  <span className="text-slate-400 font-mono">•</span>
                                  <span 
                                    className="font-bold text-slate-600 flex items-center gap-1"
                                    style={{ color: technician?.color }}
                                  >
                                    <User className="h-3 w-3" /> Thợ {b.staffName}
                                  </span>
                                  {b.notes && (
                                    <>
                                      <span className="text-slate-300 font-mono">•</span>
                                      <span className="text-slate-500 italic text-[11px] bg-slate-50 px-1.5 py-0.5 rounded-lg">"{b.notes}"</span>
                                    </>
                                  )}
                                </div>
                              </div>

                              {/* Interactive controls: Adjust CRM scheduling status */}
                              <div className="flex items-center gap-2 flex-wrap sm:self-center self-end pt-1 sm:pt-0 border-l border-slate-50 pl-3">
                                <span className="text-sm font-black text-slate-800 tracking-tight mr-1">${b.price}</span>
                                
                                <select
                                  value={b.status}
                                  onChange={(e) => {
                                    const nextStatus = e.target.value as BookingStatus;
                                    if (nextStatus === "Completed") {
                                      setCheckoutBookingState(b);
                                      setCheckoutFinalPrice(b.price.toString());
                                      setCheckoutTip(Math.round(b.price * 0.18).toString());
                                      setCheckoutPayment("Card");
                                    } else {
                                      onUpdateStatus(b.id, nextStatus);
                                    }
                                  }}
                                  className={`text-xs font-semibold rounded-lg px-2 py-1 border focus:outline-none ${statusTheme}`}
                                >
                                  <option value="Pending">Chờ (Pending)</option>
                                  <option value="Confirmed">Xác nhận (Confirmed)</option>
                                  <option value="Completed">Hoàn thành (Completed)</option>
                                  <option value="Cancelled">Hủy cuộc hẹn (Cancelled)</option>
                                  <option value="No Show">Khách không tới (No Show)</option>
                                </select>

                                {b.status !== "Completed" && b.status !== "Cancelled" && (
                                  <button
                                    onClick={() => {
                                      setCheckoutBookingState(b);
                                      setCheckoutFinalPrice(b.price.toString());
                                      setCheckoutTip(Math.round(b.price * 0.18).toString());
                                      setCheckoutPayment("Card");
                                    }}
                                    className="bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-[10px] px-2.5 py-1.5 rounded-lg shadow-sm transition flex items-center gap-1 active:scale-95 whitespace-nowrap uppercase tracking-wider font-sans shrink-0 cursor-pointer"
                                  >
                                    <CreditCard className="h-3 w-3" /> Thu Tiền
                                  </button>
                                )}

                                {b.status === "Completed" && (
                                  <button
                                    onClick={() => {
                                      const matchingTx = transactions.find(t => t.bookingId === b.id);
                                      if (matchingTx) {
                                        setViewingTransaction(matchingTx);
                                      } else {
                                        setViewingTransaction({
                                          id: "temp-tx",
                                          bookingId: b.id,
                                          customerId: b.customerId,
                                          customerName: b.customerName,
                                          amount: b.price,
                                          tipAmount: Math.round(b.price * 0.18),
                                          paymentMethod: "Card",
                                          staffId: b.staffId,
                                          dateTime: new Date().toISOString()
                                        });
                                      }
                                    }}
                                    className="bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-[10px] px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1 whitespace-nowrap border border-slate-200 cursor-pointer"
                                  >
                                    <Receipt className="h-3 w-3 text-slate-400" /> Xem Bill
                                  </button>
                                )}

                                <button
                                  onClick={() => {
                                    if(confirm(`Bạn có chắc muốn xóa lịch móng của khách ${b.customerName}?`)) {
                                      onDeleteBooking(b.id);
                                    }
                                  }}
                                  className="text-slate-350 hover:text-rose-600 rounded-lg p-1.5 hover:bg-rose-50 transition"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right 1 Column: Create Booking Panel (Show on Toggle or continuous) */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-xs space-y-6">
          <div className="flex items-center gap-2 text-brand-600 border-b border-slate-50 pb-3">
            <CalendarCheck className="h-5 w-5" />
            <h3 className="font-display text-lg font-extrabold text-slate-800">Tạo Cuộc Hẹn Mới</h3>
          </div>

          <form onSubmit={handleCreateBookingSubmit} className="space-y-4">
            {/* Find Search bar inside customers */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase font-mono">Tìm Khách Hàng Sẵn Có CRM:</label>
              <input
                type="text"
                placeholder="Nhập tên hoặc SĐT tìm khách hàng..."
                value={customerSearch}
                onChange={(e) => setCustomerSearch(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm focus:border-brand-500 focus:outline-none"
              />
              {customerSearch && (
                <div className="absolute z-10 bg-white border border-slate-200 rounded-xl mt-1 max-h-40 overflow-y-auto shadow-md w-auto py-1 text-xs">
                  {filteredCustomers.length === 0 ? (
                    <p className="p-2 text-slate-400">Không tìm thấy khách. Hãy gõ tên mới bên dưới.</p>
                  ) : (
                    filteredCustomers.map(cust => (
                      <div
                        key={cust.id}
                        onClick={() => selectExistingCustomer(cust)}
                        className="p-2 hover:bg-brand-50 cursor-pointer text-slate-700 font-medium flex justify-between gap-4"
                      >
                        <span>{cust.name} ({cust.phone})</span>
                        <span className="font-bold text-brand-500 text-[10px] uppercase">{cust.tier} - {cust.points}pts</span>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase font-mono">Họ Tên Khách Làm:</label>
              <input
                type="text"
                required
                placeholder="Ví dụ: Jenny Nguyễn"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm focus:border-brand-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase font-mono">Số Điện Thoại:</label>
              <input
                type="text"
                required
                placeholder="Ví dụ: +1 (650) 441-2091"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm focus:border-brand-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase font-mono font-sans">Chọn Dịch Vụ:</label>
                <select
                  value={serviceId}
                  onChange={(e) => setServiceId(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm bg-white focus:outline-none focus:border-brand-500"
                >
                  {services.map(s => (
                    <option key={s.id} value={s.id}>{s.name} (${s.price})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase font-mono">Giờ Đặt Lịch:</label>
                <select
                  value={bookingTime}
                  onChange={(e) => setBookingTime(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm bg-white focus:outline-none focus:border-brand-500"
                >
                  {timeSlots.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase font-mono">Thợ Nails Đảm Nhận:</label>
              <select
                value={selectedStaffId}
                onChange={(e) => setSelectedStaffId(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm bg-white focus:outline-none focus:border-brand-500"
              >
                {staff.map(st => (
                  <option key={st.id} value={st.id}>{st.name} ({st.role})</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase font-mono">Ghi chú yêu cầu:</label>
              <textarea
                placeholder="Form móng almond, sấy tia UV, dặn thợ Lily làm nhẹ da tay..."
                value={bookingNotes}
                onChange={(e) => setBookingNotes(e.target.value)}
                rows={2}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm focus:border-brand-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl py-3 text-sm transition-all shadow-md active:scale-95"
            >
              Lưu Cuộc Hẹn
            </button>
          </form>
        </div>
      </div>

      {/* MODAL 1: INTERACTIVE BILL CHECKOUT MODAL */}
      {checkoutBooking && (() => {
        const client = customers.find(c => c.id === checkoutBooking.customerId);
        const worker = staff.find(st => st.id === checkoutBooking.staffId);
        
        const cost = parseFloat(checkoutFinalPrice) || 0;
        const tip = parseFloat(checkoutTip) || 0;
        const totalPay = cost + tip;
        
        const rate = worker?.commissionRate ?? 0.60;
        const commAmount = Math.round(cost * rate);
        const staffGets = commAmount + tip;
        const salonGets = cost - commAmount;

        // Points earned computation
        const pointsEarned = Math.round(cost);
        const startingPoints = client?.points ?? 0;
        const finalPoints = startingPoints + pointsEarned;
        
        let initialTier = client?.tier ?? "Bronze";
        let targetTier = initialTier;
        if (finalPoints >= 800) targetTier = "Platinum";
        else if (finalPoints >= 300) targetTier = "Gold";
        else if (finalPoints >= 100) targetTier = "Silver";

        const hasTierUpgrade = initialTier !== targetTier;

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/65 backdrop-blur-xs p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-100 flex flex-col max-h-[92vh] overflow-hidden animate-in fade-in zoom-in-95 duration-205">
              
              {/* Header */}
              <div className="bg-gradient-to-r from-brand-600 to-brand-700 p-5 text-white relative">
                <button 
                  onClick={() => setCheckoutBookingState(null)}
                  className="absolute right-4 top-4 text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-full transition text-xs font-bold font-mono"
                >
                  ✕ Close
                </button>
                <div className="flex items-center gap-2.5">
                  <div className="bg-white/12 p-2 rounded-xl">
                    <CreditCard className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-black tracking-tight">Tính Tiền & In Bill</h3>
                    <p className="text-xs text-brand-100 font-medium">Khách hàng: {checkoutBooking.customerName}</p>
                  </div>
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="p-6 overflow-y-auto space-y-6 text-slate-700">
                {/* Section 1: Service details */}
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs text-slate-400 font-extrabold uppercase tracking-wider font-sans">Dịch vụ chính</p>
                      <h4 className="font-bold text-slate-800 text-sm">{checkoutBooking.serviceName}</h4>
                    </div>
                    <span className="font-mono text-sm font-black text-slate-800">${checkoutBooking.price}</span>
                  </div>
                  <div className="border-t border-slate-200/60 pt-2.5 flex justify-between items-center text-xs text-slate-500">
                    <span className="flex items-center gap-1 font-medium">
                      <User className="h-3.5 w-3.5 text-slate-400" /> Thợ làm: <span className="text-slate-700 font-bold">{checkoutBooking.staffName}</span>
                    </span>
                    <span className="bg-brand-50 text-brand-700 px-2 py-0.5 rounded-md font-bold text-[10px]">Commission {rate * 100}%</span>
                  </div>
                </div>

                {/* Section 2: Editable pricing & tip */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide font-mono">Tiền dịch vụ ($):</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-sm text-slate-400 font-bold">$</span>
                      <input 
                        type="number"
                        min="0"
                        value={checkoutFinalPrice}
                        onChange={(e) => setCheckoutFinalPrice(e.target.value)}
                        className="w-full bg-slate-50/50 hover:bg-slate-50 border border-slate-200 focus:border-brand-500 rounded-xl pl-6.5 pr-3 py-2 text-sm font-bold focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide font-mono">Tiền Tips ($):</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-sm text-slate-400 font-bold">$</span>
                      <input 
                        type="number"
                        min="0"
                        value={checkoutTip}
                        onChange={(e) => setCheckoutTip(e.target.value)}
                        className="w-full bg-slate-50/50 hover:bg-slate-50 border border-slate-200 focus:border-brand-500 rounded-xl pl-6.5 pr-3 py-2 text-sm font-bold focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Fast Tip Selectors */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest font-mono block">Chọn nhanh Tip %:</span>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { label: "15%", value: Math.round(cost * 0.15) },
                      { label: "18% (Gợi ý)", value: Math.round(cost * 0.18) },
                      { label: "20%", value: Math.round(cost * 0.20) },
                      { label: "Custom $0", value: 0 }
                    ].map((opt, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setCheckoutTip(opt.value.toString())}
                        className={`text-xs py-1.5 rounded-lg border font-bold transition cursor-pointer active:scale-95 ${
                          parseFloat(checkoutTip) === opt.value 
                            ? "bg-brand-50 border-brand-300 text-brand-700"
                            : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {opt.label} (${opt.value})
                      </button>
                    ))}
                  </div>
                </div>

                {/* Section 3: Payment Method Selector */}
                <div className="space-y-2">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest font-mono block">Phương thức thanh toán:</span>
                  <div className="grid grid-cols-4 gap-2">
                    {([
                      { name: "Card", label: "MasterCard/Visa" },
                      { name: "Cash", label: "Tiền mặt" },
                      { name: "Apple Pay", label: "Apple Pay" },
                      { name: "Gift Card", label: "Thẻ Quà" }
                    ] as const).map((pm) => (
                      <button
                        key={pm.name}
                        type="button"
                        onClick={() => setCheckoutPayment(pm.name)}
                        className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition cursor-pointer text-center ${
                          checkoutPayment === pm.name 
                            ? "bg-slate-900 border-slate-900 text-white shadow-sm"
                            : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        <span className="font-extrabold text-xs tracking-tight">{pm.name}</span>
                        <span className="text-[9px] opacity-75 whitespace-nowrap">{pm.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Section 4: Commission & Payout split breakdown */}
                <div className="border-t border-dashed border-slate-200 pt-4 space-y-2.5">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest font-mono block">Bảng Thống Kê Phân Chia Thu Nhập:</span>
                  
                  <div className="grid grid-cols-2 gap-3.5 text-xs">
                    <div className="bg-amber-500/5 rounded-xl p-3 border border-amber-500/10 space-y-1">
                      <span className="font-bold text-slate-500 block text-[10px] uppercase font-mono">Thợ Nails Nhận:</span>
                      <p className="text-xl font-black text-amber-700 font-mono">${staffGets}</p>
                      <span className="text-[9px] text-slate-400 block tracking-tight">({rate * 100}% Tour ${commAmount} + ${tip} tips)</span>
                    </div>

                    <div className="bg-emerald-500/5 rounded-xl p-3 border border-emerald-500/10 space-y-1">
                      <span className="font-bold text-slate-500 block text-[10px] uppercase font-mono">Tiệm Nails Nhận:</span>
                      <p className="text-xl font-black text-emerald-700 font-mono">${salonGets}</p>
                      <span className="text-[9px] text-slate-400 block tracking-tight">({(1 - rate) * 100}% Tour giá trị làm móng)</span>
                    </div>
                  </div>
                </div>

                {/* Section 5: Loyalty Points Upgrade Preview */}
                {client && (
                  <div className="bg-brand-500/5 rounded-xl p-3.5 border border-brand-500/10 flex items-start gap-3">
                    <Award className="h-5 w-5 text-brand-600 shrink-0 mt-0.5" />
                    <div className="space-y-1.5 flex-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-brand-900">Tính Điểm Thân Thiết (CRM Loyalty):</span>
                        <span className="font-mono bg-brand-100 text-brand-700 px-1.5 py-0.5 rounded font-extrabold text-[10px] uppercase">{client.tier}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-normal">
                        Tích lũy thêm <span className="font-black text-brand-600 text-xs">+{pointsEarned} điểm</span> từ hóa đơn này. 
                        Số điểm mới sẽ là: <span className="font-extrabold text-slate-800">{startingPoints} → {finalPoints} điểm</span>.
                      </p>
                      {hasTierUpgrade && (
                        <div className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-lg p-1.5 font-bold text-[10px] flex items-center gap-1 mt-1 animate-pulse">
                          <Sparkles className="h-3.5 w-3.5" />
                          Chúc mừng! Khách được Thăng Cấp Hội Viên lên: {targetTier.toUpperCase()} ⭐
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setCheckoutBookingState(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-500 bg-white hover:bg-slate-50 transition cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (onCheckoutBooking) {
                      onCheckoutBooking(checkoutBooking.id, cost, tip, checkoutPayment);
                    } else {
                      onUpdateStatus(checkoutBooking.id, "Completed");
                    }
                    setCheckoutBookingState(null);
                    alert(`✅ Ghi nhận doanh thu thành công!\nTổng hóa đơn: $${totalPay}\nThanh toán qua: ${checkoutPayment}`);
                  }}
                  className="bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl transition shadow-md shadow-brand-500/10 flex items-center gap-1 cursor-pointer"
                >
                  <CheckCircle2 className="h-4 w-4" /> Xác Nhận Thanh Toán & In Bill
                </button>
              </div>

            </div>
          </div>
        );
      })()}

      {/* MODAL 2: VIEW COMPLETED RECEIPT BILL */}
      {viewingTransaction && (() => {
        const txStaff = staff.find(st => st.id === viewingTransaction.staffId);
        const tourCommRate = txStaff?.commissionRate ?? 0.60;
        const mainServicePrice = viewingTransaction.amount;
        const tipPrice = viewingTransaction.tipAmount;
        const totalAmountPaid = mainServicePrice + tipPrice;
        const thợCommissionShare = Math.round(mainServicePrice * tourCommRate);
        const salonMargin = mainServicePrice - thợCommissionShare;

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/65 backdrop-blur-xs p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl border border-slate-100 flex flex-col p-6 animate-in fade-in zoom-in-95 duration-200">
              
              {/* Receipt Visual Body */}
              <div className="text-center space-y-2 border-b border-dashed border-slate-200 pb-4 relative">
                <h4 className="font-display font-black text-slate-800 tracking-wider text-sm uppercase">LUXURY NAILS BILLING</h4>
                <p className="text-[10px] text-slate-400 font-mono">Mã giao dịch: {viewingTransaction.id}</p>
                <p className="text-[11px] text-slate-500 font-medium">Thời gian: {new Date(viewingTransaction.dateTime).toLocaleString("vi-VN")}</p>
                
                <button 
                  onClick={() => setViewingTransaction(null)}
                  className="absolute -right-2 -top-2 text-slate-400 hover:text-slate-600 font-bold p-1 bg-slate-100 rounded-full text-xs font-mono"
                >
                  ✕
                </button>
              </div>

              {/* Receipt items list */}
              <div className="py-4 space-y-3.5 text-xs text-slate-650">
                <div className="flex justify-between font-medium">
                  <span className="text-slate-400">Khách Hàng:</span>
                  <span className="text-slate-800 font-extrabold">{viewingTransaction.customerName}</span>
                </div>

                <div className="flex justify-between font-medium">
                  <span className="text-slate-400">Thợ Phục Vụ:</span>
                  <span className="text-slate-800 font-extrabold">{txStaff?.name ?? "N/A"}</span>
                </div>

                <div className="border-t border-slate-100 my-2 pt-2 space-y-1.5">
                  <div className="flex justify-between">
                    <span>Nail Service Cost:</span>
                    <span className="font-mono font-bold">${mainServicePrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tips:</span>
                    <span className="font-mono font-bold text-emerald-600">+${tipPrice}</span>
                  </div>
                  <div className="flex justify-between text-slate-400 text-[10px]">
                    <span>Phương thức:</span>
                    <span className="font-bold">{viewingTransaction.paymentMethod}</span>
                  </div>
                </div>

                {/* Main Total Paid by client */}
                <div className="border-t border-dashed border-slate-200 pt-3 flex justify-between items-center bg-slate-50 p-2.5 rounded-xl mt-3.5">
                  <span className="font-extrabold text-xs text-slate-500 uppercase font-mono">TỔNG KHÁCH TRẢ (PAID):</span>
                  <span className="text-lg font-black font-mono text-slate-900">${totalAmountPaid}</span>
                </div>

                {/* Splitting overview */}
                <div className="bg-slate-50/50 rounded-xl p-3 border border-slate-100 space-y-2 mt-4 text-[11px]">
                  <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest font-mono block">Phân Tích Sổ Sách Doanh Thu:</span>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Thợ nhận (Commission + Tip):</span>
                    <span className="font-mono text-slate-800 font-bold">${thợCommissionShare + tipPrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Tiệm thu về (Salon share):</span>
                    <span className="font-mono text-slate-800 font-bold">${salonMargin}</span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-slate-100 pt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    alert("🖨️ Mô phỏng: Đang kết nối mạng máy in POS Clover/Square... In biên lai hóa đơn thành công!");
                  }}
                  className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2.5 rounded-xl transition text-center cursor-pointer"
                >
                  In Hóa Đơn 🖨️
                </button>
                <button
                  type="button"
                  onClick={() => setViewingTransaction(null)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-4 py-2.5 rounded-xl transition cursor-pointer"
                >
                  Đóng
                </button>
              </div>

            </div>
          </div>
        );
      })()}

    </div>
  );
}
