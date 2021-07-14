import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "./auth/auth-guard";
import { LoginComponent } from "./auth/login/login.component";
import { SignupComponent } from "./auth/signup/signup.component";
import { BrowseComponent } from "./browse/browse/browse.component";
import { HomeComponent } from "./home/home/home.component";
import { UploadDetailComponent } from "./upload/upload-detail/upload-detail.component";
import { UploadEditComponent } from "./upload/upload-edit/upload-edit.component";
import { UploadComponent } from "./upload/upload.component";

const appRoutes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'uploads', component: UploadComponent, canActivate: [AuthGuard], children: [
    { path: 'new', component: UploadEditComponent },
    { path: ':id', component: UploadDetailComponent },
    { path: ':id/edit', component: UploadEditComponent }
  ] },
  { path: 'browse', component: BrowseComponent },
  { path: '**', redirectTo: '/'},
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {}
