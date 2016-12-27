import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SmartThingsComponent} from './smart-things.component';
import {Routes, RouterModule} from "@angular/router";
import {SmartThingsSummaryComponent} from './smart-things-summary/smart-things-summary.component';
import {SmartThingsService} from "../services/smart-things.service";
import {SmartThingsAuthComponent} from "./smart-things-auth/smart-things-auth.component";


const smartThingsRoutes: Routes = [
  {
    path: 'smart',
    component: SmartThingsComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'summary'
      },
      {
        path: 'summary',
        component: SmartThingsSummaryComponent,
      },
      {
        path: 'auth',
        component: SmartThingsAuthComponent,
      }
    ],
  }
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(smartThingsRoutes),
  ],
  declarations: [
    SmartThingsComponent,
    SmartThingsSummaryComponent,
    SmartThingsAuthComponent,
  ],
  providers: [
    SmartThingsService,
  ],
})
export class SmartThingsModule {
}
