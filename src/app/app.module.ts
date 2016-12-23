import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {AppComponent} from './app.component';
import {AppRoutingModule} from "./app-routing.module";
import {SliderModule} from "./slider/slider.module";
import {LightModule} from "./light/light.module";
import {LightService} from "./services/light.service";
import {LightListResolve} from "./services/light-list.resolve";

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    SliderModule,
    LightModule,
  ],
  declarations: [
    AppComponent,
  ],
  providers: [
    LightService,
    LightListResolve,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
