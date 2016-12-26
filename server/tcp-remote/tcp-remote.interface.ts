import {TcpRemoteCommand} from "./tscp-remote-command.interface";
export interface TcpRemote
{
  ip: string;
  port: number;
  name: string;
  commands: TcpRemoteCommand;
}
