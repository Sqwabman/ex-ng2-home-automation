import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SmartThingsComponent} from './smart-things.component';
import {Routes, RouterModule} from "@angular/router";
import {SmartThingsSummaryComponent} from './smart-things-summary/smart-things-summary.component';
import {SmartThingsAccountComponent} from './smart-things-account/smart-things-account.component';
import {SmartThingsService} from "./services/smart-things.service";
import {SmartThingsSwitchComponent} from './smart-things-switch/smart-things-switch.component';
import {SmartThingsAuthResolve} from "./services/smart-things-auth.resolve";
import { AuthComponent } from './auth/auth.component';


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
        component: AuthComponent,
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
    SmartThingsAccountComponent,
    SmartThingsSwitchComponent,
    AuthComponent,
  ],
  providers: [
    SmartThingsService,
    SmartThingsAuthResolve,
  ],
})
export class SmartThingsModule {
}
