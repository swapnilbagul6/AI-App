import React from 'react';
import { Gender, Language } from '../types';
import { LANGUAGES, VOICES } from '../constants';
import { Globe, Mic, Check, ChevronDown } from 'lucide-react';

interface VoiceSelectorProps {
  selectedLanguage: Language;
  onLanguageChange: (lang: Language) => void;
  selectedGender: Gender | 'All';
  onGenderChange: (gender: Gender | 'All') => void;
  selectedVoiceId: string;
  onVoiceChange: (voiceId: string) => void;
}

const VoiceSelector: React.FC<VoiceSelectorProps> = ({
  selectedLanguage,
  onLanguageChange,
  selectedGender,
  onGenderChange,
  selectedVoiceId,
  onVoiceChange,
}) => {
  
  const filteredVoices = VOICES.filter(
    (voice) => selectedGender === 'All' || voice.gender === selectedGender
  );

  return (
    <div className="glass-card rounded-[2rem] p-6 shadow-2xl shadow-black/20 hover:shadow-black/30 transition-all duration-500">
        <h3 className="text-lg font-bold text-slate-100 mb-6 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                <Mic size={18} />
            </span>
            Voice Settings
        </h3>

        <div className="space-y-6">
            
            {/* Language */}
            <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Language</label>
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-indigo-400">
                        <Globe size={18} />
                    </div>
                    <select
                        value={selectedLanguage}
                        onChange={(e) => onLanguageChange(e.target.value as Language)}
                        className="w-full appearance-none bg-slate-900/50 hover:bg-slate-900/70 border border-slate-700/50 hover:border-indigo-500/50 text-slate-200 text-sm font-medium rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 block pl-11 pr-10 py-3.5 transition-all duration-200 cursor-pointer outline-none"
                    >
                        {LANGUAGES.map((lang) => (
                        <option key={lang.value} value={lang.value}>
                            {lang.label}
                        </option>
                        ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-500">
                        <ChevronDown size={16} strokeWidth={3} />
                    </div>
                </div>
            </div>

            {/* Gender Filter */}
            <div className="space-y-2">
                 <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Gender Preference</label>
                 <div className="p-1.5 bg-slate-900/60 border border-slate-800 rounded-xl flex gap-1">
                    {(['All', Gender.MALE, Gender.FEMALE] as const).map((gender) => (
                        <button
                            key={gender}
                            onClick={() => onGenderChange(gender)}
                            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all duration-300 ${
                                selectedGender === gender
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 scale-[1.02]'
                                : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                            }`}
                        >
                            {gender}
                        </button>
                    ))}
                 </div>
            </div>

            {/* Voice Select */}
            <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Voice Actor</label>
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin">
                    {filteredVoices.map((voice) => {
                        const isSelected = selectedVoiceId === voice.id;
                        return (
                             <div 
                                key={voice.id}
                                onClick={() => onVoiceChange(voice.id)}
                                className={`
                                    relative p-3 rounded-xl border transition-all duration-200 cursor-pointer group
                                    ${isSelected 
                                        ? 'bg-gradient-to-r from-violet-600 to-indigo-600 border-transparent shadow-lg shadow-indigo-900/50' 
                                        : 'bg-white/5 border-white/5 hover:border-indigo-500/30 hover:bg-white/10'
                                    }
                                `}
                             >
                                <div className="flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <span className={`font-bold text-sm ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                                            {voice.name}
                                        </span>
                                        <span className={`text-xs ${isSelected ? 'text-indigo-200' : 'text-slate-500 group-hover:text-slate-400'}`}>
                                            {voice.description}
                                        </span>
                                    </div>
                                    {isSelected && (
                                        <div className="bg-white/20 p-1 rounded-full text-white">
                                            <Check size={14} strokeWidth={3} />
                                        </div>
                                    )}
                                </div>
                             </div>
                        );
                    })}
                </div>
            </div>

        </div>
    </div>
  );
};

export default VoiceSelector;