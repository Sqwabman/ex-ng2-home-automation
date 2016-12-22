import {Component, OnInit} from '@angular/core';
import {HueService} from "../services/hue.service";
import {HueInformation} from "../models/hue-information.interface";

@Component({
  selector: 'app-hue-summary',
  templateUrl: './hue-summary.component.html',
  styleUrls: ['./hue-summary.component.css']
})
export class HueSummaryComponent implements OnInit {
  info: HueInformation;

  constructor(private hueService: HueService) {
    this.info = this.hueService.getHueInformation();
  }

  ngOnInit() {
  }

}
