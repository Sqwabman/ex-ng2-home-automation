import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";
import {DeviceService} from "./device.service";
import {Injectable} from "@angular/core";
import {Device} from "../../../server/devices/device.interface";

@Injectable()
export class DeviceListResolve implements Resolve<Device[]>{

  constructor(private deviceService: DeviceService){}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
    return this.deviceService.getAllDevices();
  }

}
