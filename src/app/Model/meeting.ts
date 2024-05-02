/*export interface Meeting {
  name: string;
  dateTime: string; // Champ pour la date et l'heure
  selectedPhysiotherapist: string;
  description: string;
}*/
export interface Meeting {
  meetingId: string;
  meetingName: string;
  meetingDate: Date;
  selectedPhysiotherapist: string;
  description: string;
 
}
