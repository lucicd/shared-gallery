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
      { label: 'Home', icon: 'pi pi-home' },
      { label: 'Log In', icon: 'pi pi-sign-in' },
      { label: 'Log Out', icon: 'pi pi-power-off' },
      { label: 'Upload', icon: 'pi pi-cloud-upload' },
      { label: 'Browse', icon: 'pi pi-images' },
      { label: 'My Account', icon: 'pi pi-user-edit'}
    ];
  }

}
