import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProjectService } from '../project.service';
import { HasPermissionDirective } from '../../../shared/directives/has-permission.directive';
import { PermissionService } from '../../../core/services/permission.service';


@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule, FormsModule,HasPermissionDirective],
  templateUrl: './project-list.html',
  styleUrls: ['./project-list.css']
})
export class ProjectListComponent implements OnInit {

  projects: any[] = [];
  page = 1;
  pageSize = 10;
  totalCount = 0;
  search = "";
  loading = false;

  constructor(
    private projectService: ProjectService,
    private router: Router,
    private permission:PermissionService
  ) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects() {
    this.loading = true;

    this.projectService.getPaged(this.page, this.pageSize, this.search).subscribe({
      next: (res: any) => {
        this.projects = res.items;
        this.totalCount = res.totalCount;
        this.loading = false;
      },
      error: (err: any) => {
        console.error(err);
        this.loading = false;
      }
    });
  }
  get totalPages(): number {
  return Math.ceil(this.totalCount / this.pageSize) || 1;
}

  searchProjects() {
    this.page = 1;
    this.loadProjects();
  }

  goToCreate() {
    this.router.navigate(['/project/create']);
  }

  goToEdit(id: number) {
    this.router.navigate(['/project/update', id]);
  }

  delete(id: number) {
    if (!confirm("Are you sure you want to delete this project?")) return;

    this.projectService.delete(id).subscribe({
      next: () => {
        alert("Project deleted successfully");
        this.loadProjects();
      },
      error: (err: any) => {
        alert(err.error?.message ?? "Failed to delete project");
      }
    });
  }

  nextPage() {
    if ((this.page * this.pageSize) < this.totalCount) {
      this.page++;
      this.loadProjects();
    }
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
      this.loadProjects();
    }
  }
  hasAnyActionPermission(): boolean {
  return this.permission.has('project.edit') ||
         this.permission.has('project.delete');

  }
  get isAdmin(): boolean {
  return this.permission.has('admin');
}

}
