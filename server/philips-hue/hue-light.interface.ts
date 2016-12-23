import {HueState} from "./hue-state.interface";
import {HueKey} from "./hue-key.interface";
export interface HueLight {
  key: HueKey;
  info: {
    state: HueState,
    type: string,
    name: string,
    modelid: string,
    swversion: string,
    pointsymbol: {
      1: string,
      2: string,
      3: string,
      4: string,
      5: string,
      6: string,
      7: string,
      8: string
    }
  }
}
