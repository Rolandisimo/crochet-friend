import { Injectable } from '@angular/core';
import { ImageUploadConfig } from '@components/image-upload/types';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GridService {
  private cellWidth = 50;
  private cellHeight = 50;
  private numberOfColumns = 10;
  private numberOfRows = 10;

  private _gridDimensions = new BehaviorSubject<ImageUploadConfig['gridDimensions']>({ columns: 10, rows: 10 });
  public gridDimensions = this._gridDimensions.asObservable();

  setGrid(dimensions: ImageUploadConfig['gridDimensions']): void {
    this._gridDimensions.next(dimensions);
  }

  public getCellWidth(): number {
    return this.cellWidth;
  }
  public getCellHeight(): number {
    return this.cellHeight;
  }
  public getNumberOfColumns(): number {
    return this.numberOfColumns;
  }
  public getNumberOfRows(): number {
    return this.numberOfRows;
  }
}
