import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HasPermissionDirective } from '../../../../shared/directives/has-permission.directive';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-roles-list',
  standalone: true,
  imports: [CommonModule, FormsModule, HasPermissionDirective],
  templateUrl: './roles-list.html',
  styleUrls: ['./roles-list.css']
})
export class RolesListComponent implements OnInit {

  roles: any[] = [];
  loading = true;
  searchText: string = "";

  page = 1;
  pageSize = 10;

  totalItems = 0;
  totalPages = 1;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    this.load();
  }

  load() {
  this.loading = true;

  this.http.get<any>(
      `http://localhost:5093/api/Roles/paged?page=${this.page}&pageSize=${this.pageSize}&search=${this.searchText}`
    )
    .subscribe(res => {
      this.roles = res.items;
      this.totalItems = res.totalItems;
      this.totalPages = res.totalPages;
      this.loading = false;
    });
}


  // Pagination (HTML already expects this)
  get paginatedRoles() {
    return this.roles;
  }

  goCreate() {
    this.router.navigate(['/roles/create']);
  }

  goManage(id: number) {
    this.router.navigate(['/roles', id, 'manage']);
  }

  deleteRole(id: number) {
    if (!confirm("Are you sure you want to delete this role?")) return;

    this.http.delete(`http://localhost:5093/api/Roles/${id}`)
      .subscribe(() => this.load());
  }
  filterRoles() {
  this.page = 1; 
  this.load();
}

}
