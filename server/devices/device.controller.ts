import {PhilipsHueController} from "../philips-hue/philips-hue.controller";
import {SmartThingsController} from "../smart-things/smart-things.controller";
import {Device} from "../../common/device.interface";
import {HueLight} from "../philips-hue/hue-light.interface";
import {DeviceCapabilityType} from "../../common/device-capability-type.enum";
import {DeviceCapability} from "../../common/device-capability.interface";
import {SmartThingsSwitch} from "../smart-things/smart-things-switch.interface";
import {DeviceType} from "../../common/device-type.enum";
import {DeviceConfiguration} from "../../common/device-configuration.interface";
import {HueKey} from "../philips-hue/hue-key.interface";
import {HueState} from "../philips-hue/hue-state.interface";
import {SmartThingsKey} from "../smart-things/smart-things-key.component";
import Socket = SocketIO.Socket;

const DIMMABLE_LIGHT = "Dimmable light";
const EXTENDED_COLOR_LIGHT = "Extended color light";

const COLOR_LOOP = 'colorloop';
const NONE = 'none';

const MAX_HUE = 65535;
const MAX_SAT = 254;
const MAX_BRI = 254;

export class DeviceController {
  public static instance = new DeviceController();
  private hue = PhilipsHueController.instance;
  private smart = SmartThingsController.instance;
  private socket: Socket;

  private constructor() {
  }

  setLightSocket(socket: Socket){
    this.socket = socket;
  }

  getAllLights(): Promise<Device[]> {
    return Promise.all([
      this.hue.getAllLights()
        .then(hues => hues.map(hue => this.createLightFromHue(hue))),
      this.smart.getSwitches()
        .then(switches => switches.map(swi => this.createLightFromSmartSwitch(swi)))
    ])
      .then(values => [].concat.apply([], values));
  }

  setCapability(config: DeviceConfiguration): Promise<any> {
    switch (config.key.type) {
      case DeviceType.Smart:
        return this.smart.changeSwitchState((config.key as SmartThingsKey).id, this.getSmartThingsSwitchState(config.capabilities));
      case DeviceType.Hue:
        let key = (config.key as HueKey);
        return this.hue.setLightState(key.bridge, key.id, this.createHueState(config.capabilities));
    }
  }

  private createLightFromHue(hue: HueLight): Device {
    return {
      key: hue.key,
      name: hue.info.name,
      capabilities: this.createHueCapabilityList(hue),
    };
  }

  private createHueCapabilityList(hue: HueLight): DeviceCapability[] {
    let capabilities: DeviceCapability[] = [
      {
        state: hue.info.state.on,
        type: DeviceCapabilityType.On_Off,
      },
      {
        level: hue.info.state.bri,
        max: MAX_BRI,
        type: DeviceCapabilityType.Brightness,
      }
    ];

    if (hue.info.type === EXTENDED_COLOR_LIGHT) {
      capabilities.push({
        level: hue.info.state.hue,
        max: MAX_HUE,
        type: DeviceCapabilityType.Hue,
      });
      capabilities.push({
        level: hue.info.state.sat,
        max: MAX_SAT,
        type: DeviceCapabilityType.Saturation,
      });
      capabilities.push({
        state: hue.info.state.effect === COLOR_LOOP,
        type: DeviceCapabilityType.ColorLoop,
      });
    }

    return capabilities.sort((a: DeviceCapability, b: DeviceCapability) => {
      return a.type < b.type ? -1 : 1;
    });
  }

  private createLightFromSmartSwitch(swi: SmartThingsSwitch): Device {
    return {
      key: {id: swi.id, type: DeviceType.Smart} as SmartThingsKey,
      name: swi.name,
      capabilities: [{state: swi.on, type: DeviceCapabilityType.On_Off}],
    };
  }

  private createHueState(capabilities: DeviceCapability[]): HueState {
    let state = {} as HueState;
    for (let capability of capabilities) {
      switch (capability.type) {
        case DeviceCapabilityType.On_Off:
          state.on = capability.state;
          break;
        case DeviceCapabilityType.Brightness:
          state.bri = capability.level;
          break;
        case DeviceCapabilityType.Hue:
          state.hue = capability.level;
          break;
        case DeviceCapabilityType.Saturation:
          state.sat = capability.level;
          break;
        case DeviceCapabilityType.ColorLoop:
          state.effect = capability.state ? COLOR_LOOP : NONE;
          break;
      }
    }
    return state;
  }

  private getSmartThingsSwitchState(capabilities: DeviceCapability[]) {
    let onOff = capabilities.find(i => i.type === DeviceCapabilityType.On_Off);

    if (onOff)
      return onOff.state;
  }
}
