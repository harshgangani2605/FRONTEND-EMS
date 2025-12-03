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
    if (form.invalid) {
      alert("Please enter department name");
      return;
    }

    this.service.create(this.model).subscribe({
      next: () => {
        alert('Department created successfully');
        this.router.navigate(['/department']);
      },

      error: (err) => {
        // UNIVERSAL BACKEND ERROR READER
        const msg =
          (err.error?.message ||
           err.error?.detail ||
           err.error?.title ||
           err.error ||
           "")
            .toString()
            .toLowerCase();

        if (msg.includes("name")) {
          alert("Department name already exists!");
        } else {
          alert("Failed to create department");
        }
      }
    });
  }
}
