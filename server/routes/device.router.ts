import {Router, Request, Response, NextFunction} from 'express';
import {DeviceController} from "../devices/device.controller";
import {DeviceConfiguration} from "../devices/device-configuration.interface";

export class DeviceRouter {

  public static init(lights: DeviceController): Router {
    const deviceRouter: Router = Router();

    /**
     * GET a list of all lights
     */
    deviceRouter.get('/', (req: Request, res: Response, next: NextFunction) => {
      lights.getAllLights()
        .then(lights => res.json(lights))
        .catch(error => {
          res.statusCode = 400;
          res.json(error);
        });
    });

    /**
     * GET a list of all lights
     */
    deviceRouter.put('/', (req: Request, res: Response, next: NextFunction) => {
      lights.setCapability(req.body as DeviceConfiguration)
        .then(lights => res.json(lights))
        .catch(error => {
          res.statusCode = 400;
          res.json(error);
        });
    });

    return deviceRouter;
  }
}
