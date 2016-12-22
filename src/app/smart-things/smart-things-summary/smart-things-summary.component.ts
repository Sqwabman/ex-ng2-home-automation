import {Component, OnInit} from '@angular/core';
import {SmartThingsService} from "../services/smart-things.service";
import {SmartThingsSwitch} from "../models/smart-things-switch.interface";

@Component({
  selector: 'app-smart-things-summary',
  templateUrl: './smart-things-summary.component.html',
  styleUrls: ['./smart-things-summary.component.css']
})
export class SmartThingsSummaryComponent implements OnInit {
  switches: SmartThingsSwitch[];

  constructor(private smartService: SmartThingsService) {
    this.smartService.isAuthenticated()
      .then(i => smartService.getSwitches())
      .then(switches => this.switches = switches)
      .then(s => console.log(this.switches))
      .catch(error => console.log(error));
  }

  ngOnInit() {
  }

  authenticateLink(): string {
    return this.smartService.authenticateLink();
  }

  turnOn() {
    this.smartService.allSwitchesOn();
  }

  turnOff() {
    this.smartService.allSwitchesOff();
  }

}
