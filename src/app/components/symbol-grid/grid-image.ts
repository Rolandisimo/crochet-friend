export interface GridImageConfig {
  x: number;
  y: number;
  width: number;
  height: number;
  image: HTMLImageElement;
}

export class GridImage implements GridImageConfig {
  x: number;
  y: number;
  width: number;
  height: number;
  image: HTMLImageElement;

  constructor(config: GridImageConfig) {
    const { height, width, image, x, y } = config;

    this.height = height;
    this.width = width;
    this.image = image;
    this.x = x;
    this.y = y;
  }
}
