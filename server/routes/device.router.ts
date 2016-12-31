import {Router, Request, Response, NextFunction} from 'express';
import {DeviceController} from "../devices/device.controller";
import {DeviceConfiguration} from "../devices/device-configuration.interface";

export class DeviceRouter {

  public static init(devices: DeviceController): Router {
    const deviceRouter: Router = Router();

    /**
     * GET a list of all lights
     */
    deviceRouter.get('/', (req: Request, res: Response, next: NextFunction) => {
      devices.getAllDevices()
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
      devices.setCapability(req.body as DeviceConfiguration)
        .then(lights => res.json(lights))
        .catch(error => {
          res.statusCode = 400;
          res.json(error);
        });
    });

    /**
     * GET a list of all lights
     */
    deviceRouter.get('/away/:away', (req: Request, res: Response, next: NextFunction) => {
      res.json(devices.setAway(req.params.away === "true"));
    });

    return deviceRouter;
  }
}
