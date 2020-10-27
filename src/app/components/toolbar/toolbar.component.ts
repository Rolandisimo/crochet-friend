import { Component, OnInit, OnDestroy, ViewChildren, QueryList, ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { ImageUploadService } from '../image-upload/image-upload.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit, OnDestroy {
  private subscription = new Subscription();
  // public images: HTMLImageElement[] = [];
  constructor(private imageUploadService: ImageUploadService) { }

  @ViewChild('imgTarget') imgTarget!: ElementRef<HTMLSpanElement>;
  // @ViewChild('imgTarget') images!: QueryList<HTMLImageElement>;

  ngOnInit(): void {
    this.subscription.add(
      this.imageUploadService.newCachedImage.subscribe((image) => {
        console.log('image', image);
        if (!image) {
          return;
        }
        this.imgTarget.nativeElement.appendChild(image);
        // this.images.forEach((imgTarget) => {
        //   imgTarget.appendChild(image);
        // });
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
