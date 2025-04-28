import { Component } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-end-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './end-dialog.component.html',   // <-- geändert!
  styleUrls: ['./end-dialog.component.scss']    // <-- optional, falls du ein separates SCSS willst
})
export class EndDialogComponent {

  constructor(private dialogRef: MatDialogRef<EndDialogComponent>) {}

  restart() {
    this.dialogRef.close('restart');
  }

  backToMenu() {
    this.dialogRef.close('menu');
  }
}
