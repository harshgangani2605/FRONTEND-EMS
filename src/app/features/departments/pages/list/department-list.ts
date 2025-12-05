import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DepartmentService } from '../../services/department.service';
import { HasPermissionDirective } from '../../../../shared/directives/has-permission.directive';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-department-list',
  standalone: true,
  imports: [CommonModule, FormsModule, HasPermissionDirective],
  templateUrl: './department-list.html',
  styleUrls: ['./department-list.css']
})
export class DepartmentListComponent implements OnInit {

  departments: any[] = [];

  searchText = "";
  page = 1;
  pageSize = 10;

  totalPages = 1;
  totalItems = 0;

  constructor(
    private service: DepartmentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getData();
  }

  // Load Data From Backend with Pagination + Search
  getData() {
    this.service.getPaged(this.page, this.pageSize, this.searchText)
      .subscribe((res: any) => {
        this.departments = res.items;
        this.totalPages = res.totalPages;
        this.totalItems = res.totalItems;
      });
  }

  // Search
  filterDepartments() {
    this.page = 1;
    this.getData();
  }

  create() {
    this.router.navigate(['/department/create']);
  }

  edit(id: number) {
    this.router.navigate(['/department/edit', id]);
  }

  delete(id: number) {
  Swal.fire({
    title: 'Are you sure?',
    text: 'This department will be permanently deleted!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
    if (result.isConfirmed) {

      this.service.delete(id).subscribe(() => {
        
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Department has been removed.',
          timer: 1500,
          showConfirmButton: false
        });

        this.getData();
      });

    }
  });
}


  // Pagination
  nextPage() {
    if (this.page < this.totalPages) {
      this.page++;
      this.getData();
    }
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
      this.getData();
    }
  }
}
