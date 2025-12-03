import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../../../../core/services/api.service';

@Component({
  selector: 'app-user-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-create.html',
  styleUrls: ['./user-create.css']   // 🔥 FIXED: should be styleUrls
})
export class UserCreateComponent implements OnInit {

  roles: any[] = [];

  model = {
    FullName: '',
    Email: '',
    Password: '',
    RoleId: ''
  };

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit() {
    this.loadRoles();
  }

  loadRoles() {
    this.api.get("Roles").subscribe((res: any) => {
      this.roles = res;
    });
  }

  save(form: any) {
    if (form.invalid) return;

    this.api.post('Admin/create-user', this.model).subscribe({
      next: () => {
        alert('User created successfully!');
        this.router.navigate(['/users']);
      },

      error: (err) => {
        // 🔥 Universal backend error extraction
        const msg =
          (err.error?.message ||
           err.error?.detail ||
           err.error?.title ||
           err.error ||
           "")
            .toString()
            .toLowerCase();

        console.log("USER CREATE ERROR:", msg);

        if (msg.includes("exists") || msg.includes("already"))
          alert("User already exists! Please use a different email.");
        else
          alert("Failed to create user.");
      }
    });
  }
}
