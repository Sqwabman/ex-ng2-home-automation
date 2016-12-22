import {ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, Router} from "@angular/router";
import {SmartThingsService} from "./smart-things.service";
import {Injectable} from "@angular/core";

const CODE_PARAM = 'code';

@Injectable()
export class SmartThingsAuthResolve implements CanActivate {

  constructor(private smartService: SmartThingsService, private router: Router) {

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> | boolean {
    let code = route.queryParams[CODE_PARAM];

    if (code) {
      console.debug('Going to send code');
      return this.smartService.sendCode(code)
        .then(() => this.router.navigate(['../summary', {queryParams: {}}]));
    }
    return true;
  }

}
