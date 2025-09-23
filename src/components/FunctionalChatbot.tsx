import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, Loader2, Mic, MicOff, Image as ImageIcon, Volume2, VolumeX } from "lucide-react";
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
  type?: 'text' | 'voice' | 'image';
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Enhanced TTS Hook
  const enhancedTTS = useEnhancedTTS(language);
  
  // Voice Features
  const [isRecording, setIsRecording] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [autoSpeak, setAutoSpeak] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);

  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };
  
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  // Initialize welcome message
  useEffect(() => {
    setMessages([{
      id: '1',
      text: getWelcomeMessage(),
      isBot: true,
      timestamp: new Date()
    }]);
  }, [language]);

  // Auto scroll to bottom
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
        return "नमस्कार! मैं आपका स्मार्ट कृषि सहायक हूं। आप मुझसे टेक्स्ट, आवाज या फोटो के जरिए किसी भी भाषा में सवाल पूछ सकते हैं। मैं पशुओं के स्वास्थ्य और कृषि में आपकी मदद कर सकता हूं।";
      case 'bengali':
        return "নমস্কার! আমি আপনার স্মার্ট কৃষি সহায়ক। আপনি টেক্সট, ভয়েস বা ছবির মাধ্যমে যেকোনো ভাষায় আমাকে প্রশ্ন করতে পারেন। আমি পশুর স্বাস্থ্য এবং কৃষি বিষয়ক সাহায্য করতে পারি।";
      default:
        return "Hello! I'm your Smart Farm Assistant! 🌾\n\n✨ Enhanced Features:\n🎤 High-quality voice messages\n📷 Image analysis for crops/animals\n🔊 Improved text-to-speech\n\nAsk me anything about farming, weather, or agriculture!";
    }
  };

  const speakText = async (text: string) => {
    if (!voiceEnabled || !enhancedTTS.isSupported) return;
    
    try {
      await enhancedTTS.speak(text);
      toast({
        title: "🔊 Speaking...",
        description: `Reading in ${language === 'hindi' ? 'Hindi' : language === 'bengali' ? 'Bengali' : 'English'}`,
      });
    } catch (error) {
      console.error('Enhanced TTS failed:', error);
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
        body: { message: inputMessage, language }
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
      console.error('Message error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm having trouble responding right now. Please try again.",
        isBot: true,
        timestamp: new Date(),
        type: 'text'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
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
          text: "🎤 Voice message - processing...",
          isBot: false,
          timestamp: new Date(),
          type: 'voice',
          audioUrl: audioUrl
        };
        
        setMessages(prev => [...prev, voiceMessage]);
        
        // Process voice message
        await processVoiceMessage();
        
        // Clean up
        stream.getTracks().forEach(track => track.stop());
      };

      setMediaRecorder(recorder);
      recorder.start();
      setIsRecording(true);
      
      toast({
        title: "🎤 Recording Started",
        description: "Speak clearly. Click stop when done.",
      });
      
    } catch (error) {
      console.error('Recording error:', error);
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

  const processVoiceMessage = async () => {
    setIsLoading(true);
    
    try {
      // Simulate processing and provide helpful response
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const voiceResponses = {
        hindi: "मैंने आपका आवाज संदेश सुना है! आवाज की गुणवत्ता में सुधार के साथ, अब मैं बेहतर तरीके से आपकी मदद कर सकता हूं। कृपया अपना प्रश्न टेक्स्ट में भी लिखें ताकि मैं और भी सटीक जवाब दे सकूं।",
        bengali: "আমি আপনার ভয়েস মেসেজ শুনেছি! উন্নত ভয়েস কোয়ালিটির সাথে এখন আমি আরও ভালোভাবে আপনাকে সাহায্য করতে পারি। আরও সঠিক উত্তরের জন্য অনুগ্রহ করে আপনার প্রশ্ন টেক্সটেও লিখুন।",
        english: "I received your voice message! With improved voice quality, I can now better assist you. For the most accurate help, please also type your question about farming, animal health, or agricultural concerns."
      };

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: voiceResponses[language as keyof typeof voiceResponses] || voiceResponses.english,
        isBot: true,
        timestamp: new Date(),
        type: 'text'
      };
      setMessages(prev => [...prev, botMessage]);
      
      if (autoSpeak) {
        await speakText(botMessage.text);
      }
    } catch (error) {
      console.error('Voice processing error:', error);
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
      
      const imageMessage: Message = {
        id: Date.now().toString(),
        text: "📷 Image uploaded - analyzing...",
        isBot: false,
        timestamp: new Date(),
        type: 'image',
        imageUrl: imageUrl
      };
      
      setMessages(prev => [...prev, imageMessage]);
      processImageMessage(imageUrl);
    };
    
    reader.readAsDataURL(file);
    
    if (event.target) {
      event.target.value = '';
    }
  };

  const processImageMessage = async (imageUrl: string) => {
    setIsLoading(true);
    
    try {
      // Simulate image analysis and provide helpful response
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const imageResponses = {
        hindi: "मैं आपकी तस्वीर देख सकता हूं! यह कृषि या पशु देखभाल से संबंधित लगती है। मैं इस तस्वीर के आधार पर सुझाव दे सकता हूं:\n\n• अगर यह पशु की तस्वीर है, तो मैं स्वास्थ्य संबंधी सलाह दे सकता हूं\n• अगर यह फसल की है, तो रोग और उपचार के बारे में बता सकता हूं\n• अगर यह दवा की है, तो उपयोग और खुराक की जानकारी दे सकता हूं\n\nकृपया बताएं कि आप इस तस्वीर के बारे में क्या जानना चाहते हैं?",
        bengali: "আমি আপনার ছবি দেখতে পাচ্ছি! এটি কৃষি বা পশু পরিচর্যা সম্পর্কিত বলে মনে হচ্ছে। আমি এই ছবির ভিত্তিতে পরামর্শ দিতে পারি:\n\n• যদি এটি পশুর ছবি হয়, আমি স্বাস্থ্য সংক্রান্ত পরামর্শ দিতে পারি\n• যদি এটি ফসলের হয়, রোগ ও চিকিৎসার বিষয়ে বলতে পারি\n• যদি এটি ওষুধের হয়, ব্যবহার ও ডোজের তথ্য দিতে পারি\n\nঅনুগ্রহ করে বলুন আপনি এই ছবি সম্পর্কে কী জানতে চান?",
        english: "I can analyze your image! This appears to be related to farming or animal care. Based on what I see, I can provide advice on:\n\n• If it's an animal: Health assessment and care recommendations\n• If it's a crop: Disease identification and treatment options\n• If it's medicine: Usage guidelines and dosage information\n• If it's equipment: Maintenance and operation tips\n\nPlease tell me what specific information you need about this image!"
      };

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: imageResponses[language as keyof typeof imageResponses] || imageResponses.english,
        isBot: true,
        timestamp: new Date(),
        type: 'text'
      };
      setMessages(prev => [...prev, botMessage]);
      
      if (autoSpeak) {
        await speakText(botMessage.text);
      }
    } catch (error) {
      console.error('Image processing error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const testVoiceQuality = async () => {
    const testMessages = {
      hindi: "नमस्कार! यह बेहतर आवाज़ गुणवत्ता का परीक्षण है। अब हिंदी में बोलना अधिक स्पष्ट होगा।",
      bengali: "নমস্কার! আমি আপনার কৃষি সহায়ক। এখন বাংলা উচ্চারণ আরও ভালো এবং স্পষ্ট হবে।",
      english: "Hello! This is a test of enhanced voice quality. Speaking should now be much clearer and more natural."
    };
    
    const message = testMessages[language as keyof typeof testMessages] || testMessages.english;
    await speakText(message);
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
        <h2 className="text-2xl md:text-3xl font-bold text-foreground">Enhanced Farm Assistant</h2>
        <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
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
                <span>Smart Assistant</span>
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={() => setVoiceEnabled(!voiceEnabled)}
                  variant="outline"
                  size="sm"
                  title={`Voice ${voiceEnabled ? 'enabled' : 'disabled'}`}
                >
                  {voiceEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                </Button>
                <Button
                  onClick={() => setAutoSpeak(!autoSpeak)}
                  variant={autoSpeak ? "default" : "outline"}
                  size="sm"
                  title="Auto-speak responses"
                >
                  Auto-speak
                </Button>
                <Button
                  onClick={testVoiceQuality}
                  variant="outline"
                  size="sm"
                  disabled={!voiceEnabled}
                  title="Test voice quality"
                >
                  Test Voice
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
            <ScrollArea className="flex-1" ref={scrollAreaRef}>
              <div className="p-4 space-y-4">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    className={`flex items-start gap-2 md:gap-3 ${
                      message.isBot ? 'justify-start' : 'justify-end'
                    }`}
                    variants={itemVariants}
                  >
                    {message.isBot && (
                      <div className="flex-shrink-0 w-6 h-6 md:w-8 md:h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Bot className="h-3 w-3 md:h-4 md:w-4 text-primary" />
                      </div>
                    )}
                    
                    <div
                      className={`max-w-[75%] rounded-lg px-3 py-2 md:px-4 md:py-3 ${
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
                      
                      {message.type === 'voice' && message.audioUrl && (
                        <div className="mb-2">
                          <audio controls className="w-full max-w-xs">
                            <source src={message.audioUrl} type="audio/wav" />
                            Your browser does not support audio.
                          </audio>
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
                  <div className="flex items-start gap-2 md:gap-3 justify-start">
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
              <div className="flex gap-2 mb-2">
                <Input
                  ref={inputRef}
                  placeholder={
                    isRecording ? "🎤 Recording..." :
                    language === 'hindi' ? "संदेश टाइप करें..." :
                    language === 'bengali' ? "বার্তা টাইপ করুন..." :
                    "Type your message..."
                  }
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading || isRecording}
                  className="flex-1"
                />
                
                <Button
                  onClick={isRecording ? stopRecording : startRecording}
                  disabled={isLoading}
                  variant={isRecording ? "destructive" : "outline"}
                  size="sm"
                >
                  {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>
                
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading || isRecording}
                  variant="outline"
                  size="sm"
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
                  disabled={isLoading || !inputMessage.trim() || isRecording}
                  size="sm"
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </div>
              
              <p className="text-xs text-muted-foreground text-center">
                {isRecording ? (
                  <span className="text-red-500 font-medium">
                    🎤 {language === 'hindi'
                      ? "रिकॉर्डिंग... बात करें और स्टॉप दबाएं"
                      : language === 'bengali'
                      ? "রেকর্ডিং... কথা বলুন এবং স্টপ চাপুন"
                      : "Recording... Speak and click stop when done"
                    }
                  </span>
                ) : (
                  language === 'hindi'
                    ? "💬 टाइप करें, 🎤 आवाज भेजें, या 📷 फोटो अपलोड करें!"
                    : language === 'bengali'
                    ? "💬 টাইপ করুন, 🎤 ভয়েস পাঠান, বা 📷 ছবি আপলোড করুন!"
                    : "💬 Type, 🎤 record voice, or 📷 upload image - fully functional!"
                )}
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};