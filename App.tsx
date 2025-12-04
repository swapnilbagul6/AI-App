import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import VoiceSelector from './components/VoiceSelector';
import TextEditor from './components/TextEditor';
import AudioPlayer from './components/AudioPlayer';
import { Gender, Language } from './types';
import { VOICES } from './constants';
import { streamSpeech } from './services/geminiService';
import { pcmToWavBlob, base64ToFloat32 } from './utils/audio';

const App: React.FC = () => {
  const [text, setText] = useState<string>('');
  const [language, setLanguage] = useState<Language>(Language.ENGLISH);
  const [gender, setGender] = useState<Gender | 'All'>('All');
  const [voiceId, setVoiceId] = useState<string>(VOICES[0].id);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // When gender filter changes, ensure selected voice is valid
  useEffect(() => {
    const selectedVoice = VOICES.find(v => v.id === voiceId);
    if (gender !== 'All' && selectedVoice?.gender !== gender) {
      const firstValid = VOICES.find(v => v.gender === gender);
      if (firstValid) {
        setVoiceId(firstValid.id);
      }
    }
  }, [gender, voiceId]);

  const handleGenerate = async () => {
    if (!text.trim()) return;

    setIsLoading(true);
    setError(null);
    setAudioUrl(null);

    // Initialize AudioContext for streaming playback
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    const audioCtx = new AudioContext({ sampleRate: 24000 });
    let nextStartTime = audioCtx.currentTime;
    const chunks: string[] = [];

    try {
      const stream = await streamSpeech(text, voiceId, language);
      
      for await (const chunk of stream) {
        // Collect chunk for final download
        chunks.push(chunk);

        // Decode and play immediately
        const float32Data = base64ToFloat32(chunk);
        const buffer = audioCtx.createBuffer(1, float32Data.length, 24000);
        buffer.getChannelData(0).set(float32Data);
        
        const source = audioCtx.createBufferSource();
        source.buffer = buffer;
        source.connect(audioCtx.destination);
        
        // Schedule next chunk
        if (nextStartTime < audioCtx.currentTime) {
            nextStartTime = audioCtx.currentTime;
        }
        source.start(nextStartTime);
        nextStartTime += buffer.duration;
      }
      
      // Generation complete: Create full WAV blob for download/replay
      if (chunks.length > 0) {
        const wavBlob = pcmToWavBlob(chunks);
        const url = URL.createObjectURL(wavBlob);
        setAudioUrl(url);
      }

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to generate speech. Please try again.");
    } finally {
      setIsLoading(false);
      // We don't close the audioCtx immediately so the tail of the audio can finish playing,
      // but eventually garbage collection or a new context will handle it.
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header />
      
      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-10 md:py-16">
        <div className="mb-12 text-center space-y-6">
            <h2 className="text-5xl md:text-6xl font-extrabold tracking-tight text-white drop-shadow-sm">
              <span className="block mb-2 text-slate-100">Voice your thoughts</span> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-indigo-400 animate-gradient">with AI Precision</span>
            </h2>
            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium">
                Transform text into lifelike speech instantly. <br className="hidden md:block"/>Support for multiple languages with high-fidelity neural voices.
            </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
           {/* Sidebar Controls */}
           <div className="lg:col-span-4 lg:sticky lg:top-28 space-y-6">
              <VoiceSelector
                selectedLanguage={language}
                onLanguageChange={setLanguage}
                selectedGender={gender}
                onGenderChange={setGender}
                selectedVoiceId={voiceId}
                onVoiceChange={setVoiceId}
              />
           </div>

           {/* Main Content Area */}
           <div className="lg:col-span-8 space-y-8 flex flex-col h-full">
              <TextEditor
                  text={text}
                  setText={setText}
                  language={language}
                  onGenerate={handleGenerate}
                  isLoading={isLoading}
              />

              {error && (
                  <div className="bg-red-950/40 backdrop-blur-sm text-red-200 p-4 rounded-2xl border border-red-500/20 flex items-center gap-3 animate-pulse shadow-sm">
                      <div className="bg-red-500/20 p-2 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="font-medium">{error}</span>
                  </div>
              )}
              
              {/* Show player if we have a URL OR if we are currently streaming (loading) to act as visual feedback */}
              {(audioUrl || isLoading) && (
                <div className={isLoading ? "opacity-75 pointer-events-none" : ""}>
                   <AudioPlayer audioUrl={audioUrl || ""} />
                   {isLoading && (
                     <div className="mt-2 text-center text-sm font-bold text-fuchsia-400 animate-pulse">
                        Streaming audio in real-time...
                     </div>
                   )}
                </div>
              )}
           </div>
        </div>
      </main>

      <footer className="py-8 text-center text-sm text-slate-500 border-t border-white/5 bg-slate-950/40 backdrop-blur-md mt-auto">
        <p className="font-semibold">&copy; {new Date().getFullYear()} Vocalize AI. Built with Gemini 2.5 Flash API.</p>
      </footer>
    </div>
  );
};

export default App;