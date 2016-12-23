import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Light} from "../../../../server/lights/light.interface";

@Component({
  templateUrl: './light-list.component.html',
  styleUrls: ['./light-list.component.css']
})
export class LightListComponent implements OnInit {
  lights: Light[];

  constructor(route: ActivatedRoute) {
    route.data.forEach((data: {lightList: Light[]}) => {
      this.lights = data.lightList;
    });
  }

  ngOnInit() {
  }

}
