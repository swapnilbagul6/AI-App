export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
}

export enum Language {
  ENGLISH = 'English',
  HINDI = 'Hindi',
  MARATHI = 'Marathi',
}

export interface VoiceOption {
  id: string;
  name: string;
  gender: Gender;
  description: string;
}

export interface GenerationConfig {
  text: string;
  voiceId: string;
  targetLanguage: Language;
}

export interface AudioState {
  blobUrl: string | null;
  isPlaying: boolean;
  isLoading: boolean;
  error: string | null;
}