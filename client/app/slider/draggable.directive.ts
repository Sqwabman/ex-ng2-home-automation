import {Directive, OnInit, HostListener, ElementRef} from '@angular/core';

@Directive({
  selector: '[draggable]'
})
export class DraggableDirective implements OnInit {
  dragLocation: {x: number, y: number};

  constructor(public element: ElementRef) {
    this.element.nativeElement.style.position = 'relative';
    this.element.nativeElement.style.cursor = 'pointer';
  }

  ngOnInit() {
  }

  @HostListener('document:mouseup', ['$event'])
  onMouseup(event) {
    this.dragLocation = null;
  }

  @HostListener('mouseup', ['$event'])
  onMouseUp(event: MouseEvent) {
    this.dragLocation = null;
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    this.dragLocation = {
      x: event.offsetX,
      y: event.offsetY
    };
  }

  @HostListener('mousemove', ['$event'])
  onMousemove(event: MouseEvent) {
    if (!event.offsetY) {
      this.dragLocation = null;
    }
    else if (this.dragLocation) {
      this.element.nativeElement.style.left = (event.clientX - this.dragLocation.x) + 'px';
    }
  }
}
