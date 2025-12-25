const s = self,
  a =
    location.hostname === "localhost"
      ? "https://localhost:32769"
      : "https://tochange.com",
  i = async (t) =>
    await (
      await fetch(
        `${a}/api/subscription?appId=65033d73-3cdc-416d-9689-1b0b3e73cbad`,
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
s.addEventListener("activate", async () => {
  const t = await s.registration.pushManager.subscribe({
    userVisibleOnly: !0,
    applicationServerKey:
      "BEfuj-su_7dqT40eFWTa4wh8FZDJ5oPUiu8AqxFQ260hZotE3i0ZH5B8Esc2J126zJgxLSEKSBRsrtFbKPXRo4Y",
  });
  await i(t);
});
