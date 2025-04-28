import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Game } from '../../models/game';
import { PlayerComponent } from "../player/player.component";
import { PlayerMobileComponent } from "../player-mobile/player-mobile.component";
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { EditPlayerComponent } from "../edit-player/edit-player.component";
import { GameInfoComponent } from "../game-info/game-info.component";
import { ActivatedRoute, Router } from '@angular/router';
import { Firestore, doc, docData, updateDoc, deleteDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, PlayerComponent, PlayerMobileComponent, MatButtonModule, MatIconModule, GameInfoComponent],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit, OnDestroy {  // ⬅️ OnDestroy hinzugefügt!

  pickCardAnmimation = false;
  currentCard: string = '';
  game: Game | null = null;
  gameId: string = '';
  private isSaving: boolean = false;
  private endDialogOpen = false;
  backgroundMusic = new Audio('/assets/audio/background-music.mp3');
  volume: number = 5;

  constructor(
    private route: ActivatedRoute, 
    private router: Router, 
    public dialog: MatDialog, 
    private firestore: Firestore
  ) {}

  ngOnInit(): void {
    this.backgroundMusic.loop = true;
    this.backgroundMusic.volume = 0.0002;

    this.route.params.subscribe((params) => {
      const gameId = params['id'];
      this.gameId = gameId;
  
      const gameDocRef = doc(this.firestore, 'games', gameId);
      docData(gameDocRef).subscribe(async (game: any) => {
        if (!game) {
          console.warn('Game does not exist or was deleted.');
          this.dialog.closeAll();
          this.endDialogOpen = false;
          this.stopMusic();
          this.goBackToStart();
          return;
        }
  
        const updatedGame = Game.fromJson(game);
        const prevLength = this.game?.playedCards.length || 0;
        const newLength = updatedGame.playedCards.length;
  
        updatedGame.player_images = game.player_images || [];
        this.game = updatedGame;
        this.currentCard = updatedGame.playedCards[updatedGame.playedCards.length - 1] || '';
        this.preloadNextCardImage();
  
        if (newLength > prevLength) {
          this.pickCardAnmimation = true;
          setTimeout(() => this.pickCardAnmimation = false, 1000);
        }
  
        if (this.game?.gameOver && !this.endDialogOpen) {
          await this.openEndDialog();
        } else if (!this.game?.gameOver && this.endDialogOpen) {
          this.dialog.closeAll();
          this.endDialogOpen = false;
        }
      });

      this.playMusic();  // Musik starten nach Spielstart
    });
  }

  ngOnDestroy(): void {
    this.stopMusic();
  }

  playMusic() {
    this.backgroundMusic.loop = true;
    this.backgroundMusic.volume = this.volume / 100;
    this.backgroundMusic.play().catch(err => {
      console.warn('Autoplay blockiert, Benutzerinteraktion nötig', err);
    });
  }
  
  onVolumeChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.volume = +input.value;
    if (this.backgroundMusic) {
      this.backgroundMusic.volume = this.volume / 100;
    }
  }

  stopMusic() {
    this.backgroundMusic.pause();
    this.backgroundMusic.currentTime = 0;
  }

  getPlayerImage(i: number): string {
    return this.game?.player_images?.[i] || 'player.png';
  }

  goBackToStart() {
    this.router.navigateByUrl('/');
  }

  newGame() {
    this.game = new Game();
    this.game.currentPlayer = -1;
    this.playMusic();  // Musik neu starten
  }

  async takeCard() {
    if (!this.pickCardAnmimation && !this.isSaving && this.game) {
      if (!this.game.roundStarted) {
        alert('❗ Runde noch nicht gestartet!');
        return;
      }
  
      if (this.game.stack.length > 0) {
        const drawnCard = this.game.stack.pop() || '';
        this.pickCardAnmimation = true;
        this.currentCard = drawnCard;
        this.isSaving = true;
  
        this.game.currentPlayer++;
        this.game.currentPlayer %= this.game.players.length;
  
        setTimeout(async () => {
          this.game?.playedCards.push(drawnCard);
          this.pickCardAnmimation = false;
          await this.saveGame();
          this.isSaving = false;
        }, 1000);
      } else {
        console.warn('No more cards!');
        this.game.gameOver = true;
        await this.saveGame();
      }
    }
  }

  startRound() {
    if (!this.game) return;
    if (this.game.players.length < 2) {
      alert('❗ Mindestens 2 Spieler erforderlich!');
      return;
    }
    const randomPlayer = Math.floor(Math.random() * this.game.players.length);
    this.game.currentPlayer = randomPlayer;
    this.game.roundStarted = true;
    this.saveGame();
  }

  async openEndDialog() {
    if (this.endDialogOpen) return;
    this.endDialogOpen = true;
  
    const { EndDialogComponent } = await import('../end-dialog/end-dialog.component');
    const dialogRef = this.dialog.open(EndDialogComponent, {
      disableClose: true,
    });
  
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === 'restart_same') {
        const players = [...this.game!.players];
        const images = [...this.game!.player_images];
        this.newGame();
        this.game!.players = players;
        this.game!.player_images = images;
        this.game!.gameOver = false;
        await this.saveGame();
      } else if (result === 'restart_new') {
        this.newGame();
        this.game!.gameOver = false;
        await this.saveGame();
      } else if (result === 'menu') {
        await this.deleteGame();
      }
      this.endDialogOpen = false;
    });
  }

  editPlayer(playerId: number) {
    const dialogRef = this.dialog.open(EditPlayerComponent, {
      data: { name: this.game?.players[playerId] }
    });
  
    dialogRef.afterClosed().subscribe((result: string | undefined) => {
      if (result === undefined) return;
  
      if (result === 'DELETE' && this.game) {
        this.game.players.splice(playerId, 1);
        this.game.player_images.splice(playerId, 1);
        this.saveGame();
      } else if (this.game) {
        this.game.player_images[playerId] = result;
        this.saveGame();
      }
    });
  }

  openDialog(): void {
    (document.activeElement as HTMLElement)?.blur();
  
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);
  
    dialogRef.afterClosed().subscribe((result: { name: string, image: string }) => {
      if (result?.name && result?.image) {
        this.game?.players.push(result.name);
        this.game?.player_images.push(result.image);
        this.saveGame();
      }
    });
  }

  async deleteGame() {
    if (!this.gameId) {
      console.warn('No game ID to delete.');
      return;
    }
    try {
      const gameRef = doc(this.firestore, 'games', this.gameId);
      await deleteDoc(gameRef);
    } catch (error) {
      console.error('Error deleting game:', error);
    }
  }

  preloadNextCardImage() {
    const nextCard = this.game?.stack?.[this.game.stack.length - 1];
    if (nextCard) {
      const img = new Image();
      img.src = `/assets/img/cards/${nextCard}.png`;
    }
  }

  saveGame() {
    if (!this.game) return;
    const gameRef = doc(this.firestore, 'games', this.gameId);
    updateDoc(gameRef, this.game.toJson())
      .then(() => console.log('Game saved'))
      .catch((err) => console.error('Error saving game:', err));
  }
}