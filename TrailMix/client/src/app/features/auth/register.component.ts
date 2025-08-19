import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  email = '';
  displayName = '';
  password = '';
  rePassword = '';
  error = '';

  submit() {
    this.error = '';
    if (this.password !== this.rePassword) { this.error = 'Passwords do not match'; return; }
    this.auth.register(this.email, this.password, this.displayName).subscribe({
      next: () => this.router.navigateByUrl('/catalog'),
      error: (e) => this.error = e?.error?.message || 'Registration failed'
    });
  }
}
