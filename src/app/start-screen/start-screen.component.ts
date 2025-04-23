import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { Game } from '../../models/game'; // ggf. anpassen

@Component({
  selector: 'app-start-screen',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './start-screen.component.html',
  styleUrls: ['./start-screen.component.scss']
})
export class StartScreenComponent {

  constructor(private router: Router, private firestore: Firestore) {}

  async newGame() {
    const game = new Game(); // neue Instanz erzeugen
    const gamesRef = collection(this.firestore, 'games');

    try {
      const docRef = await addDoc(gamesRef, game.toJson());
      console.log('Game saved with ID:', docRef.id);
      this.router.navigateByUrl(`/game/${docRef.id}`);
    } catch (error) {
      console.error('Error saving game:', error);
    }
  }
}

