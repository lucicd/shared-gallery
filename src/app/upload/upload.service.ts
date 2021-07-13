import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Upload } from './upload.model';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  private images: Upload[] = [];
  private logoutServiceSubscription: Subscription = {} as Subscription;
  uploadListChangedEvent = new Subject<Upload[]>();

  constructor(
    private http: HttpClient,
    private authService: AuthService) { }

  getUploads = () => {
    if (!this.authService.getIsAuth()) {
      return
    }
    if (this.images.length > 0) {
      return this.sortAndSend();
    }
    this.http
      .get<Upload[]>('http://localhost:3000/api/v1/images/private/')
      .subscribe(
        (res: Upload[]) => {
          this.images = res;
          this.sortAndSend();
        }
      ),
      (error: any) => console.log(error);
  }

  clearUploads = () => {
    this.images = [];
    this.sortAndSend();
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

  getUpload(id: number): Upload | null {
    const pos = this.images.findIndex(e => {
      if (!e.id) return false;
      return +e.id === +id;
    });
    return pos < 0 ? null : this.images[pos];
  }

  deleteUpload(
    id: number,
    success: ((message: string) => any),
    fail: ((error: any) => any)
  ) {
    if (!id) {
      return fail('Image ID not provided.');
    }
    const pos = this.images.findIndex(e => e.id === id);
    if (pos < 0) {
      return fail('Could not find image with given ID.');
    }
    this.http.delete<HttpResponse<any>>(
      'http://localhost:3000/api/v1/images/' + id,
      { observe: 'response' }
    )
    .subscribe(
      (res: HttpResponse<any>) => {
        if (res.status === 200) {
          this.images.splice(pos, 1);
          this.sortAndSend();;
          success(res.body.message);
        } else {
          fail(res.body.message);
        }
      },
      (err: HttpErrorResponse) => {
        fail(err);
      }
    );
  }

  addUpload(
    title: string,
    description: string,
    image: File,
    success: ((id: number, message: string) => any),
    fail: ((error: any) => any)
  ): void {
    const uploadData = new FormData();
    uploadData.append('title', title);
    uploadData.append('description', description);
    uploadData.append('image', image, title);
    this.http.post<HttpResponse<any>>(
      'http://localhost:3000/api/v1/images', 
      uploadData,
      { observe: 'response' }
    )
    .subscribe(
      (res: HttpResponse<any>) => {
        if (res.status === 201) {
          this.images.push(res.body.data);
          this.sortAndSend();
          success(res.body.data.id, res.body.message);
        } else {
          fail(res.body.message);
        }
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
    success: ((message: string) => any),
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
        public url: string 
      ) {}
    }

    let uploadData: FormData | UploadData = {} as FormData | UploadData;
    
    if (typeof(image) === 'object') {
      uploadData = new FormData();
      uploadData.append('title', title);
      uploadData.append('description', description);
      uploadData.append('image', image, title);
    } else {
      uploadData = new UploadData(
        id,
        title,
        description,
        image
      );
    }
    this.http.put<HttpResponse<any>>(
      'http://localhost:3000/api/v1/images/' + id, 
      uploadData,
      { observe: 'response' }
    )
    .subscribe(
      (res: HttpResponse<any>) => {
        if (res.status === 201) {
          this.images[pos].title = title;
          this.images[pos].description = description;
          this.images[pos].url = res.body.url;
          this.sortAndSend();
          success(res.body.message);
        } else if (res.status === 200) {
          success(res.body.message);
        } else {
          fail(res.body.message);
        }
      },
      (err: HttpErrorResponse) => {
        fail(err);
      }
    );
  }
}
