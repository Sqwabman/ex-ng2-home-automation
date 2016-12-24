import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {DeviceSocketService} from "../../services/device-socket.service";
import {Device} from "../../../../server/devices/device.interface";

@Component({
  templateUrl: './device-list.component.html',
  styleUrls: ['./device-list.component.css']
})
export class DeviceListComponent implements OnInit {
  devices: Device[];

  constructor(route: ActivatedRoute, private deviceSocket: DeviceSocketService) {
    route.data.forEach((data: {deviceList: Device[]}) => {
      this.devices = data.deviceList;
    });
  }

  ngOnInit() {
  }

}
