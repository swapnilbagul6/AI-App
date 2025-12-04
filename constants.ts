import { Gender, Language, VoiceOption } from './types';

export const VOICES: VoiceOption[] = [
  {
    id: 'Puck',
    name: 'Puck',
    gender: Gender.MALE,
    description: 'Deep, resonant, and clear.'
  },
  {
    id: 'Charon',
    name: 'Charon',
    gender: Gender.MALE,
    description: 'Authoritative and news-like.'
  },
  {
    id: 'Fenrir',
    name: 'Fenrir',
    gender: Gender.MALE,
    description: 'Intense and energetic.'
  },
  {
    id: 'Kore',
    name: 'Kore',
    gender: Gender.FEMALE,
    description: 'Soothing and calm.'
  },
  {
    id: 'Zephyr',
    name: 'Zephyr',
    gender: Gender.FEMALE,
    description: 'Friendly and conversational.'
  },
];

export const LANGUAGES = [
  { value: Language.ENGLISH, label: 'English (Default)' },
  { value: Language.HINDI, label: 'Hindi (हिन्दी)' },
  { value: Language.MARATHI, label: 'Marathi (मराठी)' },
];

export const SAMPLE_TEXTS = {
  [Language.ENGLISH]: "Artificial intelligence is transforming the way we interact with technology.",
  [Language.HINDI]: "कृत्रिम बुद्धिमत्ता हमारे तकनीक के साथ बातचीत करने के तरीके को बदल रही है।",
  [Language.MARATHI]: "कृत्रिम बुद्धिमत्ता आपण तंत्रज्ञानाशी संवाद साधण्याचा मार्ग बदलत आहे.",
};