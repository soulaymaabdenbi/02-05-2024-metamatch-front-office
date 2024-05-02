import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FullCalendarModule } from '@fullcalendar/angular';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { AboutComponent } from './about/about.component';
import { BlogComponent } from './blog/blog.component';
import { BlogDetailComponent } from './blog-detail/blog-detail.component';
import { TeamComponent } from './team/team.component';
import { ContactComponent } from './contact/contact.component';
import { LoginComponent } from './login/login.component';
import { ToastrModule } from 'ngx-toastr';

import { CommonModule, DatePipe } from '@angular/common';

import { ForumComponent } from './team-management/forum/forum.component';
import {
  GoogleLoginProvider,
  SocialAuthServiceConfig,
} from 'angularx-social-login';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { ChatbotSidebarComponent } from './chat/chatbot-sidebar/chatbot-sidebar.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MeetingsComponent } from './meeting/meeting.component';
import { HomeInjuryComponent } from './Injury/home-injury/home-injury.component';
import { ViewsInjuryComponent } from './Injury/views-injury/views-injury.component';
import { ArchivedInjuryComponent } from './Injury/archived-injury/archived-injury.component';
import {ChatComponent} from "./chat/chat.component";
import {PickerModule} from "@ctrl/ngx-emoji-mart";
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    FooterComponent,
    AboutComponent,
    BlogComponent,
    BlogDetailComponent,
    TeamComponent,
    ContactComponent,

    LoginComponent,
    UserProfileComponent,
    ChatbotSidebarComponent,
    MeetingsComponent,

    HomeInjuryComponent,
    ViewsInjuryComponent,
    ArchivedInjuryComponent,
    ChatComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ToastrModule.forRoot({
      positionClass: 'toast-top-right',
      timeOut: 300000, // 3 seconds
      closeButton: true,
      progressBar: true,
    }),
    FullCalendarModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    DragDropModule,
    PickerModule,
  ],
  providers: [
    DatePipe,
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '638133119528-bjmjpq4omvs2ld2kg2vj444s1f3iuepl.apps.googleusercontent.com',
              {
                discoveryDocs: [
                  'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest',
                ],
                scope:
                  'https://www.googleapis.com/auth/drive.metadata.readonly',
              }
            ),
          },
        ],
      } as SocialAuthServiceConfig,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
