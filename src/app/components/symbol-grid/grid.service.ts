import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface GridDimensions {
  columns: number;
  rows: number;
}

@Injectable({
  providedIn: 'root',
})
export class GridService {
  private cellWidth = 32;
  private cellHeight = 32;
  private numberOfColumns = 10;
  private numberOfRows = 10;

  private gridDimensions = new BehaviorSubject<GridDimensions>({
    columns: this.numberOfColumns,
    rows: this.numberOfRows,
  });
  public gridDimensions$ = this.gridDimensions.asObservable();

  setGrid(dimensions: GridDimensions): void {
    this.gridDimensions.next(dimensions);
  }

  public addColumn(): void {
    this.numberOfColumns++;
    this.gridDimensions.next({ columns: this.numberOfColumns, rows: this.numberOfRows });
  }

  public addRow(): void {
    this.numberOfRows++;
    this.gridDimensions.next({ columns: this.numberOfColumns, rows: this.numberOfRows });
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
