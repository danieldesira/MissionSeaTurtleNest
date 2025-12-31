import { levelExists } from "../../levels/levels";
import { fetchHighScores } from "../../services/api";
import { personalBestStore } from "../../inMemoryStores/PersonalBestStore";
import PrettyDialog from "../../webComponents/dialog/PrettyDialog";
import PrettyButton from "../../webComponents/form/PrettyButton";
import { launchCustomDialog } from "./customDialog";
import { deleteChildren } from "./ui";
import { hideWaitingNotice } from "./waitingNotice";

export const formatLevelAsText = (levelNo: number) =>
  levelExists(levelNo) ? `Level ${levelNo}` : "Game Complete";

export const setupScoresDialog = () => {
  const scoresDialog = document.getElementById("scoresDialog") as PrettyDialog;
  const scoresBtn = document.getElementById("scoresBtn") as PrettyButton;

  scoresBtn.callback = async () => {
    scoresDialog.open();
    await populateLeaderBoard();
  };

  scoresDialog.closeButtonIds = ["closeScoresBtn"];
};

export const updatePersonalBestPlaceholders = () => {
  const levelPlaceholder = document.getElementById("personalBestLevel");
  levelPlaceholder.innerText = formatLevelAsText(personalBestStore.level);

  const pointsPlaceholder = document.getElementById("personalBestPoints");
  pointsPlaceholder.innerText = personalBestStore.points.toString();
};

const populateLeaderBoard = async () => {
  const leaderboardContainer = document.getElementById("leaderboard");
  const loadingLeaderboardSpan = document.getElementById("loadingLeaderboard");

  leaderboardContainer.classList.add("hidden");
  leaderboardContainer.classList.remove("flex");
  loadingLeaderboardSpan.classList.remove("hidden");

  try {
    const highScores = await fetchHighScores();

    leaderboardContainer.classList.remove("hidden");
    leaderboardContainer.classList.add("flex");
    loadingLeaderboardSpan.classList.add("hidden");

    const leaderboardTbody = document.getElementById("leaderboardTbody");
    deleteChildren(leaderboardTbody);

    highScores.forEach(
      ({ playerProfilePicUrl, playerName, level, points, outcome }) => {
        const row = document.createElement("tr");
        row.classList.add("font-semibold", "text-sm");
        appendImageCell(row, playerProfilePicUrl);
        appendCell(row, playerName);
        appendCell(row, formatLevelAsText(level), "right");
        appendCell(row, points.toString(), "right");
        appendCell(row, outcome, "center");
        leaderboardTbody.appendChild(row);
      }
    );
  } catch {
    launchCustomDialog("Leaderboard", "Failed to load high scores");
  } finally {
    hideWaitingNotice();
  }
};

const appendCell = (
  row: HTMLTableRowElement,
  value: string,
  alignment: "left" | "right" | "center" = "left"
) => {
  const cell = document.createElement("td");
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
  const img = document.createElement("img");
  img.classList.add("w-10", "h-10", "rounded-sm");
  img.src = url;
  cell.appendChild(img);
  row.appendChild(cell);
};
