import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';

import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { MenuBarComponent } from './shared/menu-bar/menu-bar.component';
import { SharedModule } from 'primeng/api';


@NgModule({
  declarations: [
    AppComponent,
    MenuBarComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ButtonModule,
    MenubarModule,
    SharedModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
