import { Component, OnInit } from '@angular/core';
import {
  Validators,
  ValidatorFn,
  FormBuilder,
  FormControl,
} from '@angular/forms';

const allowedTypes = [
  'image/jpeg',
  'image/png',
];
function isFileUploadValid(control: FormControl): any {
  const file = control.value;
  if (!file) {
    return null;
  }
  const isValid = allowedTypes.includes(file.type);
  console.log({file, isValid });
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
  styleUrls: ['./image-upload.component.scss']
})
export class ImageUploadComponent implements OnInit {
  private inputValidators: ValidatorFn[] = [
    Validators.required,
    Validators.pattern(/\d+/),
    Validators.min(1),
  ];
  public imageUploadForm = this.fb.group({
    gridDimensions: this.fb.group({
      width: [25, this.inputValidators],
      height: [25, this.inputValidators],
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

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
  }
}
