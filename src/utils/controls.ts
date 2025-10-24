import Game from "../singletons/Game";

export const setupKeyboardControls = () => {
  document.addEventListener("keydown", (event: KeyboardEvent) => {
    if (!Game.instance.isPaused) {
      const upKeys = ["w", "W", "ArrowUp"];
      const downKeys = ["s", "S", "ArrowDown"];
      const leftKeys = ["a", "A", "ArrowLeft"];
      const rightKeys = ["d", "D", "ArrowRight"];

      const mainCharacter = Game.instance.turtle;

      handleKeyGroup(upKeys, () => mainCharacter.moveUp(), event.key);
      handleKeyGroup(downKeys, () => mainCharacter.moveDown(), event.key);
      handleKeyGroup(leftKeys, () => mainCharacter.moveLeft(), event.key);
      handleKeyGroup(rightKeys, () => mainCharacter.moveRight(), event.key);
    }
  });

  const handleKeyGroup = (
    keyGroup: Array<string>,
    action: Function,
    pressedKey: string
  ) => {
    if (keyGroup.includes(pressedKey)) {
      // Call the method 3 times to make up for slower triggering of keyboard events
      action();
      action();
      action();
    }
  };
};

export const setupMouseWheelControls = () => {
  const canvas = document.getElementById("gameCanvas");
  canvas.addEventListener("wheel", (event: WheelEvent) => {
    event.preventDefault();

    if (!Game.instance.isPaused) {
      const mainCharacter = Game.instance.turtle;
      if (event.deltaX < 0) {
        mainCharacter.moveLeft();
      }
      if (event.deltaX > 0) {
        mainCharacter.moveRight();
      }
      if (event.deltaY < 0) {
        mainCharacter.moveUp();
      }
      if (event.deltaY > 0) {
        mainCharacter.moveDown();
      }
    }
  });
};
