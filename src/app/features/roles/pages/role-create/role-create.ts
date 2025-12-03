import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-role-create',
  imports: [CommonModule,FormsModule],
  templateUrl: './role-create.html',
  styleUrl: './role-create.css',
})
export class RoleCreate {
  roleName = '';

  constructor(private http: HttpClient, private router: Router) {}

  save(form: any) {
    if (form.invalid) return;

    const body = { name: this.roleName };

    this.http.post('http://localhost:5093/api/Roles/create', body)
      .subscribe(() => {
        alert("Role created!");
        this.router.navigate(['/roles']);
      });
  }

}
