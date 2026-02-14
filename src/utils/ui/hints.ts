const hints = [
  "Keyboard arrow keys get you done faster.",
  "Plastic fills and kills the turtle faster.",
  "Eat fish, crabs and shrimp to earn points!",
  "Sign up with Google to compete with your friends!",
  "Loggerhead turtles can lay up to 5 nests in one season!",
  "Read the level description before starting a level.",
  "Logged-in players, can return to a game they exited any time.",
];

export const showRandomHint = () => {
  const index = Math.floor(Math.random() * hints.length);
  const span = document.getElementById("hint");
  span.innerText = hints[index];
};
