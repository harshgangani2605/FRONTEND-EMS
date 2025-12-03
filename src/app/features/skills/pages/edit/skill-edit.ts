import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SkillsService } from '../../services/skills.service';

@Component({
  selector: 'app-skill-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './skill-edit.html',
  styleUrls: ['./skill-edit.css']
})
export class SkillEditComponent implements OnInit {

  id!: number;
  model = { name: '' };

  constructor(
    private route: ActivatedRoute,
    private service: SkillsService,
    private router: Router
  ) {}

  ngOnInit() {
    this.id = Number(this.route.snapshot.paramMap.get('id'));

    this.service.getById(this.id).subscribe((res: any) => {
      this.model = res;
    });
  }

  update(form: any) {
    if (form.invalid) return;

    this.service.update(this.id, this.model).subscribe(() => {
      alert("Skill updated!");
      this.router.navigate(['/skills']);
    });
  }
}
