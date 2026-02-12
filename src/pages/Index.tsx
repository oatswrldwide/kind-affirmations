import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Sparkles, ArrowRight, RotateCcw } from "lucide-react";
import { useAffirmation } from "@/hooks/use-affirmation";
import { toast } from "sonner";
import heroBg from "@/assets/hero-bg.jpg";

const PROMPTS = [
  "I'm feeling overwhelmed at work",
  "I'm struggling with self-doubt",
  "I feel lonely today",
  "I'm anxious about the future",
];

const Index = () => {
  const [input, setInput] = useState("");
  const { affirmation, isLoading, error, generate, reset } = useAffirmation();
  const [hasGenerated, setHasGenerated] = useState(false);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const text = input.trim();
    
    // Enhanced validation - aligned with free tier limits
    if (!text) {
      toast.error("Please share how you're feeling.");
      return;
    }
    
    if (text.length < 5) {
      toast.error("Please share a bit more (at least 5 characters).");
      return;
    }
    
    if (text.length > 500) {
      toast.error("Please keep your message under 500 characters for best results.");
      return;
    }
    
    setHasGenerated(true);
    await generate(text);
  };

  const handlePromptClick = (prompt: string) => {
    setInput(prompt);
    setHasGenerated(true);
    generate(prompt);
  };

  const handleReset = () => {
    setInput("");
    reset();
    setHasGenerated(false);
  };

  // Display user-friendly error messages
  if (error) {
    const errorMessage = typeof error === 'string' ? error : 'Something went wrong. Please try again.';
    // Only show toast once per error
    if (!hasGenerated || affirmation.length === 0) {
      toast.error(errorMessage, { duration: 5000 });
    }
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-warm opacity-70" />

      {/* Breathing circle */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-primary/5 animate-breathe pointer-events-none" />

      <div className="relative z-10 w-full max-w-2xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full bg-primary/10 text-primary font-body text-sm">
            <Sparkles className="w-4 h-4" />
            <span>Personalized for you</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-semibold text-foreground mb-3 leading-tight">
            Gentle words for<br />
            <span className="text-gradient-calm">how you feel</span>
          </h1>
          <p className="text-muted-foreground font-body text-lg max-w-md mx-auto">
            Share what's on your mind, and receive a personalized affirmation crafted just for you.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!hasGenerated ? (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
            >
              <form onSubmit={handleSubmit} className="mb-6">
                <div className="relative">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="How are you feeling right now?"
                    maxLength={500}
                    rows={3}
                    className="w-full rounded-2xl border border-border bg-card/80 backdrop-blur-sm px-5 py-4 pr-14 font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 resize-none shadow-soft transition-all"
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="absolute right-3 bottom-3 w-10 h-10 rounded-xl bg-gradient-calm flex items-center justify-center text-primary-foreground disabled:opacity-40 transition-opacity hover:shadow-glow"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </form>

              <div className="flex flex-wrap gap-2 justify-center">
                {PROMPTS.map((p) => (
                  <button
                    key={p}
                    onClick={() => handlePromptClick(p)}
                    className="px-4 py-2 rounded-full bg-card/60 backdrop-blur-sm border border-border text-sm font-body text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-card transition-all"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="bg-card/80 backdrop-blur-sm border border-border rounded-3xl p-8 md:p-10 shadow-soft mb-6">
                {error && !isLoading ? (
                  <>
                    <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-5">
                      <span className="text-2xl">⚠️</span>
                    </div>
                    <p className="font-body text-lg text-foreground mb-4">
                      {error}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Please try again or contact support if the issue persists.
                    </p>
                  </>
                ) : (
                  <>
                    <Heart className="w-8 h-8 text-accent mx-auto mb-5 opacity-80" />
                    {affirmation ? (
                      <p className="font-display text-xl md:text-2xl text-foreground leading-relaxed italic">
                        "{affirmation}"
                      </p>
                    ) : isLoading ? (
                      <div className="flex items-center justify-center gap-2 text-muted-foreground font-body">
                        <div className="w-2 h-2 rounded-full bg-primary/40 animate-bounce [animation-delay:0ms]" />
                        <div className="w-2 h-2 rounded-full bg-primary/40 animate-bounce [animation-delay:150ms]" />
                        <div className="w-2 h-2 rounded-full bg-primary/40 animate-bounce [animation-delay:300ms]" />
                      </div>
                    ) : null}
                  </>
                )}

                {!isLoading && affirmation && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mt-5 text-sm text-muted-foreground font-body"
                  >
                    — crafted for: "{input.slice(0, 60)}{input.length > 60 ? "…" : ""}"
                  </motion.p>
                )}
              </div>

              <button
                onClick={handleReset}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-card/60 backdrop-blur-sm border border-border font-body text-sm text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                Share something else
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center text-xs text-muted-foreground/60 font-body mt-12"
        >
          This is not a substitute for professional mental health support.
          <br />
          If you're in crisis, please call or text <strong>988</strong>.
        </motion.p>
      </div>
    </div>
  );
};

export default Index;
