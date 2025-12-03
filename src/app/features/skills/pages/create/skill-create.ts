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
    if (form.invalid) return;

    this.service.create(this.model).subscribe(() => {
      alert("Skill created!");
      this.router.navigate(['/skills']);
    });
  }
}
