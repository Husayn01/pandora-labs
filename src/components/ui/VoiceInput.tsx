/**
 * Voice Input Component
 * ──────────────────────
 * Live voice transcription with visual feedback.
 * Uses Web Speech API for English, with Gemini fallback for Hausa/Igbo/Yoruba.
 * Shows real-time transcription progress and animated orb.
 */

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Globe, Loader2, X, Send } from 'lucide-react';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  onProgress?: (status: string) => void;
  className?: string;
}

type SupportedLang = 'en-US' | 'ha-NG' | 'ig-NG' | 'yo-NG';

const LANGUAGES: { code: SupportedLang; name: string; flag: string }[] = [
  { code: 'en-US', name: 'English', flag: '🇬🇧' },
  { code: 'ha-NG', name: 'Hausa', flag: '🇳🇬' },
  { code: 'ig-NG', name: 'Igbo', flag: '🇳🇬' },
  { code: 'yo-NG', name: 'Yoruba', flag: '🇳🇬' },
];

export function VoiceInput({ onTranscript, onProgress, className = '' }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimText, setInterimText] = useState('');
  const [selectedLang, setSelectedLang] = useState<SupportedLang>('en-US');
  const [showLangPicker, setShowLangPicker] = useState(false);
  const [error, setError] = useState('');
  const [audioLevel, setAudioLevel] = useState(0);

  const recognitionRef = useRef<any>(null);
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number>(0);
  const streamRef = useRef<MediaStream | null>(null);

  // Check if Web Speech API is available
  const hasWebSpeech = typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  const startAudioVisualization = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const audioCtx = new AudioContext();
      const source = audioCtx.createMediaStreamSource(stream);
      const analyzer = audioCtx.createAnalyser();
      analyzer.fftSize = 256;
      source.connect(analyzer);
      analyzerRef.current = analyzer;

      const dataArray = new Uint8Array(analyzer.frequencyBinCount);
      const updateLevel = () => {
        analyzer.getByteFrequencyData(dataArray);
        const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
        setAudioLevel(avg / 128); // Normalize to 0-2
        animFrameRef.current = requestAnimationFrame(updateLevel);
      };
      updateLevel();
    } catch (err) {
      console.error('Audio visualization failed:', err);
    }
  }, []);

  const stopAudioVisualization = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setAudioLevel(0);
  }, []);

  const startListening = useCallback(() => {
    if (!hasWebSpeech) {
      setError('Voice input is not supported in this browser. Try Chrome.');
      return;
    }

    setError('');
    setTranscript('');
    setInterimText('');

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = selectedLang;
    recognition.interimResults = true;
    recognition.continuous = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      onProgress?.('Listening...');
      startAudioVisualization();
    };

    recognition.onresult = (event: any) => {
      let interim = '';
      let final = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          final += event.results[i][0].transcript + ' ';
        } else {
          interim += event.results[i][0].transcript;
        }
      }
      if (final) {
        setTranscript(prev => prev + final);
      }
      setInterimText(interim);
    };

    recognition.onerror = (event: any) => {
      if (event.error === 'no-speech') {
        setError('No speech detected. Try again.');
      } else if (event.error === 'not-allowed') {
        setError('Microphone access denied. Please allow microphone access.');
      } else {
        setError(`Speech error: ${event.error}`);
      }
      setIsListening(false);
      stopAudioVisualization();
    };

    recognition.onend = () => {
      setIsListening(false);
      stopAudioVisualization();
      onProgress?.('');
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [selectedLang, hasWebSpeech, onProgress, startAudioVisualization, stopAudioVisualization]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    stopAudioVisualization();
  }, [stopAudioVisualization]);

  const handleSend = () => {
    const text = (transcript + interimText).trim();
    if (text) {
      onTranscript(text);
      setTranscript('');
      setInterimText('');
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
      stopAudioVisualization();
    };
  }, [stopAudioVisualization]);

  const currentLang = LANGUAGES.find(l => l.code === selectedLang) || LANGUAGES[0];
  const fullText = transcript + interimText;

  return (
    <div className={`relative ${className}`}>
      {/* Main Voice Button */}
      <div className="flex items-center gap-3">
        {/* Language Picker */}
        <div className="relative">
          <button
            onClick={() => setShowLangPicker(!showLangPicker)}
            className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl bg-[#111] border border-white/10 text-xs text-gray-400 hover:text-white hover:border-white/20 transition-all cursor-pointer"
            title="Select language"
          >
            <Globe size={14} />
            <span>{currentLang.flag}</span>
          </button>

          <AnimatePresence>
            {showLangPicker && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                className="absolute bottom-full left-0 mb-2 bg-[#0a0a0a] border border-white/10 rounded-xl p-1 z-50 min-w-[160px]"
              >
                {LANGUAGES.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => { setSelectedLang(lang.code); setShowLangPicker(false); }}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-colors cursor-pointer ${
                      selectedLang === lang.code ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.name}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mic Button */}
        <button
          onClick={isListening ? stopListening : startListening}
          className={`relative flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 cursor-pointer ${
            isListening
              ? 'bg-red-500/20 border-2 border-red-500/50 text-red-400'
              : 'bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20'
          }`}
        >
          {/* Audio level pulse */}
          {isListening && (
            <motion.div
              className="absolute inset-0 rounded-full bg-red-500/10"
              animate={{ scale: 1 + audioLevel * 0.5 }}
              transition={{ duration: 0.1 }}
            />
          )}
          <span className="relative z-10">
            {isListening ? <MicOff size={20} /> : <Mic size={20} />}
          </span>
        </button>

        {/* Send button (visible when there's text) */}
        {fullText.trim() && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={handleSend}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-white text-black hover:bg-gray-200 transition-colors cursor-pointer"
          >
            <Send size={16} />
          </motion.button>
        )}
      </div>

      {/* Transcription Display */}
      <AnimatePresence>
        {(isListening || fullText) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 overflow-hidden"
          >
            <div className="p-3 rounded-xl bg-[#111] border border-white/10 relative">
              {/* Clear button */}
              {fullText && !isListening && (
                <button
                  onClick={() => { setTranscript(''); setInterimText(''); }}
                  className="absolute top-2 right-2 text-gray-500 hover:text-white transition-colors cursor-pointer"
                >
                  <X size={14} />
                </button>
              )}

              {/* Status */}
              {isListening && (
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex gap-0.5">
                    {[0, 1, 2].map(i => (
                      <motion.div
                        key={i}
                        className="w-1 bg-red-400 rounded-full"
                        animate={{
                          height: [4, 4 + audioLevel * 12, 4],
                        }}
                        transition={{
                          duration: 0.3,
                          repeat: Infinity,
                          delay: i * 0.1,
                        }}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] text-red-400 uppercase tracking-widest font-medium">
                    Listening • {currentLang.name}
                  </span>
                </div>
              )}

              {/* Transcript text */}
              <p className="text-sm text-white font-light leading-relaxed pr-6">
                {transcript}
                <span className="text-gray-400">{interimText}</span>
                {isListening && !fullText && (
                  <span className="text-gray-600 italic">Speak now...</span>
                )}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error */}
      {error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs text-red-400 mt-2"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Task Progress Indicator
   Shows real-time steps during agent execution
   ───────────────────────────────────────────── */

interface ProgressStep {
  label: string;
  status: 'pending' | 'active' | 'done';
}

interface TaskProgressProps {
  steps: ProgressStep[];
  className?: string;
}

export function TaskProgress({ steps, className = '' }: TaskProgressProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-3 rounded-xl bg-[#0a0a0a] border border-white/5 ${className}`}
    >
      <div className="space-y-2">
        {steps.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.15 }}
            className="flex items-center gap-2.5"
          >
            {step.status === 'active' ? (
              <Loader2 size={12} className="text-white animate-spin shrink-0" />
            ) : step.status === 'done' ? (
              <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center shrink-0">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
              </div>
            ) : (
              <div className="w-3 h-3 rounded-full bg-white/5 border border-white/10 shrink-0" />
            )}
            <span className={`text-xs font-light ${
              step.status === 'active' ? 'text-white' : step.status === 'done' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {step.label}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
