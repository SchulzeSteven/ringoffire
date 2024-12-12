export class Game {
    public players: string[] = [];
    public stack: string[] = [];
    public playedCards: string[] = [];
    public currentPlayer: number = 0;
  
    constructor() {
      // Generate a full deck of cards
      for (let i = 1; i < 14; i++) { // Changed `<` to `<=` for a complete deck (1 to 13)
        this.stack.push(`spades_${i}`);
        this.stack.push(`hearts_${i}`);
        this.stack.push(`clubs_${i}`);
        this.stack.push(`diamonds_${i}`);
      }
  
      this.shuffle(this.stack); // Shuffle the deck
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
  