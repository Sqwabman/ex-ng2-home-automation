import {Component, OnInit, Input} from '@angular/core';
import {Light} from "../../../../server/lights/light.interface";

@Component({
  selector: 'app-light-info',
  templateUrl: './light-info.component.html',
  styleUrls: ['./light-info.component.css']
})
export class LightInfoComponent implements OnInit {
  @Input() light: Light;

  constructor() { }

  ngOnInit() {
  }

}
