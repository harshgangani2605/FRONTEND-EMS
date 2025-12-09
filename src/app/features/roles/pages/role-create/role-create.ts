import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-role-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './role-create.html',
  styleUrls: ['./role-create.css'],
})
export class RoleCreate {

  model = { name: '' };
  errors: any = {};

  constructor(private http: HttpClient, private router: Router) {}

  save(form: any) {

    this.errors = {};

    // blank
    if (form.invalid) {
      this.errors.name = "Role name is required";
      return;
    }

    // only spaces
    if (!this.model.name.trim()) {
      this.errors.name = "Role name is required";
      return;
    }

    // min length
    if (this.model.name.trim().length < 2) {
      this.errors.name = "Role name must be at least 2 characters";
      return;
    }

    // only alphabets
    const regex = /^[A-Za-z ]+$/;
    if (!regex.test(this.model.name.trim())) {
      this.errors.name = "Only alphabets are allowed";
      return;
    }

    const body = { name: this.model.name.trim() };

    this.http.post('http://localhost:5093/api/Roles/create', body)
      .subscribe({

        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Created!',
            text: 'Role created successfully!',
            confirmButtonColor: '#374151'
          }).then(() => {
            this.router.navigate(['/roles']);
          });
        },

        error: (err) => {

          const msg = (
            err.error?.message ||
            err.error?.detail ||
            err.error?.title ||
            ""
          ).toString().toLowerCase();

          // DUPLICATE
          if (msg.includes("exists")) {
            this.errors.name = "Role already exists!";

            Swal.fire({
              icon: 'error',
              title: 'Duplicate Role',
              text: 'This role already exists!',
              confirmButtonColor: '#d33'
            });
          } 
          else {
            this.errors.form = "Failed to create role";

            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Failed to create role',
              confirmButtonColor: '#d33'
            });
          }
        }
      });
  }
}
