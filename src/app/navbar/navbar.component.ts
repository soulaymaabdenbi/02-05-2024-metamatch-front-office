import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from '../models/user.module';
import { ProfileImageService } from '../profile-image.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class NavbarComponent implements OnInit {
  currentUser: User | null = null;
  currentUserProfileImage: string | null = null;
  profileImageUrlSubscription: Subscription | undefined;
  currentRoute: string = '';

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private profileImageService: ProfileImageService
  ) {
    this.router.events.subscribe(() => {
      this.currentRoute = this.router.url; // Gets the current route URL
    });
  }

  ngOnInit(): void {
    this.loadCurrentUser();

    this.profileImageUrlSubscription =
      this.profileImageService.profileImageUrl$.subscribe((imageUrl) => {
        this.currentUserProfileImage = imageUrl;
      });
  }

  loadCurrentUser(): void {
    const currentUserJson = localStorage.getItem('currentUser');
    if (currentUserJson) {
      this.currentUser = JSON.parse(currentUserJson);

      const profileImageUrl = this.currentUser?.profile;
      if (profileImageUrl) {
        localStorage.setItem('profileImageUrl', profileImageUrl);
        this.currentUserProfileImage = profileImageUrl;
      }
    }
  }

  logout() {
    console.log('Logout successful');
    localStorage.removeItem('currentUser');

    this.router.navigate(['/login']);
  }
}
