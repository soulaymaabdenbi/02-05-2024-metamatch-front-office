import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from "../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<any> {
    return this.http.post('http://localhost:3000/login', { email, password });
  }

  verifyGoogleToken(idToken: string): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/google-signin`, {token: idToken});
  }
}
