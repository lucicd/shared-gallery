import { Component, Input} from '@angular/core';
import { ExistingUpload } from '../existing-upload.model';

@Component({
  selector: 'shg-upload-item',
  templateUrl: './upload-item.component.html',
  styleUrls: ['./upload-item.component.css']
})
export class UploadItemComponent {
  @Input() image: ExistingUpload = {} as ExistingUpload;
}
