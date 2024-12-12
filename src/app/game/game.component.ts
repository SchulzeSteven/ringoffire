import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Game } from '../../models/game';
import { PlayerComponent } from "../player/player.component";
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { GameInfoComponent } from "../game-info/game-info.component";

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, PlayerComponent, MatButtonModule, MatIconModule, GameInfoComponent],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent {

  pickCardAnmimation = false
  currentCard: string = '';
  game: Game | null = null;

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {
    this.newGame();
  }

  newGame() {
    this.game = new Game();
    console.log(this.game);
  }


  takeCard() {
    if (!this.pickCardAnmimation && this.game) { // Ensure no ongoing animation and game is initialized
      if (this.game.stack.length > 0) { // Check if there are cards in the stack
        this.currentCard = this.game.stack.pop() || ''; // Safely retrieve a card
        console.log(this.currentCard);
  
        this.pickCardAnmimation = true;
        console.log('New card:' + this.currentCard);
        console.log('Game is', this.game);
    
        this.game.currentPlayer++;
        this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;
        setTimeout(() => {
          this.game?.playedCards.push(this.currentCard);
          this.pickCardAnmimation = false;
        }, 1000);
      } else {
        console.warn('No more cards in the stack!');
      }
    } else if (!this.game) {
      console.error('Game not initialized. Please start a new game.');
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe((name: string) => {
      if (name && name.length > 0) {
        this.game?.players.push(name);
      }
    });
  }

}
