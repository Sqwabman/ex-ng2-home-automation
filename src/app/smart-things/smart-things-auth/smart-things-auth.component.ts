import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";

const CODE_PARAM = 'code';

@Component({
  selector: 'app-smart-things-auth',
  templateUrl: './smart-things-auth.component.html',
  styleUrls: ['./smart-things-auth.component.css']
})
export class SmartThingsAuthComponent implements OnInit {

  constructor(private route: ActivatedRoute) {

  }

  ngOnInit() {
  }

}
