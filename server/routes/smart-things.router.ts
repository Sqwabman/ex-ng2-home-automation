import {Router, Request, Response, NextFunction} from 'express';
import * as request from 'request';
import * as JSONStream from 'JSONStream';
import {SmartThingsController} from "../smart-things/smart-things.controller";

const CALLBACK_URL = encodeURIComponent('http://localhost:4200/smart/summary');
const CLIENT_SECRET = '22c47bf2-6f86-4e61-8484-846289e437ad';
const CLIENT_ID = encodeURIComponent('35c643e1-5df3-4df8-8541-0e7261fa5154');

const TOKEN_URL = 'https://graph.api.smartthings.com/oauth/token';

const ENDPOINT_URL = 'https://graph.api.smartthings.com/api/smartapps/endpoints';

const smartThingsRouter: Router = Router();

let smartthings = new SmartThingsController();

/**
 * GET get token
 */
smartThingsRouter.get('/authenticated', (req: Request, res: Response, next: NextFunction) => {
  res.json(smartthings.isAuthenticated());
});

/**
 * GET get token
 */
smartThingsRouter.get('/token/:code', (req: Request, res: Response, next: NextFunction) => {
  let code = req.params.code;

  request.post(`${TOKEN_URL}?grant_type=authorization_code&code=${code}&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&redirect_uri=${CALLBACK_URL}`)
    .pipe(res);
});

/**
 * GET endpoints
 */
smartThingsRouter.get('/endpoints/:bearer', (req: Request, res: Response, next: NextFunction) => {
  request.get(`${ENDPOINT_URL}?grant_type=authorization_code&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&redirect_uri=${CALLBACK_URL}`, {auth: {bearer: req.params.bearer}})//.pipe(res)
    .pipe(res);
  // .pipe(JSONStream.parse('*'))
  // .on('data', (data) => {
  //     console.log(data);
  // });
});

/**
 * GET list of switches
 */
smartThingsRouter.get('/switches/:bearer/:endpoint', (req: Request, res: Response, next: NextFunction) => {
  request.get(`${ENDPOINT_URL}?grant_type=authorization_code&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&redirect_uri=${CALLBACK_URL}`, {auth: {bearer: req.params.bearer}})
    .pipe(JSONStream.parse('*'));
});

/**
 * PUT toggle the state of the switch
 */
smartThingsRouter.get('/switches/toggle/:bearer/:endpoint', (req: Request, res: Response, next: NextFunction) => {
  request.get(`${req.params.endpoint}/switches`,
    {auth: {bearer: req.params.bearer}}).pipe(res);
});

export {smartThingsRouter};
