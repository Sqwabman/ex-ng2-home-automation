import {Http} from "@angular/http";
import {Injectable} from "@angular/core";
import '../rxjs-extensions';
import {DeviceConfiguration} from "../../../server/devices/device-configuration.interface";
import {Device} from "../../../server/devices/device.interface";
import {DeviceCapability} from "../../../server/devices/device-capability.interface";

@Injectable()
export class DeviceService {

  constructor(private http: Http) {

  }

  getAllDevices(): Promise<Device[]> {
    return this.http.get('api/devices')
      .toPromise()
      .then(devices => devices.json() as Device[]);
  }

  setCapabilities(device: Device, capabilities: DeviceCapability[]): Promise<Device> {
    return this.http.put('api/devices', {
      key: device.key,
      capabilities: capabilities,
    } as DeviceConfiguration)
      .toPromise();
  }
}
