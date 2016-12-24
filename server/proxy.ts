import {PhilipsHueController} from "./philips-hue/philips-hue.controller";
let http = require('http');
let httpProxy = require('http-proxy');

let hue = PhilipsHueController.instance;

//
// Create your proxy server and set the target in the options.
//
const proxy = httpProxy.createProxyServer();

http.createServer((req, res) => {
  proxy.web(req,res, {target: 'http://192.168.1.50/'})
});

//
// Listen for the `error` event on `proxy`.
proxy.on('error', function (err, req, res) {
  res.writeHead(500, {
    'Content-Type': 'text/plain'
  });

  res.end('Something went wrong. And we are reporting a custom error message.');
});

//
// Listen for the `proxyRes` event on `proxy`.
//
proxy.on('proxyRes', (proxyRes, req, res) => {
  let xml = proxyRes.headers['content-type'] ==='text/xml';
  let json = proxyRes.headers['content-type'] === 'application/json';

  if(json) {
    let buffer = '';
    proxyRes.on('data', (data) => {
      buffer += data;
    })
      .on('end', () => {
        console.log(buffer);
        //hue.readLights(JSON.parse(buffer));
      });
  }
});

export = proxy;
