import { Component } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-end-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './end-dialog.component.html',
  styleUrls: ['./end-dialog.component.scss'],
})
export class EndDialogComponent {
  showRestartOptions = false;

  constructor(public dialogRef: MatDialogRef<EndDialogComponent>) {}

  askRestartOptions() {
    this.showRestartOptions = true;
  }

  restart(samePlayers: boolean) {
    this.dialogRef.close(samePlayers ? 'restart_same' : 'restart_new');
  }

  backToMenu() {
    this.dialogRef.close('menu');
  }
}

