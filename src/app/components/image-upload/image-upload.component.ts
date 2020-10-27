import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import {
  Validators,
  ValidatorFn,
  FormBuilder,
  FormControl,
} from '@angular/forms';
import { pairwise, startWith } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { ImageUploadService } from './image-upload.service';
import { ImageUploadConfig } from './types';
import { allowedTypes } from './file-upload/allowedTypes';

function isFileUploadValid(control: FormControl): any {
  const file = control.value;
  if (!file) {
    return null;
  }
  const isValid = allowedTypes.includes(file.type);
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
export class ImageUploadComponent implements OnInit, OnDestroy {
  file: File | null = null;
  private inputValidators: ValidatorFn[] = [
    Validators.required,
    Validators.pattern(/\d+/),
    Validators.min(1),
  ];
  private subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private imageUpload: ImageUploadService,
  ) {}

  public imageUploadForm = this.fb.group({
    gridDimensions: this.fb.group({
      columns: [10, this.inputValidators],
      rows: [10, this.inputValidators],
    }),
    uploadedImage: [null, [Validators.required, isFileUploadValid]],
  });

  get imageControl(): FormControl {
    return this.imageUploadForm.get('uploadedImage') as FormControl;
  }

  get gridDimensions(): FormControl {
    return this.imageUploadForm.get('gridDimensions') as FormControl;
  }

  get gridWidth(): number {
    return this.gridDimensions.value.width;
  }

  get gridHeight(): number {
    return this.gridDimensions.value.height;
  }

  ngOnInit(): void {
    this.subscription.add(
      this.imageUploadForm.valueChanges
        .pipe(
          startWith(null),
          pairwise(),
        )
        .subscribe(this.onFormValueChanges.bind(this))
    );
  }

  private onFormValueChanges([prevProps, currentProps]: ImageUploadConfig[]): void {
    if (
      prevProps?.gridDimensions.columns !== currentProps.gridDimensions.columns
      || prevProps?.gridDimensions.rows !== currentProps.gridDimensions.rows
    ) {
      this.imageUpload.setGrid(currentProps.gridDimensions);
    }

    if (
      prevProps?.uploadedImage?.name !== currentProps.uploadedImage?.name
      || prevProps?.uploadedImage?.size !== currentProps.uploadedImage?.size
    ) {
      this.imageUpload.setImageFile(currentProps.uploadedImage);
    }
  }

  onImageUpload(file: File): void {
    this.file = file;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
