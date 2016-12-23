import {HueBridge} from "./hue-bridge.interface";
import {LightKey} from "../lights/light-key.interface";
export interface HueKey extends LightKey {
  id: string;
  bridge: HueBridge;
}
