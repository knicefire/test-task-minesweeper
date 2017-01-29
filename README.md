# Minesweeper Game

A test task to implement the minesweeper game.

The current game is using different approach on giving the player a tip on where is a bomb.
Instead of showing how many bombs are around the place, it calculates the distance to the nearest bomb.

## The Game

The game has a preset filed 5x5 and it challenges player to find 3 bombs.

## The implementation

The game is written on JavaScript ES6.

It has 3 classes

* Cell - an individual cell of a game
* Field - a field that is used in the game
* Game - a game constructor

You start a new game by instantiating class and providing it with dimensions and the number of bombs

```javascript
const game = new Game({x: 5, y: 5}, 3);
game.start();
```

To interact with the game the `game.openCell(x, y)` needs to be called.

Opened cells unveil a number that represents the distance to the nearest bomb.
If the cell was mined then the game is over and an X sign is shown.

The game lasts until all the cells but mined are opened, or a player has clicked on mined cell

On every step the game uses `game.print()` method to as render, so it is possible to implement different rendering method to be used for different platforms


To try it out simply open `bomber.html` in your browser.

**No server required**
