import React, { useState } from 'react';
import { SolutionResponse } from '../types';
import { WisdomSpeaker } from '../utils/speech';
import { 
  Sparkles, 
  BookOpen, 
  Volume2, 
  VolumeX, 
  Copy, 
  Check, 
  ArrowRight, 
  Lightbulb, 
  Compass, 
  CheckCircle2, 
  Quote, 
  History, 
  Flame,
  Search,
  Zap
} from 'lucide-react';

interface ProblemSolverProps {
  language: 'urdu-roman' | 'urdu' | 'en';
  onConsultBookInMasterclass: (bookName: string) => void;
  userBooksCount: number;
}

const PRESET_PROBLEMS = [
  {
    titleUrduRoman: 'Karobar me bhari nuqsan aur aagay ka rasta band lagna',
    titleUrdu: 'کاروبار میں شدید نقصان اور راستے بند لگنا',
    titleEn: 'Severe business failure, debt, and feeling hopeless about the future',
    icon: '📉'
  },
  {
    titleUrduRoman: 'Ghar ya rishton me ego, larai aur be-sukooni ka hal',
    titleUrdu: 'گھر یا رشتوں میں انا، لڑائی اور بے سکونی کا حل',
    titleEn: 'Family conflict, ego clashes, and restoring peace in relationships',
    icon: '🤝'
  },
  {
    titleUrduRoman: 'Waqt zaya hona, susti (procrastination) aur focus ka na banna',
    titleUrdu: 'وقت کا ضیاع، سستی اور توجہ مرکوز نہ ہونا',
    titleEn: 'Chronic procrastination, lethargy, and lack of relentless focus',
    icon: '⏳'
  },
  {
    titleUrduRoman: 'Andar ki udasi, dil tootna aur zindagi ke maqsad ka gum hona',
    titleUrdu: 'اندرونی اداسی، دل ٹوٹنا اور مقصدِ حیات کی تلاش',
    titleEn: 'Deep emotional grief, heartbreak, and finding existential purpose',
    icon: '💔'
  },
  {
    titleUrduRoman: 'Daftar ya samaj me logon ki sazishon aur siyasat se bachna',
    titleUrdu: 'دفتر یا معاشرے میں لوگوں کی سیاست اور حسد سے نمٹنا',
    titleEn: 'Navigating toxic workplace politics, envy, and deceptive competitors',
    icon: '🛡️'
  }
];

export const ProblemSolver: React.FC<ProblemSolverProps> = ({
  language,
  onConsultBookInMasterclass,
  userBooksCount,
}) => {
  const [problemText, setProblemText] = useState('');
  const [selectedEpoch, setSelectedEpoch] = useState('all');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [solution, setSolution] = useState<SolutionResponse | null>(null);
  const [speedStats, setSpeedStats] = useState<{ timeTakenMs?: number; source?: string } | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Client-side instant memory cache for instant 0ms switching
  const clientCache = React.useRef<Map<string, { solution: SolutionResponse; speedStats: any }>>(new Map());

  const handleSolve = async (textToSolve?: string) => {
    const query = textToSolve || problemText;
    if (!query.trim()) return;

    WisdomSpeaker.stop();
    setIsSpeaking(false);
    setError(null);

    const cacheKey = `${language}::${selectedEpoch}::${query.toLowerCase().trim()}`;
    
    // 0ms Instant Client Cache hit
    if (clientCache.current.has(cacheKey)) {
      const cached = clientCache.current.get(cacheKey)!;
      setSolution(cached.solution);
      setSpeedStats({ timeTakenMs: 0, source: 'instant-cache' });
      setLoading(false);
      return;
    }

    setLoading(true);
    setSolution(null);
    setSpeedStats(null);

    // Fast dynamic loading indicator (rapid 300ms intervals instead of slow 1800ms)
    const steps = [
      language === 'urdu-roman' 
        ? 'Dunya ki kitabon ka fast index scan kiya ja raha hai...'
        : language === 'urdu'
        ? 'زمین کی تاریخ کی کتابوں کا ذخیرہ دیکھا جا رہا ہے...'
        : 'Scanning Earth\'s historical archives and classical scrolls...',
      language === 'urdu-roman' 
        ? 'Marcus Aurelius, Ibn Khaldun, Rumi aur Viktor Frankl se istifsar...'
        : language === 'urdu'
        ? 'ابن خلدون، رومی، ابن سینا اور ارسطو کے اصول تلاش کیے جا رہے ہیں...'
        : 'Cross-referencing Stoics, Golden Age Polymaths, and Modern Thinkers...',
      language === 'urdu-roman' 
        ? 'Kitabon ke mutabiq asal waja aur 4 amali qadam tayar ho rahay hain...'
        : language === 'urdu'
        ? 'کتابوں کے اندر سے قطعی حل اور روزانہ کا نسخہ مرتب ہو رہا ہے...'
        : 'Synthesizing chapter axioms, exact citations, and daily prescription...'
    ];

    let stepIdx = 0;
    setLoadingStep(steps[0]);
    const interval = setInterval(() => {
      stepIdx++;
      if (stepIdx < steps.length) {
        setLoadingStep(steps[stepIdx]);
      }
    }, 350);

    const startTime = performance.now();

    try {
      const res = await fetch('/api/solve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problem: query,
          preferredLanguage: language,
          epochScope: selectedEpoch
        })
      });

      const data = await res.json();
      clearInterval(interval);

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Kitabon se hal hasil na ho saka.');
      }

      const elapsed = Math.round(performance.now() - startTime);
      const stats = {
        timeTakenMs: data.timeTakenMs !== undefined ? data.timeTakenMs : elapsed,
        source: data.source || 'fast-engine'
      };

      setSolution(data.solution);
      setSpeedStats(stats);
      clientCache.current.set(cacheKey, { solution: data.solution, speedStats: stats });
    } catch (err: any) {
      clearInterval(interval);
      console.error(err);
      setError(err.message || 'Kuch takneeki masla pesh aya. Dobara koshish karein.');
    } finally {
      setLoading(false);
    }
  };

  const toggleSpeech = () => {
    if (isSpeaking) {
      WisdomSpeaker.stop();
      setIsSpeaking(false);
    } else if (solution) {
      const speechScript = `
        ${solution.problemSummary}. 
        Asal Waja: ${solution.rootCauseAnalysis}. 
        Kitabon ki Rehnumai: ${solution.citations.map(c => `${c.author} ki kitab ${c.bookTitle}: ${c.quote}. ${c.reasoning}`).join('. ')}. 
        Amali Qadam: ${solution.actionSteps.map(s => `Qadam ${s.step}: ${s.title}. ${s.description}`).join('. ')}. 
        Rozana ka Nuskha: ${solution.dailyPrescription}. 
        Hatma Faisla: ${solution.philosophicalVerdict}.
      `;
      WisdomSpeaker.speak(speechScript, () => setIsSpeaking(false));
      setIsSpeaking(true);
    }
  };

  const copySolution = () => {
    if (!solution) return;
    const formatted = `=== KITAB-E-HIKMAT: MASLA KA HAL ===\n\n` +
      `Masla: ${solution.problemSummary}\n\n` +
      `ASAL WAJA (ROOT CAUSE):\n${solution.rootCauseAnalysis}\n\n` +
      `KITABON KE HAWALAY (CITATIONS):\n` +
      solution.citations.map(c => `• ${c.bookTitle} (${c.author}) [${c.chapterOrSection || 'General Doctrine'}]:\n"${c.quote}"\n→ ${c.reasoning}`).join('\n\n') +
      `\n\nAMALI QADAM (ACTION STEPS):\n` +
      solution.actionSteps.map(s => `${s.step}. ${s.title}: ${s.description} (Ref: ${s.bookReference})`).join('\n') +
      `\n\nROZANA KA NUSKHA:\n${solution.dailyPrescription}\n\n` +
      `HATMA FAISLA (VERDICT):\n${solution.philosophicalVerdict}`;

    navigator.clipboard.writeText(formatted);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-8">
      {/* Banner / Prompting Console */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-stone-900/90 via-stone-900/60 to-stone-950/80 border border-amber-500/20 p-6 md:p-8 shadow-2xl shadow-black/60">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-stone-700/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-4">
            <Flame className="w-3.5 h-3.5" />
            {language === 'urdu-roman' && 'Kitabon Ke Andar Se Fauri Hal'}
            {language === 'urdu' && 'کتابوں کے ذخیرے سے براہ راست حل'}
            {language === 'en' && 'Direct Problem Solving from Universal Literature'}
          </div>

          <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-stone-100 font-['Cinzel',serif] mb-3 leading-tight">
            {language === 'urdu-roman' && 'Apna Masla Batayein, Kitabein Hal Dein Gi'}
            {language === 'urdu' && 'اپنا مسئلہ پیش کریں، تاریخ کی کتابیں حل بتائیں گی'}
            {language === 'en' && 'Present Any Life Problem, Let Humanity\'s Books Solve It'}
          </h2>

          <p className="text-stone-300 text-sm md:text-base mb-6 leading-relaxed">
            {language === 'urdu-roman' && (
              'Yeh system azal se aaj tak ki tamam azeem kitabon (Aristotle, Ibn Sina, Ibn Khaldun, Rumi, Viktor Frankl, Sun Tzu, aur modern psychology) ko mutala karke aapke masle ki jad pakadta hai aur hawala jaat ke sath hal nikalta hai.'
            )}
            {language === 'urdu' && (
              'یہ زندہ نظام تاریخ کی تمام عظیم کتب کا بیک وقت مطالعہ کر کے آپ کے ذاتی، معاشی، ذہنی یا خاندانی مسئلے کی جڑ پکڑتا ہے اور قطعی حل فراہم کرتا ہے۔'
            )}
            {language === 'en' && (
              'This system scans thousands of years of human literature—Stoic masters, Islamic polymaths, scientific luminaries, and modern psychologists—to dissect your dilemma and formulate book-cited prescriptions.'
            )}
          </p>

          {/* Preset Problem Pills */}
          <div className="mb-5">
            <div className="text-xs font-semibold uppercase tracking-wider text-amber-400/80 mb-2.5 flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5" />
              {language === 'urdu-roman' && 'Aam Masail (Select to Test):'}
              {language === 'urdu' && 'عام مسائل (کلک کریں):'}
              {language === 'en' && 'Common Inquiries (Click to prefill):'}
            </div>
            <div className="flex flex-wrap gap-2">
              {PRESET_PROBLEMS.map((p, idx) => {
                const label = language === 'urdu-roman' ? p.titleUrduRoman : language === 'urdu' ? p.titleUrdu : p.titleEn;
                return (
                  <button
                    key={idx}
                    id={`preset-btn-${idx}`}
                    onClick={() => {
                      setProblemText(label);
                      handleSolve(label);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800/80 hover:bg-stone-700/80 text-stone-200 border border-stone-700/60 hover:border-amber-500/40 text-xs transition-all text-left"
                  >
                    <span>{p.icon}</span>
                    <span className="line-clamp-1">{label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Input Box */}
          <div className="space-y-4">
            <div className="relative">
              <textarea
                id="problem-input-area"
                rows={4}
                value={problemText}
                onChange={(e) => setProblemText(e.target.value)}
                placeholder={
                  language === 'urdu-roman'
                    ? 'Apna masla wazeh likhein (e.g. "Meri dukan me customer kam hogaye hain aur qarz barh gaya hai, dimagh me shadeed pareshani hai, mai kya karoon?")...'
                    : language === 'urdu'
                    ? 'اپنا مسئلہ تفصیل سے لکھیں (مثلاً: کاروبار میں شدید گھاٹا ہے، یا رشتوں میں غلط فہمی ہے، کتابیں کیا حل بتاتی ہیں؟)...'
                    : 'Describe your challenge in detail (e.g. "I lost my business savings and feel acute anxiety and defeat, what do the classical texts prescribe?")...'
                }
                className="w-full rounded-xl bg-stone-950/80 border border-stone-700/80 focus:border-amber-500/80 focus:ring-2 focus:ring-amber-500/20 text-stone-100 placeholder-stone-500 p-4 text-sm md:text-base transition-all resize-none shadow-inner"
              />
            </div>

            {/* Controls Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Compass className="w-4 h-4 text-amber-400 shrink-0" />
                <label className="text-xs text-stone-400 whitespace-nowrap">
                  {language === 'urdu-roman' ? 'Kitabon ka Daira:' : language === 'urdu' ? 'کتب کا دائرہ:' : 'Literature Epoch:'}
                </label>
                <select
                  id="epoch-select"
                  value={selectedEpoch}
                  onChange={(e) => setSelectedEpoch(e.target.value)}
                  className="bg-stone-900 border border-stone-700 text-xs text-stone-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-amber-500"
                >
                  <option value="all">
                    {language === 'urdu-roman' ? 'Tamam Kitabein (All Eras: Ancient to Modern)' : 'All Human Books (3000 BCE - Present)'}
                  </option>
                  <option value="ancient">Ancient Philosophers (Stoics, Aristotle, Sun Tzu)</option>
                  <option value="islamic-golden-age">Islamic Golden Age (Ibn Khaldun, Ibn Sina, Rumi, Ghazali)</option>
                  <option value="renaissance-enlightenment">Scientific Revolution & Enlightenment (Newton, Descartes, Smith)</option>
                  <option value="industrial-modern">19th-20th Century (Frankl, Iqbal, Darwin, Sagan)</option>
                  <option value="contemporary">Contemporary Mind & Behavioral Science (Kahneman, Taleb, Clear)</option>
                </select>
              </div>

              <button
                id="solve-submit-btn"
                onClick={() => handleSolve()}
                disabled={loading || !problemText.trim()}
                className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all shadow-lg ${
                  loading || !problemText.trim()
                    ? 'bg-stone-800 text-stone-500 cursor-not-allowed border border-stone-700/50'
                    : 'bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-400 text-stone-950 shadow-amber-500/25 hover:shadow-amber-500/40 cursor-pointer active:scale-[0.98]'
                }`}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
                    <span>{language === 'urdu-roman' ? 'Kitabein Parhi Ja Rahi Hain...' : 'Scanning Books...'}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>{language === 'urdu-roman' ? 'Kitabon Se Hal Talash Karein' : language === 'urdu' ? 'کتابوں سے حل نکالیں' : 'Consult the Living Codex'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Loading State Animation */}
      {loading && (
        <div className="p-10 rounded-2xl bg-stone-900/50 border border-amber-500/30 text-center space-y-4 shadow-xl">
          <div className="w-16 h-16 mx-auto rounded-full bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400 animate-pulse shadow-[0_0_25px_rgba(245,158,11,0.2)]">
            <BookOpen className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-stone-100 font-['Cinzel',serif]">
              {language === 'urdu-roman' ? 'Al-Maktabah Zinda Hai...' : 'Consulting the Universal Codex...'}
            </h3>
            <p className="text-amber-400 text-sm font-medium animate-pulse">
              {loadingStep}
            </p>
          </div>
          <p className="text-xs text-stone-400 max-w-md mx-auto">
            {language === 'urdu-roman'
              ? 'Nizam hazaron baras ke mutalaat, tibbi aur nafsiyati tajurbat se aapke masle ka bar-haqq jawab jama kar raha hai.'
              : 'Synthesizing historical treatises, psychological clinical insights, and proven strategic models.'}
          </p>
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/60 text-red-200 text-sm flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-xs underline text-red-300">Dismiss</button>
        </div>
      )}

      {/* Solution Results View */}
      {solution && !loading && (
        <div className="space-y-6">
          {/* Top Bar with Audio & Copy */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-stone-900/80 border border-amber-500/25">
            <div className="flex flex-wrap items-center gap-2 text-stone-300 text-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="font-semibold text-stone-200">
                {language === 'urdu-roman' ? 'Kitabon Ka Mustanad Hal' : 'Verified Codex Solution'}
              </span>
              <span className="text-xs text-stone-400">
                ({solution.citations.length} {language === 'urdu-roman' ? 'Azeem Kitabein Shamil' : 'Master Books Consulted'})
              </span>

              {speedStats && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 shadow-sm">
                  <Zap className="w-3 h-3 text-emerald-400 fill-emerald-400 animate-pulse" />
                  <span>
                    {speedStats.timeTakenMs !== undefined && speedStats.timeTakenMs < 1000
                      ? `${speedStats.timeTakenMs}ms`
                      : `${((speedStats.timeTakenMs || 0) / 1000).toFixed(2)}s`}
                  </span>
                  <span className="text-emerald-400/80 text-[10px] uppercase tracking-wider font-sans font-semibold">
                    {speedStats.source === 'instant-bank' || speedStats.source === 'instant-cache' || speedStats.source === 'memory-cache'
                      ? '⚡ Super Fast (Instant)'
                      : '⚡ Fast Flash AI'}
                  </span>
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                id="listen-audio-btn"
                onClick={toggleSpeech}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  isSpeaking
                    ? 'bg-amber-500 text-stone-950 border-amber-400 shadow-md shadow-amber-500/25 animate-pulse'
                    : 'bg-stone-800 text-amber-300 border-stone-700 hover:border-amber-500/40 hover:bg-stone-750'
                }`}
              >
                {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                <span>
                  {isSpeaking 
                    ? (language === 'urdu-roman' ? 'Aawaz Rokein' : 'Stop Narration')
                    : (language === 'urdu-roman' ? 'Hal Suniye (Listen Voice)' : 'Listen Solution')}
                </span>
              </button>

              <button
                id="copy-solution-btn"
                onClick={copySolution}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-stone-400" />}
                <span>{copied ? (language === 'urdu-roman' ? 'Copy Hogaya!' : 'Copied!') : (language === 'urdu-roman' ? 'Copy Karein' : 'Copy All')}</span>
              </button>
            </div>
          </div>

          {/* 1. Root Cause Diagnosis */}
          <div className="rounded-xl bg-stone-900/60 border border-stone-800 p-5 md:p-6 space-y-3">
            <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs tracking-wider uppercase">
              <Compass className="w-4 h-4" />
              <span>{language === 'urdu-roman' ? '1. Masle Ki Asal Waja (Tashkhees)' : '1. Root Cause Diagnosis'}</span>
            </div>
            <h3 className="text-xl font-bold text-stone-100 font-['Cinzel',serif]">
              {solution.problemSummary}
            </h3>
            <p className="text-stone-300 text-sm md:text-base leading-relaxed bg-stone-950/40 p-4 rounded-lg border border-stone-800/70">
              {solution.rootCauseAnalysis}
            </p>
          </div>

          {/* 2. Direct Citations from Earth's Books */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs tracking-wider uppercase">
                <BookOpen className="w-4 h-4" />
                <span>{language === 'urdu-roman' ? '2. Kitabon Ke Hawalay Aur Iqtibaasaat' : '2. Books Consulted & Direct Citations'}</span>
              </div>
              <span className="text-xs text-stone-400">
                {language === 'urdu-roman' ? 'Har kitab ka khas falsafa' : 'Specific axioms unlocking your relief'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {solution.citations.map((c, i) => (
                <div
                  key={i}
                  className="rounded-xl bg-gradient-to-br from-stone-900 via-stone-900/90 to-stone-950 border border-amber-900/30 hover:border-amber-500/40 p-5 transition-all shadow-md flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 uppercase tracking-wider mb-1">
                          {c.chapterOrSection || 'Core Thesis'}
                        </span>
                        <h4 className="text-base font-bold text-stone-100 font-['Cinzel',serif]">
                          {c.bookTitle}
                        </h4>
                        <p className="text-xs text-stone-400 font-medium">{c.author}</p>
                      </div>
                      <Quote className="w-5 h-5 text-amber-500/30 shrink-0 mt-1" />
                    </div>

                    {/* The Direct Quote */}
                    <blockquote className="border-l-2 border-amber-500/60 pl-3 py-1 text-xs md:text-sm text-amber-200/90 italic bg-amber-500/5 rounded-r">
                      "{c.quote}"
                    </blockquote>

                    {/* How it solves the issue */}
                    <div className="text-xs md:text-sm text-stone-300 leading-relaxed pt-1">
                      <span className="text-amber-400 font-semibold">
                        {language === 'urdu-roman' ? 'Hal ka Rasta: ' : 'Application: '}
                      </span>
                      {c.reasoning}
                    </div>
                  </div>

                  <div className="pt-4 mt-3 border-t border-stone-800/80 flex items-center justify-between">
                    <button
                      onClick={() => onConsultBookInMasterclass(c.bookTitle)}
                      className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium transition-colors"
                    >
                      <span>{language === 'urdu-roman' ? 'Is kitab ki tafseel seekhein' : 'Study this book in Masterclass'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Action Steps (4 Amali Qadam) */}
          <div className="rounded-xl bg-stone-900/60 border border-stone-800 p-5 md:p-6 space-y-4">
            <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs tracking-wider uppercase">
              <CheckCircle2 className="w-4 h-4" />
              <span>{language === 'urdu-roman' ? '3. Amali Qadam (Fauri Amal)' : '3. Concrete Action Protocol'}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {solution.actionSteps.map((step) => (
                <div
                  key={step.step}
                  className="rounded-lg bg-stone-950/60 border border-stone-800/80 p-4 space-y-2 hover:border-stone-700 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold flex items-center justify-center border border-amber-500/30">
                        {step.step}
                      </span>
                      <h5 className="text-sm font-bold text-stone-100">{step.title}</h5>
                    </div>
                  </div>
                  <p className="text-xs text-stone-300 leading-relaxed pl-8">
                    {step.description}
                  </p>
                  <div className="pl-8 pt-1 text-[11px] text-amber-400/80 font-mono">
                    ✦ {language === 'urdu-roman' ? 'Makhuz az:' : 'Inspired by:'} {step.bookReference}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Daily Prescription & Final Philosophical Verdict */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Daily Prescription */}
            <div className="rounded-xl bg-gradient-to-br from-amber-950/20 via-stone-900 to-stone-900 border border-amber-500/30 p-5 space-y-2">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider">
                <History className="w-4 h-4" />
                <span>{language === 'urdu-roman' ? 'Rozana Ka Nuskha (Daily Anchor)' : 'Daily Micro-Prescription'}</span>
              </div>
              <p className="text-sm text-stone-200 leading-relaxed">
                {solution.dailyPrescription}
              </p>
            </div>

            {/* Final Philosophical Verdict */}
            <div className="rounded-xl bg-gradient-to-br from-stone-900 via-stone-900 to-stone-950 border border-stone-700 p-5 space-y-2">
              <div className="flex items-center gap-2 text-amber-300 text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>{language === 'urdu-roman' ? 'Hatma Faisla (Cosmic Verdict)' : 'Philosophical Verdict'}</span>
              </div>
              <p className="text-sm text-amber-100 font-medium italic leading-relaxed">
                "{solution.philosophicalVerdict}"
              </p>
            </div>
          </div>

          {/* Try Another Problem Button */}
          <div className="text-center pt-2">
            <button
              onClick={() => {
                setProblemText('');
                setSolution(null);
                WisdomSpeaker.stop();
                setIsSpeaking(false);
              }}
              className="px-5 py-2.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-xs font-semibold text-stone-200 border border-stone-700 transition-colors"
            >
              {language === 'urdu-roman' ? 'Aik Aur Masla Hal Karein' : 'Solve Another Problem'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
