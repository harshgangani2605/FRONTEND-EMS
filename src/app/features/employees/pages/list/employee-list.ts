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
  loading = true;
  Math = Math;

  // Search + Pagination
  searchText: string = "";
  page = 1;
  pageSize = 2;
  totalItems = 0;

  constructor(
    private service: EmployeeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  // 🔄 Load paginated data from backend
  loadData() {
    this.loading = true;

    this.service.getPaged(this.page, this.pageSize, this.searchText)
      .subscribe({
        next: (res: any) => {
          this.employees = res.items;  // data
          this.totalItems = res.totalItems;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      });
  }

  // 🔍 Search function
  onSearch() {
    this.page = 1;
    this.loadData();
  }

  // Page navigation
  nextPage() {
    if (this.page * this.pageSize < this.totalItems) {
      this.page++;
      this.loadData();
    }
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
      this.loadData();
    }
  }

  edit(id: number) {
    this.router.navigate(['/employees/edit', id]);
  }

  create() {
    this.router.navigate(['/employees/create']);
  }

  delete(id: number) {
    if (!confirm("Are you sure you want to delete this employee?")) return;

    this.service.delete(id).subscribe(() => {
      this.loadData();
    });
  }

  getSkillNames(skills: any[]) {
    return skills?.length ? skills.join(', ') : "No Skills";
  }
}
