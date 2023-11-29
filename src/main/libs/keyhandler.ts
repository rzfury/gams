import { KeyEventHandler } from "../../types";

type KeyHandleState = {
  registeredKey: string,
  justPressed: boolean,
  pressed: boolean
}

class KeyHandler {
  public state: { [key: string]: KeyHandleState } = {
    UP: {
      registeredKey: 'ArrowUp',
      justPressed: false,
      pressed: false
    },
    DOWN: {
      registeredKey: 'ArrowDown',
      justPressed: false,
      pressed: false
    },
    LEFT: {
      registeredKey: 'ArrowLeft',
      justPressed: false,
      pressed: false
    },
    RIGHT: {
      registeredKey: 'ArrowRight',
      justPressed: false,
      pressed: false
    },
    ESCAPE: {
      registeredKey: 'Escape',
      justPressed: false,
      pressed: false
    }
  };

  constructor(additionalDownHandle?: Optional<KeyEventHandler>, additionalUpHandle?: Optional<KeyEventHandler>) {
    window.addEventListener('keydown', (e) => {
      if (!e.ctrlKey) e.preventDefault();

      this.KeyDownHandle(e);
      additionalDownHandle && additionalDownHandle(e);
    });
    window.addEventListener('keyup', (e) => {
      if (!e.ctrlKey) e.preventDefault();

      this.KeyUpHandle(e);
      additionalUpHandle && additionalUpHandle(e);
    });
  }

  IsPressed(keyStateName: string) {
    const keyName = keyStateName.toUpperCase();
    if (this.state.hasOwnProperty(keyName)) {
      return this.state[keyName].pressed;
    }
    else {
      console.error(`"${keyStateName}" is undefined in keyState.`);
      return false;
    }
  }

  IsPressedOnce(keyStateName: string) {
    const keyName = keyStateName.toUpperCase();
    if (this.state.hasOwnProperty(keyName)) {
      const keyState = this.state[keyName];
      if (keyState.pressed && !keyState.justPressed) {
        keyState.justPressed = true;
        return true;
      }
      else {
        return false;
      }
    }
    else {
      console.error(`"${keyStateName}" is undefined in keyState.`);
      return false;
    }
  }

  KeyDownHandle(event: KeyboardEvent) {
    for (let key in this.state) {
      if (this.state[key].registeredKey == event.key) {
        this.state[key].pressed = true;
      }
    }
  }

  KeyUpHandle(event: KeyboardEvent) {
    for (let key in this.state) {
      if (this.state[key].registeredKey == event.key) {
        this.state[key].pressed = false;
        this.state[key].justPressed = false;
      }
    }
  }

  RegisterKey(keyStateName: string, keyCode: string) {
    const keyName = keyStateName.toUpperCase();
    if (this.state.hasOwnProperty(keyName)) {
      console.error(`"${keyStateName}" is already exists in keyState`);
      return false;
    }
    else {
      Object.assign(this.state, {
        [keyName]: {
          registeredKey: keyCode,
          justPressed: false,
          pressed: false
        }
      });
      return this.state[keyName];
    }
  }

  UnregisterKey(keyStateName: string) {
    const keyName = keyStateName.toUpperCase();
    if (this.state.hasOwnProperty(keyName)) {
      delete this.state[keyName];
    }
    else {
      console.error(`"${keyStateName}" is undefined on keyState.`);
    }
  }
}

export { KeyHandler };
