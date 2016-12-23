import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LightInfoComponent} from './light-info/light-info.component';
import {LightComponent} from "./light.component";
import {RouterModule, Routes} from "@angular/router";
import { LightListComponent } from './light-list/light-list.component';
import {LightListResolve} from "../services/light-list.resolve";
import { LightCapabilityComponent } from './light-capability/light-capability.component';
import {SliderModule} from "../slider/slider.module";

const hueRoutes: Routes = [
  {
    path: 'lights',
    component: LightComponent,
    children: [
      {
        path: '',
        component: LightListComponent,
        resolve:{
          lightList: LightListResolve
        }
      },
    ],
  }
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(hueRoutes),
    SliderModule,
  ],
  declarations: [
    LightComponent,
    LightInfoComponent,
    LightListComponent,
    LightCapabilityComponent,
  ]
})
export class LightModule {
}
