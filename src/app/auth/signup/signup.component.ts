import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthData } from '../auth-data.model';
import { AuthService } from '../auth.service';
import { ToastService } from 'src/app/shared/toast.service';
import { formatError } from 'src/app/shared/format-error';
import { Router } from '@angular/router';

@Component({
  templateUrl: './signup.component.html',
})
export class SignupComponent {
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService) { }

  onSignup(form: NgForm) {
    if (form.invalid) {
      return this.toastService.showError('Invalid data.');
    }
    const authData = new AuthData(
      form.value.email,
      form.value.password
    );

    this.authService.createUser(
      form.value.name,
      authData,
      (message: string) => {
        this.isLoading = false;
        this.toastService.showSuccess(message);
        this.router.navigate(['login']);
      },
      (err: any) => {
        this.isLoading = false;
        this.toastService.showError(formatError(err));
      });
  }
}
