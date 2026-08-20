import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, NavigationTab } from '../types';
import {
  Bot,
  X,
  Send,
  Sun,
  Sparkles,
  RefreshCw,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Globe,
  Languages,
  Check
} from 'lucide-react';

interface AIChatbotProps {
  isOpen: boolean;
  onToggle: () => void;
  setActiveTab: (tab: NavigationTab) => void;
}

const SUPPORTED_LANGUAGES = [
  { name: 'English', native: 'English', code: 'en-IN' },
  { name: 'Telugu', native: 'తెలుగు', code: 'te-IN' },
  { name: 'Hindi', native: 'हिंदी', code: 'hi-IN' },
  { name: 'Tamil', native: 'தமிழ்', code: 'ta-IN' },
  { name: 'Kannada', native: 'ಕನ್ನಡ', code: 'kn-IN' },
  { name: 'Marathi', native: 'मराठी', code: 'mr-IN' },
  { name: 'Bengali', native: 'বাংলা', code: 'bn-IN' },
  { name: 'Gujarati', native: 'ગુજરાતી', code: 'gu-IN' },
];

const SUGGESTED_QUESTIONS: Record<string, string[]> = {
  English: [
    'How much does 1 kW solar cost?',
    'How much subsidy can I get?',
    'What documents are required?',
    'What is my application status?',
  ],
  Telugu: [
    '1 kW సోలార్ ధరకు ఎంత ఖర్చు అవుతుంది?',
    'నాకు ఎంత సబ్సిడీ లభిస్తుంది?',
    'ఏ ఏ పత్రాలు అవసరం?',
    'నా అప్లికేషన్ స్టేటస్ ఏమిటి?',
  ],
  Hindi: [
    '1 kW सोलर सिस्टम की लागत कितनी है?',
    'मुझे कितनी सब्सिडी मिलेगी?',
    'कौन से दस्तावेज आवश्यक हैं?',
    'आवेदन की स्थिति कैसे जांचें?',
  ],
  Tamil: [
    '1 kW சோலார் அமைப்பின் விலை என்ன?',
    'எனக்கு எவ்வளவு மானியம் கிடைக்கும்?',
    'என்ன ஆவணங்கள் தேவை?',
    'விண்ணப்பத்தின் நிலை என்ன?',
  ],
  Kannada: [
    '1 kW ಸೋಲಾರ್ පද්ධತಿಯ ವೆಚ್ಚ ಎಷ್ಟು?',
    'ನನಗೆ ಎಷ್ಟು ಸಬ್ಸಿಡಿ ಸಿಗುತ್ತದೆ?',
    'ಯಾವ ದಾಖಲೆಗಳು ಬೇಕಾಗುತ್ತವೆ?',
    'ನನ್ನ ಅರ್ಜಿಯ ಸ್ಥಿತಿ ಏನು?',
  ],
  Marathi: [
    '1 kW सोलर सिस्टीमचा खर्च किती आहे?',
    'मला किती सबसिडी मिळेल?',
    'कोणती कागदपत्रे आवश्यक आहेत?',
    'माझ्या अर्जाची स्थिती काय आहे?',
  ],
  Bengali: [
    '1 kW সোলার সিস্টেমের খরচ কত?',
    'আমি কত ভর্তুকি পাব?',
    'কি কি নথিপত্র প্রয়োজন?',
    'আমার আবেদনের বর্তমান অবস্থা কি?',
  ],
  Gujarati: [
    '1 kW સોલર સિસ્ટમનો ખર્ચ કેટલો થાય?',
    'મને કેટલી સબસિડી મળશે?',
    'ક્યા દસ્તાવેજો જરૂરી છે?',
    'મારા આવેદનનું સ્ટેટસ શું છે?',
  ],
};

export const AIChatbot: React.FC<AIChatbotProps> = ({
  isOpen,
  onToggle,
  setActiveTab,
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState<string>('English');
  const [isVoiceOverAutoEnabled, setIsVoiceOverAutoEnabled] = useState<boolean>(true);
  const [currentlySpeakingId, setCurrentlySpeakingId] = useState<string | null>(null);
  const [isListening, setIsListening] = useState<boolean>(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'bot',
      text: '☀️ **Welcome to SolarConnect AI Assistant!**\n\nI am your 24/7 multilingual guide for rooftop solar installation, PM Surya Ghar central & state subsidies, AI document verification, and blockchain tracking.\n\nSelect your preferred language above to chat or listen via voice over!',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Clean up speech synthesis on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Text-To-Speech (Voice Over) Helper
  const speakText = (msgId: string, textToSpeak: string) => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis voiceover is not supported in this browser.');
      return;
    }

    if (currentlySpeakingId === msgId) {
      window.speechSynthesis.cancel();
      setCurrentlySpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();

    // Clean markdown symbols for clearer speech
    const cleanText = textToSpeak
      .replace(/\*\*/g, '')
      .replace(/#/g, '')
      .replace(/•/g, '')
      .replace(/`/g, '');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    const langObj = SUPPORTED_LANGUAGES.find((l) => l.name === selectedLanguage) || SUPPORTED_LANGUAGES[0];
    utterance.lang = langObj.code;

    // Try to pick a native voice if available
    const voices = window.speechSynthesis.getVoices();
    const matchingVoice = voices.find((v) => v.lang.startsWith(langObj.code.slice(0, 2)));
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    utterance.onstart = () => setCurrentlySpeakingId(msgId);
    utterance.onend = () => setCurrentlySpeakingId(null);
    utterance.onerror = () => setCurrentlySpeakingId(null);

    window.speechSynthesis.speak(utterance);
  };

  // Speech Recognition (Microphone Voice Input) Helper
  const toggleListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Try Google Chrome or Microsoft Edge.');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      const langObj = SUPPORTED_LANGUAGES.find((l) => l.name === selectedLanguage) || SUPPORTED_LANGUAGES[0];
      recognition.lang = langObj.code;
      recognition.interimResults = true;
      recognition.continuous = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        setInputText(transcript);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error('Failed to start speech recognition:', err);
      setIsListening(false);
    }
  };

  const handleSend = async (questionText?: string) => {
    const textToSend = questionText || inputText;
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!questionText) setInputText('');
    setLoading(false);
    setLoading(true);

    try {
      // Call backend Express /api/chat endpoint with Gemini 3.6 Flash & targetLanguage
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          targetLanguage: selectedLanguage,
          conversationHistory: messages.map((m) => ({ sender: m.sender, text: m.text })),
        }),
      });

      const data = await response.json();
      const botReply = data.reply || 'I am happy to guide you with your solar setup. Feel free to ask about costs or subsidy calculations!';

      const botMsgId = `bot-${Date.now()}`;
      const botMsg: ChatMessage = {
        id: botMsgId,
        sender: 'bot',
        text: botReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);

      // Auto Voice Over speech playback if enabled
      if (isVoiceOverAutoEnabled) {
        speakText(botMsgId, botReply);
      }
    } catch (err) {
      console.error('Chat error:', err);
      const fallbackMsgId = `bot-${Date.now()}`;
      const fallbackMsg: ChatMessage = {
        id: fallbackMsgId,
        sender: 'bot',
        text: '☀️ **SolarConnect Subsidy Quick Guide:**\n\n• **1 kW System:** Costs ~₹48,000. Get ₹30,000 central subsidy.\n• **2 kW System:** Costs ~₹95,000. Get ₹60,000 central subsidy.\n• **3 kW+ System:** Costs ~₹1,42,000. Get ₹78,000 maximum central subsidy.\n\nClick **"Solar Calculator"** in the top menu to estimate your exact savings!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
      if (isVoiceOverAutoEnabled) {
        speakText(fallbackMsgId, fallbackMsg.text);
      }
    } finally {
      setLoading(false);
    }
  };

  const currentSuggestedQuestions = SUGGESTED_QUESTIONS[selectedLanguage] || SUGGESTED_QUESTIONS['English'];

  return (
    <>
      {/* Floating Toggle Button (Bottom-Right) */}
      {!isOpen && (
        <button
          onClick={onToggle}
          className="fixed bottom-6 right-6 z-50 p-3.5 bg-gradient-to-r from-emerald-700 to-teal-800 hover:from-emerald-800 hover:to-teal-900 text-white font-bold rounded-full shadow-2xl shadow-emerald-900/40 hover:scale-105 transition-all flex items-center gap-2 group border border-emerald-500/30"
          title="Open SolarConnect Multilingual AI Chatbot"
        >
          <div className="relative flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-300 rounded-full border-2 border-slate-950 animate-ping" />
          </div>
          <span className="text-xs font-extrabold pr-1 hidden sm:inline">SolarConnect AI</span>
        </button>
      )}

      {/* Floating Chat Widget Panel */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[420px] h-[600px] max-h-[88vh] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          
          {/* Header */}
          <div className="p-3.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                <Sun className="w-4 h-4 text-emerald-400 animate-spin" style={{ animationDuration: '15s' }} />
              </div>
              <div>
                <div className="text-xs font-black tracking-wide text-white flex items-center gap-1.5">
                  SolarConnect AI
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <div className="text-[10px] text-slate-400">Voice Over & Multilingual Assistant</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Auto Voice Over Toggle */}
              <button
                onClick={() => {
                  const nextState = !isVoiceOverAutoEnabled;
                  setIsVoiceOverAutoEnabled(nextState);
                  if (!nextState && 'speechSynthesis' in window) {
                    window.speechSynthesis.cancel();
                    setCurrentlySpeakingId(null);
                  }
                }}
                className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition-all ${
                  isVoiceOverAutoEnabled
                    ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                }`}
                title={isVoiceOverAutoEnabled ? 'Auto Voiceover Enabled (Click to Mute)' : 'Auto Voiceover Muted'}
              >
                {isVoiceOverAutoEnabled ? <Volume2 className="w-3.5 h-3.5 text-emerald-400 animate-pulse" /> : <VolumeX className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={onToggle}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Language & Voice Toolbar */}
          <div className="px-3 py-2 bg-slate-900/95 border-b border-slate-800 flex items-center justify-between gap-2 text-xs text-slate-300">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-300">
              <Globe className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="font-semibold text-[10px] uppercase tracking-wider text-slate-400">Language:</span>
            </div>

            <select
              value={selectedLanguage}
              onChange={(e) => {
                setSelectedLanguage(e.target.value);
                if ('speechSynthesis' in window) {
                  window.speechSynthesis.cancel();
                  setCurrentlySpeakingId(null);
                }
              }}
              className="bg-slate-800 text-emerald-300 font-bold text-xs px-2.5 py-1 rounded-xl border border-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.name} value={lang.name}>
                  {lang.name} ({lang.native})
                </option>
              ))}
            </select>
          </div>

          {/* Quick Suggested Prompt Chips */}
          <div className="p-2.5 bg-slate-50 border-b border-slate-200 overflow-x-auto whitespace-nowrap scrollbar-none flex items-center gap-1.5 text-[11px]">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 pl-1">Ask:</span>
            {currentSuggestedQuestions.map((q) => (
              <button
                key={q}
                onClick={() => handleSend(q)}
                disabled={loading}
                className="px-2.5 py-1 bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 font-medium rounded-full border border-slate-200 shadow-2xs shrink-0 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs bg-slate-50/40">
            {messages.map((m) => {
              const isSpeaking = currentlySpeakingId === m.id;
              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[88%] p-3.5 rounded-2xl whitespace-pre-wrap leading-relaxed shadow-2xs relative group ${
                      m.sender === 'user'
                        ? 'bg-emerald-700 text-white font-medium rounded-br-none'
                        : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
                    }`}
                  >
                    {m.text}

                    {/* Bot Message Voice Over Audio Control Button */}
                    {m.sender === 'bot' && (
                      <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between gap-2 text-[10px] text-slate-500">
                        <button
                          onClick={() => speakText(m.id, m.text)}
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg border font-bold transition-all ${
                            isSpeaking
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300 ring-2 ring-emerald-400/30'
                              : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                          }`}
                        >
                          {isSpeaking ? (
                            <>
                              <Volume2 className="w-3 h-3 text-emerald-600 animate-bounce" />
                              <span>Speaking ({selectedLanguage})...</span>
                            </>
                          ) : (
                            <>
                              <Volume2 className="w-3 h-3 text-emerald-600" />
                              <span>Listen Voiceover</span>
                            </>
                          )}
                        </button>

                        <span className="text-[9px] text-slate-400 font-mono">{selectedLanguage}</span>
                      </div>
                    )}
                  </div>
                  <span className="text-[9px] text-slate-400 mt-1 px-1">{m.timestamp}</span>
                </div>
              );
            })}

            {loading && (
              <div className="flex items-center gap-2 p-3 bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs w-max">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                <span>SolarConnect AI is generating reply in {selectedLanguage}...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Speech Listening Pulse Bar */}
          {isListening && (
            <div className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-bold flex items-center justify-between animate-pulse">
              <div className="flex items-center gap-2">
                <Mic className="w-4 h-4 animate-ping" />
                <span>Listening in {selectedLanguage}... Speak your question now</span>
              </div>
              <button
                onClick={toggleListening}
                className="px-2 py-0.5 bg-emerald-800 text-white text-[10px] rounded-md uppercase"
              >
                Stop
              </button>
            </div>
          )}

          {/* Input Form Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder={`Ask in ${selectedLanguage} (e.g., costs, subsidy)...`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />

            {/* Microphone Voice Input Button */}
            <button
              type="button"
              onClick={toggleListening}
              className={`p-2 rounded-xl border transition-all ${
                isListening
                  ? 'bg-red-500 text-white border-red-600 animate-pulse'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
              }`}
              title={isListening ? 'Stop Speech Recognition' : `Speak in ${selectedLanguage}`}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-emerald-700" />}
            </button>

            <button
              type="submit"
              disabled={loading || !inputText.trim()}
              className="p-2 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold rounded-xl transition-all"
              title="Send Message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}
    </>
  );
};
