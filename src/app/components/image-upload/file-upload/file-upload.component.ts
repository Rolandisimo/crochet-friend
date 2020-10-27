import { Component, OnInit, HostListener } from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { allowedTypes } from './allowedTypes';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: FileUploadComponent,
      multi: true
    }
  ]
})
export class FileUploadComponent implements OnInit, ControlValueAccessor {

  constructor() { }
  public file: File | null = null;
  public isDisabled = false;
  public acceptExtensions = allowedTypes.join(',');
  public onChange = (_file: File) => {};
  public onTouched = () => {};

  @HostListener('change', ['$event.target.files'])
  public emitFiles( event: FileList ): void {
    const file = event && event.item(0);
    if (!file || !allowedTypes.includes(file.type)) {
      return;
    }

    this.onChange(file);
    this.file = file;
  }

  writeValue(file: null): void {
    this.file = file;
  }

  registerOnChange(fn: (file: File) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.isDisabled = disabled;
  }

  ngOnInit(): void {
  }
}
