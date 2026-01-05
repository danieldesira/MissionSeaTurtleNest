const musicTracks = [
  "/music/the-turtle-burped-209197.mp3",
  "/music/the-diving-turtle-273012.mp3",
];

const loadTrack = async (audioContext: AudioContext, url: string) => {
  const res = await fetch(url);
  const arrayBuffer = await res.arrayBuffer();
  return audioContext.decodeAudioData(arrayBuffer);
};

const playTrack = (
  audioContext: AudioContext,
  buffers: AudioBuffer[],
  index: number
) => {
  const bufferSource = audioContext.createBufferSource();
  bufferSource.buffer = buffers[index];
  bufferSource.connect(audioContext.destination);

  bufferSource.addEventListener("ended", () => {
    playTrack(audioContext, buffers, (index + 1) % buffers.length);
  });

  bufferSource.start();
};

export const setupMusic = async () => {
  const audioContext = new AudioContext();

  const buffers = await Promise.all(
    musicTracks.map((url) => loadTrack(audioContext, url))
  );

  document.body.addEventListener(
    "click",
    () => {
      const arrayIndex = 0;
      playTrack(audioContext, buffers, arrayIndex);
    },
    { once: true }
  );
};
