import React, { useState } from "react";
import { 
  ClipboardList, 
  User, 
  Search, 
  Plus, 
  Check, 
  Clock, 
  DollarSign, 
  Calendar,
  Layers,
  ArrowRight,
  Sparkles,
  UserCheck,
  Receipt,
  FileSpreadsheet,
  AlertCircle
} from "lucide-react";
import { Customer, Service, Staff, ServiceRecord } from "../types";

interface ServiceRecordsViewProps {
  customers: Customer[];
  services: Service[];
  staff: Staff[];
  records: ServiceRecord[];
  onAddRecord: (record: Omit<ServiceRecord, "id" | "dateTime" | "status">) => void;
  onDeleteRecord: (id: string) => void;
}

export default function ServiceRecordsView({
  customers,
  services,
  staff,
  records,
  onAddRecord,
  onDeleteRecord
}: ServiceRecordsViewProps) {
  // Form states
  const [isWalkIn, setIsWalkIn] = useState(true);
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [walkInName, setWalkInName] = useState("");
  const [selectedStaffId, setSelectedStaffId] = useState(staff[0]?.id || "");
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  
  // Search states
  const [searchCust, setSearchCust] = useState("");
  const [searchService, setSearchService] = useState("");

  const [notice, setNotice] = useState("");

  // Filter customers for dropdown/selection search
  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchCust.toLowerCase()) || 
    c.phone.includes(searchCust)
  );

  // Filter services for selection
  const filteredServices = services.filter(s => 
    s.name.toLowerCase().includes(searchService.toLowerCase()) || 
    s.category.toLowerCase().includes(searchService.toLowerCase())
  );

  // Toggle service selection
  const handleToggleService = (id: string) => {
    if (selectedServiceIds.includes(id)) {
      setSelectedServiceIds(selectedServiceIds.filter(sid => sid !== id));
    } else {
      setSelectedServiceIds([...selectedServiceIds, id]);
    }
  };

  // Submit new service record
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedServiceIds.length === 0) {
      alert("Vui lòng chọn ít nhất 1 dịch vụ!");
      return;
    }

    let customerName = "Walk-In Khách Vãng Lai";
    let customerId = "walk-in-guest";

    if (!isWalkIn) {
      const found = customers.find(c => c.id === selectedCustomerId);
      if (found) {
        customerName = found.name;
        customerId = found.id;
      } else {
        alert("Vui lòng chọn một khách hàng từ danh sách CRM!");
        return;
      }
    } else if (walkInName.trim()) {
      customerName = walkInName.trim() + " (Vãng Lai)";
    }

    const tStaff = staff.find(st => st.id === selectedStaffId);
    const staffName = tStaff ? tStaff.name : "Unassigned";

    onAddRecord({
      customerId,
      customerName,
      staffId: selectedStaffId,
      staffName,
      serviceIds: selectedServiceIds,
      serviceNames: selectedServiceIds.map(id => services.find(s => s.id === id)?.name || "").filter(Boolean).join(" + "),
      amount: selectedServiceIds.reduce((sum, id) => sum + (services.find(s => s.id === id)?.price || 0), 0),
      notes: notes.trim() || undefined
    });

    // Reset Form
    setSelectedServiceIds([]);
    setWalkInName("");
    setNotes("");
    setNotice("✨ Ghi nhận dịch vụ thành công! Bill sẽ xuất hiện khi thanh toán tại Tab Doanh thu.");
    setTimeout(() => setNotice(""), 4500);
  };

  // Quick select customer assistance
  const selectCustomer = (c: Customer) => {
    setSelectedCustomerId(c.id);
    setSearchCust("");
  };

  const getRecordServicesLabel = (rec: ServiceRecord) => {
    return rec.serviceNames;
  };

  const totalUnpaidCount = records.filter(r => r.status === "Unpaid").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-brand-100 text-brand-700 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full">
              Sổ Ghi Doanh Số Thợ
            </span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Ghi Nhận Dịch Vụ Sử Dụng
          </h2>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Chức năng cho Thợ/Lễ tân ghi nhanh các dịch vụ móng đã làm xong cho khách, gom bill và thu tiền sau tại Tab Doanh Thu.
          </p>
        </div>
      </div>

      {notice && (
        <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs font-bold rounded-2xl flex items-center gap-2 shadow-xs transition-all animate-pulse">
          <UserCheck className="h-5 w-5 text-emerald-600 shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 items-start">
        {/* Record Form Panel */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-100 bg-white p-6 shadow-xs space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-50 pb-3">
            <ClipboardList className="h-5 w-5 text-brand-500" />
            <h3 className="font-display text-lg font-bold text-slate-800">Mở Phiếu Ghi Dịch Vụ Mới</h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 text-xs text-slate-700 font-medium font-sans">
            {/* Customer select options */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-550 uppercase tracking-wider block">1. Khách Hàng Phục vụ</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsWalkIn(true)}
                    className={`px-3 py-1.5 rounded-full font-bold border transition ${
                      isWalkIn 
                        ? "bg-slate-900 text-white border-slate-900" 
                        : "bg-slate-50/50 border-slate-100 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    Khách vãng lai / Walk-In
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsWalkIn(false)}
                    className={`px-3 py-1.5 rounded-full font-bold border transition ${
                      !isWalkIn 
                        ? "bg-slate-900 text-white border-slate-900" 
                        : "bg-slate-50/50 border-slate-100 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    Khách Đã Có Ở CRM
                  </button>
                </div>
              </div>

              {isWalkIn ? (
                <div>
                  <input
                    type="text"
                    placeholder="Điền tên khách vãng lai hoặc bỏ trống (ví dụ: Chị Lan, Anh Nam...)"
                    value={walkInName}
                    onChange={e => setWalkInName(e.target.value)}
                    className="w-full rounded-xl border border-slate-250 bg-slate-50/20 px-3.5 py-2.5 text-xs focus:border-brand-400 focus:bg-white focus:outline-hidden font-sans"
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Tìm khách hàng trong hệ thống CRM bằng tên hoặc SĐT..."
                      value={searchCust}
                      onChange={e => setSearchCust(e.target.value)}
                      className="w-full rounded-xl border border-slate-250 bg-slate-50/20 py-2.5 pl-9 pr-3.5 text-xs focus:border-brand-400 focus:bg-white focus:outline-hidden"
                    />
                  </div>

                  {selectedCustomerId ? (
                    <div className="flex items-center justify-between p-3.5 bg-brand-50/40 rounded-xl border border-brand-100/50">
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-full bg-brand-100 flex items-center justify-center text-brand-600">
                          <User className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 text-xs">
                            {customers.find(c => c.id === selectedCustomerId)?.name || "Chưa chọn"}
                          </p>
                          <p className="text-[10px] text-slate-500 font-mono">
                            {customers.find(c => c.id === selectedCustomerId)?.phone}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedCustomerId("")}
                        className="text-xs font-bold text-rose-500 hover:underline"
                      >
                        Hủy Chọn
                      </button>
                    </div>
                  ) : (
                    searchCust && (
                      <div className="border border-slate-100 rounded-xl overflow-hidden shadow-xs max-h-40 overflow-y-auto bg-white">
                        {filteredCustomers.length > 0 ? (
                          filteredCustomers.map(c => (
                            <div
                              key={c.id}
                              onClick={() => selectCustomer(c)}
                              className="px-3.5 py-2 hover:bg-slate-50 cursor-pointer flex items-center justify-between text-xs border-b last:border-0"
                            >
                              <div>
                                <span className="font-bold text-slate-700">{c.name}</span>
                                <span className="ml-2 font-mono text-[10px] text-slate-455">{c.phone}</span>
                              </div>
                              <span className="text-[10px] uppercase font-mono font-bold text-brand-550 px-2 py-0.5 rounded-full bg-brand-50">
                                {c.tier} Member
                              </span>
                            </div>
                          ))
                        ) : (
                          <div className="p-3 text-center text-slate-400 font-bold">Không thấy khách hàng</div>
                        )}
                      </div>
                    )
                  )}
                </div>
              )}
            </div>

            {/* Staff Assignment Picker */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-550 uppercase tracking-wider block">2. Thợ Nails Thực Hiện</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
                {staff.map((st) => (
                  <div
                    key={st.id}
                    onClick={() => setSelectedStaffId(st.id)}
                    className={`p-3 rounded-xl border cursor-pointer flex items-center gap-3 transition-all ${
                      selectedStaffId === st.id
                        ? "border-brand-500 bg-brand-50/20 ring-1 ring-brand-300"
                        : "border-slate-150 hover:bg-slate-50 bg-white"
                    }`}
                  >
                    <div className="h-8 w-8 rounded-full overflow-hidden shrink-0 border border-slate-100">
                      <img src={st.avatar} alt={st.name} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-800 text-xs truncate leading-none mb-1">{st.name}</p>
                      <p className="text-[10px] text-slate-400 truncate">{st.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* List Services checkbox menu */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-550 uppercase tracking-wider block">3. Dịch vụ Thực Hiện (Chọn nhiều)</label>
                <div className="relative w-40">
                  <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Lọc móng tay..."
                    value={searchService}
                    onChange={e => setSearchService(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 py-1 pl-7 pr-2 text-[10px] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-56 overflow-y-auto border border-slate-100 p-2.5 rounded-xl bg-slate-50/30">
                {filteredServices.map((srv) => {
                  const isChecked = selectedServiceIds.includes(srv.id);
                  return (
                    <div
                      key={srv.id}
                      onClick={() => handleToggleService(srv.id)}
                      className={`p-2.5 rounded-lg border cursor-pointer flex items-center justify-between transition-all ${
                        isChecked 
                          ? "border-brand-400 bg-brand-50/30 font-bold" 
                          : "border-slate-100 hover:border-slate-200/50 bg-white"
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div className={`h-4.5 w-4.5 rounded border flex items-center justify-center shrink-0 transition ${
                          isChecked ? "bg-brand-500 border-brand-500 text-white" : "border-slate-250 bg-white"
                        }`}>
                          {isChecked && <Check className="h-3 w-3 stroke-[3]" />}
                        </div>
                        <div className="truncate">
                          <p className="text-slate-800 text-xs leading-tight truncate">{srv.name}</p>
                          <p className="text-[10px] text-slate-400 font-mono leading-none mt-1">{srv.durationMinutes}m • {srv.category}</p>
                        </div>
                      </div>
                      <span className="font-display font-black text-brand-620 text-xs shrink-0">${srv.price}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Notes and action buttons */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-550 uppercase tracking-wider block">4. Ghi Chú Riêng (Form móng, Màu sơn...)</label>
              <textarea
                rows={2}
                placeholder="Yêu cầu thợ làm kĩ da, chọn form Almond, sơn gel nhũ lấp lánh cát..."
                value={notes}
                onChange={e => setNotes(e.target.value)}
                className="w-full rounded-xl border border-slate-250 bg-slate-50/20 px-3.5 py-2.5 text-xs focus:border-brand-400 focus:bg-white focus:outline-hidden"
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
              <div className="flex flex-col text-slate-500 min-w-1/2">
                <span className="text-[10px] uppercase font-bold">Live bill estimation:</span>
                <span className="text-sm font-extrabold text-slate-800">
                  {selectedServiceIds.length} món • <span className="font-display font-extrabold text-brand-600 text-lg">${selectedServiceIds.reduce((sum, id) => sum + (services.find(s => s.id === id)?.price || 0), 0)}</span>
                </span>
              </div>
              <button
                type="submit"
                className="rounded-full bg-brand-500 hover:bg-brand-600 text-white font-extrabold px-6 py-3 shadow-md shadow-brand-500/10 transition active:scale-95 text-xs"
              >
                Ghi Nhận & Đưa Vào Chờ Thanh Toán
              </button>
            </div>
          </form>
        </div>

        {/* Live status of unpaid bills sidebar */}
        <div className="space-y-5">
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-50 pb-3">
              <div className="flex items-center gap-1.5 ">
                <Receipt className="h-5 w-5 text-brand-500" />
                <h4 className="font-display text-base font-bold text-slate-800">Hóa Đơn Sẵn Có Chờ Thu</h4>
              </div>
              <span className="rounded-full bg-rose-50 border border-rose-100 text-rose-600 text-[10px] font-extrabold px-2 py-0.5 font-mono">
                {totalUnpaidCount} Cần tính tiền
              </span>
            </div>

            <div className="space-y-2.5 max-h-[300px] overflow-y-auto">
              {records.filter(r => r.status === "Unpaid").map((rec) => (
                <div 
                  key={rec.id}
                  className="p-3 bg-slate-50/50 rounded-xl border border-slate-100 space-y-1.5 select-none"
                >
                  <div className="flex justify-between items-start gap-2">
                    <span className="font-semibold text-slate-850 truncate leading-none text-xs">{rec.customerName}</span>
                    <span className="font-display font-extrabold text-[#dd3f77] text-xs">${rec.amount}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 truncate leading-tight">
                    {getRecordServicesLabel(rec)}
                  </p>
                  <div className="flex justify-between items-center text-[10px] text-slate-400 font-semibold pt-1 border-t border-slate-100">
                    <span>Thợ: <span className="font-bold text-slate-700">{rec.staffName}</span></span>
                    <button
                      onClick={() => onDeleteRecord(rec.id)}
                      className="text-slate-400 hover:text-red-500 font-extrabold text-[9px] hover:underline"
                    >
                      Bỏ ghi
                    </button>
                  </div>
                </div>
              ))}

              {totalUnpaidCount === 0 && (
                <div className="text-center py-8 text-xs text-slate-400 font-bold font-sans">
                  <AlertCircle className="h-7 w-7 text-slate-300 mx-auto mb-1 stroke-1" />
                  Chưa có phiếu dịch vụ nào đang chờ.
                </div>
              )}
            </div>

            {totalUnpaidCount > 0 && (
              <p className="text-[10px] font-semibold text-slate-455 text-center leading-relaxed">
                👉 Nhấn sang <span className="font-bold text-brand-500">Tab Doanh thu</span>, nhập tên khách hoặc chọn từ hóa đơn ghi sẵn để thanh toán gộp nhanh chóng!
              </p>
            )}
          </div>

          {/* Tips box */}
          <div className="rounded-2xl border border-slate-100 bg-[#fbf9f5] border-gold-200/50 p-5 shadow-xs space-y-2.5">
            <span className="flex items-center gap-1 text-[10px] font-extrabold text-gold-600 uppercase tracking-widest font-mono">
              <Sparkles className="h-3.5 w-3.5 text-gold-500" /> Executive Guide
            </span>
            <p className="text-xs font-semibold text-slate-750 font-sans leading-relaxed">
              Mọi hóa đơn ghi nhận tại đây đều được đồng bộ tự động để tránh thất thoát dịch vụ trong ngày cao điểm. Khi thợ nhấn "Lưu phiếu", hệ thống tự hiển thị danh sách hóa đơn trong bảng tùy chọn của thu ngân.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
