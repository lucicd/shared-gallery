import { Component, OnInit } from '@angular/core';
import { Browse } from '../browse.model';
import { BrowseService } from '../browse.service';
import { ToastService } from 'src/app/shared/toast.service';
import { formatError } from 'src/app/shared/format-error';

@Component({
  selector: 'shg-browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.css']
})
export class BrowseComponent implements OnInit {
  images: Browse[] = [];
  responsiveOptions:any[] = [
    {
      breakpoint: '1024px',
      numVisible: 5
    },
    {
      breakpoint: '768px',
      numVisible: 3
    },
    {
      breakpoint: '560px',
      numVisible: 1
    }
  ];
  constructor(
    private browseService: BrowseService,
    private toastService: ToastService) { }

  ngOnInit(): void {
    this.browseService.getImages(
      (gallery: Browse[]) => {
        this.images = gallery;
        this.toastService.showSuccess('Fetched ' + this.images.length + ' image(s).');
      },
      (err: any) => {
        this.toastService.showError(formatError(err));
      }
    );
  }
}
