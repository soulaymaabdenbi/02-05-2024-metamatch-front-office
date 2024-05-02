// Angular: WebSocketService
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private ws?: WebSocket;
  private messages: Subject<any> = new Subject();

  constructor() {
    this.connect();
  }

  private connect(): void {
    this.ws = new WebSocket('ws://localhost:3000'); // Adjust URL to match your server

    this.ws.onmessage = (event) => {
      if (event.data instanceof Blob) {
        // Handle Blob data
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const message = JSON.parse(reader.result as string);
            this.messages.next(message);
          } catch (error) {
            console.error('Failed to parse JSON data from Blob:', reader.result, error);
          }
        };
        reader.onerror = (error) => {
          console.error('FileReader error:', error);
        };
        reader.readAsText(event.data);
      } else {
        // Handle normal JSON string
        try {
          const message = JSON.parse(event.data);
          this.messages.next(message);
        } catch (error) {
          console.error('Failed to parse JSON data:', event.data, error);
        }
      }
    };

    this.ws.onclose = () => {
      console.log('WebSocket disconnected. Reconnecting...');
      this.connect();
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  sendMessage(message: any): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      console.log('Sending message:', message);
      this.ws.send(JSON.stringify(message));
    } else {
      console.error('WebSocket is not connected.');
    }
  }

  getMessages(): Observable<any> {
    return this.messages.asObservable();
  }
}
