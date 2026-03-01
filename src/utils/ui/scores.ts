import { levelExists } from "../../levels/levels";
import { fetchHighScores } from "../../services/api";
import { personalBestStore } from "../../inMemoryStores/PersonalBestStore";
import type PrettyDialog from "../../webComponents/dialog/PrettyDialog";
import type PrettyButton from "../../webComponents/form/PrettyButton";
import { deleteChildren } from "./ui";
import { hideWaitingNotice, showErrorNotice } from "./waitingNotice";
import { profileStore } from "../../inMemoryStores/ProfileStore";
import { $id } from "./domQuery";

export const formatLevel = (levelNo: number) =>
  levelExists(levelNo) ? levelNo.toString() : "";

export const setupScoresDialog = () => {
  const scoresDialog = $id("scoresDialog") as PrettyDialog;
  const scoresBtn = $id("scoresBtn") as PrettyButton;

  scoresBtn.on("click", async () => {
    scoresDialog.open();
    await populateLeaderBoard();
  });

  scoresDialog.closeButtonIds = ["closeScoresBtn"];
};

export const updatePersonalBestPlaceholders = () => {
  const levelPlaceholder = $id("personalBestLevel");
  levelPlaceholder.innerText = formatLevel(personalBestStore.level);

  const pointsPlaceholder = $id("personalBestPoints");
  pointsPlaceholder.innerText = personalBestStore.points.toString();

  const durationPlaceholder = $id("personalBestDuration");
  durationPlaceholder.innerText = formatDuration(personalBestStore.duration);

  const resetsPlaceholder = $id("personalBestResets");
  resetsPlaceholder.innerText = personalBestStore.resetsUsed.toString();

  const outcomePlaceholder = $id("personalBestOutcome");
  outcomePlaceholder.innerText = personalBestStore.outcome;
};

const populateLeaderBoard = async () => {
  const leaderboardContainer = $id("leaderboard");
  const loadingLeaderboardSpan = $id("loadingLeaderboard");

  leaderboardContainer.classList.add("hidden");
  leaderboardContainer.classList.remove("flex");
  loadingLeaderboardSpan.classList.remove("hidden");

  try {
    const highScores = await fetchHighScores();

    leaderboardContainer.classList.remove("hidden");
    leaderboardContainer.classList.add("flex");
    loadingLeaderboardSpan.classList.add("hidden");

    const leaderboardTbody = $id("leaderboardTbody");
    deleteChildren(leaderboardTbody);

    highScores.forEach(
      ({
        playerProfilePicUrl,
        playerName,
        level,
        points,
        outcome,
        playerIdentifier,
        duration,
        resetsUsed,
      }) => {
        const row = document.createElement("tr");
        row.classList.add("font-semibold", "text-sm");
        appendImageCell(row, playerProfilePicUrl);
        appendCell(row, playerName);
        appendCell(row, formatLevel(level), "right");
        appendCell(row, points.toString(), "right");
        appendCell(row, outcome, "center");
        appendCell(row, formatDuration(duration), "right");
        appendCell(row, resetsUsed.toString(), "right");
        leaderboardTbody.appendChild(row);

        if (profileStore.playerIdentifier === playerIdentifier) {
          row.classList.add("bg-primary", "text-white");
        }
      },
    );
  } catch {
    showErrorNotice("Failed to load high scores", 500);
  } finally {
    hideWaitingNotice();
  }
};

const appendCell = (
  row: HTMLTableRowElement,
  value: string,
  alignment: "left" | "right" | "center" = "left",
) => {
  const cell = document.createElement("td");
  cell.classList.add("py-4", "px-1");
  switch (alignment) {
    case "center":
      cell.classList.add("text-center");
      break;
    case "right":
      cell.classList.add("text-right");
      break;
  }
  cell.innerText = value;
  row.appendChild(cell);
};

const appendImageCell = (row: HTMLTableRowElement, url: string) => {
  const cell = document.createElement("td");
  if (url) {
    const img = document.createElement("img");
    img.classList.add("w-10", "h-10", "rounded-sm");
    img.src = url;
    img.addEventListener("error", () => img.classList.add("hidden"));
    cell.appendChild(img);
  }
  row.appendChild(cell);
};

const formatDuration = (duration: number) =>
  `${Math.floor(duration / 60)}m ${duration % 60}s`;
