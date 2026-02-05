import {
  hideAssetLoadingOverlay,
  showAssetLoadingOverlay,
  updateAssetLoadingProgressBar,
} from "./ui/staticAssetsLoadingOverlay";
import { showErrorNotice } from "./ui/waitingNotice";
import {
  ogg as oggTotalSize,
  mp3 as mp3TotalSize,
} from "./musicTotalSizeByFormat.json";

const isOggSupported = new Audio().canPlayType('audio/ogg; codecs="opus"');

const totalBytes = isOggSupported ? oggTotalSize : mp3TotalSize;

const musicTracks = [
  "/music/the-diving-turtle-273012",
  "/music/sea-396080",
  "/music/ocean-vibes-391210",
  "/music/10-minutes-submarine-underwater-ambient-sound-155046",
  "/music/tropical-beach-cinematic-beach-tropical-music-waves-drum-synth-nature-mastered-10079",
];

let currentTrackIndex = 0;
const audioContext = new AudioContext();
export const audioGainNode = audioContext.createGain();
audioGainNode.connect(audioContext.destination);

const pickMusicUrl = (base: string) =>
  isOggSupported ? `${base}.ogg` : `${base}.mp3`;

const loadTrack = async (url: string) => {
  const res = await fetch(url);
  const arrayBuffer = await res.arrayBuffer();
  updateAssetLoadingProgressBar((arrayBuffer.byteLength / totalBytes) * 100);
  return audioContext.decodeAudioData(arrayBuffer);
};

const loadAllTracks = async () => {
  showAssetLoadingOverlay("Loading music...");
  try {
    return await Promise.all(musicTracks.map(pickMusicUrl).map(loadTrack));
  } catch {
    showErrorNotice("Failed to load music tracks.", 500);
  } finally {
    hideAssetLoadingOverlay();
  }
};

const playTrack = (buffers: AudioBuffer[]) => {
  const bufferSource = new AudioBufferSourceNode(audioContext, {
    buffer: buffers[currentTrackIndex],
  });
  bufferSource.connect(audioGainNode);

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
