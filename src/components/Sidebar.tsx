import { 
  LayoutDashboard, 
  Calendar as CalendarIcon, 
  Users, 
  DollarSign, 
  Package, 
  HeartHandshake, 
  Brain, 
  Scissors,
  X,
  ClipboardList,
  Building2,
  Lock,
  CreditCard,
  ShieldAlert,
  Crown,
  Settings
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  lowStockCount: number;
  pendingBookingsCount: number;
  activeTenantName: string;
  activeTenantId: string;
  trialDaysRemaining: number;
  isTrialExpired: boolean;
  appRole: "superadmin" | "admin" | "customer";
}

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  isOpen, 
  setIsOpen,
  lowStockCount,
  pendingBookingsCount,
  activeTenantName,
  activeTenantId,
  trialDaysRemaining,
  isTrialExpired,
  appRole
}: SidebarProps) {

  // Dynamic menu items setup
  const getMenuItems = () => {
    if (appRole === "superadmin") {
      return [
        { 
          id: "saas-hub", 
          label: "SaaS Multi-Salon ✨", 
          icon: Building2,
          badge: "Super"
        },
        { id: "ai", label: "AI Operator Toàn Sàn", icon: Brain, isPremium: true },
      ];
    } else {
      // Salon Admin Items
      return [
        { id: "dashboard", label: "Bảng tổng quan", icon: LayoutDashboard },
        { 
          id: "calendar", 
          label: "Lịch hẹn", 
          icon: CalendarIcon, 
          badge: pendingBookingsCount > 0 ? pendingBookingsCount : undefined,
          badgeColor: "bg-brand-500 text-white"
        },
        { id: "services", label: "Bảng giá Dịch vụ", icon: Scissors },
        { id: "records", label: "Ghi nhận Dịch vụ", icon: ClipboardList },
        { id: "revenue", label: "Doanh thu & Thợ", icon: DollarSign },
        { id: "customers", label: "Khách hàng CRM", icon: Users },
        { id: "loyalty", label: "Loyalty & Marketing", icon: HeartHandshake },
        { 
          id: "inventory", 
          label: "Kho nguyên liệu", 
          icon: Package,
          badge: lowStockCount > 0 ? lowStockCount : undefined,
          badgeColor: "bg-amber-500 text-white"
        },
        { id: "ai", label: "AI Salon Operator", icon: Brain, isPremium: true },
        { id: "salon-settings", label: "Thiết lập Salon", icon: Settings },
        { 
          id: "billing", 
          label: "Thuê bao & Bản quyền", 
          icon: CreditCard,
          badge: isTrialExpired ? "Hết hạn" : `${trialDaysRemaining}d`,
          badgeColor: isTrialExpired ? "bg-rose-500 text-white text-[10px]" : "bg-emerald-500 text-white text-[10px]"
        }
      ];
    }
  };

  const menuItems = getMenuItems();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden transition-all duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-100 bg-white px-5 py-6 transition-all duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header with dynamic badge */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#874C67] text-white shadow-md shadow-brand-100">
              {appRole === "superadmin" ? (
                <Crown className="h-5.5 w-5.5 text-amber-300" />
              ) : (
                <Scissors className="h-5.5 w-5.5 rotate-45" />
              )}
            </div>
            <div>
              <h1 className="font-display text-lg font-extrabold tracking-tight text-[#874C67]">
                NailOS SaaS
              </h1>
              <span className={`inline-flex items-center rounded-sm px-1.5 py-0.5 text-[8.5px] font-extrabold uppercase tracking-wider ${
                appRole === "superadmin" 
                  ? "bg-amber-100 text-amber-800 border border-amber-200"
                  : "bg-pink-100 text-[#874C67] border border-pink-200"
              }`}>
                {appRole === "superadmin" ? "🛡️ SuperAdmin Console" : "🏢 Salon Admin Menu"}
              </span>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-50 hover:text-slate-650 lg:hidden cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsOpen(false);
                }}
                className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-[#874C67]/10 text-[#874C67] font-bold shadow-2xs"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <div className="flex items-center gap-3">
                  <IconComponent className={`h-5 w-5 ${isActive ? "text-[#874C67]" : "text-slate-400"}`} />
                  <span className="font-sans font-semibold text-xs sm:text-sm">{item.label}</span>
                  {item.isPremium && (
                    <span className="inline-flex items-center rounded-full bg-slate-900 px-1.5 py-0.5 text-[8.5px] font-extrabold text-slate-100 uppercase tracking-widest leading-none scale-90">
                      AI ⚡
                    </span>
                  )}
                </div>
                {item.badge && (
                  <span className={`rounded-xl px-2 py-0.5 text-[10px] font-bold leading-none ${
                    item.badgeColor || "bg-[#874C67] text-white"
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Foot Profile Area with active details */}
        <div className="mt-auto border-t border-slate-100 pt-5 space-y-3">
          <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3.5 border border-slate-100">
            <div className="h-9 w-9 overflow-hidden rounded-full ring-2 ring-[#874C67]/20 shrink-0">
              <img 
                src={
                  appRole === "superadmin" 
                    ? "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100" 
                    : "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100"
                }
                alt="Account Avatar" 
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="overflow-hidden">
              <p className="truncate text-xs font-black text-slate-900">
                {appRole === "superadmin" ? "SaaS Root Admin" : activeTenantName}
              </p>
              <p className="truncate text-[10px] font-bold text-slate-400 font-mono">
                {appRole === "superadmin" ? "Role: Chủ Sàn App" : `Salon ID: ${activeTenantId}`}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between px-1 text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider">
            <span>NailOS Platform</span>
            <span>v3.5.0 Sandbox</span>
          </div>
        </div>
      </aside>
    </>
  );
}
