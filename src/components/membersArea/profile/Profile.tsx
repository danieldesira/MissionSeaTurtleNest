import { Dispatch, SetStateAction, useState } from "react";
import FormDialog from "../../dialog/FormDialog";
import { Input } from "../../dialog/types";
import { setProfile } from "../../../features/gameState/gameStateReducer";
import { useDispatch, useSelector } from "react-redux";
import RootState from "../../../features/RootState";
import { updateProfile, uploadProfilePicture } from "../../../services/api";
import LoadingOverlay from "../../LoadingOverlay";
import Dialog from "../../dialog/Dialog";

type Props = {
  showDialog: boolean;
  setShowDialog: Dispatch<SetStateAction<boolean>>;
};

const Profile = ({ showDialog, setShowDialog }: Props) => {
  const dispatch = useDispatch();

  const profile = useSelector((state: RootState) => state.game.profile.value);
  const [isUploadingPicture, setIsUploadingPicture] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const profileConfig: Input[] = [
    {
      label: "Profile Picture",
      name: "profile_picture",
      type: "imageUpload",
      value: profile.profile_pic_url,
      required: false,
      maxLength: 0,
      readonly: false,
    },
    {
      label: "Name",
      name: "name",
      type: "text",
      required: true,
      maxLength: 120,
      value: profile.name,
    },
    {
      label: "Email",
      name: "email",
      type: "email",
      maxLength: 120,
      value: profile.email,
      readonly: true,
    },
    {
      label: "Date of Birth",
      name: "date_of_birth",
      type: "date",
      required: true,
      value: profile.date_of_birth,
    },
  ];

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name === "profile_picture") {
      setError("");
      const file = event.target.files?.[0];
      if (file) {
        try {
          setIsUploadingPicture(true);
          const res = await uploadProfilePicture(file);
          if (res.profilePicUrl) {
            dispatch(
              setProfile({
                profile: { ...profile, profile_pic_url: res.profilePicUrl },
              })
            );
          }
        } catch {
          setError("Failed to upload profile picture. Try again later.");
        } finally {
          setIsUploadingPicture(false);
        }
      }
    } else {
      dispatch(setProfile({ profile: { ...profile, [name]: value } }));
    }
  };

  const handleSubmit = async () => {
    setShowDialog(false);

    try {
      await updateProfile({
        name: profile.name,
        date_of_birth: profile.date_of_birth,
      });
    } catch {
      setError("Failed to save player info! Please try again.");
    }
  };

  return (
    showDialog && (
      <>
        <FormDialog
          title="Profile"
          inputs={profileConfig}
          handleInputChange={handleChange}
          handleSubmit={handleSubmit}
        />
        {isUploadingPicture && (
          <LoadingOverlay message="Uploading profile picture..." />
        )}
        {error && (
          <Dialog title="Error" type="error">
            {error}
          </Dialog>
        )}
      </>
    )
  );
};

export default Profile;
