import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Game } from '../../models/game';
import { PlayerComponent } from "../player/player.component";
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { GameInfoComponent } from "../game-info/game-info.component";
import { ActivatedRoute, Router } from '@angular/router';
import { Firestore, doc, docData, updateDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, PlayerComponent, MatButtonModule, MatIconModule, GameInfoComponent],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  pickCardAnmimation = false
  currentCard: string = '';
  game: Game | null = null;
  gameId: string = '';

  constructor(private route: ActivatedRoute, private router: Router, public dialog: MatDialog, private firestore: Firestore) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const gameId = params['id'];
      this.gameId = gameId;
  
      const gameDocRef = doc(this.firestore, 'games', gameId);
      docData(gameDocRef).subscribe((game: any) => {
        const updatedGame = Game.fromJson(game);
  
        const prevLength = this.game?.playedCards.length || 0;
        const newLength = updatedGame.playedCards.length;
  
        this.game = updatedGame;
        this.currentCard = updatedGame.playedCards[updatedGame.playedCards.length - 1] || '';
  
        // 🎯 Animation auslösen bei neuer Karte
        if (newLength > prevLength) {
          this.pickCardAnmimation = true;
          setTimeout(() => {
            this.pickCardAnmimation = false;
          }, 1000);
        }
      });
    });
  }
  

  goBackToStart() {
    this.router.navigateByUrl('/');
  }


  newGame() {
    this.game = new Game();
  }


  takeCard() {
    if (!this.pickCardAnmimation && this.game) {
      if (this.game.stack.length > 0) {
        const drawnCard = this.game.stack.pop() || '';
  
        this.pickCardAnmimation = true;
        this.currentCard = drawnCard;
  
        this.game.currentPlayer++;
        this.game.currentPlayer %= this.game.players.length;
  
        setTimeout(() => {
          this.game?.playedCards.push(drawnCard);
          this.pickCardAnmimation = false;
          this.saveGame(); // Speichern erst, wenn Karte wirklich gezogen
        }, 1000);
      } else {
        console.warn('No more cards in the stack!');
      }
    }
  }
  
  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe((name: string) => {
      if (name && name.length > 0) {
        this.game?.players.push(name);
        this.saveGame();
      }
    });
  }

  saveGame() {
    if (!this.game) {
      console.error('No game to save');
      return;
    }
  
    const gameRef = doc(this.firestore, 'games', this.gameId);
    updateDoc(gameRef, this.game.toJson())
      .then(() => console.log('Game successfully saved.'))
      .catch((err) => console.error('Error saving game:', err));
  }
}
