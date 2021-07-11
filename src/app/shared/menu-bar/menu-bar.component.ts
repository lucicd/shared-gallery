import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'shg-menu-bar',
  templateUrl: './menu-bar.component.html',
  styleUrls: ['./menu-bar.component.css']
})
export class MenuBarComponent implements OnInit {
  items: MenuItem[] = [];

  constructor() { }

  ngOnInit(): void {
    this.items = [
      { 
        label: 'Home',
        icon: 'pi pi-home',
        routerLink: ['/home']
      },
      { 
        label: 'Login',
        icon: 'pi pi-sign-in',
        routerLink: ['/login']
      },
      {
        label: 'Signup',
        icon: 'pi pi-sign-in',
        routerLink: ['/signup']
      },
      { 
        label: 'Logout', 
        icon: 'pi pi-power-off' 
      },
      { 
        label: 'Uploads', 
        icon: 'pi pi-cloud-upload',
        routerLink: ['/uploads']
      },
      { 
        label: 'Browse', 
        icon: 'pi pi-images',
        routerLink: ['/browse']
      },
      {
        label: 'My Account',
        icon: 'pi pi-user-edit',
        routerLink: ['/my-account']
      }
    ];
  }

}
