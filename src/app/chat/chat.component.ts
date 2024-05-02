import {AfterViewChecked, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ChatService} from "../chat.service";
import {WebSocketService} from "../web-socket.service";
import * as filestack from 'filestack-js';

interface ChatMessage {
  text: string;
  senderId: string;
  timestamp: Date;
  recipientId?: string;
  imageUrl?: string;
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, AfterViewChecked {
  @ViewChild('messageArea') private messageArea?: ElementRef<HTMLDivElement>;

  users: UserWithLatestMessage[] = [];
  messages: ChatMessage[] = [];
  selectedUser: any = null;
  newMessage: string = '';
  searchTerm: string = '';
  filteredUsers: UserWithLatestMessage[] = [];
  showEmojiPicker = false;

  constructor(private chatService: ChatService, private webSocketService: WebSocketService, private cdr: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.loadChatUsers();

    let currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

    this.webSocketService.getMessages().subscribe((wrapper: any) => {
      const message: ChatMessage = wrapper.data;
      console.log('Received message from socket:', message);

      // Push to messages array if it belongs to the current chat
      if (message.senderId === currentUser._id || message.senderId === this.selectedUser?._id) {
        this.messages.push(message);
        this.scrollToBottom();
      }

      // Update latest message for sender or receiver
      this.updateLatestMessageForUser(message.senderId, message.text);
      if (message.recipientId) {
        this.updateLatestMessageForUser(message.recipientId, message.text);
      }
    });
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    if (this.messageArea) {
      try {
        this.messageArea.nativeElement.scrollTop = this.messageArea.nativeElement.scrollHeight;
      } catch (err) {
        console.error('Could not scroll to bottom:', err);
      }
    }
  }


  toggleEmojiPicker(): void {
    this.showEmojiPicker = !this.showEmojiPicker;
    if (this.showEmojiPicker) {
      const pickerElement = document.querySelector('.emoji-picker') as HTMLElement;  // Cast to HTMLElement
      if (pickerElement) {
        const boundingRect = pickerElement.getBoundingClientRect();
        if (boundingRect.right > window.innerWidth) {
          pickerElement.style.right = '10px'; // Adjust to keep within viewport
        }
        if (boundingRect.top < 0) {
          pickerElement.style.bottom = `${-boundingRect.top + 10}px`; // Adjust if top is off the screen
        }
      }
    }
  }

  addEmoji(event: any): void {
    console.log('Emoji selected:', event);
    if (event.emoji) {
      this.newMessage += event.emoji.native;
      // this.showEmojiPicker = false; // Remove or comment this out to keep the picker open
    } else {
      console.error('Emoji data not found:', event);
    }
  }

  loadChatUsers() {
    this.chatService.getChatUsers().subscribe(users => {
      this.users = users;
      this.filteredUsers = this.users;
      this.users.forEach(user => {
        this.chatService.getChatHistory(user._id).subscribe({
          next: (chats) => {
            if (chats && chats.length > 0 && chats[0].chatHistory && chats[0].chatHistory.length > 0) {
              const lastChat = chats[0].chatHistory[chats[0].chatHistory.length - 1]; // Assuming chatHistory is sorted by date
              user.latestMessage = lastChat.message; // Assume 'message' is the key for the message text
            } else {
              user.latestMessage = 'No message yet';
            }
          },
          error: (error) => {
            console.error('Failed to fetch chat history for user:', user._id, error);
            user.latestMessage = 'Failed to load message';
          }
        });
      });
    }, error => {
      console.error('Failed to fetch users:', error);
    });
  }

  filterUsers() {
    if (!this.searchTerm) {
      this.filteredUsers = this.users;
    } else {
      this.filteredUsers = this.users.filter(user =>
        user.fullname.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  selectUser(user: any): void {
    this.selectedUser = user;
    this.messages = [];

    this.loadChatHistory(user._id);
  }

  sendMessage(): void {
    if (!this.newMessage.trim()) return;

    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const newMsg: ChatMessage = {
      text: this.newMessage,
      senderId: currentUser._id,
      timestamp: new Date(),
      recipientId: this.selectedUser._id,
    };

    // Send the message via WebSocket for real-time communication
    this.webSocketService.sendMessage({
      type: "new_chat_message",
      data: newMsg
    });

    // Also send the message via HTTP to store in the database
    this.chatService.sendChatMessage(this.selectedUser._id, newMsg).subscribe({
      next: (response) => {
        console.log('Message stored successfully:', response);
        // Update the latest message immediately after sending
        this.updateLatestMessageForUser(this.selectedUser._id, newMsg.text);
        // Then load the chat history
        this.loadChatHistory(this.selectedUser._id);
      },
      error: (error) => {
        console.error('Failed to store message:', error);
      }
    });

    // Clear the message input field
    this.newMessage = '';
  }

// Helper method to update the latest message for a specific user
  updateLatestMessageForUser(userId: string, message: string): void {
    let user = this.users.find(u => u._id === userId);
    if (user) {
      user.latestMessage = message;
    }

    let filteredUser = this.filteredUsers.find(u => u._id === userId);
    if (filteredUser) {
      filteredUser.latestMessage = message;
    }

    // Manually trigger change detection
    this.cdr.detectChanges();
  }

  loadChatHistory(userId: string) {
    this.chatService.getChatHistory(userId).subscribe({
      next: (chats) => {
        this.messages = chats[0].chatHistory.map((chat: any) => ({
          text: chat.message,
          senderId: chat.senderId,
          timestamp: chat.time,
          imageUrl: chat.imageUrl
        }));
        console.log('Chat history:', this.messages);
      },
      error: (error) => {
        console.error('Failed to fetch chat history:', error);
      }
    });
  }

  isMyMessage(messageSenderId: string): boolean {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    return messageSenderId === currentUser._id;
  }

  uploadImageToChat(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const client = filestack.init("A8rOsHUaWSxiCFTosYpuUz");
      client.upload(file)
        .then(response => {
          this.sendPhoto(response.url); // Call sendPhoto with the uploaded image URL
        })
        .catch(error => {
          console.error('Error uploading image:', error);
          // Handle upload error
        });
    }
  }

  sendPhoto(imageUrl: string): void {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const senderId = currentUser._id;

    // Create a new message object including the imageUrl
    const newMsg: ChatMessage = {
      text: '📷 Photo',  // Indicate that this message is a photo
      senderId: senderId,
      timestamp: new Date(),
      imageUrl: imageUrl,  // Include the image URL in the message
      recipientId: this.selectedUser._id
    };

    // Use sendChatMessage to send the new message via HTTP and update UI
    this.chatService.sendChatMessage(this.selectedUser._id, newMsg).subscribe({
      next: (response) => {
        console.log('Photo sent successfully:', response);
        // Add the new message to the messages array
        this.messages.push(newMsg);
        // Clear any new message text
        this.newMessage = '';
        // Update latest message for both the sender and recipient
        this.updateLatestMessageForUser(senderId, '📷 Photo sent');
        if (newMsg.recipientId) {
          this.updateLatestMessageForUser(newMsg.recipientId, '📷 Photo received');
        }
        // Use WebSocket to ensure real-time communication is maintained
        this.webSocketService.sendMessage({
          type: "new_chat_message",
          data: newMsg
        });
      },
      error: (error) => {
        console.error('Error sending photo:', error);
      }
    });
  }


}


interface UserWithLatestMessage {
  _id: string;
  fullname: string;
  profile: string;
  latestMessage: string;
}

