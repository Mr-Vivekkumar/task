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
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card">
            <div class="card-header">
              <h3 class="text-center">Register</h3>
            </div>
            <div class="card-body">
              <form (ngSubmit)="onSubmit()" #registerForm="ngForm">
                <div class="mb-3">
                  <label for="email" class="form-label">Email</label>
                  <input
                    type="email"
                    class="form-control"
                    id="email"
                    name="email"
                    [(ngModel)]="email"
                    required
                    email
                    #emailInput="ngModel"
                  />
                  <div *ngIf="emailInput.invalid && emailInput.touched" class="text-danger">
                    Please enter a valid email
                  </div>
                </div>
                
                <div class="mb-3">
                  <label for="password" class="form-label">Password</label>
                  <input
                    type="password"
                    class="form-control"
                    id="password"
                    name="password"
                    [(ngModel)]="password"
                    required
                    minlength="8"
                    pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]"
                    #passwordInput="ngModel"
                  />
                  <div *ngIf="passwordInput.invalid && passwordInput.touched" class="text-danger">
                    Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character
                  </div>
                </div>

                <div *ngIf="errorMessage" class="alert alert-danger">
                  {{ errorMessage }}
                </div>

                <div class="d-grid">
                  <button
                    type="submit"
                    class="btn btn-primary"
                    [disabled]="registerForm.invalid || isLoading"
                  >
                    <span *ngIf="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                    {{ isLoading ? 'Registering...' : 'Register' }}
                  </button>
                </div>

                <div class="text-center mt-3">
                  <p>Already have an account? <a routerLink="/login">Login here</a></p>
                </div>
              </form>
            </div>
          </div>
        </div>
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
