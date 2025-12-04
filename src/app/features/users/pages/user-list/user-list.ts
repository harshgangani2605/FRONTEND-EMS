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

  loading = true;
  searchText = "";

  page = 1;
  pageSize = 10;
  totalItems = 0;
  totalPages = 1;

  constructor(private service: UserService, private router: Router) {}

  ngOnInit() {
    this.loadUsers();
  }

  // LOAD PAGED USERS FROM API
  loadUsers() {
    this.loading = true;

    this.service.getUsersPaged(this.page, this.pageSize, this.searchText)
      .subscribe((res: any) => {
        this.users = res.items;
        this.totalItems = res.totalItems;
        this.totalPages = res.totalPages;
        this.loading = false;
      });
  }

  // SEARCH
  onSearch() {
    this.page = 1;
    this.loadUsers();
  }

  // OPEN CREATE USER PAGE
  openCreate() {
    this.router.navigate(['/users/create']);
  }

  // EDIT USER
  goEdit(email: string) {
    this.router.navigate(['/users/edit', email]);
  }

  // DELETE USER
  deleteUser(email: string) {
    if (!confirm("Are you sure to delete this user?")) return;

    this.service.deleteUser(email).subscribe(() => {
      this.loadUsers();
    });
  }

  // PAGINATION BUTTONS
  prevPage() {
    if (this.page > 1) {
      this.page--;
      this.loadUsers();
    }
  }

  nextPage() {
    if (this.page < this.totalPages) {
      this.page++;
      this.loadUsers();
    }
  }
}
