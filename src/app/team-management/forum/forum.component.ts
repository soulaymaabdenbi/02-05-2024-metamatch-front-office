import { Component, OnInit } from '@angular/core';
import { Forum } from './forum.model';
import { TeamService } from '../team.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.css'],
})
export class ForumComponent implements OnInit {
  forums: Forum[] = [];
  newForum: Forum = new Forum();
  //selectedForum: Forum | null = null; // Forum post selected for editing or deletion
  //selectedForum: any = {}; // Initialize selectedForum to an empty object
  newForumForm: FormGroup;
  selectedForum: any = null;

  constructor(private teamService: TeamService, private fb: FormBuilder) {
    this.newForumForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(10)]],
      content: [
        '',
        [
          Validators.required,
          Validators.minLength(20),
          Validators.maxLength(100),
        ],
      ],
      author: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  ngOnInit(): void {
    this.loadForums();
  }

  loadForums(): void {
    this.teamService.getAllForums().subscribe(
      (forums) => {
        this.forums = forums;
      },
      (error) => {
        console.error('Error fetching forum posts:', error);
        // Handle error, e.g., show error message to user
      }
    );
  }

  addForum(): void {
    if (this.newForumForm.valid) {
      this.newForum = this.newForumForm.value;

      this.teamService.addForum(this.newForum).subscribe(
        (forum) => {
          this.forums.push(forum);
          this.newForumForm.reset();
          alert('Forum post added successfully!');
        },
        (error) => {
          console.error('Error adding forum post:', error);
          // Handle error, e.g., show error message to user
        }
      );
    }
  }
  selectForum(forum: any) {
    this.selectedForum = forum;
  }

  cancelEdit() {
    this.selectedForum = null;
  }
  updateForum(): void {
    if (this.selectedForum) {
      this.teamService
        .updateForum(this.selectedForum._id!, this.selectedForum)
        .subscribe(
          (updatedForum) => {
            // Find the index of the updated forum post in the array and replace it
            const index = this.forums.findIndex(
              (f) => f._id === updatedForum._id
            );
            if (index !== -1) {
              this.forums[index] = updatedForum;
            }
            this.selectedForum = null; // Clear the selected forum post
          },
          (error) => {
            console.error('Error updating forum post:', error);
            // Handle error, e.g., show error message to user
          }
        );
    }
  }

  deleteForum(forum: Forum): void {
    this.teamService.deleteForum(forum._id!).subscribe(
      () => {
        // Remove the deleted forum post from the array
        this.forums = this.forums.filter((f) => f._id !== forum._id);
        this.selectedForum = null; // Clear the selected forum post
      },
      (error) => {
        console.error('Error deleting forum post:', error);
        // Handle error, e.g., show error message to user
      }
    );
  }
}
