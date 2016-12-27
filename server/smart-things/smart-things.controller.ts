import * as fs from 'fs';
import {SmartThingsInfo} from "./smart-things-info.interface";
import {AccessToken} from "./access-token.interface";
import {Http} from "../utility/http";
import {SmartThingsSwitch} from "./smart-things-switch.interface";
import {AUTH_URL, CLIENT_ID, TOKEN_URL, ENDPOINT_URL} from './smart-things.constants'

export const CLIENT_SECRET = '58a8906a-7cd6-4e5e-b211-7a1eeb715c5c';

const DEFAULT_CONFIG = 'smartthings.json';
const UTF8 = 'utf8';

const ON = 'on';
const OFF = 'off';

export class SmartThingsController {
  public static instance = new SmartThingsController();
  private config: string;
  private info: SmartThingsInfo;
  private http: Http;

  private constructor() {
    this.http = new Http();
    this.config = DEFAULT_CONFIG;
    fs.exists(this.config, (exists) => {
      if (exists) {
        console.log('Reading smartthings config', this.config);
        this.info = JSON.parse(fs.readFileSync(this.config, UTF8));
      }
      else {
        this.info = {accessToken: null, endpoints: null};
      }
    });
  }

  public isAuthenticated(): boolean {
    return this.info.endpoints !== null;
  }

  public getAuthenticationUrl(): string {
    return `${AUTH_URL}?response_type=code&client_id=${CLIENT_ID}&scope=app&redirect_uri=`;
  }

  public getAuthentication(code: string, callbackUrl: string): Promise<boolean> {
    return this.http.get(`${TOKEN_URL}?grant_type=authorization_code&code=${code}&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&redirect_uri=${callbackUrl}`)
      .then(token => this.getEndPoints(token, callbackUrl));
  }

  private getEndPoints(accessToken: AccessToken, callbackUrl: string): Promise<boolean> {
    return this.http.get(`${ENDPOINT_URL}?grant_type=authorization_code&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&redirect_uri=${callbackUrl}`, this.getHeader(accessToken))
      .then(endpoints => {
        //if there is at least one endpoint
        if (endpoints && endpoints.length > 0) {
          //create the info
          this.info.accessToken = accessToken;
          this.info.endpoints = endpoints;

          //save to config
          this.saveInfo();

          //show success
          return true;
        }
        //something went wrong so bail
        else {
          throw new Error('The response from SmartThings did not contain any endpoints.');
        }
      });
  }

  public getSwitches(): Promise<SmartThingsSwitch[]> {
    if(this.info && this.info.endpoints && this.info.endpoints.length > 0) {
      return this.http.get(`${this.info.endpoints[0].uri}/switches`, this.getHeader(this.info.accessToken));
    }

    return Promise.resolve([]);
  }

  public changeSwitchState(id: string, state: boolean): Promise<boolean> {
    return this.http.put(`${this.info.endpoints[0].uri}/switches/${id}/${state ? ON : OFF}`, this.getHeader(this.info.accessToken))
      .then(() => true);
  }

  private saveInfo() {
    console.log('smartthings config', this.info);
    fs.writeFile(this.config, JSON.stringify(this.info));
  }

  private getHeader(accessToken: AccessToken): any {
    return {auth: {bearer: accessToken.access_token}}
  }
}
