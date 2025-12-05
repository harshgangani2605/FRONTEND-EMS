import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../../services/employee.service';
import { ApiService } from '../../../../core/services/api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-employee-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employee-edit.html',
  styleUrls: ['./employee-edit.css']
})
export class EmployeeEditComponent implements OnInit {

  id!: number;
  today = new Date().toISOString().split("T")[0];

  errors: any = {};

  model = {
    fullName: "",
    email: "",
    salary: 0,
    joinedOn: "",
    departmentId: "",
    skillIds: [] as number[]
  };

  departments: any[] = [];
  skills: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private service: EmployeeService,
    private router: Router
  ) {}

  ngOnInit() {
    this.id = Number(this.route.snapshot.paramMap.get("id"));
    this.loadDepartments();
    this.loadSkills();
    this.loadEmployee();
  }

  loadEmployee() {
    this.service.getById(this.id).subscribe((res: any) => {
      this.model = {
        fullName: res.fullName,
        email: res.email,
        salary: res.salary,
        joinedOn: res.joinedOn.split("T")[0],
        departmentId: res.departmentId,
        skillIds: res.skillIds || []
      };
    });
  }

  loadDepartments() {
    this.api.get("departments").subscribe((res: any) => {
      this.departments = res.items ?? res;
    });
  }

  loadSkills() {
    this.api.get("skills").subscribe((res: any) => {
      this.skills = res.items ?? res;
    });
  }

  toggleSkill(skillId: number, event: any) {
    if (event.target.checked) {
      if (!this.model.skillIds.includes(skillId)) {
        this.model.skillIds = [...this.model.skillIds, skillId];
      }
    } else {
      this.model.skillIds = this.model.skillIds.filter((x: number) => x !== skillId);
    }
  }

  update(form: NgForm) {
    this.errors = {};

    // BASIC Angular validation
    if (form.invalid) {
      Swal.fire('Validation Error', 'Please fill all required fields', 'warning');
      return;
    }

    // Full Name Validation
    if (this.model.fullName.trim().length < 3) {
      Swal.fire('Invalid Name', 'Full name must be at least 3 characters long', 'warning');
      return;
    }

    // Email Format Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.model.email)) {
      Swal.fire('Invalid Email', 'Please enter a valid email address', 'warning');
      return;
    }

    // Salary Validation
    if (this.model.salary < 0) {
      Swal.fire('Invalid Salary', 'Salary cannot be negative', 'warning');
      return;
    }

    // Date Validation
    if (this.model.joinedOn > this.today) {
      Swal.fire('Invalid Date', 'Joining date cannot be in the future', 'warning');
      return;
    }

    // Skills Validation
    if (!this.model.skillIds || this.model.skillIds.length === 0) {
      Swal.fire('Skills Required', 'Please select at least one skill', 'warning');
      return;
    }

    // API CALL
    this.service.update(this.id, this.model).subscribe({

      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Employee Updated!',
          text: 'The employee details were successfully updated.',
          timer: 1500,
          showConfirmButton: false
        });

        setTimeout(() => {
          this.router.navigate(['/employees']);
        }, 1500);
      },

      error: (err) => {
        const msg = (err.error?.message || err.error?.detail || "").toLowerCase();

        if (msg.includes("email")) {
          Swal.fire('Duplicate Email', 'This email is already used by another employee.', 'error');
          return;
        }

        if (msg.includes("name")) {
          Swal.fire('Duplicate Name', 'Employee name already exists.', 'error');
          return;
        }

        Swal.fire('Error', 'Failed to update employee.', 'error');
      }
    });
  }
}
