import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ServerResponse } from '../shared/server-response';
import { Subject } from 'rxjs';
import { ExistingUpload } from './existing-upload.model';
import { NewUpload } from './new-upload.model';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  private images: ExistingUpload[] = [];
  uploadListChangedEvent = new Subject<ExistingUpload[]>();

  constructor(private http: HttpClient) {
    this.http
      .get<ServerResponse<ExistingUpload[]>>('http://localhost:3000/api/v1/images')
      .subscribe(
        (res: ServerResponse<ExistingUpload[]>) => {
          this.images = res.data;
          this.sortAndSend();
        }
      ),
      (error: any) => console.log(error);
  }

  private sortAndSend() {
    this.images.sort((firstEl, secondEl) => {
      if (firstEl.id && secondEl.id) {
        if (firstEl.id < secondEl.id) return -1;
        if (firstEl.id > secondEl.id) return 1;
      }
      return 0;
    });
    this.uploadListChangedEvent.next(this.images.slice());
  }

  getUploads = (): ExistingUpload[] => this.images.slice()

  getUpload(id: number): ExistingUpload | null {
    const pos = this.images.findIndex(e => {
      if (!e.id) return false;
      return +e.id === +id;
    });
    return pos < 0 ? null : this.images[pos];
  }

  deleteUpload(image: ExistingUpload) {
    if (!image) {
      return;
    }
    const pos = this.images.findIndex(e => e.id === image.id);
    if (pos < 0) {
      return;
    }
    this.http.delete<{message: string}>('http://localhost:3000/api/v1/images' + image.id)
      .subscribe((data: {message: string}) => {
        this.images.splice(pos, 1);
        this.sortAndSend();;
      });
  }

  addUpload(
    newImage: NewUpload,
    callback: ((id: number) => any),
    fail: ((error: any) => any)
  ): void {
    this.http.post<ServerResponse<ExistingUpload>>('http://localhost:3000/api/v1/images', newImage)
      .subscribe(
        (res: ServerResponse<ExistingUpload>) => {
          this.images.push(res.data);
          this.sortAndSend();
          callback(res.data.id);
        },
        (err: HttpErrorResponse) => {
          fail(err);
        }
      );
  }

  updateUpload(
    originalImage: ExistingUpload, 
    newImage: NewUpload,
    callback: (() => any)
  ): void {
    const pos = this.images.findIndex(e => e.id === originalImage.id);
    if (pos < 0) {
      return;
    }
    this.images[pos].title = newImage.title;
    this.images[pos].description = newImage.description;
    this.images[pos].url = newImage.url;
    this.http.put<{message: string}>('http://localhost:3000/api/v1/images' + originalImage.id, newImage)
      .subscribe(
        (data: {message: string}) => {
          this.sortAndSend();
          callback();
        }
      );
  }
}
