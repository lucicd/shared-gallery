import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  toastEvent = new Subject<any>();

  showError(err: string) {
    this.toastEvent.next({
      severity: 'error',
      summary: 'Error',
      detail: err
    });
  }

  showSuccess(message: string) {
    this.toastEvent.next({
      severity: 'success',
      summary: 'Success',
      detail: message
    });
  }
}
