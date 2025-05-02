import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  MessageSquare, 
  ChevronDown, 
  X, 
  Send, 
  Bot, 
  User
} from "lucide-react";
import { cn } from "@/lib/utils";

type Message = {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
};

const initialMessages: Message[] = [
  {
    id: "1",
    content: "Hi there! 👋 I'm your SalonSite assistant. How can I help you today?",
    sender: "bot",
    timestamp: new Date(),
  }
];

const commonQuestions = [
  "How do I create a salon website?",
  "What are your pricing plans?",
  "How long is the free trial?",
  "Can I customize my website?"
];

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized, messages]);
  
  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue.trim(),
      sender: "user",
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    
    const currentInput = inputValue.trim();
    setInputValue("");
    setIsTyping(true);
    
    // Simulate bot response
    setTimeout(() => {
      const botResponse = getBotResponse(currentInput);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: botResponse,
        sender: "bot",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
  };
  
  const getBotResponse = (userMessage: string): string => {
    const lowercaseMessage = userMessage.toLowerCase();
    
    if (lowercaseMessage.includes("pricing") || lowercaseMessage.includes("cost") || lowercaseMessage.includes("price")) {
      return "Our pricing plans start at $29/month for the Basic plan, $49/month for the Professional plan, and $99/month for the Premium plan. All plans come with a 14-day free trial. You can check out the full details on our Pricing page.";
    }
    
    if (lowercaseMessage.includes("trial") || lowercaseMessage.includes("free")) {
      return "We offer a 14-day free trial on all our subscription plans. No credit card required to start your trial!";
    }
    
    if (lowercaseMessage.includes("create") || lowercaseMessage.includes("setup") || lowercaseMessage.includes("start")) {
      return "Getting started is easy! Just sign up for an account, choose a template for your salon website, customize it with your salon's information, and you're ready to go. Would you like me to guide you through the process?";
    }
    
    if (lowercaseMessage.includes("custom") || lowercaseMessage.includes("edit") || lowercaseMessage.includes("change")) {
      return "Yes, all our templates are fully customizable. You can change colors, fonts, images, layout, and more. You have complete control over how your salon website looks!";
    }
    
    if (lowercaseMessage.includes("hello") || lowercaseMessage.includes("hi") || lowercaseMessage.includes("hey")) {
      return "Hello! How can I help you with SalonSite today?";
    }
    
    if (lowercaseMessage.includes("thank")) {
      return "You're welcome! Is there anything else I can help you with?";
    }
    
    if (lowercaseMessage.includes("how long") || lowercaseMessage.includes("time")) {
      return "Setting up your salon website typically takes less than 30 minutes! Our templates and easy-to-use editor make the process quick and simple.";
    }
    
    return "I'm not sure I understand. Could you please rephrase your question? You can also check our FAQ section for common questions, or contact our support team for more help.";
  };
  
  const handleQuickQuestion = (question: string) => {
    setInputValue(question);
    setTimeout(() => {
      handleSendMessage();
    }, 10);
  };
  
  const toggleChat = () => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
  };
  
  const minimizeChat = () => {
    setIsMinimized(true);
  };
  
  const expandChat = () => {
    setIsMinimized(false);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
      {/* Chatbot Toggle Button */}
      {!isOpen && (
        <Button 
          onClick={toggleChat} 
          className="rounded-full w-14 h-14 shadow-lg gradient-bg border-0 flex items-center justify-center"
        >
          <MessageSquare className="h-6 w-6 text-white" />
        </Button>
      )}
      
      {/* Chat Window */}
      {isOpen && (
        <div className={cn(
          "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-xl transition-all duration-300 overflow-hidden",
          isMinimized ? "w-72 h-16" : "w-80 sm:w-96 h-[32rem] max-h-[calc(100vh-6rem)]"
        )}>
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-500 p-3 flex justify-between items-center">
            <div className="flex items-center text-white">
              {isMinimized ? (
                <div className="flex items-center cursor-pointer" onClick={expandChat}>
                  <Avatar className="h-8 w-8 mr-2 border-2 border-white/20">
                    <AvatarImage src="" alt="Bot" />
                    <AvatarFallback className="bg-white text-purple-600">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">SalonSite Assistant</p>
                  </div>
                </div>
              ) : (
                <>
                  <Avatar className="h-8 w-8 mr-2 border-2 border-white/20">
                    <AvatarImage src="" alt="Bot" />
                    <AvatarFallback className="bg-white text-purple-600">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">SalonSite Assistant</p>
                    <p className="text-xs opacity-80">We typically reply in a few minutes</p>
                  </div>
                </>
              )}
            </div>
            <div className="flex items-center space-x-1">
              {!isMinimized && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7 text-white hover:bg-white/20 rounded-full" 
                  onClick={minimizeChat}
                >
                  <ChevronDown className="h-5 w-5" />
                </Button>
              )}
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7 text-white hover:bg-white/20 rounded-full" 
                onClick={toggleChat}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          {!isMinimized && (
            <>
              {/* Chat Messages */}
              <div className="p-4 overflow-y-auto h-[calc(100%-8rem)] bg-white dark:bg-gray-900">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div 
                      key={message.id} 
                      className={cn(
                        "flex",
                        message.sender === "user" ? "justify-end" : "justify-start"
                      )}
                    >
                      {message.sender === "bot" && (
                        <Avatar className="h-8 w-8 mr-2 flex-shrink-0 mt-1">
                          <AvatarFallback className="bg-purple-600 text-white">
                            <Bot className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={cn(
                          "max-w-[80%] rounded-lg px-4 py-2",
                          message.sender === "user"
                            ? "bg-purple-600 text-white"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                        )}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className="text-xs opacity-60 mt-1">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      {message.sender === "user" && (
                        <Avatar className="h-8 w-8 ml-2 flex-shrink-0 mt-1">
                          <AvatarFallback className="bg-blue-500 text-white">
                            <User className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex items-center">
                      <Avatar className="h-8 w-8 mr-2 flex-shrink-0">
                        <AvatarFallback className="bg-purple-600 text-white">
                          <Bot className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-2">
                        <div className="flex space-x-1">
                          <div className="h-2 w-2 rounded-full bg-purple-600 animate-bounce"></div>
                          <div className="h-2 w-2 rounded-full bg-purple-600 animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                          <div className="h-2 w-2 rounded-full bg-purple-600 animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
              </div>
              
              {/* Quick Questions */}
              <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-800 overflow-x-auto whitespace-nowrap" style={{ msOverflowStyle: "none", scrollbarWidth: "none" }}>
                <div className="flex space-x-2">
                  {commonQuestions.map((question, index) => (
                    <button
                      key={index}
                      className="text-xs px-3 py-1.5 border border-gray-200 dark:border-gray-800 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 whitespace-nowrap transition-colors"
                      onClick={() => handleQuickQuestion(question)}
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Chat Input */}
              <div className="p-3 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }} 
                  className="flex items-center space-x-2"
                >
                  <Input
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-grow"
                  />
                  <Button 
                    type="submit" 
                    size="icon" 
                    className="bg-gradient-to-r from-purple-600 to-blue-500 border-0"
                    disabled={!inputValue.trim()}
                  >
                    <Send className="h-4 w-4 text-white" />
                  </Button>
                </form>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}