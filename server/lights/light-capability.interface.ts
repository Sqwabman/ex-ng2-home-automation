import {LightCapabilityType} from "./light-capability-type.enum";
export interface LightCapability{
  level?: number;
  max?: number;
  state?: boolean;
  type: LightCapabilityType;
}
