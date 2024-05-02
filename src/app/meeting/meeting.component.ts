import { Component, OnInit } from '@angular/core';
import { Meeting } from 'src/app/Model/meeting';
import { MeetingService } from 'src/app/Service/meeting.service';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { ActivatedRoute } from '@angular/router';
import { User } from '../models/user.module';
import { UserService } from '../user.service';

@Component({
  selector: 'app-meetings',
  templateUrl: './meeting.component.html',
  styleUrls: ['./meeting.component.css']
})
export class MeetingsComponent implements OnInit {
  meetingName: string = '';
  meetingDate: string = '';
  selectedPhysiotherapist: string = '';
  physiotherapists: any[] = [];
  selectedDoctor: string = '';
  doctors: any[] = [];
  meetings: any[] = [];
  showDateError: boolean = false;
  calendarEvents: any[] = [];
 

  isPhysiotherapistSelected: boolean = false;
  isDoctorSelected: boolean = false;
  showProfessionalSelectionError: boolean = false;
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin],
  };
  
  currentUser: User | null = null;

  constructor(private backendService: MeetingService,private route: ActivatedRoute,private userService: UserService) { }

  ngOnInit(): void {
    this.showDateError = false;
    this.getPhysiotherapists();
    this.getDoctors();
    this.getMeetings();

    const currentUserJson = localStorage.getItem('currentUser');
    if (currentUserJson) {
      this.currentUser = JSON.parse(currentUserJson);
    }
  
  }

  getPhysiotherapists(): void {
    this.backendService.getPhysiotherapists()
      .subscribe(physiotherapists => this.physiotherapists = physiotherapists);
  }
  

  getDoctors(): void {
    this.backendService.getDoctors()
      .subscribe(doctors => this.doctors = doctors);
  }
  getMeetings(): void {
   
    const currentUserJson = localStorage.getItem('currentUser');
    if (currentUserJson) {
      const currentUserData = JSON.parse(currentUserJson);
      if (currentUserData && currentUserData._id) {
        const playerId = currentUserData._id;
        console.log('ID de l\'utilisateur récupéré depuis localStorage:', playerId);

        if (playerId) {
          this.backendService.getMeetingsByPlayerId(playerId)
            .subscribe(
              meetings => {
                this.meetings = meetings;
                this.calendarEvents = this.mapMeetingsToCalendarEvents(meetings);
              },
              error => {
                console.error('Erreur lors de la récupération des réunions :', error);
              }
            );
        } else {
          console.error("ID du joueur non trouvé.");
        }
      }
    }
}

/*scheduleMeeting(): void {
    const currentDate = new Date();
    const meetingDate = new Date(this.meetingDate);
    if (this.isPhysiotherapistSelected && this.isDoctorSelected) {
      this.showProfessionalSelectionError = true; // Afficher le message d'erreur
      return;
  }
    if (meetingDate <= currentDate) {
        this.showDateError = true; // Afficher le message d'erreur
        return;
    }

    this.showDateError = false; // Réinitialiser la variable si la date est valide

    if (!this.meetingName || !this.meetingDate || !this.selectedPhysiotherapist) {
        return;
    }

    const meetingData = {
        meetingName: this.meetingName,
        meetingDate: this.meetingDate,
        selectedPhysiotherapist: this.selectedPhysiotherapist,
        description: this.meetingName,
    };

    this.backendService.scheduleMeeting(meetingData).subscribe(
        (response) => {
      
            const newMeetingId = response._id;
            const playerId = response.playerId;

            this.getMeetings();
            this.showSuccessMessage('Réunion planifiée avec succès!');

           
            setTimeout(() => {
                if (!this.isMeetingConfirmed(newMeetingId)) {
                    this.cancelMeeting(newMeetingId);
                }
            },60 * 60 * 1000); // 60 minutes en millisecondes
        },
        error => {
            console.error('Erreur lors de la planification de la réunion:', error);
            this.showErrorMessage('Erreur lors de la planification de la réunion. Veuillez réessayer.');
        }
    );
    this.showProfessionalSelectionError = false;
} */scheduleMeeting(): void {
  const currentDate = new Date();
  const meetingDate = new Date(this.meetingDate);

  const currentUserJson = localStorage.getItem('currentUser');
  if (currentUserJson) {
    const currentUserData = JSON.parse(currentUserJson);
    if (currentUserData && currentUserData._id) {
      const playerId = currentUserData._id;
      const playerEmail = currentUserData.email;
      console.log('ID de l\'utilisateur récupéré depuis localStorage:', playerId);
     

      if (this.isPhysiotherapistSelected && this.isDoctorSelected) {
        this.showProfessionalSelectionError = true;
        return;
      }

      if (meetingDate <= currentDate) {
        this.showDateError = true;
        return;
      }

      this.showProfessionalSelectionError = false;
      this.showDateError = false;

      if (this.isPhysiotherapistSelected) {
        if (!this.meetingName || !this.meetingDate || !this.selectedPhysiotherapist) {
          return;
         
        }
      /*  console.log(this.meetingName);
        console.log(this.meetingDate);
        console.log(this.selectedPhysiotherapist);
        console.log(this.meetingName);
        console.log(playerId);*/
        
        const meetingData = {
          meetingName: this.meetingName,
          meetingDate: this.meetingDate,
          selectedPhysiotherapist: this.selectedPhysiotherapist,
          description: this.meetingName,
          playerId: playerId ,
          playerEmail:playerEmail
       
        };

        this.backendService.scheduleMeeting(meetingData).subscribe(
          (response) => {
            const newMeetingId = response._id;
            this.getMeetings();
            this.showSuccessMessage('Réunion planifiée avec succès!');

            setTimeout(() => {
              if (!this.isMeetingConfirmed(newMeetingId)) {
                this.cancelMeeting(newMeetingId);
              }
            }, 2* 60 * 1000); // 60 minutes en millisecondes
          },
          error => {
            console.error('Erreur lors de la planification de la réunion:', error);
            this.showErrorMessage('Erreur lors de la planification de la réunion. Veuillez réessayer.');
          }
        );
      } else if (this.isDoctorSelected) {
        if (!this.meetingName || !this.meetingDate || !this.selectedDoctor) {
          return;
        }
        console.log(this.meetingName);
        console.log(this.meetingDate);
        console.log(this.selectedDoctor);
        console.log(this.meetingName);
        console.log(playerId);
        const meetingData = {
          meetingName: this.meetingName,
          meetingDate: this.meetingDate,
          selectedDoctor: this.selectedDoctor,
          description: this.meetingName,
          playerId: playerId ,
          playerEmail:playerEmail
   
        };

        this.backendService.scheduleMeetingDoctor(meetingData).subscribe(
          (response) => {
            const newMeetingId = response._id;
            this.getMeetings();
            this.showSuccessMessage('Réunion planifiée avec succès!');

            setTimeout(() => {
              if (!this.isMeetingConfirmed(newMeetingId)) {
                this.cancelMeeting(newMeetingId);
              }
            }, 2 * 60 * 1000);
          },
          error => {
            console.error('Erreur lors de la planification de la réunion:', error);
            this.showErrorMessage('Erreur lors de la planification de la réunion. Veuillez réessayer.');
          }
        );
      }
    }
  }
}

onProfessionalChange(): void {
  if (this.isPhysiotherapistSelected && this.isDoctorSelected) {
    this.showProfessionalSelectionError = true;
  } else {
    this.showProfessionalSelectionError = false;
  }
}
scheduleMeetingWithDoctor(): void {
  const currentDate = new Date();
  const meetingDate = new Date(this.meetingDate);
  
  const currentUserJson = localStorage.getItem('currentUser');
  if (!currentUserJson) {
    console.error("Utilisateur non connecté.");
    
    return;
  }

  const currentUserData = JSON.parse(currentUserJson);
  if (!currentUserData || !currentUserData._id) {
    console.error("Données utilisateur invalides.");
   
    return;
  }

  const playerId = currentUserData._id;
  const playerEmail = currentUserData.email;
  console.log('ID de l\'utilisateur récupéré depuis localStorage:', playerId);

  if (meetingDate <= currentDate) {
    this.showDateError = true; 
    return;
  }

  this.showDateError = false; 

  if (!this.meetingName || !this.meetingDate || !this.selectedDoctor) {
    return;
  }
  

  const meetingData = {
    meetingName: this.meetingName,
    meetingDate: this.meetingDate,
    selectedDoctor: this.selectedDoctor,
    description: this.meetingName,
    playerId: playerId ,
    playerEmail:playerEmail

  };

  this.backendService.scheduleMeetingDoctor(meetingData).subscribe(
    (response) => {
      const newMeetingId = response._id;
      const playerId = response.playerId;

      this.getMeetings();
      this.showSuccessMessage('Réunion planifiée avec succès!');

      setTimeout(() => {
        if (!this.isMeetingConfirmed(newMeetingId)) {
          this.cancelMeeting(newMeetingId);
        }
      }, 2* 60 * 1000); 
    },
    error => {
      console.error('Erreur lors de la planification de la réunion:', error);
      this.showErrorMessage('Erreur lors de la planification de la réunion. Veuillez réessayer.');
    }
  );
}


  showSuccessMessage(message: string): void {
    
  }

  showErrorMessage(message: string): void {

  } 
  isMeetingDatePassed(meetingDate: Date): boolean {
    const currentDate = new Date();
    return currentDate.getTime() > new Date(meetingDate).getTime();
}

mapMeetingsToCalendarEvents(meetings: any[]): any[] {
  return meetings.map(meeting => ({
    title: meeting.name,
    start: meeting.date,
    meetingId: meeting._id,
    classNames: this.getEventClassNames(meeting),
    isConfirmed: meeting.confirmed, // Ajouter une propriété pour vérifier si la réunion est confirmée
  }));
} 


  getEventClassNames(meeting: any): string[] {
    const classNames = [];
    if (this.isMeetingConfirmed(meeting._id) && this.isMeetingDatePassed(new Date(meeting.date))) {
        classNames.push('meeting-success');
    }
    return classNames;
}
  handleEventClick(eventInfo: any): void {
    const meetingId = eventInfo.event.extendedProps.meetingId;
    this.cancelMeeting(meetingId);
   
  }
  
  cancelMeeting(meetingId: string): void {
    this.backendService.cancelMeeting(meetingId).subscribe(() => {
      this.getMeetings(); 
    }, error => {
      console.error('Erreur lors de l\'annulation de la réunion:', error);
      //alert('Erreur lors de l\'annulation de la réunion. Veuillez réessayer.');
    });
  }
  isMeetingConfirmed(meetingId: string): boolean {
    const meeting = this.meetings.find(meeting => meeting._id === meetingId);
    return meeting && meeting.confirmed;
  }
  
     
}
