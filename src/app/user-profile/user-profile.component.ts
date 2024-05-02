
import {ChangeDetectorRef, Component, EventEmitter, OnInit, Output, ViewEncapsulation} from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";

import { UserService } from "../user.service";
import { User } from "../models/user.module";
import { ToastrService } from "ngx-toastr";
import * as filestack from 'filestack-js';
import {ProfileImageService} from "../profile-image.service";

@Component({
  selector: 'app-models-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class UserProfileComponent implements OnInit {
  @Output() profileImageUpdated = new EventEmitter<string>();
  currentUser: User | null = null;
  userProfileForm!: FormGroup;
  isDisabled: boolean = false;

  alertMessage: string | null = null;
  alertType: string = 'success';

  constructor(private userService: UserService, private fb: FormBuilder,
              private toastr: ToastrService, private profileImageService: ProfileImageService,private changeDetector: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.initializeForm();
    this.loadUserProfile();
    // Subscribe to profile image updates
    this.profileImageService.profileImageUrl$.subscribe(url => {
      this.userProfileForm.patchValue({ profile: url });
    });

  }

  private initializeForm(): void {
    this.userProfileForm = this.fb.group({
      fullname: [''],
      username: [''],
      address: [''],
      email: [''],
      phone: [''],
      role: [''],
      profile: [''],
      verification: [''],
      status: [''],
      height: [''],
      weight: [''],
      age: [''],
      nationality: [''],
    });
  }

  uploadImage(event: any): void {
    if (event.target.files && event.target.files[0]) {
      const client = filestack.init("A8rOsHUaWSxiCFTosYpuUz");
      this.isDisabled = true;
      client.upload(event.target.files[0])
        .then((response) => {
          const fileUrl = response.url;

          // Update the form control value for 'profile'
          this.userProfileForm.patchValue({ profile: fileUrl });

          // Update the service with the new image URL
          this.profileImageService.updateProfileImageUrl(fileUrl);

          this.isDisabled = false;

          // Now, explicitly trigger change detection
          this.changeDetector.detectChanges();
        })
        .catch((error) => {
          console.error("Error:", error);
          this.toastr.error("Failed to upload image.");
          this.isDisabled = false;
        });
    }
  }
  private loadUserProfile(): void {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      const userObj = JSON.parse(currentUser);
      if (userObj.token) {
        this.userService.getUserById().subscribe(
          (data: any) => {
            this.currentUser = data.user;
            this.updateFormWithUserData(data);
            console.log(data);
          },
          (error) => {
            console.error('Error fetching user profile:', error);
          }
        );
      }
    }
  }

  private updateFormWithUserData(data: any): void {
    if (data && data.user) {
      const user = data.user;
      this.userProfileForm.patchValue({
        fullname: user.fullname,
        username: user.username,
        email: user.email,
        phone: user.phone,
        role: user.role,
        address: user.address,
        profile: user.profile,
        status: !!user.status,
        height: user.height,
        weight: user.weight,
        age: user.age,
        nationality: user.nationality,
        verification: !!user.verification
      });
    }
  }

  onSubmit() {
    this.alertMessage = null;
    if (this.userProfileForm.valid) {
      const updateData = this.userProfileForm.value;
      const userId = this.currentUser?._id;
      this.userService.updateUser(updateData).subscribe({
        next: (response: any) => {
          this.alertMessage = response.message;
          this.alertType = 'success';
          this.currentUser = {...this.currentUser, ...updateData};
        },
        error: (error) => {
          this.alertMessage = error.error.message || 'Update failed. Please try again later.';
          this.alertType = 'danger';
        }
      });
    } else {
      this.alertMessage = 'Please fill in the form correctly.';
      this.alertType = 'danger';
    }
  }
}
