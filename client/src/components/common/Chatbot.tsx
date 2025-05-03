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

// Create a sample date for the initial message that matches the image time
const initialMessageTime = new Date();
initialMessageTime.setHours(19, 57, 0, 0); // 07:57 PM

const initialMessages: Message[] = [
  {
    id: "1",
    content: "Hi there! 👋 I'm your Pussco assistant. How can I help you today?",
    sender: "bot",
    timestamp: initialMessageTime, // Use the specific time
  }
];

const commonQuestions = [
  "How do I create a salon website?",
  "What are your pricing plans?",
  "Can I customize my website?"
];

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(true); // Start open to match image
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
      return "Our pricing plans start at $79/month for the Basic plan, $149/month for the Professional plan, and $239/month for the Premium plan. All plans come with a 14-day free trial. You can check out the full details on our Pricing page.";
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
      return "Hello! How can I help you with Website today?";
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
    // Set the input value and immediately call send
    // Using a minimal timeout to ensure state update happens before send
    setInputValue(question);
    setTimeout(() => {
      handleSendMessage();
    }, 0);
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setIsMinimized(false); // Always expand when toggling from closed
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
          className="rounded-full w-14 h-14 shadow-lg bg-gradient-to-r from-purple-600 to-blue-500 border-0 flex items-center justify-center hover:opacity-90 transition-opacity"
        >
          <MessageSquare className="h-6 w-6 text-white" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className={cn(
          "bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg shadow-xl transition-all duration-300 overflow-hidden flex flex-col", // Added flex flex-col
          isMinimized ? "w-72 h-16" : "w-80 sm:w-96 h-[32rem] max-h-[calc(100vh-6rem)]"
        )}>
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-500 p-3 flex justify-between items-center flex-shrink-0"> {/* Added flex-shrink-0 */}
            <div className="flex items-center text-white">
              {isMinimized ? (
                <div className="flex items-center cursor-pointer" onClick={expandChat}>
                  {/* FIX 1: Changed AvatarFallback classes */}
                  <Avatar className="h-8 w-8 mr-2 border-2 border-white/30">
                    <AvatarImage src="" alt="Bot" />
                    <AvatarFallback className="bg-purple-700 text-white">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">Pussco Assistant</p>
                  </div>
                </div>
              ) : (
                <>
                  {/* FIX 1: Changed AvatarFallback classes */}
                  <Avatar className="h-8 w-8 mr-2 border-2 border-white/30">
                    <AvatarImage src="" alt="Bot" />
                    <AvatarFallback className="bg-purple-700 text-white">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">Pussco Assistant</p>
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
                  aria-label="Minimize chat"
                >
                  <ChevronDown className="h-5 w-5" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-white hover:bg-white/20 rounded-full"
                onClick={toggleChat}
                aria-label="Close chat"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Chat Messages */}
              {/* Added flex-grow and min-h-0 for proper scrolling */}
              <div className="flex-grow p-4 overflow-y-auto bg-white dark:bg-gray-950 min-h-0">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        "flex items-start", // Use items-start for avatar alignment
                        message.sender === "user" ? "justify-end" : "justify-start"
                      )}
                    >
                      {message.sender === "bot" && (
                        <Avatar className="h-8 w-8 mr-2 flex-shrink-0">
                          {/* Bot avatar uses purple background */}
                          <AvatarFallback className="bg-purple-600 text-white">
                            <Bot className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={cn(
                          "max-w-[80%] rounded-lg px-3 py-2", // Adjusted padding slightly
                          message.sender === "user"
                            ? "bg-purple-600 text-white"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                        )}
                      >
                        <p className="text-sm leading-snug">{message.content}</p>
                        {/* FIX 2: Added text-right for timestamp */}
                        <p className="text-xs opacity-70 mt-1 text-right">
                          {message.timestamp.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })}
                        </p>
                      </div>
                      {message.sender === "user" && (
                        <Avatar className="h-8 w-8 ml-2 flex-shrink-0">
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
                          <div className="h-1.5 w-1.5 rounded-full bg-purple-600 animate-bounce"></div>
                          <div className="h-1.5 w-1.5 rounded-full bg-purple-600 animate-bounce [animation-delay:0.1s]"></div>
                          <div className="h-1.5 w-1.5 rounded-full bg-purple-600 animate-bounce [animation-delay:0.2s]"></div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Quick Questions */}
              {/* Added flex-shrink-0 */}
              <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700 overflow-x-auto whitespace-nowrap flex-shrink-0" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
                <div className="flex space-x-2">
                  {commonQuestions.map((question, index) => (
                    <button
                      key={index}
                      className="text-xs px-3 py-1.5 border border-gray-300 dark:border-gray-700 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 whitespace-nowrap transition-colors text-gray-700 dark:text-gray-300"
                      onClick={() => handleQuickQuestion(question)}
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat Input */}
              {/* Added flex-shrink-0 */}
              <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 flex-shrink-0">
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
                    className="flex-grow bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:ring-purple-500 focus:border-purple-500 dark:focus:ring-purple-600 dark:focus:border-purple-600"
                    aria-label="Chat message input"
                  />
                  <Button
                    type="submit"
                    size="icon"
                    className="bg-gradient-to-r from-purple-600 to-blue-500 text-white border-0 rounded-md flex-shrink-0 hover:opacity-90 transition-opacity disabled:opacity-50"
                    disabled={!inputValue.trim()}
                    aria-label="Send message"
                  >
                    <Send className="h-4 w-4" />
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