import {Component, OnInit} from '@angular/core';
import {HueService} from "../services/hue.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-hue-add-bridge',
  templateUrl: './hue-add-bridge.component.html',
  styleUrls: ['./hue-add-bridge.component.css']
})
export class HueAddBridgeComponent implements OnInit {
  state: string;
  ips: string[];
  ip: string;

  constructor(private hueService: HueService, private router: Router) {
  }

  ngOnInit() {
    this.state = 'get';
    this.hueService.getHueIPs()
      .then(ips => {
        this.ips = ips;
        this.state = 'select';
      })
      .catch(error => console.log(error))
      .catch(error => this.ips = []);
  }

  selectedIP(ip: string) {
    this.state = null;
    this.ip = ip;
    this.hueService.handshake(ip)
      .then(hand => this.router.navigate(['../']))
      .catch(error => this.state = 'button');
  }

}
