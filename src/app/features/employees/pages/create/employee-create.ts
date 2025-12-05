import { Component } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../../services/employee.service';
import { ApiService } from '../../../../core/services/api.service';
import { Router } from '@angular/router';
import { HasPermissionDirective } from '../../../../shared/directives/has-permission.directive';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-employee-create',
  standalone: true,
  imports: [CommonModule, FormsModule, HasPermissionDirective],
  templateUrl: './employee-create.html',
  styleUrls: ['./employee-create.css']
})
export class EmployeeCreateComponent {

  departments: any[] = [];
  skills: any[] = [];
  error: string = "";
  nameMinLength = 3;
  today = new Date().toISOString().split('T')[0];

  employee = {
    fullName: '',
    email: '',
    salary: 0,
    joinedOn: '',
    departmentId: 0,
    skillIds: [] as number[]
  };

  constructor(
    private empService: EmployeeService,
    private api: ApiService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadDepartments();
    this.loadSkills();
  }

  loadDepartments() {
    this.api.get('departments').subscribe((res: any) => {
      this.departments = res.items ?? res;
    });
  }

  loadSkills() {
    this.api.get('skills').subscribe((res: any) => {
      this.skills = res.items ?? res;
    });
  }

  toggleSkill(skillId: number, event: any) {
    if (event.target.checked) {
      this.employee.skillIds.push(skillId);
    } else {
      this.employee.skillIds = this.employee.skillIds.filter(id => id !== skillId);
    }
  }

  save(form: NgForm) {

  this.error = "";

  // Angular required validation
  if (form.invalid) {
    Swal.fire({
      icon: 'warning',
      title: 'Validation Error',
      text: 'Please fill all required fields'
    });
    return;
  }

  // Full name trim validation
  if (this.employee.fullName.trim().length < this.nameMinLength) {
    Swal.fire({
      icon: 'warning',
      title: 'Invalid Name',
      text: `Full Name must be at least ${this.nameMinLength} characters long`
    });
    return;
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(this.employee.email)) {
    Swal.fire({
      icon: 'warning',
      title: 'Invalid Email',
      text: 'Please enter a valid email address'
    });
    return;
  }

  // Salary validation
  if (this.employee.salary < 0) {
    Swal.fire({
      icon: 'warning',
      title: 'Invalid Salary',
      text: 'Salary cannot be negative'
    });
    return;
  }

  // Date validation
  if (this.employee.joinedOn > this.today) {
    Swal.fire({
      icon: 'warning',
      title: 'Invalid Date',
      text: 'Joined date cannot be in the future'
    });
    return;
  }

  // Skills required
  if (this.employee.skillIds.length === 0) {
    Swal.fire({
      icon: 'warning',
      title: 'Skills Required',
      text: 'Please select at least one skill'
    });
    return;
  }

  // API CALL
  this.empService.createEmployee(this.employee).subscribe({

    next: () => {
      Swal.fire({
        icon: 'success',
        title: 'Employee Created!',
        text: 'The employee has been added successfully.',
        showConfirmButton: false,
        timer: 1500
      });

      setTimeout(() => {
        this.router.navigate(['/employees']);
      }, 1500);
    },

    error: (err) => {
      const backendMsg = (
        err.error?.message ||
        err.error?.detail ||
        err.error?.title ||
        err.error ||
        err.statusText ||
        ""
      ).toString().toLowerCase();

      if (backendMsg.includes("email")) {
        Swal.fire({
          icon: 'error',
          title: 'Duplicate Email',
          text: 'Email already exists. Use a different one.'
        });
        return;
      }

      if (backendMsg.includes("name")) {
        Swal.fire({
          icon: 'error',
          title: 'Duplicate Name',
          text: 'Employee name already exists.'
        });
        return;
      }

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to create employee.'
      });
    }
  });
}

}
