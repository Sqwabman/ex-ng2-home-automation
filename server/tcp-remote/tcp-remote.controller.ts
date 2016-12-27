import * as fs from 'fs';
import {TcpRemoteInformation} from "./tcp-remote-information.interface";
import {TcpRemote} from "./tcp-remote.interface";

const DEFAULT_CONFIG = 'tcp-remote.json';
const UTF8 = 'utf8';

export class TcpRemoteController {
  public static instance: TcpRemoteController = new TcpRemoteController();
  config: string;
  info: TcpRemoteInformation;

  private constructor() {
    this.config = DEFAULT_CONFIG;
    fs.exists(this.config, (exists) => {
      if (exists) {
        console.log('Reading tcp remote config', this.config);
        this.info = JSON.parse(fs.readFileSync(this.config, UTF8));
      }
      else {
        this.info = {
          remotes: [],
        };
      }
    });
  }

  public readRemoteFile(file: string):void {
    fs.exists(file, (exists) => {
      if (exists) {
        console.log('Reading remote file', this.config);
        return JSON.parse(fs.readFileSync(file, UTF8)) as TcpRemote;
      }
      throw new Error('Could not find the remote file')
    });
  }

  public getAllRemotes(): TcpRemote[] {
    return this.info.remotes;
  }

}
