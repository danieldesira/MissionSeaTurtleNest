import { game } from "../../singletons/Game";
import type MenuItem from "../../webComponents/mainMenu/MenuItem";

const menuOptions: Record<number, string> = {
  1: "continueGameBtn",
  2: "newGameBtn",
  3: "instructionsBtn",
};

export const setupMainMenuKeyboardNavigation = () => {
  let currentKey = isContinueGameVisible() ? 1 : 2;

  setFocusedMenuItem(currentKey);

  document.addEventListener("keydown", (event) => {
    const minItemKey = isContinueGameVisible() ? 1 : 2;
    const maxItemKey = Math.max(
      ...Object.keys(menuOptions).map((k) => parseInt(k)),
    );
    if (!game.isGameScreenActive) {
      switch (event.key) {
        case "ArrowUp":
          if (currentKey > minItemKey) {
            currentKey--;
          }
          break;
        case "ArrowDown":
          if (currentKey < maxItemKey) {
            currentKey++;
          }
          break;
        case "Enter":
          event.preventDefault();
          event.stopPropagation();
          triggerSelectedMenuItem(menuOptions[currentKey]);
          break;
      }

      setFocusedMenuItem(currentKey);
    }
  });
};

const triggerSelectedMenuItem = (id: string) => {
  const item = document.getElementById(id) as MenuItem;
  if (item.isVisible) {
    item.click();
  }
};

const setFocusedMenuItem = (selectedKey: number) => {
  const menuItems = document.querySelectorAll("menu-item");
  menuItems.forEach((item: MenuItem) => {
    if (item.id === menuOptions[selectedKey]) {
      item.applyFocus();
    } else {
      item.removeFocus();
    }
  });
};

const isContinueGameVisible = () => {
  const item = document.getElementById(menuOptions[1]) as MenuItem;
  return item.isVisible;
};
