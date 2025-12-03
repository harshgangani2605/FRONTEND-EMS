import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HasPermissionDirective } from '../../../../shared/directives/has-permission.directive';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, FormsModule, HasPermissionDirective],
  templateUrl: './user-list.html',
  styleUrls: ['./user-list.css']
})
export class UserListComponent implements OnInit {

  users: any[] = [];
  filteredUsers: any[] = [];

  loading = true;
  searchText = "";

  page = 1;
  pageSize = 10;

  constructor(private service: UserService, private router: Router) {}

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.loading = true;

    this.service.getUsers().subscribe((res: any[]) => {
      this.users = res;
      this.filteredUsers = res;
      this.loading = false;
    });
  }

  // Search functionality
  filterUsers() {
    const t = this.searchText.toLowerCase();

    this.filteredUsers = this.users.filter(u =>
      (u.fullName || '').toLowerCase().includes(t) ||
      u.email.toLowerCase().includes(t) ||
      u.roles.join(' ').toLowerCase().includes(t)
    );

    this.page = 1;
  }

  // Pagination logic
  get paginatedUsers() {
    const start = (this.page - 1) * this.pageSize;
    return this.filteredUsers.slice(start, start + this.pageSize);
  }

  get totalPages() {
    return Math.ceil(this.filteredUsers.length / this.pageSize);
  }

  openCreate() {
    this.router.navigate(['/users/create']);
  }

  goEdit(email: string) {
    this.router.navigate(['/users/edit', email]);
  }

  deleteUser(email: string) {
    if (!confirm("Are you sure to delete this user?")) return;

    this.service.deleteUser(email).subscribe(() => {
      this.users = this.users.filter(x => x.email !== email);
      this.filterUsers();
    });
  }

}
