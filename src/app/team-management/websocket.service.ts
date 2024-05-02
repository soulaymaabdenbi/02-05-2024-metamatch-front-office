// websocket.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  private socket: WebSocket;

  constructor() {
   
    this.socket = new WebSocket('ws://localhost:3000');

    
    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }
  receiveMessage(): Observable<any> {
    return new Observable<any>((observer) => {
      
      this.socket.onmessage = (event) => {
        
        console.log('Received raw message:', event.data);

        
        const message = JSON.parse(event.data);
        console.log('Parsed message:', message);

        
        observer.next(message);
      };
    });
  }
}
