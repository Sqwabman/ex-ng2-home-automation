import {AccessToken} from "./access-token.interface";
import {Endpoint} from "./endpoint.interface";
import {SmartThingsSwitch} from "./smart-things-switch.interface";
export interface SmartThingsInfo {
  accessToken: AccessToken;
  endpoints: Endpoint[];
}
