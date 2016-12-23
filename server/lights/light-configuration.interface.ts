import {LightCapability} from "./light-capability.interface";
import {Light} from "./light.interface";
import {LightKey} from "./light-key.interface";
export interface LightConfiguration{
  key: LightKey;
  capabilities: LightCapability[];
}
