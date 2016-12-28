import {
  Component, OnInit, ElementRef, Input, HostListener, Output, EventEmitter, HostBinding,
  ViewEncapsulation
} from '@angular/core';

export interface SliderValue {
  fraction: number;
}

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.css']
})
export class SliderComponent implements OnInit {
  @Input() value: number;
  @Output() change = new EventEmitter<number>();
  dragX: number;

  sliderWidth = 10;
  sliderPositions = 40;

  constructor(private elementRef: ElementRef) {
  }

  ngOnInit() {
    if (!this.value) {
      this.value = .5;
    }
  }

  @HostListener('document:mouseup', ['$event'])
  onMouseUp(event) {
    if (this.dragX) {
      this.change.emit(this.value);
    }
    this.dragX = null;
  }

  onBackgroundMouseDown(event: MouseEvent) {
    this.dragX = this.sliderWidth / 2;
    this.onMouseMove(event);
  }

  onMouseDown(event: MouseEvent) {
    event.stopPropagation();
    this.dragX = event.offsetX;
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (this.dragX) {
      event.preventDefault();
      let percent = (event.clientX - this.elementRef.nativeElement.getBoundingClientRect().left) / this.elementRef.nativeElement.parentNode.offsetWidth;
      this.value = Math.min(Math.max(percent, 0), 1);
    }
  }

  get position(): number {
    return Math.round(this.value * 100);
  }

}
