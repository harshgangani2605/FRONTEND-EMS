import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { HasPermissionDirective } from '../../../../shared/directives/has-permission.directive';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, HasPermissionDirective, FormsModule],
  templateUrl: './employee-list.html',
  styleUrls: ['./employee-list.css']
})
export class EmployeeListComponent implements OnInit {

  employees: any[] = [];
  filteredEmployees: any[] = [];

  searchText: string = "";
  loading = true;

  // 🔹 Pagination variables
  page = 1;
  pageSize = 2;

  constructor(
    private service: EmployeeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getData();
  }

  // 🔄 Load all employees
  getData() {
    this.loading = true;

    this.service.getAll().subscribe({
      next: (res: any[]) => {
        this.employees = res;
        this.filteredEmployees = res;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  // 🔍 Search employees
  filterEmployees() {
    const text = this.searchText.toLowerCase();

    this.filteredEmployees = this.employees.filter(emp =>
      emp.fullName?.toLowerCase().includes(text) ||
      emp.email?.toLowerCase().includes(text) ||
      (emp.departmentName || '').toLowerCase().includes(text) ||
      this.getSkillNames(emp.skills).toLowerCase().includes(text)
    );

    this.page = 1; // reset to page 1 on search
  }

  // ✏ Edit employee
  edit(id: number) {
    this.router.navigate(['/employees/edit', id]);
  }

  // ➕ Create employee
  create() {
    this.router.navigate(['/employees/create']);
  }

  // 🗑 Delete employee
  delete(id: number) {
    if (!confirm("Are you sure you want to delete this employee?")) return;

    this.service.delete(id).subscribe({
      next: () => {
        this.getData(); // Refresh list
      }
    });
  }

  // 🏷 Skills formatting
  getSkillNames(skills: any[]) {
    if (!skills || skills.length === 0) return "No Skills";
    return skills.join(', ');
  }

  // 🔹 Paginated employees getter
  get paginatedEmployees() {
    const start = (this.page - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.filteredEmployees.slice(start, end);
  }

  // 🔹 Total pages count
  get totalPages() {
    return Math.ceil(this.filteredEmployees.length / this.pageSize);
  }

}
