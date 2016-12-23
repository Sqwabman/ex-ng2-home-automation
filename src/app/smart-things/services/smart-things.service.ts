import {Injectable} from '@angular/core';
import {Http} from "@angular/http";
import {ActivatedRoute} from "@angular/router";
import {SmartThingsSwitch} from "../../../../server/smart-things/smart-things-switch.interface";
import {AUTH_URL, CLIENT_ID} from "../../../../server/smart-things/smart-things.controller";

const CALLBACK_URL = encodeURIComponent('http://localhost:4200/smart/auth');

const SMART_API = 'api/smart';

@Injectable()
export class SmartThingsService {

  constructor(private http: Http, private route: ActivatedRoute) {
  }

  isAuthenticated(): Promise<boolean> {
    return this.http.get(`${SMART_API}/authenticated`)
      .toPromise()
      .then(i => i.json() as boolean);
  }

  authenticateLink(): string {
    return `${AUTH_URL}?response_type=code&client_id=${CLIENT_ID}&scope=app&redirect_uri=${CALLBACK_URL}`;
  }

  authenticate(code: string): Promise<boolean> {
    console.debug('Code', code);
    return this.http.get(`${SMART_API}/token/${code}/${CALLBACK_URL}`)
      .toPromise();
  }

  getSwitches(): Promise<SmartThingsSwitch[]> {
    return this.http.get(`${SMART_API}/smart/`)
      .toPromise()
      .then(switches => switches.json() as SmartThingsSwitch[]);
  }

  // getEndpoints(): Promise<any> {
  //   return this.http.get(`api/smart/endpoints/${this.token.access_token}`)
  //     .toPromise()
  //     .then(response => {
  //       this.endpoints = response.json();
  //       console.log(this.endpoints);
  //     });
  // }

  // getSwitches(): Promise <SmartThingsSwitch[]> {
  //   return this.getCommand('/switches')
  //     .then(response => response.json() as SmartThingsSwitch[]);
  // }
  //
  // allSwitchesOn() {
  //   return this.putCommand('/switches/on');
  // }
  //
  // allSwitchesOff() {
  //   return this.putCommand('/switches/off');
  // }

  // getCommand(commandURL: string): Promise<any> {
  //   return this.http.get(`api/smart/${this.token.access_token}/${this.getEndpoint()}${encodeURIComponent(commandURL)}`)
  //     .toPromise();
  // }
  //
  // putCommand(commandURL: string, body?: any): Promise<any> {
  //   return this.http.put(`api/smart/${this.token.access_token}/${this.getEndpoint()}${encodeURIComponent(commandURL)}`, body)
  //     .toPromise();
  // }

  // private getTokenHeader(): Headers {
  //   let headers = new Headers();
  //
  //   if (this.token)
  //     headers.append('Authorization', `Bearer ${this.token.access_token}`);
  //
  //   return headers;
  // }

  // private getEndpoint(): string {
  //   return encodeURIComponent(this.endpoints[0].uri);
  // }
}
