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
  imports: [CommonModule, FormsModule,HasPermissionDirective],
  templateUrl: './employee-create.html',
  styleUrls: ['./employee-create.css']
})
export class EmployeeCreateComponent {

  departments: any[] = [];
  skills: any[] = [];

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
    private router:Router
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
      this.employee.skillIds =
        this.employee.skillIds.filter(id => id !== skillId);
    }
  }

  save(form: NgForm) {
    if (form.invalid) {
      alert("Please fill all fields");
      return;
    }

    this.empService.createEmployee(this.employee).subscribe({
      next: () =>{ alert("Employee created successfully!");
                  this.router.navigate(['/employees']);
      },
      
      error: (err) => {
        console.log(err);
        alert("Failed to create employee");
      }
    });
  }
}
