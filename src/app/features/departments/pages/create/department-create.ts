import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DepartmentService } from '../../services/department.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-department-create',
  imports: [CommonModule, FormsModule],
  templateUrl: './department-create.html',
  styleUrls: ['./department-create.css']
})
export class DepartmentCreateComponent {

  model = { name: '' };

  constructor(
    private service: DepartmentService,
    private router: Router
  ) {}

  save(form: any) {
    if (form.invalid) return;

    this.service.create(this.model).subscribe(() => {
      alert('Department created');
      this.router.navigate(['/department']);
    });
  }
}
