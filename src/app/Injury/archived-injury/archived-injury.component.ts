import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InjuryService } from '../injury.service';
import { Injury } from '../injury';
@Component({
  selector: 'app-archived-injury',
  templateUrl: './archived-injury.component.html',
  styleUrls: ['./archived-injury.component.css']
})
export class ArchivedInjuryComponent implements OnInit {
  playerInjuries: any[] = [];
  playerName: string = ''; // Ajouter la propriété playerName

  joueurs: any[] = [];
  playerId: string = '';
  injuries: Injury[] = [];

  articles: any[] = [];
// Déclarez ces propriétés dans votre classe HomeInjuryComponent
currentPage: number = 1;
itemsPerPage: number = 6;
totalPages: number = 0;
  constructor(private route: ActivatedRoute, private injuryService: InjuryService) { }

  ngOnInit(): void {
    this.fetchArticles();

    this.route.paramMap.subscribe(params => {
      const playerIdParam = params.get('playerId');
      console.log("Player ID : " + playerIdParam);
      if (playerIdParam) {
        this.playerId = playerIdParam;
        this.loadInjuries();
        this.loadPlayerName(); // Ajout de la méthode pour charger le nom du joueur
      } else {
        console.error('No player ID found in URL');
      }
    });
  }
  
  loadInjuries(): void {
    this.injuryService.getPlayerArchiveInjuries(this.playerId).subscribe(
      data => {
        this.injuries = data;
        console.log('Player Archive Injuries:', this.injuries);
      },
      error => {
        console.error('Error retrieving player archive injuries', error);
      }
    );
  }

  loadPlayerName() {
    this.injuryService.getByIdJoueur(this.playerId).subscribe(
      (playerData: any) => {
        if (playerData) {
          this.playerName = playerData.username; 
        } else {
          console.error('Player data is null');
        }
      },
      (error) => {
        console.error('Error fetching player name:', error);
      }
    );
  }
  loadJoueurs() {
    this.injuryService.getJoueurs().subscribe(
      data => {
        this.joueurs = data;
        this.updateRecoveryStatus();


        console.log('Joueurs:', data);
      },
      error => {
        console.error('Error retrieving joueurs', error);
      }
    );
  }


  getPlayerName(playerId: number): string {
    const joueur = this.joueurs.find(User => User._id === playerId);
    return joueur ? joueur.username : 'Unknown';
  }


 
  updateRecoveryStatus() {
    const currentDate = new Date();
    this.playerInjuries.forEach(injury => {
      const endDate = new Date(injury.duration);
      if (currentDate >= endDate) {
        injury.recovery_status = 'Recovered';
      } else if (currentDate.getDate() + 7 >= endDate.getDate()) {
        injury.recovery_status = 'In Progress';
      } else {
        injury.recovery_status = 'In Rehabilitation';
      }
    });
  }


  
fetchArticles(): void {
  this.injuryService.getScrapedInjury().subscribe(
    (articles: any[]) => {
      this.articles = articles || []; // Assurez-vous que this.articles est un tableau valide
      this.totalPages = Math.ceil(this.articles.length / this.itemsPerPage); // Mettez à jour le nombre total de pages
    },
    (error) => {
      console.error('Error fetching articles:', error);
    }
  );
}



// Méthode pour changer de page
pageChanged(pageNumber: number): void {
this.currentPage = pageNumber;
this.fetchArticles();
}

// Méthode pour générer les numéros de page
getPageNumbers(): number[] {
const totalPages = Math.ceil(this.articles.length / this.itemsPerPage);
return Array(totalPages).fill(0).map((x, i) => i + 1);
}

getArticlesForCurrentPage(): any[] {
const startIndex = (this.currentPage - 1) * this.itemsPerPage;
const endIndex = startIndex + this.itemsPerPage;
return this.articles.slice(startIndex, endIndex);
}


}
