import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Upload } from '../upload.model';
import { UploadService } from '../upload.service';

@Component({
  selector: 'shg-upload-edit',
  templateUrl: './upload-edit.component.html',
  styleUrls: ['./upload-edit.component.css']
})
export class UploadEditComponent implements OnInit, OnDestroy {
  originalUpload: Upload | null = {} as Upload;
  upload: Upload = {} as Upload;
  private subscription: Subscription = {} as Subscription;
  isLoading = false;
  editMode = false;

  constructor(
    private uploadService: UploadService, 
    private router: Router, 
    private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    const prepareData = (id:number | null) => {
      if (!id) {
        this.editMode = false;
        return;
      }
      this.originalUpload = 
        this.uploadService.getUpload(id) ?? {} as Upload;
      if (!this.originalUpload) {
        return;
      }
      this.editMode = true;
      this.upload = JSON.parse(JSON.stringify(this.originalUpload));
    }

    this.subscription = 
      this.uploadService.uploadListChangedEvent.subscribe(
      () => prepareData(+this.activatedRoute.snapshot.params['id'])
    );

    this.activatedRoute.params.subscribe(
      (params: Params) => prepareData(params['id'])
    );    
  }

  onCancel = () => this.router.navigate(['uploads', this.upload.id])

  onSubmit(form: NgForm) {
    if (form.invalid) {
      return;
    }

    const newUpload = new Upload(
      null,
      form.value.title,
      form.value.description,
      form.value.url,
      ''
    );

    if (this.editMode === true) {
      this.isLoading = true;
      this.uploadService.updateUpload(
        this.originalUpload,
        newUpload,
        () => {
          this.isLoading = false;
          this.router.navigate(['uploads', this.originalUpload?.id]);
        }
      );
    } else {

    }
  }

  ngOnDestroy = (): void => this.subscription.unsubscribe()

}
