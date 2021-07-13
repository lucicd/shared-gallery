import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ToastService } from 'src/app/shared/toast.service';
import { Upload } from '../upload.model';
import { UploadService } from '../upload.service';
import { formatError } from '../../shared/format-error';

@Component({
  selector: 'shg-upload-detail',
  templateUrl: './upload-detail.component.html',
  styleUrls: ['./upload-detail.component.css']
})
export class UploadDetailComponent implements OnInit, OnDestroy {
  upload: Upload = {} as Upload;
  private subscription: Subscription = {} as Subscription;
  isLoading = false;

  constructor(
    private uploadService: UploadService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastService: ToastService) { }

  ngOnInit(): void {
    this.subscription = this.uploadService.uploadListChangedEvent.subscribe(
      () => this.upload = this.uploadService
        .getUpload(+this.activatedRoute.snapshot.params['id']) ?? {} as Upload
    );
    this.activatedRoute.params.subscribe(
      (params: Params) => this.upload =
        this.uploadService.getUpload(params['id']) ?? {} as Upload
    );
  }

  onDelete() {
    this.uploadService.deleteUpload(
      this.upload.id,
      (message: string) => {
        this.toastService.showSuccess(message);
        this.router.navigate(['/uploads']);
      },
      (err: any) => {
        this.isLoading = false;
        this.toastService.showError(formatError(err));
      });
  }

  ngOnDestroy = (): void => this.subscription.unsubscribe()

}
