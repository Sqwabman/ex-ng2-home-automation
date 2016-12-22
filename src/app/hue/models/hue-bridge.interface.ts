import {HueLight} from "./hue-light.interface";
export interface HueBridge{
  lights?: HueLight[];
  ip: string;
  username: string;
}
