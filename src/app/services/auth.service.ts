import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay, map, catchError } from 'rxjs/operators';
import { LoginRequest, LoginResponse, Vendor } from '../models/vendor.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentVendorSubject = new BehaviorSubject<Vendor | null>(null);
  public currentVendor$ = this.currentVendorSubject.asObservable();
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  
  // SAP OData endpoint - Replace with actual SAP system URL
  private sapODataUrl = 'https://your-sap-system.com/sap/opu/odata/sap/ZVendor_SRV';
  
  constructor() {
    // Check if user is already logged in from localStorage
    this.checkExistingSession();
  }

  private checkExistingSession(): void {
    const token = localStorage.getItem('vendor_token');
    const vendorData = localStorage.getItem('vendor_data');
    
    if (token && vendorData) {
      try {
        const vendor = JSON.parse(vendorData);
        this.currentVendorSubject.next(vendor);
        this.isAuthenticatedSubject.next(true);
      } catch (error) {
        this.logout();
      }
    }
  }

  login(loginRequest: LoginRequest): Observable<LoginResponse> {
    // Simulate API call to SAP system via Process Orchestration
    // In real implementation, this would call your backend API
    // which then calls SAP through Process Orchestration
    
    return this.simulateSAPLogin(loginRequest).pipe(
      delay(1500), // Simulate network delay
      map(response => {
        if (response.success && response.vendor && response.token) {
          // Store authentication data
          localStorage.setItem('vendor_token', response.token);
          localStorage.setItem('vendor_data', JSON.stringify(response.vendor));
          
          // Update observables
          this.currentVendorSubject.next(response.vendor);
          this.isAuthenticatedSubject.next(true);
        }
        return response;
      }),
      catchError(error => {
        console.error('Login error:', error);
        return throwError(() => new Error('Login failed. Please try again.'));
      })
    );
  }

  logout(): void {
    // Clear local storage
    localStorage.removeItem('vendor_token');
    localStorage.removeItem('vendor_data');
    
    // Update observables
    this.currentVendorSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  getCurrentVendor(): Vendor | null {
    return this.currentVendorSubject.value;
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  getAuthToken(): string | null {
    return localStorage.getItem('vendor_token');
  }

  // Simulate SAP login validation
  private simulateSAPLogin(loginRequest: LoginRequest): Observable<LoginResponse> {
    // Mock vendor data - In real implementation, this comes from SAP ERP
    const mockVendors: { [key: string]: { password: string; vendor: Vendor } } = {
      'V001': {
        password: 'password123',
        vendor: {
          vendorId: 'V001',
          companyName: 'Tech Solutions Ltd.',
          contactPerson: 'John Smith',
          email: 'john.smith@techsolutions.com',
          phone: '+1-555-0123',
          address: {
            street: '123 Business Ave',
            city: 'New York',
            state: 'NY',
            country: 'USA',
            postalCode: '10001'
          },
          status: 'active',
          registrationDate: new Date('2020-01-15'),
          lastLogin: new Date()
        }
      },
      'V002': {
        password: 'vendor456',
        vendor: {
          vendorId: 'V002',
          companyName: 'Global Suppliers Inc.',
          contactPerson: 'Sarah Johnson',
          email: 'sarah.johnson@globalsuppliers.com',
          phone: '+1-555-0456',
          address: {
            street: '456 Commerce St',
            city: 'Los Angeles',
            state: 'CA',
            country: 'USA',
            postalCode: '90210'
          },
          status: 'active',
          registrationDate: new Date('2019-06-20'),
          lastLogin: new Date()
        }
      }
    };

    // Validate vendor ID and password
    const vendorData = mockVendors[loginRequest.vendorId];
    
    if (!vendorData) {
      return of({
        success: false,
        message: 'Vendor ID not found in the system.'
      });
    }

    if (vendorData.password !== loginRequest.password) {
      return of({
        success: false,
        message: 'Invalid password. Please try again.'
      });
    }

    // Update last login
    vendorData.vendor.lastLogin = new Date();

    return of({
      success: true,
      token: this.generateToken(),
      vendor: vendorData.vendor,
      message: 'Login successful'
    });
  }

  private generateToken(): string {
    // Generate a simple JWT-like token (in production, use proper JWT)
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({ 
      iss: 'vendor-portal',
      exp: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
      iat: Date.now()
    }));
    const signature = btoa('mock-signature');
    
    return `${header}.${payload}.${signature}`;
  }

  // Method to validate session (could be called periodically)
  validateSession(): Observable<boolean> {
    const token = this.getAuthToken();
    if (!token) {
      return of(false);
    }

    // In real implementation, validate token with backend/SAP
    return of(true).pipe(delay(500));
  }
}