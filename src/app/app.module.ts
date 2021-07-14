import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { MenuBarComponent } from './shared/menu-bar/menu-bar.component';
import { SharedModule } from 'primeng/api';
import { PanelModule } from 'primeng/panel';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ToolbarModule } from 'primeng/toolbar';
import { ToastModule } from 'primeng/toast';
// import { FileUploadModule } from 'primeng/fileupload';
import { GalleriaModule } from 'primeng/galleria';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { PasswordModule } from 'primeng/password';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { HomeComponent } from './home/home/home.component';
import { UploadComponent } from './upload/upload.component';
import { BrowseComponent } from './browse/browse/browse.component';
import { UploadDetailComponent } from './upload/upload-detail/upload-detail.component';
import { UploadEditComponent } from './upload/upload-edit/upload-edit.component';
import { UploadItemComponent } from './upload/upload-item/upload-item.component';
import { UploadListComponent } from './upload/upload-list/upload-list.component';
import { AuthInterceptor } from './auth/auth-interceptor';

@NgModule({
  declarations: [
    AppComponent,
    MenuBarComponent,
    LoginComponent,
    SignupComponent,
    HomeComponent,
    UploadComponent,
    BrowseComponent,
    UploadDetailComponent,
    UploadEditComponent,
    UploadItemComponent,
    UploadListComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    ButtonModule,
    MenubarModule,
    SharedModule,
    PanelModule,
    CardModule,
    InputTextModule,
    ProgressSpinnerModule,
    PasswordModule,
    ToolbarModule,
    ToastModule,
    GalleriaModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
