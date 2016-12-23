import * as fs from 'fs';
import {SmartThingsInfo} from "./smart-things-info.interface";
import {AccessToken} from "./access-token.interface";
import {Http} from "../utility/http";
import {SmartThingsSwitch} from "./smart-things-switch.interface";

export const CLIENT_ID = 'f74b7343-f83b-4335-8a30-bf1e1e94f1ad';
const CLIENT_SECRET = '58a8906a-7cd6-4e5e-b211-7a1eeb715c5c';

export const AUTH_URL = 'https://graph.api.smartthings.com/oauth/authorize';
const TOKEN_URL = 'https://graph.api.smartthings.com/oauth/token';
const ENDPOINT_URL = 'https://graph.api.smartthings.com/api/smartapps/endpoints';

const DEFAULT_CONFIG = 'smartthings.json';
const UTF8 = 'utf8';

const ON = 'on';
const OFF = 'off';

export class SmartThingsController {
  private config: string;
  private info: SmartThingsInfo;
  private http: Http;

  public constructor(options: {
    config?: string,
  } = {}) {
    this.http = new Http();
    this.config = options.config || DEFAULT_CONFIG;
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
    return this.http.get(`${ENDPOINT_URL}?grant_type=authorization_code&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&redirect_uri=${callbackUrl}`, this.getHeader())
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
    return this.http.get(`${this.info.endpoints[0].uri}/switches`, this.getHeader());
  }

  public changeSwitchState(id: string, state: boolean): Promise<boolean> {
    return this.http.put(`${this.info.endpoints[0].uri}/switches/${id}/${state ? ON : OFF}`, this.getHeader())
      .then(() => true);
  }

  private saveInfo() {
    console.log('smartthings config', this.info);
    fs.writeFile(this.config, JSON.stringify(this.info));
  }

  private getHeader(): any {
    return {auth: {bearer: this.info.accessToken.access_token}}
  }
}
