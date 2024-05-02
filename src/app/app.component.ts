import { Component, AfterViewInit } from '@angular/core';
declare var $: any; // Assure TypeScript that $ is available globally
import { filter } from 'rxjs/operators';
import { NavigationEnd, Router } from "@angular/router";
import { ProfileImageService } from "./profile-image.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements AfterViewInit {
  title = 'METAMATCH';
  showHeaderFooter = false; // Default to false assuming you generally want it hidden
  showChatbotSidebar = true; // By default, show the chatbot sidebar unless the route is /chat

  constructor(private router: Router, private profileImageService: ProfileImageService) {
    // Listen to router events
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      // Control visibility based on the current route
      this.showHeaderFooter = event.urlAfterRedirects === '/login';
      // Hide chatbot sidebar only on '/chat' route
      this.showChatbotSidebar = event.urlAfterRedirects !== '/chats' && event.urlAfterRedirects !== '/login' && event.urlAfterRedirects !== '/user-profile';
    });
  }

  ngAfterViewInit(): void {
    $(document).on('click', '.panel-heading span.clickable', (e: Event) => {
      const $this = $(e.currentTarget);
      if (!$this.hasClass('panel-collapsed')) {
        $this.parents('.panel').find('.panel-body').slideUp();
        $this.addClass('panel-collapsed');
        $this
          .find('i')
          .removeClass('glyphicon-minus')
          .addClass('glyphicon-plus');
      } else {
        $this.parents('.panel').find('.panel-body').slideDown();
        $this.removeClass('panel-collapsed');
        $this
          .find('i')
          .removeClass('glyphicon-plus')
          .addClass('glyphicon-minus');
      }
    });

    $('#menu-close').click((e: Event) => {
      e.preventDefault();
      $('#sidebar-wrapper').toggleClass('active');
    });

    $('#menu-toggle').click((e: Event) => {
      e.preventDefault();
      $('#sidebar-wrapper').toggleClass('active');
    });
  }
}
