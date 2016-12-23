import {LightCapability} from "./light-capability.interface";
import {Light} from "./light.interface";
export interface LightConfiguration{
  light: Light;
  capability: LightCapability;
}
