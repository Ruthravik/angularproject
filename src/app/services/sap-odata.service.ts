import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, map, catchError } from 'rxjs/operators';
import { 
  DashboardData, 
  Vendor, 
  QuotationSummary, 
  PurchaseOrderSummary, 
  GoodsReceiptSummary,
  DashboardStats 
} from '../models/vendor.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class SapOdataService {
  // SAP OData Service URLs - Replace with actual SAP system endpoints
  private readonly sapBaseUrl = 'https://your-sap-system.com/sap/opu/odata/sap';
  private readonly vendorServiceUrl = `${this.sapBaseUrl}/ZVendor_SRV`;
  private readonly quotationServiceUrl = `${this.sapBaseUrl}/ZQuotation_SRV`;
  private readonly purchaseOrderServiceUrl = `${this.sapBaseUrl}/ZPurchaseOrder_SRV`;
  private readonly goodsReceiptServiceUrl = `${this.sapBaseUrl}/ZGoodsReceipt_SRV`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHttpHeaders(): HttpHeaders {
    const token = this.authService.getAuthToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'X-Requested-With': 'XMLHttpRequest',
      'DataServiceVersion': '2.0',
      'Accept': 'application/json'
    });
  }

  // Get vendor profile data from SAP
  getVendorProfile(vendorId: string): Observable<Vendor> {
    // In real implementation, this would call SAP OData service
    const url = `${this.vendorServiceUrl}/VendorSet('${vendorId}')`;
    
    // Simulate SAP OData call
    return this.simulateVendorProfile(vendorId).pipe(
      delay(800),
      catchError(error => {
        console.error('Error fetching vendor profile:', error);
        return throwError(() => new Error('Failed to fetch vendor profile from SAP'));
      })
    );
  }

  // Get dashboard data from multiple SAP services
  getDashboardData(vendorId: string): Observable<DashboardData> {
    // In real implementation, this would make parallel calls to multiple SAP OData services
    return this.simulateDashboardData(vendorId).pipe(
      delay(1200),
      catchError(error => {
        console.error('Error fetching dashboard data:', error);
        return throwError(() => new Error('Failed to fetch dashboard data from SAP'));
      })
    );
  }

  // Get quotations for vendor
  getQuotations(vendorId: string, top: number = 10, skip: number = 0): Observable<QuotationSummary[]> {
    const params = new HttpParams()
      .set('$filter', `VendorId eq '${vendorId}'`)
      .set('$top', top.toString())
      .set('$skip', skip.toString())
      .set('$orderby', 'RequestDate desc');

    const url = `${this.quotationServiceUrl}/QuotationSet`;
    
    return this.simulateQuotations(vendorId).pipe(
      delay(600),
      catchError(error => {
        console.error('Error fetching quotations:', error);
        return throwError(() => new Error('Failed to fetch quotations from SAP'));
      })
    );
  }

  // Get purchase orders for vendor
  getPurchaseOrders(vendorId: string, top: number = 10, skip: number = 0): Observable<PurchaseOrderSummary[]> {
    const params = new HttpParams()
      .set('$filter', `VendorId eq '${vendorId}'`)
      .set('$top', top.toString())
      .set('$skip', skip.toString())
      .set('$orderby', 'OrderDate desc');

    const url = `${this.purchaseOrderServiceUrl}/PurchaseOrderSet`;
    
    return this.simulatePurchaseOrders(vendorId).pipe(
      delay(700),
      catchError(error => {
        console.error('Error fetching purchase orders:', error);
        return throwError(() => new Error('Failed to fetch purchase orders from SAP'));
      })
    );
  }

  // Get goods receipts for vendor
  getGoodsReceipts(vendorId: string, top: number = 10, skip: number = 0): Observable<GoodsReceiptSummary[]> {
    const params = new HttpParams()
      .set('$filter', `VendorId eq '${vendorId}'`)
      .set('$top', top.toString())
      .set('$skip', skip.toString())
      .set('$orderby', 'ReceiptDate desc');

    const url = `${this.goodsReceiptServiceUrl}/GoodsReceiptSet`;
    
    return this.simulateGoodsReceipts(vendorId).pipe(
      delay(650),
      catchError(error => {
        console.error('Error fetching goods receipts:', error);
        return throwError(() => new Error('Failed to fetch goods receipts from SAP'));
      })
    );
  }

  // Submit quotation response to SAP
  submitQuotation(quotationId: string, response: any): Observable<any> {
    const url = `${this.quotationServiceUrl}/QuotationSet('${quotationId}')`;
    
    return of({ success: true, message: 'Quotation submitted successfully' }).pipe(
      delay(1000),
      catchError(error => {
        console.error('Error submitting quotation:', error);
        return throwError(() => new Error('Failed to submit quotation to SAP'));
      })
    );
  }

  // Acknowledge purchase order in SAP
  acknowledgePurchaseOrder(poId: string): Observable<any> {
    const url = `${this.purchaseOrderServiceUrl}/PurchaseOrderSet('${poId}')`;
    
    return of({ success: true, message: 'Purchase order acknowledged' }).pipe(
      delay(800),
      catchError(error => {
        console.error('Error acknowledging PO:', error);
        return throwError(() => new Error('Failed to acknowledge purchase order in SAP'));
      })
    );
  }

  // Simulate methods for demo (replace with actual SAP OData calls)
  private simulateVendorProfile(vendorId: string): Observable<Vendor> {
    const currentVendor = this.authService.getCurrentVendor();
    if (currentVendor && currentVendor.vendorId === vendorId) {
      return of(currentVendor);
    }
    return throwError(() => new Error('Vendor not found'));
  }

  private simulateDashboardData(vendorId: string): Observable<DashboardData> {
    const mockData: DashboardData = {
      quotations: [
        {
          id: 'Q001',
          requestDate: new Date('2024-01-15'),
          dueDate: new Date('2024-01-25'),
          status: 'pending',
          amount: 15000,
          currency: 'USD',
          description: 'IT Equipment Supply'
        },
        {
          id: 'Q002',
          requestDate: new Date('2024-01-10'),
          dueDate: new Date('2024-01-20'),
          status: 'submitted',
          amount: 25000,
          currency: 'USD',
          description: 'Office Furniture Package'
        }
      ],
      purchaseOrders: [
        {
          id: 'PO001',
          orderDate: new Date('2024-01-12'),
          deliveryDate: new Date('2024-01-30'),
          status: 'confirmed',
          amount: 18000,
          currency: 'USD',
          items: 15
        },
        {
          id: 'PO002',
          orderDate: new Date('2024-01-08'),
          deliveryDate: new Date('2024-01-25'),
          status: 'shipped',
          amount: 32000,
          currency: 'USD',
          items: 8
        }
      ],
      goodsReceipts: [
        {
          id: 'GR001',
          receiptDate: new Date('2024-01-14'),
          poNumber: 'PO001',
          status: 'partial',
          receivedItems: 10,
          totalItems: 15
        },
        {
          id: 'GR002',
          receiptDate: new Date('2024-01-11'),
          poNumber: 'PO002',
          status: 'complete',
          receivedItems: 8,
          totalItems: 8
        }
      ],
      statistics: {
        totalQuotations: 12,
        pendingQuotations: 3,
        totalPurchaseOrders: 25,
        activePurchaseOrders: 8,
        totalGoodsReceipts: 20,
        pendingGoodsReceipts: 2,
        totalRevenue: 450000,
        currency: 'USD'
      }
    };

    return of(mockData);
  }

  private simulateQuotations(vendorId: string): Observable<QuotationSummary[]> {
    const quotations: QuotationSummary[] = [
      {
        id: 'Q001',
        requestDate: new Date('2024-01-15'),
        dueDate: new Date('2024-01-25'),
        status: 'pending',
        amount: 15000,
        currency: 'USD',
        description: 'IT Equipment Supply - Laptops and Accessories'
      },
      {
        id: 'Q002',
        requestDate: new Date('2024-01-10'),
        dueDate: new Date('2024-01-20'),
        status: 'submitted',
        amount: 25000,
        currency: 'USD',
        description: 'Office Furniture Package - Chairs and Desks'
      },
      {
        id: 'Q003',
        requestDate: new Date('2024-01-05'),
        dueDate: new Date('2024-01-15'),
        status: 'approved',
        amount: 8500,
        currency: 'USD',
        description: 'Networking Equipment - Switches and Routers'
      }
    ];

    return of(quotations);
  }

  private simulatePurchaseOrders(vendorId: string): Observable<PurchaseOrderSummary[]> {
    const purchaseOrders: PurchaseOrderSummary[] = [
      {
        id: 'PO001',
        orderDate: new Date('2024-01-12'),
        deliveryDate: new Date('2024-01-30'),
        status: 'confirmed',
        amount: 18000,
        currency: 'USD',
        items: 15
      },
      {
        id: 'PO002',
        orderDate: new Date('2024-01-08'),
        deliveryDate: new Date('2024-01-25'),
        status: 'shipped',
        amount: 32000,
        currency: 'USD',
        items: 8
      },
      {
        id: 'PO003',
        orderDate: new Date('2024-01-03'),
        deliveryDate: new Date('2024-01-20'),
        status: 'delivered',
        amount: 12500,
        currency: 'USD',
        items: 22
      }
    ];

    return of(purchaseOrders);
  }

  private simulateGoodsReceipts(vendorId: string): Observable<GoodsReceiptSummary[]> {
    const goodsReceipts: GoodsReceiptSummary[] = [
      {
        id: 'GR001',
        receiptDate: new Date('2024-01-14'),
        poNumber: 'PO001',
        status: 'partial',
        receivedItems: 10,
        totalItems: 15
      },
      {
        id: 'GR002',
        receiptDate: new Date('2024-01-11'),
        poNumber: 'PO002',
        status: 'complete',
        receivedItems: 8,
        totalItems: 8
      },
      {
        id: 'GR003',
        receiptDate: new Date('2024-01-09'),
        poNumber: 'PO003',
        status: 'complete',
        receivedItems: 22,
        totalItems: 22
      }
    ];

    return of(goodsReceipts);
  }
}