import {Component, OnInit, Input} from '@angular/core';
import {HueLight} from "../../../../server/philips-hue/hue-light.interface";
import {HueService} from "../services/hue.service";

const MAX_HUE = 65535;

@Component({
  selector: 'app-hue-light',
  templateUrl: './hue-light.component.html',
  styleUrls: ['./hue-light.component.css']
})
export class HueLightComponent implements OnInit {
  @Input() light: HueLight;

  colorWidth = 500;

  constructor(private hueService: HueService) {
  }

  ngOnInit() {
  }

  toggle(light: HueLight) {
    this.hueService.toggleLight(light);
  }

  colorLoop(light: HueLight) {
    this.hueService.colorLoop(light);
  }

  get sliderX(): number {
    return this.light.info.state.hue / MAX_HUE;
  }

  colorChange(value: number){
    console.log(value * MAX_HUE);
    this.hueService.setLightHue(this.light, value * MAX_HUE);
  }

}
