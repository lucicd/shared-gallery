import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AuthData } from './auth-data.model';
import { CurrentUser } from './current-user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser: CurrentUser = {} as CurrentUser
  private isAuth = false;
  private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient) { }

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

  createUser(
    name: string,
    authData: AuthData,
    success: ((message: string) => any),
    fail: ((error: any) => any)
  ): void {
    if (!name || !authData) {
      return fail('Required data is missing.');
    }
    this.http.post<HttpResponse<any>>(
      "http://localhost:3000/api/v1/users/signup", 
      { ...authData, name: name },
      { observe: 'response' })
      .subscribe(
        (res: HttpResponse<any>) => {
          success(res.body.message);
        },
        (err: HttpErrorResponse) => {
          fail(err);
        }
      );
  }

  loginUser(
    authData: AuthData,
    success: ((message: string) => any),
    fail: ((error: any) => any)
  ): void {
    if (!authData) {
      return fail('Required data is missing.');
    }
    this.http.post<HttpResponse<any>>(
      "http://localhost:3000/api/v1/users/login",
      authData,
      { observe: 'response' })
      .subscribe(
        (res: HttpResponse<any>) => {
          if (res.body.data.token) {
            this.isAuth = true;
            this.currentUser = res.body.data;
            this.saveAuthData(this.currentUser);
            this.authStatusListener.next(true);
            success('Welcome ' + res.body.data.name);
          } else {
            fail('Could not generate auth token.');
          }
        },
        (err: HttpErrorResponse) => {
          this.currentUser = {} as CurrentUser;
          fail(err);
        }
      );
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    this.currentUser = authInformation.currentUser;
    this.isAuth = true;
    this.authStatusListener.next(true);
  }

  logout(callback: () => any ) {
    this.isAuth = false;
    this.currentUser = {} as CurrentUser;
    this.clearAuthData();
    this.authStatusListener.next(false);
    callback();
  }

  private saveAuthData(currentUser: CurrentUser) {
    localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
  }

  private clearAuthData() {
    localStorage.removeItem('currentUser');
  }

  private getAuthData() {
    const currUser = localStorage.getItem('currentUser');
    if (!currUser) {
      return;
    }
    return {
      currentUser: JSON.parse(currUser),
    }
  }
}
