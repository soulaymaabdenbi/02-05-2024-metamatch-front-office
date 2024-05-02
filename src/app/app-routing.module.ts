import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { BlogComponent } from './blog/blog.component';
import { BlogDetailComponent } from './blog-detail/blog-detail.component';
import { TeamComponent } from './team/team.component';
import { ContactComponent } from './contact/contact.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth.guard';
import { TeamManagementRoutingModule } from './team-management/team-management-routing.module';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { MeetingsComponent } from './meeting/meeting.component';
import { HomeInjuryComponent } from './Injury/home-injury/home-injury.component';
import { ViewsInjuryComponent } from './Injury/views-injury/views-injury.component';
import { ArchivedInjuryComponent } from './Injury/archived-injury/archived-injury.component';
import {ChatComponent} from "./chat/chat.component";


const routes: Routes = [
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'chats', component: ChatComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'about', component: AboutComponent, canActivate: [AuthGuard] },
  { path: 'blog', component: BlogComponent, canActivate: [AuthGuard] },
  {
    path: 'blog-detail',
    component: BlogDetailComponent,
    canActivate: [AuthGuard],
  },
  { path: 'team', component: TeamComponent, canActivate: [AuthGuard] },
  {
    path: 'user-profile',
    component: UserProfileComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'meetingsList',
    component: MeetingsComponent,
    canActivate: [AuthGuard],
  },

  { path: 'injury', component: HomeInjuryComponent, canActivate: [AuthGuard] },
  {
    path: 'view-injuries/:playerId',
    component: ViewsInjuryComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'archived-injuries/:playerId',
    component: ArchivedInjuryComponent,
    canActivate: [AuthGuard],
  },

  {
    path: 'teams',
    loadChildren: () =>
      import('./team-management/team-management.module').then(
        (m) => m.TeamManagementModule
      ),
  },

  { path: 'contact', component: ContactComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', component: HomeComponent, canActivate: [AuthGuard] },

  { path: 'contact', component: ContactComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes), TeamManagementRoutingModule],
  exports: [RouterModule],
})
export class AppRoutingModule {}
