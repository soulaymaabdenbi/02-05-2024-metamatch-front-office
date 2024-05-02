import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SessionComponent } from './session/session.component';
import { MatchComponent } from './match/match.component';
import { MatchListComponent } from './match-list/match-list.component';
import { ForumComponent } from './forum/forum.component';

import { BlogArticleComponent } from './blog-article/blog-article.component';
import { ScoreDisplayComponent } from './score-display/score-display.component';

const routes: Routes = [
  {
    path: 'teams',
    children: [
      { path: 'session', component: SessionComponent },
      { path: 'calendar', component: MatchComponent },
      { path: 'matches', component: MatchListComponent },
      { path: 'forum', component: ForumComponent },
      { path: 'blog', component: BlogArticleComponent },
      { path: 'score', component: ScoreDisplayComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TeamManagementRoutingModule {}
