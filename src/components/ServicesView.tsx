import React, { useState } from "react";
import { 
  Scissors, 
  Search, 
  Plus, 
  Clock, 
  DollarSign, 
  Tag, 
  Trash2, 
  Info, 
  Sparkles, 
  ArrowLeft,
  X,
  BadgePercent,
  ThumbsUp,
  ShieldCheck,
  Zap,
  Check
} from "lucide-react";
import { Service } from "../types";

interface ServicesViewProps {
  services: Service[];
  onAddService: (service: Omit<Service, "id">) => void;
  onDeleteService: (serviceId: string) => void;
}

// Category cover images for visual polish
const CATEGORY_IMAGES: Record<string, string> = {
  "Gel": "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=500",
  "Pedicure": "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=500",
  "Acrylic": "https://images.unsplash.com/photo-1632345031435-8797b2d58045?w=500",
  "Nail Art": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500",
  "Waxing": "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=500",
  "Other": "https://images.unsplash.com/photo-1522337094846-8a811135226c?w=500"
};

const CATEGORY_LABELS: Record<string, string> = {
  "Gel": "Sơn Gel Bền Màu",
  "Pedicure": "Chăm Sóc Chân Spa",
  "Acrylic": "Đắp Bột Acrylic",
  "Nail Art": "Vẽ Nghệ Thuật",
  "Waxing": "Waxing Khử Trùng",
  "Other": "Dịch Vụ Khác"
};

export default function ServicesView({
  services,
  onAddService,
  onDeleteService
}: ServicesViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  
  // Add service modal states
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState("Gel");
  const [newPrice, setNewPrice] = useState("");
  const [newDuration, setNewDuration] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [noticeMsg, setNoticeMsg] = useState("");

  const categories = ["all", "Gel", "Pedicure", "Acrylic", "Nail Art", "Waxing", "Other"];

  // Filter list
  const filteredServices = services.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || s.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddNewService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newPrice || !newDuration) return;

    onAddService({
      name: newName.trim(),
      category: newCategory,
      price: parseFloat(newPrice) || 30,
      durationMinutes: parseInt(newDuration) || 45
    });

    setNewName("");
    setNewPrice("");
    setNewDuration("");
    setNewDesc("");
    setAddModalOpen(false);

    setNoticeMsg("✔️ Đã cập nhật dịch vụ mới vào menu thành công!");
    setTimeout(() => setNoticeMsg(""), 3000);
  };

  const getServiceImage = (service: Service) => {
    return CATEGORY_IMAGES[service.category] || CATEGORY_IMAGES["Other"];
  };

  const getCategoryLabel = (cat: string) => {
    return CATEGORY_LABELS[cat] || cat;
  };

  return (
    <div className="space-y-6">
      {/* Page Title Section & Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Danh Mục Dịch Vụ
          </h2>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Quản lý bảng giá nail, thời gian thực hiện dịch vụ, liệu trình và chi tiết bảo hành cao cấp.
          </p>
        </div>
        <button
          onClick={() => setAddModalOpen(true)}
          className="flex items-center gap-1.5 self-start sm:self-auto rounded-full bg-brand-500 hover:bg-brand-600 text-sm font-bold text-white px-5 py-3 transition shadow-lg shadow-brand-500/20 active:scale-95"
          id="btn-add-service-trigger"
        >
          <Plus className="h-4 w-4" /> Thêm Dịch Vụ Mới
        </button>
      </div>

      {noticeMsg && (
        <div className="p-3.5 bg-brand-50 border border-brand-100/50 text-brand-600 font-bold text-center rounded-xl text-xs shadow-2xs">
          {noticeMsg}
        </div>
      )}

      {/* Grid Filter Options Panel with Search */}
      <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-center">
          {/* Search Inputs */}
          <div className="relative w-full lg:max-w-md">
            <Search className="absolute left-3.5 top-3 h-4.5 w-4.5 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm tên dịch vụ, nhóm chăm sóc..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-full border border-slate-200/80 bg-slate-50/50 py-2.5 pl-10 pr-4 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:border-brand-300 focus:bg-white focus:outline-hidden transition"
              id="input-service-search"
            />
          </div>

          {/* Quick Selection Filter Tabs */}
          <div className="flex flex-wrap gap-1.5 justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 text-xs font-bold rounded-full border transition-all ${
                  selectedCategory === cat
                    ? "bg-brand-500 border-brand-500 text-white shadow-xs"
                    : "border-slate-100 hover:border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 text-slate-600"
                }`}
              >
                {cat === "all" ? "Tất Cả" : cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid List of Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredServices.map((service) => (
          <div 
            key={service.id}
            className="group overflow-hidden rounded-2xl border border-slate-100 bg-white hover:border-brand-200 shadow-xs hover:shadow-md transition duration-300 flex flex-col"
          >
            {/* Visual Cover Header */}
            <div className="relative h-44 overflow-hidden bg-slate-100">
              <img 
                src={getServiceImage(service)} 
                alt={service.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <span className="absolute left-3.5 top-3.5 rounded-full bg-slate-900/80 backdrop-blur-xs px-2.5 py-1 text-[10px] font-extrabold text-white tracking-wider uppercase">
                {getCategoryLabel(service.category)}
              </span>
              <div className="absolute right-3.5 top-3.5 flex items-center justify-center h-8 w-8 rounded-full bg-white/90 shadow-sm backdrop-blur-xs">
                <Scissors className="h-4 w-4 text-brand-500 scale-x-[-1]" />
              </div>
            </div>

            {/* Core Info Details */}
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-display text-lg font-bold text-slate-800 tracking-tight group-hover:text-brand-500 transition line-clamp-1">
                  {service.name}
                </h3>
                <div className="mt-2.5 flex items-center gap-4 text-xs font-bold text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-slate-300" /> {service.durationMinutes} phút
                  </span>
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-200"></span>
                  <span className="flex items-center gap-1">
                    <Zap className="h-3.5 w-3.5 text-gold-500" /> Premium Polish
                  </span>
                </div>
                <p className="mt-3 text-xs font-medium text-slate-500 line-clamp-2">
                  Liệu trình móng tay luxury sử dụng sơn không độc hại lành tính, tạo độ bám cao, làm móng thon đẹp thướt tha.
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-50 flex items-center justify-between">
                <div>
                  <span className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-widest leading-none">Price Value</span>
                  <span className="font-display text-xl font-extrabold text-brand-600">${service.price}</span>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setSelectedService(service)}
                    className="flex h-8 items-center gap-1 rounded-full border border-slate-100 hover:border-brand-200/50 px-3.5 text-xs font-bold text-slate-600 hover:bg-brand-50 hover:text-brand-600 transition"
                  >
                    Xem Chi Tiết
                  </button>
                  <button
                    onClick={() => onDeleteService(service.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-100 text-slate-400 hover:border-rose-100 hover:bg-rose-50 hover:text-rose-500 transition"
                    title="Xóa dịch vụ"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredServices.length === 0 && (
        <div className="p-16 text-center rounded-2xl border border-dashed border-slate-200 bg-white">
          <Scissors className="h-10 w-10 mx-auto text-slate-300 stroke-1 mb-3" />
          <h4 className="font-display text-base font-bold text-slate-800">Không tìm thấy dịch vụ</h4>
          <p className="text-xs text-slate-500 mt-1">Hãy thử đổi bộ lọc hoặc thêm một loại dịch vụ mới.</p>
        </div>
      )}


      {/* DETAIL DRAWER / OVERLAY MODAL (Matching 'Chi tiết sản phẩm | Luxury Beauty') */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl animate-in fade-in-50 zoom-in-95 duration-200">
            {/* Modal Title and Cancel button */}
            <div className="absolute right-4 top-4 z-10">
              <button
                onClick={() => setSelectedService(null)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900/65 backdrop-blur-xs text-white hover:bg-slate-900 transition shadow-xs"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Premium cover image */}
            <div className="relative h-56 overflow-hidden">
              <img
                src={getServiceImage(selectedService)}
                alt={selectedService.name}
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/20 to-transparent"></div>
              <div className="absolute bottom-5 left-5 right-5 text-white">
                <span className="inline-flex items-center gap-1 rounded-full bg-brand-500/90 backdrop-blur-xs px-2.5 py-1 text-[9px] font-extrabold tracking-widest uppercase mb-1.5">
                  ✨ PREMIUM TREATMENT
                </span>
                <h3 className="font-display text-xl sm:text-2xl font-bold tracking-tight">
                  {selectedService.name}
                </h3>
              </div>
            </div>

            {/* Spec details in a luxury bento format */}
            <div className="p-6 space-y-5">
              <p className="text-xs leading-relaxed text-slate-600 font-medium font-sans">
                Liệu trình móng tay luxury sử dụng sơn không độc hại hữu cơ mang lại vẻ ngoài bóng bẩy bền lâu. Quy trình khử trùng dụng cụ chuẩn y khoa, thoa dưỡng chất collagen sinh học giúp tái tạo tế bào biểu bì, dưỡng ẩm tay mềm mại.
              </p>

              {/* Bento Attributes Table */}
              <div className="grid grid-cols-2 gap-3.5 bg-slate-50/70 p-4 rounded-2xl border border-slate-100">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Phân loại</span>
                  <span className="text-xs font-bold text-slate-800">{getCategoryLabel(selectedService.category)}</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Thời Gian Diễn ra</span>
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-slate-400" /> {selectedService.durationMinutes} phút
                  </span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Đặc điểm / Bảo Hành</span>
                  <span className="text-xs font-bold text-brand-600 flex items-center gap-1">
                    <ShieldCheck className="h-4 w-4 text-brand-500" /> 7 Ngày Dặm Màu Miễn Phí
                  </span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Mức giá liệu trình</span>
                  <span className="text-sm font-display font-extrabold text-slate-900">${selectedService.price}</span>
                </div>
              </div>

              {/* Treatment Value Claims */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Cam Kết Liệu Trình</h4>
                <div className="grid grid-cols-1 gap-2 text-xs font-bold text-slate-600">
                  <div className="flex items-center gap-2">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-50 text-emerald-500">
                      <Check className="h-3 w-3" />
                    </div>
                    <span>Sơn Gel thuần chay nhẹ dịu 100% không chứa formaldeyhde.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-50 text-emerald-500">
                      <Check className="h-3 w-3" />
                    </div>
                    <span>Giữ màu cực bền, dẻo dai sáng bừng lên đến 21 ngày.</span>
                  </div>
                </div>
              </div>

              {/* Close controls */}
              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                <button
                  onClick={() => setSelectedService(null)}
                  className="rounded-full border border-slate-200 hover:bg-slate-50 text-xs font-bold px-5 py-2.5 text-slate-600 transition"
                >
                  Đóng Bảng thông tin
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* ADD SERVICE OPTION MODAL PANEL */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white p-6 shadow-2xl animate-in fade-in-50 zoom-in-95 duration-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-50 pb-3">
              <h3 className="font-display text-lg font-bold text-slate-800">Thêm Dịch Vụ Mới</h3>
              <button 
                onClick={() => setAddModalOpen(false)}
                className="rounded-full p-1 text-slate-400 hover:bg-slate-50 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddNewService} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5">Tên Dịch Vụ *</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Luxury Pedicure Organic"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200/80 px-4 py-2.5 text-xs text-slate-800 focus:border-brand-300 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 font-sans">Nhóm dịch vụ *</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full rounded-xl border border-slate-200/80 px-3 py-2.5 text-xs text-slate-800 bg-white focus:border-brand-300 focus:outline-hidden"
                  >
                    <option value="Gel">Gel</option>
                    <option value="Pedicure">Pedicure</option>
                    <option value="Acrylic">Acrylic</option>
                    <option value="Nail Art">Nail Art</option>
                    <option value="Waxing">Waxing</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 font-sans">Thời Gian (Phút) *</label>
                  <input
                    type="number"
                    required
                    min="5"
                    placeholder="45"
                    value={newDuration}
                    onChange={(e) => setNewDuration(e.target.value)}
                    className="w-full rounded-xl border border-slate-200/80 px-4 py-2.5 text-xs text-slate-800 focus:border-brand-300 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5">Hóa Đơn Giá Trị ($ USD) *</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 font-bold text-xs text-slate-400">$</span>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="45"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="w-full rounded-xl border border-slate-200/80 pl-8 pr-4 py-2.5 text-xs text-slate-800 focus:border-brand-300 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5">Mô Tả Dịch Vụ / Liệu Trình (Tùy chọn)</label>
                <textarea
                  placeholder="Nhập mô tả chi tiết quy trình, nguyên liệu sử dụng và chế độ bảo hành..."
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full rounded-xl border border-slate-200/80 px-4 py-2.5 text-xs text-slate-800 focus:border-brand-300 focus:outline-hidden"
                />
              </div>

              <div className="pt-3 border-t border-slate-50 flex justify-end gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="rounded-full border border-slate-200 px-5 py-2.5 font-bold text-slate-600 hover:bg-slate-50 transition"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-brand-500 hover:bg-brand-600 px-6 py-2.5 font-bold text-white transition shadow-sm"
                >
                  Tạo Dịch Vụ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
