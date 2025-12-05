import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SkillsService } from '../../services/skills.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-skill-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './skill-create.html',
  styleUrls: ['./skill-create.css']
})
export class SkillCreateComponent {

  model = { name: '' };
  errors: any = {};   

  constructor(private service: SkillsService, private router: Router) {}

  save(form: NgForm) {

    this.errors = {};

    // Required
    if (form.invalid) {
      this.errors.name = "Skill name is required";
      return;
    }

    // Avoid only spaces & minimum length 2
    if (this.model.name.trim().length < 2) {
      this.errors.name = "Skill name must be at least 2 characters";
      return;
    }

    // API CALL
    this.service.create(this.model).subscribe({

      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Created!',
          text: 'Skill created successfully.',
          confirmButtonColor: '#374151'
        }).then(() => {
          this.router.navigate(['/skills']);
        });
      },

      error: (err) => {
        const msg = (
          err.error?.message ||
          err.error?.detail ||
          err.error?.title ||
          ""
        ).toString().toLowerCase();

        if (msg.includes("exists")) {
          this.errors.name = "Skill name already exists!";
        } else {
          this.errors.form = "Failed to create skill";
        }
      }
    });
  }
}
