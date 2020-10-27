import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ImageUploadConfig } from './types';

@Injectable({
  providedIn: 'root'
})
export class ImageUploadService {
  private _gridDimensions = new BehaviorSubject<ImageUploadConfig['gridDimensions']>({ columns: 10, rows: 10 });
  public gridDimensions = this._gridDimensions.asObservable();

  private _imageFile = new BehaviorSubject<File | null>(null);
  public imageFile = this._imageFile.asObservable();

  private _newCachedImage = new BehaviorSubject<HTMLImageElement | null>(null);
  public newCachedImage = this._newCachedImage.asObservable();

  private cachedImages = new Map<string, HTMLImageElement>();

  // TODO: Move to proper place
  setGrid(dimensions: ImageUploadConfig['gridDimensions']): void {
    this._gridDimensions.next(dimensions);
  }

  setImageFile(imageFile: File | null): void {
    this._imageFile.next(imageFile);
  }

  constructor() { }

  public getCachedImage(name: string): HTMLImageElement | undefined {
    return this.cachedImages.get(name);
  }

  public setCachedImage(name: string, image: HTMLImageElement): void {
    this.cachedImages.set(name, image);
    this._newCachedImage.next(image);
  }
}
