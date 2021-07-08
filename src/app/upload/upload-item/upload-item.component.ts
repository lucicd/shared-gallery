import { Component, Input} from '@angular/core';
import { Upload } from '../upload.model';

@Component({
  selector: 'shg-upload-item',
  templateUrl: './upload-item.component.html',
  styleUrls: ['./upload-item.component.css']
})
export class UploadItemComponent {
  @Input() image: Upload = {} as Upload;
}
