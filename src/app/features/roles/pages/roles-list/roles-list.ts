import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HasPermissionDirective } from '../../../../shared/directives/has-permission.directive';

@Component({
  selector: 'app-roles-list',
  standalone: true,
  imports: [CommonModule, HasPermissionDirective],
  templateUrl: './roles-list.html',
  styleUrls: ['./roles-list.css']
})
export class RolesListComponent implements OnInit {

  roles: any[] = [];
  filteredRoles: any[] = [];

  searchText = "";
  loading = true;

  page = 1;
  pageSize = 10;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading = true;

    this.http.get<any[]>('http://localhost:5093/api/Roles')
      .subscribe(res => {
        this.roles = res;
        this.filteredRoles = res;
        this.loading = false;
      });
  }

  // 🔍 Search roles
  filterRoles() {
    const t = this.searchText.toLowerCase();

    this.filteredRoles = this.roles.filter(r =>
      r.name.toLowerCase().includes(t)
    );

    this.page = 1;
  }

  // 🔽 Pagination
  get paginatedRoles() {
    const start = (this.page - 1) * this.pageSize;
    return this.filteredRoles.slice(start, start + this.pageSize);
  }

  get totalPages() {
    return Math.ceil(this.filteredRoles.length / this.pageSize);
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
}
