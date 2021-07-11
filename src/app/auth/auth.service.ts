import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ServerResponse } from '../shared/server-response';
import { AuthData } from './auth-data.model';
import { CurrentUser } from './current-user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser: CurrentUser = {} as CurrentUser
  constructor(private http: HttpClient) {}

  getToken() {
    return this.currentUser.token;
  }

  getId() {
    return this.currentUser.id;
  }

  getEmail() {
    return this.currentUser.email;
  }

  getName() {
    return this.currentUser.name;
  }

  createUser(authData: AuthData): void {
    if (!authData) {
      return;
    }
    this.http.post<ServerResponse<AuthData>>("http://localhost:3000/api/v1/users/signup", authData)
      .subscribe(
        (res: ServerResponse<AuthData>) => {
          console.log(res);
        },
        (error: ServerResponse<AuthData>) => {
          console.log(error);
        }
      );
  }

  loginUser(authData: AuthData) {
    if (!authData) {
      return;
    }
    this.http.post<ServerResponse<CurrentUser>>("http://localhost:3000/api/v1/users/login", authData)
      .subscribe(
        (res: ServerResponse<CurrentUser>) => {
          this.currentUser = res.data;
          console.log(this.currentUser);
        },
        (error: ServerResponse<any>) => {
          this.currentUser = {} as CurrentUser;
          console.log(error);
        }
      );
  }
}
