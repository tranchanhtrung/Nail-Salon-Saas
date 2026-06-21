import { motion } from "motion/react";
import { 
  Sparkles, 
  MapPin, 
  Phone, 
  Mail, 
  Award, 
  Star, 
  Scissors, 
  Heart, 
  Compass, 
  ArrowRight,
  UserCheck
} from "lucide-react";
import { Tenant, Service, Staff } from "../types";

interface IntroViewProps {
  currentTenant: Tenant;
  services: Service[];
  staff: Staff[];
  onBookNow: () => void;
}

export default function IntroView({ 
  currentTenant, 
  services, 
  staff, 
  onBookNow 
}: IntroViewProps) {
  // Safe fallbacks for tenant details
  const images = currentTenant.identityImages || [];
  const description = currentTenant.description || "Chào mừng bạn đến với không gian làm đẹp và thư giãn cao cấp của chúng tôi, nơi chất lượng dịch vụ và trải nghiệm tinh tế của khách hàng được đặt lên hàng đầu.";
  const awards = currentTenant.awards || [
    "🏆 Salon Làm Đẹp Tiêu Biểu Trong Năm", 
    "🎖️ Chứng nhận Vệ sinh & An toàn Y tế Quốc tế"
  ];
  const testimonials = currentTenant.testimonials || [
    { guestName: "Minh Anh", text: "Trải nghiệm chăm sóc móng tuyệt vời, nhân viên vô cùng chu đáo và khéo léo. Nhất định sẽ quay lại thường xuyên!", rating: 5 },
    { guestName: "Phương Thảo", text: "Không gian sang trọng thư thái cực kỳ, mi lắp mềm mịn nhẹ tênh không có cảm giác vướng nhột.", rating: 5 }
  ];

  // Group services by category for clean presentation
  const servicesByCategory = services.reduce((acc, service) => {
    const category = service.category || "Dịch vụ khác";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(service);
    return acc;
  }, {} as Record<string, Service[]>);

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-12">
      {/* Hero Section */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#874C67] to-[#5a3245] text-white p-8 md:p-12 shadow-md">
        <div className="relative z-10 max-w-2xl space-y-4">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider text-pink-200"
          >
            <Sparkles className="h-3.5 w-3.5 text-pink-300 animate-spin-slow" />
            Kiệt Tác Làm Đẹp & Thư Giãn
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight"
          >
            Chào Mừng Đến Với <br />
            <span className="text-pink-300 block mt-1">{currentTenant.name}</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-sm md:text-base text-slate-100/90 leading-relaxed font-semibold max-w-lg"
          >
            {description}
          </motion.p>

          {/* Quick contact tags */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-4 pt-2 text-xs font-bold text-slate-200"
          >
            <div className="flex items-center gap-1.5 bg-black/15 px-3 py-1.5 rounded-lg border border-white/5">
              <MapPin className="h-3.5 w-3.5 text-pink-300 shrink-0" />
              <span>{currentTenant.location}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-black/15 px-3 py-1.5 rounded-lg border border-white/5">
              <Phone className="h-3.5 w-3.5 text-pink-300 shrink-0" />
              <span>{currentTenant.phone}</span>
            </div>
            {currentTenant.ownerEmail && (
              <div className="flex items-center gap-1.5 bg-black/15 px-3 py-1.5 rounded-lg border border-white/5">
                <Mail className="h-3.5 w-3.5 text-pink-300 shrink-0" />
                <span className="truncate max-w-[120px] sm:max-w-none">{currentTenant.ownerEmail}</span>
              </div>
            )}
          </motion.div>

          {/* Action button */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="pt-4"
          >
            <button 
              onClick={onBookNow}
              className="px-6 py-3 rounded-xl bg-white text-[#874C67] hover:bg-pink-100 font-extrabold text-sm shadow-lg hover:shadow-xl transition-all hover:scale-103 duration-250 flex items-center gap-2 cursor-pointer"
            >
              Đặt Lịch Trải Nghiệm Ngay 
              <ArrowRight className="h-4 w-4" />
            </button>
          </motion.div>
        </div>

        {/* Floating circles on bg */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-60 h-60 bg-pink-500/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Identity Images Grid */}
      {images.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Compass className="h-5 w-5 text-[#874C67]" />
            <h3 className="font-display text-lg font-bold text-slate-900">Hình ảnh Không Gian & Tác Phẩm</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {images.map((imgUrl, idx) => (
              <motion.div 
                whileHover={{ scale: 1.02 }}
                key={idx} 
                className={`${
                  idx === 0 ? "col-span-2 row-span-2 h-64 md:h-80" : "h-30 md:h-38"
                } relative rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 shadow-xs group`}
              >
                <img 
                  src={imgUrl} 
                  alt={`Salon space ${idx + 1}`} 
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex items-end p-3">
                  <span className="text-[10px] font-bold text-white uppercase tracking-wider">Hình thực tế #{idx + 1}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Awards Section and Testimonials Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Awards List - Left column */}
        <div className="lg:col-span-1 space-y-5">
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-xs">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
              <Award className="h-5 w-5 text-amber-500" />
              <h3 className="font-display text-base font-bold text-slate-900">
                Chứng Nhận & Giải Thưởng
              </h3>
            </div>
            
            <ul className="space-y-3">
              {awards.map((award, idx) => (
                <motion.li 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  key={idx} 
                  className="flex gap-3 items-start p-3 rounded-xl bg-amber-50/40 border border-amber-100/50"
                >
                  <div className="p-1 rounded-lg bg-amber-100 text-amber-700 font-bold shrink-0 self-start text-[14px]">
                    ✨
                  </div>
                  <span className="text-xs font-bold text-slate-700 leading-relaxed">
                    {award}
                  </span>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Quick Stats Summary Card */}
          <div className="rounded-2xl border border-slate-100 bg-gradient-to-tr from-pink-50/30 to-brand-50/10 p-6 shadow-xs space-y-4">
            <h4 className="font-display text-xs font-black text-[#874C67] uppercase tracking-widest">
              Thông Số Vận Hành
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-white rounded-xl border border-slate-100 text-center">
                <span className="block text-2xl font-black text-[#874C67]">{services.length}</span>
                <span className="text-[10px] uppercase font-bold text-slate-400">Dịch Vụ</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-100 text-center">
                <span className="block text-2xl font-black text-slate-800">{staff.length}</span>
                <span className="text-[10px] uppercase font-bold text-slate-400">Nghệ Nhân Thợ</span>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials List - Right columns */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-100 bg-white p-6 shadow-xs h-fit space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
              <h3 className="font-display text-base font-bold text-slate-900">
                Khách Hàng Nói Về Chúng Tôi
              </h3>
            </div>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="h-3 w-3 text-yellow-500 fill-yellow-500" />
              ))}
              <span className="text-[11px] font-extrabold text-slate-500 ml-1">5.0 (Tuyệt đối)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {testimonials.map((testi, idx) => (
              <motion.div 
                whileHover={{ y: -3 }}
                key={idx} 
                className="p-4 rounded-xl border border-slate-100 bg-slate-50/40 relative flex flex-col justify-between shadow-xs"
              >
                <p className="text-xs font-semibold text-slate-650 italic leading-relaxed mb-4">
                  "{testi.text}"
                </p>
                <div className="flex items-center gap-2 pt-2 border-t border-slate-100/50">
                  <div className="h-7 w-7 rounded-full bg-pink-100 text-[#874C67] flex items-center justify-center font-black text-[10px]">
                    {testi.guestName.charAt(0)}
                  </div>
                  <div>
                    <h5 className="text-[11px] font-extrabold text-slate-800">{testi.guestName}</h5>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: testi.rating }).map((_, i) => (
                        <Star key={i} className="h-2 w-2 text-yellow-500 fill-yellow-500" />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Staff Grid Section */}
      {staff.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-[#874C67]" />
            <h3 className="font-display text-lg font-bold text-slate-900 uppercase tracking-tight">Đội Ngũ Nghệ Nhân Tay Nghề Cao</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {staff.map((member) => (
              <motion.div 
                whileHover={{ y: -4 }}
                key={member.id} 
                className="rounded-2xl border border-slate-100 bg-white p-4 text-center shadow-xs group"
              >
                <div className="relative mx-auto mb-3 h-16 w-16 overflow-hidden rounded-full ring-4 ring-slate-50">
                  {member.avatar ? (
                    <img 
                      src={member.avatar} 
                      alt={member.name} 
                      className="h-full w-full object-cover" 
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div 
                      className="h-full w-full flex items-center justify-center font-black text-white text-base"
                      style={{ backgroundColor: member.color || "#874C67" }}
                    >
                      {member.name.charAt(0)}
                    </div>
                  )}
                  {/* Skill Badge based on commission / color */}
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-[#874C67] text-[8px] font-black text-white px-1.5 py-0.5 rounded-full whitespace-nowrap shadow-xs uppercase">
                    ⭐ Master
                  </div>
                </div>
                
                <h4 className="text-xs font-extrabold text-slate-800 truncate" style={{ color: member.color }}>
                  {member.name}
                </h4>
                <p className="text-[10px] font-bold text-slate-400 mt-0.5 whitespace-nowrap">
                  {member.role === "Technician" ? "Thợ Chuyên Môn" : member.role === "Manager" ? "Quản Lý" : "Receptionist"}
                </p>
                
                <div className="mt-3 pt-2.5 border-t border-slate-50 flex justify-center items-center gap-1 text-[9px] font-black text-[#874C67] uppercase tracking-wider">
                  <Scissors className="h-3 w-3 text-pink-400 rotate-45 shrink-0" />
                  <span>Sẵn sàng phục vụ</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Services Price List Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Scissors className="h-5 w-5 text-[#874C67]" />
          <h3 className="font-display text-lg font-bold text-slate-900 uppercase tracking-tight">Thực Đơn Dịch Vụ & Biểu Phí</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(servicesByCategory).map(([category, sList]) => (
            <div key={category} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-xs h-fit">
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-pink-50">
                <div className="h-6 w-1 bg-[#874C67] rounded-full" />
                <h4 className="font-display text-sm font-black text-slate-800 uppercase tracking-wide">
                  {category}
                </h4>
                <span className="text-[10px] font-bold text-[#874C67] bg-pink-50 px-2 py-0.5 rounded-full ml-auto">
                  {sList.length} Dịch vụ
                </span>
              </div>

              <div className="divide-y divide-slate-50">
                {sList.map((service) => (
                  <div key={service.id} className="py-3 flex items-center justify-between gap-4 group">
                    <div className="flex items-start gap-3 overflow-hidden">
                      {service.image && (
                        <div className="h-10 w-12 rounded-lg overflow-hidden border border-slate-100 shrink-0">
                          <img 
                            src={service.image} 
                            alt={service.name} 
                            className="h-full w-full object-cover transition duration-300 group-hover:scale-108"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      )}
                      <div className="overflow-hidden">
                        <p className="text-xs font-bold text-slate-800 group-hover:text-[#874C67] transition-colors truncate">
                          {service.name}
                        </p>
                        <p className="text-[10px] font-bold text-slate-405 mt-0.5 font-mono">
                          ⏱️ {service.durationMinutes} phút
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="block text-xs font-black text-slate-900">
                        ${service.price}
                      </span>
                      <button 
                        onClick={onBookNow}
                        className="text-[9px] font-extrabold text-[#874C67] uppercase tracking-wider hover:underline opacity-0 group-hover:opacity-100 transition-opacity mt-0.5 cursor-pointer"
                      >
                        Chọn đặt ➜
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Google Map Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-[#874C67]" />
          <h3 className="font-display text-lg font-bold text-slate-900 uppercase tracking-tight">Vị Trí Trên Bản Đồ</h3>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <p className="font-bold text-slate-800 text-sm">{currentTenant.name}</p>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-[#874C67] shrink-0" />
                {currentTenant.location}
              </p>
            </div>
            <a 
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(currentTenant.location)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-[#874C67] text-white hover:bg-[#6c3c52] rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer select-none"
            >
              <Compass className="h-3.5 w-3.5" /> Chỉ đường trên Google Maps
            </a>
          </div>

          <div className="w-full h-80 rounded-xl overflow-hidden border border-slate-150 relative bg-slate-50">
            <iframe
              width="100%"
              height="100%"
              style={{ border: 0 }}
              src={`https://maps.google.com/maps?q=${encodeURIComponent(currentTenant.location)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
              allowFullScreen
              loading="lazy"
              title={`Bản đồ vị trí ${currentTenant.name}`}
              className="w-full h-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
