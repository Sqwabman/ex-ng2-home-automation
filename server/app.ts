import * as express from 'express';
import {json, urlencoded} from 'body-parser';
import * as path from 'path';
import * as compression from 'compression';
import {PhilipsHueRouter} from "./routes/philips-hue.router";
import {PhilipsHueController} from "./philips-hue/philips-hue.controller";
import {SmartThingsController} from "./smart-things/smart-things.controller";
import {SmartThingsRouter} from "./routes/smart-things.router";
import {DeviceRouter} from "./routes/device.router";
import {DeviceController} from "./devices/device.controller";

const app: express.Application = express();

app.disable('x-powered-by');

app.use(json());
app.use(compression());
app.use(urlencoded({extended: true}));

let hue = PhilipsHueController.instance;
let smart = SmartThingsController.instance;
let light = DeviceController.instance;

// api routes
app.use('/api/smart', SmartThingsRouter.init(smart));
app.use('/api/hue', PhilipsHueRouter.init(hue));
app.use('/api/lights', DeviceRouter.init(light));

app.use(express.static(path.join(__dirname, '/../client')));

// catch 404 and forward to error handler
app.use(function (req: express.Request, res: express.Response, next) {
  let err = new Error('Not Found');
  next(err);
});

// production error handler
// no stacktrace leaked to user
app.use(function (err: any, req: express.Request, res: express.Response, next: express.NextFunction) {

  res.status(err.status || 500);
  res.json({
    error: {},
    message: err.message
  });
});

export {app}
