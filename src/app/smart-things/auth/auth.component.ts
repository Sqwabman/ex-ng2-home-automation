import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute} from "@angular/router";
import {SmartThingsService} from "../services/smart-things.service";

const CODE_PARAM = 'code';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  constructor(private smartService: SmartThingsService, private router: Router, private route: ActivatedRoute) {
    let code = route.snapshot.queryParams[CODE_PARAM];

    if (code) {
      this.smartService.sendCode(code)
        .then(() => this.router.navigate(['../summary', {queryParams: {}}]));
    }
  }

  ngOnInit() {
  }

}
