import React, { useState } from "react";
import { 
  Search, 
  Plus, 
  Phone, 
  Mail, 
  Calendar, 
  Award, 
  Notebook, 
  DollarSign, 
  UserPlus, 
  Bookmark,
  CheckCircle2,
  ListFilter,
  MapPin,
  Trash2,
  ShieldCheck
} from "lucide-react";
import { Customer } from "../types";

interface CustomersViewProps {
  customers: Customer[];
  onAddCustomer: (customer: Omit<Customer, "id" | "points" | "tier" | "visitCount" | "totalSpent">) => void;
  onUpdateNotes: (customerId: string, notes: string) => void;
  onDeleteCustomer: (customerId: string) => void;
}

export default function CustomersView({ 
  customers, 
  onAddCustomer, 
  onUpdateNotes,
  onDeleteCustomer
}: CustomersViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [tierFilter, setTierFilter] = useState("all");
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(customers[0]?.id || "");
  const [sortBy, setSortBy] = useState<"spent" | "visits" | "name">("spent");

  // Add customer modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newBirthday, setNewBirthday] = useState("1995-01-01");
  const [newAddress, setNewAddress] = useState("");
  const [newNotes, setNewNotes] = useState("");

  const selectedCustomer = customers.find(c => c.id === selectedCustomerId);
  const [editingNotes, setEditingNotes] = useState("");
  const [isEditingNotesMode, setIsEditingNotesMode] = useState(false);

  // Filter clients
  const filteredCustomers = customers.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      c.phone.includes(searchTerm) || 
      c.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTier = tierFilter === "all" || c.tier === tierFilter;
    
    return matchesSearch && matchesTier;
  }).sort((a, b) => {
    if (sortBy === "spent") return b.totalSpent - a.totalSpent;
    if (sortBy === "visits") return b.visitCount - a.visitCount;
    return a.name.localeCompare(b.name);
  });

  const handleAddNewCustomerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newPhone.trim()) return;

    onAddCustomer({
      name: newName,
      phone: newPhone,
      email: newEmail || "client@example.com",
      birthday: newBirthday,
      address: newAddress,
      notes: newNotes,
      lastVisitDate: new Date().toISOString().split("T")[0]
    });

    // Reset Form
    setNewName("");
    setNewPhone("");
    setNewEmail("");
    setNewAddress("");
    setNewNotes("");
    setModalOpen(false);
  };

  const handleSaveNotes = () => {
    if (selectedCustomer) {
      onUpdateNotes(selectedCustomer.id, editingNotes);
      setIsEditingNotesMode(false);
    }
  };

  const startEditNotes = () => {
    if (selectedCustomer) {
      setEditingNotes(selectedCustomer.notes);
      setIsEditingNotesMode(true);
    }
  };

  const getTierColor = (tier: string) => {
    switch(tier) {
      case "Platinum": return "bg-slate-900 text-white border-slate-950";
      case "Gold": return "bg-amber-100 text-amber-800 border-amber-200";
      case "Silver": return "bg-slate-100 text-slate-700 border-slate-200";
      default: return "bg-amber-50 text-amber-700 border-amber-100";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header controls layout and action keys */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-extrabold text-slate-800">Khách Hàng CRM</h2>
          <p className="text-sm text-slate-500">Quản lý lịch sử viếng thăm, ghi chú sở thích & điểm thưởng loyalty</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1.5 self-start sm:self-auto rounded-full bg-slate-900 hover:bg-slate-800 text-sm font-bold text-white px-5 py-3 transition shadow-md active:scale-95"
        >
          <UserPlus className="h-4 w-4" /> Thêm Khách Hàng mới
        </button>
      </div>

      {/* Main double block split panel */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 items-start">
        {/* Left Side: Client directory & filters */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row gap-3.5">
              {/* Search clients input */}
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-3 h-4.5 w-4.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Tìm khách hàng theo tên, SĐT, email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500 font-medium"
                />
              </div>

              {/* Tier Filter and Sort controls */}
              <div className="flex items-center gap-2">
                <select
                  value={tierFilter}
                  onChange={(e) => setTierFilter(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-600 focus:outline-none"
                >
                  <option value="all">Mọi thứ hạng</option>
                  <option value="Bronze">Đồng (Bronze)</option>
                  <option value="Silver">Bạc (Silver)</option>
                  <option value="Gold">Vàng (Gold)</option>
                  <option value="Platinum">Bạch Kim (Plat)</option>
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-600 focus:outline-none"
                >
                  <option value="spent">Chi tiêu nhiều nhất</option>
                  <option value="visits">Số lần ghé nhiều</option>
                  <option value="name">Xếp theo Tên A-Z</option>
                </select>
              </div>
            </div>

            {/* List Table wrapper */}
            <div className="overflow-x-auto rounded-2xl border border-slate-50">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/75 border-b border-slate-100 font-mono font-bold text-slate-400 uppercase tracking-widest text-[10px]">
                    <th className="p-4">Họ và Tên / SĐT</th>
                    <th className="p-4">Hạng / Điểm</th>
                    <th className="p-4 text-center">Lần ghé</th>
                    <th className="p-4 text-right">Tổng Chi Tiêu</th>
                    <th className="p-4 text-right">Ngày ghé cuối</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 font-medium text-slate-700">
                  {filteredCustomers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-400 font-semibold">Chưa tìm thấy khách hàng nào khớp.</td>
                    </tr>
                  ) : (
                    filteredCustomers.map((cust) => {
                      const isSelected = cust.id === selectedCustomerId;
                      return (
                        <tr 
                          key={cust.id}
                          onClick={() => {
                            setSelectedCustomerId(cust.id);
                            setIsEditingNotesMode(false);
                          }}
                          className={`cursor-pointer hover:bg-slate-50/50 transition-all ${
                            isSelected ? "bg-brand-50/20 text-brand-900 border-l-2 border-brand-500" : ""
                          }`}
                        >
                          <td className="p-4">
                            <p className="font-bold text-sm text-slate-850">{cust.name}</p>
                            <p className="text-[10px] text-slate-400 font-mono mt-0.5">{cust.phone}</p>
                          </td>
                          <td className="p-4">
                            <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${getTierColor(cust.tier)}`}>
                              {cust.tier} ({cust.points} đ)
                            </span>
                          </td>
                          <td className="p-4 text-center text-slate-600 font-mono">{cust.visitCount}</td>
                          <td className="p-4 text-right font-bold font-mono text-slate-850">${cust.totalSpent}</td>
                          <td className="p-4 text-right text-slate-400 font-mono">{cust.lastVisitDate}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Side: Detailed Profile Viewer & Note updater */}
        <div className="space-y-4">
          {selectedCustomer ? (
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-xs space-y-5">
              <div className="flex flex-col items-center text-center pb-4 border-b border-slate-50">
                <div className="h-16 w-16 mb-2 rounded-full bg-gradient-to-tr from-brand-600 to-brand-400 text-white font-display text-2xl font-black flex items-center justify-center shadow-md">
                  {selectedCustomer.name.charAt(0)}
                </div>
                <h3 className="font-display text-lg font-extrabold text-slate-800">{selectedCustomer.name}</h3>
                <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${getTierColor(selectedCustomer.tier)}`}>
                  {selectedCustomer.tier} Member
                </span>
              </div>

              {/* Direct Info list */}
              <div className="space-y-3.5 text-xs text-slate-600">
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-slate-400 shrink-0" />
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Điện thoại</p>
                    <p className="font-bold text-slate-800 font-mono">{selectedCustomer.phone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-slate-400 shrink-0" />
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Email</p>
                    <p className="font-semibold text-slate-700 font-mono">{selectedCustomer.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-slate-400 shrink-0" />
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Sinh nhật</p>
                    <p className="font-semibold text-slate-700 font-mono">{selectedCustomer.birthday}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Địa chỉ</p>
                    <p className="font-semibold text-slate-700">{selectedCustomer.address || "Chưa có địa chỉ"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Award className="h-4 w-4 text-slate-400 shrink-0" />
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Điểm Khách Hàng Thân Thiết</p>
                    <p className="font-bold text-brand-600 font-mono">{selectedCustomer.points} Points available</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2.5 border-t border-slate-50">
                  <div className="bg-slate-50 rounded-xl p-3 text-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Tổng chi tiêu</p>
                    <p className="text-lg font-black text-slate-800 font-mono">${selectedCustomer.totalSpent}</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3 text-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Đã làm nails</p>
                    <p className="text-lg font-black text-slate-800 font-mono">{selectedCustomer.visitCount} lần</p>
                  </div>
                </div>
              </div>

              {/* Custom CRM Notes Updater Section */}
              <div className="pt-4 border-t border-slate-50 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-slate-700 font-bold text-xs">
                    <Notebook className="h-4 w-4 text-brand-500" />
                    <span>Sở Thích & Ghi Chú Đặc Biệt</span>
                  </div>
                  {!isEditingNotesMode && (
                    <button 
                      onClick={startEditNotes}
                      className="text-[10px] font-extrabold text-brand-600 hover:text-brand-700 uppercase"
                    >
                      Sửa ý kiến thợ
                    </button>
                  )}
                </div>

                {isEditingNotesMode ? (
                  <div className="space-y-2">
                    <textarea
                      value={editingNotes}
                      onChange={(e) => setEditingNotes(e.target.value)}
                      rows={4}
                      className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500"
                      placeholder="Ghi thói quen nails của khách (Gel mỏng, sấy dũa kỹ móng, thợ ruột Lily...)"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleSaveNotes}
                        className="flex-1 bg-brand-500 hover:bg-brand-600 text-white rounded-lg py-1.5 text-xs font-bold transition flex items-center justify-center gap-1 shadow-xs"
                      >
                        <CheckCircle2 className="h-3 w-3" /> Lưu Ghi Chú
                      </button>
                      <button
                        onClick={() => setIsEditingNotesMode(false)}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg px-3 py-1.5 text-xs font-bold transition"
                      >
                        Hủy
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-amber-50/40 border border-amber-100/30 rounded-xl p-3.5 text-xs text-slate-700 leading-relaxed italic">
                    {selectedCustomer.notes ? (
                      `"${selectedCustomer.notes}"`
                    ) : (
                      <span className="text-slate-400">Chưa có ghi chú đặc biệt nào. Hãy nhấn Sửa để lưu chi tiết giúp thợ nắm ý thích móng của khách!</span>
                    )}
                  </div>
                )}
              </div>

              {/* Store Deletion / QC Compliance Block */}
              <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                  <span>Tuân thủ App Store GDPR</span>
                </div>
                <button
                  onClick={() => {
                    if (window.confirm(`⚠️ Bạn có chắc chắn muốn xóa vĩnh viễn hồ sơ và điểm tích lũy của khách "${selectedCustomer.name}" theo yêu vụ quyền riêng tư và Điều khoản Google/Apple Play? Hành động này không thể hoàn tác.`)) {
                      onDeleteCustomer(selectedCustomer.id);
                    }
                  }}
                  className="text-[10px] font-bold text-rose-500 hover:text-rose-750 flex items-center gap-1 hover:bg-rose-50 px-2.5 py-1.5 rounded-lg transition"
                  title="Xóa dữ liệu khách"
                >
                  <Trash2 className="h-3 w-3" /> Yêu cầu xóa dữ liệu
                </button>
              </div>

            </div>
          ) : (
            <div className="rounded-2xl border border-slate-100 bg-white p-8 text-center text-slate-400 text-xs">
              Vui lòng chọn khách hàng để xem thông tin chi tiết.
            </div>
          )}
        </div>
      </div>

      {/* Add Customer Dialog Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-slate-100 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-50 pb-3">
              <h3 className="font-display text-lg font-extrabold text-slate-800">Thêm Hồ Sơ Khách Nails</h3>
              <button 
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddNewCustomerSubmit} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-500 uppercase">Họ Tên Khách:</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Tiffany Cooper"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 focus:outline-none focus:border-brand-500 font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-500 uppercase">Sđt Liên Lạc:</label>
                <input
                  type="phone"
                  required
                  placeholder="Ví dụ: +1 (650) 321-1182"
                  value={newPhone}
                  onChange={e => setNewPhone(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 focus:outline-none focus:border-brand-500 font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-500 uppercase">Email:</label>
                <input
                  type="email"
                  placeholder="Ví dụ: tiffany@example.com"
                  value={newEmail}
                  onChange={e => setNewEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 focus:outline-none focus:border-brand-500 font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-500 uppercase">Địa chỉ thường trú:</label>
                <input
                  type="text"
                  placeholder="Ví dụ: 123 Luxury Dr, Dallas, TX"
                  value={newAddress}
                  onChange={e => setNewAddress(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 focus:outline-none focus:border-brand-500 font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-500 uppercase">Ngày Sinh Nhật:</label>
                <input
                  type="date"
                  required
                  value={newBirthday}
                  onChange={e => setNewBirthday(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 focus:outline-none focus:border-brand-500 font-medium font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-500 uppercase">Lưu ý, thói quen làm móng:</label>
                <textarea
                  placeholder="Ghi sở thích móng almond, xài thợ Lily ưu tiên, dị ứng chất gì..."
                  value={newNotes}
                  onChange={e => setNewNotes(e.target.value)}
                  rows={2}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 focus:outline-none focus:border-brand-500 font-medium"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold rounded-xl py-3 text-xs transition-all shadow"
              >
                Lưu Thẻ Khách Hàng CRM
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
