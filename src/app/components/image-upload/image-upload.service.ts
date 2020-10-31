import { Injectable } from '@angular/core';
import { GridService } from '@components/symbol-grid/grid.service';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { combineAll, map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ImageUploadService {
  constructor(private gridService: GridService) {}

  private cachedImages = new Map<string, HTMLImageElement>();
  private _images = new BehaviorSubject<HTMLImageElement[]>(this.getCachedImages());
  public images = this._images.asObservable();

  private _currentImage: HTMLImageElement | null = null;

  public getCurrentImage(): HTMLImageElement | null {
    return this._currentImage;
  }

  public setImageFiles(files: File[]): void {
    from(files).pipe(
      take(files.length),
      map((file) => this.createImageFile(file)),
      combineAll(),
    ).subscribe(() => {
      this._images.next(this.getCachedImages());
    });
  }

  private createImageFile(file: File): Observable<HTMLImageElement> {
    return new Observable((obs) => {
      const cachedImage = this.getCachedImage(file.name);
      if (cachedImage) {
        this._currentImage = cachedImage;
        obs.next(cachedImage);
        obs.complete();
      }

      const img = new Image(this.gridService.getCellWidth(), this.gridService.getCellHeight());
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
