import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from "@angular/router";
import {SmartThingsService} from "../../services/smart-things.service";

const CODE_PARAM = 'code';

@Component({
  selector: 'app-auth',
  templateUrl: 'smart-things-auth.component.html',
  styleUrls: ['smart-things-auth.component.css']
})
export class SmartThingsAuthComponent implements OnInit {

  constructor(private smartService: SmartThingsService, private router: Router, private route: ActivatedRoute) {
    let code = route.snapshot.queryParams[CODE_PARAM];

    if (code) {
      this.smartService.authenticate(code)
        .then(() => {
          return this.router.navigate(['/'], {queryParams: {}});
        });
    }
  }

  ngOnInit() {
  }

}
