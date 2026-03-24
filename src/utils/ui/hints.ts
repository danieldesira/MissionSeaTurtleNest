import { $id } from "./domQuery";

const hints = [
  "Keyboard arrow keys get you done faster.",
  "Plastic fills and kills the turtle faster.",
  "Eat fish, crabs and shrimp to earn points!",
  "Sign up to compete with your friends!",
  "Loggerhead turtles may lay up to 5-6 nests in one season!",
  "Read the level description before starting a level.",
  "Logged-in players, can return to a game they exited any time.",
  "A typical nest may contain between 80 and 120 eggs.",
  "You may volunteer to help our turtles by contacting turtle.naturetrust@gmail.com",
  "You have up to 3 resets in the game.",
];

export const showRandomHint = () => {
  const index = Math.floor(Math.random() * hints.length);
  const span = $id("hint");
  span.innerText = hints[index];
};
