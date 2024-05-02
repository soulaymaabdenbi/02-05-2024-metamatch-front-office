import { Component, OnInit } from '@angular/core';
import { joueur } from '../joueur';
import { InjuryService } from '../injury.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-injury',
  templateUrl: './home-injury.component.html',
  styleUrls: ['./home-injury.component.css']
})
export class HomeInjuryComponent implements OnInit {
  joueurs: any[] = [];
  articles: any[] = [];
// Déclarez ces propriétés dans votre classe HomeInjuryComponent
currentPage: number = 1;
itemsPerPage: number = 6;
totalPages: number = 0;


  constructor(private injuryService: InjuryService, private router: Router) { }

  ngOnInit(): void {
    this.loadJoueurs();
    this.fetchArticles();

  }

  loadJoueurs() {
    this.injuryService.getJoueurs().subscribe(
      (joueurs) => {
        this.joueurs = joueurs;
        console.log(joueurs);

      },
      (error) => {
        console.error(error);
      }
    );
  }
  viewInjuries(playerId: number | undefined) {
    if (playerId !== undefined) {
      this.router.navigate(['/injuries', playerId]);
    } else {
      console.error('Player ID is undefined');
    }
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


getPlayerImage(playerId: number): string {
  const joueur = this.joueurs.find(user => user._id === playerId);
  return joueur ? joueur.profile : 'assets/images/avatars/1-small.png';
}

}
