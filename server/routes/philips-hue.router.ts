import {Router, Request, Response, NextFunction} from 'express';
import {PhilipsHueController} from "../philips-hue/philips-hue.controller";

export class PhilipsHueRouter {

  public static init(philipsHue: PhilipsHueController): Router {
    const philipsHueRouter: Router = Router();

    /**
     * GET if there is a config available
     */
    philipsHueRouter.get('/authenticated', (req: Request, res: Response, next: NextFunction) => {
      if (philipsHue.isAuthenticated()) {
        res.json(philipsHue.isAuthenticated());
      }
      else {
        res.statusCode = 400;
        philipsHue.getHueIPs()
          .then(ips => {
            res.json(ips);
          });
      }
    });

    /**
     * GET connect to hue bridge
     */
    philipsHueRouter.get('/connect/:ip', (req: Request, res: Response, next: NextFunction) => {
      philipsHue.authenticate(req.params.ip)
        .then(lights => res.json(lights))
        .catch(error => {
          res.statusCode = 400;
          res.json(error);
        });
    });

    /**
     * GET list of lights
     */
    philipsHueRouter.get('/lights', (req: Request, res: Response, next: NextFunction) => {
      philipsHue.getAllLights()
        .then(lights => res.json(lights))
        .catch(error => {
          res.statusCode = 400;
          res.json(error);
        });
    });

    /**
     * GET light status
     */
    philipsHueRouter.get('/lights/:ip/:username/:id', (req: Request, res: Response, next: NextFunction) => {
      philipsHue.getLight({ip: req.params.ip, username: req.params.username}, req.params.id)
        .then(lights => res.json(lights))
        .catch(error => {
          res.statusCode = 400;
          res.json(error);
        });
    });

    /**
     * GET set light state
     */
    philipsHueRouter.put('/lights/:ip/:username/:lightId', (req: Request, res: Response, next: NextFunction) => {
      philipsHue.setLightState({ip: req.params.ip, username: req.params.username}, req.params.lightId, req.body)
        .then(lights => res.json(lights))
        .catch(error => {
          res.statusCode = 400;
          res.json(error);
        });
    });

    return philipsHueRouter;
  }
}
