import * as fs from 'fs';
import {SmartThingsInfo} from "./smart-things-info.interface";
import * as request from 'request';

const CLIENT_SECRET = '22c47bf2-6f86-4e61-8484-846289e437ad';
const CLIENT_ID = encodeURIComponent('35c643e1-5df3-4df8-8541-0e7261fa5154');

const AUTH_URL = 'https://graph.api.smartthings.com/oauth/authorize';
const TOKEN_URL = 'https://graph.api.smartthings.com/oauth/token';
const ENDPOINT_URL = 'https://graph.api.smartthings.com/api/smartapps/endpoints';

const DEFAULT_CONFIG = './smartthings.json';
const UTF8 = 'utf8';
const ERROR = 'error';
const DATA = 'data';
const END = 'end';

export class SmartThingsController {
  private config: string;
  private info: SmartThingsInfo

  constructor(options: {
    config?: string,
  } = {}) {
    this.config = options.config || DEFAULT_CONFIG;
    fs.exists(this.config, (exists) => {
      if (exists) {
        console.log('Reading config', this.config);
        this.info = JSON.parse(fs.readFileSync(this.config, UTF8));
      }
      else {
        this.info = {accessToken: null};
      }
    });
  }

  isAuthenticated(): boolean {
    return this.info.accessToken !== null;
  }

  getAuthenticationUrl() {
    return `${AUTH_URL}?response_type=code&client_id=${CLIENT_ID}&scope=app&redirect_uri=`;
  }

  getToken(code: string, callbackUrl: string): Promise<boolean> {
    let resolve: (result: boolean) => void;
    let reject: (error: any) => void;

    let body = '';
    request.get(`${TOKEN_URL}?grant_type=authorization_code&code=${code}&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&redirect_uri=${callbackUrl}`)
      .on(ERROR, (response) => {
        reject(response);
      })
      .on(DATA, (data)=>{
        body += data;
      })
      .on(END, () => {
        this.info.accessToken = JSON.parse(body);
        this.saveInfo();

        resolve(true);
      });

    return new Promise((r1, r2) => {
      resolve = r1;
      reject = r2;
    });
  }

  private saveInfo() {
    console.log('smartthings config', this.info);
    fs.writeFile(this.config, JSON.stringify(this.info));
  }
}
