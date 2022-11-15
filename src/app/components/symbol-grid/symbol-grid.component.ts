import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { ImageUploadService } from '../image-upload/image-upload.service';
import { GridService } from './grid.service';
import { GridImageCoordinator } from './grid-image-coordinator';
import { Coordinates, ImageWithCoordinates, LineSetupOptions } from './symbol-grid.model';

@Component({
  selector: 'app-symbol-grid',
  templateUrl: './symbol-grid.component.html',
  styleUrls: ['./symbol-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SymbolGridComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('gridCanvas') gridCanvas?: ElementRef<HTMLCanvasElement>;
  @ViewChild('overlayCanvas') overlayCanvas?: ElementRef<HTMLCanvasElement>;
  private isAnimationActive = true;
  private subscriptions = new Subscription();

  private cellWidth: number = this.gridService.getCellWidth();
  private cellHeight: number = this.gridService.getCellHeight();
  private numberOfColumns: number = this.gridService.getNumberOfColumns();
  private numberOfRows: number = this.gridService.getNumberOfRows();

  private context: CanvasRenderingContext2D | null = null;
  private overlayCanvasContext: CanvasRenderingContext2D | null = null;
  private gridCoordinator = GridImageCoordinator.getInstance();

  constructor(private imageService: ImageUploadService, private gridService: GridService) {
    this.update = this.update.bind(this);
    this.onClickOverlay = this.onClickOverlay.bind(this);
  }

  ngOnInit(): void {
    this.isAnimationActive = true;
    this.update();

    this.subscriptions.add(
      this.gridService.gridDimensions$.subscribe(({ rows, columns }) => {
        this.numberOfColumns = columns;
        this.numberOfRows = rows;
        this.restartAnimations();
      }),
    );
  }

  ngAfterViewInit(): void {
    const { width } = document.body.getBoundingClientRect();

    if (!this.canvasElement || !this.overlayElement) {
      return;
    }

    this.setOverlayElementDimensions(width, width);
    this.setCanvasElementDimensions(width, width);

    this.setGrid();

    this.subscriptions.add(
      fromEvent<MouseEvent>(this.overlayElement, 'mousedown')
        .pipe(
          map((event) => ({ x: event.offsetX, y: event.offsetY })),
          tap(this.onClickOverlay),
        )
        .subscribe(),
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  get canvasElement(): HTMLCanvasElement | undefined {
    return this.gridCanvas?.nativeElement;
  }
  get overlayElement(): HTMLCanvasElement | undefined {
    return this.overlayCanvas?.nativeElement;
  }

  private setGrid(): void {
    if (!this.canvasElement || !this.overlayElement) {
      return;
    }

    this.context = this.canvasElement.getContext('2d');
    this.overlayCanvasContext = this.overlayElement.getContext('2d');

    this.disableContextSmoothing();

    this.update();
  }

  private disableContextSmoothing(): void {
    if (!this.context || !this.overlayCanvasContext) {
      throw new Error('Context is not set');
    }

    const context = this.context as any;
    const overlayCanvasContext = this.overlayCanvasContext as any;
    context.mozImageSmoothingEnabled = false;
    context.webkitImageSmoothingEnabled = false;
    context.msImageSmoothingEnabled = false;
    context.imageSmoothingEnabled = false;
    overlayCanvasContext.mozImageSmoothingEnabled = false;
    overlayCanvasContext.webkitImageSmoothingEnabled = false;
    overlayCanvasContext.msImageSmoothingEnabled = false;
    overlayCanvasContext.imageSmoothingEnabled = false;
  }

  private setCanvasDimensions(): void {
    if (!this.canvasElement || !this.overlayElement) {
      return;
    }

    this.setCanvasElementDimensions(this.cellWidth * this.numberOfColumns, this.cellHeight * this.numberOfRows);
    this.setOverlayElementDimensions(this.canvasElement.width, this.canvasElement.height);
  }

  private setCanvasElementDimensions(width: number, height: number): void {
    if (!this.canvasElement) {
      throw new Error('Setting canvas element size before the element is set');
    }

    this.canvasElement.width = width;
    this.canvasElement.height = height;
  }

  private setOverlayElementDimensions(width: number, height: number): void {
    if (!this.overlayElement) {
      throw new Error('Setting overlay element size before the element is set');
    }

    this.overlayElement.width = width;
    this.overlayElement.height = height;
  }

  private redrawAllImages(): void {
    this.gridCoordinator.gridImages.forEach((gridImage) => {
      this.drawImageOnOverlay({
        image: gridImage.image,
        ...this.getImageXY(gridImage.x, gridImage.y),
      });
    });
  }

  private getImageXY(x: number, y: number): { x: number; y: number } {
    const columnsPassedFromTheLeft = Math.floor(x / this.cellWidth);
    const newX = columnsPassedFromTheLeft * this.cellWidth;
    const rowsPassedFromTheTop = Math.floor(y / this.cellHeight);
    const newY = rowsPassedFromTheTop * this.cellHeight;

    return { x: newX, y: newY };
  }

  private update(): void {
    if (!this.isAnimationActive || !this.canvasElement || !this.context) {
      return;
    }

    this.clearCanvas();
    const loopId = window.requestAnimationFrame(this.update);

    this.setCanvasDimensions();
    this.redrawAllImages();
    this.configureLines();

    this.setupVerticalLines({
      stepSize: this.cellWidth,
      endPosition: this.canvasElement.height,
    });
    this.setupHorizontalLines({
      stepSize: this.cellHeight,
      endPosition: this.canvasElement.width,
    });

    this.context.stroke();

    this.isAnimationActive = false;
    window.cancelAnimationFrame(loopId);
  }

  private configureLines(): void {
    if (!this.context) {
      return;
    }

    this.context.beginPath();
    this.context.lineWidth = 1;
    this.context.strokeStyle = 'rgba(0, 0, 0, .2)';
  }

  private clearCanvas(): void {
    if (!this.context || !this.canvasElement || !this.overlayCanvasContext) {
      return;
    }

    this.context.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
    if (this.gridCoordinator.hasImages()) {
      this.overlayCanvasContext.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
    }
  }

  private setupVerticalLines(options: LineSetupOptions): void {
    if (!this.context) {
      return;
    }

    for (let column = 0; column <= this.numberOfColumns; column++) {
      const xPos = column * options.stepSize;

      this.context.moveTo(xPos, 0);
      this.context.lineTo(xPos, options.endPosition);
    }
  }

  private setupHorizontalLines(options: LineSetupOptions): void {
    if (!this.context) {
      return;
    }

    for (let row = 0; row <= this.numberOfRows; row++) {
      const yPos = row * options.stepSize;

      this.context.moveTo(0, yPos);
      this.context.lineTo(options.endPosition, yPos);
    }
  }

  private restartAnimations(): void {
    this.isAnimationActive = true;
    this.update();
  }

  private async onClickOverlay(coordinates: Coordinates): Promise<void> {
    if (!this.overlayCanvasContext) {
      return;
    }

    const image = this.imageService.getCurrentImage();
    const action = this.imageService.getCurrentAction();
    if (!image && !action) {
      return;
    }

    const { x, y } = this.getImageXY(coordinates.x, coordinates.y);

    if (action?.type === 'delete') {
      this.gridCoordinator.removeImage(`${x},${y}`);
    }

    if (image) {
      this.addAndDrawImageOnGrid({ image, x, y });
    }

    this.restartAnimations();
  }

  private addAndDrawImageOnGrid({ image, x, y }: ImageWithCoordinates): void {
    this.gridCoordinator.addImage({
      image,
      x,
      y,
      width: this.cellWidth,
      height: this.cellHeight,
    });

    this.drawImageOnOverlay({
      image,
      x,
      y,
    });
  }

  private drawImageOnOverlay({ image, x, y }: ImageWithCoordinates): void {
    if (!this.overlayCanvasContext) {
      return;
    }
    this.disableContextSmoothing();

    this.overlayCanvasContext.drawImage(
      image,
      0,
      0,
      image.naturalWidth,
      image.naturalHeight,
      x,
      y,
      this.cellWidth,
      this.cellHeight,
    );
  }

  public addColumnLeft(): void {
    this.gridCoordinator.shiftAllImagesRightBy(this.gridService.getCellWidth());
    this.gridService.addColumn();
  }

  public addColumnRight(): void {
    this.gridService.addColumn();
  }

  public addRowUp(): void {
    this.gridCoordinator.shiftAllImagesDownBy(this.gridService.getCellWidth());
    this.gridService.addRow();
  }

  public addRowDown(): void {
    this.gridService.addRow();
  }
}
