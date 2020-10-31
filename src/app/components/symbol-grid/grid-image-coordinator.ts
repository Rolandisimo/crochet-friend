import { GridImage, GridImageConfig } from './grid-image';

export class GridImageCoordinator {
  private _gridImages = new Map<string, GridImage>();

  public addImage(imageProps: GridImageConfig): void {
    this._gridImages.set(`${imageProps.x}, ${imageProps.y}`, new GridImage(imageProps));
  }

  public removeImage(key: string): void {
    this._gridImages.delete(key);
  }

  // TODO: As observable?
  public get gridImages(): GridImage[] {
    return [...this._gridImages.values()];
  }
}
