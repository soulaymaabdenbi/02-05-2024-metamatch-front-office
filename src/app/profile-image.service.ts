import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileImageService {
private defaultImage = 'assets/img/default-avatar.png';
  private profileImageUrlSubject: BehaviorSubject<string | null>;

  constructor() {
    const savedImageUrl = localStorage.getItem('profileImageUrl')|| this.defaultImage;
    // Initialize the BehaviorSubject with the saved URL or null
    this.profileImageUrlSubject = new BehaviorSubject<string | null>(savedImageUrl);
  }

  get profileImageUrl$(): Observable<string | null> {
    return this.profileImageUrlSubject.asObservable();
  }

  updateProfileImageUrl(imageUrl: string): void {

    const finalImageUrl = imageUrl || this.defaultImage;
    this.profileImageUrlSubject.next(finalImageUrl);
    localStorage.setItem('profileImageUrl', finalImageUrl);
  }






}
