import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CollegeService } from 'src/app/services/college.service';

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

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private collegeService: CollegeService
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.loadUserData();
    this.disableFormControls();
  }

  private initForm(): void {
    this.userForm = this.fb.group(
      {
        username: [
          { value: '', disabled: !this.isEditMode },
          [Validators.required, Validators.minLength(2)],
        ],
        email: [
          { value: '', disabled: !this.isEditMode },
          [Validators.required, Validators.email],
        ],
        phoneNumber: [
          { value: '', disabled: !this.isEditMode },
          [Validators.pattern('^\\+?[1-9]\\d{1,14}$')],
        ],
        address: [{ value: '', disabled: !this.isEditMode }],
        currentPassword: [''],
        newPassword: [''],
        confirmPassword: [''],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  private loadUserData(): void {
    // Mock API call
    this.collegeService.getUserDetails().subscribe((user) => {
      if (user) {
        console.log(user);
        this.userForm.patchValue(user);
      }
    });
    // const userData = {
    //   username: 'John Doe',
    //   email: 'john.doe@example.com',
    //   phoneNumber: '+1234567890',
    //   address: '123 Main Street, Springfield, USA',
    // };
    // this.userForm.patchValue(userData);
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
    this.enableFormControls();
  }

  onCancel(): void {
    this.isEditMode = false;
    this.disableFormControls();
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
      this.disableFormControls();
    }
  }

  private enableFormControls(): void {
    Object.keys(this.userForm.controls).forEach((key) => {
      this.userForm.get(key)?.enable();
    });
  }

  private disableFormControls(): void {
    Object.keys(this.userForm.controls).forEach((key) => {
      this.userForm.get(key)?.disable();
    });
  }
}
