import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { LeaveService } from '../leave.service';
import { HasPermissionDirective } from '../../../shared/directives/has-permission.directive';

@Component({
  selector: 'app-leave-pending',
  standalone: true,
  imports: [CommonModule, RouterModule, HasPermissionDirective],
  templateUrl: './leave-pending.html',
  styleUrls: ['./leave-pending.css']
})
export class LeavePendingComponent implements OnInit {

  leaves: any[] = [];
  loading = true;

  // 🔥 PAGINATION
  page = 1;
  pageSize = 10;
  totalPages = 1;

  constructor(
    private leaveService: LeaveService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadLeaves();
  }

  loadLeaves(): void {
    this.loading = true;

    this.leaveService
      .getAllLeavesPaged(this.page, this.pageSize, '')
      .subscribe({
        next: (res: any) => {
          this.leaves = res.items;          // ✅ FIX
          this.totalPages = res.totalPages;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      });
  }

  nextPage(): void {
    if (this.page < this.totalPages) {
      this.page++;
      this.loadLeaves();
    }
  }

  prevPage(): void {
    if (this.page > 1) {
      this.page--;
      this.loadLeaves();
    }
  }

  view(id: number): void {
    this.router.navigate(['/leave/view', id]);
  }

  updateStatus(id: number, status: 'Approved' | 'Rejected'): void {
    if (!confirm(`Are you sure you want to ${status}?`)) return;

    this.leaveService.updateLeaveStatus(id, status).subscribe({
      next: () => {
        alert(`Leave ${status} successfully`);
        this.loadLeaves();
      },
      error: err => {
        alert(err.error?.message ?? 'Action failed');
      }
    });
  }
}
