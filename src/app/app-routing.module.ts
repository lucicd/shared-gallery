import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "./auth/auth-guard";
import { LoginComponent } from "./auth/login/login.component";
import { SignupComponent } from "./auth/signup/signup.component";
import { BrowseComponent } from "./browse/browse/browse.component";
import { HomeComponent } from "./home/home/home.component";
import { MyAccountComponent } from "./my-account/my-account/my-account.component";
import { UploadDetailComponent } from "./upload/upload-detail/upload-detail.component";
import { UploadEditComponent } from "./upload/upload-edit/upload-edit.component";
import { UploadComponent } from "./upload/upload.component";
// import { ContactDetailComponent } from "./contacts/contact-detail/contact-detail.component";
// import { ContactEditComponent } from "./contacts/contact-edit/contact-edit.component";
// import { ContactsComponent } from "./contacts/contacts.component";
// import { DocumentDetailComponent } from "./documents/document-detail/document-detail.component";
// import { DocumentEditComponent } from "./documents/document-edit/document-edit.component";
// import { DocumentsComponent } from "./documents/documents.component";
// import { MessageListComponent } from "./messages/message-list/message-list.component";

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
  { path: 'my-account', component: MyAccountComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '/'},
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {}
