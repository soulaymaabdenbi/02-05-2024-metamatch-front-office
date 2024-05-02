import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ToastrService } from "ngx-toastr";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "../auth.service";
import { Router } from "@angular/router";
import { first } from 'rxjs/operators';
declare var google: any;
import { NgZone } from '@angular/core';
import { ProfileImageService } from '../profile-image.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private profileImageService: ProfileImageService,
    private toastr: ToastrService,
    private router: Router,
    private ngZone: NgZone
  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      google.accounts.id.initialize({
        client_id: '7217142055-a5v88qjgt7fl8ejabirqtvduk3o6pmhb.apps.googleusercontent.com',
        callback: (response: any) => this.handleLogin(response),
      });

      google.accounts.id.renderButton(
        document.getElementById('google_btn'), {
          theme: 'outline',
          size: 'large'
        }
      );

      google.accounts.id.prompt(); // Display the One Tap dialog
    }, 0);
  }

  handleLogin(response: any) {
    this.authService.verifyGoogleToken(response.credential)
      .pipe(first())
      .subscribe(
        data => {
          console.log(data);
          const profileImageUrl = data.user && data.user.profile ? data.user.profile : 'assets/img/default-avatar.png';
          this.profileImageService.updateProfileImageUrl(profileImageUrl);

          localStorage.setItem('currentUser', JSON.stringify(data));
          this.ngZone.run(() => {
            this.router.navigate(['/home']).then(success => {
              if (!success) {
                console.error('Navigation to /home failed!');
              }
            });
          });
        },
        error => {
          this.errorMessage = error.error.message || 'An unexpected error occurred.';
        }
      );
  }

  onLogin(): void {
    this.errorMessage = null;
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.login(email, password).subscribe({
        next: (response) => {
          localStorage.setItem('currentUser', JSON.stringify(response));
          const profileImageUrl = response.profile ? response.profile : 'assets/img/default-avatar.png';
          this.profileImageService.updateProfileImageUrl(profileImageUrl);
          // Run navigation inside the Angular zone
          this.ngZone.run(() => {
            this.router.navigate(['/home']).then(success => {
              if (!success) {
                console.error('Navigation to /home failed!');
              }
            });
          });
        },
        error: (error) => {
          this.errorMessage = error.error.message || 'Login failed. Please try again.';
        }
      });
    } else {
      this.errorMessage = 'Please fill in all fields correctly.';
    }
  }
  private updateProfileImage(user: any): void {
    // Assume the profile URL is stored in the user object under `profileImage`
    // Replace 'profileImage' with the actual property name if it's different
    const profileImageUrl = user && user.profile ? user.profile : 'assets/img/default-avatar.png';
    this.profileImageService.updateProfileImageUrl(profileImageUrl);
  }
}
