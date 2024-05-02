import { ChangeDetectorRef } from '@angular/core';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Session } from './session.model';
import { TeamService } from '../team.service';
import { DatePipe } from '@angular/common';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import * as moment from 'moment';
import { registerables } from 'chart.js';

import {
  Chart,
  ChartOptions,
  ChartData,
  LinearScale,
  CategoryScale,
} from 'chart.js';

@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.scss'],
})
export class SessionComponent implements OnInit {
  @ViewChild('sessionsChart', { static: false }) sessionsChartRef:
    | ElementRef<HTMLCanvasElement>
    | undefined;

  sessions: Session[] = [];
  chart: Chart | undefined;
  sessionsPerWeek: {
    startDate: string;
    endDate: string;
    sessionsCount: number;
  }[] = [];

  sessionForm: FormGroup = this.formBuilder.group({
    _id: [null],
    date: ['', Validators.required],
    time: ['', Validators.required],
    location: ['', Validators.required],
    topics: ['', Validators.required],
  });

  showEditModal: boolean = false;
  showAddModal: boolean = false;
  showSuccessAlert: boolean = false;
  events: EventInput[] = [];
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    events: [],
    eventClick: this.handleEventClick.bind(this),
    eventBackgroundColor: '#FF5733',
    editable: true,
  };

  constructor(
    private datePipe: DatePipe,
    private formBuilder: FormBuilder,
    private teamService: TeamService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.sessionForm = this.formBuilder.group({
      _id: [null],
      date: ['', Validators.required],
      time: ['', Validators.required],
      location: ['', Validators.required],
      topics: ['', Validators.required],
    });

    this.fetchSessions();
  }

  ngAfterViewInit() {
    this.renderChart();
  }

  // fetchSessionsAndStatistics(): void {
  //   this.teamService.getAllSessions().subscribe(
  //     (response: any) => {
  //       console.log('Response:', response);
  //       this.sessions = response.sessions;
  //       this.events = this.sessions.map((session) =>
  //         this.formatSessionForCalendar(session)
  //       );
  //       this.calendarOptions.events = this.events;
  //       this.sessionsPerWeek = response.sessionsPerWeek;
  //       this.renderChart(); // Render the chart after fetching the data
  //     },
  //     (error: any) => {
  //       console.error('Error fetching sessions and statistics:', error);
  //     }
  //   );
  // }

  // fetchSessionsAndStatistics(): void {
  //   this.teamService.getAllSessions().subscribe(
  //     (response: any) => {
  //       console.log('Sessions Per Week:', response.sessionsPerWeek);

  //       // Convert object to array of objects
  //       this.sessionsPerWeek = Object.entries(response.sessionsPerWeek).map(
  //         ([week, sessionsCount]) => {
  //           return {
  //             startDate: week.split(' to ')[0],
  //             endDate: week.split(' to ')[1],
  //             sessionsCount: sessionsCount as number,
  //           };
  //         }
  //       );

  //       this.sessions = response.sessions;
  //       this.events = this.sessions.map((session) =>
  //         this.formatSessionForCalendar(session)
  //       );
  //       this.calendarOptions.events = this.events;

  //       this.renderChart(); // Render the chart after fetching the data
  //     },
  //     (error: any) => {
  //       console.error('Error fetching sessions and statistics:', error);
  //     }
  //   );
  // }

  // fetchSessionsAndStatistics(): void {
  //   this.teamService.getAllSessions().subscribe(
  //     (response: any) => {
  //       console.log('Sessions Per Week:', response.sessionsPerWeek);

  //       // Convert object to array of objects
  //       this.sessionsPerWeek = Object.entries(response.sessionsPerWeek).map(
  //         ([week, sessionsCount]) => {
  //           return {
  //             startDate: week.split(' to ')[0],
  //             endDate: week.split(' to ')[1],
  //             sessionsCount: sessionsCount as number,
  //           };
  //         }
  //       );

  //       // Sort the sessionsPerWeek array by start date
  //       this.sessionsPerWeek.sort(
  //         (a, b) =>
  //           new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  //       );

  //       this.sessions = response.sessions;
  //       this.events = this.sessions.map((session) =>
  //         this.formatSessionForCalendar(session)
  //       );
  //       this.calendarOptions.events = this.events;

  //       this.renderChart(); // Render the chart after fetching the data
  //     },
  //     (error: any) => {
  //       console.error('Error fetching sessions and statistics:', error);
  //     }
  //   );
  // }

  fetchSessions(): void {
    this.teamService.getAllSessions().subscribe(
      (response: any) => {
        if (response && Array.isArray(response.sessions)) {
          const sessions = response.sessions;
          console.log('Sessions:', sessions);

          this.sessions = sessions;
          this.events = sessions.map((session: any) =>
            this.formatSessionForCalendar(session)
          );
          this.calendarOptions.events = this.events;
        } else {
          console.error('Invalid sessions data:', response);
        }
      },
      (error: any) => {
        console.error('Error fetching sessions:', error);
      }
    );
  }

  calculateEndDate(startDate: string): string {
    const endDate = moment(startDate).add(1, 'week').format('YYYY-MM-DD');
    return endDate;
  }

  handleEventClick(clickInfo: any) {
    const event = clickInfo.event;
    console.log('Clicked Event:', event);
    console.log('Event Object:', event);

    const session: Session = {
      _id: event.id,
      date: event.start,
      time: event.extendedProps.time,
      location: event.extendedProps.location,
      topics: event.extendedProps.topics.split(','),
    };
    // Do something with the clicked session
  }

  closeEditModal() {
    this.showEditModal = false;
  }

  openAddModal() {
    this.sessionForm.reset();
    this.showAddModal = true;
  }

  closeAddModal() {
    this.showAddModal = false;
  }

  closeModal() {
    this.showEditModal = false;
    this.showAddModal = false;
  }

  formatSessionForCalendar(session: Session): EventInput {
    return {
      title: 'Training',
      id: session._id,
      date: session.date,
      time: session.time,
      location: session.location,
    };
  }

  renderChart(): void {
    Chart.register(...registerables);

    const ctx = this.sessionsChartRef?.nativeElement.getContext('2d');

    if (!ctx) {
      console.error('Canvas context is not available.');
      return;
    }

    const weeks = this.sessionsPerWeek.map(
      (week) => `${week.startDate} to ${week.endDate}`
    );
    const sessionsCounts = this.sessionsPerWeek.map(
      (week) => week.sessionsCount
    );

    const chartData: ChartData = {
      labels: weeks,
      datasets: [
        {
          label: 'Number of Sessions',
          data: sessionsCounts,
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        },
      ],
    };

    const chartOptions: ChartOptions = {
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Number of Sessions',
          },
        },
        x: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Week',
          },
        },
      },
    };

    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: chartData,
      options: chartOptions,
    });
  }
}
