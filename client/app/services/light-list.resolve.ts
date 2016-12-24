import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";
import {LightService} from "./light.service";
import {Injectable} from "@angular/core";
import {Device} from "../../../common/device.interface";

@Injectable()
export class LightListResolve implements Resolve<Device[]>{

  constructor(private lightService: LightService){}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
    return this.lightService.getAllLights();
  }

}
