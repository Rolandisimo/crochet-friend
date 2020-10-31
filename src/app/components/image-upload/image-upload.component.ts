import { Component, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import {
  Validators,
  FormBuilder,
  FormControl,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { ImageUploadService } from './image-upload.service';
import { allowedTypes } from './file-upload/allowedTypes';

function isFileUploadValid(control: FormControl): any {
  const files: any[] = control.value;
  if (!files) {
    return null;
  }
  const isValid = files.every(file => allowedTypes.includes(file.type));
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

  constructor(
    private fb: FormBuilder,
    private imageUpload: ImageUploadService,
  ) {}

  public imageUploadForm = this.fb.group({
    uploadedImage: [[], [Validators.required, isFileUploadValid]],
  });

  get imageControl(): FormControl {
    return this.imageUploadForm.get('uploadedImage') as FormControl;
  }

  onImageUpload(files: File[]): void {
    this.imageUpload.setImageFiles(files);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
