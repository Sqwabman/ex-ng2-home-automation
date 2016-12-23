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

const DIMMABLE_LIGHT = "Dimmable light";
const EXTENDED_COLOR_LIGHT = "Extended color light";

export class LightController {

  public constructor(private hue: PhilipsHueController, private smart: SmartThingsController) {
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
    switch (config.light.type) {
      case LightType.Smart:
        return this.smart.changeSwitchState((config.light.key as string), config.capability.state);
      case LightType.Hue:
        let key = (config.light.key as HueKey);
        return this.hue.setLightState(key.bridge, key.id, this.createHueState(config.capability));
    }
  }

  private createLightFromHue(hue: HueLight): Light {
    return {
      type: LightType.Hue,
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
        type: LightCapabilityType.Brightness,
      }
    ];

    if (hue.info.type === EXTENDED_COLOR_LIGHT) {
      capabilities.push({
        level: hue.info.state.hue,
        type: LightCapabilityType.Hue,
      });
      capabilities.push({
        level: hue.info.state.sat,
        type: LightCapabilityType.Saturation,
      });
    }

    return capabilities;
  }

  private createLightFromSmartSwitch(swi: SmartThingsSwitch): Light {
    return {
      type: LightType.Smart,
      key: swi.id,
      name: swi.name,
      capabilities: [{state: swi.on, type: LightCapabilityType.On_Off}],
    };
  }

  private createHueState(capability: LightCapability): HueState {
    return {
      on: capability.type === LightCapabilityType.On_Off ? capability.state : null,
    };
  }
}
