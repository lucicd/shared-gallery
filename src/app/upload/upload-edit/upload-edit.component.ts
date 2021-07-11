import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { ExistingUpload } from '../existing-upload.model';
import { NewUpload } from '../new-upload.model';
import { UploadService } from '../upload.service';

@Component({
  selector: 'shg-upload-edit',
  templateUrl: './upload-edit.component.html',
  styleUrls: ['./upload-edit.component.css'],
  providers: [MessageService]
})
export class UploadEditComponent implements OnInit, OnDestroy {
  originalUpload: ExistingUpload = {} as ExistingUpload;
  upload: ExistingUpload = {} as ExistingUpload;
  private subscription: Subscription = {} as Subscription;
  isLoading = false;
  editMode = false;

  constructor(
    private uploadService: UploadService, 
    private router: Router, 
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    private authService: AuthService) { }

  showError(err: string) {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: err
    });
  }

  ngOnInit(): void {
    const prepareData = (id:number | null) => {
      if (!id) {
        this.editMode = false;
        return;
      }
      const upload = this.uploadService.getUpload(id);
      if (!upload) {
        return;
      }
      this.originalUpload = upload;
      this.editMode = true;
      this.upload = JSON.parse(JSON.stringify(this.originalUpload));
    }

    this.subscription = 
      this.uploadService.uploadListChangedEvent.subscribe(
      () => prepareData(+this.activatedRoute.snapshot.params['id'])
    );

    this.activatedRoute.params.subscribe(
      (params: Params) => prepareData(+params['id'])
    );    
  }

  onCancel = () => this.router.navigate(['uploads', this.upload.id])

  onSubmit(form: NgForm) {
    if (form.invalid) {
      return;
    }

    const newUpload = new NewUpload(
      form.value.title,
      form.value.description,
      form.value.url,
      this.authService.getId()
    );

    this.isLoading = true;
    if (this.editMode === true) {
      this.uploadService.updateUpload(
        this.originalUpload,
        newUpload,
        () => {
          this.isLoading = false;
          this.router.navigate(['uploads', this.originalUpload?.id]);
        }
      );
    } else {
      this.uploadService.addUpload(
        newUpload, 
        (id: number) => {
          this.isLoading = false;
          this.router.navigate(['uploads', id]);
        },
        (err: HttpErrorResponse) => {
          this.isLoading = false;
          this.showError(err.status + ' ' + err.statusText);
        });
    }
  }

  ngOnDestroy = (): void => this.subscription.unsubscribe()

}
