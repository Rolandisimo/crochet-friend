import { ChangeDetectionStrategy, Component, HostListener, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { allowedTypes } from './allowedTypes';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: FileUploadComponent,
      multi: true,
    },
  ],
})
export class FileUploadComponent implements OnInit, ControlValueAccessor {
  public files: File[] = [];
  public isDisabled = false;
  public acceptExtensions = allowedTypes.join(',');
  public onChange = (_files: File[]) => {};
  public onTouched = () => {};

  @HostListener('change', ['$event.target.files'])
  public emitFiles(fileList: FileList): void {
    const files: File[] = [];
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList.item(i);
      if (file && allowedTypes.includes(file.type)) {
        files.push(file);
      }
    }

    this.onChange(files);
    this.files = files;
  }

  writeValue(files: File[]): void {
    this.files = files;
  }

  registerOnChange(fn: (files: File[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.isDisabled = disabled;
  }

  ngOnInit(): void {}
}
