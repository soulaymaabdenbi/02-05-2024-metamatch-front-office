import { Component, Output, EventEmitter } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Chat } from 'src/app/Model/chat';
import { ChatService } from 'src/app/Service/chat.service';

@Component({
    selector: 'app-chatbot-sidebar',
    templateUrl: './chatbot-sidebar.component.html',
    styleUrls: ['./chatbot-sidebar.component.css']
})
export class ChatbotSidebarComponent {
    @Output() toggle: EventEmitter<boolean> = new EventEmitter<boolean>();
    isOpen: boolean = true;
    sidebarWidth: number = 350; 
 
    suggestedDomains: string[] = ['Club', 'Market Fee', 'Age', 'Position','Player Nationality', 'Market Value','League','League Country'];
    selectedDomain: string | null = null;
   
    suggestedQuestions: { [domain: string]: string[] } = {
      'Club': [
        "What club does the player belong to?",
        "What is the player's club?",
        "Which club does the player play for?"
    ],
    'Age': [
        "How old is the player?",
        "What is the player's age?",
        "What age does the player have?"
    ],
    'Position': [
        "What position does the player play?",
        "What is the player's position?",
        "Which position does the player have?"
    ],
    'Player Nationality': [
        "What is the player's nationality?",
        "Which country is the player from?",
        "Where is the player's nationality?"
    ],
    'Market Value': [
        "What is the player's market value?",
        "How much is the player worth?",
        "What is the market value of the player?"
    ],
    'League': [
        "What league does the player participate in?",
        "Which league is the player part of?",
        "In which league does the player play?"
    ],
    'League Country': [
        "In which country is the league the player plays in?",
        "What country is the league located in?",
        "Which country does the league belong to?"
    ],
    'Transfer Type': [
        "What type of transfer did the player go through?",
        "Which transfer type was used for the player?",
        "What was the transfer type for the player?"
    ],
    'Fee': [
        "What transfer fee was paid for the player?",
        "How much was the transfer fee for the player?",
        "What was the fee paid for the player?"
    ]
    };

    selectedQuestions: string[] = [];

    conversation: { question: string, response: string }[] = [];
    question: string = '';

    constructor(private chatService: ChatService) { }

    askQuestion(): void {
      if (!this.question.trim()) return; 
  
      this.chatService.askQuestion(this.question)
          .subscribe((response: any) => {
              let answer = typeof response.answer === 'object' ? response.answer.answer : response.answer;
              this.conversation.push({ question: this.question, response: answer });
              this.question = '';
              this.selectedQuestions = [];
          });
  }
  
    onKeyPress(event: KeyboardEvent): void {
        if (event.key === 'Enter') {
            this.askQuestion();
        }
    }

   
    drop(event: CdkDragDrop<string[]>): void {
        moveItemInArray(this.selectedQuestions, event.previousIndex, event.currentIndex);
    }
    selectDomain(domain: string): void {
        this.selectedQuestions = this.suggestedQuestions[domain] || [];
    }
  
    onQuestionDropped(event: CdkDragDrop<string[]>): void {
      if (event.previousContainer === event.container) {
      // Déplacer la question à l'intérieur de la liste
      moveItemInArray(this.selectedQuestions, event.previousIndex, event.currentIndex);
    } else {
      // Ajouter la question à la liste des questions à poser
      this.question = this.selectedQuestions[event.previousIndex];
      this.askQuestion();
   }
     }
    selectQuestion(question: string): void {
     this.question = question;
   }
   isChatContainerSmall: boolean = false;

 

 

   toggleChatContainerSize(): void {
   
       this.isChatContainerSmall = !this.isChatContainerSmall;
   
     }
   
    
   
     stopPropagation(event: MouseEvent): void {
   
       event.stopPropagation();
   
     }
}
