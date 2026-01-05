const musicTracks = [
  "/music/the-turtle-burped-209197.mp3",
  "/music/the-diving-turtle-273012.mp3",
];

const playCurrentTrack = (audio: HTMLAudioElement, index: number) => {
  audio.src = musicTracks[index];
  audio.play();
};

export const setupMusic = () => {
  const audio = new Audio();
  let arrayIndex = 0;
  playCurrentTrack(audio, arrayIndex);
  audio.addEventListener("pause", () => {
    if (arrayIndex < musicTracks.length - 1) {
      arrayIndex++;
    } else {
      arrayIndex = 0;
    }
    playCurrentTrack(audio, arrayIndex);
  });
};
