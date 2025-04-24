import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Firestore, collection, query, orderBy, getDocs, deleteDoc, doc, collectionData, setDoc } from '@angular/fire/firestore';
import { Game } from '../../models/game';
import { MatIconModule } from '@angular/material/icon';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-start-screen',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './start-screen.component.html',
  styleUrls: ['./start-screen.component.scss'],
})
export class StartScreenComponent implements OnInit, OnDestroy {
  games: { id: string }[] = [];
  showGames: boolean = false;
  private gamesSub!: Subscription;

  constructor(private router: Router, private firestore: Firestore) {}

  ngOnInit(): void {
    this.subscribeToGames();
  }

  ngOnDestroy(): void {
    this.gamesSub?.unsubscribe();
  }

  /**
   * Realtime Sync aller Spiele aus Firestore
   */
  subscribeToGames() {
    const gamesRef = collection(this.firestore, 'games');
    const gameQuery = query(gamesRef, orderBy('createdAt', 'desc'));
    this.gamesSub = collectionData(gameQuery, { idField: 'id' }).subscribe((games: any[]) => {
      this.games = games;
    });
  }

  /**
   * Erstellt ein neues Spiel mit genau 20 Zeichen langer ID
   */
  async newGame() {
    const gamesRef = collection(this.firestore, 'games');
    const gameQuery = query(gamesRef, orderBy('createdAt', 'asc'));

    // Maximal 5 Spiele zulassen, ältestes löschen
    const snapshot = await getDocs(gameQuery);
    if (snapshot.size >= 5) {
      const oldestDoc = snapshot.docs[0];
      await deleteDoc(oldestDoc.ref);
      console.log('Ältestes Spiel gelöscht:', oldestDoc.id);
    }

    // Spiel erstellen
    const newGame = new Game();
    const gameData = {
      ...newGame.toJson(),
      createdAt: new Date(),
    };

    // Eigene ID mit 20 Zeichen generieren
    const customId = this.generateGameId(20);
    const gameDocRef = doc(this.firestore, 'games', customId);
    await setDoc(gameDocRef, gameData);
    console.log('Neues Spiel erstellt mit ID:', customId);

    this.router.navigateByUrl(`/game/${customId}`);
  }

  joinGame(gameId: string) {
    this.router.navigateByUrl(`/game/${gameId}`);
  }

  async deleteGame(gameId: string) {
    const gameRef = doc(this.firestore, 'games', gameId);
    await deleteDoc(gameRef);
    // Kein manuelles Entfernen aus this.games nötig – läuft über Subscription
  }

  /**
   * Generiert eine zufällige ID mit fixer Länge
   */
  private generateGameId(length = 20): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
}

