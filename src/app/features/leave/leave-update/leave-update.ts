import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { LeaveService } from '../leave.service';

@Component({
  selector: 'app-leave-update',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './leave-update.html',
  styleUrls: ['./leave-update.css']
})
export class LeaveUpdateComponent implements OnInit {

  id!: number;
  loading = true;
  saving = false;

  model = {
    leaveType: '',
    fromDate: '',
    toDate: '',
    reason: ''
  };

  constructor(
    private route: ActivatedRoute,
    private leaveService: LeaveService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadLeave();
  }

  // 🔹 Load leave by id
  loadLeave(): void {
    this.leaveService.getById(this.id).subscribe({
      next: (res: any) => {

        // ❌ Only Pending can be edited
        if (res.status !== 'Pending') {
          alert('Only pending leave can be edited');
          this.router.navigate(['/leave/my']);
          return;
        }

        this.model = {
          leaveType: res.leaveType ?? '',
          fromDate: res.fromDate?.split('T')[0] ?? '',
          toDate: res.toDate?.split('T')[0] ?? '',
          reason: res.reason ?? ''
        };

        this.loading = false;
      },
      error: () => {
        alert('Leave not found');
        this.router.navigate(['/leave/my']);
      }
    });
  }

  // 🔹 Date validation
  isDateValid(): boolean {
    if (!this.model.fromDate || !this.model.toDate) return true;
    return this.model.fromDate <= this.model.toDate;
  }

  // 🔹 Save update
  save(form: NgForm): void {

    if (form.invalid || !this.isDateValid()) {
      Object.values(form.controls).forEach(c => c.markAsTouched());
      return;
    }

    this.saving = true;

    this.leaveService.updateLeave(this.id, this.model).subscribe({
      next: () => {
        alert('Leave updated successfully');
        this.router.navigate(['/leave/my']);
      },
      error: (err) => {
        this.saving = false;
        alert(err.error?.message ?? 'Failed to update leave');
      }
    });
  }
}
