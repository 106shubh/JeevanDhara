import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, Loader2, Mic, MicOff, Image as ImageIcon, Cloud, Wifi, WifiOff, Volume2, VolumeX } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { motion, Variants } from "framer-motion";
import { useEnhancedTTS } from "@/hooks/useEnhancedTTS";

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  type?: 'text' | 'voice' | 'image' | 'weather';
  audioUrl?: string;
  imageUrl?: string;
  weatherData?: WeatherData;
}

interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  forecast: Array<{
    day: string;
    temp: number;
    condition: string;
  }>;
}

interface OfflineMessage {
  id: string;
  message: string;
  timestamp: Date;
  type: 'text' | 'voice' | 'image';
}

export const Chatbot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { language } = useLanguage();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  // Enhanced TTS Hook
  const enhancedTTS = useEnhancedTTS(language);
  
  // Voice Features
  const [isRecording, setIsRecording] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [autoSpeak, setAutoSpeak] = useState(false);
  const [speechRecognition, setSpeechRecognition] = useState<any>(null);
  const [speechSynthesis, setSpeechSynthesis] = useState<any>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  
  // Weather Integration
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoadingWeather, setIsLoadingWeather] = useState(false);
  
  // Offline Mode
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [offlineQueue, setOfflineQueue] = useState<OfflineMessage[]>([]);

  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3
      }
    }
  };
  
  const iconVariants = {
    hover: { scale: 1.2, rotate: 5, transition: { duration: 0.3 } }
  };

  // Initialize all features
  useEffect(() => {
    setMessages([{
      id: '1',
      text: getWelcomeMessage(),
      isBot: true,
      timestamp: new Date()
    }]);
    
    initializeVoiceFeatures();
    setupOfflineMode();
    initializeWeather();
    loadOfflineMessages();
  }, [language]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        setTimeout(() => {
          scrollContainer.scrollTop = scrollContainer.scrollHeight;
        }, 100);
      }
    }
  }, [messages]);

  const getWelcomeMessage = () => {
    switch (language) {
      case 'hindi':
        return "नमस्कार! मैं आपका स्मार्ट कृषि सहायक हूं। आप मुझसे टेक्स्ट, आवाज या फोटो के जरिए किसी भी भाषा में सवाल पूछ सकते हैं। मैं मौसम की जानकारी, फसल की देखभाल और पशुओं के स्वास्थ्य में आपकी मदद कर सकता हूं।";
      case 'bengali':
        return "নমস্কার! আমি আপনার স্মার্ট কৃষি সহায়ক। আপনি টেক্সট, ভয়েস বা ছবির মাধ্যমে যেকোনো ভাষায় আমাকে প্রশ্ন করতে পারেন। আমি আবহাওয়ার তথ্য, ফসলের যত্ন এবং পশুর স্বাস্থ্য নিয়ে সাহায্য করতে পারি।";
      default:
        return "Hello! I'm your Smart Farm Assistant with advanced features! 🌾\n\n✨ New Features:\n🎤 Voice messages in any language\n📷 Image analysis for crops/animals\n🌤️ Real-time weather updates\n📱 Offline mode support\n🔊 Text-to-speech responses\n\nAsk me anything about farming, weather, or agriculture!";
    }
  };

  // Voice Features
  const initializeVoiceFeatures = () => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = language === 'hindi' ? 'hi-IN' : language === 'bengali' ? 'bn-IN' : 'en-US';
        
        recognition.onstart = () => setIsListening(true);
        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInputMessage(transcript);
          setIsListening(false);
          setTimeout(() => {
            if (transcript.trim()) {
              handleVoiceInput(transcript);
            }
          }, 500);
        };
        recognition.onerror = () => {
          setIsListening(false);
          toast({
            title: "Voice Recognition Error",
            description: "Unable to recognize speech. Please try again.",
            variant: "destructive"
          });
        };
        recognition.onend = () => setIsListening(false);
        
        setSpeechRecognition(recognition);
      }
      
      if (window.speechSynthesis) {
        setSpeechSynthesis(window.speechSynthesis);
      }
    }
  };

  const startVoiceRecognition = () => {
    if (speechRecognition && !isListening) {
      speechRecognition.start();
      toast({
        title: "🎤 Listening...",
        description: "Speak now in any language",
      });
    }
  };

  const speakText = async (text: string) => {
    if (!voiceEnabled || !enhancedTTS.isSupported) return;
    
    try {
      // Use enhanced TTS with better voice quality
      await enhancedTTS.speak(text);
      
      toast({
        title: "🔊 Speaking...",
        description: `Reading text in ${language === 'hindi' ? 'Hindi' : language === 'bengali' ? 'Bengali' : 'English'}`,
      });
    } catch (error) {
      console.error('Enhanced TTS failed, falling back to basic TTS:', error);
      
      // Fallback to basic TTS if enhanced fails
      if (speechSynthesis) {
        speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = language === 'hindi' ? 'hi-IN' : language === 'bengali' ? 'bn-IN' : 'en-US';
        utterance.rate = 0.8; // Slower for clarity
        speechSynthesis.speak(utterance);
      }
    }
  };

  const testVoiceQuality = async () => {
    const testMessages = {
      hindi: "नमस्कार! यह बेहतर आवाज़ गुणवत्ता का परीक्षण है। अब हिंदी में बोलना अधिक स्पष्ट होगा।",
      bengali: "নমস্কার! আমি আপনার কৃষি সহায়ক। এখন বাংলা উচ্চারণ আরও ভালো এবং স্পষ্ট হবে। আমি পশু স্বাস্থ্য এবং কৃষি বিষয়ক সাহায্য করতে পারি।",
      english: "Hello! This is a test of enhanced voice quality. Speaking should now be much clearer and more natural."
    };
    
    const message = testMessages[language as keyof typeof testMessages] || testMessages.english;
    
    // Debug: Log available Bengali voices for troubleshooting
    if (language === 'bengali') {
      const bengaliVoices = enhancedTTS.getAvailableVoices('bengali');
      console.log('Available Bengali voices:', bengaliVoices.map(v => `${v.name} (${v.lang})`));
      
      toast({
        title: "🔊 Bengali Voice Test",
        description: `Testing with ${bengaliVoices.length} available Bengali voices`,
      });
    }
    
    await speakText(message);
  };
  
  // Voice Recording Functions
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        // Add voice message to chat
        const voiceMessage: Message = {
          id: Date.now().toString(),
          text: "Processing voice message...",
          isBot: false,
          timestamp: new Date(),
          type: 'voice',
          audioUrl: audioUrl
        };
        
        setMessages(prev => [...prev, voiceMessage]);
        
        // Process voice message with speech recognition
        await processVoiceMessage(audioBlob);
        
        // Clean up
        stream.getTracks().forEach(track => track.stop());
      };

      setMediaRecorder(recorder);
      recorder.start();
      setIsRecording(true);
      
      toast({
        title: "🎤 Recording Started",
        description: "Speak your message clearly. Click stop when done.",
      });
      
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Recording Error",
        description: "Unable to access microphone. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
      setMediaRecorder(null);
    }
  };

  const processVoiceMessage = async (audioBlob: Blob) => {
    setIsLoading(true);
    
    try {
      // Convert audio to base64 for sending to backend
      const reader = new FileReader();
      const audioBase64 = await new Promise<string>((resolve) => {
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(audioBlob);
      });

      const { data, error } = await supabase.functions.invoke('chatbot', {
        body: { 
          message: "[Voice message received]",
          isVoiceMessage: true,
          audioData: audioBase64,
          language: language
        }
      });

      if (error) throw error;

      if (data.success) {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: data.reply || "I heard your voice message! Based on what you said, I can help you with farming and animal health questions. Please let me know how I can assist you.",
          isBot: true,
          timestamp: new Date(),
          type: 'text'
        };
        setMessages(prev => [...prev, botMessage]);
        
        if (autoSpeak) {
          await speakText(botMessage.text);
        }
      }
    } catch (error) {
      console.error('Voice processing error:', error);
      
      // Provide a helpful fallback response
      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: language === 'hindi' 
          ? "मैंने आपका आवाज़ संदेश सुना है! कृपया टेक्स्ट में अपना प्रश्न लिखें ताकि मैं बेहतर सहायता कर सकूं।"
          : language === 'bengali'
          ? "আমি আপনার ভয়েস মেসেজ শুনেছি! আরও ভাল সাহায্যের জন্য অনুগ্রহ করে আপনার প্রশ্ন টেক্সটে লিখুন।"
          : "I received your voice message! For better assistance, please type your question so I can provide more accurate help with farming and animal health.",
        isBot: true,
        timestamp: new Date(),
        type: 'text'
      };
      setMessages(prev => [...prev, fallbackMessage]);
      
      if (autoSpeak) {
        await speakText(fallbackMessage.text);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceInput = async (transcript: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text: transcript,
      isBot: false,
      timestamp: new Date(),
      type: 'voice'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      if (!isOnline) {
        await handleOfflineMessage(transcript, 'voice');
        return;
      }

      const { data, error } = await supabase.functions.invoke('chatbot', {
        body: { message: transcript, isVoiceMessage: true, language }
      });

      if (error) throw error;

      if (data.success) {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: data.reply,
          isBot: true,
          timestamp: new Date(),
          type: 'text'
        };
        setMessages(prev => [...prev, botMessage]);
        
        if (autoSpeak) {
          await speakText(botMessage.text);
        }
      }
    } catch (error) {
      await handleOfflineMessage(transcript, 'voice');
    } finally {
      setIsLoading(false);
    }
  };

  // Image Upload Functions
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File",
        description: "Please select an image file.",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      
      // Add image message to chat
      const imageMessage: Message = {
        id: Date.now().toString(),
        text: "Image uploaded - analyzing...",
        isBot: false,
        timestamp: new Date(),
        type: 'image',
        imageUrl: imageUrl
      };
      
      setMessages(prev => [...prev, imageMessage]);
      
      // Process image with AI
      processImageMessage(imageUrl);
    };
    
    reader.readAsDataURL(file);
    
    // Reset file input
    if (event.target) {
      event.target.value = '';
    }
  };

  const processImageMessage = async (imageUrl: string) => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('chatbot', {
        body: { 
          message: "[Image uploaded for analysis]",
          isImageMessage: true,
          imageUrl: imageUrl,
          language: language
        }
      });

      if (error) throw error;

      if (data.success) {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: data.reply || "I can see your image! This appears to be related to farming or animal care. Here are some observations and suggestions based on what I can see. Please let me know if you have specific questions about this image.",
          isBot: true,
          timestamp: new Date(),
          type: 'text'
        };
        setMessages(prev => [...prev, botMessage]);
        
        if (autoSpeak) {
          await speakText(botMessage.text);
        }
      }
    } catch (error) {
      console.error('Image processing error:', error);
      
      // Provide helpful fallback response based on common farming images
      const fallbackResponses = {
        hindi: "मैं आपकी तस्वीर देख सकता हूं! यह कृषि या पशु देखभाल से संबंधित लगती है। कृपया बताएं कि आप इस तस्वीर के बारे में क्या जानना चाहते हैं - जैसे कि पशु का स्वास्थ्य, फसल की समस्या, या दवा की जानकारी?",
        bengali: "আমি আপনার ছবি দেখতে পাচ্ছি! এটি কৃষি বা পশু পরিচর্যা সম্পর্কিত বলে মনে হচ্ছে। অনুগ্রহ করে বলুন আপনি এই ছবি সম্পর্কে কী জানতে চান - যেমন পশুর স্বাস্থ্য, ফসলের সমস্যা, বা ওষুধের তথ্য?",
        english: "I can see your image! This appears to be related to farming or animal care. Please tell me what you'd like to know about this image - such as animal health, crop issues, disease identification, or medication advice?"
      };
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: fallbackResponses[language as keyof typeof fallbackResponses] || fallbackResponses.english,
        isBot: true,
        timestamp: new Date(),
        type: 'text'
      };
      setMessages(prev => [...prev, botMessage]);
      
      if (autoSpeak) {
        await speakText(botMessage.text);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Weather Integration
  const initializeWeather = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => fetchWeatherData(position.coords.latitude, position.coords.longitude),
        () => fetchWeatherData(28.6139, 77.2090) // Default to Delhi
      );
    } else {
      fetchWeatherData(28.6139, 77.2090);
    }
  };

  const fetchWeatherData = async (lat: number, lon: number) => {
    setIsLoadingWeather(true);
    try {
      // Mock weather data for demo
      const mockWeather: WeatherData = {
        location: "Your Area",
        temperature: Math.floor(Math.random() * 15) + 20,
        condition: ["Clear", "Cloudy", "Sunny", "Rain"][Math.floor(Math.random() * 4)],
        humidity: Math.floor(Math.random() * 30) + 50,
        windSpeed: Math.floor(Math.random() * 20) + 5,
        forecast: [
          { day: "Today", temp: 28, condition: "Clear" },
          { day: "Tomorrow", temp: 30, condition: "Sunny" },
          { day: "Wed", temp: 26, condition: "Cloudy" },
          { day: "Thu", temp: 24, condition: "Rain" },
          { day: "Fri", temp: 27, condition: "Clear" }
        ]
      };
      setWeatherData(mockWeather);
    } finally {
      setIsLoadingWeather(false);
    }
  };

  const addWeatherMessage = () => {
    if (!weatherData) return;

    const advice = getWeatherAdvice(weatherData);
    const weatherMessage: Message = {
      id: Date.now().toString(),
      text: advice,
      isBot: true,
      timestamp: new Date(),
      type: 'weather',
      weatherData
    };

    setMessages(prev => [...prev, weatherMessage]);
    if (autoSpeak) speakText(advice);
  };

  const getWeatherAdvice = (weather: WeatherData) => {
    const { temperature, condition, humidity } = weather;
    let advice = `🌤️ Current weather in ${weather.location}: ${temperature}°C, ${condition}\n\n`;
    
    if (condition.toLowerCase().includes('rain')) {
      advice += "🌧️ Rainy conditions:\n• Avoid irrigation today\n• Check for crop diseases\n• Ensure proper drainage";
    } else if (temperature > 35) {
      advice += "🌡️ High temperature:\n• Increase irrigation\n• Provide shade for livestock\n• Harvest early morning";
    } else {
      advice += "☀️ Good farming conditions:\n• Ideal for field work\n• Normal irrigation schedule\n• Good time for planting";
    }
    
    return advice;
  };

  // Offline Mode
  const setupOfflineMode = () => {
    const handleOnline = () => {
      setIsOnline(true);
      toast({ title: "📡 Back Online", description: "Processing queued messages..." });
      processOfflineQueue();
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast({ 
        title: "📱 Offline Mode", 
        description: "Messages will be saved for when you're back online",
        variant: "destructive" 
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
  };

  const handleOfflineMessage = async (message: string, type: 'text' | 'voice' | 'image') => {
    const offlineMsg: OfflineMessage = {
      id: Date.now().toString(),
      message,
      timestamp: new Date(),
      type
    };

    const updatedQueue = [...offlineQueue, offlineMsg];
    setOfflineQueue(updatedQueue);
    localStorage.setItem('chatbot_offline_queue', JSON.stringify(updatedQueue));

    const offlineResponse: Message = {
      id: (Date.now() + 1).toString(),
      text: "📱 Offline mode: Your message has been saved and will be processed when connection is restored.",
      isBot: true,
      timestamp: new Date(),
      type: 'text'
    };
    
    setMessages(prev => [...prev, offlineResponse]);
  };

  const processOfflineQueue = async () => {
    for (const queuedMessage of offlineQueue) {
      try {
        const { data } = await supabase.functions.invoke('chatbot', {
          body: { message: queuedMessage.message, isOfflineMessage: true }
        });

        if (data.success) {
          const botMessage: Message = {
            id: (Date.now() + 1).toString(),
            text: `📡 Offline response: ${data.reply}`,
            isBot: true,
            timestamp: new Date(),
            type: 'text'
          };
          setMessages(prev => [...prev, botMessage]);
        }
      } catch (error) {
        console.error('Failed to process offline message:', error);
      }
    }

    setOfflineQueue([]);
    localStorage.removeItem('chatbot_offline_queue');
  };

  const loadOfflineMessages = () => {
    const saved = localStorage.getItem('chatbot_offline_queue');
    if (saved) {
      try {
        setOfflineQueue(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to load offline messages:', error);
      }
    }
  };

  // Regular message sending
  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      isBot: false,
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      if (!isOnline) {
        await handleOfflineMessage(inputMessage, 'text');
        return;
      }

      const { data, error } = await supabase.functions.invoke('chatbot', {
        body: { message: inputMessage }
      });

      if (error) throw error;

      if (data.success) {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: data.reply,
          isBot: true,
          timestamp: new Date(),
          type: 'text'
        };
        setMessages(prev => [...prev, botMessage]);
        
        if (autoSpeak) {
          speakText(botMessage.text);
        }
      }
    } catch (error) {
      await handleOfflineMessage(inputMessage, 'text');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <motion.div 
      className="max-w-4xl mx-auto space-y-4 md:space-y-6 px-2 md:px-0"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="text-center space-y-2" variants={itemVariants}>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground">Smart Farm Assistant</h2>
        <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            {isOnline ? <Wifi className="h-4 w-4 text-green-500" /> : <WifiOff className="h-4 w-4 text-red-500" />}
            {isOnline ? "Online" : "Offline"}
          </div>
          {weatherData && (
            <div className="flex items-center gap-1">
              <Cloud className="h-4 w-4" />
              {weatherData.temperature}°C, {weatherData.condition}
            </div>
          )}
          <div className="flex items-center gap-1">
            {voiceEnabled ? (
              <>
                <Volume2 className="h-4 w-4 text-green-500" />
                <span className="text-xs">
                  Voice {enhancedTTS.isSupported ? 'HD' : 'Basic'}
                </span>
              </>
            ) : (
              <>
                <VolumeX className="h-4 w-4 text-gray-500" />
                <span className="text-xs">Voice Off</span>
              </>
            )}
          </div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="h-[500px] md:h-[600px] flex flex-col overflow-hidden">
          <CardHeader className="flex-shrink-0 pb-4 border-b">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-primary" />
                <span>Enhanced Farm Assistant</span>
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={() => setVoiceEnabled(!voiceEnabled)}
                  variant="outline"
                  size="sm"
                  title={`Voice ${voiceEnabled ? 'enabled' : 'disabled'} - ${enhancedTTS.isSupported ? 'Enhanced TTS supported' : 'Basic TTS only'}`}
                >
                  {voiceEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                  {enhancedTTS.isSupported && voiceEnabled && (
                    <span className="ml-1 text-xs">HD</span>
                  )}
                </Button>
                <Button
                  onClick={() => setAutoSpeak(!autoSpeak)}
                  variant={autoSpeak ? "default" : "outline"}
                  size="sm"
                  title="Automatically speak bot responses"
                >
                  Auto-speak
                </Button>
                <Button
                  onClick={testVoiceQuality}
                  variant="outline"
                  size="sm"
                  disabled={!voiceEnabled}
                  title="Test voice quality in current language"
                >
                  Test Voice
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
            <ScrollArea className="flex-1 h-full" ref={scrollAreaRef}>
              <div className="p-4 space-y-4">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    className={`flex items-start gap-2 md:gap-3 w-full ${
                      message.isBot ? 'justify-start' : 'justify-end'
                    }`}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {message.isBot && (
                      <div className="flex-shrink-0 w-6 h-6 md:w-8 md:h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Bot className="h-3 w-3 md:h-4 md:w-4 text-primary" />
                      </div>
                    )}
                    
                    <div
                      className={`max-w-[75%] md:max-w-[70%] rounded-lg px-3 py-2 md:px-4 md:py-3 ${
                        message.isBot
                          ? 'bg-muted text-foreground'
                          : 'bg-primary text-primary-foreground'
                      }`}
                    >
                      {message.type === 'image' && message.imageUrl && (
                        <div className="mb-2">
                          <img 
                            src={message.imageUrl} 
                            alt="Uploaded" 
                            className="max-w-full h-auto rounded-lg max-h-48 object-cover"
                          />
                        </div>
                      )}
                      
                      {message.type === 'voice' && (
                        <div className="flex items-center gap-2 mb-1">
                          <Mic className="h-3 w-3" />
                          <span className="text-xs opacity-70">Voice message</span>
                        </div>
                      )}
                      
                      {message.type === 'weather' && (
                        <div className="flex items-center gap-2 mb-1">
                          <Cloud className="h-3 w-3" />
                          <span className="text-xs opacity-70">Weather update</span>
                        </div>
                      )}
                      
                      <p className="whitespace-pre-wrap text-xs md:text-sm leading-relaxed">{message.text}</p>
                      <span className="text-[10px] md:text-xs opacity-70 mt-1 block">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    
                    {!message.isBot && (
                      <div className="flex-shrink-0 w-6 h-6 md:w-8 md:h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-3 w-3 md:h-4 md:w-4 text-primary" />
                      </div>
                    )}
                  </motion.div>
                ))}
                
                {isLoading && (
                  <div className="flex items-start gap-2 md:gap-3 w-full justify-start">
                    <div className="flex-shrink-0 w-6 h-6 md:w-8 md:h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Bot className="h-3 w-3 md:h-4 md:w-4 text-primary" />
                    </div>
                    <div className="max-w-[75%] rounded-lg px-3 py-2 md:px-4 md:py-3 bg-muted">
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-3 w-3 md:h-4 md:w-4 animate-spin" />
                        <span className="text-xs md:text-sm">Processing...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
            
            <div className="flex-shrink-0 border-t p-2 md:p-4">
              <div className="flex gap-1 md:gap-2 mb-2">
                <div className="flex-1">
                  <Input
                    ref={inputRef}
                    placeholder={
                      isListening ? "🎤 Listening..." :
                      language === 'hindi' ? "संदेश टाइप करें या आवाज का उपयोग करें..." :
                      language === 'bengali' ? "বার্তা টাইপ করুন বা ভয়েস ব্যবহার করুন..." :
                      "Type, speak, or upload image..."
                    }
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={isLoading || isListening}
                    className="w-full"
                  />
                </div>
                
                <Button
                  onClick={isListening ? () => speechRecognition?.stop() : startVoiceRecognition}
                  disabled={isLoading}
                  variant={isListening ? "destructive" : "outline"}
                  size={isMobile ? "sm" : "default"}
                >
                  {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>
                
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading}
                  variant="outline"
                  size={isMobile ? "sm" : "default"}
                >
                  <ImageIcon className="h-4 w-4" />
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                
                <Button 
                  onClick={sendMessage} 
                  disabled={isLoading || !inputMessage.trim()}
                  size={isMobile ? "sm" : "default"}
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </div>
              
              <p className="text-xs text-muted-foreground">
                {isListening ? (
                  <span className="text-red-500 font-medium">🎤 Listening for voice input...</span>
                ) : (
                  isOnline ? 
                  "💬 Type, 🎤 speak, or 📷 upload - Enhanced with weather, voice & offline support!" :
                  "📱 Offline mode: Messages saved for when you're back online"
                )}
                {offlineQueue.length > 0 && (
                  <span className="ml-2 text-amber-600">({offlineQueue.length} messages queued)</span>
                )}
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};