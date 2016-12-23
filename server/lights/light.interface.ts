import {LightCapability} from "./light-capability.interface";
import {LightType} from "./light-type.enum";
import {LightKey} from "./light-key.interface";
export interface Light{
  type: LightType;
  key: LightKey | string;
  name: string;
  capabilities: LightCapability[];
}
