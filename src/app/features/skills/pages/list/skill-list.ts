import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SkillsService } from '../../services/skills.service';
import { HasPermissionDirective } from '../../../../shared/directives/has-permission.directive';

@Component({
  selector: 'app-skill-list',
  standalone: true,
  imports: [CommonModule, FormsModule, HasPermissionDirective],
  templateUrl: './skill-list.html',
  styleUrls: ['./skill-list.css']
})
export class SkillListComponent implements OnInit {

  skills: any[] = [];
  filteredSkills: any[] = [];
  loading = true;

  searchText = "";

  page = 1;
  pageSize = 10;

  constructor(
    private service: SkillsService,
    private router: Router
  ) {}

  ngOnInit() {
    this.service.getAll().subscribe((res: any[]) => {
      this.skills = res;
      this.filteredSkills = res;
      this.loading = false;
    });
  }

  // Search
  filterSkills() {
    const t = this.searchText.toLowerCase();
    this.filteredSkills = this.skills.filter(s =>
      s.name.toLowerCase().includes(t)
    );
    this.page = 1;
  }

  // Create
  create() {
    this.router.navigate(['/skills/create']);
  }

  // Edit
  edit(id: number) {
    this.router.navigate(['/skills/edit', id]);
  }

  // Delete
  delete(id: number) {
    if (!confirm("Delete this skill?")) return;

    this.service.delete(id).subscribe(() => {
      this.skills = this.skills.filter(x => x.id !== id);
      this.filterSkills();
    });
  }

  // Pagination
  get paginatedSkills() {
    const start = (this.page - 1) * this.pageSize;
    return this.filteredSkills.slice(start, start + this.pageSize);
  }

  get totalPages() {
    return Math.ceil(this.filteredSkills.length / this.pageSize);
  }

}
