import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-dialog-add-player',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './dialog-add-player.component.html',
  styleUrl: './dialog-add-player.component.scss'
})
export class DialogAddPlayerComponent {
  name: string = '';
  selectedImage: string = '';
  allProfilePictures: string[] = [
    'player.png',
    'playrin.png'
    //Hier kannst du weitere Bilder ergänzen!
  ];

  constructor (public dialogRef: MatDialogRef<DialogAddPlayerComponent>) {}

  onNoClick() {
    this.dialogRef.close();
  }

  selectImage(image: string) {
    this.selectedImage = image;
  }
}

