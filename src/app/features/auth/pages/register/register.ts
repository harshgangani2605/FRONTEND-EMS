import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { HasPermissionDirective } from '../../../../shared/directives/has-permission.directive';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent {
  fullName = '';
  email = '';
  password = '';
  confirmPassword = '';
  errorMessage = '';
  successMessage = '';

  constructor(private auth: AuthService, private router: Router) { }

  onRegister(form: NgForm) {

  this.fullName = this.fullName.trim();
  this.email = this.email.trim();

  form.control.markAllAsTouched();

  // Angular basic validation
  if (form.invalid) return;

  // Full name BE validation
  if (this.fullName.length < 3 || this.fullName.length > 30)
    return;

  // STRICT email validation (very important)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(this.email)) {
    this.errorMessage = "Enter valid email like example@gmail.com";
    return;
  }

  // password match
  if (this.password !== this.confirmPassword) {
    this.errorMessage = "Passwords do not match!";
    return;
  }

  // === API ===
  this.auth.register({
    fullName: this.fullName,
    email: this.email,
    password: this.password
  }).subscribe({
    next: (res) => {
      this.successMessage = res.message || "Registration successful!";
      setTimeout(() => this.router.navigate(['/login']), 1500);
    },
    error: (err) => {
      this.errorMessage = err.error?.message || "Registration failed";
    }
  });
}

}
