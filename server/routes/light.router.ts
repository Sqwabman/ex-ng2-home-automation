import {Router, Request, Response, NextFunction} from 'express';
import {LightController} from "../lights/light.controller";

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

    return lightRouter;
  }
}
