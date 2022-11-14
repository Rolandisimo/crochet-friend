import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { allowedTypes } from './file-upload/allowedTypes';
import { ImageUploadService } from './image-upload.service';

function isFileUploadValid(control: UntypedFormControl): any {
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
}

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageUploadComponent implements OnDestroy {
  private subscription = new Subscription();

  constructor(private fb: UntypedFormBuilder, private imageUpload: ImageUploadService) {}

  public imageUploadForm = this.fb.group({
    uploadedImage: [[], [Validators.required, isFileUploadValid]],
  });

  get imageControl(): UntypedFormControl {
    return this.imageUploadForm.get('uploadedImage') as UntypedFormControl;
  }

  onImageUpload(files: File[]): void {
    this.imageUpload.setImageFiles(files);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
