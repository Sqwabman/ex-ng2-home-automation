import {DeviceCapabilityType} from "./device-capability-type.enum";
export interface DeviceCapability{
  level?: number;
  max?: number;
  state?: boolean;
  type: DeviceCapabilityType;
}
