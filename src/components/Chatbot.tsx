import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, Loader2, Mic, MicOff, Camera, Image as ImageIcon, Cloud, CloudRain, Sun, MapPin, Wifi, WifiOff, Volume2, VolumeX } from "lucide-react";
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
  weatherData?: {
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
  };
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
  audioUrl?: string;
  imageUrl?: string;
}

export const Chatbot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { language } = useLanguage();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  // Voice Recording States
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Enhanced Voice Features
  const [speechRecognition, setSpeechRecognition] = useState<any>(null);
  const [speechSynthesis, setSpeechSynthesis] = useState<any>(null);
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [autoSpeak, setAutoSpeak] = useState(false);
  
  // Weather Integration States
  const [userLocation, setUserLocation] = useState<{lat: number, lon: number} | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoadingWeather, setIsLoadingWeather] = useState(false);
  
  // Offline Mode States
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [offlineQueue, setOfflineQueue] = useState<OfflineMessage[]>([]);
  const [offlineMessages, setOfflineMessages] = useState<Message[]>([]);

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

  // Enhanced Voice Features
  const initializeVoiceFeatures = () => {
    if (typeof window !== 'undefined') {
      // Initialize Speech Recognition
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = language === 'hindi' ? 'hi-IN' : language === 'bengali' ? 'bn-IN' : 'en-US';
        
        recognition.onstart = () => {
          setIsListening(true);
        };
        
        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInputMessage(transcript);
          setIsListening(false);
          
          // Auto-send if transcript is detected
          setTimeout(() => {
            if (transcript.trim()) {
              handleVoiceInput(transcript);
            }
          }, 500);
        };
        
        recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
          toast({
            title: "Voice Recognition Error",
            description: "Unable to recognize speech. Please try again.",
            variant: "destructive"
          });
        };
        
        recognition.onend = () => {
          setIsListening(false);
        };
        
        setSpeechRecognition(recognition);
      }
      
      // Initialize Speech Synthesis
      if (window.speechSynthesis) {
        setSpeechSynthesis(window.speechSynthesis);
      }
    }
  };

  // Offline Mode Functions
  const setupOfflineMode = () => {
    const handleOnline = () => {
      setIsOnline(true);
      toast({
        title: "Back Online",
        description: "Connection restored. Processing queued messages...",
      });
      processOfflineQueue();
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast({
        title: "Offline Mode",
        description: "No internet connection. Messages will be saved and sent when online.",
        variant: "destructive"
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  };

  // Weather Integration
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lon: position.coords.longitude
          };
          setUserLocation(location);
          fetchWeatherData(location);
        },
        (error) => {
          console.warn('Location access denied:', error);
          // Use default location (Delhi, India) for farming context
          const defaultLocation = { lat: 28.6139, lon: 77.2090 };
          setUserLocation(defaultLocation);
          fetchWeatherData(defaultLocation);
        }
      );
    }
  };

  const loadOfflineMessages = () => {
    const saved = localStorage.getItem('chatbot_offline_queue');
    if (saved) {
      try {
        const savedQueue = JSON.parse(saved);
        setOfflineQueue(savedQueue);
      } catch (error) {
        console.error('Failed to load offline messages:', error);
      }
    }
  };

  useEffect(() => {
    // Add welcome message
    setMessages([{
      id: '1',
      text: getWelcomeMessage(),
      isBot: true,
      timestamp: new Date()
    }]);
    
    // Initialize enhanced voice features
    initializeVoiceFeatures();
    
    // Setup offline mode listeners
    setupOfflineMode();
    
    // Get user location for weather
    getUserLocation();
    
    // Load offline messages from localStorage
    loadOfflineMessages();
  }, [language]);

  useEffect(() => {
    // Scroll to bottom when new message is added
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
        return "नमस्कार! मैं आपका कृषि सहायक हूं। आप मुझसे हिंदी, अंग्रेजी या हिंग्लिश में कोई भी प्रश्न पूछ सकते हैं। मैं पशु स्वास्थ्य, खेती प्रबंधन, दवा उपयोग और MRL अनुपालन के बारे में आपकी मदद कर सकता हूं।";
      case 'bengali':
        return "নমস্কার! আমি আপনার কৃষি সহায়ক। আপনি বাংলা, ইংরেজি বা মিশ্র ভাষায় আমাকে যেকোনো প্রশ্ন জিজ্ঞাসা করতে পারেন। আমি পশু স্বাস্থ্য, খামার ব্যবস্থাপনা, ওষুধ ব্যবহার এবং MRL সম্মতি সম্পর্কে সাহায্য করতে পারি।";
      default:
        return "Hello! I'm your Farm Assistant. You can ask me questions in English, Hindi, Bengali, or even Hinglish - whatever feels comfortable for you! I can help with animal health, farm management, medication usage, and MRL compliance.";
    }
  };

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
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Chatbot error:', error);
      toast({
        title: "Error",
        description: "Failed to get response from assistant. Please try again.",
        variant: "destructive",
      });
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I'm having trouble responding right now. Please try again later.",
        isBot: true,
        timestamp: new Date(),
        type: 'text'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
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
          text: "Voice message",
          isBot: false,
          timestamp: new Date(),
          type: 'voice',
          audioUrl: audioUrl
        };
        
        setMessages(prev => [...prev, voiceMessage]);
        
        // Convert speech to text and send to chatbot
        await processVoiceMessage(audioBlob);
        
        // Clean up
        stream.getTracks().forEach(track => track.stop());
      };

      setMediaRecorder(recorder);
      setAudioChunks(chunks);
      recorder.start();
      setIsRecording(true);
      
      toast({
        title: "Recording Started",
        description: "Speak your message now. Click stop when done.",
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
      // For now, we'll simulate speech-to-text conversion
      // In a real implementation, you would send the audio to a speech-to-text service
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate processing
      
      const simulatedTranscript = "[Voice message received - processing with speech recognition]";
      
      const { data, error } = await supabase.functions.invoke('chatbot', {
        body: { 
          message: simulatedTranscript,
          isVoiceMessage: true
        }
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
      }
    } catch (error) {
      console.error('Voice processing error:', error);
      toast({
        title: "Voice Processing Error",
        description: "Unable to process voice message. Please try typing instead.",
        variant: "destructive",
      });
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
        text: "Image uploaded",
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
      // Simulate AI image analysis
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const { data, error } = await supabase.functions.invoke('chatbot', {
        body: { 
          message: "[Image uploaded for analysis]",
          isImageMessage: true,
          imageUrl: imageUrl
        }
      });

      if (error) throw error;

      if (data.success) {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: data.reply || "I can see your image! Based on what I observe, this appears to be related to farming or animal care. Please let me know what specific help you need with this image.",
          isBot: true,
          timestamp: new Date(),
          type: 'text'
        };
        setMessages(prev => [...prev, botMessage]);
        
        // Auto-speak response if enabled
        if (autoSpeak && voiceEnabled) {
          speakText(botMessage.text);
        }
      }
    } catch (error) {
      console.error('Image processing error:', error);
      
      // Provide fallback response
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I can see your image! While I'm still learning to analyze images, I can help you with any questions about farming, animal health, or agriculture. Please describe what you'd like to know about this image.",
        isBot: true,
        timestamp: new Date(),
        type: 'text'
      };
      setMessages(prev => [...prev, botMessage]);
      
      if (autoSpeak && voiceEnabled) {
        speakText(botMessage.text);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchWeatherData = async (location: {lat: number, lon: number}) => {
    setIsLoadingWeather(true);
    
    try {
      const mockWeather: WeatherData = {
        location: "Your Area",
        temperature: 28,
        condition: "Clear",
        humidity: 65,
        windSpeed: 12,
        forecast: [
          { day: "Today", temp: 28, condition: "Clear" },
          { day: "Tomorrow", temp: 30, condition: "Sunny" },
          { day: "Wed", temp: 26, condition: "Cloudy" },
          { day: "Thu", temp: 24, condition: "Rain" },
          { day: "Fri", temp: 27, condition: "Clear" }
        ]
      };
      
      setWeatherData(mockWeather);
    } catch (error) {
      console.error('Weather fetch error:', error);
    } finally {
      setIsLoadingWeather(false);
    }
  };

  const startVoiceRecognition = () => {
    if (speechRecognition && !isListening) {
      speechRecognition.start();
      toast({
        title: "Voice Recognition Started",
        description: "Speak now in any language...",
      });
    }
  };

  const stopVoiceRecognition = () => {
    if (speechRecognition && isListening) {
      speechRecognition.stop();
    }
  };

  const speakText = (text: string) => {
    if (speechSynthesis && voiceEnabled) {
      speechSynthesis.cancel();
      
      // Get available voices
      const voices = speechSynthesis.getVoices();
      
      // Enhanced text preprocessing for better pronunciation
      let processedText = text;
      if (language === 'hindi') {
        // Replace common English words with Hindi pronunciation guides
        processedText = text
          .replace(/\b(hello|hi)\b/gi, 'नमस्ते')
          .replace(/\b(good)\b/gi, 'अच्छा')
          .replace(/\b(thanks?|thank you)\b/gi, 'धन्यवाद')
          .replace(/\b(yes)\b/gi, 'हाँ')
          .replace(/\b(no)\b/gi, 'नहीं');
      } else if (language === 'bengali') {
        processedText = text
          .replace(/\b(hello|hi)\b/gi, 'নমস্কার')
          .replace(/\b(good)\b/gi, 'ভালো')
          .replace(/\b(thanks?|thank you)\b/gi, 'ধন্যবাদ')
          .replace(/\b(yes)\b/gi, 'হ্যাঁ')
          .replace(/\b(no)\b/gi, 'না');
      }
      
      const utterance = new SpeechSynthesisUtterance(processedText);
      
      // Enhanced voice selection with fallbacks
      let selectedVoice = null;
      
      if (language === 'hindi') {
        // Try to find the best Hindi voice
        selectedVoice = voices.find(voice => 
          voice.lang.includes('hi') && 
          (voice.name.includes('Google') || voice.name.includes('Microsoft'))
        ) || voices.find(voice => voice.lang.includes('hi-IN')) ||
           voices.find(voice => voice.lang.includes('hi'));
        
        utterance.lang = 'hi-IN';
        utterance.rate = 0.8; // Slower for clarity
        utterance.pitch = 1.1; // Slightly higher pitch
      } else if (language === 'bengali') {
        // Try to find the best Bengali voice
        selectedVoice = voices.find(voice => 
          voice.lang.includes('bn') && 
          (voice.name.includes('Google') || voice.name.includes('Microsoft'))
        ) || voices.find(voice => voice.lang.includes('bn-IN')) ||
           voices.find(voice => voice.lang.includes('bn-BD')) ||
           voices.find(voice => voice.lang.includes('bn'));
        
        utterance.lang = 'bn-IN';
        utterance.rate = 0.8; // Slower for clarity
        utterance.pitch = 1.0;
      } else {
        // English voice selection
        selectedVoice = voices.find(voice => 
          voice.lang.includes('en') && 
          (voice.name.includes('Google') || voice.name.includes('Microsoft') || voice.name.includes('Natural'))
        ) || voices.find(voice => voice.lang.includes('en-US'));
        
        utterance.lang = 'en-US';
        utterance.rate = 0.9;
        utterance.pitch = 1.0;
      }
      
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
      
      // Enhanced settings for clarity
      utterance.volume = 1.0;
      
      // Error handling
      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event.error);
        // Fallback to default voice if selected voice fails
        if (selectedVoice && event.error === 'voice-unavailable') {
          const fallbackUtterance = new SpeechSynthesisUtterance(processedText);
          fallbackUtterance.lang = utterance.lang;
          fallbackUtterance.rate = utterance.rate;
          fallbackUtterance.pitch = utterance.pitch;
          fallbackUtterance.volume = utterance.volume;
          speechSynthesis.speak(fallbackUtterance);
        }
      };
      
      speechSynthesis.speak(utterance);
    }
  };

  const handleVoiceInput = async (transcript: string) => {
    if (!transcript.trim()) return;
    
    setIsLoading(true);

    try {
      if (!isOnline) {
        await handleOfflineMessage(transcript, 'voice');
        return;
      }

      const { data, error } = await supabase.functions.invoke('chatbot', {
        body: { 
          message: transcript,
          isVoiceMessage: true,
          language: language
        }
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
        
        if (autoSpeak && voiceEnabled) {
          speakText(botMessage.text);
        }
      }
    } catch (error) {
      console.error('Voice processing error:', error);
      await handleOfflineMessage(transcript, 'voice');
    } finally {
      setIsLoading(false);
    }
  };

  // Offline Mode Functions
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
      text: "🔄 I'm currently offline, but I've saved your message. I'll respond as soon as we're back online.",
      isBot: true,
      timestamp: new Date(),
      type: 'text'
    };
    
    setMessages(prev => [...prev, offlineResponse]);
  };

  const processOfflineQueue = async () => {
    if (offlineQueue.length === 0) return;

    for (const queuedMessage of offlineQueue) {
      try {
        const { data, error } = await supabase.functions.invoke('chatbot', {
          body: { 
            message: queuedMessage.message,
            isOfflineMessage: true,
            type: queuedMessage.type
          }
        });

        if (!error && data.success) {
          const botMessage: Message = {
            id: (Date.now() + 1).toString(),
            text: `📡 Response to offline message: ${data.reply}`,
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
        <h2 className="text-2xl md:text-3xl font-bold text-foreground">Farm Assistant</h2>
        <p className="text-sm md:text-base text-muted-foreground">
          {language === 'hindi' 
            ? "आपका व्यक्तिगत कृषि विशेषज्ञ - पशु स्वास्थ्य और खेती प्रबंधन में सहायता के लिए। किसी भी भाषा में बात करें!"
            : language === 'bengali'
            ? "আপনার ব্যক্তিগত কৃষি বিশেষজ্ঞ - পশু স্বাস্থ্য এবং খামার ব্যবস্থাপনার জন্য। যেকোনো ভাষায় কথা বলুন!"
            : "Your personal farming expert - Ask in any language including Hinglish!"
          }
        </p>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="h-[500px] md:h-[600px] flex flex-col overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary/20">
        <CardHeader className="flex-shrink-0 pb-4 border-b border-border transition-all duration-300">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <motion.div whileHover={iconVariants.hover}>
                <Bot className="h-5 w-5 text-primary" />
              </motion.div>
              <span>Smart Farm Assistant</span>
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
          <ScrollArea className="flex-1 h-full" ref={scrollAreaRef}>
            <div className="p-4 space-y-4 min-h-full">
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
                    <motion.div 
                      className="flex-shrink-0 w-6 h-6 md:w-8 md:h-8 rounded-full bg-primary/10 flex items-center justify-center"
                      whileHover={iconVariants.hover}
                    >
                      <Bot className="h-3 w-3 md:h-4 md:w-4 text-primary" />
                    </motion.div>
                  )}
                  
                  <motion.div
                    className={`max-w-[75%] md:max-w-[70%] word-wrap break-words rounded-lg px-3 py-2 md:px-4 md:py-3 transition-all duration-300 ${
                      message.isBot
                        ? 'bg-muted text-foreground hover:shadow-md'
                        : 'bg-primary text-primary-foreground hover:shadow-md'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    {message.type === 'image' && message.imageUrl && (
                      <div className="mb-2">
                        <img 
                          src={message.imageUrl} 
                          alt="Uploaded image" 
                          className="max-w-full h-auto rounded-lg max-h-48 object-cover"
                        />
                      </div>
                    )}
                    
                    {message.type === 'voice' && message.audioUrl && (
                      <div className="mb-2">
                        <audio controls className="w-full max-w-xs">
                          <source src={message.audioUrl} type="audio/wav" />
                          Your browser does not support the audio element.
                        </audio>
                      </div>
                    )}
                    
                    <p className="whitespace-pre-wrap text-xs md:text-sm leading-relaxed break-words">{message.text}</p>
                    <span className="text-[10px] md:text-xs opacity-70 mt-1 md:mt-2 block">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </motion.div>
                  
                  {!message.isBot && (
                    <motion.div 
                      className="flex-shrink-0 w-6 h-6 md:w-8 md:h-8 rounded-full bg-primary/10 flex items-center justify-center"
                      whileHover={iconVariants.hover}
                    >
                      <User className="h-3 w-3 md:h-4 md:w-4 text-primary" />
                    </motion.div>
                  )}
                </motion.div>
              ))}
              
              {isLoading && (
                <motion.div 
                  className="flex items-start gap-2 md:gap-3 w-full justify-start"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div 
                    className="flex-shrink-0 w-6 h-6 md:w-8 md:h-8 rounded-full bg-primary/10 flex items-center justify-center"
                    animate={{ rotate: [0, 10, 0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    <Bot className="h-3 w-3 md:h-4 md:w-4 text-primary" />
                  </motion.div>
                  <motion.div 
                    className="max-w-[75%] md:max-w-[70%] rounded-lg px-3 py-2 md:px-4 md:py-3 bg-muted text-foreground transition-all duration-300 hover:shadow-md"
                    animate={{ scale: [1, 1.02, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    <div className="flex items-center gap-1 md:gap-2">
                      <Loader2 className="h-3 w-3 md:h-4 md:w-4 animate-spin" />
                      <span className="text-xs md:text-sm">Assistant is typing...</span>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </div>
          </ScrollArea>
          
          <motion.div 
            className="flex-shrink-0 border-t border-border p-2 md:p-4"
            variants={itemVariants}
          >
            {/* Voice Recording and Image Upload Controls */}
            <div className="flex gap-1 md:gap-2 mb-2">
              <motion.div className="flex-1" whileHover={{ scale: 1.01 }} transition={{ duration: 0.2 }}>
                <Input
                  ref={inputRef}
                  placeholder={
                    language === 'hindi' 
                      ? "अपना संदेश टाइप करें..."
                      : language === 'bengali'
                      ? "আপনার বার্তা টাইপ করুন..."
                      : "Type your message..."
                  }
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading || isRecording}
                  className="w-full transition-all duration-300 focus:border-primary/50 text-xs md:text-sm h-9 md:h-10"
                />
              </motion.div>
              
              {/* Voice Recording Button */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={isRecording ? stopRecording : startRecording}
                  disabled={isLoading}
                  variant={isRecording ? "destructive" : "outline"}
                  className="px-2 md:px-3 transition-all duration-300 h-9 md:h-10 w-9 md:w-10"
                  size={isMobile ? "sm" : "default"}
                >
                  {isRecording ? (
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                    >
                      <MicOff className="h-3 w-3 md:h-4 md:w-4" />
                    </motion.div>
                  ) : (
                    <Mic className="h-3 w-3 md:h-4 md:w-4" />
                  )}
                </Button>
              </motion.div>
              
              {/* Image Upload Button */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading || isRecording}
                  variant="outline"
                  className="px-2 md:px-3 transition-all duration-300 h-9 md:h-10 w-9 md:w-10"
                  size={isMobile ? "sm" : "default"}
                >
                  <ImageIcon className="h-3 w-3 md:h-4 md:w-4" />
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </motion.div>
              
              {/* Send Message Button */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  onClick={sendMessage} 
                  disabled={isLoading || !inputMessage.trim() || isRecording}
                  className="px-2 md:px-3 transition-all duration-300 h-9 md:h-10 w-9 md:w-10"
                  size={isMobile ? "sm" : "default"}
                >
                  {isLoading ? (
                    <Loader2 className="h-3 w-3 md:h-4 md:w-4 animate-spin" />
                  ) : (
                    <motion.div whileHover={{ rotate: 15 }} transition={{ duration: 0.2 }}>
                      <Send className="h-3 w-3 md:h-4 md:w-4" />
                    </motion.div>
                  )}
                </Button>
              </motion.div>
            </div>
            
            <motion.p 
              className="text-xs text-muted-foreground"
              initial={{ opacity: 0.8 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {isRecording ? (
                <span className="text-red-500 font-medium">
                  🎤 {language === 'hindi'
                    ? "रिकॉर्डिंग... बात करें और समाप्त होने पर स्टॉप दबाएं"
                    : language === 'bengali'
                    ? "রেকর্ডিং... কথা বলুন এবং শেষ হলে স্টপ চাপুন"
                    : "Recording... Speak now and click stop when done"
                  }
                </span>
              ) : (
                language === 'hindi'
                  ? "💬 टाइप करें, 🎤 आवाज भेजें, या 📷 फोटो अपलोड करें - हिंदी, अंग्रेजी या हिंग्लिश में!"
                  : language === 'bengali'
                  ? "💬 টাইপ করুন, 🎤 ভয়েস পাঠান, বা 📷 ছবি আপলোড করুন - যেকোনো ভাষায়!"
                  : "💬 Type, 🎤 send voice, or 📷 upload image - in any language!"
              )}
            </motion.p>
          </motion.div>
        </CardContent>
      </Card>
      </motion.div>
    </motion.div>
  );
};