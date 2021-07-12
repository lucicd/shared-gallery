import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ServerResponse } from '../shared/server-response';
import { Subject } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Upload } from './upload.model';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  private images: Upload[] = [];
  uploadListChangedEvent = new Subject<Upload[]>();

  constructor(
    private http: HttpClient,
    private authService: AuthService 
  ) {
    this.http
      .get<Upload[]>
        ('http://localhost:3000/api/v1/images/for-owner/' + 
        authService.getId()
      )
      .subscribe(
        (res: Upload[]) => {
          this.images = res;
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
    this.http.delete<{message: string}>('http://localhost:3000/api/v1/images/' + image.id)
      .subscribe((data: {message: string}) => {
        this.images.splice(pos, 1);
        this.sortAndSend();;
      });
  }

  addUpload(
    title: string,
    description: string,
    image: File,
    callback: ((id: number) => any),
    fail: ((error: any) => any)
  ): void {
    const uploadData = new FormData();
    uploadData.append('title', title);
    uploadData.append('description', description);
    uploadData.append('owner_id', this.authService.getId().toString());
    uploadData.append('image', image, title);
    this.http.post<any>(
      'http://localhost:3000/api/v1/images', 
      uploadData
      )
      .subscribe(
        (res: any) => {
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
    id: number,
    title: string,
    description: string,
    image: File | string,
    callback: (() => any),
    fail: ((error: any) => any)
  ): void {
    const pos = this.images.findIndex(e => e.id === id);
    if (pos < 0) {
      return;
    }

    class UploadData {
      constructor(
        public id: number,
        public title: string,
        public description: string,
        public owner_id: number,
        public url: string 
      ) {}
    }

    let uploadData: FormData | UploadData = {} as FormData | UploadData;
    
    if (typeof(image) === 'object') {
      uploadData = new FormData();
      uploadData.append('title', title);
      uploadData.append('description', description);
      uploadData.append('owner_id', this.authService.getId().toString());
      uploadData.append('image', image, title);
    } else {
      uploadData = new UploadData(
        id,
        title,
        description,
        this.authService.getId(),
        image
      );
    }
    this.http.put<{ url: string }>(
      'http://localhost:3000/api/v1/images/' + id, 
      uploadData
    )
    .subscribe(
      (res: { url: string }) => {
        this.images[pos].title = title;
        this.images[pos].description = description;
        this.images[pos].url = res.url;
        this.sortAndSend();
        callback();
      },
      (err: HttpErrorResponse) => {
        fail(err);
      }
    );
  }
}
