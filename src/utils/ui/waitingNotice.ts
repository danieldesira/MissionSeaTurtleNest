export const showWaitingNotice = (message: string) => {
  const waitingNotice = document.getElementById("waitingNotice");
  waitingNotice.innerText = message;
  waitingNotice.classList.remove("hidden", "text-white", "bg-danger");
  waitingNotice.classList.add("bg-green-600", "text-primary");
};

export const hideWaitingNotice = () => {
  const waitingNotice = document.getElementById("waitingNotice");
  waitingNotice.classList.add("hidden");
};

export const showErrorNotice = async (message: string, delay: number) => {
  const waitingNotice = document.getElementById("waitingNotice");
  waitingNotice.innerText = message;
  waitingNotice.classList.remove("hidden", "bg-green-600", "text-primary");
  waitingNotice.classList.add("bg-danger", "text-white");

  await new Promise((resolve) => setTimeout(resolve, delay));
  waitingNotice.classList.add("hidden");
};
