import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DepartmentService } from '../../services/department.service';
import { HasPermissionDirective } from '../../../../shared/directives/has-permission.directive';

@Component({
  selector: 'app-department-list',
  standalone: true,
  imports: [CommonModule, FormsModule, HasPermissionDirective],
  templateUrl: './department-list.html',
  styleUrls: ['./department-list.css']
})
export class DepartmentListComponent implements OnInit {

  departments: any[] = [];
  filteredDepartments: any[] = [];

  searchText = "";
  page = 1;
  pageSize = 2;

  constructor(
    private service: DepartmentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.service.getAll().subscribe(res => {
      this.departments = res;
      this.filteredDepartments = res;
    });
  }

  filterDepartments() {
    const text = this.searchText.toLowerCase();

    this.filteredDepartments = this.departments.filter(dep =>
      dep.name.toLowerCase().includes(text)
    );

    this.page = 1;
  }

  create() {
    this.router.navigate(['/department/create']);
  }

  edit(id: number) {
    this.router.navigate(['/department/edit', id]);
  }

  delete(id: number) {
    if (!confirm("Are you sure?")) return;

    this.service.delete(id).subscribe(() => {
      this.getData();
    });
  }

  // Pagination
  get paginatedDepartments() {
    const start = (this.page - 1) * this.pageSize;
    return this.filteredDepartments.slice(start, start + this.pageSize);
  }

  get totalPages() {
    return Math.ceil(this.filteredDepartments.length / this.pageSize);
  }

}
