import { KEYBOARD_MAP } from "./constants.js";

export class InputManager {
  constructor() {
    this.listeners = new Set();
    document.addEventListener("keydown", (event) => {
      const direction = KEYBOARD_MAP[event.code];
      if (direction) {
        event.preventDefault();
        this.emit(direction);
      }
    });
  }

  bindButtons(buttons) {
    buttons.forEach((btn) =>
      btn.addEventListener("click", () => {
        const direction = btn.dataset.direction;
        this.emit(direction);
        btn.blur();
      }),
    );
  }

  onDirectionChange(handler) {
    this.listeners.add(handler);
  }

  emit(direction) {
    this.listeners.forEach((handler) => handler(direction));
  }
}

