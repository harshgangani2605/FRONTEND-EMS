import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { LeaveService } from '../leave.service';
import { HasPermissionDirective } from '../../../shared/directives/has-permission.directive';
import { PermissionService } from '../../../core/services/permission.service';

@Component({
  selector: 'app-leave-list',
  standalone: true,
  imports: [CommonModule, RouterModule, HasPermissionDirective],
  templateUrl: './leave-list.html',
  styleUrls: ['./leave-list.css']
})
export class LeaveListComponent implements OnInit {

  leaves: any[] = [];
  loading = true;

  constructor(
    private leaveService: LeaveService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadMyLeaves();
  }

  loadMyLeaves(): void {
    this.loading = true;

    this.leaveService.getMyLeaves().subscribe({
      next: res => {
        this.leaves = res;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  view(id: number): void {
    this.router.navigate(['/leave/view', id]);
  }

  edit(id: number): void {
    this.router.navigate(['/leave/update', id]);
  }

  delete(id: number): void {
    if (!confirm('Delete this leave?')) return;

    this.leaveService.deleteLeave(id).subscribe(() => {
      this.loadMyLeaves();
    });
  }
}
