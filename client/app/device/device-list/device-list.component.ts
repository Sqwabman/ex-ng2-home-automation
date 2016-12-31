import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {DeviceSocketService} from "../../services/device-socket.service";
import {Device} from "../../../../server/devices/device.interface";
import {DeviceService} from "../../services/device.service";

@Component({
  templateUrl: './device-list.component.html',
  styleUrls: ['./device-list.component.css']
})
export class DeviceListComponent implements OnInit {
  devices: Device[];
  away = false;

  constructor(route: ActivatedRoute, private deviceSocket: DeviceSocketService, private deviceService: DeviceService) {
    route.data.forEach((data: {deviceList: Device[]}) => {
      this.devices = data.deviceList;
    });
  }

  ngOnInit() {
  }

  toggleAway() {
    this.deviceService.setAway(!this.away)
      .then(i => this.away = i);
  }

}
