import {LightCapability} from "./light-capability.interface";
import {LightType} from "./light-type.enum";
import {LightKey} from "./light-key.interface";
export interface Light{
  key: LightKey;
  name: string;
  capabilities: LightCapability[];
}
