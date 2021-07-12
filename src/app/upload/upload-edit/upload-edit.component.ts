import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { UploadService } from '../upload.service';
import { Upload } from '../upload.model';
import { mimeType  } from '../../shared/mime-type.validator'

@Component({
  selector: 'shg-upload-edit',
  templateUrl: './upload-edit.component.html',
  styleUrls: ['./upload-edit.component.css'],
  providers: [MessageService]
})
export class UploadEditComponent implements OnInit, OnDestroy {
  upload: Upload = {} as Upload;
  private subscription: Subscription = {} as Subscription;
  isLoading = false;
  form: FormGroup = {} as FormGroup;
  editMode = false;
  imagePreview = "";

  constructor(
    private uploadService: UploadService, 
    private router: Router, 
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService) { }

  showError(err: string) {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: err
    });
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      'title':new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      'description': new FormControl(null),
      'image': new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      }),
    });

    const prepareData = (id:number | null) => {
      if (!id) {
        this.editMode = false;
        return;
      }
      const upload = this.uploadService.getUpload(id);
      if (!upload) {
        return;
      }
      this.upload = upload;
      this.editMode = true;
      this.form.setValue({
        'title': this.upload.title,
        'description': this.upload.description,
        'image': this.upload.url
      });
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

  onImagePicked(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    if (!files || files.length === 0) {
      return;
    }
    const file = files[0];
    this.form.patchValue({ image: file });
    this.form.get('image')?.updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }

    this.isLoading = true;
    if (this.editMode === true) {
      this.uploadService.updateUpload(
        this.upload.id,
        this.form.value.title,
        this.form.value.description, 
        this.form.value.image,
        () => {
          this.isLoading = false;
          this.router.navigate(['uploads', this.upload.id]);
        },
        (err: HttpErrorResponse) => {
          this.isLoading = false;
          this.showError(err.status + ' ' + err.statusText);
        });
    } else {
      this.uploadService.addUpload(
        this.form.value.title,
        this.form.value.description, 
        this.form.value.image,
        (id: number) => {
          this.isLoading = false;
          // this.router.navigate(['uploads', id]);
          this.form.reset();
        },
        (err: HttpErrorResponse) => {
          this.isLoading = false;
          this.showError(err.status + ' ' + err.statusText);
        });
    }
  }

  ngOnDestroy = (): void => this.subscription.unsubscribe()

}
