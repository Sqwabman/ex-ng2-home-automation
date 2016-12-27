import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {AppComponent} from './app.component';
import {AppRoutingModule} from "./app-routing.module";
import {SliderModule} from "./slider/slider.module";
import {DeviceModule} from "./device/device.module";
import {DeviceService} from "./services/device.service";
import {DeviceListResolve} from "./services/device-list.resolve";
import {DeviceSocketService} from "./services/device-socket.service";
import {SmartThingsModule} from "./smart-things/smart-things.module";

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    SliderModule,
    DeviceModule,
    SmartThingsModule,
  ],
  declarations: [
    AppComponent,
  ],
  providers: [
    DeviceService,
    DeviceListResolve,
    DeviceSocketService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
