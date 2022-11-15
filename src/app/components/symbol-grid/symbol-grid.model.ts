export interface LineSetupOptions {
  stepSize: number;
  endPosition: number;
}

export interface Coordinates {
  x: number;
  y: number;
}

export interface ImageWithCoordinates {
  image: HTMLImageElement;
  x: number;
  y: number;
}
