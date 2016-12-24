import {DeviceCapability} from "./device-capability.interface";
import {DeviceType} from "./device-type.enum";
import {DeviceKey} from "./device-key.interface";
export interface Device{
  key: DeviceKey;
  name: string;
  capabilities: DeviceCapability[];
}
