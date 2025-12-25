import TabPill from "../../webComponents/tabs/TabPill";

export const setupTabPills = (group: string) => {
  const tabPills = document.querySelectorAll(
    `tab-pill[name="${group}"]`,
  ) as NodeListOf<TabPill>;
  tabPills.forEach((pill) =>
    pill.addEventListener("click", () => {
      tabPills.forEach((p) => (p.isActive = false));
      pill.isActive = true;
    }),
  );
};
