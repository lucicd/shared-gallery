import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { LogoutService } from 'src/app/auth/logout.service';
import { Upload } from '../upload.model';
import { UploadService } from '../upload.service';

@Component({
  selector: 'shg-upload-list',
  templateUrl: './upload-list.component.html',
  styleUrls: ['./upload-list.component.css']
})
export class UploadListComponent implements OnInit, OnDestroy {
  images: Upload[] = [];
  private subscription: Subscription = {} as Subscription;
  private logoutServiceSubscription: Subscription = {} as Subscription;

  constructor(
    private uploadService: UploadService,
    private logoutService: LogoutService) { }

  ngOnInit(): void {
    this.subscription = 
      this.uploadService.uploadListChangedEvent.subscribe(
        (images: Upload[]) => this.images = images);

    this.logoutServiceSubscription = 
      this.logoutService.userLoggedOutEvent.subscribe(
        (message: string) => {
          this.uploadService.clearUploads();
        }
      );

    this.uploadService.getUploads();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.logoutServiceSubscription.unsubscribe();
  }

}
