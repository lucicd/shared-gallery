import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { MessageService } from 'primeng/api';
import { ToastService } from './shared/toast.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'shg-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [MessageService]
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Shared Gallery';
  private toastSubscription: Subscription = {} as Subscription;

  constructor(
    private authService: AuthService,
    private toastService: ToastService,
    private messageService: MessageService) {}
  
  ngOnInit(): void {
    this.authService.autoAuthUser();
    this.toastSubscription = this.toastService.toastEvent.subscribe(
      toastMessage => this.messageService.add(toastMessage)
    );
  }

  ngOnDestroy = (): void => this.toastSubscription.unsubscribe()
}
