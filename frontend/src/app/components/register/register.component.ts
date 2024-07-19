import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  username: string = '';
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.authService
      .register(this.username, this.email, this.password)
      .subscribe(
        () => {
          this.router.navigate(['/login']);
        },
        (error) => {
          console.error('Registration failed', error);
          // Handle error (e.g., show error message)
        }
      );
  }
}
