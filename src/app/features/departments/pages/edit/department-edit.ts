import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DepartmentService } from '../../services/department.service';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-department-edit',
  imports: [CommonModule, FormsModule],
  templateUrl: './department-edit.html',
  styleUrl:'/department-edit.css'
})
export class DepartmentEditComponent implements OnInit {

  id!: number;
  model = { name: '' };

  constructor(
    private route: ActivatedRoute,
    private service: DepartmentService,
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
      alert('Updated');
      this.router.navigate(['/department']);
    });
  }
}
