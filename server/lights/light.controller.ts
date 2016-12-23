import {PhilipsHueController} from "../philips-hue/philips-hue.controller";
import {SmartThingsController} from "../smart-things/smart-things.controller";
import {Light} from "./light.interface";
import {HueLight} from "../philips-hue/hue-light.interface";
import {LightCapabilityType} from "./light-capability-type.enum";
import {LightCapability} from "./light-capability.interface";
import {SmartThingsSwitch} from "../smart-things/smart-things-switch.interface";
import {LightType} from "./light-type.enum";
import {LightConfiguration} from "./light-configuration.interface";
import {HueKey} from "../philips-hue/hue-key.interface";
import {HueState} from "../philips-hue/hue-state.interface";
import {SmartThingsKey} from "../smart-things/smart-things-key.component";

const DIMMABLE_LIGHT = "Dimmable light";
const EXTENDED_COLOR_LIGHT = "Extended color light";

const MAX_HUE = 65535;
const MAX_SAT = 254;
const MAX_BRI = 254;

export class LightController {
  public static instance = new LightController();
  private hue = PhilipsHueController.instance;
  private smart = SmartThingsController.instance;

  private constructor() {
  }

  getAllLights(): Promise<Light[]> {
    return Promise.all([
      this.hue.getAllLights()
        .then(hues => hues.map(hue => this.createLightFromHue(hue))),
      this.smart.getSwitches()
        .then(switches => switches.map(swi => this.createLightFromSmartSwitch(swi)))
    ])
      .then(values => [].concat.apply([], values));
  }

  setCapability(config: LightConfiguration): Promise<any> {
    switch (config.key.type) {
      case LightType.Smart:
        return this.smart.changeSwitchState((config.key as SmartThingsKey).id, this.getSmartThingsSwitchState(config.capabilities));
      case LightType.Hue:
        let key = (config.key as HueKey);
        return this.hue.setLightState(key.bridge, key.id, this.createHueState(config.capabilities));
    }
  }

  private createLightFromHue(hue: HueLight): Light {
    return {
      key: hue.key,
      name: hue.info.name,
      capabilities: this.createHueCapabilityList(hue),
    };
  }

  private createHueCapabilityList(hue: HueLight): LightCapability[] {
    let capabilities: LightCapability[] = [
      {
        state: hue.info.state.on,
        type: LightCapabilityType.On_Off,
      },
      {
        level: hue.info.state.bri,
        max: MAX_BRI,
        type: LightCapabilityType.Brightness,
      }
    ];

    if (hue.info.type === EXTENDED_COLOR_LIGHT) {
      capabilities.push({
        level: hue.info.state.hue,
        max: MAX_HUE,
        type: LightCapabilityType.Hue,
      });
      capabilities.push({
        level: hue.info.state.sat,
        max: MAX_SAT,
        type: LightCapabilityType.Saturation,
      });
    }

    return capabilities;
  }

  private createLightFromSmartSwitch(swi: SmartThingsSwitch): Light {
    return {
      key: {id: swi.id, type: LightType.Smart} as SmartThingsKey,
      name: swi.name,
      capabilities: [{state: swi.on, type: LightCapabilityType.On_Off}],
    };
  }

  private createHueState(capabilities: LightCapability[]): HueState {
    let state = {} as HueState;
    for (let capability of capabilities) {
      switch (capability.type) {
        case LightCapabilityType.On_Off:
          state.on = capability.state;
          break;
        case LightCapabilityType.Brightness:
          state.bri = capability.level;
          break;
        case LightCapabilityType.Hue:
          state.hue = capability.level;
          break;
        case LightCapabilityType.Saturation:
          state.sat = capability.level;
          break;
      }
    }
    return state;
  }

  private getSmartThingsSwitchState(capabilities: LightCapability[]) {
    let onOff = capabilities.find(i => i.type === LightCapabilityType.On_Off);

    if (onOff)
      return onOff.state;
  }
}
