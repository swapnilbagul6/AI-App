import { GoogleGenAI, Modality } from '@google/genai';
import { Language } from '../types';

export const streamSpeech = async function* (
  text: string, 
  voiceId: string, 
  targetLanguage: Language
): AsyncGenerator<string, void, unknown> {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing. Please check your environment configuration.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Construct a prompt that handles translation if necessary
  let promptText = text;
  if (targetLanguage !== Language.ENGLISH) {
    promptText = `Translate the following text to ${targetLanguage} and read it aloud. Do not add any introductory text, just read the translation naturally: "${text}"`;
  } else {
    promptText = `Read the following text aloud naturally: "${text}"`;
  }

  try {
    const responseStream = await ai.models.generateContentStream({
      model: 'gemini-2.5-flash-preview-tts',
      contents: {
        parts: [{ text: promptText }],
      },
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {
              voiceName: voiceId,
            },
          },
        },
      },
    });

    for await (const chunk of responseStream) {
        const audioData = chunk.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (audioData) {
            yield audioData;
        }
    }

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};