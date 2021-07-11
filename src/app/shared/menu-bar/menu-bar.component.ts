import { Component, OnDestroy, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'shg-menu-bar',
  templateUrl: './menu-bar.component.html',
  styleUrls: ['./menu-bar.component.css']
})
export class MenuBarComponent implements OnInit, OnDestroy {
  items: MenuItem[] = [];
  private authListenerSubs: Subscription = {} as Subscription;

  constructor(private authService: AuthService) { }

  getMenu = (isAunthenticated: boolean): MenuItem[] => {
    if (isAunthenticated) {
      return [
        {
          label: 'Home',
          routerLink: ['/home']
        },
        { 
          label: 'Uploads', 
          routerLink: ['/uploads']
        },
        { 
          label: 'Browse', 
          routerLink: ['/browse']
        },
        { 
          label: 'Logout',
          command: this.onLogout
        },
        {
          label: 'My Account',
          routerLink: ['/my-account']
        }
      ];
    }
    return [
      {
        label: 'Home',
        routerLink: ['/home']
      },
      { 
        label: 'Browse', 
        routerLink: ['/browse']
      },
      { 
        label: 'Login', 
        routerLink: ['/login']
      },
      { 
        label: 'Signup', 
        routerLink: ['/signup']
      },
    ];
  }

  onLogout = () => {
    this.authService.logout();
  }

  ngOnInit(): void {
    this.authListenerSubs = 
      this.authService
        .getAuthStatusListener()
        .subscribe(isAunthenticated => {
          this.items = this.getMenu(isAunthenticated);
        });

    this.items = this.getMenu(this.authService.getIsAuth());
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }

}
