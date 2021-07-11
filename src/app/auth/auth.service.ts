import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { ServerResponse } from '../shared/server-response';
import { AuthData } from './auth-data.model';
import { CurrentUser } from './current-user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser: CurrentUser = {} as CurrentUser
  private isAuth = false;
  private tokenTimer!: NodeJS.Timer;
  private authStatusListener = new Subject<boolean>();

  constructor(
    private http: HttpClient,
    private router: Router) {}

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

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  getIsAuth() {
    return this.isAuth;
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

  loginUser(authData: AuthData): void {
    if (!authData) {
      return;
    }
    this.http.post<ServerResponse<CurrentUser>>("http://localhost:3000/api/v1/users/login", authData)
      .subscribe(
        (res: ServerResponse<CurrentUser>) => {
          if (res.data.token) {
            this.setAuthTimer(res.data.expiresIn);
            this.isAuth = true;
            this.currentUser = res.data;
            const now = new Date();
            const expirationDate = 
              new Date(now.getTime() + res.data.expiresIn * 1000);
            this.saveAuthData(this.currentUser, expirationDate);
            this.authStatusListener.next(true);
            this.router.navigate(['/']);
          }
        },
        (error: ServerResponse<any>) => {
          this.currentUser = {} as CurrentUser;
          console.log(error);
        }
      );
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = 
      authInformation.expirationDate.getTime() - 
      now.getTime();
    if (expiresIn > 0) {
      this.currentUser = authInformation.currentUser;
      this.isAuth = true;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  logout() {
    this.isAuth = false;
    this.currentUser = {} as CurrentUser;
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.authStatusListener.next(false);
    this.router.navigate(['/']);
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() =>{
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(currentUser: CurrentUser, expirationDate: Date) {
    localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
    localStorage.setItem('expiration', expirationDate.toISOString());
  }

  private clearAuthData() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('expiration');
  }

  private getAuthData() {
    const currUser = localStorage.getItem('currentUser');
    const expirationDate = localStorage.getItem('expiration');
    if (!currUser || !expirationDate) {
      return;
    }
    return {
      currentUser: JSON.parse(currUser),
      expirationDate: new Date(expirationDate)
    }
  }
}
