// meeting.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Meeting } from '../Model/meeting';


@Injectable({
  providedIn: 'root'
})
export class MeetingService {
  private baseUrl = 'http://localhost:3000/api'; // Adresse de base de votre backend Express.js

  constructor(private http: HttpClient) { }

  getPhysiotherapists(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/physiotherapists`);
  }

  getMeetings(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/meetings`);
  }
  /*scheduleMeeting(meetingData: any): Observable<any> {
    const playerId = localStorage.getItem('playerId'); 
    meetingData.playerId = playerId; 
    return this.http.post<any>(`${this.baseUrl}/schedule-meeting`, meetingData);
  }*/
 scheduleMeeting(meetingData: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/schedule-meeting`, meetingData);
  }
  scheduleMeetingDoctor(meetingData: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/schedule-meetingwithdoctor`, meetingData);
  }
  cancelMeeting(meetingId: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/cancel-meeting/${meetingId}`);
  }
  updateMeeting(meetingId: string, meetingData: Meeting): Observable<Meeting> {
    return this.http.put<Meeting>(`${this.baseUrl}/update-meeting/${meetingId}`, meetingData);
  }
  getMeetingsByPlayerId(playerId: string): Observable<Meeting[]> {
    return this.http.get<Meeting[]>(`${this.baseUrl}/meetings/player/${playerId}`);
  }
  getPlayers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/players`);
  }
  
  getDoctors(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/doctors`);
  }

}
