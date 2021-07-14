import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'shg-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  userGreeting = '';
  private authListenerSubs: Subscription = {} as Subscription;

  constructor(
    private authService: AuthService,
    private router: Router) { }

  ngOnInit(): void {
    this.authListenerSubs = 
      this.authService
        .getAuthStatusListener()
        .subscribe(isAunthenticated => {
          if (isAunthenticated) {
            this.userGreeting
              = this.authService.getName() + ', '
              + 'welcome back to Shared Gallery!';
          } else {
            this.userGreeting = '';
          }
        });

    if (this.authService.getIsAuth()) {
      this.userGreeting
        = 'Welcome ' + this.authService.getName() + '!';
    } else {
      this.userGreeting = '';
    } 
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }
}
