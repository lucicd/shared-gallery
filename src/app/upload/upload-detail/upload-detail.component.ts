import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ExistingUpload } from '../existing-upload.model';
import { UploadService } from '../upload.service';

@Component({
  selector: 'shg-upload-detail',
  templateUrl: './upload-detail.component.html',
  styleUrls: ['./upload-detail.component.css']
})
export class UploadDetailComponent implements OnInit, OnDestroy {
  upload: ExistingUpload = {} as ExistingUpload;
  private subscription: Subscription = {} as Subscription;
  isLoading = false;

  constructor(
    private uploadService: UploadService,
    private activatedRoute: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.subscription = this.uploadService.uploadListChangedEvent.subscribe(
      () => this.upload = this.uploadService
        .getUpload(+this.activatedRoute.snapshot.params['id']) ?? {} as ExistingUpload
    );
    this.activatedRoute.params.subscribe(
      (params: Params) => this.upload =
        this.uploadService.getUpload(params['id']) ?? {} as ExistingUpload
    );
  }

  onDelete() {
    this.uploadService.deleteUpload(this.upload);
    this.router.navigate(['/uploads']);
  }

  ngOnDestroy = (): void => this.subscription.unsubscribe()

}
