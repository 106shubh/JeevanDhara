import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { motion, Variants } from "framer-motion";

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

export const Chatbot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { language, t } = useLanguage();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  // Check for mobile screen size on resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
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

  useEffect(() => {
    // Add welcome message
    setMessages([{
      id: '1',
      text: getWelcomeMessage(),
      isBot: true,
      timestamp: new Date()
    }]);
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
      timestamp: new Date()
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
          timestamp: new Date()
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
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
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
          <CardTitle className="flex items-center gap-2">
            <motion.div whileHover={iconVariants.hover}>
              <Bot className="h-5 w-5 text-primary" />
            </motion.div>
            Chat with Farm Assistant
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
                  disabled={isLoading}
                  className="w-full transition-all duration-300 focus:border-primary/50 text-xs md:text-sm h-9 md:h-10"
                />
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  onClick={sendMessage} 
                  disabled={isLoading || !inputMessage.trim()}
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
              {language === 'hindi'
                ? "पशु स्वास्थ्य, खेती प्रबंधन के बारे में पूछें - हिंदी, अंग्रेजी या हिंग्लिश में!"
                : language === 'bengali'
                ? "পশু স্বাস্থ্য, খামার ব্যবস্থাপনা সম্পর্কে জিজ্ঞাসা করুন - যেকোনো ভাষায়!"
                : "Ask about animal health, farm management - in any language or Hinglish!"
              }
            </motion.p>
          </motion.div>
        </CardContent>
      </Card>
      </motion.div>
    </motion.div>
    );
};