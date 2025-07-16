import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { SapOdataService } from '../../services/sap-odata.service';
import { Vendor } from '../../models/vendor.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  currentVendor: Vendor | null = null;
  isLoading = true;
  isEditing = false;
  
  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private sapOdataService: SapOdataService
  ) {}

  ngOnInit(): void {
    this.loadVendorProfile();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadVendorProfile(): void {
    this.authService.currentVendor$
      .pipe(takeUntil(this.destroy$))
      .subscribe(vendor => {
        if (vendor) {
          this.sapOdataService.getVendorProfile(vendor.vendorId)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: (profile) => {
                this.currentVendor = profile;
                this.isLoading = false;
              },
              error: (error) => {
                console.error('Error loading vendor profile:', error);
                this.currentVendor = vendor; // Fallback to cached vendor
                this.isLoading = false;
              }
            });
        }
      });
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
  }

  saveProfile(): void {
    // In real implementation, save to SAP system
    this.isEditing = false;
    console.log('Profile saved:', this.currentVendor);
  }

  cancelEdit(): void {
    this.isEditing = false;
    // Reload original data
    this.loadVendorProfile();
  }

  getStatusBadgeClass(status: string): string {
    const statusClasses: { [key: string]: string } = {
      'active': 'badge success',
      'inactive': 'badge error',
      'pending': 'badge warning'
    };
    return statusClasses[status] || 'badge';
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(date));
  }
}