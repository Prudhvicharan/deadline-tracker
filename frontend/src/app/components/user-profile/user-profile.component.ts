import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  userForm!: FormGroup;
  isEditMode = false;
  hideCurrentPassword = true;
  hideNewPassword = true;
  hideConfirmPassword = true;
  profileImage: string | ArrayBuffer | null = null;

  constructor(private fb: FormBuilder, private snackBar: MatSnackBar) {
    this.initForm();
  }

  ngOnInit(): void {
    this.loadUserData();
  }

  private initForm(): void {
    this.userForm = this.fb.group(
      {
        fullName: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.email]],
        phoneNumber: ['', [Validators.pattern('^\\+?[1-9]\\d{1,14}$')]],
        address: [''],
        currentPassword: [''],
        newPassword: [''],
        confirmPassword: [''],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  private loadUserData(): void {
    // Mock API call
    const userData = {
      fullName: 'John Doe',
      email: 'john.doe@example.com',
      phoneNumber: '+1234567890',
      address: '123 Main Street, Springfield, USA',
    };
    this.userForm.patchValue(userData);
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.profileImage = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  private passwordMatchValidator(
    form: FormGroup
  ): { [key: string]: boolean } | null {
    const newPassword = form.get('newPassword');
    const confirmPassword = form.get('confirmPassword');

    if (newPassword?.value && confirmPassword?.value) {
      return newPassword.value === confirmPassword.value
        ? null
        : { passwordMismatch: true };
    }
    return null;
  }

  onEdit(): void {
    this.isEditMode = true;
  }

  onCancel(): void {
    this.isEditMode = false;
    this.loadUserData();
    this.userForm.get('currentPassword')?.reset();
    this.userForm.get('newPassword')?.reset();
    this.userForm.get('confirmPassword')?.reset();
  }

  onSave(): void {
    if (this.userForm.valid) {
      // Mock API call
      console.log('Saving profile:', this.userForm.value);
      this.snackBar.open('Profile updated successfully', 'Close', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
      });
      this.isEditMode = false;
    }
  }
}
