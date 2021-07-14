import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Browse } from './browse.model';

@Injectable({
  providedIn: 'root'
})
export class BrowseService {
  images: Browse[] = [];

  constructor(private http: HttpClient) { }

  private sort() {
    this.images.sort((firstEl, secondEl) => {
      const key1 = 
        firstEl.ownerName.toLowerCase() + "#" 
        + firstEl.id.toString().padStart(10,'0');
      const key2 = 
        secondEl.ownerName.toLowerCase() + "#" 
        + secondEl.id.toString().padStart(10,'0');
      if (key1 < key2) return -1;
      if (key1 > key2) return 1;
      return 0;
    });
  }

  getImages(
    success: ((images: Browse[]) => any),
    fail: ((error: any) => any)
  ) {
    this.http.get<HttpResponse<any>>(
      'http://localhost:3000/api/v1/images/',
      { observe: 'response' }
    )
      .subscribe(
        (res: HttpResponse<any>) => {
          if (res.status === 200) {
            this.images = res.body.data;
            this.sort();
            success(this.images);
          } else {
            fail(res.body.message);
          }
        }
      ),
      (err: HttpErrorResponse) => {
        fail(err);
      }
  };
}