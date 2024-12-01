import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  authForm!: FormGroup;
  isRegisterMode = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.createForm();
  }

  createForm(): void {
    this.authForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      fullName: [''], // Only required in register mode
      confirmPassword: [''], // Only required in register mode
    });
  }

  toggleMode(): void {
    this.authForm.reset();
    this.isRegisterMode = !this.isRegisterMode;
    if (this.isRegisterMode) {
      this.authForm.controls['fullName'].setValidators(Validators.required);
      this.authForm.controls['confirmPassword'].setValidators(
        Validators.required
      );
    } else {
      this.authForm.controls['fullName'].clearValidators();
      this.authForm.controls['confirmPassword'].clearValidators();
    }
    this.authForm.controls['fullName'].updateValueAndValidity();
    this.authForm.controls['confirmPassword'].updateValueAndValidity();
  }

  onSubmit(): void {
    if (this.authForm.valid) {
      const { email, password, fullName } = this.authForm.value;
      if (this.isRegisterMode) {
        // Registration logic
        console.log('Registering:', { email, password, fullName });
      } else {
        // Login logic
        this.authService.login(email, password).subscribe(
          () => {
            this.router.navigate(['/dashboard']);
          },
          (error) => {
            console.error('Login failed:', error);
          }
        );
      }
    }
  }
}
