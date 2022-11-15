import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, Validators } from '@angular/forms';

import { allowedTypes } from './file-upload/allowedTypes';
import { ImageUploadService } from './image-upload.service';

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageUploadComponent {
  constructor(private fb: UntypedFormBuilder, private imageUploadService: ImageUploadService) {}

  public imageUploadForm = this.fb.group({
    uploadedImage: [[], Validators.compose([Validators.required, isFileUploadValid])],
  });

  get imageControl(): UntypedFormControl {
    return this.imageUploadForm.get('uploadedImage') as UntypedFormControl;
  }

  onImageUpload(files: File[]): void {
    this.imageUploadService.setImageFiles(files);
  }
}

const isFileUploadValid = (control: UntypedFormControl): { fileValid: boolean } | null => {
  const files: any[] = control.value;
  if (!files) {
    return null;
  }
  const isValid = files.every((file) => allowedTypes.includes(file.type));
  if (isValid) {
    return null;
  } else {
    control.setErrors({ fileValid: false });
    return { fileValid: false };
  }
};
