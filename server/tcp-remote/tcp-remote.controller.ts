import * as fs from 'fs';
import {TcpRemoteInformation} from "./tcp-remote-information.interface";
import {TcpRemote} from "./tcp-remote.interface";
import {TcpRemoteCommand} from "./tscp-remote-command.interface";

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

  private readRemoteFile(file: string): TcpRemoteCommand[] {
    fs.exists(file, (exists) => {
      if (exists) {
        console.log('Reading remote file', this.config);
        return JSON.parse(fs.readFileSync(file, UTF8)) as TcpRemoteCommand[];
      }
    });
    return null;
  }

  public createRemote(ip: string, port: number, name: string, file: string): TcpRemote {
    let commands = this.readRemoteFile(file);

    if (commands) {
      let remote = {
        ip: ip,
        port: port,
        name: name,
        commands: commands,
      };
      this.info.remotes.push(remote);
      return remote;
    }

    return null;
  }

  public getAllRemotes(): TcpRemote[] {
    return this.info.remotes;
  }

}
