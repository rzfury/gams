import { Point } from '../types';
import Game from './libs/game';
import { COLOR, DRAWMAP, GAME_DIMENSION, cast } from './libs/utils';
import './style.css';

declare global {
  interface Window {
    __3310F_GAME: Game;
  }
}

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function app() {
  // I cheated
  // https://gist.github.com/ZiKT1229/5935a10ce818ea7b851ea85ecf55b4da

  let score = 0;
  let highscore = 0;

  let snakeUpdateSlowRate = 0;
  let inputQueue: string[] = ['RIGHT'];

  let snake = {
    x: 16,
    y: 16,
    
    // snake velocity. moves one grid length every frame in either the x or y direction
    dx: 1,
    dy: 0,
    
    // keep track of all grids the snake body occupies
    cells: [] as Point[],
    
    // length of the snake. grows when eating an apple
    maxCells: 4
  };

  let apple = {
    x: 32,
    y: 32
  };

  const updateSnake = () => {
    snake.x += snake.dx;
    snake.y += snake.dy;

    if (snake.x < 0) {
      snake.x = GAME_DIMENSION.x;
    }
    else if (snake.x >= GAME_DIMENSION.x) {
      snake.x = 0;
    }

    if (snake.y < 8) {
      snake.y = GAME_DIMENSION.y;
    }
    else if (snake.y >= GAME_DIMENSION.y) {
      snake.y = 8;
    }

    snake.cells.unshift({
      x: snake.x,
      y: snake.y
    });

    if (snake.cells.length > snake.maxCells) {
      snake.cells.pop();
    }

    snake.cells.forEach(function(cell, index) {
      // snake ate apple
      if (cell.x === apple.x && cell.y === apple.y) {
        snake.maxCells++;

        score++;
        if (score > highscore) highscore++;
  
        // canvas is 400x400 which is 25x25 grids
        apple.x = getRandomInt(0, GAME_DIMENSION.x);
        apple.y = getRandomInt(8, GAME_DIMENSION.y);
      }
  
      // check collision with all cells after this one (modified bubble sort)
      for (var i = index + 1; i < snake.cells.length; i++) {
        
        // snake occupies same space as a body part. reset game
        if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
          saveHighscore();
          score = 0;

          snake.x = 16;
          snake.y = 16;
          snake.cells = [];
          snake.maxCells = 4;
          snake.dx = 1;
          snake.dy = 0;
  
          apple.x = getRandomInt(0, GAME_DIMENSION.x);
          apple.y = getRandomInt(8, GAME_DIMENSION.y);

          inputQueue = ['RIGHT'];
        }
      }
    });
  }

  const renderSnake = (game: Game) => {
    game.DrawPixel({ x: apple.x, y: apple.y }, COLOR.Dark);
    snake.cells.forEach(cell => {
      game.DrawPixel({ x: cell.x, y: cell.y }, COLOR.Dark);
    });
  }

  // People's codes end here

  const loadHighscore = () => {
    highscore = Number(localStorage.getItem('snake::highscore') ?? '0');
  }

  const saveHighscore = () => {
    localStorage.setItem('snake::highscore', highscore.toString());
  }

  const renderNumber = (game: Game, pos: Point, num: number) => {
    let numArr = num.toString().padStart(4, '0').split('').map((v) => parseInt(v));
    numArr.forEach((num, a) => {
      game.DrawDMap(cast(DRAWMAP.numbers[num]), { x: pos.x + (a * 4) , y: pos.y });
    });
  }

  Game.Instance = new Game();
  window.__3310F_GAME = Game.Instance;

  Game.Instance.Initialize = () => {
    loadHighscore();
  }

  Game.Instance.Renderer = (game: Game) => {
    renderSnake(game);

    renderNumber(game, { x: 68, y: 1 }, score);
    renderNumber(game, { x: 1, y: 1 }, highscore);

    for(let i = 0; i < GAME_DIMENSION.x; i++) {
      game.DrawPixel({ x: i, y: 7 }, COLOR.Dark);
    }
  }

  Game.Instance.Update = (game: Game) => {
    const lastInputQueue = inputQueue[inputQueue.length - 1];
    if (game.input.IsPressed('UP')) {
      if (!['UP', 'DOWN'].includes(lastInputQueue)) inputQueue.push('UP');
    }
    else if (game.input.IsPressed('DOWN')) {
      if (!['UP', 'DOWN'].includes(lastInputQueue)) inputQueue.push('DOWN');
    }
    else if (game.input.IsPressed('LEFT')) {
      if (!['LEFT', 'RIGHT'].includes(lastInputQueue)) inputQueue.push('LEFT');
    }
    else if (game.input.IsPressed('RIGHT')) {
      if (!['LEFT', 'RIGHT'].includes(lastInputQueue)) inputQueue.push('RIGHT');
    }

    if (++snakeUpdateSlowRate > 12) {
      const enquedKey = inputQueue.shift();
      if (enquedKey === 'UP') {
        if (snake.dy === 0) {
          snake.dy = -1;
          snake.dx = 0;
        }
      }
      else if (enquedKey === 'DOWN') {
        if (snake.dy === 0) {
          snake.dy = 1;
          snake.dx = 0;
        }
      }
      else if (enquedKey === 'LEFT') {
        if (snake.dx === 0) {
          snake.dx = -1;
          snake.dy = 0;
        }
      }
      else if (enquedKey === 'RIGHT') {
        if (snake.dx === 0) {
          snake.dx = 1;
          snake.dy = 0;
        }
      }
      updateSnake();
      snakeUpdateSlowRate = 0;
    }
  }

  Game.Instance.Init();

  window.onunload = () => {
    window.__3310F_GAME.Unload();
  }
}
app();
