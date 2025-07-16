import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil, interval } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { SapOdataService } from '../../services/sap-odata.service';
import { 
  Vendor, 
  DashboardData, 
  QuotationSummary, 
  PurchaseOrderSummary, 
  GoodsReceiptSummary 
} from '../../models/vendor.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  currentVendor: Vendor | null = null;
  dashboardData: DashboardData | null = null;
  isLoading = true;
  currentTime = new Date();
  greeting = '';
  
  // Chart data
  revenueChartData: any[] = [];
  statusChartData: any[] = [];
  
  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private sapOdataService: SapOdataService
  ) {}

  ngOnInit(): void {
    this.loadVendorData();
    this.startRealTimeUpdates();
    this.updateGreeting();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadVendorData(): void {
    this.authService.currentVendor$
      .pipe(takeUntil(this.destroy$))
      .subscribe(vendor => {
        this.currentVendor = vendor;
        if (vendor) {
          this.loadDashboardData(vendor.vendorId);
        }
      });
  }

  private loadDashboardData(vendorId: string): void {
    this.isLoading = true;
    
    this.sapOdataService.getDashboardData(vendorId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.dashboardData = data;
          this.prepareChartData();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading dashboard data:', error);
          this.isLoading = false;
        }
      });
  }

  private startRealTimeUpdates(): void {
    // Update current time every second
    interval(1000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.currentTime = new Date();
        this.updateGreeting();
      });

    // Refresh dashboard data every 5 minutes
    interval(300000) // 5 minutes
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        if (this.currentVendor) {
          this.loadDashboardData(this.currentVendor.vendorId);
        }
      });
  }

  private updateGreeting(): void {
    const hour = this.currentTime.getHours();
    if (hour < 12) {
      this.greeting = 'Good Morning';
    } else if (hour < 17) {
      this.greeting = 'Good Afternoon';
    } else {
      this.greeting = 'Good Evening';
    }
  }

  private prepareChartData(): void {
    if (!this.dashboardData) return;

    // Revenue trend (mock data for demo)
    this.revenueChartData = [
      { name: 'Jan', value: 120000 },
      { name: 'Feb', value: 150000 },
      { name: 'Mar', value: 180000 },
      { name: 'Apr', value: 160000 },
      { name: 'May', value: 220000 },
      { name: 'Jun', value: this.dashboardData.statistics.totalRevenue }
    ];

    // Status distribution
    this.statusChartData = [
      { name: 'Completed', value: this.dashboardData.statistics.totalPurchaseOrders - this.dashboardData.statistics.activePurchaseOrders },
      { name: 'Active', value: this.dashboardData.statistics.activePurchaseOrders },
      { name: 'Pending', value: this.dashboardData.statistics.pendingQuotations }
    ];
  }

  getStatusBadgeClass(status: string): string {
    const statusClasses: { [key: string]: string } = {
      'pending': 'badge warning',
      'submitted': 'badge warning',
      'approved': 'badge success',
      'rejected': 'badge error',
      'created': 'badge warning',
      'confirmed': 'badge success',
      'shipped': 'badge success',
      'delivered': 'badge success',
      'cancelled': 'badge error',
      'partial': 'badge warning',
      'complete': 'badge success'
    };
    return statusClasses[status] || 'badge';
  }

  formatCurrency(amount: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(new Date(date));
  }

  refreshData(): void {
    if (this.currentVendor) {
      this.loadDashboardData(this.currentVendor.vendorId);
    }
  }

  viewQuotationDetails(quotation: QuotationSummary): void {
    // Navigate to quotation details
    console.log('View quotation details:', quotation);
  }

  viewPurchaseOrderDetails(po: PurchaseOrderSummary): void {
    // Navigate to purchase order details
    console.log('View PO details:', po);
  }

  viewGoodsReceiptDetails(gr: GoodsReceiptSummary): void {
    // Navigate to goods receipt details
    console.log('View GR details:', gr);
  }

  logout(): void {
    this.authService.logout();
  }
}