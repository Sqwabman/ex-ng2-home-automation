import {PhilipsHueController} from "../philips-hue/philips-hue.controller";
import {SmartThingsController} from "../smart-things/smart-things.controller";
export class LightController {
  hue: PhilipsHueController;
  smart: SmartThingsController;

  constructor(options: {
    hueConfig?: string,
    smartConfig?: string
  } = {}) {

  }
}
