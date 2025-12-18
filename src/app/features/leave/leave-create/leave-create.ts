import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { LeaveService } from '../leave.service';

@Component({
  selector: 'app-leave-create',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './leave-create.html',
  styleUrls: ['./leave-create.css']
})
export class LeaveCreateComponent {

  model = {
    leaveType: '',
    fromDate: '',
    toDate: '',
    reason: ''
  };

  saving = false;

  constructor(
    private leaveService: LeaveService,
    private router: Router
  ) {}

  // ✅ Date validation (From <= To)
  isDateValid(): boolean {
    if (!this.model.fromDate || !this.model.toDate) return true;
    return this.model.fromDate <= this.model.toDate;
  }

  // ✅ Submit
  save(form: NgForm): void {

    if (form.invalid || !this.isDateValid()) {
      Object.values(form.controls).forEach(control =>
        control.markAsTouched()
      );
      return;
    }

    this.saving = true;

    this.leaveService.applyLeave(this.model).subscribe({
      next: () => {
        alert('Leave applied successfully');
        this.router.navigate(['/leave/my']);
      },
      error: (err) => {
        this.saving = false;
        alert(err.error?.message ?? 'Failed to apply leave');
      }
    });
  }
}
