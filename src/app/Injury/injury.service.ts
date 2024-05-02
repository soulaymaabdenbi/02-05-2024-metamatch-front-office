import { HttpClient, HttpHeaders,HttpErrorResponse  } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable ,throwError  } from 'rxjs';
import { Injury } from './injury'
import { User } from '../models/user.module';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable({
  providedIn: 'root'
})
export class InjuryService {


  apiUrl = "http://localhost:3000/injury";
  joueurApiUrl = "http://localhost:3000/injury/players";
  joueurApiUrlId = "http://localhost:3000/injury/playerId";
  constructor(private http: HttpClient) { }

  getInjuries() {
    return this.http.get<Injury[]>(this.apiUrl + "/getAllInjury");
}


getJoueurs() {
  return this.http.get<User[]>(this.joueurApiUrl);
}

findInjuryById(id: string): Observable<Injury> {
  const url = `${this.apiUrl + "/getInjurybyid"}/${id}`;
  return this.http.get<Injury>(url, httpOptions)
}

getPlayerInjuries(playerId: string): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/joueur/${playerId}/injuries`);
}

/*getJoueurByName(name: string): Observable<any> {
  return this.http.get<any>(`${this.joueurApiUrlName}/${name}`);
}*/
getByIdJoueur(playerId: string): Observable<any> {
  return this.http.get<any>(`${this.joueurApiUrlId}/${playerId}`);
}
archiveInjury(injuryId: string): Observable<void> {
  return this.http.put<void>(`${this.apiUrl}/archive/${injuryId}`, {});
}

getPlayerArchiveInjuries(playerId: string): Observable<Injury[]> {
  return this.http.get<Injury[]>(`${this.apiUrl}/joueur/${playerId}/archive/injuries`);
}

getScrapedInjury(): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/scrape`);
}
}
