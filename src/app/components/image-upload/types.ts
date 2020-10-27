export interface ImageUploadConfig {
  gridDimensions: {
    columns: number;
    rows: number;
  };
  uploadedImage: File | null;
}
