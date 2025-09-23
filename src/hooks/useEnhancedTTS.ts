import { useState, useEffect, useCallback } from 'react';

export interface VoiceSettings {
  rate: number;
  pitch: number;
  volume: number;
  preferredVoice?: string;
}

export const useEnhancedTTS = (language: string) => {
  const [speechSynthesis, setSpeechSynthesis] = useState<SpeechSynthesis | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      setSpeechSynthesis(window.speechSynthesis);
      setIsSupported(true);

      const loadVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        setVoices(availableVoices);
      };

      // Load voices immediately if available
      loadVoices();

      // Some browsers load voices asynchronously
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }

      return () => {
        if (window.speechSynthesis.onvoiceschanged !== undefined) {
          window.speechSynthesis.onvoiceschanged = null;
        }
      };
    }
  }, []);

  const preprocessText = useCallback((text: string, targetLanguage: string): string => {
    let processedText = text;

    if (targetLanguage === 'hindi') {
      // Replace common English words and phrases with Hindi equivalents for better pronunciation
      processedText = text
        .replace(/\b(hello|hi|hey)\b/gi, 'नमस्ते')
        .replace(/\b(good|great|excellent)\b/gi, 'अच्छा')
        .replace(/\b(thanks?|thank you)\b/gi, 'धन्यवाद')
        .replace(/\b(yes|yeah|ok|okay)\b/gi, 'हाँ')
        .replace(/\b(no|nope)\b/gi, 'नहीं')
        .replace(/\b(farm|farming)\b/gi, 'खेती')
        .replace(/\b(animal|animals)\b/gi, 'पशु')
        .replace(/\b(medicine|medication)\b/gi, 'दवा')
        .replace(/\b(weather)\b/gi, 'मौसम')
        // Add pronunciation hints for technical terms
        .replace(/\bMRL\b/g, 'एम आर एल')
        .replace(/\bAMU\b/g, 'ए एम यू');
    } else if (targetLanguage === 'bengali') {
      processedText = text
        .replace(/\b(hello|hi|hey)\b/gi, 'নমস্কার')
        .replace(/\b(good|great|excellent)\b/gi, 'ভালো')
        .replace(/\b(thanks?|thank you)\b/gi, 'ধন্যবাদ')
        .replace(/\b(yes|yeah|ok|okay)\b/gi, 'হ্যাঁ')
        .replace(/\b(no|nope)\b/gi, 'না')
        .replace(/\b(farm|farming)\b/gi, 'কৃষি')
        .replace(/\b(animal|animals)\b/gi, 'পশু')
        .replace(/\b(medicine|medication)\b/gi, 'ওষুধ')
        .replace(/\b(weather)\b/gi, 'আবহাওয়া')
        .replace(/\b(doctor)\b/gi, 'ডাক্তার')
        .replace(/\b(health)\b/gi, 'স্বাস্থ্য')
        .replace(/\b(disease)\b/gi, 'রোগ')
        .replace(/\b(treatment)\b/gi, 'চিকিৎসা')
        .replace(/\b(help)\b/gi, 'সাহায্য')
        .replace(/\b(water)\b/gi, 'পানি')
        .replace(/\b(food)\b/gi, 'খাবার')
        .replace(/\b(milk)\b/gi, 'দুধ')
        .replace(/\b(time)\b/gi, 'সময়')
        .replace(/\b(day|days)\b/gi, 'দিন')
        .replace(/\b(week|weeks)\b/gi, 'সপ্তাহ')
        .replace(/\b(month|months)\b/gi, 'মাস')
        .replace(/\b(year|years)\b/gi, 'বছর')
        .replace(/\b(today)\b/gi, 'আজ')
        .replace(/\b(tomorrow)\b/gi, 'কাল')
        .replace(/\b(yesterday)\b/gi, 'গতকাল')
        .replace(/\b(morning)\b/gi, 'সকাল')
        .replace(/\b(afternoon)\b/gi, 'বিকেল')
        .replace(/\b(evening)\b/gi, 'সন্ধ্যা')
        .replace(/\b(night)\b/gi, 'রাত')
        // Technical terms with proper pronunciation
        .replace(/\bMRL\b/g, 'এম আর এল')
        .replace(/\bAMU\b/g, 'এ এম ইউ')
        .replace(/\bAPI\b/g, 'এ পি আই')
        .replace(/\bGPS\b/g, 'জি পি এস')
        .replace(/\bSMS\b/g, 'এস এম এস')
        // Add spaces between English and Bengali for better pronunciation
        .replace(/([a-zA-Z])([ঀ-৿])/g, '$1 $2')
        .replace(/([ঀ-৿])([a-zA-Z])/g, '$1 $2')
        // Fix common pronunciation issues
        .replace(/([০-৯]+)/g, (match) => {
          // Convert Bengali numerals to words for better speech
          const bengaliNumbers = {
            '০': 'শূন্য', '১': 'এক', '২': 'দুই', '৩': 'তিন', '৪': 'চার',
            '৫': 'পাঁচ', '৬': 'ছয়', '৭': 'সাত', '৮': 'আট', '৯': 'নয়'
          };
          return match.split('').map(digit => bengaliNumbers[digit as keyof typeof bengaliNumbers] || digit).join(' ');
        });
    }

    return processedText;
  }, []);

  const selectBestVoice = useCallback((targetLanguage: string): SpeechSynthesisVoice | null => {
    if (voices.length === 0) return null;

    let priorityVoices: SpeechSynthesisVoice[] = [];

    if (targetLanguage === 'hindi') {
      // Priority order for Hindi voices
      priorityVoices = voices.filter(voice => {
        const name = voice.name.toLowerCase();
        const lang = voice.lang.toLowerCase();
        return (
          lang.includes('hi-in') || lang.includes('hi') &&
          (name.includes('google') || name.includes('microsoft') || name.includes('natural'))
        );
      });

      // Fallback to any Hindi voice
      if (priorityVoices.length === 0) {
        priorityVoices = voices.filter(voice => 
          voice.lang.toLowerCase().includes('hi')
        );
      }
    } else if (targetLanguage === 'bengali') {
      // Priority order for Bengali voices - improved selection
      priorityVoices = voices.filter(voice => {
        const name = voice.name.toLowerCase();
        const lang = voice.lang.toLowerCase();
        return (
          (lang.includes('bn-in') || lang.includes('bn-bd') || lang.includes('bn')) &&
          (name.includes('google') || name.includes('microsoft') || name.includes('natural') || 
           name.includes('enhanced') || name.includes('premium') || name.includes('hd'))
        );
      });

      // Specific preference for Indian Bengali over Bangladeshi for farming context
      const indianBengali = priorityVoices.filter(voice => voice.lang.toLowerCase().includes('bn-in'));
      if (indianBengali.length > 0) {
        priorityVoices = indianBengali;
      }

      // Fallback to any Bengali voice
      if (priorityVoices.length === 0) {
        priorityVoices = voices.filter(voice => 
          voice.lang.toLowerCase().includes('bn')
        );
      }
    } else {
      // English voice selection
      priorityVoices = voices.filter(voice => {
        const name = voice.name.toLowerCase();
        const lang = voice.lang.toLowerCase();
        return (
          lang.includes('en-us') || lang.includes('en-in') || lang.includes('en') &&
          (name.includes('google') || name.includes('microsoft') || name.includes('natural') || name.includes('enhanced'))
        );
      });
    }

    return priorityVoices[0] || null;
  }, [voices]);

  const getOptimalSettings = useCallback((targetLanguage: string): VoiceSettings => {
    switch (targetLanguage) {
      case 'hindi':
        return {
          rate: 0.75,     // Slower for clarity
          pitch: 1.1,     // Slightly higher pitch
          volume: 1.0
        };
      case 'bengali':
        return {
          rate: 0.7,     // Even slower for better Bengali pronunciation
          pitch: 0.95,   // Slightly lower pitch for more natural Bengali sound
          volume: 1.0
        };
      default:
        return {
          rate: 0.9,      // Normal speed for English
          pitch: 1.0,
          volume: 1.0
        };
    }
  }, []);

  const speak = useCallback((text: string, options?: Partial<VoiceSettings>): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!speechSynthesis || !isSupported) {
        reject(new Error('Speech synthesis not supported'));
        return;
      }

      // Cancel any ongoing speech
      speechSynthesis.cancel();

      // Preprocess text for better pronunciation
      const processedText = preprocessText(text, language);

      // Create utterance
      const utterance = new SpeechSynthesisUtterance(processedText);

      // Select best voice
      const selectedVoice = selectBestVoice(language);
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      // Set language
      switch (language) {
        case 'hindi':
          utterance.lang = 'hi-IN';
          break;
        case 'bengali':
          utterance.lang = 'bn-IN';
          break;
        default:
          utterance.lang = 'en-US';
          break;
      }

      // Apply optimal settings
      const settings = getOptimalSettings(language);
      utterance.rate = options?.rate ?? settings.rate;
      utterance.pitch = options?.pitch ?? settings.pitch;
      utterance.volume = options?.volume ?? settings.volume;

      // Event handlers
      utterance.onend = () => resolve();
      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event.error);
        
        // Try fallback without specific voice if voice-unavailable
        if (event.error === 'voice-unavailable' && selectedVoice) {
          const fallbackUtterance = new SpeechSynthesisUtterance(processedText);
          fallbackUtterance.lang = utterance.lang;
          fallbackUtterance.rate = utterance.rate;
          fallbackUtterance.pitch = utterance.pitch;
          fallbackUtterance.volume = utterance.volume;
          
          fallbackUtterance.onend = () => resolve();
          fallbackUtterance.onerror = () => reject(new Error('Speech synthesis failed'));
          
          speechSynthesis.speak(fallbackUtterance);
        } else {
          reject(new Error(`Speech synthesis error: ${event.error}`));
        }
      };

      // Speak
      speechSynthesis.speak(utterance);
    });
  }, [speechSynthesis, isSupported, language, preprocessText, selectBestVoice, getOptimalSettings]);

  const stop = useCallback(() => {
    if (speechSynthesis) {
      speechSynthesis.cancel();
    }
  }, [speechSynthesis]);

  const getAvailableVoices = useCallback((targetLanguage?: string) => {
    if (!targetLanguage) return voices;
    
    return voices.filter(voice => {
      const lang = voice.lang.toLowerCase();
      switch (targetLanguage) {
        case 'hindi':
          return lang.includes('hi');
        case 'bengali':
          return lang.includes('bn');
        default:
          return lang.includes('en');
      }
    });
  }, [voices]);

  return {
    speak,
    stop,
    isSupported,
    voices,
    getAvailableVoices,
    selectBestVoice,
    preprocessText
  };
};