import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import { ImageUploadService } from '../image-upload/image-upload.service';
import { Action } from './toolbar.types';

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
        },
    ];
    constructor(public imageService: ImageUploadService, private sanitizer: DomSanitizer) {}

    public sanitize(url: string): SafeUrl {
        return this.sanitizer.bypassSecurityTrustUrl(url);
    }

    public onToolbarImageClick(image: HTMLImageElement): void {
        this.imageService.setCurrentImage(image);
        this.currentItem = image;
    }

    public onToolbarActionClick(action: Action): void {
        this.imageService.setCurrentAction(action);
        this.currentItem = action;
    }
}
