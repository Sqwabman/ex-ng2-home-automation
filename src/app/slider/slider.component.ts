import {Component, OnInit, ElementRef, Input, HostListener, Output, EventEmitter} from '@angular/core';

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
  @Input('width') inputWidth: number;
  @Output() change = new EventEmitter<number>();
  dragX: number;

  sliderWidth = 10;

  get width(): number {
    return this.inputWidth - this.sliderWidth || 500;
  }

  constructor(private elementRef: ElementRef) {
  }

  ngOnInit() {
    if (!this.value) {
      this.value = .5;
    }
  }

  @HostListener('document:mouseup', ['$event'])
  onMouseUp(event) {
    if(this.dragX){
      this.change.emit(this.value);
    }
    this.dragX = null;
  }

  onBackgroundMouseDown(event: MouseEvent){
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
      this.value = Math.min(Math.max(((event.clientX - this.elementRef.nativeElement.offsetLeft) - this.dragX), 0), this.width) / (this.width);

    }
  }

  get position(): number {
    return this.width * this.value;
  }

}
