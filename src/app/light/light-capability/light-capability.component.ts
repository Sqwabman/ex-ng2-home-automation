import {Component, OnInit, Input} from '@angular/core';
import {LightCapability} from "../../../../server/lights/light-capability.interface";
import {LightCapabilityType} from "../../../../server/lights/light-capability-type.enum";
import {LightService} from "../../services/light.service";
import {Light} from "../../../../server/lights/light.interface";

@Component({
  selector: 'app-light-capability',
  templateUrl: './light-capability.component.html',
  styleUrls: ['./light-capability.component.css']
})
export class LightCapabilityComponent implements OnInit {
  @Input() light: Light;
  @Input() capability: LightCapability;

  types: typeof LightCapabilityType = LightCapabilityType;

  constructor(private lightService: LightService) {
  }

  ngOnInit() {
  }

  stateClick() {
    this.capability.state = !this.capability.state;
    this.lightService.setCapabilities(this.light, [this.capability])
  }

  levelChange(value: number) {
    let on = this.light.capabilities.find(l => l.type === LightCapabilityType.On_Off);

    if(on)
      on.state = true;

    this.capability.level = Math.floor(value * this.capability.max);
    this.lightService.setCapabilities(this.light, [this.capability, on])
  }
}
