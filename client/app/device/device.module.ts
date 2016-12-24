import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DeviceInfoComponent} from './device-info/device-info.component';
import {DeviceComponent} from "./device.component";
import {RouterModule, Routes} from "@angular/router";
import { DeviceListComponent } from './device-list/device-list.component';
import {DeviceListResolve} from "../services/device-list.resolve";
import { DeviceCapabilityComponent } from './device-capability/device-capability.component';
import {SliderModule} from "../slider/slider.module";

const hueRoutes: Routes = [
  {
    path: 'devices',
    component: DeviceComponent,
    children: [
      {
        path: '',
        component: DeviceListComponent,
        resolve:{
          deviceList: DeviceListResolve
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
    DeviceComponent,
    DeviceInfoComponent,
    DeviceListComponent,
    DeviceCapabilityComponent,
  ]
})
export class DeviceModule {
}
