const musicTracks = [
  "/music/the-turtle-burped-209197.mp3",
  "/music/the-diving-turtle-273012.mp3",
];

let currentTrackIndex = 0;
const audioContext = new AudioContext();
const gainNode = audioContext.createGain();
gainNode.connect(audioContext.destination);

const loadTrack = async (url: string) => {
  const res = await fetch(url);
  const arrayBuffer = await res.arrayBuffer();
  return audioContext.decodeAudioData(arrayBuffer);
};

const playTrack = (buffers: AudioBuffer[]) => {
  const bufferSource = new AudioBufferSourceNode(audioContext, {
    buffer: buffers[currentTrackIndex],
  });
  bufferSource.connect(gainNode);

  bufferSource.onended = () => {
    bufferSource.disconnect();

    currentTrackIndex = (currentTrackIndex + 1) % buffers.length;
    playTrack(buffers);
  };

  bufferSource.start();
};

export const setupMusic = async () => {
  const buffers = await Promise.all(musicTracks.map(loadTrack));

  document.body.addEventListener(
    "click",
    async () => {
      if (audioContext.state === "suspended") {
        await audioContext.resume();
      }

      playTrack(buffers);
    },
    {
      once: true,
    },
  );

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      audioContext.suspend();
    } else if (audioContext.state === "suspended") {
      audioContext.resume();
    }
  });
};
