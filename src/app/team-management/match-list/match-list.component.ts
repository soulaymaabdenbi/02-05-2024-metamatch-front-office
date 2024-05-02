import { Component, OnInit } from '@angular/core';
import { TeamService } from '../team.service';

@Component({
  selector: 'app-match-list',
  templateUrl: './match-list.component.html',
  styleUrls: ['./match-list.component.scss'],
})
export class MatchListComponent implements OnInit {
  scrapedMatches: any[] = [];

  constructor(private teamService: TeamService) {}

  ngOnInit(): void {
    this.scrapeMatches();
  }

  scrapeMatches(): void {
    this.teamService.scrapeMatches().subscribe(
      (matches) => {
        this.scrapedMatches = matches;
      },
      (error) => {
        console.error('Error scraping matches:', error);
      }
    );
  }

  isMatchOver(dateAndTime: string, matchResult: string): boolean {
    if (!dateAndTime) {
      console.log('No date provided.');
      return false;
    }

    const matchDate = new Date(dateAndTime.replace(/[\n\r]/g, ' '));

    const currentDate = new Date();

    const isOver = matchDate < currentDate;

    const isTime = this.isValidTime(matchResult);

    return isOver && !isTime;
  }

  isValidTime(time: string): boolean {
    const timeRegex = /^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/i;

    return timeRegex.test(time);
  }
}
