import { Dispatch, SetStateAction, useState } from "react";
import FormDialog from "../../dialog/FormDialog";
import { Input } from "../../dialog/types";
import { updateSettings } from "../../../services/api";
import { useDispatch, useSelector } from "react-redux";
import RootState from "../../../features/RootState";
import { setSettings } from "../../../features/gameState/gameStateReducer";
import Dialog from "../../dialog/Dialog";

type Props = {
  showDialog: boolean;
  setShowDialog: Dispatch<SetStateAction<boolean>>;
};

const Settings = ({ showDialog, setShowDialog }: Props) => {
  const dispatch = useDispatch();

  const settings = useSelector(
    (state: RootState) => state.game.profile.value.settings
  );
  const [error, setError] = useState<string>("");

  const settingsConfig: Input[] = [
    {
      label: "Control Position",
      name: "controlPosition",
      type: "radio",
      options: ["Left", "Right"],
      value: settings.controlPosition,
    },
  ];

  const handleSettingChange = (event: React.ChangeEvent) => {
    const { name, value } = event.target as HTMLInputElement;
    dispatch(setSettings({ settings: { ...settings, [name]: value } }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setShowDialog(false);
    setError("");

    try {
      await updateSettings(settings);
    } catch {
      setError("Failed to save settings! Please try again.");
    }
  };

  return showDialog ? (
    <>
      <FormDialog
        title="Settings"
        inputs={settingsConfig}
        handleInputChange={handleSettingChange}
        handleSubmit={handleSubmit}
      />
      {error && (
        <Dialog title="Error" type="error">
          {error}
        </Dialog>
      )}
    </>
  ) : null;
};

export default Settings;
