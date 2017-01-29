class Cell {
  constructor(x, y, value, isBomb, isOpen) {
    this.x = x;
    this.y = y;
    this.isBomb = isBomb;
    this.isOpen = isOpen;
    this.value = value;
  }

  plantABomb() {
    this.isBomb = true;
  }

  open() {
    this.isOpen = true;
  }

  toString() {
    return this.isOpen
        ? this.isBomb
          ? 'X'
          : this.value
        : '||';
  }
}

class Field {
  constructor(x, y) {
    this.x = x;
    this.y = y;

    this.rows = [];
    for (let i = 0; i < x; i++) {
      const row = [];

      for (let j = 0; j < y; j++) {
        row.push(new Cell(i, j));
      }

      this.rows.push(row);
    }
  }

  set(x, y, value) {
    this.rows[x][y] = value;
  }

  get(x, y) {
    return this.rows[x][y];
  }

  getDistance(p1, p2) {
    const powX = Math.pow(p1.x - p2.x, 2);
    const powY = Math.pow(p1.y - p2.y, 2);

    return Math.floor(Math.sqrt(powX + powY));
  }

  toString() {
    return this.rows.map(columns => {
      return columns.map(col => col.toString()).join(' ');
    }).join('\n');
  }
}

class Game {
  constructor(dimentions, nBooms) {
    //TODO: validate dimentions
    this.dimentions = dimentions;
    this.field = null;
    this.nCells = this.dimentions.x * this.dimentions.y;
    this.bombsNumber = nBooms || Math.ceil(this.nCells / 10);
    this.bombs = [];
    this.message = 'Take a shot';

    this.reset();
  }

  _prompt(q) {
    const x = this._getRandomNumber(this.dimentions.x);
    const y = this._getRandomNumber(this.dimentions.y);
    console.log(`# ${q} > ${x} ${y}`);
    return [x, y];
  }

  _getRandomNumber(max) {
    return Math.floor(Math.random() * max);
  }

  _generateField() {
    this.field = new Field(this.dimentions.x, this.dimentions.y);
  }

  _plantBombs() {
    let n = this.bombsNumber;

    while (n != 0) {
      const x = this._getRandomNumber(this.dimentions.x);
      const y = this._getRandomNumber(this.dimentions.y);

      const cell = this.field.get(x, y);

      if (!cell.isBomb) {
        cell.plantABomb();
        this.bombs.push(cell);
        n--;
      }
    }
  }

  _calculateDistances() {
    this.field.rows.forEach((row, rIdx) => {
      row.forEach((col, cIdx) => {

        const cell = this.field.get(rIdx, cIdx);

        if (cell.isBomb) {
          return;
        }

        const bomb = this._getNearestBomb(cell);
        cell.value = bomb.distance;
      });
    });
  }

  _getNearestBomb(position) {
    const mem = {
      bomb: null,
      distance: this.dimentions.x > this.dimentions.y ? this.dimentions.x : this.dimentions.y
    };

    return this.bombs.reduce((mem, bomb) => {
      const bombDistance = this.field.getDistance(position, bomb);
      if (bombDistance < mem.distance) {
        mem.bomb = bomb;
        mem.distance = bombDistance;
      }

      return mem;

    }, mem);
  }

  reset() {
    this._generateField();
    this._plantBombs();
    this._calculateDistances();
    this.nOpenedCells = 0;
    this.running = false;
  }

  print() {
    console.log(this.field.toString());
  }

  start() {
    this.running = true;
    this.print();
  }

  end(result) {
    this.running = false;
    this.print();
  }

  openCell(x, y) {
    if (!this.running) {
      return;
    }

    const cell = this.field.get(x, y);
    if (cell.isOpen) {
      return;
    }

    cell.open();
    this.nOpenedCells++;

    if (cell.isBomb) {
      this.message = 'Game Over: You lost :(';
      return this.end();
    }

    if (this.nCells - this.bombsNumber - this.nOpenedCells <= 0) {
      this.message = 'Game Over: You win!!! :)';
      return this.end();
    }

    this.message = 'Keep going';
    this.print();
  }
}
