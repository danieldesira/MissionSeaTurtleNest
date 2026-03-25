import { game } from "../../singletons/Game";
import PrettyDialog from "../../webComponents/dialog/PrettyDialog";
import type MenuItem from "../../webComponents/mainMenu/MenuItem";
import { $, $id } from "./domQuery";

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
    if (!game.isGameScreenActive && !PrettyDialog.isAnyDialogOpen()) {
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
  const item = $id(id) as MenuItem;
  if (item.isVisible) {
    item.click();
  }
};

const setFocusedMenuItem = (selectedKey: number) => {
  const menuItems = $("menu-item");
  menuItems.forEach((item) => {
    if (item.id === menuOptions[selectedKey]) {
      (item as MenuItem).applyFocus();
    } else {
      (item as MenuItem).removeFocus();
    }
  });
};

const isContinueGameVisible = () => {
  const item = $id(menuOptions[1]) as MenuItem;
  return item.isVisible;
};
