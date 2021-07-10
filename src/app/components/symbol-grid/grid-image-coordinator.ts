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

    public hasImages(): boolean {
        return !!this._gridImages.size;
    }

    public addImage(imageProps: GridImageConfig): void {
        this._gridImages.set(this.createImageKey({ x: imageProps.x, y: imageProps.y }), new GridImage(imageProps));
    }

    public removeImage(key: string): void {
        this._gridImages.delete(key);
    }

    public shiftAllImagesRightBy(value: number): void {
        for (const [key, image] of [...this._gridImages]) {
            const [x, y] = this.getImageKeyParts(key);
            const newKey = this.createImageKey({
                x: parseFloat(x) + value,
                y,
            });
            const newImage = image;
            image.x += value;

            this._gridImages.set(newKey, newImage);
            this._gridImages.delete(key);
        }
    }

    private getImageKeyParts(key: string): string[] {
        return key.split(',');
    }

    private createImageKey({ x, y }: { x: number | string; y: number | string }): string {
        return `${x},${y}`;
    }
}
