import { Injectable } from '@angular/core';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { combineAll, map, take } from 'rxjs/operators';
import { ImageUploadConfig } from './types';

@Injectable({
  providedIn: 'root'
})
export class ImageUploadService {
  private _gridDimensions = new BehaviorSubject<ImageUploadConfig['gridDimensions']>({ columns: 10, rows: 10 });
  public gridDimensions = this._gridDimensions.asObservable();

  private cachedImages = new Map<string, HTMLImageElement>();
  private _images = new BehaviorSubject<HTMLImageElement[]>(this.getCachedImages());
  public images = this._images.asObservable();

  private _currentImage: HTMLImageElement | null = null;

  // TODO: Move to proper place
  setGrid(dimensions: ImageUploadConfig['gridDimensions']): void {
    this._gridDimensions.next(dimensions);
  }

  public getCurrentImage(): HTMLImageElement | null {
    return this._currentImage;
  }

  public setImageFiles(files: File[]): void {
    from(files).pipe(
      take(files.length),
      map((file) => this.creaImageFile(file)),
      combineAll(),
    ).subscribe((data) => {
      console.log('image', data);
      this._images.next(this.getCachedImages());
    });
  }

  private creaImageFile(file: File): Observable<HTMLImageElement> {
    return new Observable((obs) => {
      const cachedImage = this.getCachedImage(file.name);
      if (cachedImage) {
        this._currentImage = cachedImage;
        obs.next(cachedImage);
        obs.complete();
      }

      // TODO: Get image dimensions from cell dimensions
      const img = new Image(50, 50);
      img.title = file.name;
      img.onload = () => {
        this.setCachedImage(img);
        obs.next(img);
        obs.complete();
      };
      img.src = URL.createObjectURL(file);
    });
  }

  public getCachedImage(name: string): HTMLImageElement | undefined {
    return this.cachedImages.get(name);
  }

  public setCachedImage(image: HTMLImageElement): void {
    this.cachedImages.set(image.title, image);
    this._currentImage = image;
  }

  public setCurrentImage(image: HTMLImageElement | null): void {
    this._currentImage = image;
  }

  public removeImage(image: HTMLImageElement): void {
    this.cachedImages.delete(image.title);
    this.setCurrentImageToLastAvailableImage(image);

    this._images.next(this.getCachedImages());
  }

  private setCurrentImageToLastAvailableImage(image: HTMLImageElement): void {
    if (!this.cachedImages.size) {
      this.resetCurrentImage();
      return;
    }

    if (this._currentImage?.title === image.title) {
      const cachedImage =  Array.from(this.cachedImages.values()).pop();
      // tslint:disable-next-line:no-non-null-assertion
      this.setCurrentImage(cachedImage!);
    }
  }

  private resetCurrentImage(): void {
    if (!this.cachedImages.size) {
      this.setCurrentImage(null);
    }
  }

  private getCachedImages(): HTMLImageElement[] {
    return [...this.cachedImages.values()];
  }
}
