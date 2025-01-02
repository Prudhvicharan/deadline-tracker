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
  hidePassword: boolean = true;
  hideConfirmPassword: boolean = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.createForm();
  }

  // Custom Validator for Password Matching
  private passwordMatchValidator(
    formGroup: FormGroup
  ): { [key: string]: boolean } | null {
    if (!this.isRegisterMode) return null;
    
    const password = formGroup.get('password');
    const confirmPassword = formGroup.get('confirmPassword');

    if (!password || !confirmPassword) return null;

    // Only validate if both fields have values and are valid
    if (password.valid && confirmPassword.valid && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    // Clear the error if passwords match
    if (password.value === confirmPassword.value) {
      confirmPassword.setErrors(null);
    }

    return null;
  }

  // Create Form Group
  createForm(): void {
    this.authForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      fullName: [''],
      confirmPassword: ['']
    });

    // Update validators based on current mode
    this.updateValidators();

    // Subscribe to value changes to validate passwords
    this.authForm.valueChanges.subscribe(() => {
      if (this.isRegisterMode) {
        this.passwordMatchValidator(this.authForm);
      }
    });
  }

  // Update validators based on mode
  private updateValidators(): void {
    const fullNameControl = this.authForm.get('fullName');
    const confirmPasswordControl = this.authForm.get('confirmPassword');

    if (this.isRegisterMode) {
      fullNameControl?.setValidators([Validators.required, Validators.minLength(3)]);
      confirmPasswordControl?.setValidators([Validators.required, Validators.minLength(8)]);
    } else {
      fullNameControl?.clearValidators();
      confirmPasswordControl?.clearValidators();
    }

    fullNameControl?.updateValueAndValidity();
    confirmPasswordControl?.updateValueAndValidity();
    this.authForm.updateValueAndValidity();
  }

  // Toggle between Login and Register Mode
  toggleMode(): void {
    this.isRegisterMode = !this.isRegisterMode;
    this.authForm.reset();
    this.updateValidators();
  }

  // Form submission
  onSubmit(): void {
    if (this.authForm.invalid) {
      // Mark all fields as touched to trigger validation display
      Object.keys(this.authForm.controls).forEach(key => {
        const control = this.authForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    const { email, password, fullName } = this.authForm.value;

    if (this.isRegisterMode) {
      this.authService.register(email, password, fullName).subscribe(
        (response) => {
          this.router.navigate(['/dashboard']);
        },
        (error) => {
          console.error('Registration failed:', error);
          // Handle specific error cases here
        }
      );
    } else {
      this.authService.login(email, password).subscribe(
        (response) => {
          this.router.navigate(['/dashboard']);
        },
        (error) => {
          console.error('Login failed:', error);
          // Handle specific error cases here
        }
      );
    }
  }
}
