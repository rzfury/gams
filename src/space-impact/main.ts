import { Point } from '../types';
import Game from '../main/libs/game';
import { COLOR, DRAWMAP, GAME_DIMENSION, cast } from '../main/libs/utils';
import './style.css';

declare global {
  interface Window {
    __3310F_GAME: Game;
  }
}

function app() {
  Game.Instance = new Game();
  window.__3310F_GAME = Game.Instance;

  Game.Instance.Initialize = () => {
    Game.Instance.input.RegisterKey('I', 'i');
  }

  Game.Instance.Renderer = (game: Game) => {

  }

  Game.Instance.Update = (game: Game) => {

    if (game.input.IsPressedOnce('I')) {
      game.invert = !game.invert;
    }
  }

  Game.Instance.Init();

  window.onunload = () => {
    window.__3310F_GAME.Unload();
  }
}
app();
