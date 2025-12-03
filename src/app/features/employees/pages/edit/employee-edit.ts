import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../../services/employee.service';
import { ApiService } from '../../../../core/services/api.service';

@Component({
  selector: 'app-employee-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employee-edit.html',
  styleUrls: ['./employee-edit.css']
})
export class EmployeeEditComponent implements OnInit {

  id!: number;

  model: any = {
    fullName: '',
    email: '',
    salary: 0,
    joinedOn: '',
    departmentId: 0,
    skillIds: []
  };

  departments: any[] = [];
  skills: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private service: EmployeeService,
    private api: ApiService,
    private router: Router
  ) {}

  ngOnInit() {
    this.id = Number(this.route.snapshot.paramMap.get('id'));

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
      departmentId: res.departmentId,      // 🔥 NOW WILL WORK
      skillIds: res.skillIds || []  };

 
      if (this.model.joinedOn) {
        this.model.joinedOn = this.model.joinedOn.split("T")[0];
      }

      if (!this.model.skillIds) this.model.skillIds = [];
    });
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
      this.model.skillIds.push(skillId);
    } else {
      this.model.skillIds = this.model.skillIds.filter((id: number) => id !== skillId);
    }
  }

  update(form: any) {
    if (form.invalid) return;

    this.service.update(this.id, this.model).subscribe(() => {
      alert("Employee updated!");
      this.router.navigate(['/employees']);  
    });
  }
}
