import React, { useState, useEffect } from "react";
import { 
  Settings, 
  Building, 
  MapPin, 
  Phone, 
  Mail, 
  User, 
  Scissors, 
  DollarSign, 
  Clock, 
  Plus, 
  Trash2, 
  Users, 
  Check, 
  Image as ImageIcon,
  Palette,
  ShieldCheck,
  Percent,
  Pencil,
  X,
  Upload
} from "lucide-react";
import { Service, Staff, Tenant } from "../types";

// Standard Unsplash images for services
const SERVICE_SUGGESTION_IMAGES = [
  { url: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=500", name: "Classic Red Nails" },
  { url: "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=500", name: "Premium Spa Feet" },
  { url: "https://images.unsplash.com/photo-1632345031435-8797b2d58045?w=500", name: "Acrylic Extension" },
  { url: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500", name: "Creative Nail Art" },
  { url: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=500", name: "Delicate Waxing" },
  { url: "https://images.unsplash.com/photo-1522337094846-8a811135226c?w=500", name: "Relaxing Massage" }
];

// Standard Unsplash avatars for staff
const STAFF_AVATAR_PRESETS = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150", // Female 1
  "https://images.unsplash.com/photo-1544005313-94ddf0fb8004?w=150", // Female 2
  "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=150", // Female 3
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150", // Male 1
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150", // Male 2
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150", // Male 3
];

const CATEGORY_LABELS: Record<string, string> = {
  "Gel": "Sơn Gel Bền Màu",
  "Pedicure": "Chăm Sóc Chân Spa",
  "Acrylic": "Đắp Bột Acrylic",
  "Nail Art": "Vẽ Nghệ Thuật",
  "Waxing": "Waxing Khử Trùng",
  "Other": "Dịch Vụ Khác"
};

const CATEGORY_IMAGES: Record<string, string> = {
  "Gel": "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=500",
  "Pedicure": "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=500",
  "Acrylic": "https://images.unsplash.com/photo-1632345031435-8797b2d58045?w=500",
  "Nail Art": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500",
  "Waxing": "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=500",
  "Other": "https://images.unsplash.com/photo-1522337094846-8a811135226c?w=500"
};

interface SalonSettingsViewProps {
  currentTenant: Tenant;
  services: Service[];
  staff: Staff[];
  onUpdateTenantDetails: (updated: Partial<Tenant>) => void;
  onAddService: (service: Omit<Service, "id"> & { image?: string }) => void;
  onUpdateService: (service: Service) => void;
  onDeleteService: (serviceId: string) => void;
  onAddStaff: (staff: Omit<Staff, "id" | "rating">) => void;
  onUpdateStaff: (staff: Staff) => void;
  onDeleteStaff: (staffId: string) => void;
}

export default function SalonSettingsView({
  currentTenant,
  services,
  staff,
  onUpdateTenantDetails,
  onAddService,
  onUpdateService,
  onDeleteService,
  onAddStaff,
  onUpdateStaff,
  onDeleteStaff
}: SalonSettingsViewProps) {
  // Salon Info form state
  const [salonName, setSalonName] = useState(currentTenant.name);
  const [salonLocation, setSalonLocation] = useState(currentTenant.location);
  const [salonPhone, setSalonPhone] = useState(currentTenant.phone);
  const [salonEmail, setSalonEmail] = useState(currentTenant.ownerEmail);
  const [salonOwner, setSalonOwner] = useState(currentTenant.ownerName);
  const [salonDescription, setSalonDescription] = useState(currentTenant.description || "");
  const [salonAwardsText, setSalonAwardsText] = useState((currentTenant.awards || []).join("\n"));
  
  const initialTestis = currentTenant.testimonials || [];
  const [testiName1, setTestiName1] = useState(initialTestis[0]?.guestName || "");
  const [testiText1, setTestiText1] = useState(initialTestis[0]?.text || "");
  const [testiName2, setTestiName2] = useState(initialTestis[1]?.guestName || "");
  const [testiText2, setTestiText2] = useState(initialTestis[1]?.text || "");

  const [infoSuccess, setInfoSuccess] = useState(false);

  // Sync state when current tenant changes
  useEffect(() => {
    setSalonName(currentTenant.name);
    setSalonLocation(currentTenant.location);
    setSalonPhone(currentTenant.phone);
    setSalonEmail(currentTenant.ownerEmail || "");
    setSalonOwner(currentTenant.ownerName || "");
    setSalonDescription(currentTenant.description || "");
    setSalonAwardsText((currentTenant.awards || []).join("\n"));

    const testis = currentTenant.testimonials || [];
    setTestiName1(testis[0]?.guestName || "");
    setTestiText1(testis[0]?.text || "");
    setTestiName2(testis[1]?.guestName || "");
    setTestiText2(testis[1]?.text || "");
  }, [currentTenant]);

  // Service form state
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [serviceName, setServiceName] = useState("");
  const [serviceCategory, setServiceCategory] = useState<Service["category"]>("Gel");
  const [servicePrice, setServicePrice] = useState("");
  const [serviceDuration, setServiceDuration] = useState("");
  const [serviceImage, setServiceImage] = useState("");
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);

  const [isDraggingService, setIsDraggingService] = useState(false);

  const handleServiceFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setServiceImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleServiceDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingService(true);
  };

  const handleServiceDragLeave = () => {
    setIsDraggingService(false);
  };

  const handleServiceDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingService(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setServiceImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const [isDraggingSalon, setIsDraggingSalon] = useState(false);

  const processSalonFiles = (files: File[]) => {
    const currentImages = currentTenant.identityImages || [];
    if (currentImages.length >= 10) return;

    const imageFiles = files.filter(file => file.type.startsWith("image/"));
    const slotsLeft = 10 - currentImages.length;
    const filesToProcess = imageFiles.slice(0, slotsLeft);

    if (filesToProcess.length === 0) return;

    let processedCount = 0;
    const newBase64s: string[] = [];

    filesToProcess.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          newBase64s.push(event.target.result as string);
        }
        processedCount++;
        if (processedCount === filesToProcess.length) {
          onUpdateTenantDetails({
            identityImages: [...currentImages, ...newBase64s]
          });
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSalonFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      processSalonFiles(Array.from(files));
    }
  };

  const handleSalonDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingSalon(true);
  };

  const handleSalonDragLeave = () => {
    setIsDraggingSalon(false);
  };

  const handleSalonDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingSalon(false);
    const files = e.dataTransfer.files;
    if (files) {
      processSalonFiles(Array.from(files));
    }
  };

  const handleDeleteSalonImage = (indexToDelete: number) => {
    const currentImages = currentTenant.identityImages || [];
    const updatedImages = currentImages.filter((_, idx) => idx !== indexToDelete);
    onUpdateTenantDetails({
      identityImages: updatedImages
    });
  };

  // Staff form state
  const [showStaffForm, setShowStaffForm] = useState(false);
  const [staffName, setStaffName] = useState("");
  const [staffPhone, setStaffPhone] = useState("");
  const [staffRole, setStaffRole] = useState<Staff["role"]>("Technician");
  const [staffCommission, setStaffCommission] = useState("60"); // 60% default
  const [staffColor, setStaffColor] = useState("#EC4899");
  const [staffAvatar, setStaffAvatar] = useState(STAFF_AVATAR_PRESETS[0]);
  const [editingStaffId, setEditingStaffId] = useState<string | null>(null);

  const [isDragging, setIsDragging] = useState(false);

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setStaffAvatar(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setStaffAvatar(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle saving primary salon details
  const handleSaveSalonInfo = (e: React.FormEvent) => {
    e.preventDefault();

    // Parse awards line by line, trim and filter out empties
    const parsedAwards = salonAwardsText
      .split("\n")
      .map(line => line.trim())
      .filter(line => line.length > 0);

    // Build testimonials list
    const updatedTestimonials = [];
    if (testiName1.trim() || testiText1.trim()) {
      updatedTestimonials.push({
        guestName: testiName1.trim() || "Khách Hàng",
        text: testiText1.trim() || "Dịch vụ rất chu đáo!",
        rating: 5
      });
    }
    if (testiName2.trim() || testiText2.trim()) {
      updatedTestimonials.push({
        guestName: testiName2.trim() || "Khách Hàng",
        text: testiText2.trim() || "Không gian sạch sẽ và thoải mái!",
        rating: 5
      });
    }

    onUpdateTenantDetails({
      name: salonName,
      location: salonLocation,
      phone: salonPhone,
      ownerEmail: salonEmail,
      ownerName: salonOwner,
      description: salonDescription,
      awards: parsedAwards,
      testimonials: updatedTestimonials
    });
    setInfoSuccess(true);
    setTimeout(() => setInfoSuccess(false), 3000);
  };

  // Populate service details into form to edit
  const handleEditService = (service: Service) => {
    setServiceName(service.name);
    setServiceCategory(service.category);
    setServicePrice(service.price.toString());
    setServiceDuration(service.durationMinutes.toString());
    setServiceImage((service as any).image || "");
    setEditingServiceId(service.id);
    setShowServiceForm(true);
    // Scroll smoothly to form view on small screens
    const element = document.getElementById("service-form-section");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleCancelEditService = () => {
    setServiceName("");
    setServicePrice("");
    setServiceDuration("");
    setServiceImage("");
    setEditingServiceId(null);
    setShowServiceForm(false);
  };

  // Handle adding or updating service
  const handleCreateService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceName.trim() || !servicePrice || !serviceDuration) return;

    if (editingServiceId) {
      onUpdateService({
        id: editingServiceId,
        name: serviceName.trim(),
        category: serviceCategory,
        price: parseFloat(servicePrice) || 30,
        durationMinutes: parseInt(serviceDuration) || 45,
        image: serviceImage || undefined
      } as any);
      setEditingServiceId(null);
    } else {
      onAddService({
        name: serviceName.trim(),
        category: serviceCategory,
        price: parseFloat(servicePrice) || 30,
        durationMinutes: parseInt(serviceDuration) || 45,
        // Pass dynamic serviceImage if present, or it will fallback to category image
        ...(serviceImage ? { image: serviceImage } : {})
      });
    }

    // Reset service form
    setServiceName("");
    setServicePrice("");
    setServiceDuration("");
    setServiceImage("");
    setShowServiceForm(false);
  };

  // Populate staff details into the form to edit
  const handleEditStaff = (member: Staff) => {
    setStaffName(member.name);
    setStaffPhone(member.phone);
    setStaffRole(member.role);
    setStaffCommission((member.commissionRate * 100).toString());
    setStaffColor(member.color);
    setStaffAvatar(member.avatar);
    setEditingStaffId(member.id);
    setShowStaffForm(true);
    // Scroll smoothly to form view on small screens
    const element = document.getElementById("staff-form-section");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleCancelEditStaff = () => {
    setStaffName("");
    setStaffPhone("");
    setStaffRole("Technician");
    setStaffCommission("60");
    setStaffColor("#EC4899");
    setStaffAvatar(STAFF_AVATAR_PRESETS[0]);
    setEditingStaffId(null);
    setShowStaffForm(false);
  };

  // Handle adding or updating staff member
  const handleCreateStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffName.trim() || !staffPhone.trim()) return;

    if (editingStaffId) {
      const existingMember = staff.find(s => s.id === editingStaffId);
      onUpdateStaff({
        id: editingStaffId,
        name: staffName.trim(),
        phone: staffPhone.trim(),
        role: staffRole,
        commissionRate: parseFloat(staffCommission) / 100 || 0.60,
        color: staffColor,
        avatar: staffAvatar,
        rating: existingMember ? existingMember.rating : 5.0
      });
      setEditingStaffId(null);
    } else {
      onAddStaff({
        name: staffName.trim(),
        phone: staffPhone.trim(),
        role: staffRole,
        commissionRate: parseFloat(staffCommission) / 100 || 0.60,
        color: staffColor,
        avatar: staffAvatar
      });
    }

    // Reset staff form
    setStaffName("");
    setStaffPhone("");
    setStaffRole("Technician");
    setStaffCommission("60");
    setStaffColor("#EC4899");
    setStaffAvatar(STAFF_AVATAR_PRESETS[0]);
    setShowStaffForm(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Title block */}
      <div>
        <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          Thiết Lập Salon Của Bạn
        </h2>
        <p className="text-sm font-medium text-slate-500 mt-1">
          Khai báo thông tin thương hiệu, cập nhật biểu phí dịch vụ, quản lý liên kết hình ảnh minh họa và đội ngũ thợ chuyên môn cao.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column: Salon primary info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-xs relative">
            <div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-50">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-[#874C67]">
                <Building className="h-5 w-5" />
              </div>
              <h3 className="font-display text-base font-bold text-slate-900">
                Thông tin nhận diện tiệm
              </h3>
            </div>

            {infoSuccess && (
              <div className="mb-4 p-3 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-emerald-100">
                <Check className="h-4 w-4 shrink-0" /> Lưu thông tin cài đặt thành công!
              </div>
            )}

            <form onSubmit={handleSaveSalonInfo} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Tên tiệm Nails
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 h-4 text-slate-400">🏢</span>
                  <input
                    type="text"
                    required
                    value={salonName}
                    onChange={(e) => setSalonName(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-9 pr-4 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:border-[#874C67] focus:bg-white focus:outline-hidden transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Địa chỉ Salon
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={salonLocation}
                    onChange={(e) => setSalonLocation(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-9 pr-4 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:border-[#874C67] focus:bg-white focus:outline-hidden transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Số điện thoại Hotline
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={salonPhone}
                    onChange={(e) => setSalonPhone(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-9 pr-4 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:border-[#874C67] focus:bg-white focus:outline-hidden transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Email liên hệ
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={salonEmail}
                    onChange={(e) => setSalonEmail(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-9 pr-4 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:border-[#874C67] focus:bg-white focus:outline-hidden transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Tên Chủ tiệm / Người quản lý
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={salonOwner}
                    onChange={(e) => setSalonOwner(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-9 pr-4 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:border-[#874C67] focus:bg-white focus:outline-hidden transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Mô tả giới thiệu ngắn về tiệm (About Us)
                </label>
                <textarea
                  value={salonDescription}
                  onChange={(e) => setSalonDescription(e.target.value)}
                  placeholder="Kể câu chuyện về hành trình của tiệm, triết lý phục vụ, cam kết chất lượng..."
                  rows={3}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 px-3.5 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:border-[#874C67] focus:bg-white focus:outline-hidden transition resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Giải thưởng & Chứng nhận (Mỗi dòng một giải)
                </label>
                <textarea
                  value={salonAwardsText}
                  onChange={(e) => setSalonAwardsText(e.target.value)}
                  placeholder="🏆 Tiệm Nails Được Yêu Thích Nhất Hoàn Kiếm&#10;🏅 Chứng Nhận Đạt Chuẩn Sức Khỏe Hoa Kỳ"
                  rows={2}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 px-3.5 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:border-[#874C67] focus:bg-white focus:outline-hidden transition resize-none"
                />
              </div>

              {/* Review 1 */}
              <div className="space-y-1.5 border-t border-slate-100 pt-3">
                <label className="block text-[10px] font-bold text-[#874C67] uppercase tracking-wider">
                  Nhận xét nổi bật 1 (Ý kiến khách hàng)
                </label>
                <input
                  type="text"
                  value={testiName1}
                  onChange={(e) => setTestiName1(e.target.value)}
                  placeholder="Tên khách hàng 1 (ví dụ: Chị Linh KOL)"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 px-3.5 text-xs font-semibold text-slate-800 focus:border-[#874C67] focus:bg-white focus:outline-hidden transition"
                />
                <textarea
                  value={testiText1}
                  onChange={(e) => setTestiText1(e.target.value)}
                  placeholder="Nội dung đánh giá khen ngợi..."
                  rows={2}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 px-3 text-xs font-semibold text-slate-800 focus:border-[#874C67] focus:bg-white focus:outline-hidden transition resize-none"
                />
              </div>

              {/* Review 2 */}
              <div className="space-y-1.5 border-t border-slate-100 pt-3 mb-2">
                <label className="block text-[10px] font-bold text-[#874C67] uppercase tracking-wider">
                  Nhận xét nổi bật 2 (Ý kiến khách hàng)
                </label>
                <input
                  type="text"
                  value={testiName2}
                  onChange={(e) => setTestiName2(e.target.value)}
                  placeholder="Tên khách hàng 2 (ví dụ: Chị Vy)"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 px-3.5 text-xs font-semibold text-slate-800 focus:border-[#874C67] focus:bg-white focus:outline-hidden transition"
                />
                <textarea
                  value={testiText2}
                  onChange={(e) => setTestiText2(e.target.value)}
                  placeholder="Nội dung đánh giá khen ngợi..."
                  rows={2}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 px-3 text-xs font-semibold text-slate-800 focus:border-[#874C67] focus:bg-white focus:outline-hidden transition resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-2 rounded-xl bg-[#874C67] text-white hover:bg-[#6c3c52] transition text-xs font-extrabold py-3 shadow-md shadow-brand-100 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Check className="h-4 w-4" /> Lưu Thiết Lập Thư Mục & Nhận Diện
              </button>
            </form>
          </div>

          {/* Card: Salon Identity Images */}
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-50">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-[#874C67]">
                  <ImageIcon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display text-base font-bold text-slate-900">
                    Hình ảnh nhận diện tiệm
                  </h3>
                  <p className="text-[10px] text-slate-400 font-bold">
                    Đã tải lên {(currentTenant.identityImages || []).length}/10 ảnh
                  </p>
                </div>
              </div>
            </div>

            {/* List and Drag & Drop */}
            <div className="space-y-4">
              {/* Image Grid of currently uploaded images */}
              {(currentTenant.identityImages && currentTenant.identityImages.length > 0) && (
                <div className="grid grid-cols-3 gap-2">
                  {currentTenant.identityImages.map((imgBase64, idx) => (
                    <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden border border-slate-150 bg-slate-50 shadow-xs">
                      <img 
                        src={imgBase64} 
                        alt={`Salon identity ${idx + 1}`} 
                        className="h-full w-full object-cover" 
                        referrerPolicy="no-referrer"
                      />
                      <button
                        type="button"
                        onClick={() => handleDeleteSalonImage(idx)}
                        className="absolute top-1 right-1 h-5 w-5 rounded-full bg-rose-600/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-sm hover:bg-rose-700 cursor-pointer"
                        title="Xóa ảnh"
                      >
                        <X className="h-2.5 w-2.5" />
                      </button>
                      <div className="absolute bottom-1 left-1 bg-slate-900/40 backdrop-blur-xs px-1 py-0.5 rounded-sm text-[8px] font-black text-white">
                        #{idx + 1}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Upload Dropzone */}
              {(currentTenant.identityImages || []).length < 10 ? (
                <div 
                  onDragOver={handleSalonDragOver}
                  onDragLeave={handleSalonDragLeave}
                  onDrop={handleSalonDrop}
                  onClick={() => document.getElementById("salon-identity-input")?.click()}
                  className={`border border-dashed rounded-xl p-4 text-center transition cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                    isDraggingSalon 
                      ? "border-brand-500 bg-brand-50/10" 
                      : "border-slate-200 hover:border-brand-300 hover:bg-slate-50/20"
                  }`}
                >
                  <Upload className="h-5 w-5 text-[#874C67] animate-pulse" />
                  <p className="text-[11px] font-bold text-slate-700 leading-tight">
                    Tải ảnh nhận diện tiệm
                  </p>
                  <p className="text-[9px] text-slate-400 leading-normal">
                    Kéo thả hoặc <span className="text-brand-500 underline">chọn từ máy</span> (Tối đa 10 ảnh)
                  </p>
                  <input 
                    id="salon-identity-input"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleSalonFileChange}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="p-3 bg-brand-50/40 rounded-xl text-center border border-brand-100/50">
                  <p className="text-[10.5px] font-bold text-[#874C67]">
                    📸 Đã tải đủ 10 ảnh nhận diện!
                  </p>
                  <p className="text-[9px] text-slate-500 mt-0.5">
                    Xóa bớt ảnh cũ để có thể tải lên thêm hình mới.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-[#FAF9F5] p-5">
            <div className="flex items-center gap-2 mb-2 text-xs font-bold text-[#874C67]">
              <span>🛡️ Chế độ an toàn Sandbox</span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-500 font-sans">
              Các thông số thiết lập trên sẽ ngay lập tức đồng bộ hóa lên giao diện <strong>Client Portal</strong> khi khách hàng truy cập, đồng thời cũng giúp trợ lý <strong>AI Salon Operator</strong> có dữ liệu chính xác để tự động tạo kịch bản chăm sóc khách hàng.
            </p>
          </div>
        </div>

        {/* Right Columns: Services Catalog & Staff Members */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Service Section */}
          <div id="service-form-section" className="rounded-2xl border border-slate-100 bg-white p-6 shadow-xs scroll-mt-6">
            <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-50">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-pink-50 text-brand-500">
                  <Scissors className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display text-base font-bold text-slate-900">
                    Cài đặt Dịch vụ cung cấp ({services.length})
                  </h3>
                  <p className="text-slate-400 text-[11px] font-sans mt-0.5">Biểu giá, thời gian thi triển & ảnh minh họa</p>
                </div>
              </div>

              <button
                onClick={() => {
                  if (editingServiceId) {
                    handleCancelEditService();
                  } else {
                    setShowServiceForm(!showServiceForm);
                  }
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 hover:bg-slate-50 border border-slate-200 rounded-full text-slate-650 transition text-xs font-bold cursor-pointer"
              >
                {showServiceForm ? (editingServiceId ? "Hủy Chỉnh Sửa" : "Đóng Form") : <><Plus className="h-3.5 w-3.5 text-brand-500" /> Thêm nhanh</>}
              </button>
            </div>

            {showServiceForm && (
              <form onSubmit={handleCreateService} className="mb-6 p-4 rounded-xl border border-brand-100 bg-brand-50/20 space-y-4 animate-in slide-in-from-top-3 duration-200">
                {editingServiceId && (
                  <div className="bg-brand-50 border border-brand-200 text-[#874C67] px-3.5 py-2 rounded-lg text-xs font-bold flex items-center justify-between">
                    <span className="flex items-center gap-1.5">📝 Đang chỉnh sửa thông tin dịch vụ</span>
                    <button type="button" onClick={handleCancelEditService} className="text-[#874C67] hover:text-rose-600">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Tên dịch vụ cung cấp
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ví dụ: Đính Đá Nghệ Thuật 3D"
                      value={serviceName}
                      onChange={(e) => setServiceName(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white py-2 px-3 text-xs font-semibold text-slate-800 placeholder:text-slate-450 focus:border-[#874C67] focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Nhóm phân loại
                    </label>
                    <select
                      value={serviceCategory}
                      onChange={(e) => setServiceCategory(e.target.value as any)}
                      className="w-full rounded-lg border border-slate-200 bg-white py-2 px-3 text-xs font-semibold text-slate-800 focus:border-[#874C67]"
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
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Giá tiền niêm yết ($)
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                      <input
                        type="number"
                        required
                        placeholder="45"
                        min="1"
                        value={servicePrice}
                        onChange={(e) => setServicePrice(e.target.value)}
                        className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-7 pr-3 text-xs font-semibold text-slate-800 placeholder:text-slate-450 focus:border-[#874C67]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Thời lượng ước tính (Phút)
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                      <input
                        type="number"
                        required
                        placeholder="30"
                        min="5"
                        value={serviceDuration}
                        onChange={(e) => setServiceDuration(e.target.value)}
                        className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-7 pr-3 text-xs font-semibold text-slate-800 focus:border-[#874C67]"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Hình ảnh minh họa dịch vụ (Tải lên từ thiết bị)
                  </label>
                  
                  <div className="flex flex-col sm:flex-row items-stretch gap-4 p-4 rounded-xl border border-dashed border-slate-200 bg-white shadow-xs">
                    {/* Preview box */}
                    <div className="relative h-20 w-28 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 shrink-0 shadow-inner flex items-center justify-center">
                      {serviceImage ? (
                        <img 
                          src={serviceImage} 
                          alt="Service preview" 
                          className="h-full w-full object-cover" 
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="text-center p-2">
                          <ImageIcon className="h-5 w-5 text-slate-400 mx-auto mb-1 animate-pulse" />
                          <span className="text-[9px] font-bold text-slate-400">Chưa chọn ảnh</span>
                        </div>
                      )}
                    </div>

                    {/* Drag and drop zone */}
                    <div 
                      onDragOver={handleServiceDragOver}
                      onDragLeave={handleServiceDragLeave}
                      onDrop={handleServiceDrop}
                      className={`flex-1 w-full border border-dashed rounded-xl p-3 text-center transition cursor-pointer flex flex-col items-center justify-center gap-1 ${
                        isDraggingService 
                          ? "border-brand-500 bg-brand-50/10" 
                          : "border-slate-200 hover:border-brand-300 hover:bg-slate-50/20"
                      }`}
                      onClick={() => document.getElementById("service-file-input")?.click()}
                    >
                      <Upload className="h-4 w-4 text-[#874C67]" />
                      <p className="text-[10.5px] font-semibold text-slate-700">
                        Kéo thả hình vào đây hoặc <span className="text-brand-500 underline font-bold">chọn từ máy của bạn</span>
                      </p>
                      <p className="text-[8.5px] text-slate-400">
                        PNG, JPG, GIF (Tối ưu tốc độ tải offline)
                      </p>
                      <input 
                        id="service-file-input"
                        type="file"
                        accept="image/*"
                        onChange={handleServiceFileChange}
                        className="hidden"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  {editingServiceId && (
                    <button
                      type="button"
                      onClick={handleCancelEditService}
                      className="rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition text-xs font-bold px-4 py-2.5 cursor-pointer"
                    >
                      Hủy Sửa
                    </button>
                  )}
                  <button
                    type="submit"
                    className="rounded-xl bg-brand-500 text-white hover:bg-brand-600 transition text-xs font-black px-5 py-2.5 shadow-md shadow-brand-500/20 cursor-pointer"
                  >
                    {editingServiceId ? "Lưu Thay Đổi" : "Kích Hoạt Dịch Vụ Mới"}
                  </button>
                </div>
              </form>
            )}

            {/* List Services visually using custom thumbnail images */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[350px] overflow-y-auto pr-1">
              {services.map((service) => {
                const imgSource = (service as any).image || CATEGORY_IMAGES[service.category] || CATEGORY_IMAGES["Other"];
                return (
                  <div 
                    key={service.id}
                    className="flex items-center gap-3.5 p-3 rounded-xl border border-slate-100 hover:border-brand-100 transition duration-250 bg-slate-50/40 relative group"
                  >
                    <div className="h-14 w-14 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                      <img 
                        src={imgSource} 
                        alt={service.name} 
                        className="h-full w-full object-cover group-hover:scale-105 transition"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex-1 overflow-hidden min-w-0">
                      <span className="inline-block bg-[#874C67]/10 text-[#874C67] text-[8.5px] font-black uppercase px-1.5 py-0.5 rounded-sm tracking-wider">
                        {CATEGORY_LABELS[service.category] || service.category}
                      </span>
                      <h4 className="font-display font-extrabold text-xs text-slate-800 truncate mt-0.5">
                        {service.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-1 text-[10px] font-bold text-slate-400 font-mono">
                        <span className="text-[#874C67] font-extrabold">${service.price}</span>
                        <span>•</span>
                        <span>{service.durationMinutes} phút</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleEditService(service)}
                        className="h-8 w-8 flex items-center justify-center text-slate-400 hover:text-brand-600 rounded-lg hover:bg-brand-50/55 transition cursor-pointer"
                        title="Sửa dịch vụ"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteService(service.id)}
                        className="h-8 w-8 flex items-center justify-center text-slate-350 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition cursor-pointer"
                        title="Xóa dịch vụ"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Service Staff Section */}
          <div id="staff-form-section" className="rounded-2xl border border-slate-100 bg-white p-6 shadow-xs scroll-mt-6">
            <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-50">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-500">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display text-base font-bold text-slate-900">
                    Quản lý Thợ & Nhân sự ({staff.length})
                  </h3>
                  <p className="text-slate-400 text-[11px] font-sans mt-0.5">Khai báo phân cấp thợ, cấu hình lương hoa hồng</p>
                </div>
              </div>

              <button
                onClick={() => {
                  if (editingStaffId) {
                    handleCancelEditStaff();
                  } else {
                    setShowStaffForm(!showStaffForm);
                  }
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 hover:bg-slate-50 border border-slate-200 rounded-full text-slate-650 transition text-xs font-bold cursor-pointer"
              >
                {showStaffForm ? (editingStaffId ? "Hủy Chỉnh Sửa" : "Đóng Form") : <><Plus className="h-3.5 w-3.5 text-indigo-550" /> Thêm nhanh</>}
              </button>
            </div>

            {showStaffForm && (
              <form onSubmit={handleCreateStaff} className="mb-6 p-4 rounded-xl border border-indigo-100 bg-indigo-50/10 space-y-4 animate-in slide-in-from-top-3 duration-200">
                {editingStaffId && (
                  <div className="bg-indigo-50 border border-indigo-200 text-indigo-700 px-3.5 py-2 rounded-lg text-xs font-bold flex items-center justify-between">
                    <span className="flex items-center gap-1.5">👥 Đang chỉnh sửa thông tin thợ / nhân sự</span>
                    <button type="button" onClick={handleCancelEditStaff} className="text-indigo-700 hover:text-rose-600">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Họ và Tên thợ
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ví dụ: Amber Nguyen"
                      value={staffName}
                      onChange={(e) => setStaffName(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white py-2 px-3 text-xs font-semibold text-slate-800 focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Số điện thoại thợ
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="+1 (408) 555-0192"
                      value={staffPhone}
                      onChange={(e) => setStaffPhone(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white py-2 px-3 text-xs font-semibold text-slate-800 focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Vị trí công tác
                    </label>
                    <select
                      value={staffRole}
                      onChange={(e) => setStaffRole(e.target.value as any)}
                      className="w-full rounded-lg border border-slate-200 bg-white py-2 px-3 text-xs font-semibold text-slate-800 focus:border-indigo-500"
                    >
                      <option value="Technician">Kỹ Thuật Viên (Technician)</option>
                      <option value="Manager">Quản lý (Manager)</option>
                      <option value="Receptionist">Lễ tân (Receptionist)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Tỷ lệ (%) Hoa Hồng Đặt Lịch (Commission)
                    </label>
                    <div className="relative">
                      <Percent className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                      <input
                        type="number"
                        required
                        placeholder="60"
                        min="1"
                        max="100"
                        value={staffCommission}
                        onChange={(e) => setStaffCommission(e.target.value)}
                        className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-7 pr-3 text-xs font-semibold text-slate-800 focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Chọn màu hiển thị trên lịch
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={staffColor}
                        onChange={(e) => setStaffColor(e.target.value)}
                        className="h-8 w-12 rounded border border-slate-200 cursor-pointer bg-transparent"
                      />
                      <span className="font-mono text-[11px] font-bold text-slate-650">{staffColor}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Avatar thợ / nhân viên (Tải lên từ thiết bị)
                  </label>
                  
                  <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-xl border border-dashed border-slate-200 bg-white shadow-xs">
                    {/* Preview circle */}
                    <div className="relative h-14 w-14 rounded-full overflow-hidden border border-slate-200 bg-slate-50 shrink-0 shadow-inner flex items-center justify-center">
                      {staffAvatar ? (
                        <img 
                          src={staffAvatar} 
                          alt="Avatar preview" 
                          className="h-full w-full object-cover" 
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <User className="h-6 w-6 text-slate-400" />
                      )}
                    </div>

                    {/* Drag and drop zone */}
                    <div 
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={`flex-1 w-full border border-dashed rounded-xl p-4 text-center transition cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                        isDragging 
                          ? "border-indigo-500 bg-indigo-50/20" 
                          : "border-slate-200 hover:border-indigo-300 hover:bg-slate-50/20"
                      }`}
                      onClick={() => document.getElementById("avatar-file-input")?.click()}
                    >
                      <Upload className="h-4 w-4 text-indigo-500" />
                      <p className="text-[11px] font-semibold text-slate-700">
                        Kéo thả hình vào đây hoặc <span className="text-indigo-650 underline font-bold">chọn từ máy của bạn</span>
                      </p>
                      <p className="text-[9px] text-slate-400">
                        Hỗ trợ PNG, JPG, GIF (Tự động lưu trữ offline)
                      </p>
                      <input 
                        id="avatar-file-input"
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarFileChange}
                        className="hidden"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  {editingStaffId && (
                    <button
                      type="button"
                      onClick={handleCancelEditStaff}
                      className="rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition text-xs font-bold px-4 py-2.5 cursor-pointer"
                    >
                      Hủy Sửa
                    </button>
                  )}
                  <button
                    type="submit"
                    className="rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition text-xs font-black px-5 py-2.5 shadow-md shadow-indigo-150 cursor-pointer"
                  >
                    {editingStaffId ? "Cập Nhật Thông Tin" : "Ký Hợp Đồng Thợ Mới"}
                  </button>
                </div>
              </form>
            )}

            {/* List current Staff members with direct action to edit and remove */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[350px] overflow-y-auto pr-1">
              {staff.map((member) => (
                <div 
                  key={member.id}
                  className="flex items-center justify-between p-3.5 border border-slate-100 hover:border-indigo-150 transition bg-slate-50/20 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 rounded-full overflow-hidden shrink-0 border border-slate-100 bg-white">
                      <img src={member.avatar} alt={member.name} className="h-full w-full object-cover" />
                      <span 
                        className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border border-white"
                        style={{ backgroundColor: member.color }}
                        title="Màu đại diện của Thợ"
                      />
                    </div>

                    <div>
                      <h4 className="font-sans font-extrabold text-xs text-slate-800">{member.name}</h4>
                      <div className="flex flex-wrap items-center gap-1.5 text-[9.5px] font-black uppercase text-slate-400 mt-0.5">
                        <span className="text-indigo-600 bg-indigo-50 px-1 py-0.5 rounded-xs">{member.role}</span>
                        <span>•</span>
                        <span className="text-amber-600 bg-amber-50 px-1 py-0.5 rounded-xs">⭐ {member.rating.toFixed(1)}</span>
                        <span>•</span>
                        <span className="text-emerald-600 bg-emerald-50 px-1 py-0.5 rounded-xs">{(member.commissionRate * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleEditStaff(member)}
                      className="h-8 w-8 flex items-center justify-center text-slate-400 hover:text-indigo-650 rounded-lg hover:bg-indigo-50/50 transition cursor-pointer"
                      title="Sửa thông tin nhân sự"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteStaff(member.id)}
                      className="h-8 w-8 flex items-center justify-center text-slate-350 hover:text-rose-650 rounded-lg hover:bg-rose-50 transition cursor-pointer"
                      title="Sa thải nhân sự"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
