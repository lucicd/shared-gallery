import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ExistingUpload } from '../existing-upload.model';
import { UploadService } from '../upload.service';

@Component({
  selector: 'shg-upload-list',
  templateUrl: './upload-list.component.html',
  styleUrls: ['./upload-list.component.css']
})
export class UploadListComponent implements OnInit, OnDestroy {
  images: ExistingUpload[] = [];
  private subscription: Subscription = {} as Subscription;

  constructor(private uploadService: UploadService) { }

  ngOnInit(): void {
    this.subscription = this.uploadService.uploadListChangedEvent.subscribe(
      (images: ExistingUpload[]) => this.images = images
    );
    this.images = this.uploadService.getUploads();
  }

  ngOnDestroy = (): void => this.subscription.unsubscribe()

}
