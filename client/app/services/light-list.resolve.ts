import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";
import {Light} from "../../../server/lights/light.interface";
import {LightService} from "./light.service";
import {Injectable} from "@angular/core";

@Injectable()
export class LightListResolve implements Resolve<Light[]>{

  constructor(private lightService: LightService){}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
    return this.lightService.getAllLights();
  }

}
