export const showWaitingNotice = (message: string) => {
  const waitingNotice = document.getElementById("waitingNotice");
  waitingNotice.innerText = message;
  waitingNotice.classList.remove("hidden");
};

export const hideWaitingNotice = () => {
  const waitingNotice = document.getElementById("waitingNotice");
  waitingNotice.classList.add("hidden");
};
