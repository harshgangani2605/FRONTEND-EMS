import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SkillsService } from '../../services/skills.service';

@Component({
  selector: 'app-skill-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './skill-create.html',
  styleUrls: ['./skill-create.css']
})
export class SkillCreateComponent {

  model = { name: '' };

  constructor(private service: SkillsService, private router: Router) {}

  save(form: any) {

    // 🔥 ONLY popup alert (same as department)
    if (form.invalid) {
      alert("Please enter skill name");
      return;
    }

    this.service.create(this.model).subscribe({
      next: () => {
        alert("Skill created successfully!");
        this.router.navigate(['/skills']);
      },

      error: (err) => {
        const msg =
          (err.error?.message ||
           err.error?.detail ||
           err.error?.title ||
           err.error ||
           "").toString().toLowerCase();

        if (msg.includes("exists")) {
          alert("Skill name already exists!");
        } else {
          alert("Failed to create skill");
        }
      }
    });
  }
}
