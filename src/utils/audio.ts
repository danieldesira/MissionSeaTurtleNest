import { hideOverlay, showOverlay } from "./ui/overlay";
import { showErrorNotice } from "./ui/waitingNotice";

const musicTracks = [
  "/music/the-diving-turtle-273012.mp3",
  "/music/sea-396080.mp3",
  "/music/ocean-vibes-391210.mp3",
  "/music/10-minutes-submarine-underwater-ambient-sound-155046.mp3",
  "/music/tropical-beach-cinematic-beach-tropical-music-waves-drum-synth-nature-mastered-10079.mp3",
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

const loadAllTracks = async () => {
  showOverlay("Loading music...");
  try {
    return await Promise.all(musicTracks.map(loadTrack));
  } catch {
    showErrorNotice("Failed to load music tracks.", 500);
  } finally {
    hideOverlay();
  }
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
  const buffers = await loadAllTracks();

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
