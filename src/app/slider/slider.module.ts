import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SliderComponent} from './slider.component';
import {DraggableDirective} from "./draggable.directive";

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    SliderComponent,
    DraggableDirective,
  ],
  exports: [
    SliderComponent,
    DraggableDirective,
  ],
})
export class SliderModule {
}
