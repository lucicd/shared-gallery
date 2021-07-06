import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ServerResponse } from '../shared/server-response';
import { AuthData } from './auth-data.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) {}

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
    this.http.post<ServerResponse<AuthData>>("http://localhost:3000/api/v1/users/login", authData)
      .subscribe(
        (res: ServerResponse<AuthData>) => {
          console.log(res);
        },
        (error: ServerResponse<AuthData>) => {
          console.log(error);
        }
      );
  }
}
