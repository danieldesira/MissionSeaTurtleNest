import { useDispatch, useSelector } from "react-redux";
import Dialog from "../dialog/Dialog";
import { authenticate } from "../../features/authentication/authenticationReducer";
import { login } from "../../services/api";
import {
  getLastGameLocalStorage,
  getLastGameTimestampLocalStorage,
  saveLastGameLocalStorage,
  saveLastGameTimestampLocalStorage,
} from "../../utils/lastGameLocalStorage";
import { LoginResponse } from "../../services/interfaces";
import {
  setPersonalBest,
  setProfile,
} from "../../features/gameState/gameStateReducer";
import { useEffect, useState } from "react";
import RootState from "../../features/RootState";
import LoadingOverlay from "../LoadingOverlay";

type Props = {
  setShowLogin: React.Dispatch<React.SetStateAction<boolean>>;
};

const LoginDialog = ({ setShowLogin }: Props) => {
  const dispatch = useDispatch();

  const isAuthenticated = useSelector(
    (state: RootState) => state.authentication.isAuthenticated
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const showAuthError = () =>
    setError(
      "Failed to login! Please contact us at turtle.quest.web@gmail.com"
    );

  const storeAccountGameDataLocally = (accountData: LoginResponse) => {
    saveLastGameLocalStorage(JSON.stringify(accountData.lastGame));
    saveLastGameTimestampLocalStorage(accountData.player.last_game_saved_on);
  };

  const checkGameData = (accountData: LoginResponse) => {
    if (accountData.lastGame) {
      const locallySavedGame = getLastGameLocalStorage();
      const localTimestamp = getLastGameTimestampLocalStorage();
      if (locallySavedGame && localTimestamp) {
        if (Number(localTimestamp) <= accountData.player.last_game_saved_on) {
          storeAccountGameDataLocally(accountData);
        }
      } else {
        storeAccountGameDataLocally(accountData);
      }
    }
  };

  const checkPersonalBest = (accountData: LoginResponse) => {
    const { personalBest } = accountData;
    if (personalBest) {
      dispatch(setPersonalBest({ personalBest }));
    }
  };

  const handleClose = () => setShowLogin(false);

  const handleGoogleResponse = async ({
    credential,
  }: {
    credential: string;
  }) => {
    try {
      setIsLoading(true);

      const loginResult = await login(credential);

      if (loginResult.player) {
        dispatch(setProfile({ profile: loginResult.player }));
        dispatch(authenticate());
      } else {
        showAuthError();
      }

      checkGameData(loginResult);
      checkPersonalBest(loginResult);

      handleClose();
    } catch {
      showAuthError();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    window.google?.accounts?.id?.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: handleGoogleResponse,
    });

    window.google?.accounts?.id?.renderButton(
      document.getElementById("googleSignInButton"),
      { theme: "outline", size: "large" }
    );
  }, [isAuthenticated]);

  return (
    <Dialog title="Login" handleOk={handleClose}>
      <div className="flex flex-col justify-center items-center gap-3">
        <div id="googleSignInButton"></div>
      </div>
      <span className="font-light italic text-center text-sm">
        Or continue without logging in...
      </span>
      {isLoading && <LoadingOverlay message="Loading account data" />}
      {error && (
        <Dialog title="Error" type="error">
          {error}
        </Dialog>
      )}
    </Dialog>
  );
};

export default LoginDialog;
