import { joueur } from './joueur' 
export interface Injury {
    idInjury?: string; 
    player_id?: joueur;
    date?: Date;
    type?: string;
    description?: string;
    recovery_status?: string;
    duration?: Date;
    archived?: Boolean;
  }