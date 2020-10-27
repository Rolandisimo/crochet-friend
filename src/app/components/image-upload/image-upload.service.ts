import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { ImageUploadConfig } from './types';

@Injectable({
  providedIn: 'root'
})
export class ImageUploadService {
  private gridDimensions = new BehaviorSubject<ImageUploadConfig['gridDimensions'] | undefined>(undefined);
  private imageFile = new BehaviorSubject<File | null>(null);
  private cachedImages = new Map<string, HTMLImageElement>();
  public newCachedImage = new BehaviorSubject<HTMLImageElement | null>(null);

  gridSubject(): BehaviorSubject<ImageUploadConfig['gridDimensions'] | undefined> {
    return this.gridDimensions;
  }

  setGrid(dimensions: ImageUploadConfig['gridDimensions']): void {
    this.gridDimensions.next(dimensions);
  }

  imageFileSubject(): BehaviorSubject<File | null> {
    return this.imageFile;
  }

  setImageFile(imageFile: File | null): void {
    console.log("SET", imageFile)
    this.imageFile.next(imageFile);
  }

  constructor() { }

  public getCachedImage(name: string): HTMLImageElement | undefined {
    return this.cachedImages.get(name);
  }

  public setCachedImage(name: string, image: HTMLImageElement): void {
    this.cachedImages.set(name, image);
    this.newCachedImage.next(image);
  }
}
