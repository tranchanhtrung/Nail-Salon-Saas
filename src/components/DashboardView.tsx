import React, { useState } from "react";
import { 
  TrendingUp, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Cake, 
  ArrowUpRight, 
  Users, 
  CheckSquare, 
  Plus, 
  DollarSign,
  Square
} from "lucide-react";
import { Booking, Customer, InventoryItem, Staff } from "../types";

interface DashboardViewProps {
  bookings: Booking[];
  customers: Customer[];
  inventory: InventoryItem[];
  staff: Staff[];
  setActiveTab: (tab: string) => void;
  onQuickBook: () => void;
}

export default function DashboardView({ 
  bookings, 
  customers, 
  inventory, 
  staff,
  setActiveTab,
  onQuickBook
}: DashboardViewProps) {
  // Stats calculations
  const todayStr = "2026-06-19";
  
  const todayBookings = bookings.filter(b => b.dateTime.startsWith(todayStr));
  const completedToday = todayBookings.filter(b => b.status === "Completed");
  const pendingToday = todayBookings.filter(b => b.status === "Pending");
  const confirmedToday = todayBookings.filter(b => b.status === "Confirmed");

  // Sum revenue for completed and confirmed bookings
  const todayEstRev = todayBookings
    .filter(b => b.status === "Completed" || b.status === "Confirmed")
    .reduce((sum, b) => sum + b.price, 0);

  // Tips estimate (approx 20% on completed)
  const todayTipsEst = Math.round(completedToday.reduce((sum, b) => sum + b.price * 0.18, 0));

  // Low ingredients alerts
  const lowStockItems = inventory.filter(i => i.stockLevel < i.minStockLevel);

  // Upcoming June birthdays (current date mock is June 19, 2026)
  const birthdayCustomers = customers.filter(c => {
    const [, month, day] = c.birthday.split("-");
    return month === "06" && parseInt(day) >= 19 && parseInt(day) <= 25;
  });

  // Simple reactive checklis for salon operations
  const [checklist, setChecklist] = useState([
    { id: 1, text: "Xác nhận lịch đặt của Sarah Miller (16:00)", done: false },
    { id: 2, text: "Gửi SMS tặng voucher sinh nhật sớm cho Chloe Davis", done: true },
    { id: 3, text: "Đặt hàng lại sơn Gel DND #143 (đang cạn)", done: false },
    { id: 4, text: "Kiểm tra báo cáo chia lương (commission 60/40)", done: false },
    { id: 5, text: "Khử trùng máy mài và bồn ngâm chân Pedicure", done: true },
  ]);

  const toggleCheck = (id: number) => {
    setChecklist(checklist.map(item => 
      item.id === id ? { ...item, done: !item.done } : item
    ));
  };

  const [newTaskText, setNewTaskText] = useState("");
  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    setChecklist([
      ...checklist,
      { id: Date.now(), text: newTaskText, done: false }
    ]);
    setNewTaskText("");
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Title */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-gradient-to-r from-slate-900 via-brand-950 to-slate-900 rounded-3xl p-6 text-white shadow-xl shadow-slate-200/50">
        <div>
          <p className="font-sans text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
            Executive Overview
          </p>
          <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight">
            Good morning, Elena ✨
          </h2>
          <p className="text-sm font-medium text-slate-300 mt-2">
            Here is your salon's performance overview for today. You have <span className="font-semibold text-brand-200">{todayBookings.length} bookings</span> scheduled.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={onQuickBook}
            className="flex items-center gap-1.5 rounded-full bg-brand-500 hover:bg-brand-600 px-5 py-3 text-sm font-bold text-white transition shadow-lg shadow-brand-500/20 active:scale-95"
          >
            <Plus className="h-4 w-4" /> Đặt Lịch Nhanh
          </button>
          <button 
            onClick={() => setActiveTab("ai")}
            className="flex items-center gap-1.5 rounded-full bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 px-5 py-3 text-sm font-bold transition shadow-sm active:scale-95"
          >
            <Sparkles className="h-4 w-4 text-brand-500" /> Hỏi Trợ Lý AI
          </button>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Metric 1 */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xs flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider font-sans">Ước tính Doanh Thu</p>
            <h3 className="text-3xl font-display font-extrabold text-slate-800">${todayEstRev}</h3>
            <p className="text-xs font-semibold text-slate-500">Gồm {completedToday.length} đã hoàn thành, {confirmedToday.length} đã xác nhận</p>
          </div>
          <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-brand-50 text-brand-500">
            <TrendingUp className="h-5 w-5" />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xs flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider font-sans">Tổng Lịch Hẹn</p>
            <h3 className="text-3xl font-display font-extrabold text-slate-800">{todayBookings.length}</h3>
            <p className="text-xs font-semibold text-slate-500">
              <span className="text-emerald-500 font-bold">{completedToday.length} Xong</span> •{" "}
              <span className="text-brand-500 font-bold">{pendingToday.length} Chờ</span>
            </p>
          </div>
          <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-blue-50 text-blue-500">
            <Clock className="h-5 w-5" />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xs flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider font-sans">Tiền Tips Ước Tính</p>
            <h3 className="text-3xl font-display font-extrabold text-slate-800">${todayTipsEst}</h3>
            <p className="text-xs font-semibold text-emerald-600">Avg 18% của tiền làm móng</p>
          </div>
          <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-emerald-50 text-emerald-500">
            <DollarSign className="h-5 w-5" />
          </div>
        </div>

        {/* Metric 4 */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xs flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider font-sans">Khách Hàng Kế Cận</p>
            <h3 className="text-3xl font-display font-extrabold text-slate-800">{customers.length}</h3>
            <p className="text-xs font-semibold text-slate-500">Tỷ lệ giữ chân khách cao</p>
          </div>
          <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-purple-50 text-purple-500">
            <Users className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Main split sections */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Section Left & Middle: Today Schedule & Checklist */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today Bookings Progress */}
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-display text-lg font-extrabold text-slate-800">Lịch Trình Hôm Nay</h3>
                <p className="text-xs text-slate-500">Các cuộc hẹn thực tế diễn ra trong ngày</p>
              </div>
              <button 
                onClick={() => setActiveTab("calendar")}
                className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-0.5"
              >
                Xem Toàn Bộ <ArrowUpRight className="h-3 w-3" />
              </button>
            </div>

            <div className="space-y-4">
              {todayBookings.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-sm">Chưa có lịch hẹn nào cho hôm nay.</div>
              ) : (
                todayBookings.map((b) => {
                  const[, time] = b.dateTime.split("T");
                  const formattedTime = time.substring(0, 5);
                  let statusColor = "bg-slate-100 text-slate-700";
                  if (b.status === "Completed") statusColor = "bg-emerald-50 text-emerald-700 border border-emerald-100";
                  if (b.status === "Pending") statusColor = "bg-amber-50 text-amber-700 border border-amber-100";
                  if (b.status === "Confirmed") statusColor = "bg-blue-50 text-blue-700 border border-blue-100";
                  if (b.status === "Cancelled") statusColor = "bg-rose-50 text-rose-700 border border-rose-100";
                  
                  return (
                    <div 
                      key={b.id} 
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl border border-slate-50 bg-slate-50/50 hover:bg-slate-50 transition gap-3"
                    >
                      <div className="flex items-start gap-3">
                        <div className="font-mono font-bold text-sm bg-white border border-slate-100 px-2.5 py-1 rounded-lg text-slate-700 shadow-2xs self-start">
                          {formattedTime}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">{b.customerName}</p>
                          <p className="text-xs font-medium text-slate-500">
                            {b.serviceName} • <span className="text-slate-700 font-semibold">{b.staffName}</span>
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 sm:self-center self-end">
                        <span className="text-sm font-bold text-slate-800">${b.price}</span>
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${statusColor}`}>
                          {b.status}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Checklist Task Manager */}
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-xs">
            <div>
              <h3 className="font-display text-lg font-extrabold text-slate-800">Sổ Tay Việc Cần Làm</h3>
              <p className="text-xs text-slate-500 mb-4">Quản lý các đầu việc hàng ngày tại tiệm</p>
            </div>

            <form onSubmit={addTask} className="flex gap-2 mb-4">
              <input 
                type="text" 
                value={newTaskText}
                onChange={e => setNewTaskText(e.target.value)}
                placeholder="Thêm đầu việc mới (ví dụ: Vệ sinh dũa móng..."
                className="flex-1 rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-brand-500 focus:outline-none"
              />
              <button 
                type="submit" 
                className="bg-slate-900 text-white rounded-xl px-4 py-2 text-sm font-bold hover:bg-slate-800 transition shadow-xs flex items-center gap-1 shrink-0"
              >
                <Plus className="h-4 w-4" /> Thêm
              </button>
            </form>

            <div className="space-y-2.5">
              {checklist.map((item) => (
                <div 
                  key={item.id}
                  onClick={() => toggleCheck(item.id)}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer transition select-none"
                >
                  <button className="text-slate-400 hover:text-brand-500 transition shrink-0">
                    {item.done ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-500 fill-emerald-50" />
                    ) : (
                      <Square className="h-5 w-5 text-slate-300" />
                    )}
                  </button>
                  <span className={`text-sm font-medium ${item.done ? "line-through text-slate-400" : "text-slate-700"}`}>
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section Right: Urgent System Alerts & Quick Highlights */}
        <div className="space-y-6">
          {/* Urgent Alerts: LOW STOCK */}
          <div className="rounded-2xl border border-rose-100 bg-rose-50/30 p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-rose-600 mb-1">
              <AlertTriangle className="h-5 w-5" />
              <h4 className="font-display font-extrabold text-sm uppercase tracking-wide">Cảnh báo hết nguyên liệu</h4>
            </div>
            
            {lowStockItems.length === 0 ? (
              <p className="text-xs text-slate-600 font-medium">✔️ Tất cả nguyên liệu sơn, bột đều đủ dùng.</p>
            ) : (
              <div className="space-y-2.5">
                {lowStockItems.slice(0, 3).map((item) => (
                  <div key={item.id} className="flex justify-between items-center text-xs bg-white rounded-lg p-2.5 border border-rose-100/50 shadow-2xs">
                    <div>
                      <p className="font-bold text-slate-800">{item.name}</p>
                      <p className="text-[10px] text-slate-400 font-mono">CC: {item.supplier}</p>
                    </div>
                    <span className="font-mono bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded-md font-bold text-[10px]">
                      {item.stockLevel} {item.unit} còn lại
                    </span>
                  </div>
                ))}
                
                <button 
                  onClick={() => setActiveTab("inventory")}
                  className="w-full text-center py-2 text-xs font-bold text-rose-600 hover:text-rose-700 border border-rose-200 bg-white hover:bg-rose-50/50 rounded-xl transition mt-1"
                >
                  Đi tới Kho & Đặt thêm hàng
                </button>
              </div>
            )}
          </div>

          {/* Birthday Clients soon */}
          <div className="rounded-2xl border border-brand-100 bg-brand-50/20 p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-brand-600 mb-1">
              <Cake className="h-5 w-5" />
              <h4 className="font-display font-extrabold text-sm uppercase tracking-wide">Khách Vip đón sinh nhật tuần này</h4>
            </div>

            {birthdayCustomers.length === 0 ? (
              <p className="text-xs text-slate-500 font-medium">Không có khách hàng vip nào đón sinh nhật tuần này.</p>
            ) : (
              <div className="space-y-2.5">
                {birthdayCustomers.map((cust) => {
                  const [, month, day] = cust.birthday.split("-");
                  return (
                    <div key={cust.id} className="flex items-center justify-between bg-white border border-brand-100/30 p-2.5 rounded-lg shadow-2xs">
                      <div>
                        <p className="text-xs font-bold text-slate-800">{cust.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono">Sinh nhật: {day}/{month} • {cust.tier} Member</p>
                      </div>
                      <button 
                        onClick={() => setActiveTab("loyalty")}
                        className="bg-brand-500 hover:bg-brand-600 text-white rounded-lg text-[10px] font-bold px-2 py-1 transition"
                      >
                        Gửi SMS
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Roster Status */}
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xs">
            <h4 className="font-display font-extrabold text-sm text-slate-800 mb-3">Trạng Thái Thợ Hôm Nay</h4>
            <div className="space-y-3">
              {staff.map((st) => {
                // Determine if they have any confirmed/completed booking today
                const staffTodayBookings = todayBookings.filter(b => b.staffId === st.id);
                const hasPendingOrConfirmed = staffTodayBookings.some(b => b.status === "Pending" || b.status === "Confirmed");
                
                return (
                  <div key={st.id} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <img src={st.avatar} alt={st.name} className="h-6 w-6 rounded-full object-cover ring-1 ring-slate-100" referrerPolicy="no-referrer" />
                      <div>
                        <p className="font-bold text-slate-800">{st.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{st.role} • {st.rating}⭐</p>
                      </div>
                    </div>
                    
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      hasPendingOrConfirmed 
                        ? "bg-amber-50 text-amber-600" 
                        : "bg-emerald-50 text-emerald-600"
                    }`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${hasPendingOrConfirmed ? "bg-amber-500" : "bg-emerald-500"}`} />
                      {hasPendingOrConfirmed ? "Đang Làm" : "Sẵn Sàng"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
