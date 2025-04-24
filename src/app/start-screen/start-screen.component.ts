import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Firestore, collection, addDoc, query, orderBy, getDocs, deleteDoc, doc } from '@angular/fire/firestore';
import { Game } from '../../models/game';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-start-screen',
  standalone: true,
  imports: [ CommonModule, MatIconModule, ],
  templateUrl: './start-screen.component.html',
  styleUrls: ['./start-screen.component.scss'],
})
export class StartScreenComponent implements OnInit {
  games: { id: string }[] = [];
  showGames: boolean = false;

  constructor(private router: Router, private firestore: Firestore) {}

  ngOnInit(): void {
    this.loadGames();
  }

  async loadGames() {
    const gamesRef = collection(this.firestore, 'games');
    const gameQuery = query(gamesRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(gameQuery);
    this.games = snapshot.docs.map(doc => ({ id: doc.id }));
  }

  async newGame() {
    const gamesRef = collection(this.firestore, 'games');
    const gameQuery = query(gamesRef, orderBy('createdAt', 'asc'));
    const snapshot = await getDocs(gameQuery);

    if (snapshot.size >= 5) {
      const oldestGame = snapshot.docs[0];
      await deleteDoc(oldestGame.ref);
      console.log('Ältestes Spiel gelöscht:', oldestGame.id);
    }

    const newGame = new Game();
    const gameData = {
      ...newGame.toJson(),
      createdAt: new Date(),
    };

    const docRef = await addDoc(gamesRef, gameData);
    console.log('Neues Spiel erstellt:', docRef.id);
    this.router.navigateByUrl(`/game/${docRef.id}`);
  }

  joinGame(gameId: string) {
    this.router.navigateByUrl(`/game/${gameId}`);
  }

  async deleteGame(gameId: string) {
    const gameRef = doc(this.firestore, 'games', gameId);
    await deleteDoc(gameRef);
    this.games = this.games.filter(g => g.id !== gameId);
  }
}
