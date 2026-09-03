import { BookEntry } from '../types';

export const INITIAL_BOOKS: BookEntry[] = [
  // --- ANCIENT & CLASSICAL ---
  {
    id: 'meditations-marcus',
    title: 'Meditations (Ta\'ammulat)',
    author: 'Marcus Aurelius (Roman Emperor & Stoic Philosopher)',
    yearOrEra: '161–180 CE',
    era: 'ancient',
    category: 'Philosophy & Stoicism',
    description: 'Personal private journals of the Roman Emperor on discipline, emotional self-control, enduring grief, and focusing only on what is in one\'s power.',
    keyCoreWisdom: [
      'You have power over your mind, not outside events. Realize this, and you will find strength.',
      'Waste no more time arguing about what a good man should be. Be one.',
      'The happiness of your life depends upon the quality of your thoughts.'
    ],
    famousQuote: 'The best revenge is not to be like that.',
    problemItSolves: 'Anger, anxiety, lack of mental peace, stress from uncooperative people.'
  },
  {
    id: 'art-of-war-suntzu',
    title: 'The Art of War (Sunzi Bingfa)',
    author: 'Sun Tzu (Ancient Chinese General)',
    yearOrEra: '5th Century BCE',
    era: 'ancient',
    category: 'Strategy & Leadership',
    description: 'The definitive military and strategic treatise of human history, teaching that supreme victory is conquering without fighting and mastering positioning.',
    keyCoreWisdom: [
      'If you know the enemy and know yourself, you need not fear the result of a hundred battles.',
      'In the midst of chaos, there is also opportunity.',
      'The supreme art of war is to subdue the enemy without fighting.'
    ],
    famousQuote: 'Let your rapidity be that of the wind, your compactness that of the forest, your move like thunder.',
    problemItSolves: 'Workplace conflict, competitor pressure, strategic confusion, chaotic situations.'
  },
  {
    id: 'nicomachean-ethics',
    title: 'Nicomachean Ethics',
    author: 'Aristotle',
    yearOrEra: 'c. 340 BCE',
    era: 'ancient',
    category: 'Philosophy & Stoicism',
    description: 'Investigation into the human good (Eudaimonia / human flourishing) through virtue and the Golden Mean between two extremes.',
    keyCoreWisdom: [
      'Virtue is the golden mean between deficiency and excess (e.g., courage is between cowardice and rashness).',
      'We are what we repeatedly do. Excellence, then, is not an act, but a habit.',
      'Happiness is the meaning and the purpose of life, the whole aim of human existence.'
    ],
    famousQuote: 'Knowing yourself is the beginning of all wisdom.',
    problemItSolves: 'Moral dilemmas, finding purpose, balance in life, defining true happiness.'
  },
  {
    id: 'republic-plato',
    title: 'The Republic',
    author: 'Plato',
    yearOrEra: 'c. 375 BCE',
    era: 'ancient',
    category: 'Philosophy & Stoicism',
    description: 'Socratic dialogue on justice, the nature of the just individual, the Allegory of the Cave, and ideal governance.',
    keyCoreWisdom: [
      'The Allegory of the Cave: Human beings mistake sensory shadows for ultimate truth.',
      'Justice is harmony between the rational, spirited, and appetitive parts of the soul.',
      'Wise men speak because they have something to say; fools because they have to say something.'
    ],
    famousQuote: 'The measure of a man is what he does with power.',
    problemItSolves: 'Illusion vs reality, personal justice, political corruption, discerning truth.'
  },
  {
    id: 'charaka-samhita',
    title: 'Charaka Samhita',
    author: 'Acharya Charaka',
    yearOrEra: 'c. 100 BCE - 200 CE',
    era: 'ancient',
    category: 'Medicine & Health',
    description: 'One of the foundational texts of classical medicine, detailing prevention, dietary harmony, natural biorhythms, and mental-physical balance.',
    keyCoreWisdom: [
      'Health is the balanced state of physical elements, digestive fire, and joyful mind/senses.',
      'Food consumed without mental calm turns into toxin.',
      'Prevention is supreme: harmony with the seasons and circadian rhythms preserves life.'
    ],
    famousQuote: 'A physician, even if well versed in medical scriptures, cannot treat a patient without entering into the inner soul.',
    problemItSolves: 'Physical lethargy, digestive imbalance, sleep disorders, lifestyle illness.'
  },

  // --- ISLAMIC GOLDEN AGE & MEDIEVAL WISDOM ---
  {
    id: 'qanun-ibn-sina',
    title: 'The Canon of Medicine (Al-Qanun fi al-Tibb)',
    author: 'Ibn Sina (Avicenna)',
    yearOrEra: '1025 CE',
    era: 'islamic-golden-age',
    category: 'Medicine & Health',
    description: 'The monumental encyclopedia that formed the foundation of medical education across Europe and the Islamic world for 600+ years, diagnosing psychosomatic links and holistic care.',
    keyCoreWisdom: [
      'The mind directly affects physical illness: grief, anxiety, and fear weaken the pulse and immune vitality.',
      'Therapeutic exercise, pure air, and clean water are primary shields against pathology.',
      'Systematic empirical observation and quarantine protect societies from contagion.'
    ],
    famousQuote: 'The imagination is half of disease; tranquility is half of health; and patience is the first step towards recovery.',
    problemItSolves: 'Stress-induced bodily disease, psychosomatic pain, balanced lifestyle recovery.'
  },
  {
    id: 'muqaddimah-ibn-khaldun',
    title: 'Al-Muqaddimah (Prolegomena)',
    author: 'Ibn Khaldun (Father of Sociology & Historiography)',
    yearOrEra: '1377 CE',
    era: 'islamic-golden-age',
    category: 'Economics & Wealth',
    description: 'The pioneering masterwork on social cohesion (Asabiyyah), economic cycles, market dynamics, taxation curves, and the inevitable rise and fall of civilizations.',
    keyCoreWisdom: [
      'Social solidarity (Asabiyyah) is the bedrock of any civilization; when luxury destroys solidarity, decline begins.',
      'Low taxes at the beginning of an era yield huge revenues; high taxes at the end choke trade and collapse the treasury.',
      'Humans are conditioned by their customs and environments, not merely biological inheritance.'
    ],
    famousQuote: 'Throughout history many nations have suffered a physical defeat, but that has never marked the end of a nation. But when a nation becomes the victim of a psychological defeat, that marks the end of a nation.',
    problemItSolves: 'Economic collapse, group division, corporate decay, leadership blindspots.'
  },
  {
    id: 'masnavi-rumi',
    title: 'Masnavi-e-Manavi (The Spiritual Couplets)',
    author: 'Mawlana Jalaluddin Rumi',
    yearOrEra: '1258–1273 CE',
    era: 'islamic-golden-age',
    category: 'Literature, Soul & Poetry',
    description: 'A masterpiece of mystic philosophy, teaching transformative love, spiritual awakening, letting go of the false ego, and discovering the divine within.',
    keyCoreWisdom: [
      'The wound is the place where the Light enters you.',
      'Do not grieve. Anything you lose comes round in another form.',
      'Silence is the language of God, all else is poor translation.'
    ],
    famousQuote: 'Yesterday I was clever, so I wanted to change the world. Today I am wise, so I am changing myself.',
    problemItSolves: 'Heartbreak, deep spiritual void, loneliness, depression and existential despair.'
  },
  {
    id: 'ihya-al-ghazali',
    title: 'Ihya Ulum al-Din (Revival of the Religious Sciences)',
    author: 'Imam Abu Hamid Al-Ghazali',
    yearOrEra: '1096–1105 CE',
    era: 'islamic-golden-age',
    category: 'Psychology & Mind',
    description: 'Deep psychological exploration of the inner spiritual heart (Qalb), overcoming destructive habits (envy, pride, greed), and cultivating spiritual tranquility.',
    keyCoreWisdom: [
      'Curing psychological sickness requires recognizing self-deception and purifying the ego.',
      'True wealth is contentment (Qana\'ah); desire is an endless well that drains the soul.',
      'Knowledge without action is insanity, and action without knowledge is vanity.'
    ],
    famousQuote: 'Declare your jihad on thirteen enemies you cannot see: egoism, arrogance, conceit, selfishness, greed, lust, intolerance, anger, lying, cheating, slandering and backbiting.',
    problemItSolves: 'Inner unrest, arrogance, jealousy, dissatisfaction with life, spiritual drift.'
  },
  {
    id: 'gulistan-saadi',
    title: 'Gulistan & Bostan (The Rose Garden & The Orchard)',
    author: 'Sheikh Saadi Shirazi',
    yearOrEra: '1257–1258 CE',
    era: 'islamic-golden-age',
    category: 'Literature, Soul & Poetry',
    description: 'Practical moral tales, parables, and human psychology for navigating society, dealing with rulers, business partners, and family relations.',
    keyCoreWisdom: [
      'Human beings are members of a whole, in related creation of one essence and soul.',
      'Speak in such a way that if you had to repeat it before your bitterest enemy, you would not blush.',
      'He who gives advice to a conceited man stands himself in need of advice.'
    ],
    famousQuote: 'If you have no sympathy for human pain, the name of human you cannot retain.',
    problemItSolves: 'Interpersonal disputes, diplomatic negotiations, managing toxic superiors.'
  },

  // --- RENAISSANCE & SCIENTIFIC REVOLUTION ---
  {
    id: 'discourse-on-method-descartes',
    title: 'Discourse on the Method',
    author: 'René Descartes',
    yearOrEra: '1637 CE',
    era: 'renaissance-enlightenment',
    category: 'Science & Cosmos',
    description: 'The foundation of modern rational philosophy and scientific deduction: dismantling assumptions until reaching undeniable bedrock truth.',
    keyCoreWisdom: [
      'Never accept anything for true which I do not clearly know to be such.',
      'Divide each difficulty into as many parts as is feasible and necessary to resolve it.',
      'Cogito, ergo sum: I think, therefore I am.'
    ],
    famousQuote: 'Doubt is the origin of wisdom.',
    problemItSolves: 'Confusion, overwhelming complex tasks, superstition, decision paralysis.'
  },
  {
    id: 'principia-newton',
    title: 'Philosophiæ Naturalis Principia Mathematica',
    author: 'Sir Isaac Newton',
    yearOrEra: '1687 CE',
    era: 'renaissance-enlightenment',
    category: 'Science & Cosmos',
    description: 'The mathematical formulation of the three laws of motion and universal gravitation, unifying terrestrial and celestial mechanics.',
    keyCoreWisdom: [
      'Every action has an equal and opposite reaction (cause and effect).',
      'Objects in inertia remain in motion unless acted upon by an external net force.',
      'Nature is exceedingly simple and harmonious with itself.'
    ],
    famousQuote: 'If I have seen further, it is by standing on the shoulders of giants.',
    problemItSolves: 'Understanding physical laws, breaking inertia in projects, cause-and-effect modeling.'
  },
  {
    id: 'wealth-of-nations-smith',
    title: 'The Wealth of Nations',
    author: 'Adam Smith',
    yearOrEra: '1776 CE',
    era: 'renaissance-enlightenment',
    category: 'Economics & Wealth',
    description: 'The seminal treatise on free commerce, the division of labor, productivity, capital accumulation, and trade dynamics.',
    keyCoreWisdom: [
      'Specialization and division of labor multiply productivity hundredfold.',
      'Self-interest, guided by competitive markets, unintentionally generates societal prosperity.',
      'True wealth is the annual produce of the land and labor of society, not hoarded gold.'
    ],
    famousQuote: 'It is not from the benevolence of the butcher, the brewer, or the baker that we expect our dinner, but from their regard to their own interest.',
    problemItSolves: 'Business inefficiency, economic stagnation, supply chain productivity.'
  },

  // --- INDUSTRIAL & 19TH-20TH CENTURY PIONEERS ---
  {
    id: 'mans-search-for-meaning-frankl',
    title: 'Man\'s Search for Meaning',
    author: 'Viktor E. Frankl (Psychiatrist & Holocaust Survivor)',
    yearOrEra: '1946 CE',
    era: 'industrial-modern',
    category: 'Psychology & Mind',
    description: 'Logotherapy and human perseverance: how finding purpose in work, love, or courageous suffering enables human beings to endure any ordeal.',
    keyCoreWisdom: [
      'He who has a WHY to live for can bear almost any HOW.',
      'Everything can be taken from a man but one thing: the last of human freedoms—to choose one\'s attitude in any given set of circumstances.',
      'Between stimulus and response there is a space. In that space is our power to choose our response.'
    ],
    famousQuote: 'When we are no longer able to change a situation, we are challenged to change ourselves.',
    problemItSolves: 'Extreme hardship, loss of hope, grief, crisis of purpose, clinical hopelessness.'
  },
  {
    id: 'asrar-e-khudi-iqbal',
    title: 'Asrar-e-Khudi (The Secrets of the Self)',
    author: 'Allama Muhammad Iqbal',
    yearOrEra: '1915 CE',
    era: 'industrial-modern',
    category: 'Philosophy & Stoicism',
    description: 'Philosophical poetry awakening the individual self (Khudi) through self-affirmation, relentless creative action, and breaking subservient complacency.',
    keyCoreWisdom: [
      'Nurture the Self (Khudi) to such heights that before writing any destiny, God asks man: What is your will?',
      'Life is continuous struggle, not inert resignation.',
      'The eagle does not build a nest on a peak; its kingdom is the vast open air of effort.'
    ],
    famousQuote: 'Khudi ko kar buland itna ke har taqdeer se pehle, Khuda bande se khud pooche bata teri raza kya hai.',
    problemItSolves: 'Inferiority complex, laziness, fatalistic defeatism, lack of ambition and drive.'
  },
  {
    id: 'origin-of-species-darwin',
    title: 'On the Origin of Species',
    author: 'Charles Darwin',
    yearOrEra: '1859 CE',
    era: 'industrial-modern',
    category: 'Science & Cosmos',
    description: 'The foundation of evolutionary biology: natural selection, gradual variation, and environmental adaptation.',
    keyCoreWisdom: [
      'It is not the strongest of the species that survives, nor the most intelligent, but the one most responsive to change.',
      'Small incremental variations compounded over immense time produce radical evolutionary shifts.',
      'All living organisms share interconnected ancestry in the great tree of life.'
    ],
    famousQuote: 'There is grandeur in this view of life.',
    problemItSolves: 'Resistance to change, rigid dogmatism, failing to adapt to shifting environments.'
  },
  {
    id: 'war-and-peace-tolstoy',
    title: 'War and Peace',
    author: 'Leo Tolstoy',
    yearOrEra: '1869 CE',
    era: 'industrial-modern',
    category: 'Literature, Soul & Poetry',
    description: 'Epic study of humanity, family relationships, historical determinism, personal moral transformation, and peace.',
    keyCoreWisdom: [
      'The two most powerful warriors are patience and time.',
      'We can know only that we know nothing. And that is the highest degree of human wisdom.',
      'If you want to be happy, be.'
    ],
    famousQuote: 'All happy families are alike; each unhappy family is unhappy in its own way.',
    problemItSolves: 'Family turbulence, patience under crisis, accepting life\'s unpredictable tides.'
  },
  {
    id: 'demon-haunted-world-sagan',
    title: 'The Demon-Haunted World: Science as a Candle in the Dark',
    author: 'Carl Sagan',
    yearOrEra: '1995 CE',
    era: 'industrial-modern',
    category: 'Science & Cosmos',
    description: 'The definitive defense of critical thinking, scientific skepticism, and the "Baloney Detection Kit" to identify scams, falsehoods, and pseudo-science.',
    keyCoreWisdom: [
      'Extraordinary claims require extraordinary evidence.',
      'Do not rely on authorities merely because of their status; arguments from authority carry little weight.',
      'Keep an open mind, but not so open that your brains fall out.'
    ],
    famousQuote: 'For me, it is far better to grasp the Universe as it really is than to persist in delusion, however satisfying and reassuring.',
    problemItSolves: 'Falling for misinformation, superstitions, fraudulent schemes, emotional bias.'
  },

  // --- CONTEMPORARY ERA ---
  {
    id: 'thinking-fast-and-slow-kahneman',
    title: 'Thinking, Fast and Slow',
    author: 'Daniel Kahneman (Nobel Laureate in Economics)',
    yearOrEra: '2011 CE',
    era: 'contemporary',
    category: 'Psychology & Mind',
    description: 'Breakthrough behavioral economics analyzing System 1 (fast, instinctive, emotional) and System 2 (slow, deliberate, logical) and common cognitive traps.',
    keyCoreWisdom: [
      'Loss aversion: We fear losses twice as much as we value equivalent gains.',
      'Availability heuristic: We overestimate risks that are emotionally dramatic or recently seen.',
      'Slow down high-stakes decisions to force deliberate System 2 engagement.'
    ],
    famousQuote: 'Nothing in life is as important as you think it is, while you are thinking about it.',
    problemItSolves: 'Impulsive financial mistakes, emotional overreaction, poor risk assessment.'
  },
  {
    id: 'antifragile-taleb',
    title: 'Antifragile: Things That Gain from Disorder',
    author: 'Nassim Nicholas Taleb',
    yearOrEra: '2012 CE',
    era: 'contemporary',
    category: 'Strategy & Leadership',
    description: 'Concepts beyond resilience: building systems, investments, and personal lives that actually grow stronger when subjected to shocks and volatility.',
    keyCoreWisdom: [
      'The resilient resists shocks and stays the same; the antifragile gets better.',
      'Barbell Strategy: Play hyper-safe in 90% of assets/habits, and take high-upside speculative bets in 10%, avoiding the fragile middle.',
      'Skin in the Game: Never trust advice from anyone who does not pay a price when they are wrong.'
    ],
    famousQuote: 'Wind extinguishes a candle and energizes fire. You want to be the fire and wish for the wind.',
    problemItSolves: 'Unexpected setbacks, fragile career or financial setup, panic during market crashes.'
  },
  {
    id: 'atomic-habits-clear',
    title: 'Atomic Habits',
    author: 'James Clear',
    yearOrEra: '2018 CE',
    era: 'contemporary',
    category: 'Psychology & Mind',
    description: 'Systematic guide to breaking bad habits and building extraordinary results through 1% daily micro-improvements and environmental design.',
    keyCoreWisdom: [
      'You do not rise to the level of your goals; you fall to the level of your systems.',
      'Habit loop: Cue, Craving, Response, Reward. Make good habits obvious, attractive, easy, and satisfying.',
      'Focus on identity change: Decide who you want to be, then prove it to yourself with small wins.'
    ],
    famousQuote: 'Every action you take is a vote for the type of person you wish to become.',
    problemItSolves: 'Procrastination, lack of consistency, broken routines, difficulty forming habits.'
  },
  {
    id: '48-laws-of-power-greene',
    title: 'The 48 Laws of Power & Mastery',
    author: 'Robert Greene',
    yearOrEra: '1998 CE',
    era: 'contemporary',
    category: 'Strategy & Leadership',
    description: 'Historical exploration of interpersonal dynamics, court politics, avoiding traps, and attaining true craft mastery.',
    keyCoreWisdom: [
      'Never outshine the master; always make those above you appear more brilliant than they are.',
      'Master the art of timing and keep your hands clean.',
      'Mastery is achieved through intense apprenticeship, patience, and 10,000 hours of deep engagement.'
    ],
    famousQuote: 'When you show yourself to the world and display your talents, you naturally stir all kinds of resentment, envy, and other manifestations of insecurity.',
    problemItSolves: 'Workplace politics, betrayal, naive interpersonal trust, career stagnation.'
  }
];
