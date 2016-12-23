import {Router, Request, Response, NextFunction} from 'express';
import {LightController} from "../lights/light.controller";
import {LightConfiguration} from "../lights/light-configuration.interface";

export class LightRouter {

  public static init(lights: LightController): Router {
    const lightRouter: Router = Router();

    /**
     * GET a list of all lights
     */
    lightRouter.get('/', (req: Request, res: Response, next: NextFunction) => {
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
    lightRouter.put('/', (req: Request, res: Response, next: NextFunction) => {
      lights.setCapability(req.body as LightConfiguration)
        .then(lights => res.json(lights))
        .catch(error => {
          res.statusCode = 400;
          res.json(error);
        });
    });

    return lightRouter;
  }
}
