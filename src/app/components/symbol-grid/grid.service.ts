import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface GridDimensions {
  columns: number;
  rows: number;
}

@Injectable({
  providedIn: 'root'
})
export class GridService {
  private cellWidth = 50;
  private cellHeight = 50;
  private numberOfColumns = 50;
  private numberOfRows = 50;

  private _gridDimensions = new BehaviorSubject<GridDimensions>({ columns: this.numberOfColumns, rows: this.numberOfRows });
  public gridDimensions = this._gridDimensions.asObservable();

  setGrid(dimensions: GridDimensions): void {
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
