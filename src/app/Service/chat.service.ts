import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Chat } from '../Model/chat';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private apiUrl = 'http://localhost:5000/ask'; // URL de votre API Flask

  constructor(private http: HttpClient) {}

  // Méthode pour envoyer une question à l'API Flask et obtenir une réponse
  askQuestion(question: string): Observable<Chat> {
    return this.http
      .post<Chat>(this.apiUrl, { question })
      .pipe(catchError(this.handleError));
  }

  // Gestion des erreurs HTTP
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      console.error('An error occurred:', error.error.message);
    } else {
      // Erreur côté serveur
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
    // Renvoyer une observable avec un message d'erreur convivial
    return throwError('Something bad happened; please try again later.');
  }
}
