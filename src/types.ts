export interface Service {
  id: string;
  name: string;
  category: "Manicure" | "Pedicure" | "Gel" | "Acrylic" | "Nail Art" | "Waxing" | "Other";
  price: number;
  durationMinutes: number;
}

export interface Staff {
  id: string;
  name: string;
  phone: string;
  role: "Technician" | "Manager" | "Receptionist";
  rating: number;
  commissionRate: number; // e.g. 0.60 for 60/40 split
  color: string; // Hex color for calendar representation
  avatar: string;
}

export type BookingStatus = "Pending" | "Confirmed" | "Completed" | "Cancelled" | "No Show";

export interface Booking {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  serviceId: string;
  serviceName: string;
  staffId: string;
  staffName: string;
  dateTime: string; // ISO String (e.g., 2026-06-19T10:00:00)
  status: BookingStatus;
  price: number;
  notes?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  birthday: string; // YYYY-MM-DD
  address?: string; // Client address
  points: number;
  tier: "Bronze" | "Silver" | "Gold" | "Platinum";
  notes: string;
  visitCount: number;
  totalSpent: number;
  lastVisitDate: string;
}

export interface Transaction {
  id: string;
  bookingId?: string;
  customerId: string;
  customerName: string;
  paymentMethod: "Cash" | "Card" | "Apple Pay" | "Gift Card";
  amount: number;
  tipAmount: number;
  staffId: string;
  dateTime: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: "Gel Color" | "Acrylic Powder" | "Tools" | "Chemicals" | "Accessories";
  stockLevel: number;
  minStockLevel: number;
  unit: string;
  supplier: string;
}

export interface SMSLog {
  id: string;
  customerName: string;
  phone: string;
  type: "Reminder 24h" | "Booking Confirmed" | "Miss You Offer" | "Birthday Wish" | "Promotion";
  message: string;
  status: "Sent" | "Failed";
  sentAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: "Percent" | "Fixed";
  discountValue: number;
  minSpend: number;
  expiryDate: string;
  active: boolean;
}

export interface ServiceRecord {
  id: string;
  customerId: string;
  customerName: string;
  staffId: string;
  staffName: string;
  serviceIds: string[];
  serviceNames: string;
  amount: number;
  dateTime: string;
  status: "Unpaid" | "Paid";
  notes?: string;
}

export interface Tenant {
  id: string;
  name: string;
  ownerName: string;
  ownerEmail: string;
  phone: string;
  location: string;
  trialStartDate: string; // YYYY-MM-DD
  subscriptionStatus: "Trial" | "Active" | "Expired";
  billingPlan?: "monthly" | "yearly";
  registrationDate: string; // YYYY-MM-DD
  isLocked?: boolean; // Blocked or suspended by SuperAdmin
  identityImages?: string[];
}

