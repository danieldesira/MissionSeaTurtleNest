type SocialIcon = {
  url: string;
  tooltip: string;
};

export const socials: Record<string, SocialIcon> = {
  github: {
    url: "https://github.com/danieldesira/TurtleQuest",
    tooltip: "Fork us on Github",
  },
  instagram: {
    url: "https://www.instagram.com/turtlequest.webgame/",
    tooltip: "Follow us on Instagram",
  },
  youtube: {
    url: "https://www.youtube.com/@SeaTurtleQuestGame",
    tooltip: "Subscribe to our YouTube channel",
  },
};

const getSocialKey = (value: string) =>
  Object.keys(socials).find((key) => value.includes(`_${key}_`));

export const setupSocialButtons = () => {
  const anchors = document.getElementsByTagName("a");
  for (const a of anchors) {
    const key = getSocialKey(a.href);
    if (key) {
      a.href = socials[key].url;
      a.title = socials[key].tooltip;
    }
  }
};
