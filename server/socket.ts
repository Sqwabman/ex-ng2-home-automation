import {LightController} from "./lights/light.controller";
import Socket = SocketIO.Socket;
let app = require('express')();
let http = require('http').Server(app);
let io = require('socket.io')(http);

let light = LightController.instance;

io.on('connection', (socket: Socket) => {
  light.setLightSocket(socket);
});

export = io;
