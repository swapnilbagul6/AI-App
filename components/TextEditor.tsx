import React from 'react';
import { X, Wand2, Sparkles, AlertCircle } from 'lucide-react';
import { Language } from '../types';
import { SAMPLE_TEXTS } from '../constants';

interface TextEditorProps {
  text: string;
  setText: (text: string) => void;
  language: Language;
  onGenerate: () => void;
  isLoading: boolean;
}

const TextEditor: React.FC<TextEditorProps> = ({
  text,
  setText,
  language,
  onGenerate,
  isLoading
}) => {
  const handleSampleClick = () => {
    setText(SAMPLE_TEXTS[language]);
  };

  return (
    <div className="flex flex-col h-full">
        <div className="glass-card rounded-[2rem] overflow-hidden shadow-2xl shadow-black/20 flex-1 flex flex-col transition-all duration-300 relative border border-white/10">
        
            {/* Toolbar */}
            <div className="flex items-center justify-between px-6 py-4 bg-white/5 backdrop-blur-sm border-b border-white/5">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-400 shadow-[0_0_10px_rgba(129,140,248,0.5)]"></span>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Input Text</span>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleSampleClick}
                        className="text-xs flex items-center gap-1.5 text-indigo-400 hover:text-white hover:bg-indigo-600 font-bold px-3 py-1.5 rounded-full transition-all duration-300 border border-indigo-500/30 hover:border-indigo-600 shadow-sm"
                    >
                        <Wand2 size={12} />
                        Auto-Fill
                    </button>
                    {text && (
                        <button
                        onClick={() => setText('')}
                        className="text-xs flex items-center gap-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 font-bold px-3 py-1.5 rounded-full transition-colors"
                        >
                        <X size={12} />
                        Clear
                        </button>
                    )}
                </div>
            </div>

            {/* Text Area */}
            <div className="relative flex-1 bg-transparent group">
                <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="What would you like me to say today?"
                className="w-full h-full p-6 md:p-8 resize-none focus:outline-none text-xl md:text-2xl text-slate-100 placeholder-slate-600 leading-relaxed bg-transparent font-medium"
                maxLength={2000}
                style={{ minHeight: '280px' }}
                />
                
                {/* Character Counter */}
                <div className="absolute bottom-4 right-6 pointer-events-none transition-all duration-300 opacity-50 group-focus-within:opacity-100">
                    <div className={`
                        flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-md border shadow-sm
                        ${text.length > 1900 
                            ? 'bg-red-950/50 text-red-400 border-red-900' 
                            : 'bg-slate-900/80 text-slate-500 border-white/5'
                        }
                    `}>
                        {text.length > 1900 && <AlertCircle size={12} />}
                        <span>{text.length} / 2000</span>
                    </div>
                </div>
            </div>
        </div>

        {/* Floating Action Button area */}
        <div className="mt-6 flex justify-end">
             <button
                onClick={onGenerate}
                disabled={!text.trim() || isLoading}
                className={`
                    group relative overflow-hidden rounded-2xl p-0.5 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 transition-all duration-300 active:scale-95
                    ${!text.trim() || isLoading
                        ? 'opacity-60 cursor-not-allowed grayscale' 
                        : 'hover:-translate-y-1 hover:shadow-2xl hover:shadow-fuchsia-600/30'
                    }
                `}
            >
                <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-indigo-600 animate-gradient-x"></div>
                <div className="relative bg-slate-950 rounded-[14px] px-8 py-4 flex items-center gap-3 transition-all group-hover:bg-opacity-0">
                     {isLoading ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            <span className="font-bold text-white tracking-wide">Synthesizing...</span>
                        </>
                    ) : (
                        <>
                            <span className="font-bold text-white text-lg tracking-wide group-hover:text-white transition-colors">Generate Speech</span>
                            <div className="bg-white/20 p-1.5 rounded-lg group-hover:bg-white/30 transition-colors">
                                <Sparkles size={20} className="text-white" fill="currentColor" />
                            </div>
                        </>
                    )}
                </div>
            </button>
        </div>
    </div>
  );
};

export default TextEditor;