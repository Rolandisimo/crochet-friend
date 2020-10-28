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
export class ImageUploadComponent implements OnInit, OnDestroy {
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
    uploadedImage: [[], [Validators.required, isFileUploadValid]],
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
  }

  onImageUpload(files: File[]): void {
    this.imageUpload.setImageFiles(files);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
