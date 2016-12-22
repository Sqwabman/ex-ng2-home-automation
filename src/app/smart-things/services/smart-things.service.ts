import {Injectable} from '@angular/core';
import {Http, Headers} from "@angular/http";
import {SmartThingsSwitch} from "../models/smart-things-switch.interface";
import {ActivatedRoute} from "@angular/router";
import {AccessToken} from "../models/access-token.interface";
import {Endpoint} from "../models/endpoint.interface";

const AUTH_URL = 'https://graph.api.smartthings.com/oauth/authorize';
const CALLBACK_URL = encodeURIComponent('http://localhost:4200/smart/summary');
const CLIENT_ID = encodeURIComponent('35c643e1-5df3-4df8-8541-0e7261fa5154');

const CODE_PARAM = 'code';

@Injectable()
export class SmartThingsService {
  token: AccessToken;
  endpoints: Endpoint[];

  constructor(private http: Http, private route: ActivatedRoute) {
  }

  isAuthenticated(): Promise<any> {
    if (!this.token && this.route.snapshot.queryParams[CODE_PARAM]) {
      let code = this.route.snapshot.queryParams[CODE_PARAM];
      let header = new Headers();
      header.append('content-type', 'application/x-www-form-urlencoded');

      return this.http.get(`api/smart/token/${code}`)
        .toPromise()
        .then(response => {
          this.token = response.json();
          return this.getEndpoints();
        });
    }

    return Promise.reject('no token');
  }

  authenticateLink(): string {
    return `${AUTH_URL}?response_type=code&client_id=${CLIENT_ID}&scope=app&redirect_uri=${CALLBACK_URL}`;
  }

  getEndpoints(): Promise<any> {
    return this.http.get(`api/smart/endpoints/${this.token.access_token}`)
      .toPromise()
      .then(response => {
        this.endpoints = response.json();
        console.log(this.endpoints);
      });
  }

  getSwitches(): Promise <SmartThingsSwitch[]> {
    return this.getCommand('/switches')
      .then(response => response.json() as SmartThingsSwitch[]);
  }

  allSwitchesOn() {
    return this.putCommand('/switches/on');
  }

  allSwitchesOff() {
    return this.putCommand('/switches/off');
  }

  getCommand(commandURL: string): Promise<any> {
    return this.http.get(`api/smart/${this.token.access_token}/${this.getEndpoint()}${encodeURIComponent(commandURL)}`)
      .toPromise();
  }

  putCommand(commandURL: string, body?: any): Promise<any> {
    return this.http.put(`api/smart/${this.token.access_token}/${this.getEndpoint()}${encodeURIComponent(commandURL)}`, body)
      .toPromise();
  }

  private getTokenHeader(): Headers {
    let headers = new Headers();

    if (this.token)
      headers.append('Authorization', `Bearer ${this.token.access_token}`);

    return headers;
  }

  private getEndpoint(): string {
    return encodeURIComponent(this.endpoints[0].uri);
  }
}
