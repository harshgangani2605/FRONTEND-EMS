import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';

  constructor(private auth: AuthService, private router: Router) {}

  onLogin(form: NgForm) {
    if (form.invalid) {
      this.errorMessage = 'Please enter valid details.';
      return;
    }
    
    this.auth.login({ email: this.email, password: this.password }).subscribe({
      next: (res) => {
    this.auth.saveToken(res.token);
    this.auth.saveUserFromToken(res.token);  // ⭐ VERY IMPORTANT

    this.auth.loadPermissions(() => {
      this.router.navigate(['/dashboard']);
    });
},

      error: (err) => {
        this.errorMessage = err.error?.message || 'Invalid Credentials';
      }
    });
  }
}
