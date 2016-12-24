import {HueBridge} from "./hue-bridge.interface";
import {DeviceKey} from "../devices/device-key.interface";
export interface HueKey extends DeviceKey {
  id: string;
  bridge: HueBridge;
}
