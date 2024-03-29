import {Injectable, Inject} from '@angular/core';
import {Http} from "@angular/http";
import {ActivatedRoute} from "@angular/router";
import {SmartThingsSwitch} from "../../../server/smart-things/smart-things-switch.interface";
import {AUTH_URL, CLIENT_ID} from "../../../server/smart-things/smart-things.constants";
import {DOCUMENT} from "@angular/platform-browser";

const CALLBACK_URL = encodeURIComponent('http://localhost:4200/smart/auth');

const SMART_API = 'api/smart';

@Injectable()
export class SmartThingsService {

  constructor(private http: Http, private route: ActivatedRoute, @Inject(DOCUMENT) private document) {
  }

  isAuthenticated(): Promise<boolean> {
    return this.http.get(`${SMART_API}/authenticated`)
      .toPromise()
      .then(i => i.json() as boolean);
  }

  authenticateLink(): string {
    return `${AUTH_URL}?response_type=code&client_id=${CLIENT_ID}&scope=app&redirect_uri=${this.getCallback()}`;
  }

  authenticate(code: string): Promise<boolean> {
    console.debug('Code', code);
    return this.http.get(`${SMART_API}/token/${code}/${this.getCallback()}`)
      .toPromise();
  }

  getSwitches(): Promise<SmartThingsSwitch[]> {
    return this.http.get(`${SMART_API}/smart/`)
      .toPromise()
      .then(switches => switches.json() as SmartThingsSwitch[]);
  }

  private getCallback() {
    return encodeURIComponent(document.location.protocol + '//' + document.location.hostname + (document.location.port === '80' ? '' : ':' + document.location.port) + '/smart/auth');
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
