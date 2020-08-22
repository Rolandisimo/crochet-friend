import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Input, OnChanges, OnDestroy } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { map, tap, pairwise } from 'rxjs/operators';

const MAX_WIDTH = 1000;

interface LineSetupOptions {
  stepSize: number;
  endPosition: number;
}

interface Coordinates { x: number; y: number; }

@Component({
  selector: 'app-symbol-grid',
  templateUrl: './symbol-grid.component.html',
  styleUrls: ['./symbol-grid.component.scss']
})
export class SymbolGridComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  @Input() numberOfColumns = 0;
  @Input() numberOfRows = 0;
  @ViewChild('gridCanvas') gridCanvas?: ElementRef<HTMLCanvasElement>;
  @ViewChild('overlayCanvas') overlayCanvas?: ElementRef<HTMLCanvasElement>;
  private isAnimationActive = true;
  private subscriptions = new Subscription();
  private cellWidth = 0;
  private cellHeight = 0;

  context: CanvasRenderingContext2D | null = null;
  overlayCanvasContext: CanvasRenderingContext2D | null = null;
  constructor() {
    this.update = this.update.bind(this);
  }

  get canvasElement(): HTMLCanvasElement | undefined {
    return this.gridCanvas?.nativeElement;
  }
  get overlayElement(): HTMLCanvasElement | undefined {
    return this.overlayCanvas?.nativeElement;
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    const { width } = document.body.getBoundingClientRect();

    if (!this.canvasElement || !this.overlayElement) {
      return;
    }

    this.canvasElement.width = Math.min(width, MAX_WIDTH);
    this.canvasElement.height = this.canvasElement.width;
    this.overlayElement.width = Math.min(width, MAX_WIDTH);
    this.overlayElement.height = this.overlayElement.width;

    this.setGrid();

    this.subscriptions.add(
      fromEvent<MouseEvent>(this.overlayElement, 'mousemove').pipe(
        map((event) => ({ x: event.offsetX - this.cellWidth / 2, y: event.offsetY - this.cellHeight / 2})),
        pairwise(),
        tap(this.onMouseOverGrid.bind(this)),
      ).subscribe()
    );
  }

  ngOnChanges(): void {
    this.isAnimationActive = true;
    this.setGrid();
  }

  setGrid(): void {
    if (!this.canvasElement) {
      return;
    }
    if (!this.overlayElement) {
      return;
    }

    this.context = this.canvasElement.getContext('2d', { alpha: false });
    this.overlayCanvasContext = this.overlayElement.getContext('2d', { alpha: false });

    if (!this.context) {
      throw new Error('Context is not set');
    }

    this.update();
  }

  update(): void {
    if (!this.isAnimationActive || !this.canvasElement || !this.context) {
      return;
    }

    this.clearCanvas();
    const loopId = window.requestAnimationFrame(this.update);

    this.cellWidth = (this.canvasElement.width / this.numberOfColumns);
    this.cellHeight = (this.canvasElement.height / this.numberOfRows);

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

  configureLines(): void {
    if (!this.context) {
      return;
    }

    this.context.beginPath();
    this.context.lineWidth = 1;
  }

  clearCanvas(): void {
    if (!this.context || !this.canvasElement || !this.overlayCanvasContext) {
      return;
    }

    this.context.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
    this.overlayCanvasContext.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
  }

  setupVerticalLines(options: LineSetupOptions): void {
    if (!this.context) {
      return;
    }

    for (let column = 0; column <= this.numberOfColumns; column++) {
      const xPos = column * options.stepSize;

      this.context.moveTo(xPos, 0);
      this.context.lineTo(xPos, options.endPosition);
    }
  }

  setupHorizontalLines(options: LineSetupOptions): void {
    if (!this.context) {
      return;
    }

    for (let row = 0; row <= this.numberOfRows; row++) {
      const yPos = row * options.stepSize;

      this.context.moveTo(0, yPos);
      this.context.lineTo(options.endPosition, yPos);
    }
  }

  onMouseOverGrid(coordinates: [Coordinates, Coordinates]): void {
    const [prevCoordinates, newCoordinates] = coordinates;
    if (!this.overlayCanvasContext || !this.overlayElement) {
      return;
    }

    this.overlayCanvasContext.clearRect(
      prevCoordinates.x - this.cellWidth / 2,
      prevCoordinates.y - this.cellHeight / 2,
      this.cellWidth * 2,
      this.cellHeight * 2,
    );

    this.overlayCanvasContext.beginPath();
    this.overlayCanvasContext.rect(newCoordinates.x, newCoordinates.y, this.cellWidth, this.cellHeight);
    this.overlayCanvasContext.stroke();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
