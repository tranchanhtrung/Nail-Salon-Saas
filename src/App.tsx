import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, Scissors, Sparkles, Sliders, Lock } from "lucide-react";

// Types & Mock Data
import { Booking, Customer, Service, Staff, Transaction, InventoryItem, SMSLog, Coupon, BookingStatus, ServiceRecord, Tenant } from "./types";
import { 
  INITIAL_SERVICES, 
  INITIAL_STAFF, 
  INITIAL_CUSTOMERS, 
  INITIAL_BOOKINGS, 
  INITIAL_TRANSACTIONS, 
  INITIAL_INVENTORY, 
  INITIAL_SMS_LOGS, 
  INITIAL_COUPONS 
} from "./mockData";

// Components
import Sidebar from "./components/Sidebar";
import DashboardView from "./components/DashboardView";
import CalendarView from "./components/CalendarView";
import ServicesView from "./components/ServicesView";
import CustomersView from "./components/CustomersView";
import RevenueView from "./components/RevenueView";
import LoyaltySMSView from "./components/LoyaltySMSView";
import InventoryView from "./components/InventoryView";
import AiManagerView from "./components/AiManagerView";
import ServiceRecordsView from "./components/ServiceRecordsView";
import CustomerPortalView from "./components/CustomerPortalView";
import ManagerLoginView from "./components/ManagerLoginView";
import SaasHubView from "./components/SaasHubView";
import BillingView from "./components/BillingView";
import SalonSettingsView from "./components/SalonSettingsView";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [quickBookOpen, setQuickBookOpen] = useState<boolean>(false);

  // Global settings set by SaaS Creator (SuperAdmin)
  const [systemAnnouncement, setSystemAnnouncement] = useState<string>(() => {
    return localStorage.getItem("nailos_system_announcement") || "📢 Chú ý: Hệ thống đang thử nghiệm tính năng trợ lý AI Salon Operator (Gemini-2.0-Flash) hỗ trợ lên kế hoạch marketing tự động.";
  });

  const [auditLogs, setAuditLogs] = useState<{ id: string; event: string; timestamp: string; type: "info" | "success" | "warning" | "danger" }[]>(() => {
    const saved = localStorage.getItem("nailos_saas_audit_logs");
    if (saved) return JSON.parse(saved);
    return [
      {
        id: "log-1",
        event: "Khởi tạo hệ thống quản lý thuê bao SaaS NailOS Sandbox.",
        timestamp: "2026-06-20 09:00:15",
        type: "success"
      },
      {
        id: "log-2",
        event: "Tải cấu hình cơ sở chi nhánh: Luxe Dallas Nails & Fancy Austin.",
        timestamp: "2026-06-20 09:01:00",
        type: "info"
      }
    ];
  });

  // SaaS Tenants & active tenant states
  const [activeTenantId, setActiveTenantId] = useState<string>(() => {
    return localStorage.getItem("nailos_active_tenant_id") || "tenant-1";
  });

  const [tenants, setTenants] = useState<Tenant[]>(() => {
    const saved = localStorage.getItem("nailos_saas_tenants");
    if (saved) return JSON.parse(saved);
    return [
      {
        id: "tenant-1",
        name: "Luxe Dallas Nails",
        ownerName: "Tiffany Nguyen",
        ownerEmail: "tiffany.dallas@luxury-nails.com",
        phone: "+1 (650) 321-1182",
        location: "123 Luxury Dr, Dallas, TX 75201",
        trialStartDate: "2026-05-15", // ~36 days ago (In Trial)
        subscriptionStatus: "Trial",
        registrationDate: "2026-05-15",
        isLocked: false
      },
      {
        id: "tenant-2",
        name: "Fancy Austin Salon",
        ownerName: "Tommy Austin",
        ownerEmail: "tommy.austin@fancy-nails.com",
        phone: "+1 (512) 555-0145",
        location: "789 Congress Ave, Austin, TX 78701",
        trialStartDate: "2026-03-10", // ~102 days ago (Trial Expired!)
        subscriptionStatus: "Trial",
        registrationDate: "2026-03-10",
        isLocked: false
      },
      {
        id: "tenant-3",
        name: "Hanoi Premium Lash & Nail",
        ownerName: "Chanh Trung",
        ownerEmail: "trung.hanoi@premium-nails.vn",
        phone: "+84 (24) 3999-8888",
        location: "15 Hoàn Kiếm, Hà Nội, VN",
        registrationDate: "2026-01-20",
        trialStartDate: "2026-01-20",
        subscriptionStatus: "Active",
        billingPlan: "yearly",
        isLocked: false
      }
    ];
  });

  const [isManagerAuthenticated, setIsManagerAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem("nailos_manager_authenticated");
    return saved === "true";
  });

  // Core CRM States with LocalStorage fallback (Scoped by activeTenantId)
  const [services, setServices] = useState<Service[]>(INITIAL_SERVICES);
  const [staff, setStaff] = useState<Staff[]>(INITIAL_STAFF);
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [smsLogs, setSmsLogs] = useState<SMSLog[]>(INITIAL_SMS_LOGS);
  const [coupons, setCoupons] = useState<Coupon[]>(INITIAL_COUPONS);

  const [serviceRecords, setServiceRecords] = useState<ServiceRecord[]>([
    {
      id: "rec-1",
      customerId: "c1",
      customerName: "Jenny Nguyen",
      staffId: "st1",
      staffName: "Amber Nguyen",
      serviceIds: ["s1", "s6"],
      serviceNames: "Premium Gel Manicure + Nail Art Custom Design",
      amount: 70,
      dateTime: "2026-06-19T10:15:00",
      status: "Unpaid",
      notes: "Thích phối cùng nhũ bạc và đính đá nhỏ ngón đeo nhẫn."
    },
    {
      id: "rec-2",
      customerId: "c3",
      customerName: "Sarah Miller",
      staffId: "st3",
      staffName: "Lily Smith",
      serviceIds: ["s3", "s8"],
      serviceNames: "Signature Combo (Mani + Pedi) + Eyebrow Waxing",
      amount: 103,
      dateTime: "2026-06-19T11:00:00",
      status: "Unpaid",
      notes: "Nước ngâm muối hồng sả tranh ấm nồng nàn dọn da kĩ."
    }
  ]);

  const [appRole, setAppRole] = useState<"superadmin" | "admin" | "customer">(() => {
    const saved = localStorage.getItem("nailos_app_role");
    if (saved === "manager") return "admin";
    return (saved as any) || "customer";
  });

  // Helper log registrar
  const addAuditLog = (event: string, type: "info" | "success" | "warning" | "danger" = "info") => {
    const log = {
      id: "log-" + Math.floor(Math.random() * 1000000),
      event,
      timestamp: new Date().toISOString().replace("T", " ").slice(0, 19),
      type
    };
    setAuditLogs(prev => [log, ...prev]);
  };

  // Sync System properties
  useEffect(() => {
    localStorage.setItem("nailos_system_announcement", systemAnnouncement);
  }, [systemAnnouncement]);

  useEffect(() => {
    localStorage.setItem("nailos_saas_audit_logs", JSON.stringify(auditLogs));
  }, [auditLogs]);

  // Dual role synchronization
  useEffect(() => {
    localStorage.setItem("nailos_app_role", appRole);
  }, [appRole]);

  useEffect(() => {
    localStorage.setItem("nailos_manager_authenticated", isManagerAuthenticated ? "true" : "false");
  }, [isManagerAuthenticated]);

  // Sync Tenants
  useEffect(() => {
    localStorage.setItem("nailos_saas_tenants", JSON.stringify(tenants));
  }, [tenants]);

  // Load and isolate states on activeTenantId change
  useEffect(() => {
    localStorage.setItem("nailos_active_tenant_id", activeTenantId);
    
    const tServices = localStorage.getItem(`nailos_services_${activeTenantId}`);
    setServices(tServices ? JSON.parse(tServices) : INITIAL_SERVICES);

    const tStaff = localStorage.getItem(`nailos_staff_${activeTenantId}`);
    setStaff(tStaff ? JSON.parse(tStaff) : INITIAL_STAFF);

    const tCustomers = localStorage.getItem(`nailos_customers_${activeTenantId}`);
    setCustomers(tCustomers ? JSON.parse(tCustomers) : INITIAL_CUSTOMERS);

    const tBookings = localStorage.getItem(`nailos_bookings_${activeTenantId}`);
    setBookings(tBookings ? JSON.parse(tBookings) : INITIAL_BOOKINGS);

    const tTransactions = localStorage.getItem(`nailos_transactions_${activeTenantId}`);
    setTransactions(tTransactions ? JSON.parse(tTransactions) : INITIAL_TRANSACTIONS);

    const tInventory = localStorage.getItem(`nailos_inventory_${activeTenantId}`);
    setInventory(tInventory ? JSON.parse(tInventory) : INITIAL_INVENTORY);

    const tSmsLogs = localStorage.getItem(`nailos_sms_logs_${activeTenantId}`);
    setSmsLogs(tSmsLogs ? JSON.parse(tSmsLogs) : INITIAL_SMS_LOGS);

    const tCoupons = localStorage.getItem(`nailos_coupons_${activeTenantId}`);
    setCoupons(tCoupons ? JSON.parse(tCoupons) : INITIAL_COUPONS);

    const tServiceRecords = localStorage.getItem(`nailos_service_records_${activeTenantId}`);
    setServiceRecords(tServiceRecords ? JSON.parse(tServiceRecords) : [
      {
        id: "rec-1",
        customerId: "c1",
        customerName: "Jenny Nguyen",
        staffId: "st1",
        staffName: "Amber Nguyen",
        serviceIds: ["s1", "s6"],
        serviceNames: "Premium Gel Manicure + Nail Art Custom Design",
        amount: 70,
        dateTime: "2026-06-19T10:15:00",
        status: "Unpaid",
        notes: "Thích phối cùng nhũ bạc và đính đá nhỏ ngón đeo nhẫn."
      },
      {
        id: "rec-2",
        customerId: "c3",
        customerName: "Sarah Miller",
        staffId: "st3",
        staffName: "Lily Smith",
        serviceIds: ["s3", "s8"],
        serviceNames: "Signature Combo (Mani + Pedi) + Eyebrow Waxing",
        amount: 103,
        dateTime: "2026-06-19T11:00:00",
        status: "Unpaid",
        notes: "Nước ngâm muối hồng sả tranh ấm nồng nàn dọn da kĩ."
      }
    ]);
  }, [activeTenantId]);

  // Sync back to local slots whenever individual states edit
  useEffect(() => {
    localStorage.setItem(`nailos_services_${activeTenantId}`, JSON.stringify(services));
  }, [services, activeTenantId]);

  useEffect(() => {
    localStorage.setItem(`nailos_staff_${activeTenantId}`, JSON.stringify(staff));
  }, [staff, activeTenantId]);

  useEffect(() => {
    localStorage.setItem(`nailos_customers_${activeTenantId}`, JSON.stringify(customers));
  }, [customers, activeTenantId]);

  useEffect(() => {
    localStorage.setItem(`nailos_bookings_${activeTenantId}`, JSON.stringify(bookings));
  }, [bookings, activeTenantId]);

  useEffect(() => {
    localStorage.setItem(`nailos_transactions_${activeTenantId}`, JSON.stringify(transactions));
  }, [transactions, activeTenantId]);

  useEffect(() => {
    localStorage.setItem(`nailos_inventory_${activeTenantId}`, JSON.stringify(inventory));
  }, [inventory, activeTenantId]);

  useEffect(() => {
    localStorage.setItem(`nailos_sms_logs_${activeTenantId}`, JSON.stringify(smsLogs));
  }, [smsLogs, activeTenantId]);

  useEffect(() => {
    localStorage.setItem(`nailos_coupons_${activeTenantId}`, JSON.stringify(coupons));
  }, [coupons, activeTenantId]);

  useEffect(() => {
    localStorage.setItem(`nailos_service_records_${activeTenantId}`, JSON.stringify(serviceRecords));
  }, [serviceRecords, activeTenantId]);

  // SAAS Actions & Helpers
  const getTrialStats = (t: Tenant) => {
    const start = new Date(t.trialStartDate);
    const now = new Date();
    const elapsedDays = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const totalTrialDays = 90;
    const daysRemaining = Math.max(0, totalTrialDays - elapsedDays);
    const isExpired = elapsedDays >= totalTrialDays && t.subscriptionStatus === "Trial";
    return { elapsedDays, daysRemaining, isExpired };
  };

  const handleSelectTenant = (id: string) => {
    setActiveTenantId(id);
    const target = tenants.find(t => t.id === id);
    if (target) {
      addAuditLog(`🔄 Chọn và kết nối thành công dữ diệu chi nhánh: ${target.name}`, "info");
    }
  };

  const handleToggleLockTenant = (id: string) => {
    setTenants(prev => prev.map(t => {
      if (t.id !== id) return t;
      const isLocked = !t.isLocked;
      addAuditLog(
        `${isLocked ? "🔒 Đã đình chỉ" : "🔓 Đã mở khóa khôi phục"} hoạt động chi nhánh đại lý: ${t.name}`,
        isLocked ? "danger" : "success"
      );
      return { ...t, isLocked };
    }));
  };

  const handleAddTenant = (newT: Omit<Tenant, "id" | "registrationDate" | "subscriptionStatus">) => {
    const id = "tenant-" + Math.floor(Math.random() * 10500);
    const tenant: Tenant = {
      ...newT,
      id,
      subscriptionStatus: "Trial",
      isLocked: false,
      registrationDate: new Date().toISOString().split("T")[0]
    };
    setTenants([...tenants, tenant]);
    setActiveTenantId(id);
    addAuditLog(`✨ SuperAdmin khởi tạo đại lý Salon thương mại mới: ${tenant.name} (Trial 90 ngày miễn phí)`, "success");
    setActiveTab("saas-hub"); // land on active saas page
  };

  const handleSubscribeTenant = (id: string, plan: "monthly" | "yearly") => {
    setTenants(prev => prev.map(t => {
      if (t.id !== id) return t;
      addAuditLog(`💵 Nạp phí thành công! Kích hoạt gói ${plan === "monthly" ? "Tháng ($9.9)" : "Năm ($99)"} cho Salon '${t.name}' (Cổng bảo mật Stripe ✓)`, "success");
      return {
        ...t,
        subscriptionStatus: "Active",
        billingPlan: plan
      };
    }));
  };

  const handleResetTrial = (id: string, daysAgo: number) => {
    setTenants(prev => prev.map(t => {
      if (t.id !== id) return t;
      const trialStartDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1050).toISOString().split("T")[0];
      const isExpired = daysAgo >= 90;
      addAuditLog(`⏱️ Điều chỉnh thời gian dùng thử của tiệm '${t.name}' lùi ${daysAgo} ngày trước. Trạng thái: ${isExpired ? "Hết Hạn Dùng Thử ⚠️" : "Gói Trial"}`, "warning");
      return {
        ...t,
        trialStartDate,
        subscriptionStatus: isExpired ? "Trial" : t.subscriptionStatus
      };
    }));
  };

  const currentTenant = tenants.find(t => t.id === activeTenantId) || tenants[0];
  const { elapsedDays, daysRemaining, isExpired: isTrialExpired } = getTrialStats(currentTenant);



  // CRM STATE ACTIONS
  const handleAddBooking = (newBooking: Omit<Booking, "id">) => {
    const bookingId = "b-" + Math.floor(Math.random() * 1000000);
    const booking: Booking = { ...newBooking, id: bookingId };
    setBookings([booking, ...bookings]);
  };

  const handleUpdateBookingStatus = (bookingId: string, status: BookingStatus) => {
    setBookings(prev => prev.map(b => {
      if (b.id !== bookingId) return b;
      
      const oldStatus = b.status;
      const updatedB = { ...b, status };

      // INTERACTIVE TRÌNH PHÁT LOYALTY CRM:
      // If booking was updated to "Completed", auto-record payment checkout & reward client with points!
      if (status === "Completed" && oldStatus !== "Completed") {
        // Record payout transaction
        const txId = "t-" + Math.floor(Math.random() * 1000000);
        const newTx: Transaction = {
          id: txId,
          bookingId: b.id,
          customerId: b.customerId,
          customerName: b.customerName,
          paymentMethod: "Card", // default
          amount: b.price,
          tipAmount: Math.round(b.price * 0.18), // standard 18% tip automation simulation
          staffId: b.staffId,
          dateTime: new Date().toISOString()
        };
        setTransactions(txs => [newTx, ...txs]);

        // Reward customer points (1 USD = 1 Point)
        if (b.customerId !== "custom-guest") {
          setCustomers(custs => custs.map(c => {
            if (c.id !== b.customerId) return c;
            
            const earnedPoints = b.price;
            const newPoints = c.points + earnedPoints;
            const newTotalSpent = c.totalSpent + b.price;
            const newVisitCount = c.visitCount + 1;

            // Compute Loyalty Tier boundaries
            // Bronze < 100, Silver: 100-300, Gold: 300-800, Platinum: 800+
            let tier: Customer["tier"] = "Bronze";
            if (newPoints >= 800) tier = "Platinum";
            else if (newPoints >= 300) tier = "Gold";
            else if (newPoints >= 100) tier = "Silver";

            return {
              ...c,
              points: newPoints,
              totalSpent: newTotalSpent,
              visitCount: newVisitCount,
              tier,
              lastVisitDate: new Date().toISOString().split("T")[0]
            };
          }));
        }
      }

      return updatedB;
    }));
  };

  const handleCheckoutBooking = (
    bookingId: string,
    finalAmount: number,
    tipAmount: number,
    paymentMethod: "Cash" | "Card" | "Apple Pay" | "Gift Card"
  ) => {
    setBookings(prev => prev.map(b => {
      if (b.id !== bookingId) return b;

      const oldStatus = b.status;
      const updatedB = { ...b, status: "Completed" as BookingStatus };

      // Ensure we don't duplicate transactions for the same booking if it was already Completed
      if (oldStatus !== "Completed") {
        const txId = "t-" + Math.floor(Math.random() * 1000000);
        const newTx: Transaction = {
          id: txId,
          bookingId: b.id,
          customerId: b.customerId,
          customerName: b.customerName,
          paymentMethod,
          amount: finalAmount,
          tipAmount,
          staffId: b.staffId,
          dateTime: new Date().toISOString()
        };
        setTransactions(txs => [newTx, ...txs]);

        // Reward customer loyalty points (1 USD spent = 1 point)
        if (b.customerId !== "custom-guest") {
          setCustomers(custs => custs.map(c => {
            if (c.id !== b.customerId) return c;
            
            const earnedPoints = finalAmount;
            const newPoints = c.points + earnedPoints;
            const newTotalSpent = c.totalSpent + finalAmount;
            const newVisitCount = c.visitCount + 1;

            let tier: Customer["tier"] = "Bronze";
            if (newPoints >= 800) tier = "Platinum";
            else if (newPoints >= 300) tier = "Gold";
            else if (newPoints >= 100) tier = "Silver";

            return {
              ...c,
              points: newPoints,
              totalSpent: newTotalSpent,
              visitCount: newVisitCount,
              tier,
              lastVisitDate: new Date().toISOString().split("T")[0]
            };
          }));
        }
      }

      return updatedB;
    }));
  };

  const handleDeleteBooking = (bookingId: string) => {
    setBookings(bookings.filter(b => b.id !== bookingId));
  };

  const handleAddCustomer = (newC: Omit<Customer, "id" | "points" | "tier" | "visitCount" | "totalSpent">) => {
    const customerId = "c-" + Math.floor(Math.random() * 1000000);
    const client: Customer = {
      ...newC,
      id: customerId,
      points: 50, // welcome bonus points!
      tier: "Bronze",
      visitCount: 1,
      totalSpent: 40,
    };
    setCustomers([client, ...customers]);
  };

  const handleDeleteCustomer = (customerId: string) => {
    setCustomers(customers.filter(c => c.id !== customerId));
  };

  const handleUpdateCustomerNotes = (customerId: string, notes: string) => {
    setCustomers(customers.map(c => c.id === customerId ? { ...c, notes } : c));
  };

  const handleAddTransaction = (newTx: Omit<Transaction, "id" | "dateTime">) => {
    const id = "t-" + Math.floor(Math.random() * 1000000);
    const tx: Transaction = {
      ...newTx,
      id,
      dateTime: new Date().toISOString()
    };
    setTransactions([tx, ...transactions]);

    // Also reward points if customer exists in database
    if (newTx.customerId !== "walk-in-guest") {
      setCustomers(custs => custs.map(c => {
        if (c.id !== newTx.customerId) return c;
        const ptsEarned = newTx.amount;
        const points = c.points + ptsEarned;
        const totalSpent = c.totalSpent + newTx.amount;
        
        let tier: Customer["tier"] = "Bronze";
        if (points >= 800) tier = "Platinum";
        else if (points >= 300) tier = "Gold";
        else if (points >= 100) tier = "Silver";

        return { ...c, points, totalSpent, tier };
      }));
    }
  };

  const handleAddCoupon = (newCp: Omit<Coupon, "id" | "active">) => {
    const id = "cp-" + Math.floor(Math.random() * 1000000);
    const coupon: Coupon = { ...newCp, id, active: true };
    setCoupons([coupon, ...coupons]);
  };

  const handleDeleteCoupon = (couponId: string) => {
    setCoupons(coupons.filter(cp => cp.id !== couponId));
  };

  const handleAddServiceRecord = (newRec: Omit<ServiceRecord, "id" | "dateTime" | "status">) => {
    const id = "rec-" + Math.floor(Math.random() * 1000000);
    const record: ServiceRecord = {
      ...newRec,
      id,
      dateTime: new Date().toISOString(),
      status: "Unpaid"
    };
    setServiceRecords([record, ...serviceRecords]);
  };

  const handleDeleteServiceRecord = (id: string) => {
    setServiceRecords(serviceRecords.filter(r => r.id !== id));
  };

  const handlePayServiceRecord = (recordId: string, paymentMethod: "Cash" | "Card" | "Apple Pay" | "Gift Card", tipAmount: number) => {
    setServiceRecords(prev => prev.map(r => {
      if (r.id !== recordId) return r;
      
      const updated = { ...r, status: "Paid" as const };

      const txId = "t-" + Math.floor(Math.random() * 1000000);
      const newTx: Transaction = {
        id: txId,
        bookingId: undefined,
        customerId: r.customerId,
        customerName: r.customerName,
        paymentMethod,
        amount: r.amount,
        tipAmount,
        staffId: r.staffId,
        dateTime: new Date().toISOString()
      };
      
      setTransactions(txs => [newTx, ...txs]);

      if (r.customerId !== "walk-in-guest" && r.customerId !== "custom-guest") {
        setCustomers(custs => custs.map(c => {
          if (c.id !== r.customerId) return c;
          const pointsEarned = r.amount;
          const newPoints = c.points + pointsEarned;
          const newTotalSpent = c.totalSpent + r.amount;
          const newVisitCount = c.visitCount + 1;

          let tier: Customer["tier"] = "Bronze";
          if (newPoints >= 800) tier = "Platinum";
          else if (newPoints >= 300) tier = "Gold";
          else if (newPoints >= 100) tier = "Silver";

          return {
            ...c,
            points: newPoints,
            totalSpent: newTotalSpent,
            visitCount: newVisitCount,
            tier,
            lastVisitDate: new Date().toISOString().split("T")[0]
          };
        }));
      }

      return updated;
    }));
  };

  const handleUpdateStock = (itemId: string, increment: number) => {
    setInventory(inventory.map(item => 
      item.id === itemId 
        ? { ...item, stockLevel: Math.max(0, item.stockLevel + increment) } 
        : item
    ));
  };

  const handleDeleteInventoryItem = (itemId: string) => {
    setInventory(inventory.filter(i => i.id !== itemId));
  };

  const handleAddInventoryItem = (newItem: Omit<InventoryItem, "id">) => {
    const id = "i-" + Math.floor(Math.random() * 1000000);
    const item: InventoryItem = { ...newItem, id };
    setInventory([item, ...inventory]);
  };

  const handleAddService = (newService: Omit<Service, "id">) => {
    const id = "s-" + Math.floor(Math.random() * 1000000);
    const service: Service = { ...newService, id };
    setServices([service, ...services]);
  };

  const handleUpdateService = (updated: Service) => {
    setServices(prev => prev.map(s => s.id === updated.id ? updated : s));
    addAuditLog(`⚙️ Cập nhật dịch vụ: ${updated.name}`, "success");
  };

  const handleDeleteService = (serviceId: string) => {
    setServices(services.filter(s => s.id !== serviceId));
  };

  const handleUpdateTenantDetails = (updatedTenant: Partial<Tenant>) => {
    setTenants(prev => prev.map(t => {
      if (t.id !== activeTenantId) return t;
      addAuditLog(`⚙️ Cập nhật thông tin cấu hình Salon: ${updatedTenant.name || t.name}`, "success");
      return { ...t, ...updatedTenant };
    }));
  };

  const handleAddStaff = (newStaff: Omit<Staff, "id">) => {
    const id = "st-" + Math.floor(Math.random() * 10000);
    const mStaff: Staff = {
      ...newStaff,
      id,
      rating: 5.0
    };
    setStaff(prev => [...prev, mStaff]);
    addAuditLog(`👥 Thêm nhân sự mới: ${newStaff.name}`, "success");
  };

  const handleUpdateStaff = (updated: Staff) => {
    setStaff(prev => prev.map(s => s.id === updated.id ? updated : s));
    addAuditLog(`👥 Cập nhật thông tin thợ: ${updated.name}`, "success");
  };

  const handleDeleteStaff = (staffId: string) => {
    setStaff(prev => prev.filter(s => s.id !== staffId));
    addAuditLog(`👥 Xóa nhân sự ID: ${staffId}`, "warning");
  };

  // Simulated Twilio SMS Sender API interaction
  const handleSendSimulatedSMS = async (log: Omit<SMSLog, "id" | "sentAt" | "status">): Promise<boolean> => {
    try {
      const response = await fetch("/api/sms/send-simulation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(log)
      });

      const resData = await response.json();
      if (resData.success) {
        // Record SMS in state logs list
        const smsId = "sms-" + Math.floor(Math.random() * 1000000);
        const newLog: SMSLog = {
          id: smsId,
          customerName: log.customerName,
          phone: log.phone,
          type: log.type,
          message: log.message,
          status: "Sent",
          sentAt: resData.sentAt || new Date().toISOString()
        };
        setSmsLogs(prev => [newLog, ...prev]);
        return true;
      }
      return false;
    } catch (err) {
      console.error("SMS simulation fail:", err);
      return false;
    }
  };

  // Tab routing elements selector
  const renderActiveView = () => {
    // If trial is expired and they are a Salon Admin, block operational screens so they must upgrade
    if (isTrialExpired && appRole === "admin" && activeTab !== "billing") {
      return (
        <div className="bg-white rounded-3xl border border-rose-100 p-8 sm:p-12 text-center max-w-xl mx-auto space-y-6 shadow-xl animate-in zoom-in-95 duration-200">
          <div className="mx-auto h-16 w-16 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600">
            <Lock className="h-8 w-8 text-rose-600" />
          </div>
          <div className="space-y-2">
            <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-900">
              Bản Dùng Thử Đã Hết Hạn ⚠️
            </h3>
            <p className="text-sm text-slate-500 font-sans leading-relaxed">
              Thời gian dùng thử miễn phí 3 tháng (90 ngày) của salon <strong>{currentTenant.name}</strong> đã kết thúc. Để khôi phục dữ liệu đặt lịch hẹn, CRM chăm sóc thợ và trợ lý ảo AI, vui lòng kết nối thẻ tín dụng và thanh toán phí vận hành phần mềm.
            </p>
          </div>

          <div className="bg-slate-50 rounded-2xl p-4 text-xs font-semibold space-y-2 text-left border border-slate-100">
            <div className="flex justify-between">
              <span>Địa lý tiệm:</span>
              <span className="text-slate-800 font-bold">{currentTenant.name}</span>
            </div>
            <div className="flex justify-between">
              <span>Đã đăng ký ngày:</span>
              <span className="font-mono text-slate-605">{currentTenant.registrationDate}</span>
            </div>
            <div className="flex justify-between">
              <span>Thời gian tích lũy:</span>
              <span className="font-mono text-rose-600 font-bold">{elapsedDays} ngày (Tiêu chuẩn: 90 ngày)</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => setActiveTab("billing")}
              className="flex-1 bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-xs py-3 px-5 rounded-xl uppercase tracking-wider transition shadow-lg shadow-brand-500/20 cursor-pointer"
            >
              💳 Thanh Toán Trực Tiếp ($9.9/tháng)
            </button>
            <button
              onClick={() => {
                setIsManagerAuthenticated(false);
                setAppRole("customer");
              }}
              className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-3 px-5 rounded-xl transition cursor-pointer"
            >
              🔄 Quay Về Cổng Khách Hàng
            </button>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case "saas-hub":
        if (appRole !== "superadmin") {
          return <div className="p-8 text-center text-slate-500 font-bold font-sans">Từ chối truy quyền! Cổng này dành riêng cho SuperAdmin.</div>;
        }
        return (
          <SaasHubView 
            tenants={tenants}
            activeTenantId={activeTenantId}
            onSelectTenant={handleSelectTenant}
            onAddTenant={handleAddTenant}
            onSubscribeTenant={handleSubscribeTenant}
            onResetTrial={handleResetTrial}
            onToggleLockTenant={handleToggleLockTenant}
            systemAnnouncement={systemAnnouncement}
            onChangeSystemAnnouncement={(msg) => setSystemAnnouncement(msg)}
            auditLogs={auditLogs}
          />
        );
      case "billing":
        return (
          <BillingView 
            currentTenant={currentTenant}
            onSubscribeTenant={handleSubscribeTenant}
          />
        );
      case "dashboard":
        return (
          <DashboardView 
            bookings={bookings} 
            customers={customers} 
            inventory={inventory} 
            staff={staff}
            setActiveTab={setActiveTab}
            onQuickBook={() => {
              setActiveTab("calendar");
              setQuickBookOpen(true);
            }}
          />
        );
      case "calendar":
        return (
          <CalendarView 
            bookings={bookings}
            services={services}
            staff={staff}
            customers={customers}
            transactions={transactions}
            onAddBooking={handleAddBooking}
            onUpdateStatus={handleUpdateBookingStatus}
            onDeleteBooking={handleDeleteBooking}
            onCheckoutBooking={handleCheckoutBooking}
            quickBookOpen={quickBookOpen}
            setQuickBookOpen={setQuickBookOpen}
          />
        );
      case "services":
        return (
          <ServicesView 
            services={services}
            onAddService={handleAddService}
            onDeleteService={handleDeleteService}
          />
        );
      case "customers":
        return (
          <CustomersView 
            customers={customers} 
            onAddCustomer={handleAddCustomer} 
            onUpdateNotes={handleUpdateCustomerNotes}
            onDeleteCustomer={handleDeleteCustomer}
          />
        );
      case "revenue":
        return (
          <RevenueView 
            bookings={bookings} 
            staff={staff} 
            transactions={transactions}
            onAddTransaction={handleAddTransaction}
            serviceRecords={serviceRecords}
            onPayServiceRecord={handlePayServiceRecord}
          />
        );
      case "records":
        return (
          <ServiceRecordsView 
            customers={customers}
            services={services}
            staff={staff}
            records={serviceRecords}
            onAddRecord={handleAddServiceRecord}
            onDeleteRecord={handleDeleteServiceRecord}
          />
        );
      case "loyalty":
        return (
          <LoyaltySMSView 
            customers={customers} 
            coupons={coupons} 
            smsLogs={smsLogs}
            onAddCoupon={handleAddCoupon}
            onDeleteCoupon={handleDeleteCoupon}
            onSendSimulatedSMS={handleSendSimulatedSMS}
          />
        );
      case "inventory":
        return (
          <InventoryView 
            inventory={inventory} 
            onAddInventoryItem={handleAddInventoryItem}
            onUpdateStock={handleUpdateStock}
            onDeleteInventoryItem={handleDeleteInventoryItem}
          />
        );
      case "ai":
        return (
          <AiManagerView 
            services={services} 
            staff={staff} 
            customers={customers} 
            bookings={bookings} 
            inventory={inventory}
          />
        );
      case "salon-settings":
        return (
          <SalonSettingsView
            currentTenant={currentTenant}
            services={services}
            staff={staff}
            onUpdateTenantDetails={handleUpdateTenantDetails}
            onAddService={handleAddService}
            onUpdateService={handleUpdateService}
            onDeleteService={handleDeleteService}
            onAddStaff={handleAddStaff}
            onUpdateStaff={handleUpdateStaff}
            onDeleteStaff={handleDeleteStaff}
          />
        );
      default:
        return <div className="p-8 text-center font-bold text-slate-500">Mô hình chưa kích hoạt</div>;
    }
  };

  // Side statistics counts
  const lowStockCount = inventory.filter(i => i.stockLevel < i.minStockLevel).length;
  // Confirmed & Pending are active schedules to do
  const pendingBookingsCount = bookings.filter(b => b.status === "Pending" || b.status === "Confirmed").length;

  // 1. Customer portal gate
  if (appRole === "customer") {
    return (
      <div className="min-h-screen bg-[#FFF5F8] flex flex-col">
        {/* Simple beautiful Header for Client Portal */}
        <header className="flex h-16 items-center justify-between border-b border-pink-100 bg-white px-6 sm:px-8 relative z-35">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#874C67] text-white">
              <Scissors className="h-5 w-5 rotate-45" />
            </div>
            <span className="font-sans font-bold text-sm text-[#874C67] tracking-wider uppercase">
              {currentTenant.name} Portal
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Login button to go back to admin portal */}
            <button
              id="goto-admin-login-btn"
              onClick={() => {
                setAppRole("admin");
                setIsManagerAuthenticated(false);
              }}
              className="rounded-full bg-slate-100 border border-slate-200 hover:bg-slate-200 px-3.5 py-1.5 text-[10.5px] font-extrabold text-slate-700 transition hover:scale-105"
            >
              🔐 Đăng nhập Quản lý
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto max-w-7xl w-full mx-auto px-6 py-6 sm:px-8 sm:py-8">
          <CustomerPortalView
            services={services}
            staff={staff}
            customers={customers}
            coupons={coupons}
            onAddBooking={handleAddBooking}
            onAddCustomer={handleAddCustomer}
            onDeleteCustomer={handleDeleteCustomer}
          />
        </main>
      </div>
    );
  }

  // 2. Authentication Gate for Admin & SuperAdmin
  if (!isManagerAuthenticated) {
    return (
      <ManagerLoginView
        onLoginSuccess={(role) => {
          setAppRole(role);
          setIsManagerAuthenticated(true);
          // Set suitable initial tabs per role
          if (role === "superadmin") {
            setActiveTab("saas-hub");
          } else {
            setActiveTab("dashboard");
          }
        }}
        onSwitchToCustomer={() => {
          setAppRole("customer");
        }}
      />
    );
  }

  return (
    <div className="flex min-h-screen w-full bg-brand-50">
      {/* Sidebar (Fully Responsive drawer on Mobile / Static left column on Desktop) */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isOpen={sidebarOpen} 
        setIsOpen={setSidebarOpen} 
        lowStockCount={lowStockCount}
        pendingBookingsCount={pendingBookingsCount}
        activeTenantName={currentTenant.name}
        activeTenantId={currentTenant.id}
        trialDaysRemaining={daysRemaining}
        isTrialExpired={isTrialExpired}
        appRole={appRole}
      />

      {/* Main Content Layout area */}
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
        {/* Top Header bar with Quick status info */}
        <header className="flex h-16 items-center justify-between border-b border-slate-100 bg-white px-6 sm:px-8 relative z-30">
          <div className="flex items-center gap-3 overflow-hidden max-w-[45%]">
            {/* Hamburger Trigger toggles sidebar drawer on Mobile */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-50 hover:text-slate-800 lg:hidden cursor-pointer"
            >
              <Menu className="h-5.5 w-5.5" />
            </button>
            
            <div className="hidden sm:flex items-center gap-2">
              <span className="inline-flex h-2.5 w-2.5 rounded-full bg-pink-500 animate-pulse"></span>
              <span className="font-sans font-bold text-xs text-slate-605 tracking-wide uppercase truncate">
                {appRole === "superadmin" ? "SaaS Root Management" : `${currentTenant.name} Live Panel`}
              </span>
            </div>

            {/* Broadcast Ribbon Alert */}
            {systemAnnouncement && appRole === "admin" && (
              <div className="hidden lg:flex items-center gap-2 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-xl text-[10.5px] font-bold text-indigo-700 animate-pulse">
                <span className="shrink-0 font-extrabold uppercase bg-indigo-650 text-white px-1.5 py-0.5 rounded text-[8.5px]">TIN SAAS:</span>
                <marquee className="w-48 font-semibold" scrollamount="2.5">{systemAnnouncement}</marquee>
              </div>
            )}
          </div>

          {/* Quick Stats Highlights */}
          <div className="flex items-center gap-4 text-xs font-bold text-slate-500">
            {/* 3-Pill Role Selector Switcher */}
            <div className="flex bg-slate-100 rounded-full p-1 border border-slate-200">
              {appRole === "superadmin" && (
                <button
                  onClick={() => {
                    if (isManagerAuthenticated && appRole === "superadmin") {
                      setAppRole("superadmin");
                    } else {
                      setAppRole("superadmin");
                      setIsManagerAuthenticated(false);
                    }
                  }}
                  className={`px-2.5 py-1 rounded-full text-[9px] sm:text-[10px] font-black transition-all cursor-pointer ${
                    appRole === "superadmin"
                      ? "bg-slate-900 text-white shadow-xs"
                      : "text-slate-500 hover:text-[#874C67]"
                  }`}
                  title="Cổng SuperAdmin (Chủ App)"
                >
                  👑 Chủ App
                </button>
              )}
              <button
                onClick={() => {
                  if (isManagerAuthenticated && appRole === "admin") {
                    setAppRole("admin");
                  } else {
                    setAppRole("admin");
                    setIsManagerAuthenticated(false);
                  }
                }}
                className={`px-2.5 py-1 rounded-full text-[9px] sm:text-[10px] font-black transition-all cursor-pointer ${
                  appRole === "admin"
                    ? "bg-[#874C67] text-white shadow-xs"
                    : "text-slate-500 hover:text-[#874C67]"
                }`}
                title="Cổng Admin (Chủ tiệm Nails)"
              >
                🏢 Chủ Tiệm
              </button>
              <button
                onClick={() => setAppRole("customer")}
                className={`px-2.5 py-1 rounded-full text-[9px] sm:text-[10px] font-black transition-all cursor-pointer ${
                  appRole === "customer"
                    ? "bg-[#874C67] text-white shadow-xs"
                    : "text-slate-500 hover:text-[#874C67]"
                }`}
                title="Cổng khách đặt lịch và tích điểm"
              >
                👥 Khách
              </button>
            </div>

            <div className="hidden md:flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100/50">
              <span className="text-[10pt] text-slate-455 font-mono text-xs">CRM:</span>
              <span className="text-slate-800 font-extrabold">{customers.length} khách</span>
            </div>
            <div className="hidden lg:flex items-center gap-1.5 bg-brand-50 px-3 py-1.5 rounded-full border border-brand-100/30">
              <span className="text-[10pt] text-brand-400 font-mono text-xs">Thợ:</span>
              <span className="text-brand-750 font-extrabold">{staff.length} thợ hoạt động</span>
            </div>

            <button
              id="logout-btn"
              onClick={() => {
                setIsManagerAuthenticated(false);
                setAppRole("customer");
              }}
              className="rounded-full bg-rose-50 px-3 py-1.5 text-[11px] font-extrabold text-rose-700 hover:bg-rose-100 border border-rose-200 transition active:scale-95 flex items-center gap-1 cursor-pointer"
              title="Đăng xuất khỏi tài khoản Quản lý"
            >
              🚪 Đăng xuất
            </button>
          </div>
        </header>

        {/* Tab content view container with Motion spring animations */}
        <main className="flex-1 overflow-y-auto px-6 py-6 sm:px-8 sm:py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="w-full max-w-7xl mx-auto"
            >
              {renderActiveView()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
