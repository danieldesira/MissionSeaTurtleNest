import Game from "../../singletons/Game";

export const updateXpSpan = () => {
  const xpSpan = document.getElementById("xpSpan");
  xpSpan.innerText = Game.instance.xp.toString();
};

export const showXpUpdateSpan = async (xp: number) => {
  const xpUpdateSpan = document.getElementById("xpUpdateSpan");
  xpUpdateSpan.innerText = `${xp > 0 ? "+" : "-"}${Math.abs(xp).toString()}`;
  xpUpdateSpan.classList.remove("hidden");
  xpUpdateSpan.classList.add(xp > 0 ? "text-green-500" : "text-danger");
  await new Promise((resolve) => setTimeout(resolve, 1000));
  xpUpdateSpan.classList.add("hidden");
  xpUpdateSpan.classList.remove("text-green-500", "text-danger");
};
