import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { LogoutService } from 'src/app/auth/logout.service';

@Component({
  selector: 'shg-menu-bar',
  templateUrl: './menu-bar.component.html',
  styleUrls: ['./menu-bar.component.css']
})
export class MenuBarComponent implements OnInit, OnDestroy {
  items: MenuItem[] = [];
  userGreeting = '';
  private authListenerSubs: Subscription = {} as Subscription;

  constructor(
    private authService: AuthService,
    private logoutService: LogoutService,
    private router: Router) { }

  getMenu = (isAunthenticated: boolean): MenuItem[] => {
    if (isAunthenticated) {
      return [
        {
          label: 'Home',
          icon: 'pi pi-home',
          routerLink: ['/home'],
          title: 'Shows home page.'
        },
        { 
          label: 'Browse', 
          icon: 'pi pi-images',
          routerLink: ['/browse'],
          title: 'Browse all image galleries.'
        },
        { 
          label: 'Uploads', 
          icon: 'pi pi-upload',
          routerLink: ['/uploads'],
          title: 'Upload images, manage your own image gallery.'
        },
        { 
          label: 'Logout',
          icon: 'pi pi-sign-out',
          command: this.onLogout,
          title: 'End your session.'
        }
      ];
    }
    return [
      {
        label: 'Home',
        icon: 'pi pi-home',
        routerLink: ['/home'],
        title: 'Shows home page.'
      },
      { 
        label: 'Browse',
        icon: 'pi pi-images',
        routerLink: ['/browse'],
        title: 'Browse all image galleries.'
      },
      { 
        label: 'Login', 
        icon: 'pi pi-sign-in',
        routerLink: ['/login'],
        title: 'Login with your user name and password.'
      },
      { 
        label: 'Signup', 
        icon: 'pi pi-user-plus',
        routerLink: ['/signup'],
        title: 'Signup and create your own image gallery.'
      }
    ];
  }

  onLogout = () => {
    this.authService.logout(() => {
      this.logoutService.logout();
      this.router.navigate(['/']);
    });
  }

  ngOnInit(): void {
    this.authListenerSubs = 
      this.authService
        .getAuthStatusListener()
        .subscribe(isAunthenticated => {
          this.items = this.getMenu(isAunthenticated);
          if (isAunthenticated) {
            this.userGreeting
              = 'Welcome ' + this.authService.getName() + '!';
          } else {
            this.userGreeting = '';
          }
        });

    this.items = this.getMenu(this.authService.getIsAuth());
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
