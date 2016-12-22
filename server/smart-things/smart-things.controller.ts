import * as fs from 'fs';
import {SmartThingsInfo} from "./smart-things-info.interface";
import * as request from 'request';

const CALLBACK_URL = encodeURIComponent('http://localhost:4200/smart/summary');
const CLIENT_SECRET = '22c47bf2-6f86-4e61-8484-846289e437ad';
const CLIENT_ID = encodeURIComponent('35c643e1-5df3-4df8-8541-0e7261fa5154');

const TOKEN_URL = 'https://graph.api.smartthings.com/oauth/token';

const ENDPOINT_URL = 'https://graph.api.smartthings.com/api/smartapps/endpoints';

const DEFAULT_CONFIG = './smartthings.json';
const UTF8 = 'utf8';

export class SmartThingsController {
  private info: SmartThingsInfo

  constructor(options: {
    config?: string,
  } = {}) {
    fs.exists(options.config || DEFAULT_CONFIG, (exists) => {
      if (exists) {
        this.info = JSON.parse(fs.readFileSync(options.config || DEFAULT_CONFIG, UTF8));
      }
      else {
        this.info = {isAuthenticated: false,};
      }
    });
  }

  isAuthenticated() {
    return this.info.isAuthenticated;
  }

  getToken(code: string) {

  }
}
