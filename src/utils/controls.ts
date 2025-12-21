import { game } from "../singletons/Game";

export const setupKeyboardControls = () => {
  document.addEventListener("keydown", (event: KeyboardEvent) => {
    if (!game.isPaused) {
      const upKeys = ["w", "W", "ArrowUp"];
      const downKeys = ["s", "S", "ArrowDown"];
      const leftKeys = ["a", "A", "ArrowLeft"];
      const rightKeys = ["d", "D", "ArrowRight"];

      const mainCharacter = game.turtle;

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
