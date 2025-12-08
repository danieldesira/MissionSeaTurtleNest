import { launchLevelStartDialog } from "../utils/ui/gameplay";

export const setupNewLevelEventHandler = () =>
  document.addEventListener("newLevel", ({ detail }: CustomEventInit) =>
    launchLevelStartDialog(detail.level)
  );
