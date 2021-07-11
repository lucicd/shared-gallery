import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthData } from '../auth-data.model';
import { AuthService } from '../auth.service';

@Component({
  templateUrl: './login.component.html',
})
export class LoginComponent {
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router) {}

  onLogin(form: NgForm) {
    if (form.invalid) {
      return;
    }
    const authData = new AuthData(
      form.value.email,
      form.value.password
    );
    this.authService.loginUser(authData);
  }
}
