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
  styleUrl:'./user-create.css'
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

    this.api.post('Admin/create-user', this.model).subscribe(() => {
      alert('User Created!');
      this.router.navigate(['/users']);
    });
  }
}
