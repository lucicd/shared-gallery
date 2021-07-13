import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LogoutService {
  userLoggedOutEvent = new Subject<string>();

  logout = () => {
    this.userLoggedOutEvent.next('Bye, bye!');
  }
}
