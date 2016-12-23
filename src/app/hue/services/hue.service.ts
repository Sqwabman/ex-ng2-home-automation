import {Injectable} from '@angular/core';
import {Http, Headers} from "@angular/http";
import {HueInformation} from "../../../../server/philips-hue/hue-information.interface";
import {HueResponse} from "../../../../server/philips-hue/hue-response.interface";
import {HueBridge} from "../../../../server/philips-hue/hue-bridge.interface";
import '../../rxjs-extensions';
import {HueLight} from "../../../../server/philips-hue/hue-light.interface";
import {HueState} from "../../../../server/philips-hue/hue-state.interface";

@Injectable()
export class HueService {

  constructor(private http: Http) {
  }

  getHueInformation(): HueInformation {
    let hueStr = localStorage.getItem('hue');

    if (hueStr) {
      return JSON.parse(hueStr) as HueInformation;
    }

    let info = {
      bridges: [],
    } as HueInformation;

    this.setHueInformation(info);

    return info;
  }

  setHueInformation(info: HueInformation) {
    localStorage.setItem('hue', JSON.stringify(info));
  }

  getHueIPs(): Promise<string[]> {
    return this.http.get('https://www.meethue.com/api/nupnp')
      .toPromise()
      .then(res => res.json().map(ip => ip.internalipaddress));
  }

  handshake(ip: string): Promise<HueBridge> {
    return this.http.post(`http://${ip}/api`, JSON.stringify({
      devicetype: 'HomeAutomation'
    }))
      .toPromise()
      .then(res => res.json() as HueResponse[])
      .then(res => this.createBridge(ip, res));
  }

  private createBridge(ip: string, res: HueResponse[]): HueBridge {
    let response = res[0];

    let info = this.getHueInformation();
    let bridge = {
      ip: ip,
      username: response.success.username
    } as HueBridge;
    info.bridges.push(bridge);
    this.setHueInformation(info);

    console.log(bridge);

    return bridge;
  }

  getLights(bridge: HueBridge): Promise<any> {
    return this.http.get(`http://${bridge.ip}/api/${bridge.username}/lights`)
      .toPromise()
      .then(res => {
        let json = res.json();
        let lightList: HueLight[] = [];
        for (let number in json) {
          if (number) {
            let light = json[number];

            lightList.push({
              id: number,
              bridge: bridge,
              info: light,
            });
          }
        }
        bridge.lights = lightList;
      });
  }

  updateLight(light: HueLight): Promise<HueLight> {
    return this.http.get(`http://${light.bridge.ip}/api/${light.bridge.username}/lights/${light.id}`)
      .toPromise()
      .then(newLight => light.info = newLight.json());
  }

  colorLoop(light: HueLight){
    this.setLightState(light, {
      on: true,
      effect: 'colorloop',
      sat: 200,
      bri: 254,
    });
  }

  setLightHue(light: any, hue: number) {
    this.setLightState(light, {
      on: true,
      hue: Math.floor(hue),
      sat: 254
    });
  }

  toggleLight(light: HueLight){
    this.setLightState(light, {
      on: !light.info.state.on,
    });
  }

  setLightState(light: HueLight, state: HueState) {
    this.http.put(`http://${light.bridge.ip}/api/${light.bridge.username}/lights/${light.id}/state`, state, this.getHeaders())
      .toPromise()
      .then(i => this.updateLight(light))
      .catch(error => console.log(error));
  }

  private getHeaders(): Headers {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return headers;
  }
}
