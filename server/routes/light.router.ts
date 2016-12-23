import {Router, Request, Response, NextFunction} from 'express';
import {PhilipsHueController} from "../philips-hue/philips-hue.controller";

const lightRouter: Router = Router();

let philipsHue = new PhilipsHueController();

/**
 * GET a list of all lights
 */
lightRouter.get('/', (req: Request, res: Response, next: NextFunction) => {

});

export {lightRouter};
