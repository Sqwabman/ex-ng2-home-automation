import {Component, OnInit, Input} from '@angular/core';
import {DeviceService} from "../../services/device.service";
import {Device} from "../../../../server/devices/device.interface";
import {DeviceCapability} from "../../../../server/devices/device-capability.interface";
import {DeviceCapabilityType} from "../../../../server/devices/device-capability-type.enum";

@Component({
  selector: 'app-device-capability',
  templateUrl: './device-capability.component.html',
  styleUrls: ['./device-capability.component.css']
})
export class DeviceCapabilityComponent implements OnInit {
  @Input() device: Device;
  @Input() capability: DeviceCapability;

  types: typeof DeviceCapabilityType = DeviceCapabilityType;

  constructor(private deviceService: DeviceService) {
  }

  ngOnInit() {
  }

  stateClick() {
    this.capability.state = !this.capability.state;
    this.deviceService.setCapabilities(this.device, [this.capability])
  }

  levelChange(value: number) {
    let on = this.device.capabilities.find(l => l.type === DeviceCapabilityType.On_Off);

    if(on)
      on.state = true;

    this.capability.level = Math.floor(value * this.capability.max);
    this.deviceService.setCapabilities(this.device, [this.capability, on])
  }
}
