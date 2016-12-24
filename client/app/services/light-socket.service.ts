import { Observable } from 'rxjs/Observable';
import * as io from 'socket.io-client';
import {Injectable} from "@angular/core";

@Injectable()
export class LightSocketService {
  private url = 'http://localhost:5000';
  private socket;

  constructor(){
    this.socket = io(this.url);
  }

  sendMessage(message){
    this.socket.emit('add-message', message);
  }

  getMessages() {
    let observable = new Observable(observer => {
      this.socket.on('message', (data) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    })
    return observable;
  }
}
