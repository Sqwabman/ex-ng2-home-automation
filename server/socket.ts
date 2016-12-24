import Socket = SocketIO.Socket;
import {DeviceController} from "./devices/device.controller";
let app = require('express')();
let http = require('http').Server(app);
let io = require('socket.io')(http);

let light = DeviceController.instance;

io.on('connection', (socket: Socket) => {
  light.setLightSocket(socket);
});

export = io;
