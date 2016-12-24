import {DeviceCapability} from "./device-capability.interface";
import {Device} from "./device.interface";
import {DeviceKey} from "./device-key.interface";
export interface DeviceConfiguration{
  key: DeviceKey;
  capabilities: DeviceCapability[];
}
