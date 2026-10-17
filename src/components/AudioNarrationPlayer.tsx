import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause, RotateCcw, FastForward, Check, Radio } from 'lucide-react';

interface AudioNarrationPlayerProps {
  title: string;
  textToRead: string;
  chapterNumber?: number;
}

export const AudioNarrationPlayer: React.FC<AudioNarrationPlayerProps> = ({
  title,
  textToRead,
  chapterNumber,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [rate, setRate] = useState<number>(1.0);
  const [progress, setProgress] = useState<number>(0);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (!('speechSynthesis' in window)) {
      setIsSupported(false);
      return;
    }

    // Stop speaking when chapter changes
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setProgress(0);

    return () => {
      window.speechSynthesis.cancel();
    };
  }, [title, textToRead]);

  const handleTogglePlay = () => {
    if (!isSupported) return;

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    window.speechSynthesis.cancel();

    // Prepare speech string
    const cleanText = textToRead
      .replace(/```[\s\S]*?```/g, ' Code snippet omitted for audio briefing. ')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/[#*_|]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    const fullAudioScript = `Chapter ${chapterNumber !== undefined ? chapterNumber : ''}: ${title}. Audio briefing begins. ${cleanText}. End of chapter briefing.`;

    const utterance = new SpeechSynthesisUtterance(fullAudioScript);
    utterance.rate = rate;
    utterance.pitch = 1.0;

    // Pick English voice if available
    const voices = window.speechSynthesis.getVoices();
    const naturalVoice = voices.find(
      (v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Daniel'))
    ) || voices.find((v) => v.lang.startsWith('en'));

    if (naturalVoice) {
      utterance.voice = naturalVoice;
    }

    utterance.onstart = () => {
      setIsPlaying(true);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setProgress(100);
    };

    utterance.onerror = (e) => {
      console.warn('Speech error:', e);
      setIsPlaying(false);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  const cycleSpeed = () => {
    const speeds = [1.0, 1.25, 1.5, 0.9];
    const currentIndex = speeds.indexOf(rate);
    const nextRate = speeds[(currentIndex + 1) % speeds.length];
    setRate(nextRate);

    if (isPlaying) {
      handleTogglePlay();
      setTimeout(handleTogglePlay, 100);
    }
  };

  if (!isSupported) return null;

  return (
    <div className="flex items-center gap-3 px-3.5 py-2 rounded-xl bg-neutral-900/90 border border-neutral-800 text-neutral-300">
      <div className="flex items-center gap-2">
        <button
          onClick={handleTogglePlay}
          className={`p-2 rounded-lg font-medium text-xs flex items-center gap-1.5 transition-all ${
            isPlaying
              ? 'bg-emerald-500 text-neutral-950 font-semibold shadow-lg shadow-emerald-500/20'
              : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200'
          }`}
          title={isPlaying ? 'Pause Chapter Audio' : 'Listen to Chapter Audio Briefing'}
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
          <span className="hidden sm:inline">{isPlaying ? 'Pause Audio' : 'Audio Briefing'}</span>
        </button>

        <button
          onClick={cycleSpeed}
          className="px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-[11px] font-mono text-neutral-300 transition-colors"
          title="Adjust Playback Speed"
        >
          {rate}x
        </button>
      </div>

      <div className="hidden md:flex items-center gap-2 text-xs text-neutral-400">
        <Radio className={`w-3.5 h-3.5 ${isPlaying ? 'text-emerald-400 animate-pulse' : 'text-neutral-500'}`} />
        <span className="truncate max-w-[200px]">
          {isPlaying ? `Narration: ${title}` : 'Listen hands-free while multitasking'}
        </span>
      </div>
    </div>
  );
};
