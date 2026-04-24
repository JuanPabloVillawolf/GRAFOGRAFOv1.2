import { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Sale, Product } from '../types';
import { Send, Sparkles, User, Bot, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';

interface AIAssistantProps {
  sales: Sale[];
  products: Product[];
}

interface Message {
  role: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

export function AIAssistant({ sales, products }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'bot', 
      content: 'Hola 👋 Soy tu asistente de Pánceas. Puedo ayudarte a analizar tus ventas, revisar el inventario o darte ideas para eventos culturales. ¿En qué puedo apoyarte hoy?',
      timestamp: new Date() 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      
      const context = `
        Eres el asistente inteligente de "Pánceas", una librería-cafetería.
        Datos actuales:
        - Ventas hoy: ${sales.length} transacciones, Total: $${sales.reduce((acc, s) => acc + s.amount, 0)}
        - Inventario: ${products.length} productos registrados.
        - Alertas de stock: ${products.filter(p => p.stock < 5).map(p => `${p.name} (${p.stock})`).join(', ')}
        
        Responde de forma profesional, cálida y útil, usando un tono literario y acogedor.
        Si te preguntan por ventas o inventario, usa los datos proporcionados.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          { role: 'user', parts: [{ text: context }] },
          ...messages.map(m => ({
            role: m.role === 'user' ? 'user' : 'model',
            parts: [{ text: m.content }]
          })),
          { role: 'user', parts: [{ text: input }] }
        ],
      });

      const botMessage: Message = { 
        role: 'bot', 
        content: response.text || 'Lo siento, tuve un problema al procesar tu solicitud.',
        timestamp: new Date() 
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('AI Error:', error);
      setMessages(prev => [...prev, { 
        role: 'bot', 
        content: 'Hubo un error al conectar con mi cerebro artificial. Por favor intenta de nuevo.',
        timestamp: new Date() 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto h-[calc(100vh-200px)] flex flex-col bg-white rounded-2xl border border-parchment overflow-hidden shadow-sm">
      <div className="px-6 py-4 border-b border-parchment bg-cream/30 flex items-center gap-2">
        <Sparkles size={18} className="text-gold" />
        <h3 className="font-serif text-base text-espresso">Asistente Pánceas</h3>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  msg.role === 'user' ? 'bg-espresso text-cream' : 'bg-parchment text-bark'
                }`}>
                  {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>
                <div className="space-y-1">
                  <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-espresso text-cream rounded-tr-none' 
                      : 'bg-cream border border-parchment text-ink rounded-tl-none'
                  }`}>
                    <div className="markdown-body">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  </div>
                  <div className={`text-[10px] text-dust px-1 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                    {msg.timestamp.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-parchment text-bark flex items-center justify-center">
                <Bot size={16} />
              </div>
              <div className="bg-cream border border-parchment px-4 py-3 rounded-2xl rounded-tl-none flex items-center gap-2">
                <Loader2 size={16} className="animate-spin text-bark" />
                <span className="text-xs text-dust italic">Pensando...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-parchment bg-cream/10">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Escribe tu consulta literaria o administrativa..."
            className="flex-1 bg-white border border-mist rounded-xl px-4 py-3 text-sm outline-none focus:border-bark transition-colors"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="w-12 h-12 bg-espresso text-cream rounded-xl flex items-center justify-center hover:bg-bark transition-colors disabled:opacity-50 shadow-lg shadow-espresso/10"
          >
            <Send size={18} />
          </button>
        </div>
        <div className="mt-3 flex gap-2 flex-wrap">
          {['¿Cuánto llevamos hoy?', 'Alertas de stock', 'Ideas para eventos'].map((hint) => (
            <button
              key={hint}
              onClick={() => setInput(hint)}
              className="text-[10px] px-3 py-1.5 bg-parchment text-bark rounded-full hover:border-bark border border-transparent transition-all font-medium"
            >
              {hint}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
