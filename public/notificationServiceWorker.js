const a = self,
  n =
    location.hostname === "localhost"
      ? "https://subnodulous-kaelyn-matrimonially.ngrok-free.dev"
      : "https://tochange.com",
  s = async (t) =>
    await (
      await fetch(
        `${n}/api/subscription?appId=65033d73-3cdc-416d-9689-1b0b3e73cbad`,
        {
          method: "POST",
          headers: {
            "Accept-Content": "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(t),
        },
      )
    ).json();
a.addEventListener("activate", async () => {
  const t = await a.registration.pushManager.subscribe({
    userVisibleOnly: !0,
    applicationServerKey:
      "BJIUt7Pt_XgjUCatT8Vuu7Tyj0kVaT0t4OaUuWzdLtoINF95-LiI7LR0RzpIBRhmRTp0W9g2dI_OlWWy_OyMMgo",
  });
  await s(t);
});
