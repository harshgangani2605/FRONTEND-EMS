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

  searchText = "";
  loading = true;

  // Backend pagination
  page = 1;
  pageSize = 4;

  totalItems = 0;
  totalPages = 0;

  constructor(
    private service: SkillsService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getSkills();
  }

  // 🔹 Load paged skills from backend
  getSkills() {
    this.loading = true;

    this.service.getPaged(this.page, this.pageSize, this.searchText).subscribe((res: any) => {
      this.skills = res.items;
      this.totalItems = res.totalItems;
      this.totalPages = res.totalPages;
      this.loading = false;
    });
  }

  // 🔍 Search
  filterSkills() {
    this.page = 1;
    this.getSkills();
  }

  // ➕ Create Skill
  create() {
    this.router.navigate(['/skills/create']);
  }

  // ✏ Edit
  edit(id: number) {
    this.router.navigate(['/skills/edit', id]);
  }

  // 🗑 Delete
  delete(id: number) {
    if (!confirm("Delete this skill?")) return;

    this.service.delete(id).subscribe(() => {
      this.getSkills();
    });
  }

  // Pagination click
  nextPage() {
    if (this.page < this.totalPages) {
      this.page++;
      this.getSkills();
    }
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
      this.getSkills();
    }
  }
}
