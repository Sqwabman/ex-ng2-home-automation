import {SmartThingsKey} from "./smart-things-key.interface";
export interface SmartThingsSwitch{
  id: SmartThingsKey;
  name: string;
  on: boolean;
}
