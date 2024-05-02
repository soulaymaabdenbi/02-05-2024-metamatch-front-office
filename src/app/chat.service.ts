// ChatService code with updated API paths and method implementations
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment'; // Verify this path

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private http: HttpClient) { }

  private getHttpOptions(isFile: boolean = false) {
    let currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (isFile) {
      return {
        headers: new HttpHeaders({
          'Authorization': `Bearer ${currentUser.token}`
        })
      };
    }
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${currentUser.token}`
      })
    };
  }

  getChatUsers(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/api/chat-users`, this.getHttpOptions());
  }

  getChatHistory(userId: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}/api/chat-chats/${userId}`, this.getHttpOptions());
  }

  sendChatMessage(recipientId: string, message: ChatMessage): Observable<any> {
    const body = {
      userId: recipientId,
      chat: {
        message: message.text,
        imageUrl: message.imageUrl,
        time: message.timestamp,
        senderId: message.senderId
      }
    };
    return this.http.post(`${environment.apiUrl}/api/chat-chats/`, body, this.getHttpOptions());
  }

}

interface ChatMessage {
  text: string;
  senderId: string;
  timestamp: Date;
  recipientId?: string;
  imageUrl?: string;
}

