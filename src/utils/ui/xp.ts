import { game } from "../../singletons/Game";

export const updateXpSpan = () => {
  const xpSpan = document.getElementById("xpSpan");
  xpSpan.innerText = game.xp.toString();
};

export const showXpUpdate = async (xp: number) => {
  const xpUpdateContainer = document.getElementById("xpUpdateContainer");
  const xpUpdateSpan = document.createElement("span");
  xpUpdateSpan.innerText = `${xp > 0 ? "+" : "-"}${Math.abs(xp).toString()}`;
  xpUpdateSpan.classList.add(
    xp > 0 ? "text-green-500" : "text-danger",
    "font-bold",
    "text-4xl",
    "transition-opacity",
    "duration-500",
  );
  xpUpdateContainer.appendChild(xpUpdateSpan);
  xpUpdateSpan.addEventListener("transitionend", () =>
    xpUpdateContainer.removeChild(xpUpdateSpan),
  );
  await new Promise((resolve) => setTimeout(resolve, 500));
  xpUpdateSpan.classList.add("opacity-0");
};
