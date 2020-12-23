import { GridImage, GridImageConfig } from './grid-image';

export class GridImageCoordinator {
  private constructor() {}

  // TODO: As observable?
  public get gridImages(): GridImage[] {
    return [...this._gridImages.values()];
  }
  private static _instance: GridImageCoordinator | undefined;

  private _gridImages = new Map<string, GridImage>();

  public static getInstance(): GridImageCoordinator {
    if (!GridImageCoordinator._instance) {
      GridImageCoordinator._instance = new GridImageCoordinator();
    }

    return GridImageCoordinator._instance;
  }

  public addImage(imageProps: GridImageConfig): void {
    this._gridImages.set(`${imageProps.x}, ${imageProps.y}`, new GridImage(imageProps));
  }

  public removeImage(key: string): void {
    const foo = this._gridImages.delete(key);
    console.log(foo, key, [...this._gridImages]);
  }
}
