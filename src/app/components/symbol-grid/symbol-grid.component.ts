import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
  OnDestroy,
  ChangeDetectionStrategy,
} from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ImageUploadService } from '../image-upload/image-upload.service';
import { GridImageCoordinator } from './grid-image-coordinator';

interface LineSetupOptions {
  stepSize: number;
  endPosition: number;
}

interface Coordinates { x: number; y: number; }

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
  private cellWidth = 50;
  private cellHeight = 50;
  private context: CanvasRenderingContext2D | null = null;
  private overlayCanvasContext: CanvasRenderingContext2D | null = null;
  private numberOfColumns = 10;
  private numberOfRows = 10;
  private file: File | null = null;
  private gridCoordinator = new GridImageCoordinator();

  constructor(private imageService: ImageUploadService) {
    this.update = this.update.bind(this);
  }

  get canvasElement(): HTMLCanvasElement | undefined {
    return this.gridCanvas?.nativeElement;
  }
  get overlayElement(): HTMLCanvasElement | undefined {
    return this.overlayCanvas?.nativeElement;
  }

  ngOnInit(): void {
    this.subscriptions.add(
      this.imageService.gridDimensions.subscribe(({ columns, rows }) => {
        this.numberOfColumns = columns;
        this.numberOfRows = rows;

        this.isAnimationActive = true;
        this.update();
      })
    );

    this.subscriptions.add(
      this.imageService.imageFile.subscribe((imageFile) => {
        this.file = imageFile;
      })
    );
  }

  ngAfterViewInit(): void {
    const { width } = document.body.getBoundingClientRect();

    if (!this.canvasElement || !this.overlayElement) {
      return;
    }

    this.canvasElement.width = width;
    this.canvasElement.height = width;
    this.overlayElement.width = width;
    this.overlayElement.height = width;

    this.setGrid();

    this.subscriptions.add(
      fromEvent<MouseEvent>(this.overlayElement, 'mousedown').pipe(
        map((event) => ({ x: event.offsetX, y: event.offsetY })),
        tap(this.onClickOverlay.bind(this)),
      ).subscribe()
    );
  }

  private setGrid(): void {
    if (!this.canvasElement) {
      return;
    }
    if (!this.overlayElement) {
      return;
    }

    this.context = this.canvasElement.getContext('2d');
    this.overlayCanvasContext = this.overlayElement.getContext('2d');
    if (!this.context || !this.overlayCanvasContext) {
      throw new Error('Context is not set');
    }

    this.update();
  }

  private setCanvasDimensions(): void {
    if (!this.canvasElement || !this.overlayElement) {
      return;
    }

    this.canvasElement.width = this.cellWidth * this.numberOfColumns;
    this.canvasElement.height = this.cellHeight * this.numberOfRows;
    this.overlayElement.width = this.canvasElement.width;
    this.overlayElement.height = this.canvasElement.height;
  }

  private redrawAllImages(): void {
    this.gridCoordinator.gridImages.forEach((gridImage) => {
      this.drawImageOnOverlay({
        image: gridImage.image,
        ...this.getImageXY(gridImage.x, gridImage.y),
      });
    });
  }

  private getImageXY(x: number, y: number): { x: number; y: number; } {
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
    if (this.gridCoordinator.gridImages.length) {
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

  private async onClickOverlay(coordinates: Coordinates): Promise<void> {
    if (!this.overlayCanvasContext || !this.file) {
      return;
    }

    const { x, y } = this.getImageXY(coordinates.x, coordinates.y);
    const image = await this.getImage(this.file);

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

  private drawImageOnOverlay({ image, x, y }: {image: HTMLImageElement, x: number, y: number}): void {
    if (!this.overlayCanvasContext) {
      return;
    }

    (this.overlayCanvasContext as any).mozImageSmoothingEnabled = false;
    (this.overlayCanvasContext as any).webkitImageSmoothingEnabled = false;
    (this.overlayCanvasContext as any).msImageSmoothingEnabled = false;
    this.overlayCanvasContext.imageSmoothingEnabled = false;
    this.overlayCanvasContext?.drawImage(image, x, y, this.cellWidth, this.cellHeight);
  }

  private async getImage(file: File): Promise<HTMLImageElement> {
    const cachedImage = this.imageService.getCachedImage(file.name);
    if (cachedImage) {
      console.log('got cached');
      return cachedImage;
    }

    return new Promise<HTMLImageElement>((resolve) => {
      const img = new Image(this.cellWidth, this.cellHeight);
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        console.log('got created');
        this.imageService.setCachedImage(file.name, img);
        resolve(img);
      };
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
