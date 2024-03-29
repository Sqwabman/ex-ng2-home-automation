import * as fs from 'fs';
import {Http} from "../utility/http";
import {PhilipsHueInfo} from "./philips-hue-info.interface";
import {HueResponse} from "./hue-response.interface";
import {HueBridge} from "./hue-bridge.interface";
import {isUndefined} from "util";
import {HueLight} from "./hue-light.interface";
import {DeviceType} from "../devices/device-type.enum";
import * as schedule from 'node-schedule';
import {Device} from "../devices/device.interface";
import {SmartThingsController} from "../smart-things/smart-things.controller";

const DEFAULT_CONFIG = 'philips-hue.json';
const UTF8 = 'utf8';

export class PhilipsHueController {
  public static instance: PhilipsHueController = new PhilipsHueController();
  private config: string;
  private http: Http;
  private info: PhilipsHueInfo;

  away = false;

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

    let j = schedule.scheduleJob('30 * * * * *', () => {
      this.getAllLights()
        .then((lights: HueLight[]) => {
          let keyLight = lights.find(light => light.key.id === '3');

          if (keyLight.info.state.reachable && this.away) {
            lights.forEach(light => this.setLightState(light, {
              on: true,
              hue: 0,
              sat: 0,
              bri: 254,
            }));
            this.away = false;
          }
          else if (!keyLight.info.state.reachable && !this.away) {
            this.away = true;
            lights.forEach(light => this.setLightState(light, {on: false}));
          }
        });
    });
  }

  /**
   * Checks to see if the bridge is authenticate.
   * @returns {boolean}
   */
  public isAuthenticated(): boolean {
    return this.info.bridges && this.info.bridges.length > 0;
  }

  /**
   * Gets a list of possible hue bridge ips
   * @returns {Promise<TResult>}
   */
  public getHueIPs(): Promise<string[]> {
    console.log('Get hue ips')
    return this.http.get('https://www.meethue.com/api/nupnp')
      .then(res => res.map(ip => ip.internalipaddress));
  }

  /**
   * Tries to authenticate with the provided bridge ip
   * @param ip
   * @returns {Promise<TResult>}
   */
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

  /**
   * Creates a new bridge and saves it to the config
   * @param ip
   * @param res
   * @returns {{ip: string, username: string}}
   */
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

  /**
   * Gets all lights from all bridges
   * @returns {Promise<TResult>}
   */
  public getAllLights(): Promise<HueLight[]> {
    if (this.info && this.info.bridges) {
      return Promise.all(this.info.bridges.map(bridge => this.getLights(bridge)))
        .then(values => {
          return [].concat.apply([], values);
        });
    }

    return Promise.resolve([]);
  }

  /**
   * Gets all lights from a given bridge
   * @param bridge
   * @returns {Promise<HueLight[]>}
   */
  public getLights(bridge: HueBridge): Promise<HueLight[]> {
    console.log('Getting lights form bridge', bridge);
    return this.http.get(`http://${bridge.ip}/api/${bridge.username}/lights`)
      .then(lights => {
        let lightList: HueLight[] = [];
        for (let propIndex in lights) {
          if (propIndex) {
            lightList.push(this.createLight(bridge, propIndex, lights[propIndex]));
          }
        }
        return lightList;
      });
  }

  /**
   * Gets the information for a given light
   * @param ip
   * @param username
   * @param id
   * @returns {Promise<HueLight>}
   */
  public getLight(bridge: HueBridge, id: string) {
    let light = this.createLight(bridge, id);
    console.log('Getting lights', light);
    return this.http.get(this.lightUri(light))
      .then(info => {
        light.info = info;
        return light
      });
  }

  public setLightStateById(bridge: HueBridge, id: string, state: any): Promise<boolean> {
    return this.setLightState(this.createLight(bridge, id), state);
  }

  public setLightState(light: HueLight, state: any): Promise<boolean> {
    console.log('Setting light state', light, state);
    return this.http.put(`${this.lightUri(light)}/state`, {body: JSON.stringify(state)})
      .then((res: HueResponse[]) => {
        return res.every(r => !isUndefined(r.success));
      });
  }

  public createLight(bridge: HueBridge, id: string, info?: any): HueLight {
    return {
      key: {
        id: id,
        type: DeviceType.Hue,
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
