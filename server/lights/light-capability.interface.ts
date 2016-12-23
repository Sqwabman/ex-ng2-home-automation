import {LightCapabilityType} from "./light-capability-type.enum";
export interface LightCapability{
  level?: number;
  state?: boolean;
  type: LightCapabilityType;
}
