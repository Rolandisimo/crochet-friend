import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { FileUploadComponent } from './file-upload/file-upload.component';
import { ImageUploadComponent } from './image-upload.component';

@NgModule({
    declarations: [ImageUploadComponent, FileUploadComponent],
    imports: [CommonModule, ReactiveFormsModule],
    exports: [ImageUploadComponent],
})
export class ImageUploadModule {}
