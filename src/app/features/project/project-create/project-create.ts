import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ProjectService } from '../project.service';

@Component({
  selector: 'app-project-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './project-create.html',
  styleUrls: ['./project-create.css']
})
export class ProjectCreateComponent {

  model = {
    name: '',
    description: '',
    startDate: '',
    endDate: ''
  };

  saving = false;

  constructor(
    private projectService: ProjectService,
    private router: Router
  ) {}

  trimName(): void {
    this.model.name = (this.model.name || '').trim();
  }

  isEndDateValid(): boolean {
    if (!this.model.startDate || !this.model.endDate) return true;
    return this.model.endDate >= this.model.startDate;
  }

  save(form: NgForm) {

  if (form.invalid || !this.isEndDateValid()) {
    // ⭐ SHOW ALL ERRORS
    Object.values(form.controls).forEach(control => {
      control.markAsTouched();
    });
    return;
  }

  this.saving = true;

  this.projectService.create(this.model).subscribe({
    next: () => {
      alert('Project created successfully');
      this.router.navigate(['/project/list']);
    },
    error: (err) => {
      this.saving = false;
      alert(err.error?.message ?? 'Failed to create project');
    }
  });
}

}
