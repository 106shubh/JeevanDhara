import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";

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
        return "नमस्कार! मैं आपका कृषि सहायक हूं। मैं पशु स्वास्थ्य, खेती प्रबंधन, दवा उपयोग और MRL अनुपालन के बारे में आपकी मदद कर सकता हूं। आप मुझसे कोई भी प्रश्न पूछ सकते हैं।";
      case 'bengali':
        return "নমস্কার! আমি আপনার কৃষি সহায়ক। আমি পশু স্বাস্থ্য, খামার ব্যবস্থাপনা, ওষুধ ব্যবহার এবং MRL সম্মতি সম্পর্কে সাহায্য করতে পারি। আমাকে যেকোনো প্রশ্ন জিজ্ঞাসা করুন।";
      default:
        return "Hello! I'm your Farm Assistant. I can help you with animal health, farm management, medication usage, and MRL compliance. Feel free to ask me anything!";
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
        body: { 
          message: inputMessage,
          language: language === 'english' ? 'English' : language === 'hindi' ? 'Hindi' : 'Bengali'
        }
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
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-foreground">Farm Assistant</h2>
        <p className="text-muted-foreground">
          {language === 'hindi' 
            ? "आपका व्यक्तिगत कृषि विशेषज्ञ - पशु स्वास्थ्य और खेती प्रबंधन में सहायता के लिए"
            : language === 'bengali'
            ? "আপনার ব্যক্তিগত কৃষি বিশেষজ্ঞ - পশু স্বাস্থ্য এবং খামার ব্যবস্থাপনার জন্য"
            : "Your personal farming expert - Ask about animal health, farm management, and more"
          }
        </p>
      </div>

      <Card className="h-[600px] flex flex-col overflow-hidden">
        <CardHeader className="flex-shrink-0 pb-4 border-b border-border">
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            Chat with Farm Assistant
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
          <ScrollArea className="flex-1 h-full" ref={scrollAreaRef}>
            <div className="p-4 space-y-4 min-h-full">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start gap-3 w-full ${
                    message.isBot ? 'justify-start' : 'justify-end'
                  }`}
                >
                  {message.isBot && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                  )}
                  
                  <div
                    className={`max-w-[70%] word-wrap break-words rounded-lg px-4 py-3 ${
                      message.isBot
                        ? 'bg-muted text-foreground'
                        : 'bg-primary text-primary-foreground'
                    }`}
                  >
                    <p className="whitespace-pre-wrap text-sm leading-relaxed break-words">{message.text}</p>
                    <span className="text-xs opacity-70 mt-2 block">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  
                  {!message.isBot && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                  )}
                </div>
              ))}
              
              {isLoading && (
                <div className="flex items-start gap-3 w-full">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                  <div className="bg-muted text-foreground rounded-lg px-4 py-3 max-w-[70%]">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">Assistant is typing...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          
          <div className="flex-shrink-0 border-t border-border p-4">
            <div className="flex gap-2 mb-2">
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
                className="flex-1"
              />
              <Button 
                onClick={sendMessage} 
                disabled={isLoading || !inputMessage.trim()}
                className="px-3"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              {language === 'hindi'
                ? "पशु स्वास्थ्य, खेती प्रबंधन, या दवा के बारे में पूछें"
                : language === 'bengali'
                ? "পশু স্বাস্থ্য, খামার ব্যবস্থাপনা বা ওষুধ সম্পর্কে জিজ্ঞাসা করুন"
                : "Ask about animal health, farm management, or medications"
              }
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};