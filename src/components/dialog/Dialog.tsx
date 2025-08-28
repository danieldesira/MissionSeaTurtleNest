import { FaFloppyDisk } from "react-icons/fa6";
import DialogButton from "./DialogButton";
import { GiTurtleShell } from "react-icons/gi";

type Props = {
  title: string;
  handleOk?: () => void;
  type?: "default" | "error" | "form";
  handleSubmit?: React.FormEventHandler;
  buttons?: { label: string; action: () => void }[];
};

const Dialog = ({
  title,
  children,
  type = "default",
  handleOk,
  handleSubmit,
  buttons,
}: React.PropsWithChildren<Props>) => {
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape" && handleOk) {
      handleOk();
    }
  };

  return (
    title && (
      <dialog
        className="fixed inset-0 flex flex-col gap-2 items-center justify-center text-white w-4/5 opacity-80 focus:opacity-95 transition-opacity duration-500 bg-gray-900 p-5 rounded-3xl max-w-xl z-50"
        onKeyDown={handleKeyDown}
      >
        <div className="flex justify-center items-center gap-2 border-b-white border-b-2 pb-2">
          <GiTurtleShell />
          <h1 className="text-xl font-extrabold">{title}</h1>
        </div>
        <form
          action="#"
          method="post"
          className="flex flex-col gap-3 items-center w-full"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col w-11/12 gap-3 max-h-44 lg:max-h-full overflow-y-auto">
            {children}
          </div>
          <div className="flex gap-2">
            <DialogButton
              variant={type === "form" ? "default" : type}
              buttonType={type === "form" ? "submit" : "button"}
              handleClick={handleOk}
            >
              {type === "form" ? (
                <>
                  <FaFloppyDisk />
                  Save
                </>
              ) : (
                <>OK</>
              )}
            </DialogButton>
            {buttons &&
              buttons.map(({ label, action }, index) => (
                <DialogButton key={index} handleClick={action}>
                  {label}
                </DialogButton>
              ))}
          </div>
        </form>
      </dialog>
    )
  );
};

export default Dialog;
