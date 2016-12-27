import {Component, OnInit} from '@angular/core';
import {SmartThingsService} from "../../services/smart-things.service";
import {SmartThingsSwitch} from "../../../../server/smart-things/smart-things-switch.interface";

@Component({
  selector: 'app-smart-things-summary',
  templateUrl: './smart-things-summary.component.html',
  styleUrls: ['./smart-things-summary.component.css']
})
export class SmartThingsSummaryComponent implements OnInit {

  constructor(private smartService: SmartThingsService) {
  }

  ngOnInit() {
  }

  authenticateLink(): string {
    return this.smartService.authenticateLink();
  }

}
