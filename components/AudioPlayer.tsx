import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, Download, Volume2, RotateCcw, Music, Equalizer } from 'lucide-react';

interface AudioPlayerProps {
  audioUrl: string | null;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioUrl }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      setProgress(0);
      // Removed autoplay logic since we now stream audio during generation
    }
  }, [audioUrl]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const total = audioRef.current.duration;
      setProgress((current / total) * 100);
      setDuration(total);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setProgress(100);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      const seekTime = (parseFloat(e.target.value) / 100) * duration;
      audioRef.current.currentTime = seekTime;
      setProgress(parseFloat(e.target.value));
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!audioUrl) return null;

  return (
    <div className="mt-8 glass-panel-dark rounded-[2rem] p-6 md:p-8 text-white shadow-2xl shadow-indigo-900/40 animate-fade-in-up relative overflow-hidden group border border-white/10">
        
        {/* Dynamic Background */}
        <div className={`absolute top-0 right-0 w-80 h-80 bg-fuchsia-500 rounded-full mix-blend-overlay filter blur-[80px] opacity-20 -translate-y-1/2 translate-x-1/3 pointer-events-none transition-transform duration-[4s] ${isPlaying ? 'scale-125' : 'scale-100'}`}></div>
        <div className={`absolute bottom-0 left-0 w-80 h-80 bg-indigo-500 rounded-full mix-blend-overlay filter blur-[80px] opacity-20 translate-y-1/3 -translate-x-1/3 pointer-events-none transition-transform duration-[4s] ${isPlaying ? 'scale-125' : 'scale-100'}`}></div>

        <audio
            ref={audioRef}
            src={audioUrl}
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleEnded}
            onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 relative z-10">
            <div className="flex items-center gap-5">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg shadow-black/20 relative overflow-hidden`}>
                     <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-fuchsia-600"></div>
                     {isPlaying ? (
                        <div className="flex items-end justify-center gap-1 h-6 w-6 z-10">
                             <div className="w-1 bg-white/90 rounded-t-sm animate-[pulse_0.6s_ease-in-out_infinite] h-3"></div>
                             <div className="w-1 bg-white/90 rounded-t-sm animate-[pulse_0.8s_ease-in-out_infinite] h-5"></div>
                             <div className="w-1 bg-white/90 rounded-t-sm animate-[pulse_0.5s_ease-in-out_infinite] h-2"></div>
                             <div className="w-1 bg-white/90 rounded-t-sm animate-[pulse_0.7s_ease-in-out_infinite] h-4"></div>
                        </div>
                     ) : (
                        <Music size={24} className="text-white z-10" />
                     )}
                </div>
                <div>
                    <h3 className="font-bold text-xl leading-tight text-white mb-1">Generated Audio</h3>
                    <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                        <p className="text-xs text-indigo-200 font-semibold uppercase tracking-wider">Ready for playback</p>
                    </div>
                </div>
            </div>
            
            <a 
                href={audioUrl} 
                download="vocalize-ai-speech.wav"
                className="flex items-center justify-center gap-2 text-xs font-bold bg-white/10 hover:bg-white/20 hover:scale-105 active:scale-95 border border-white/10 px-5 py-3 rounded-xl transition-all duration-200 backdrop-blur-md shadow-lg shadow-black/10"
            >
                <Download size={16} />
                <span>Download WAV</span>
            </a>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-6 relative z-10">
            <button 
                onClick={togglePlay}
                className="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-b from-white to-slate-200 text-indigo-900 hover:scale-110 hover:shadow-xl hover:shadow-white/20 transition-all active:scale-95 z-20"
            >
                {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
            </button>
            
            <div className="flex-1 space-y-3">
                <div className="relative h-2.5 group/slider cursor-pointer">
                    {/* Track Background */}
                    <div className="absolute w-full h-full bg-slate-700/50 rounded-full overflow-hidden backdrop-blur-sm border border-white/5"></div>
                    
                    {/* Progress Fill */}
                    <div 
                        className="absolute h-full bg-gradient-to-r from-violet-400 via-fuchsia-400 to-white rounded-full pointer-events-none shadow-[0_0_10px_rgba(232,121,249,0.5)]" 
                        style={{ width: `${progress}%` }}
                    ></div>
                    
                    {/* Thumb */}
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={progress || 0}
                        onChange={handleSeek}
                        className="absolute w-full h-full opacity-0 cursor-pointer z-30"
                    />
                     <div 
                        className="absolute h-5 w-5 bg-white rounded-full shadow-lg shadow-black/30 -top-1.5 -ml-2.5 pointer-events-none transition-transform duration-100 group-hover/slider:scale-125 z-20 border-2 border-fuchsia-100"
                         style={{ left: `${progress}%` }}
                    ></div>
                </div>
                
                <div className="flex justify-between text-xs font-semibold text-indigo-300 font-mono tracking-wide">
                    <span>{formatTime(audioRef.current?.currentTime || 0)}</span>
                    <span>{formatTime(duration)}</span>
                </div>
            </div>

             <button 
                onClick={() => {
                    if (audioRef.current) {
                        audioRef.current.currentTime = 0;
                        if (!isPlaying) {
                            audioRef.current.play();
                            setIsPlaying(true);
                        }
                    }
                }}
                className="p-3 rounded-full text-indigo-300 hover:text-white hover:bg-white/10 transition-all"
                title="Replay"
            >
                <RotateCcw size={20} />
            </button>
        </div>
    </div>
  );
};

export default AudioPlayer;