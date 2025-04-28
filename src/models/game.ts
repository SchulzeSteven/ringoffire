export class Game {
    public players: string[] = [];
    public player_images: string[] = [];
    public stack: string[] = [];
    public playedCards: string[] = [];
    public currentPlayer: number = 0;
    public gameOver: boolean = false;
    public roundStarted: boolean = false;
  
    constructor() {
      // Generate a full deck of cards
      for (let i = 1; i < 2; i++) { // Changed `<` to `<=` for a complete deck (1 to 13)
        this.stack.push(`spades_${i}`);
        this.stack.push(`hearts_${i}`);
        this.stack.push(`clubs_${i}`);
        this.stack.push(`diamonds_${i}`);
      }
  
      this.shuffle(this.stack); // Shuffle the deck
    }

    public toJson() {
      return {
        players: this.players,
        player_images: this.player_images,
        stack: this.stack,
        playedCards: this.playedCards,
        currentPlayer: this.currentPlayer,
        gameOver: this.gameOver,
        roundStarted: this.roundStarted
      };
    }
    
    

    public static fromJson(json: any): Game {
      const game = new Game();
      game.players = json.players || [];
      game.player_images = json.player_images || [];
      game.stack = json.stack || [];
      game.playedCards = json.playedCards || [];
      game.currentPlayer = json.currentPlayer || 0;
      game.gameOver = json.gameOver || false;
      game.roundStarted = json.roundStarted || false;
      return game;
    }
    
  
    /**
     * Shuffles an array in place using Fisher-Yates algorithm.
     * @param array The array to shuffle
     */
    private shuffle(array: string[]): void {
      let currentIndex = array.length;
  
      while (currentIndex !== 0) {
        // Pick a random remaining element
        const randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
  
        // Swap it with the current element
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
      }
    }
  }
  