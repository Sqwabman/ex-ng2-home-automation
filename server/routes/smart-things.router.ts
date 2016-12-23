import {Router, Request, Response, NextFunction} from 'express';
import {SmartThingsController} from "../smart-things/smart-things.controller";

export class SmartThingsRouter {

  public static init(smartthings: SmartThingsController): Router {
    const smartThingsRouter: Router = Router();

    /**
     * GET if there is a config available
     */
    smartThingsRouter.get('/authenticated', (req: Request, res: Response, next: NextFunction) => {
      if (smartthings.isAuthenticated()) {
        res.json(true);
      }
      else {
        res.statusCode = 400;
        res.json(smartthings.getAuthenticationUrl());
      }
    });


    /**
     * GET get token
     */
    smartThingsRouter.get('/token/:code/:callback', (req: Request, res: Response, next: NextFunction) => {
      let code = req.params.code;
      let callback = req.params.callback;

      console.log('code', code);
      console.log('callback', callback);

      smartthings.getAuthentication(code, callback)
        .then(result => {
          res.json(result)
        })
        .catch(error => {
          res.statusCode = 400;
          console.log('error', error);
          res.json(error);
        });
    });

    /**
     * GET list of switches
     */
    smartThingsRouter.get('/switches', (req: Request, res: Response, next: NextFunction) => {
      smartthings.getSwitches()
        .then(switches => res.json(switches))
        .catch(error => {
          res.statusCode = 400;
          console.log('error', error);
          res.json(error);
        });
    });

    /**
     * PUT change the state of a light
     */
    smartThingsRouter.get('/switches/:id/:state', (req: Request, res: Response, next: NextFunction) => {
      smartthings.changeSwitchState(req.params.id, req.params.state)
        .then(() => res.json(true))
        .catch(error => {
          res.statusCode = 400;
          console.log('error', error);
          res.json(error);
        });
    });

    return smartThingsRouter;
  }
}
