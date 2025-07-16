export interface Vendor {
  vendorId: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  status: 'active' | 'inactive' | 'pending';
  registrationDate: Date;
  lastLogin?: Date;
}

export interface LoginRequest {
  vendorId: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  token?: string;
  vendor?: Vendor;
  message?: string;
}

export interface DashboardData {
  quotations: QuotationSummary[];
  purchaseOrders: PurchaseOrderSummary[];
  goodsReceipts: GoodsReceiptSummary[];
  statistics: DashboardStats;
}

export interface QuotationSummary {
  id: string;
  requestDate: Date;
  dueDate: Date;
  status: 'pending' | 'submitted' | 'approved' | 'rejected';
  amount: number;
  currency: string;
  description: string;
}

export interface PurchaseOrderSummary {
  id: string;
  orderDate: Date;
  deliveryDate: Date;
  status: 'created' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  amount: number;
  currency: string;
  items: number;
}

export interface GoodsReceiptSummary {
  id: string;
  receiptDate: Date;
  poNumber: string;
  status: 'pending' | 'partial' | 'complete';
  receivedItems: number;
  totalItems: number;
}

export interface DashboardStats {
  totalQuotations: number;
  pendingQuotations: number;
  totalPurchaseOrders: number;
  activePurchaseOrders: number;
  totalGoodsReceipts: number;
  pendingGoodsReceipts: number;
  totalRevenue: number;
  currency: string;
}