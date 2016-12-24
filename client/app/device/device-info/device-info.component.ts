import {Component, OnInit, Input} from '@angular/core';
import {Device} from "../../../../server/devices/device.interface";

@Component({
  selector: 'app-device-info',
  templateUrl: './device-info.component.html',
  styleUrls: ['./device-info.component.css']
})
export class DeviceInfoComponent implements OnInit {
  @Input() device: Device;

  constructor() { }

  ngOnInit() {
  }

}
