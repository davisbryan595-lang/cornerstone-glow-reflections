import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import {
  MessageCircle,
  X,
  Send,
  HelpCircle,
  Loader2,
} from "lucide-react";

type Message = {
  id: string;
  role: "user" | "bot" | "system";
  content: string;
};

const WELCOME = "Hi! I’m your Cornerstone assistant. Ask me about services, pricing, membership, areas we cover, appointment times, and more.";
const logoUrl = "https://cdn.builder.io/api/v1/image/assets%2F8c5319227ec44fd9bdef2d63efcb9acb%2Fc689032066c740e3a83978925f1d1000?format=webp&width=800";

const knowledgeBase: {
  q: string;
  a: string;
  keywords: string[];
}[] = [
  {
    q: "How long does a detail take?",
    a: "Interior 2–3h, exterior 2–4h, full detail 4–6h. Paint correction typically 4–8h depending on condition.",
    keywords: ["how long", "duration", "time", "detail", "paint correction"],
  },
  {
    q: "Do I need to be home during service?",
    a: "No. We just need access to your vehicle and a safe place to park. For exterior-only we’ll need water and power within ~50 feet.",
    keywords: ["home", "be home", "present", "during", "access", "water", "power"],
  },
  {
    q: "What payments do you accept?",
    a: "All major credit/debit cards and payment apps. Memberships can be set to auto-pay with your preferred method.",
    keywords: ["payment", "accept", "card", "credit", "debit", "pay"],
  },
  {
    q: "Is your service mobile?",
    a: "Yes. We’re a fully mobile detailing service and come to your location throughout the Charlotte area.",
    keywords: ["mobile", "come to me", "on-site", "location"],
  },
  {
    q: "Cancellation policy?",
    a: "Please give 24 hours notice. Within 24 hours there may be a $50 fee. Memberships can be paused up to 30 days with notice.",
    keywords: ["cancel", "cancellation", "reschedule", "policy"],
  },
  {
    q: "Do you guarantee your work?",
    a: "We stand behind our work. Report concerns within 24 hours of completion and we’ll review and address them.",
    keywords: ["warranty", "guarantee", "quality", "issue", "concern"],
  },
  {
    q: "Do you handle fleets?",
    a: "Yes. We offer fleet programs for businesses and dealerships and can create custom packages. Contact us for a quote.",
    keywords: ["fleet", "business", "dealership", "commercial"],
  },
  {
    q: "What’s the membership program?",
    a: "Regular maintenance detailing at exclusive pricing. Requires an initial full detail and minimum 3-cycle commitment.",
    keywords: ["membership", "subscribe", "maintenance", "program"],
  },
  {
    q: "How often should I detail my car?",
    a: "Full detail every 6–12 months is typical. Our maintenance plans keep your vehicle spotless between full details.",
    keywords: ["how often", "frequency", "schedule", "detail"],
  },
  {
    q: "Is ceramic coating worth it?",
    a: "Ceramic coatings add durable protection and shine. Protection ranges 6 months to 3 years depending on product and care.",
    keywords: ["ceramic", "coating", "worth", "protection"],
  },
  {
    q: "Can you remove paint swirls?",
    a: "Yes—our paint correction services remove swirls and restore clarity. We offer 1, 2, and 3-step corrections.",
    keywords: ["swirl", "scratches", "paint correction", "remove"],
  },
  {
    q: "How do I book?",
    a: "Use our contact form or call 980-312-4236. We’ll confirm the date/time and send a reminder.",
    keywords: ["book", "schedule", "appointment", "call", "phone", "email"],
  },
  {
    q: "What areas do you serve?",
    a: "Greater Charlotte area. If you’re nearby, ask and we’ll let you know our availability.",
    keywords: ["area", "serve", "coverage", "where", "charlotte"],
  },
  {
    q: "Do you offer pricing/memberships?",
    a: "Yes—see Pricing and Membership pages for packages and rates. We can recommend the best option for your vehicle.",
    keywords: ["pricing", "price", "cost", "membership", "plans"],
  },
];

function fuzzyAnswer(input: string) {
  const text = input.toLowerCase();
  // score by number of keyword hits
  const scored = knowledgeBase
    .map((k) => ({
      k,
      score: k.keywords.reduce((s, kw) => (text.includes(kw) ? s + 1 : s), 0),
    }))
    .sort((a, b) => b.score - a.score);

  if (scored[0]?.score && scored[0].score > 0) return scored[0].k.a;

  // fallback: try partial match on question text
  const qHit = knowledgeBase.find((k) =>
    k.q.toLowerCase().split(/[^a-z0-9]+/).some((t) => t && text.includes(t))
  );
  if (qHit) return qHit.a;

  return "I’m not sure yet. Try asking about services, pricing, memberships, areas we cover, or booking. You can also call 980-312-4236 or email cornerstonemobile55@gmail.com.";
}

const quickQuestions = knowledgeBase.map((k) => k.q);

const ChatBot = () => {
  const [open, setOpen] = useState(true);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>(() => [
    { id: crypto.randomUUID(), role: "bot", content: WELCOME },
  ]);
  const [typing, setTyping] = useState(false);
  const listRef = useRef<HTMLDivElement | null>(null);

  const send = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: crypto.randomUUID(), role: "user", content: text.trim() };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setTyping(true);
    const answer = fuzzyAnswer(text);
    setTimeout(() => {
      const botMsg: Message = { id: crypto.randomUUID(), role: "bot", content: answer };
      setMessages((m) => [...m, botMsg]);
      setTyping(false);
      // slight delay then scroll
      setTimeout(() => listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" }), 50);
    }, 450);
  };

  useEffect(() => {
    if (!open) return;
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [open]);

  const suggestions = useMemo(() => quickQuestions.slice(0, 6), []);

  return (
    <div className="fixed right-4 md:right-6 bottom-4 md:bottom-6 z-50">
      {/* Toggle Button */}
      <AnimatePresence>
        {!open && (
          <motion.button
            aria-label="Open chat assistant"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            onClick={() => setOpen(true)}
            className="p-4 rounded-full shadow-lg bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:shadow-glow-primary focus:outline-none"
          >
            <MessageCircle className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 180, damping: 18 }}
          >
            <Card className="w-[90vw] max-w-[360px] md:max-w-[420px] h-[68vh] max-h-[560px] overflow-hidden border-border shadow-xl">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card">
                <div className="flex items-center gap-3">
                  <img src={logoUrl} alt="Cornerstone Mobile Detailing" className="w-8 h-8 rounded-md" />
                  <div>
                    <p className="text-sm font-semibold">Cornerstone Assistant</p>
                    <p className="text-xs text-muted-foreground">Ask a question or choose a quick one</p>
                  </div>
                </div>
                <Button size="icon" variant="ghost" aria-label="Close chat" onClick={() => setOpen(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Messages */}
              <div className="flex flex-col h-[calc(100%-56px)]">
                <ScrollArea className="flex-1">
                  <div ref={listRef} className="px-3 py-3 space-y-3 pr-2 max-h-[420px] overflow-y-auto">
                    {messages.map((m) => (
                      <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`rounded-2xl px-3 py-2 text-sm max-w-[80%] whitespace-pre-wrap font-inter ${
                            m.role === "user"
                              ? "bg-primary text-primary-foreground rounded-br-sm"
                              : "bg-muted text-foreground rounded-bl-sm"
                          }`}
                        >
                          {m.content}
                        </div>
                      </div>
                    ))}
                    {typing && (
                      <div className="flex items-center gap-2 text-muted-foreground text-xs">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" /> Typing…
                      </div>
                    )}
                  </div>
                </ScrollArea>

                {/* Quick suggestions */}
                <div className="px-3 pb-2">
                  <div className="flex flex-wrap gap-2">
                    {suggestions.map((q) => (
                      <button
                        key={q}
                        onClick={() => send(q)}
                        className="text-xs px-2.5 py-1.5 rounded-full border border-border hover:border-primary/50 hover:bg-primary/5 transition-colors flex items-center gap-1"
                        aria-label={`Ask: ${q}`}
                      >
                        <HelpCircle className="w-3.5 h-3.5 text-primary" />
                        {q}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Composer */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    send(input);
                  }}
                  className="p-3 border-t border-border bg-card flex items-center gap-2"
                >
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your question…"
                    aria-label="Type your question"
                    className="flex-1"
                  />
                  <Button type="submit" size="icon" className="shrink-0">
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatBot;
