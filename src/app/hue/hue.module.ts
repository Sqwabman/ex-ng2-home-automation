import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HueComponent} from './hue.component';
import {Routes, RouterModule} from "@angular/router";
import {HueService} from "./services/hue.service";
import {HttpModule} from "@angular/http";
import {HueAddBridgeComponent} from "./hue-add-bridge/hue-add-bridge.component";
import { HueBridgeComponent } from './hue-bridge/hue-bridge.component';
import {HueSummaryComponent} from "./hue-summary/hue-summary.component";
import { HueLightComponent } from './hue-light/hue-light.component';
import {SliderModule} from "../slider/slider.module";

const hueRoutes: Routes = [
  {
    path: 'hue',
    component: HueComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'summary'
      },
      {
        path: 'summary',
        component: HueSummaryComponent,
      },
    ],
  }
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(hueRoutes),
    HttpModule,
    SliderModule,
  ],
  declarations: [
    HueComponent,
    HueAddBridgeComponent,
    HueBridgeComponent,
    HueSummaryComponent,
    HueLightComponent,
  ],
  providers: [
    HueService,
  ],
})
export class HueModule {
}
