import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-role-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './role-create.html',
  styleUrls: ['./role-create.css'],
})
export class RoleCreate {
  roleName = '';

  constructor(private http: HttpClient, private router: Router) {}

  save(form: any) {

    // 🔥 SHOW POPUP WHEN EMPTY
    if (form.invalid) {
      alert("Please enter role name");
      return;
    }

    const body = { name: this.roleName };

    this.http.post('http://localhost:5093/api/Roles/create', body)
      .subscribe({
        next: () => {
          alert("Role created successfully!");
          this.router.navigate(['/roles']);
        },

        error: (err) => {
          const msg =
            (err.error?.message ||
             err.error?.detail ||
             err.error?.title ||
             err.error ||
             "")
              .toString()
              .toLowerCase();

          if (msg.includes("exists"))
            alert("Role already exists!");
          else
            alert("Failed to create role");
        }
      });
  }
}
