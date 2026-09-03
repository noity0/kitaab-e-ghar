import React, { useState } from 'react';
import { TeachModule } from '../types';
import { WisdomSpeaker } from '../utils/speech';
import { 
  GraduationCap, 
  BookOpen, 
  Sparkles, 
  CheckCircle2, 
  HelpCircle, 
  Volume2, 
  VolumeX, 
  ArrowRight,
  Compass,
  Check,
  BrainCircuit,
  Zap
} from 'lucide-react';

interface LearnMasterclassProps {
  language: 'urdu-roman' | 'urdu' | 'en';
  prefilledTopic?: string;
  onClearPrefill?: () => void;
  onConsultProblemWithBook?: (bookTitle: string) => void;
}

const MASTER_TOPICS = [
  {
    titleUrduRoman: 'Marcus Aurelius: Dichotomy of Control & Dimaghi Sakoon',
    titleUrdu: 'مارکس اوریلیس: سوچ کا کنٹرول اور ذہنی سکون',
    titleEn: 'Marcus Aurelius: The Dichotomy of Control & Inner Citadel',
    book: 'Meditations (Ta\'ammulat)',
    era: 'Ancient Stoicism'
  },
  {
    titleUrduRoman: 'Ibn Khaldun: Asabiyyah aur Qoumon/Idaron ka Urooj o Zawal',
    titleUrdu: 'ابن خلدون: عصبیت اور قوموں کا عروج و زوال',
    titleEn: 'Ibn Khaldun: Social Cohesion & The Cycles of Civilizations',
    book: 'Al-Muqaddimah',
    era: 'Islamic Golden Age'
  },
  {
    titleUrduRoman: 'Viktor Frankl: Shadeed Tareen Takleef me Maqsad Talash Karna',
    titleUrdu: 'وکٹر فرینکل: شدید ترین تکلیف میں مقصد تلاش کرنا',
    titleEn: 'Viktor Frankl: Finding Meaning in Deep Suffering',
    book: 'Man\'s Search for Meaning',
    era: 'Modern Psychiatry'
  },
  {
    titleUrduRoman: 'Sun Tzu: Baghair Lare Fatah Hasil Karna (Master Strategy)',
    titleUrdu: 'سن زو: بغیر لڑے فتح حاصل کرنے کی حکمتِ عملی',
    titleEn: 'Sun Tzu: The Supreme Art of Conquering Without War',
    book: 'The Art of War',
    era: 'Ancient Classical'
  },
  {
    titleUrduRoman: 'Allama Iqbal: Falsafa-e-Khudi aur Apni Quwwat Pehchanna',
    titleUrdu: 'علامہ اقبال: فلسفۂ خودی اور اپنی قوت پہچاننا',
    titleEn: 'Allama Iqbal: The Doctrine of Khudi (Self-Realization)',
    book: 'Asrar-e-Khudi & Reconstruction',
    era: 'Modern Renaissance'
  },
  {
    titleUrduRoman: 'Ibn Sina: Nafsiyat aur Jism ka Gehra Rishta (Psychosomatic)',
    titleUrdu: 'ابن سینا: نفسیات اور جسم کا گہرا باہمی تعلق',
    titleEn: 'Ibn Sina: The Psychosomatic Connection in Healing',
    book: 'The Canon of Medicine',
    era: 'Islamic Golden Age'
  },
  {
    titleUrduRoman: 'Daniel Kahneman: System 1 vs System 2 (Jazbati Faisle vs Mantiq)',
    titleUrdu: 'ڈینیل کاہنیمن: جذباتی فیصلے بمقابلہ سست منطق',
    titleEn: 'Daniel Kahneman: Overcoming Cognitive Biases',
    book: 'Thinking, Fast and Slow',
    era: 'Contemporary Economics'
  },
  {
    titleUrduRoman: 'Rumi: Ego (Nafs) ko Pighla Kar Dil Ka Sukoon Pana',
    titleUrdu: 'مولانا رومی: نفس کو پگھلا کر دل کا سکون پانا',
    titleEn: 'Jalaluddin Rumi: Transcending the Ego through Love',
    book: 'Masnavi-e-Manavi',
    era: 'Mystic Philosophy'
  }
];

export const LearnMasterclass: React.FC<LearnMasterclassProps> = ({
  language,
  prefilledTopic,
  onClearPrefill,
  onConsultProblemWithBook,
}) => {
  const [topicInput, setTopicInput] = useState(prefilledTopic || '');
  const [loading, setLoading] = useState(false);
  const [masterclass, setMasterclass] = useState<TeachModule | null>(null);
  const [speedStats, setSpeedStats] = useState<{ timeTakenMs?: number; source?: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [exerciseDone, setExerciseDone] = useState(false);

  // Client-side cache for instant 0ms switching between topics
  const clientCache = React.useRef<Map<string, { masterclass: TeachModule; speedStats: any }>>(new Map());

  // Sync if parent passes prefilled topic
  React.useEffect(() => {
    if (prefilledTopic) {
      setTopicInput(prefilledTopic);
      handleTeach(prefilledTopic);
      if (onClearPrefill) onClearPrefill();
    }
  }, [prefilledTopic]);

  const handleTeach = async (customTopic?: string) => {
    const query = customTopic || topicInput;
    if (!query.trim()) return;

    WisdomSpeaker.stop();
    setIsSpeaking(false);
    setError(null);

    const cacheKey = `${language}::${query.toLowerCase().trim()}`;
    if (clientCache.current.has(cacheKey)) {
      const cached = clientCache.current.get(cacheKey)!;
      setMasterclass(cached.masterclass);
      setSpeedStats({ timeTakenMs: 0, source: 'instant-cache' });
      setLoading(false);
      setExerciseDone(false);
      return;
    }

    setLoading(true);
    setMasterclass(null);
    setSpeedStats(null);
    setExerciseDone(false);

    const startTime = performance.now();

    try {
      const res = await fetch('/api/teach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topicOrBook: query,
          language: language
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Dars tayar na ho saka.');
      }

      const elapsed = Math.round(performance.now() - startTime);
      const stats = {
        timeTakenMs: data.timeTakenMs !== undefined ? data.timeTakenMs : elapsed,
        source: data.source || 'fast-engine'
      };

      setMasterclass(data.masterclass);
      setSpeedStats(stats);
      clientCache.current.set(cacheKey, { masterclass: data.masterclass, speedStats: stats });
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error creating masterclass.');
    } finally {
      setLoading(false);
    }
  };

  const toggleSpeech = () => {
    if (isSpeaking) {
      WisdomSpeaker.stop();
      setIsSpeaking(false);
    } else if (masterclass) {
      const text = `
        Masterclass: ${masterclass.topic}. 
        Kitab: ${masterclass.authorOrBook}. 
        Ta'aruf: ${masterclass.overview}. 
        Ahem Usool: ${masterclass.keyPrinciples.map(p => `${p.title}: ${p.explanation}`).join('. ')}. 
        Suqraati Sawal: ${masterclass.socraticQuestion}. 
        Amali Mashq: ${masterclass.practicalExercise}.
      `;
      WisdomSpeaker.speak(text, () => setIsSpeaking(false));
      setIsSpeaking(true);
    }
  };

  return (
    <div className="space-y-8">
      {/* Introduction Hero */}
      <div className="rounded-2xl bg-gradient-to-b from-stone-900/90 to-stone-950/80 border border-amber-500/20 p-6 md:p-8 space-y-4 shadow-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs font-semibold uppercase tracking-wider">
          <GraduationCap className="w-3.5 h-3.5" />
          {language === 'urdu-roman' && 'Kitabon Ki Tadrees (Direct Teaching)'}
          {language === 'urdu' && 'کتابوں سے براہِ راست تعلیم و تدریس'}
          {language === 'en' && 'Socratic Masterclasses from World Literature'}
        </div>

        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-stone-100 font-['Cinzel',serif]">
          {language === 'urdu-roman' && 'Kisi Bhi Kitab Ya Falsafay Ka Dars Lejiye'}
          {language === 'urdu' && 'تاریخ کی کسی بھی کتاب یا فلسفے کا تفصیلی سبق حاصل کریں'}
          {language === 'en' && 'Receive a Direct Masterclass on Any Classic Book or Axiom'}
        </h2>

        <p className="text-stone-300 text-sm md:text-base max-w-3xl leading-relaxed">
          {language === 'urdu-roman' && (
            'Aap jo cheez seekhna chahein, yeh system azal se aaj tak ki kitabon se uske buniyaadi usool, tareekhi sabaq, aur amali mashq ke sath sikhata hai.'
          )}
          {language === 'urdu' && (
            'یہ سسٹم آپ کو دنیا کی عظیم کتب سے بنیادی حقائق، سقراطی سوالات اور عملی مشقوں کے ذریعے علم سکھاتا ہے۔'
          )}
          {language === 'en' && (
            'Select or enter any classic treatise or domain. The system synthesizes core principles, historical context, self-reflective inquiries, and a 15-minute life exercise.'
          )}
        </p>

        {/* Preset Topic Selection */}
        <div className="pt-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-amber-400/80 mb-2.5 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            {language === 'urdu-roman' ? 'Chuninda Asbaaq (Featured Masterclasses):' : 'Featured Masterclasses:'}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {MASTER_TOPICS.map((item, i) => {
              const label = language === 'urdu-roman' ? item.titleUrduRoman : language === 'urdu' ? item.titleUrdu : item.titleEn;
              return (
                <button
                  key={i}
                  id={`master-topic-${i}`}
                  onClick={() => {
                    setTopicInput(label);
                    handleTeach(label);
                  }}
                  className="p-3 rounded-xl bg-stone-950/70 hover:bg-stone-850 border border-stone-800 hover:border-amber-500/40 text-left transition-all group flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[10px] font-mono text-amber-400/80 uppercase block mb-1">{item.era}</span>
                    <h4 className="text-xs font-bold text-stone-200 group-hover:text-amber-200 line-clamp-2 mb-1.5">
                      {label}
                    </h4>
                  </div>
                  <span className="text-[11px] text-stone-400 italic">📖 {item.book}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Input */}
        <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full">
            <input
              id="masterclass-custom-input"
              type="text"
              value={topicInput}
              onChange={(e) => setTopicInput(e.target.value)}
              placeholder={
                language === 'urdu-roman'
                  ? 'Koi bhi kitab ya topic likhein (e.g. "Ibn Khaldun ka Asabiyyah", "Quantum Physics basic principles", "Stoicism for anger")...'
                  : 'Enter any book, author, or discipline to learn from...'
              }
              className="w-full rounded-xl bg-stone-950 border border-stone-700/80 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-stone-100 placeholder-stone-500 px-4 py-3 text-sm"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleTeach();
              }}
            />
          </div>
          <button
            id="teach-btn"
            onClick={() => handleTeach()}
            disabled={loading || !topicInput.trim()}
            className={`w-full sm:w-auto px-6 py-3 rounded-xl font-semibold text-sm transition-all whitespace-nowrap flex items-center justify-center gap-2 ${
              loading || !topicInput.trim()
                ? 'bg-stone-800 text-stone-500 cursor-not-allowed border border-stone-700'
                : 'bg-gradient-to-r from-amber-600 to-amber-500 text-stone-950 shadow-lg shadow-amber-500/20 hover:from-amber-500 hover:to-amber-400 active:scale-[0.98]'
            }`}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
                <span>{language === 'urdu-roman' ? 'Dars Tayar...' : 'Generating...'}</span>
              </>
            ) : (
              <>
                <GraduationCap className="w-4 h-4" />
                <span>{language === 'urdu-roman' ? 'Sikhaiye (Teach Me)' : 'Teach Me'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/60 text-red-200 text-sm">
          {error}
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && (
        <div className="p-10 rounded-2xl bg-stone-900/40 border border-amber-500/30 text-center space-y-3">
          <div className="w-12 h-12 mx-auto rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 animate-spin">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-stone-200 font-['Cinzel',serif]">
            {language === 'urdu-roman' ? 'Uloom-e-Alam Se Sabaq Murattab Ho Raha Hai...' : 'Synthesizing Masterclass...'}
          </h3>
          <p className="text-xs text-stone-400">
            {language === 'urdu-roman' ? 'Kitab ke buniyaadi nazriyat, sabaq aur roohani mashq tayar ki ja rahi hai.' : 'Extracting fundamental doctrines and socratic reflections.'}
          </p>
        </div>
      )}

      {/* Masterclass Content */}
      {masterclass && !loading && (
        <div className="space-y-6">
          {/* Header Bar */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-stone-900 via-stone-900 to-amber-950/30 border border-amber-500/30 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs uppercase font-mono tracking-wider text-amber-400">
                    {masterclass.authorOrBook}
                  </span>
                  {speedStats && (
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-mono font-medium bg-emerald-950/80 border border-emerald-500/50 text-emerald-300">
                      <Zap className="w-3 h-3 text-emerald-400 fill-emerald-400 animate-pulse" />
                      <span>
                        {speedStats.timeTakenMs !== undefined && speedStats.timeTakenMs < 1000
                          ? `${speedStats.timeTakenMs}ms`
                          : `${((speedStats.timeTakenMs || 0) / 1000).toFixed(2)}s`}
                      </span>
                      <span className="text-emerald-400/80 text-[9px] uppercase tracking-wider font-sans font-semibold">
                        {speedStats.source === 'instant-bank' || speedStats.source === 'instant-cache' || speedStats.source === 'memory-cache'
                          ? '⚡ Super Fast'
                          : '⚡ Fast Flash'}
                      </span>
                    </span>
                  )}
                </div>
                <h3 className="text-2xl font-bold text-stone-100 font-['Cinzel',serif]">
                  {masterclass.topic}
                </h3>
              </div>

              <button
                onClick={toggleSpeech}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold border transition-all ${
                  isSpeaking
                    ? 'bg-amber-500 text-stone-950 border-amber-400 animate-pulse'
                    : 'bg-stone-800 text-amber-300 border-stone-700 hover:border-amber-500/40'
                }`}
              >
                {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                <span>{isSpeaking ? 'Aawaz Rokein' : 'Listen Masterclass'}</span>
              </button>
            </div>

            <p className="text-sm md:text-base text-stone-300 leading-relaxed pt-2 border-t border-stone-800/80">
              {masterclass.overview}
            </p>
          </div>

          {/* 3 Core Principles */}
          <div className="space-y-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span>{language === 'urdu-roman' ? 'Buniyaadi Usool o Nazriyat (Key Principles):' : 'Core Principles:'}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {masterclass.keyPrinciples.map((principle, idx) => (
                <div
                  key={idx}
                  className="rounded-xl bg-stone-900/70 border border-stone-800 hover:border-amber-500/30 p-5 space-y-3 transition-colors flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-amber-500/15 text-amber-400 text-xs font-bold flex items-center justify-center border border-amber-500/25">
                        {idx + 1}
                      </span>
                      <h4 className="text-sm font-bold text-stone-100">{principle.title}</h4>
                    </div>
                    <p className="text-xs text-stone-300 leading-relaxed">
                      {principle.explanation}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-stone-800 text-[11px] text-amber-300/80 italic">
                    📜 {principle.historicalContext}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Socratic Question & Practical Exercise */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Socratic Reflection */}
            <div className="rounded-xl bg-gradient-to-br from-stone-900 to-stone-950 border border-amber-900/40 p-5 space-y-3">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider">
                <HelpCircle className="w-4 h-4" />
                <span>{language === 'urdu-roman' ? 'Suqraati Sawal (Self-Reflection)' : 'Socratic Inquiry'}</span>
              </div>
              <p className="text-sm text-stone-200 font-medium italic leading-relaxed">
                "{masterclass.socraticQuestion}"
              </p>
              <p className="text-xs text-stone-400">
                {language === 'urdu-roman' ? 'Is sawal ko apne maazi aur haal ke aainay me 2 minute sochein.' : 'Contemplate this in relation to your personal circumstances.'}
              </p>
            </div>

            {/* Practical 15-Minute Exercise */}
            <div className="rounded-xl bg-gradient-to-br from-emerald-950/20 via-stone-900 to-stone-950 border border-emerald-500/30 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{language === 'urdu-roman' ? '15-Minute Amali Mashq' : '15-Minute Exercise'}</span>
                </div>
                {exerciseDone && (
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Mukammal!
                  </span>
                )}
              </div>

              <p className="text-sm text-stone-200 leading-relaxed">
                {masterclass.practicalExercise}
              </p>

              <button
                onClick={() => setExerciseDone(!exerciseDone)}
                className={`w-full py-2 rounded-lg text-xs font-semibold border transition-all ${
                  exerciseDone
                    ? 'bg-emerald-600/30 border-emerald-500 text-emerald-200'
                    : 'bg-stone-800 hover:bg-stone-700 border-stone-700 text-stone-300'
                }`}
              >
                {exerciseDone 
                  ? (language === 'urdu-roman' ? '✓ Mashq Mukammal Kar Li' : '✓ Exercise Completed')
                  : (language === 'urdu-roman' ? 'Yeh Mashq Karein Aur Mark Karein' : 'Mark Exercise Completed')}
              </button>
            </div>
          </div>

          {/* Action Link: Solve a problem using this book */}
          {onConsultProblemWithBook && (
            <div className="text-center pt-2">
              <button
                onClick={() => onConsultProblemWithBook(masterclass.authorOrBook)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold transition-all"
              >
                <Compass className="w-4 h-4" />
                <span>
                  {language === 'urdu-roman'
                    ? `Is kitab (${masterclass.authorOrBook}) se koi masla hal karein`
                    : `Use ${masterclass.authorOrBook} to solve a real dilemma`}
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
