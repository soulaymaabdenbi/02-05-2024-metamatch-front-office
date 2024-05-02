import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Session } from './session/session.model';
import { Match } from './match/match.model';
import { Forum } from './forum/forum.model';

@Injectable({
  providedIn: 'root',
})
export class TeamService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getAllSessions(): Observable<Session[]> {
    return this.http.get<Session[]>(`${this.apiUrl}/sessions`);
  }

  addSession(sessionData: Session): Observable<Session> {
    return this.http.post<Session>(`${this.apiUrl}/sessions`, sessionData);
  }

  updateSession(sessionId: string, sessionData: Session): Observable<Session> {
    return this.http.put<Session>(
      `${this.apiUrl}/sessions/${sessionId}`,
      sessionData
    );
  }

  deleteSession(sessionId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/sessions/${sessionId}`);
  }

  getAllMatches(): Observable<Match[]> {
    return this.http.get<Match[]>(`${this.apiUrl}/matches`);
  }

  addMatch(matchData: Match): Observable<Match> {
    return this.http.post<Match>(`${this.apiUrl}/matches`, matchData);
  }

  updateMatch(matchId: string, matchData: Match): Observable<Match> {
    return this.http.put<Match>(`${this.apiUrl}/matches/${matchId}`, matchData);
  }

  deleteMatch(matchId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/matches/${matchId}`);
  }

  uploadCsv(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/matches/upload-csv`, formData);
  }
  scrapeMatches(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/matches/matches`);
  }

  getTrainingSessionsStatistics(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/matches/training`);
  }

  getTopScorers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/matches/top-scorers`);
  }

  getScrapedArticles(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/blog/scrape`);
  }

  getAllForums(): Observable<Session[]> {
    return this.http.get<Session[]>(`${this.apiUrl}/forum`);
  }

  addForum(forumData: Forum): Observable<Forum> {
    return this.http.post<Forum>(`${this.apiUrl}/forum`, forumData);
  }

  updateForum(forumId: string, forumData: Forum): Observable<Forum> {
    return this.http.put<Forum>(`${this.apiUrl}/forum/${forumId}`, forumData);
  }

  deleteForum(forumId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/forum/${forumId}`);
  }
}
