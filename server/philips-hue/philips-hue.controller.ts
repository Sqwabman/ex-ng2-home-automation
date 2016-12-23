import * as fs from 'fs';
import {Http} from "../utility/http";
import {PhilipsHueInfo} from "./philips-hue-info.interface";
import {HueResponse} from "./hue-response.interface";
import {HueBridge} from "./hue-bridge.interface";
import {isUndefined} from "util";
import {HueLight} from "./hue-light.interface";
import {LightType} from "../lights/light-type.enum";

const DEFAULT_CONFIG = 'philips-hue.json';
const UTF8 = 'utf8';

export class PhilipsHueController {
  public static instance: PhilipsHueController = new PhilipsHueController();
  private config: string;
  private http: Http;
  private info: PhilipsHueInfo;

  private constructor() {
    this.http = new Http();
    this.config = DEFAULT_CONFIG;
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

  public isAuthenticated(): boolean {
    return this.info.bridges && this.info.bridges.length > 0;
  }

  public getHueIPs(): Promise<string[]> {
    console.log('Get hue ips')
    return this.http.get('https://www.meethue.com/api/nupnp')
      .then(res => res.map(ip => ip.internalipaddress));
  }

  public authenticate(ip: string): Promise<boolean> {
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

  public getAllLights(): Promise<HueLight[]> {
    return Promise.all(this.info.bridges.map(bridge => this.getLights(bridge)))
      .then(values => {
        return [].concat.apply([], values);
      });
  }

  public getLights(bridge: HueBridge): Promise<HueLight[]> {
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

  public readLights(responses: HueResponse[]) {
    console.log(responses);
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

  public setLightState(bridge: HueBridge, id: string, state: any): Promise<boolean> {
    let light = this.createLight(id, bridge);

    console.log('Setting light state', light, state);
    return this.http.put(`${this.lightUri(light)}/state`, {body: JSON.stringify(state)})
      .then((res: HueResponse[]) => {
        return res.every(r => !isUndefined(r.success));
      });
  }

  public createLight(id: string, bridge: HueBridge, info?: any): HueLight {
    return {
      key: {
        id: id,
        type: LightType.Hue,
        bridge: bridge,
      },
      info: info,
    };
  }

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
