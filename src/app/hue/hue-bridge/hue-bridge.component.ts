import {Component, Input} from '@angular/core';
import {HueBridge} from "../../../../server/philips-hue/hue-bridge.interface";
import {HueService} from "../services/hue.service";

@Component({
  selector: 'app-hue-bridge',
  templateUrl: './hue-bridge.component.html',
  styleUrls: ['./hue-bridge.component.css']
})
export class HueBridgeComponent {
  @Input() bridge: HueBridge;

  constructor(private hueService: HueService) {
  }

  // ngOnInit() {
  //   if (this.bridge && !this.bridge.lights) {
  //     this.refresh();
  //   }
  // }
  //
  // refresh() {
  //   if (this.bridge) {
  //     this.hueService.getLights(this.bridge);
  //   }
  // }

}
