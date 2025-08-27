import { useState } from "react";
import { fetchHighScores } from "../../services/api";
import { HighScore } from "../../services/interfaces";
import Dialog from "../dialog/Dialog";
import ScoreTable from "./ScoreTable";
import { useDispatch, useSelector } from "react-redux";
import RootState from "../../features/RootState";
import { getLevelText } from "../../levels/levels";

const LeaderBoard = () => {
  const dispatch = useDispatch();

  const [scores, setScores] = useState<HighScore[]>();
  const [showScoresDialog, setShowScoresDialog] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const personalBest = useSelector(
    (state: RootState) => state.game.personalBest.value
  );

  const handleViewScores = async () => {
    try {
      setScores(await fetchHighScores());
      setShowScoresDialog(true);
    } catch {
      setError("Error fetching high scores :( Please try again later");
    }
  };

  const closeHighScores = () => setShowScoresDialog(false);

  return (
    <div className="flex flex-col gap-1">
      <div className="text-sm">
        {personalBest?.points ? (
          <>
            Your best score: {personalBest.points} at level{" "}
            {getLevelText(personalBest.level)}
          </>
        ) : (
          <>Go make a name for yourself. Start a new game!</>
        )}
      </div>
      <button
        type="button"
        role="button"
        className="bg-slate-950 hover:bg-slate-800 transition-colors duration-500 rounded-sm p-1 text-white font-semibold"
        onClick={handleViewScores}
      >
        View High Scores
      </button>
      {showScoresDialog && (
        <Dialog title="High Scores" handleOk={closeHighScores}>
          <ScoreTable highScores={scores} />
        </Dialog>
      )}
      {error && (
        <Dialog title="High Scores" type="error">
          {error}
        </Dialog>
      )}
    </div>
  );
};

export default LeaderBoard;
