import { Component } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../../services/employee.service';
import { ApiService } from '../../../../core/services/api.service';
import { Router } from '@angular/router';
import { HasPermissionDirective } from '../../../../shared/directives/has-permission.directive';

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

  // Validation rules
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
      this.departments = res;
    });
  }

  loadSkills() {
    this.api.get('skills').subscribe((res: any) => {
      this.skills = res;
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

  // Required validation
  if (form.invalid) {
    alert("Please fill all required fields");
    return;
  }

  // Name validation
  if (this.employee.fullName.trim().length < this.nameMinLength) {
    alert("Full Name must be at least " + this.nameMinLength + " characters long");
    return;
  }

  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(this.employee.email)) {
    alert("Please enter a valid email address");
    return;
  }

  // Salary validation
  if (this.employee.salary < 0) {
    alert("Salary cannot be negative");
    return;
  }

  // Date validation
  if (this.employee.joinedOn > this.today) {
    alert("Joined date cannot be in the future");
    return;
  }

  // Submit
  this.empService.createEmployee(this.employee).subscribe({
    next: () => {
      alert("Employee created successfully!");
      this.router.navigate(['/employees']);
    },

    error: (err) => {
      // Universal backend error extraction
      const backendMsg =
        (err.error?.message ||
         err.error?.detail ||
         err.error?.title ||
         err.error ||
         err.Message ||
         err.statusText ||
         "")
          .toString()
          .toLowerCase();

      console.log("BACKEND ERROR:", backendMsg);

      if (backendMsg.includes("email"))
        alert("Email already exists!");

      else if (backendMsg.includes("name"))
        alert("Employee name already exists!");

      else
        alert("Failed to create employee");
    }
  });
}


}
