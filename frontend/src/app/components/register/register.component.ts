import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
   <div class="register-container">
  <div class="register-card">
    <h3>Create account</h3>
    <form>
      <div class="form-group">
        <input class="form-control" placeholder="Name" />
      </div>
      <div class="form-group">
        <input class="form-control" placeholder="Email" />
      </div>
      <div class="form-group">
        <input class="form-control" placeholder="Password" type="password" />
      </div>
      <button class="btn btn-success btn-submit" type="button">Register</button>
    </form>
  </div>
</div>
  `,
  styles: []
})
export class RegisterComponent {
  email = '';
  password = '';
  isLoading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    if (this.email && this.password) {
      this.isLoading = true;
      this.errorMessage = '';

      this.authService.register(this.email, this.password).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.router.navigate(['/products']);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.error || 'Registration failed';
        }
      });
    }
  }
}
