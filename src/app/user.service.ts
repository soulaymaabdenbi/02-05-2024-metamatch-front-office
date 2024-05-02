import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../environments/environment";
import {Observable} from "rxjs";
import {User} from "./models/user.module";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {
  }

  getUserById(): Observable<User> {
    let currentUser = JSON.parse(<string>localStorage.getItem('currentUser'));
    let url = `${environment.apiUrl}/api/users`;

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${currentUser.token}`  // Change 'token' to 'Authorization'
      })
    };
    return this.http.get<User>(url, httpOptions);
  }

  updateUser(userData: any) {
    let currentUser = JSON.parse(<string>localStorage.getItem('currentUser'));

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${currentUser.token}`
      })
    };
    let url = `${environment.apiUrl}/api/users`;
    return this.http.put<User>(url, userData, httpOptions);
  }}
