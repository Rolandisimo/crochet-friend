import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ImageUploadService } from '../image-upload/image-upload.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

interface Action {
  type: string;
  callback: () => void;
}

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToolbarComponent {
  public currentItem: Action | HTMLImageElement | undefined;
  public actions: Action[] = [
    {
      type: 'delete',
      callback: () => { console.log('delete'); },
    },
  ];
  constructor(
    public imageService: ImageUploadService,
    private sanitizer: DomSanitizer,
  ) {}

  public sanitize(url: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  public onToolbarItemClick(item: Action | HTMLImageElement): void {
    if (this.isAction(item)) {
      this.imageService.setCurrentImage(null);
      item.callback();
    } else {
      this.imageService.setCurrentImage(item);
    }

    this.currentItem = item;
  }

  private isAction(item: Action | HTMLImageElement): item is Action {
    return !!(item as Action).callback;
  }
}
