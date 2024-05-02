import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InjuryService } from '../injury.service';
@Component({
  selector: 'app-views-injury',
  templateUrl: './views-injury.component.html',
  styleUrls: ['./views-injury.component.css']
})
export class ViewsInjuryComponent implements OnInit {
playerId: string = '';
  playerInjuries: any[] = [];
  playerName: string = ''; // Ajouter la propriété playerName
  articles: any[] = [];
// Déclarez ces propriétés dans votre classe HomeInjuryComponent
currentPage: number = 1;
itemsPerPage: number = 6;
totalPages: number = 0;
  constructor(private route: ActivatedRoute, private injuryService: InjuryService) { }

  ngOnInit(): void {
    this.fetchArticles();

    this.route.paramMap.subscribe(params => {
      const playerId = params.get('playerId');
      console.log('Player ID:', playerId);
      if (playerId) {
        this.playerId = playerId;
        this.loadPlayerData(playerId);
      } else {
        console.error('No player ID found in URL');
      }
    });
  }
  loadPlayerData(playerId: string) {
    this.injuryService.getPlayerInjuries(playerId).subscribe(
      (data: any[]) => {
        this.playerInjuries = data.filter(injury => !injury.archived);
        this.updateRecoveryStatus();

        // Récupérer le nom du joueur
        this.injuryService.getByIdJoueur(playerId).subscribe(
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
      },
      (error) => {
        console.error('Error fetching player injuries:', error);
      }
    );
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
