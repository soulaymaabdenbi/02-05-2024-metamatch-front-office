import { Component, OnInit } from '@angular/core';
import { TeamService } from '../team.service';
import { Match } from './match.model';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

@Component({
  selector: 'app-match',
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.scss'],
})
export class MatchComponent implements OnInit {
  matches: Match[] = [];
  events: EventInput[] = [];
  calendarOptions!: CalendarOptions; // Using '!' to tell TypeScript it will be initialized

  hoveredEvent: Match | null = null;
  tooltipVisible = false;
  tooltipPosition = { top: 0, left: 0 };

  constructor(private teamService: TeamService) {}

  ngOnInit() {
    this.calendarOptions = {
      plugins: [dayGridPlugin, interactionPlugin],
      initialView: 'dayGridMonth',
      events: this.events,
      eventClick: this.handleEventClick.bind(this),
      eventBackgroundColor: '#FF5733',
      editable: true,
    };
    this.fetchMatches();
  }

  fetchMatches(): void {
    this.teamService.getAllMatches().subscribe(
      (matches: Match[]) => {
        this.matches = matches;
        this.events = matches.map((match) => ({
          id: match._id,
          start: match.date,
          location: match.location,
          teamA: match.teamA,
          teamB: match.teamB,
          title: `${match.teamA} vs ${match.teamB}`,
        }));
        this.calendarOptions.events = this.events;
      },
      (error: any) => {
        console.error('Error fetching matches:', error);
      }
    );
  }

  handleEventClick(clickInfo: any) {
    const event = clickInfo.event;
    console.log('Clicked Event:', event);
  }

  formatMatchForCalendar(match: Match): EventInput {
    return {
      title: `${match.teamA} vs ${match.teamB}`,
      start: match.date,
    };
  }
}
