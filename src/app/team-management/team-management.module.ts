import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FullCalendarModule } from '@fullcalendar/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { TeamManagementRoutingModule } from './team-management-routing.module';
import { SessionComponent } from './session/session.component';
import { MatchComponent } from './match/match.component';
import { EventTooltipComponent } from './event-tooltip/event-tooltip.component';
import { ForumComponent } from './forum/forum.component';
import { BlogArticleComponent } from './blog-article/blog-article.component';
import { MatchListComponent } from './match-list/match-list.component';
import { ScoreDisplayComponent } from './score-display/score-display.component';

@NgModule({
  declarations: [
    SessionComponent,
    MatchComponent,
    EventTooltipComponent,
    ForumComponent,
    BlogArticleComponent,
    MatchListComponent,
    ScoreDisplayComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    FullCalendarModule,
    NgbModule,
    TeamManagementRoutingModule,
  ],
})
export class TeamManagementModule {}
