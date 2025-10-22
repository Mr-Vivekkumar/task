import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { AuthService, User } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container">
        <a class="navbar-brand" routerLink="/">Product Management</a>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <a class="nav-link" routerLink="/products" routerLinkActive="active">Products</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/categories" routerLinkActive="active">Categories</a>
            </li>
          </ul>
          <ul class="navbar-nav">
            <li *ngIf="currentUser" class="nav-item dropdown">
              <a
                class="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
              >
                {{ currentUser.email }}
              </a>
              <ul class="dropdown-menu">
                <li>
                  <a class="dropdown-item" (click)="logout()">Logout</a>
                </li>
              </ul>
            </li>
            <li *ngIf="!currentUser" class="nav-item">
              <a class="nav-link" routerLink="/login">Login</a>
            </li>
            <li *ngIf="!currentUser" class="nav-item">
              <a class="nav-link" routerLink="/register">Register</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <main class="container-fluid">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    .navbar-brand {
      font-weight: bold;
    }
    main {
      min-height: calc(100vh - 56px);
    }
  `]
})
export class AppComponent implements OnInit {
  currentUser: User | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
