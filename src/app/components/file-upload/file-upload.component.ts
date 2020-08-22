import { Component, OnInit, HostListener } from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  FormControl,
} from '@angular/forms';

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
  public file: File | null = null;
  public isDisabled = false;
  public onChange = (file: File | null) => {};
  public onTouched = () => {};

  @HostListener('change', ['$event.target.files'])
  public emitFiles( event: FileList ): void {
    const file = event && event.item(0);
    this.onChange(file);
    this.file = file;
    console.log('emitFiles', file);
  }

  writeValue(file: null): void {
    this.file = file;
  }

  registerOnChange(fn: (file: File | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.isDisabled = disabled;
  }

  constructor() { }

  ngOnInit(): void {
  }
}
