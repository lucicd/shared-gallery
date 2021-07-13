import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthData } from '../auth-data.model';
import { AuthService } from '../auth.service';
import { ToastService } from 'src/app/shared/toast.service';
import { formatError } from 'src/app/shared/format-error';

@Component({
  templateUrl: './login.component.html',
})
export class LoginComponent {
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService) {}

  onLogin(form: NgForm) {
    if (form.invalid) {
      return this.toastService.showError('Invalid data.');
    }
    const authData = new AuthData(
      form.value.email,
      form.value.password
    );
    this.authService.loginUser(
      authData,
      (message: string) => {
        this.isLoading = false;
        this.toastService.showSuccess(message);
        this.router.navigate(['/uploads']);
      },
      (err: any) => {
        this.isLoading = false;
        this.toastService.showError(formatError(err));
      });
  }
}
