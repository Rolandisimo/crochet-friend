import { Injectable } from '@angular/core';
import { GridService } from '@components/symbol-grid/grid.service';
import { Action } from '@components/toolbar/toolbar.types';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { combineAll, map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ImageUploadService {
  constructor(private gridService: GridService) {}

  private cachedImages = new Map<string, HTMLImageElement>();
  private _images = new BehaviorSubject<HTMLImageElement[]>(this.getCachedImages());
  public images = this._images.asObservable();

  private _currentImage: HTMLImageElement | null = null;
  private _currentAction: Action | null = null;

  public getCurrentImage(): HTMLImageElement | null {
    return this._currentImage;
  }

  public getCurrentAction(): Action | null {
    return this._currentAction;
  }

  public setImageFiles(files: File[]): void {
    from(files)
      .pipe(
        take(files.length),
        map((file) => this.createImageFile(file)),
        combineAll(),
      )
      .subscribe(() => {
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
  }

  public setCurrentImage(image: HTMLImageElement | null): void {
    this._currentAction = null;
    this._currentImage = image;
  }

  public setCurrentAction(action: Action | null): void {
    this._currentImage = null;
    this._currentAction = action;
  }

  public removeImage(image: HTMLImageElement): void {
    this.cachedImages.delete(image.title);
    this._images.next(this.getCachedImages());

    if (image.title !== this._currentImage?.title) {
      return;
    }

    this.setCurrentImage(null);
  }

  private getCachedImages(): HTMLImageElement[] {
    return [...this.cachedImages.values()];
  }
}
