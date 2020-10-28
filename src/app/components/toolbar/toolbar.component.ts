import { Component, ViewChild, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { ImageUploadService } from '../image-upload/image-upload.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToolbarComponent {
  constructor(public imageService: ImageUploadService, private sanitizer: DomSanitizer) {}

  @ViewChild('imgTarget') imgTarget!: ElementRef<HTMLSpanElement>;

  public sanitize(url: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }
}
