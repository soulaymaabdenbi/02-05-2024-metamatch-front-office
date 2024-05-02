import { Component, OnInit } from '@angular/core';
import { TeamService } from '../team.service';

@Component({
  selector: 'app-blog-article',
  templateUrl: './blog-article.component.html',
  styleUrls: ['./blog-article.component.css'],
})
export class BlogArticleComponent implements OnInit {
  articles: any[] = [];

  constructor(private teamService: TeamService) {}

  ngOnInit(): void {
    this.fetchArticles();
  }

  fetchArticles(): void {
    this.teamService.getScrapedArticles().subscribe(
      (articles: any[]) => {
        this.articles = articles;
      },
      (error) => {
        console.error('Error fetching articles:', error);
      }
    );
  }
}
