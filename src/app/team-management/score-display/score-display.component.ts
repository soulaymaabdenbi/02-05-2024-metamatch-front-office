import { Component, OnInit } from '@angular/core';
import { WebsocketService } from '../websocket.service';

@Component({
  selector: 'app-score-display',
  templateUrl: './score-display.component.html',
  styleUrls: ['./score-display.component.css'],
})
export class ScoreDisplayComponent implements OnInit {
  teamScores: any = { teamA: 0, teamB: 0 };
  matchFinished: boolean = false;

  teamA: { name: string; score: number } = { name: '', score: 0 };
  teamB: { name: string; score: number } = { name: '', score: 0 };
  matchTerminated: boolean = false;

  constructor(private websocketService: WebsocketService) {}

  ngOnInit(): void {
    this.websocketService.receiveMessage().subscribe((message: any) => {
      if (message.type === 'score_updated') {
        this.teamScores = message.teamScores;
      }
      if (message.type === 'game_finished') {
        this.matchFinished = true;
      }
      if (message.type === 'game_restarted') {
        this.teamScores = { teamA: 0, teamB: 0 };
        this.matchFinished = false;
      }
    });
  }
}
