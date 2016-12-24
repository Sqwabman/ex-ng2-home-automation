import {Component, OnInit, Input} from '@angular/core';
import {SmartThingsSwitch} from "../../../../server/smart-things/smart-things-switch.interface";

@Component({
  selector: 'app-smart-things-switch',
  templateUrl: './smart-things-switch.component.html',
  styleUrls: ['./smart-things-switch.component.css']
})
export class SmartThingsSwitchComponent implements OnInit {
  @Input() deviceSwitch: SmartThingsSwitch;

  constructor() { }

  ngOnInit() {
  }

}
