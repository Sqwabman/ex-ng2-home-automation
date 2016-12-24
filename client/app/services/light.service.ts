import {Http} from "@angular/http";
import {Light} from "../../../server/lights/light.interface";
import {Injectable} from "@angular/core";
import '../rxjs-extensions';
import {LightCapability} from "../../../server/lights/light-capability.interface";
import {LightConfiguration} from "../../../server/lights/light-configuration.interface";

@Injectable()
export class LightService {

  constructor(private http: Http) {

  }

  getAllLights(): Promise<Light[]> {
    return this.http.get('api/lights')
      .toPromise()
      .then(lights => lights.json() as Light[]);
  }

  setCapabilities(light: Light, capabilities: LightCapability[]): Promise<Light> {
    return this.http.put('api/lights', {
      key: light.key,
      capabilities: capabilities,
    } as LightConfiguration)
      .toPromise();
  }
}
