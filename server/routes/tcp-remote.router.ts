import {Router, Request, Response, NextFunction} from 'express';
import {TcpRemoteController} from "../tcp-remote/tcp-remote.controller";

export class TcpRemoteRouter {

  public static init(tcpRemote: TcpRemoteController): Router {
    const tcpRemoteRouter: Router = Router();

    /**
     * GET if there is a config available
     */
    tcpRemoteRouter.get('/create/:ip/:port/:name/:file', (req: Request, res: Response, next: NextFunction) => {
      let remote = tcpRemote.createRemote(req.params.ip, req.params.port, req.params.name, req.params.file);

      if(remote) {
        res.json(remote);
      }
      else {
        res.statusCode = 400;
        res.json('Command file not found');
      }
    });

    return tcpRemoteRouter;
  }
}
