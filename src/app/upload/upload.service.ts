import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ServerResponse } from '../shared/server-response';
import { Subject } from 'rxjs';
import { Upload } from './upload.model';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  private images: Upload[] = [];
  uploadListChangedEvent = new Subject<Upload[]>();

  constructor(private http: HttpClient) {
    this.http
      .get<ServerResponse<Upload[]>>('http://localhost:3000/api/v1/images')
      .subscribe(
        (res: ServerResponse<Upload[]>) => {
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

  getUploads = (): Upload[] => this.images.slice()

  getUpload(id: number): Upload | null {
    const pos = this.images.findIndex(e => {
      if (!e.id) return false;
      return +e.id === +id;
    });
    return pos < 0 ? null : this.images[pos];
  }

  deleteUpload(image: Upload) {
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

  addUpload(newImage: Upload): void {
    if (!newImage) {
      return;
    }

    this.http.post<{ message: string, contact: Upload }>('http://localhost:3000/api/v1/images', newImage)
      .subscribe(
        (data: {message: string, contact: Upload}) => {
          newImage.id = data.contact.id;
          this.images.push(newImage);
          this.sortAndSend();
        }
      );
  }

  updateUpload(
    originalImage: Upload | null, 
    newImage: Upload | null,
    callback: (() => any)
  ): void {
    if (!originalImage || !newImage) {
      return;
    }
    const pos = this.images.findIndex(e => e.id === originalImage.id);
    if (pos < 0) {
      return;
    }
    newImage.id = originalImage.id;
    this.images[pos] = newImage;
    this.http.put<{message: string}>('http://localhost:3000/api/v1/images' + originalImage.id, newImage)
      .subscribe(
        (data: {message: string}) => {
          this.images[pos] = newImage;
          this.sortAndSend();
          callback();
        }
      );
  }
}
