import * as fs from 'fs';
import {Http} from "../utility/http";
import {PhilipsHueInfo} from "./philips-hue-info.interface";
import {HueResponse} from "./hue-response.interface";
import {HueBridge} from "./hue-bridge.interface";
import {isUndefined} from "util";
import {HueLight} from "./hue-light.interface";

const DEFAULT_CONFIG = 'philips-hue.json';
const UTF8 = 'utf8';

export class PhilipsHueController {
  private config: string;
  private http: Http;
  private info: PhilipsHueInfo;

  public constructor(options: {
    config?: string,
  } = {}) {
    this.http = new Http();
    this.config = options.config || DEFAULT_CONFIG;
    fs.exists(this.config, (exists) => {
      if (exists) {
        console.log('Reading hue config', this.config);
        this.info = JSON.parse(fs.readFileSync(this.config, UTF8));
      }
      else {
        this.info = {bridges: null};
      }
    });
  }

  isAuthenticated(): boolean {
    return this.info.bridges && this.info.bridges.length > 0;
  }

  getHueIPs(): Promise<string[]> {
    console.log('Get hue ips')
    return this.http.get('https://www.meethue.com/api/nupnp')
      .then(res => res.map(ip => ip.internalipaddress));
  }

  authenticate(ip: string): Promise<boolean> {
    return this.http.post(`http://${ip}/api`, {body: JSON.stringify({devicetype: 'HomeAutomation'})})
      .then(res => {
        console.log(res);

        if ((res as HueResponse[]).every(r => !isUndefined(r.success))) {
          return this.createBridge(ip, res);
        }
        throw new Error('No bridge connected to');
      })
      .then((bridge) => this.getLights(bridge));
  }

  private createBridge(ip: string, res: HueResponse[]): HueBridge {
    let response = res[0];

    this.info.bridges = this.info.bridges ? this.info.bridges.filter(b => b.ip !== ip) : [];

    let bridge = {
      ip: ip,
      username: response.success.username
    };
    this.info.bridges.push(bridge);

    this.saveInfo();

    console.log('Bridge added', bridge);
    return bridge;
  }

  getAllLights(): Promise<HueLight[]> {
    return Promise.all(this.info.bridges.map(bridge => this.getLights(bridge)))
      .then(values => {
        return [].concat.apply([], values);
      });
  }

  getLights(bridge: HueBridge): Promise<HueLight[]> {
    console.log('Getting lights form bridge', bridge);
    return this.http.get(`http://${bridge.ip}/api/${bridge.username}/lights`)
      .then(lights => {
        let lightList: HueLight[] = [];
        for (let propIndex in lights) {
          if (propIndex) {
            lightList.push(this.createLight(propIndex, bridge, lights[propIndex]));
          }
        }
        return lightList;
      });
  }

  public getLight(ip: string, username: string, id: string) {
    let light = this.createLight(id, {ip: ip, username: username});
    console.log('Getting lights', light);
    return this.http.get(this.lightUri(light))
      .then(info => {
        light.info = info;
        return light
      });
  }

  public setLightState(bridge: HueBridge, id: string, state: any): Promise<HueLight> {
    let light = this.createLight(id, bridge);

    console.log('Setting light state', light, state);
    return this.http.put(`${this.lightUri(light)}/state`, {body: JSON.stringify(state)})
      .then(info => {
        light.info = info;
        return light
      })
  }

  public createLight(id: string, bridge: HueBridge, info?: any): HueLight {
    return {
      key: {
        id: id,
        bridge: bridge,
      },
      info: info,
    };
  }

  // colorLoop(light: HueLight) {
  //   this.setLightState(light, {
  //     on: true,
  //     effect: 'colorloop',
  //     sat: 200,
  //     bri: 254,
  //   });
  // }
  //
  // setLightHue(light: any, hue: number) {
  //   this.setLightState(light, {
  //     on: true,
  //     hue: Math.floor(hue),
  //     sat: 254
  //   });
  // }
  //
  // toggleLight(light: HueLight) {
  //   this.setLightState(light, {
  //     on: !light.info.state.on,
  //   });
  // }

  // setLightState(light: HueLight, state: HueState) {
  //   this.http.put(`http://${light.bridge.ip}/api/${light.bridge.username}/lights/${light.id}/state`, state, this.getHeaders())
  //     .then(i => this.updateLight(light))
  //     .catch(error => console.log(error));
  // }

  private getHeaders(): any {
    return {'Content-Type': 'application/json'};
  }

  private saveInfo() {
    console.log('Saving hue config', this.info);
    fs.writeFile(this.config, JSON.stringify(this.info));
  }

  private lightUri(hueLight: HueLight) {
    return `http://${hueLight.key.bridge.ip}/api/${hueLight.key.bridge.username}/lights/${hueLight.key.id}`;
  }
}
