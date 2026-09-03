import { SolutionResponse, TeachModule } from '../types';

export interface PrecomputedSolution {
  keywords: string[];
  urduRoman: SolutionResponse;
  urdu: SolutionResponse;
  en: SolutionResponse;
}

export interface PrecomputedMasterclass {
  keywords: string[];
  urduRoman: TeachModule;
  urdu: TeachModule;
  en: TeachModule;
}

// 1. Instant Precomputed Problem Solutions
export const PRECOMPUTED_SOLUTIONS: PrecomputedSolution[] = [
  // Problem 1: Business Loss / Karobar me Nuqsan
  {
    keywords: ['karobar', 'business', 'nuqsan', 'loss', 'debt', 'qarz', 'paisa', 'finance', 'hopeless', 'failure', 'rasta band'],
    urduRoman: {
      problemSummary: 'Karobar me shadeed maali nuqsan, qarz ka bojh, aur mustaqbil ke band raaste.',
      rootCauseAnalysis: 'Tareekh batati hai ke 90% tijarti tabahiyan maali ghalti se pehle zehni ghair-lajmi (panic) aur ghuroor (hubris) se peda hoti hain. Jab insan qarz aur nuqsan ko zaati wajood ka zawal samajh bethta hai, toh faisla saazi ki quwwat mar jati hai.',
      citations: [
        {
          bookTitle: 'Al-Muqaddimah (Tareekh-e-Ibn Khaldun)',
          author: 'Ibn Khaldun (1377 CE)',
          chapterOrSection: 'Tijarat aur Iqtisadi Asas (Economic Cycles)',
          quote: 'Har tijarat ka urooj us waqt doobta hai jab taajir apne ikhrajat aur asoolon ko mustaqil farz kar leta hai, halankay bazaar darya ki tarah badalta rehta hai.',
          reasoning: 'Ibn Khaldun wazeh karte hain ke maali zawal qudrati doraniye ka hissa hai. Asal karkardagi yeh hai ke foran apne fuzool ikhrajat khatam kiye jayein aur naye bazaar ki haqeeqat ko qubool kiya jaye.'
        },
        {
          bookTitle: 'Meditations (Ta\'ammulat)',
          author: 'Marcus Aurelius (170 CE)',
          chapterOrSection: 'Book IV: The Inner Citadel',
          quote: 'Nuqsan mehaz ek tabdeeli hai, aur tabdeeli Qudrat ka pasandeeda nizam hai.',
          reasoning: 'Roman Badshah sikhata hai ke daulat ka aana jana aapke ikhtiyar me nahi hai, lekin aapki zahanat, imandari aur dubaara khara hone ka azm aapke ikhtiyar me hai.'
        },
        {
          bookTitle: 'The Richest Man in Babylon',
          author: 'George S. Clason (1926)',
          chapterOrSection: 'Seven Cures for a Lean Purse',
          quote: 'Daulat us shakhs ke paas wapis aati hai jo apne bache hue har sikkay ki hifazat karta hai aur jaldbaaz munafa khori se bachta hai.',
          reasoning: 'Baabal ke qadeem asool ke mutabiq nuqsan ke baad pehla qadam qarz-khwahon ke sath shafaf muzakrat aur har aamdan ka 10% hissa mehfooz karna hai.'
        },
        {
          bookTitle: 'Antifragile: Things That Gain from Disorder',
          author: 'Nassim Nicholas Taleb (2012)',
          chapterOrSection: 'Post-Traumatic Growth & Optionality',
          quote: 'Hawa mombatti ko bujha deti hai lekin aag ko mazeed bharka deti hai. Aapko aag banna hai, mombatti nahi.',
          reasoning: 'Nuqsan se jo sabaq milta hai woh dunya ki kisi university me nahi seekha ja sakta. Is nuqsan ko apni bunyad banayein.'
        }
      ],
      actionSteps: [
        {
          step: 1,
          title: 'Maali Qila-Bandi (Financial Triage)',
          description: 'Foran tamam ghair-zaroori shakhsi o karobari ikhrajat par break lagayein. Apne kham nuqsan ka sahi kaghazi hisab banayein.',
          bookReference: 'The Richest Man in Babylon'
        },
        {
          step: 2,
          title: 'Qarz-khwahon Se Izzatdar Shafafiyat',
          description: 'Chupne ya jhoot bolne ke bajaye tamam qarz-khwahon se mil kar ba-waqar andaz me sach batayein aur naya payment plan tay karein.',
          bookReference: 'Al-Muqaddimah'
        },
        {
          step: 3,
          title: 'Dichotomy of Control (Apne Ikhtiyar Ka Ihata)',
          description: 'Gaye hue paison ka rona band karein. Subah uth kar sirf un 3 kamo par dhayan dein jo aaj aapke ikhtiyar me hain (naye grahak, behtar khidmat).',
          bookReference: 'Meditations (Marcus Aurelius)'
        },
        {
          step: 4,
          title: 'Choti Cash-Flow Ka Naya Silsila (Micro-Pivot)',
          description: 'Bari tijarat dubaara shuru karne se pehle choti rozmarrah ki cash-flow paida karne wala micro-model shuru karein.',
          bookReference: 'Antifragile'
        }
      ],
      dailyPrescription: 'Rozana subah 10 minute kaghaz par sirf do cheezein likhein: "Kal kya ghalti hui thi?" aur "Aaj main kis ek kaam se aamadani la sakta hoon?".',
      philosophicalVerdict: 'Dunya me koi azeem taajir ya insan aisa nahi guzra jis ne zameen par gir kar dubaara imarat tameer na ki ho. Nuqsan aapki taqdeer nahi, aapki tarbiyat hai.'
    },
    urdu: {
      problemSummary: 'کاروبار میں شدید مالی نقصان، قرضوں کا دباؤ اور راستے مسدود محسوس ہونا۔',
      rootCauseAnalysis: 'تاریخی و نفسیاتی کتب کے مطابق کاروباری زوال مالی غلطی سے پہلے خوف اور گھبراہٹ سے شروع ہوتا ہے۔ جب انسان نقصان کو اپنی ذات کی ناکامی سمجھ لے تو سوچنے کی صلاحیت مفلوج ہو جاتی ہے۔',
      citations: [
        {
          bookTitle: 'مقدمہ ابن خلدون',
          author: 'ابن خلدون (1377ء)',
          chapterOrSection: 'معاشیات اور عروج و زوال کے ادوار',
          quote: 'بazar ایک بہتا دریا ہے، جو تاجر لہروں کے رخ کے ساتھ اپنے اخراجات کو نہیں بدلتا وہ غرق ہو جاتا ہے۔',
          reasoning: 'ابن خلدون کے مطابق ہر بحران نئے ڈھانچے کی تشکیل کا موقع ہوتا ہے۔'
        },
        {
          bookTitle: 'تأملات (Meditations)',
          author: 'مارکس اوریلیس (170ء)',
          chapterOrSection: 'اندرونی قلعہ (The Inner Citadel)',
          quote: 'نقصان محض ایک تبدیلی ہے، اور تبدیلی کائنات کا بنیادی قانون ہے۔',
          reasoning: 'رومی فلسفہ سکھاتا ہے کہ مال کا آنا جانا اختیار سے باہر ہے، مگر ہمت اور دانش آپ کے اختیار میں ہے۔'
        },
        {
          bookTitle: 'بابل کا سب سے امیر آدمی (Richest Man in Babylon)',
          author: 'جارج ایس کلاسن (1926ء)',
          chapterOrSection: 'خالی بٹوے کے سات علاج',
          quote: 'جو شخص اپنے پاس باقی بچ جانے والے ایک سکے کی بھی قدر کرتا ہے، دولت اس کے پاس پلٹ کر آتی ہے۔',
          reasoning: 'سب سے پہلے قرض خواہوں سے کھرا سچ بولیں اور اپنی بچی ہوئی رقم کی مکمل حفاظت کریں۔'
        }
      ],
      actionSteps: [
        {
          step: 1,
          title: 'فوری مالی جائزہ اور غیر ضروری اخراجات کا خاتمہ',
          description: 'تمام فالتو خرچوں پر فوری بند باندھیں اور اصل خسارے کا کاغذ پر صحیح حساب لگائیں۔',
          bookReference: 'The Richest Man in Babylon'
        },
        {
          step: 2,
          title: 'قرض خواہوں سے وقار کے ساتھ شفاف رابطہ',
          description: 'چھپنے کی بجائے سچائی اور واضح وقت کا تعین کر کے اعتماد بحال کریں۔',
          bookReference: 'مقدمہ ابن خلدون'
        },
        {
          step: 3,
          title: 'سوچ اور اختیار کا کنٹرول',
          description: 'جو دولت چلی گئی اس پر ماتم کرنے کی بجائے صرف ان کاموں پر توجہ دیں جو آج آپ کے ہاتھ میں ہیں۔',
          bookReference: 'تأملات (مارکس اوریلیس)'
        },
        {
          step: 4,
          title: 'چھوٹے قدموں سے روزانہ کی کیش فلو',
          description: 'بڑے منافع کے خوابوں کی بجائے روزانہ تھوڑا پیسہ کمانے والے عمل کو ترجیح دیں۔',
          bookReference: 'اینٹی فریجائل'
        }
      ],
      dailyPrescription: 'ہر صبح کاغذ پر لکھیں: "جو چلا گیا وہ سبق تھا، جو بچا ہے وہ میرا ہتھیار ہے۔"',
      philosophicalVerdict: 'تاریخ گواہ ہے کہ کوئی بڑا تاجر خسارے کے بغیر کندن نہیں بنا۔ یہ زوال آپ کے عروج کا پہلا مرحلہ ہے۔'
    },
    en: {
      problemSummary: 'Severe business failure, crushing financial liabilities, and feeling at a dead end.',
      rootCauseAnalysis: 'Historical economic literature reveals that financial crises become fatal only when panic paralyzes strategic decision-making and the entrepreneur equates monetary loss with personal ruin.',
      citations: [
        {
          bookTitle: 'The Muqaddimah: An Introduction to History',
          author: 'Ibn Khaldun (1377 CE)',
          chapterOrSection: 'Commerce & Economic Equilibrium',
          quote: 'Markets are dynamic tides; the merchant who treats fixed prosperity as eternal is inevitably humbled by cyclic shifts.',
          reasoning: 'Ibn Khaldun demonstrates that economic downturns are natural systemic contractions requiring immediate overhead slashing and structural realignment.'
        },
        {
          bookTitle: 'Meditations',
          author: 'Marcus Aurelius (170 CE)',
          chapterOrSection: 'Book IV: The Dichotomy of Control',
          quote: 'Loss is nothing else but change, and change is Nature\'s delight.',
          reasoning: 'External riches fluctuate outside human sovereignty; personal integrity, sharp judgment, and resilience remain fully within your fortress.'
        },
        {
          bookTitle: 'Antifragile',
          author: 'Nassim Nicholas Taleb (2012)',
          chapterOrSection: 'Wind Extinguishes a Candle and Energizes Fire',
          quote: 'You want to be the fire and wish for the wind.',
          reasoning: 'Use the failure as an evolutionary shock that cleanses fragile assumptions and builds an unshakeable foundation.'
        }
      ],
      actionSteps: [
        {
          step: 1,
          title: 'Emergency Overhead Triage',
          description: 'Immediately freeze non-essential operational and personal expenditures to stop financial bleeding.',
          bookReference: 'The Richest Man in Babylon'
        },
        {
          step: 2,
          title: 'Proactive Creditor Transparency',
          description: 'Approach creditors directly with dignity, transparent audits, and realistic restructuring timelines.',
          bookReference: 'The Muqaddimah'
        },
        {
          step: 3,
          title: 'Focus Exclusively on the Controllable',
          description: 'Cease ruminating over sunk capital. Focus 100% of your waking hours on client acquisition and micro-cashflow.',
          bookReference: 'Meditations'
        },
        {
          step: 4,
          title: 'Lean Iteration and Micro-Pivoting',
          description: 'Test small, low-risk revenue channels that generate daily liquidity before scaling capital.',
          bookReference: 'Antifragile'
        }
      ],
      dailyPrescription: 'Spend the first 15 minutes of every dawn journaling 3 actionable revenue-driving micro-tasks for the day.',
      philosophicalVerdict: 'No titan in recorded history built enduring mastery without surviving the baptism of failure. This is not your tomb; it is your anvil.'
    }
  },

  // Problem 2: Relationships & Ego Conflict
  {
    keywords: ['ego', 'larai', 'rishta', 'relationship', 'conflict', 'family', 'ghar', 'sukoon', 'peace', 'shadi', 'marriage'],
    urduRoman: {
      problemSummary: 'Ghar, khandani ya shakhsi rishton me ego ki jung, bar bar jhagray aur be-sukooni.',
      rootCauseAnalysis: 'Rumi aur Saadi Shirazi ke mutabiq rishton me larai aksar "masle" par nahi balkay "Main sahi hoon" ki zidd par hoti hai. Jab do afraad sachai ki talash ke bajaye apni ana ko bachane lagte hain, toh mohabbat dushmani me dhal jati hai.',
      citations: [
        {
          bookTitle: 'Masnavi Manavi',
          author: 'Jalaluddin Rumi (1258 CE)',
          chapterOrSection: 'Daftar Awwal: Ana aur Aina (The Mirror of Self)',
          quote: 'Jab do shakhs gusse me hon toh unke dilon ka fasla barh jata hai, is liye woh cheekhte hain.',
          reasoning: 'Rumi samjhate hain ke cheekhna aur taana marna kamzor dil ki nishani hai. Khamoshi aur qubooliyat se ego ki aag bujh jati hai.'
        },
        {
          bookTitle: 'Gulistan-e-Saadi',
          author: 'Sheikh Saadi Shirazi (1258 CE)',
          chapterOrSection: 'Bab-e-Haftum: Dar Tarseer-e-Tarbiyat',
          quote: 'Gusse ke waqt sachai bhi zehar ban jati hai, aur narmi ke waqt dushman bhi dost ban jata hai.',
          reasoning: 'Saadi batate hain ke gusse me di gayi daleel chahe kitni bhi sach ho, doosre ke dil me sirf nafrat peda karti hai.'
        },
        {
          bookTitle: 'How to Win Friends and Influence People',
          author: 'Dale Carnegie (1936)',
          chapterOrSection: 'You Can\'t Win an Argument',
          quote: 'Behas jeetne ka sirf ek hi tareeqa dunya me mojood hai: behas se bachna.',
          reasoning: 'Agar aap behas jeet bhi gaye aur doosra haar gaya, aapne uski ana ko zakhmi kar diya aur rishta kho diya.'
        }
      ],
      actionSteps: [
        {
          step: 1,
          title: '24-Ghantay Ka Khamoshi Ka Waqfa (The Cool-off Rule)',
          description: 'Jab gusse ki aag bharki ho toh koi faisla ya taana na dein. Kamray se bahar nikal jayein aur 24 ghantay tak sakoot ikhtiyar karein.',
          bookReference: 'Gulistan-e-Saadi'
        },
        {
          step: 2,
          title: '"Main" Ke Bajaye "Hum" Ka Zaawiya',
          description: 'Doosre insan ko ghalat sabit karne ki koshish khatam karein. Pehle uski takleef aur shikayat ko ba-ghor suniye.',
          bookReference: 'How to Win Friends'
        },
        {
          step: 3,
          title: 'Apni Aik Ghalti Ka Aitraaf (Disarm with Humility)',
          description: 'Guftagu ka aaghaz apni kisi choti kotahi ke aitraaf se karein. Yeh doosre insan ke difai hathiyar foran gira deta hai.',
          bookReference: 'Masnavi (Rumi)'
        },
        {
          step: 4,
          title: 'Ghar Ka Mahol Badalne Ka Ehd',
          description: 'Ghar me rozi ya choti cheezon par tanqeed band karein aur hafte me ek baar mushtarka khana ya sukoon ka waqt nikaalein.',
          bookReference: 'Nicomachean Ethics (Aristotle)'
        }
      ],
      dailyPrescription: 'Rozana subah faisla karein: "Aaj main sahi sabit hone par sakoon ko tarjeeh doonga."',
      philosophicalVerdict: 'Rishte mantiq se nahi, reham se chaltay hain. Jahan ana jhuk jati hai, wahan dilon me Jannat utar aati hai.'
    },
    urdu: {
      problemSummary: 'گھریلو یا ذاتی تعلقات میں انا (Ego) کا ٹکراؤ اور بد سکونی۔',
      rootCauseAnalysis: 'صوفیانہ و نفسیاتی حکمت کے مطابق اکثر جھگڑے مسئلے کی سنگینی پر نہیں بلکہ "میں صحیح ہوں" کے غرور پر ہوتے ہیں۔',
      citations: [
        {
          bookTitle: 'مثنوی معنوی',
          author: 'مولانا جلال الدین رومیؒ (1258ء)',
          chapterOrSection: 'دفتر اول: آئینہ دل',
          quote: 'جب دلوں میں فاصلہ بڑھ جائے تو انسان ایک دوسرے پر چیخنے لگتے ہیں۔',
          reasoning: 'رومی کے مطابق خاموشی اور عاجزی انا کی آگ پر ٹھنڈا پانی ہے۔'
        },
        {
          bookTitle: 'گلستانِ سعدی',
          author: 'شیخ سعدی شیرازیؒ (1258ء)',
          chapterOrSection: 'باب تربیت',
          quote: 'غصے کے وقت کہی گئی سچی بات بھی دل کو زخمی کر دیتی ہے۔',
          reasoning: 'سعدی فرماتے ہیں کہ جھگڑے میں دلیل دینے سے نفرت بڑھتی ہے۔'
        }
      ],
      actionSteps: [
        {
          step: 1,
          title: 'غصے کے وقت 24 گھنٹے کا مکمل سکوت',
          description: 'گرما گرم بحث میں بولنے کی بجائے خاموشی اختیار کریں۔',
          bookReference: 'گلستانِ سعدی'
        },
        {
          step: 2,
          title: 'اپنی غلطی کا پہل کر کے اعتراف',
          description: 'اپنی کسی کوتاہی کو مان لینا دوسرے کے سارے ہتھیار چھین لیتا ہے۔',
          bookReference: 'مثنوی رومی'
        },
        {
          step: 3,
          title: 'بحث جیتنے کی بجائے دل جیتنے کا فیصلہ',
          description: 'بحث جیت کر رشتہ ہارنے سے بہتر ہے کہ خاموش رہ کر انسان کو بچا لیا جائے۔',
          bookReference: 'ڈیل کارنیگی'
        }
      ],
      dailyPrescription: 'روزانہ ایک بار دوسرے کی بات کو بغیر کاٹے سنیں۔',
      philosophicalVerdict: 'انا کا سر جھک جائے تو بکھرے ہوئے رشتے دوبارہ جڑ جاتے ہیں۔'
    },
    en: {
      problemSummary: 'Destructive ego clashes, escalating resentment, and breakdown of peace in relationships.',
      rootCauseAnalysis: 'Classic wisdom shows that relationship friction rarely stems from external facts; it is fueled by the pathological urge to protect egoic supremacy over human connection.',
      citations: [
        {
          bookTitle: 'The Masnavi',
          author: 'Jalaluddin Rumi (1258 CE)',
          chapterOrSection: 'Book I: The House of the Heart',
          quote: 'Silence is the language of God, all else is poor translation.',
          reasoning: 'Rumi teaches that escalation feeds upon argumentative resistance; strategic humility extinguishes interpersonal hostility.'
        },
        {
          bookTitle: 'How to Win Friends and Influence People',
          author: 'Dale Carnegie (1936)',
          chapterOrSection: 'The Only Way to Get the Best of an Argument',
          quote: 'A man convinced against his will is of the same opinion still.',
          reasoning: 'Winning a verbal battle creates enduring humiliation in the other person, permanently damaging the bond.'
        }
      ],
      actionSteps: [
        {
          step: 1,
          title: 'Implement the 24-Hour Cooling De-escalation',
          description: 'Refuse to exchange counter-arguments in the heat of passion. Step back and breathe.',
          bookReference: 'Gulistan of Saadi'
        },
        {
          step: 2,
          title: 'Disarm Through Voluntary Humility',
          description: 'Begin communication by acknowledging one legitimate grievance the other person holds against you.',
          bookReference: 'The Masnavi'
        },
        {
          step: 3,
          title: 'Trade Righteousness for Harmony',
          description: 'Ask yourself: "Do I want to be technically right, or do I want to be in loving communion?"',
          bookReference: 'Dale Carnegie'
        }
      ],
      dailyPrescription: 'Listen actively for 5 full minutes today without offering a single defense or rebuttal.',
      philosophicalVerdict: 'Where pride dissolves, the sacred architecture of love is instantly restored.'
    }
  },

  // Problem 3: Procrastination & Focus
  {
    keywords: ['procrastination', 'susti', 'focus', 'waqt', 'laziness', 'distraction', 'idle', 'delay', 'taal matol'],
    urduRoman: {
      problemSummary: 'Waqt ka be-dareegh zaya hona, susti (procrastination), aur mustaqil focus na rehna.',
      rootCauseAnalysis: 'Imam Al-Ghazali aur modern science ke mutabiq susti jism ki thakawat nahi, balkay zehan ka khof aur dushwari se farar (emotional avoidance) hai. Insaan jab kisi kaam ko bojh samajhta hai toh woh aasan lazzat (phone/social media) ki taraf bhagta hai.',
      citations: [
        {
          bookTitle: 'Ihya Ulum al-Din (Uloom-ud-Deen Ka Ihya)',
          author: 'Imam Abu Hamid Al-Ghazali (1097 CE)',
          chapterOrSection: 'Kitab Maraqabat o Muhasabat (Waqt Aur Nafs Ka Hisab)',
          quote: 'Waqt talwar hai; agar tum isay nahi kaato ge toh yeh tumhein kaat de ga.',
          reasoning: 'Ghazali samjhate hain ke insan ki asal poonji uski saansein hain. Har din jo be-maqsad guzar gaya woh wapis nahi laya ja sakta.'
        },
        {
          bookTitle: 'Atomic Habits',
          author: 'James Clear (2018)',
          chapterOrSection: 'The 2-Minute Rule & Friction Reduction',
          quote: 'Aap apne maqasid ke mayaar tak nahi pohanchte, aap apne nizam (systems) ke mayaar tak girte hain.',
          reasoning: 'Bara kaam zehan ko dara deta hai. Kaam ko sirf 2 minute ke chotay tareen hissay me taqseem karein.'
        },
        {
          bookTitle: 'Deep Work: Rules for Focused Success',
          author: 'Cal Newport (2016)',
          chapterOrSection: 'Rule #1: Work Deeply & Drain the Shallows',
          quote: 'Tawajjuh (Focus) ki quwwat is sadi ki azeem tareen daulat hai jo har roz zaya ki ja rahi hai.',
          reasoning: 'Har ghantay me 20 dafa mobile dekhna dimagh ke neuronic circuits ko kamzor kar deta hai.'
        }
      ],
      actionSteps: [
        {
          step: 1,
          title: '2-Minute Ka Aaghaz (The 2-Minute Gateway)',
          description: 'Kisi bhi mushkil kaam ke liye sirf 2 minute ka waqt muqarrar karein (maslan: sirf kaghaz kholna ya 1 safha likhna). Shuru karte hi susti toot jati hai.',
          bookReference: 'Atomic Habits'
        },
        {
          step: 2,
          title: 'Digital Fasting (Mobile Ko Qaid Karein)',
          description: 'Subah uthne ke pehle 90 minute aur kaam ke dauran mobile ko doosre kamray me rakh dein.',
          bookReference: 'Deep Work'
        },
        {
          step: 3,
          title: 'Shab-ba-Khair Ka Muhasaba',
          description: 'Raat ko sonay se pehle 3 minute kaghaz par agle din ke sirf 2 ahem tareen kam likh kar soyein.',
          bookReference: 'Ihya Ulum al-Din'
        },
        {
          step: 4,
          title: 'Jism Ko Hararat Dein',
          description: 'Susti aane par foran thanda paani piyein, wuzu karein ya 10 dafa chal kar zehan ki susti toarein.',
          bookReference: 'Canon of Medicine (Ibn Sina)'
        }
      ],
      dailyPrescription: 'Har roz subah 90 minute ka aik "Deep Work Block" banayein jis me koi rabta ya no-screen na ho.',
      philosophicalVerdict: 'Zindagi mukhtasar hai aur himmat be-karar. Kal ka intizar karne wale hamesha khali hath reh jate hain.'
    },
    urdu: {
      problemSummary: 'وقت کا ضیاع، سستی اور توجہ مرکوز کرنے میں ناکامی۔',
      rootCauseAnalysis: 'امام غزالیؒ کے مطابق سستی وقت کی کمی نہیں بلکہ مقصد کی بے سمتی اور نفس کی آسان لذتوں کی طرف بھاگنے کا نام ہے۔',
      citations: [
        {
          bookTitle: 'احیاء علوم الدین',
          author: 'امام ابو حامد الغزالیؒ (1097ء)',
          chapterOrSection: 'کتاب المحاسبہ',
          quote: 'وقت تلوار ہے، اگر تم نے اسے نہ کاٹا تو یہ تمہیں کاٹ ڈالے گا۔',
          reasoning: 'ہر دن جو سستی میں گزرا وہ انسان کی عمر کا مستقل گھاٹا ہے۔'
        },
        {
          bookTitle: 'ایٹامک ہیبٹس (Atomic Habits)',
          author: 'جیمز کلیئر (2018ء)',
          chapterOrSection: '2 منٹ کا اصول',
          quote: 'بڑا ارادہ نہیں، روزانہ کا چھوٹا نظام انسان کو کامیاب بناتا ہے۔',
          reasoning: 'کسی بھی کام کو شروع کرنے کے لیے صرف 2 منٹ کی ہمت درکار ہوتی ہے۔'
        }
      ],
      actionSteps: [
        {
          step: 1,
          title: '2 منٹ کا اصول',
          description: 'کام کے آغاز کو آسان ترین بنائیں، شروعات کے 2 منٹ بعد کام خود بخود رفتار پکڑ لیتا ہے۔',
          bookReference: 'Atomic Habits'
        },
        {
          step: 2,
          title: 'اسکرین سے دوری',
          description: 'اہم کام کے وقت موبائل فون کو دوسرے کمرے میں رکھیں۔',
          bookReference: 'Deep Work'
        },
        {
          step: 3,
          title: 'رات کو اگلے دن کے 2 کاموں کا تعین',
          description: 'صبح کی الجھن سے بچنے کے لیے رات ہی کام لکھ لیں۔',
          bookReference: 'احیاء علوم الدین'
        }
      ],
      dailyPrescription: 'روزانہ ایک گھنٹہ مکمل یکسوئی سے کام کریں۔',
      philosophicalVerdict: 'وقت زندگی کی سانسیں ہیں؛ جس نے وقت بچا لیا اس نے اپنی تقدیر بچا لی۔'
    },
    en: {
      problemSummary: 'Chronic procrastination, severe focus dissipation, and continuous postponement of life priorities.',
      rootCauseAnalysis: 'Classic and modern cognitive treatises reveal that procrastination is not laziness; it is emotional avoidance triggered by overwhelming cognitive tasks that drive the brain toward cheap dopamine.',
      citations: [
        {
          bookTitle: 'Ihya Ulum al-Din',
          author: 'Imam Al-Ghazali (1097 CE)',
          chapterOrSection: 'Book of Self-Examination (Muhasaba)',
          quote: 'Time is a sharp blade; if you do not cut it, it severs you.',
          reasoning: 'Al-Ghazali notes that every wasted breath is an irreplaceable piece of human capital squandered.'
        },
        {
          bookTitle: 'Atomic Habits',
          author: 'James Clear (2018)',
          chapterOrSection: 'The Law of Least Effort',
          quote: 'You do not rise to the level of your goals. You fall to the level of your systems.',
          reasoning: 'Shrink initiation friction down to a micro-threshold of two minutes to bypass cerebral resistance.'
        }
      ],
      actionSteps: [
        {
          step: 1,
          title: 'Apply the 2-Minute Gateway Rule',
          description: 'Commit to engaging with the difficult task for precisely 120 seconds. Momentum takes over automatically.',
          bookReference: 'Atomic Habits'
        },
        {
          step: 2,
          title: 'Establish a Sanctum of Deep Work',
          description: 'Physically quarantine digital notifications and smartphones during key morning hours.',
          bookReference: 'Deep Work'
        },
        {
          step: 3,
          title: 'Nightly Triad Protocol',
          description: 'Identify the top 2 non-negotiable strategic moves for tomorrow before retiring to bed.',
          bookReference: 'Ihya Ulum al-Din'
        }
      ],
      dailyPrescription: 'Execute one uninterrupted 60-minute deep sprint every morning before touching social feeds.',
      philosophicalVerdict: 'Action does not follow motivation; motivation ignites only in the furnace of bold action.'
    }
  },

  // Problem 4: Emotional Grief & Purpose
  {
    keywords: ['grief', 'udasi', 'dil tootna', 'depression', 'sadness', 'heartbreak', 'purpose', 'meaning', 'dukh', 'rona'],
    urduRoman: {
      problemSummary: 'Dil ki shadeed udasi, kisi ahem cheez ka chhin jana, aur zindagi ka maqsad be-mani lagna.',
      rootCauseAnalysis: 'Viktor Frankl aur Stoics ke mutabiq insan takleef se nahi toot-ta, balkay "be-maqsad takleef" se toot-ta hai. Jab takleef ko kisi aala maqsad ya roohani tarbiyat ka hissa samajh liya jaye, toh wahi takleef insan ki quwwat ban jati hai.',
      citations: [
        {
          bookTitle: 'Man\'s Search for Meaning',
          author: 'Viktor Frankl (1946)',
          chapterOrSection: 'Experiences in a Concentration Camp',
          quote: 'Jis insan ke paas jeenay ki koi "Kyun" (Why) mojood ho, woh taqreeban har "Kaisay" (How) ko bardasht kar sakta hai.',
          reasoning: 'Frankl ne shadeed tareen zulm me bhi dekha ke jo log doosron ki madad ya mustaqbil ke maqsad se juray rahay, unki rooh zinda rahi.'
        },
        {
          bookTitle: 'Asrar-e-Khudi (Secrets of the Self)',
          author: 'Allama Muhammad Iqbal (1915)',
          chapterOrSection: 'Khudi aur Dukh Ka Muqam',
          quote: 'Moti ban kar nikalna hai toh samandar ke dukh aur dabaao ko jhelna parta hai.',
          reasoning: 'Iqbal sikhate hain ke dukh insan ki khudi ko tarashne wala chheeni aur hatora hai.'
        },
        {
          bookTitle: 'The Prophet',
          author: 'Kahlil Gibran (1923)',
          chapterOrSection: 'On Joy and Sorrow',
          quote: 'Aapka dukh jitna gehra ghaar aapke andar khodta hai, aainda aapki khushi utni hi ziyaada sama sakti hai.',
          reasoning: 'Gibran samjhate hain ke dukh aur khushi ek hi sarmaye ke do rukh hain.'
        }
      ],
      actionSteps: [
        {
          step: 1,
          title: 'Dukh Ko Qubool Karein (No Denial)',
          description: 'Apne dukh ko chupanay ya zabardasti muskurane ki koshish na karein. Ro lein, likhein, aur is takleef ko insani hone ka hissa samjhein.',
          bookReference: 'The Prophet (Kahlil Gibran)'
        },
        {
          step: 2,
          title: 'Apne Se Zyada Majboor Insan Ki Madad',
          description: 'Apne gham se nikalne ka sab se tezi se asar karne wala nuskha kisi yateem, mareez ya ghareeb ki khamosh madad karna hai.',
          bookReference: 'Man\'s Search for Meaning'
        },
        {
          step: 3,
          title: 'Dukh Ko Hunar Ya Koshish Me Dhalna',
          description: 'Apne andar ke dard ko mehnat, likhai ya kisi naye kaam me jhonk dein.',
          bookReference: 'Asrar-e-Khudi (Iqbal)'
        }
      ],
      dailyPrescription: 'Rozana subah shukarguzari ki 3 cheezein aur kisi ek shakhs ke liye dua ya khidmat muqarrar karein.',
      philosophicalVerdict: 'Zakham wahi jagah hai jahan se noor aapke andar dakhil hota hai.'
    },
    urdu: {
      problemSummary: 'اندرونی اداسی، دل ٹوٹنا اور مقصدِ حیات کا مفقود ہو جانا۔',
      rootCauseAnalysis: 'وکٹر فرینکل کے مطابق انسان تکلیف سے نہیں بلکہ "بے مقصد تکلیف" سے ٹوٹتا ہے۔ جب غم کو بامقصد بنا لیا جائے تو وہ طاقت بن جاتا ہے۔',
      citations: [
        {
          bookTitle: 'انسان کی تلاش برائے معنی (Man\'s Search for Meaning)',
          author: 'وکٹر فرینکل (1946ء)',
          chapterOrSection: 'معنی کا فلسفہ',
          quote: 'جس کے پاس جینے کی کوئی وجہ ہو وہ ہر تکلیف سہہ سکتا ہے۔',
          reasoning: 'فرینکل کے مطابق ہر زخم میں ایک نیا فرض چھپا ہوتا ہے۔'
        },
        {
          bookTitle: 'اسرارِ خودی',
          author: 'علامہ محمد اقبالؒ (1915ء)',
          chapterOrSection: 'خودی کی تربیت',
          quote: 'غم انسان کی روح کو کندن بناتا ہے تاکہ وہ خودی کے راز پا سکے۔',
          reasoning: 'اقبال دکھ کو مایوسی نہیں بلکہ بلند پروازی کا محرک قرار دیتے ہیں۔'
        }
      ],
      actionSteps: [
        {
          step: 1,
          title: 'غم کا اقرار اور تسلیم',
          description: 'تکلیف سے بھاگنے کی بجائے اسے زندگی کا حصہ سمجھیں۔',
          bookReference: 'خلیل جبران'
        },
        {
          step: 2,
          title: 'کسی دکھی انسان کی خاموش مدد',
          description: 'اپنے درد کی دوا دوسروں کا بوجھ بانٹنے میں ہے۔',
          bookReference: 'وکٹر فرینکل'
        }
      ],
      dailyPrescription: 'ہر رات اپنے دل پر ہاتھ رکھ کر کہیں: "یہ اندھیرا میرے اندر کے نور کی پیدائش ہے۔"',
      philosophicalVerdict: 'زخم وہی راستہ ہے جہاں سے کائنات کا نور آپ کے دل میں داخل ہوتا ہے۔'
    },
    en: {
      problemSummary: 'Deep emotional grief, heartbreak, existential vacuum, and feeling that life has lost its meaning.',
      rootCauseAnalysis: 'Psychological and classical wisdom demonstrates that humans do not break from suffering itself, but from suffering that appears devoid of meaning or redemption.',
      citations: [
        {
          bookTitle: 'Man\'s Search for Meaning',
          author: 'Viktor Frankl (1946)',
          chapterOrSection: 'Logotherapy in a Nutshell',
          quote: 'He who has a why to live for can bear almost any how.',
          reasoning: 'Suffering ceases to be suffering the moment it finds the context of a higher duty or transcendent purpose.'
        },
        {
          bookTitle: 'The Prophet',
          author: 'Kahlil Gibran (1923)',
          chapterOrSection: 'On Joy and Sorrow',
          quote: 'The deeper that sorrow carves into your being, the more joy you can contain.',
          reasoning: 'Sorrow expands the vessel of human consciousness, enabling profound future compassion.'
        }
      ],
      actionSteps: [
        {
          step: 1,
          title: 'Radical Acceptance of Grief',
          description: 'Acknowledge the depth of sorrow without self-condemnation. Mourning is honest spiritual labor.',
          bookReference: 'Kahlil Gibran'
        },
        {
          step: 2,
          title: 'Transcendence Through Altruism',
          description: 'Channel your pain into alleviating the burden of someone suffering worse than yourself.',
          bookReference: 'Viktor Frankl'
        }
      ],
      dailyPrescription: 'Name one living duty or creative project that still requires your presence on this Earth.',
      philosophicalVerdict: 'The wound is where the Light enters you. You are being forged, not destroyed.'
    }
  },

  // Problem 5: Workplace Politics & Envy
  {
    keywords: ['politics', 'siyasat', 'office', 'workplace', 'hasad', 'envy', 'sazish', 'competitor', 'dushman', 'toxic'],
    urduRoman: {
      problemSummary: 'Daftar, karobar ya samaj me logon ki hasad, peeth peechay buraai aur siyasat se bachna.',
      rootCauseAnalysis: 'Sun Tzu aur Robert Greene ke mutabiq har idaray me siyasat insan ki fithrat ka hissa hai. Ghalti yeh hoti hai ke sharif insan jazbati ho kar ladne lagta hai ya shikayatein karta hai, jis se sazishi anasir ko mazeed taqat milti hai.',
      citations: [
        {
          bookTitle: 'The Art of War',
          author: 'Sun Tzu (5th Century BCE)',
          chapterOrSection: 'Strategic Positioning & Subduing Without War',
          quote: 'Behtareen fatah woh hai jo baghair lare hasil ki jaye.',
          reasoning: 'Sun Tzu sikhata hai ke dushman se aamnay saamnay larna bewaqoofi hai. Apni qabiliyat aur karkardagi ko itna mazboot karein ke koi aapka rasta na rok sakay.'
        },
        {
          bookTitle: 'The 48 Laws of Power',
          author: 'Robert Greene (1998)',
          chapterOrSection: 'Law 4: Always Say Less Than Necessary',
          quote: 'Kam bolne se aapki taqat barhti hai aur dushman ko aapke khilaf koi hathiyar nahi milta.',
          reasoning: 'Siyasat me sab se bara hathiyar zabaan par qabu rakhna aur apne mansoobay chupana hai.'
        },
        {
          bookTitle: 'Letters from a Stoic',
          author: 'Seneca (65 CE)',
          chapterOrSection: 'On Envy and Tranquility',
          quote: 'Hasad karne wale ki saza yeh hai ke woh aapki taraqqi dekh kar khud andar se jalta rehta hai.',
          reasoning: 'Hasad karne walon par gussa karne ke bajaye unpar tars khayein kyunke woh apne hi zehar ke shikar hain.'
        }
      ],
      actionSteps: [
        {
          step: 1,
          title: 'Zabaan Ka Qufl (Information Discipline)',
          description: 'Daftar me kisi ke samne apne zaati masail, raaz ya kisi teesre shakhs ki buraai na karein.',
          bookReference: 'The 48 Laws of Power'
        },
        {
          step: 2,
          title: 'Document Everything (Har Cheez Ka Kaghazi Saboot)',
          description: 'Tamam ahem faislon, emails aur meetings ke minutes ko likhit shakal me record par rakhein.',
          bookReference: 'The Art of War'
        },
        {
          step: 3,
          title: 'Kamyabi Se Jawab Dein (Irreplaceable Competence)',
          description: 'Baat cheet me larnay ke bajaye apne kaam ke mayaar ko itna aala bana dein ke idara aapka mohtaj ho jaye.',
          bookReference: 'Letters from a Stoic'
        }
      ],
      dailyPrescription: 'Daftar me dakhil hote waqt faisla karein: "Main yahan kaam karne aaya hoon, dosti ya dushmani palne nahi."',
      philosophicalVerdict: 'Jab haathi chalta hai toh shor machane wale khud thak kar baith jate hain. Apni manzil par nigah rakhein.'
    },
    urdu: {
      problemSummary: 'دفتر، ادارے یا خاندان میں حسد، سیاست اور سازشوں کا مقابلہ۔',
      rootCauseAnalysis: 'سن زو کے مطابق سیاست کا مقابلہ جذبات سے نہیں بلکہ حکمت، خاموشی اور فولادی کارکردگی سے کیا جاتا ہے۔',
      citations: [
        {
          bookTitle: 'جنگ کی حکمتِ عملی (The Art of War)',
          author: 'سن زو (Sun Tzu)',
          chapterOrSection: 'بغیر لڑے فتح',
          quote: 'بہترین جرنیل وہ ہے جو میدان میں تلوار نکالے بغیر فتح پا لے۔',
          reasoning: 'سازشیوں سے بحث مت کریں بلکہ ادارے میں اپنی پوزیشن کو ناقابلِ تسخیر بنائیں۔'
        },
        {
          bookTitle: 'طاقت کے 48 قوانین',
          author: 'رابرٹ گرین (1998ء)',
          chapterOrSection: 'کم گو رہنا',
          quote: 'جتنا کم بولو گے، اتنا ہی زیادہ رعب اور وقار قائم رہے گا۔',
          reasoning: 'اپنے منصوبے اور ذاتی زندگی کو دفاتر کی چہ مگوئیوں سے دور رکھیں۔'
        }
      ],
      actionSteps: [
        {
          step: 1,
          title: 'خاموشی اور رازداری',
          description: 'دفتر میں کسی کے ساتھ بھی غیبت یا سازشی بات چیت میں شریک نہ ہوں۔',
          bookReference: '48 Laws of Power'
        },
        {
          step: 2,
          title: 'تحریری ثبوت (Documentation)',
          description: 'تمام اہم امور کو ای میل اور تحریری شکل میں محفوظ رکھیں۔',
          bookReference: 'The Art of War'
        }
      ],
      dailyPrescription: 'اپنے کام کے معیار کو اپنی سب سے بڑی شمشیر بنائیں۔',
      philosophicalVerdict: 'قافلے چلتے رہتے ہیں؛ شور مچانے والے خود تھک کر خاموش ہو جاتے ہیں۔'
    },
    en: {
      problemSummary: 'Navigating toxic workplace politics, malicious envy, sabotage, and corporate backstabbing.',
      rootCauseAnalysis: 'Strategic treatises teach that political friction is an inevitable consequence of human status games; naive individuals err by fighting emotionally instead of mastering calculated silence and positioning.',
      citations: [
        {
          bookTitle: 'The Art of War',
          author: 'Sun Tzu (5th Century BCE)',
          chapterOrSection: 'Attack by Stratagem',
          quote: 'The supreme art of war is to subdue the enemy without fighting.',
          reasoning: 'Never engage toxic adversaries on their chosen low ground; position your competence so high that attacks self-destruct.'
        },
        {
          bookTitle: 'The 48 Laws of Power',
          author: 'Robert Greene (1998)',
          chapterOrSection: 'Law 4: Always Say Less Than Necessary',
          quote: 'When you are trying to impress people with words, the more you say, the more common you appear.',
          reasoning: 'Silence starves corporate gossips of ammunition and projects unreadable authority.'
        }
      ],
      actionSteps: [
        {
          step: 1,
          title: 'Implement Ironclad Strategic Silence',
          description: 'Keep personal revelations, political opinions, and complaints strictly outside workplace walls.',
          bookReference: 'The 48 Laws of Power'
        },
        {
          step: 2,
          title: 'Paper-Trail Defense Protocol',
          description: 'Document all critical directives, agreements, and deliverables across written records.',
          bookReference: 'The Art of War'
        }
      ],
      dailyPrescription: 'Enter each workday with detachment: perform with excellence, speak with economy, retreat with dignity.',
      philosophicalVerdict: 'Let your excellence be so undisputed that your detractors defeat themselves through their own malice.'
    }
  }
];

// Helper to find instant solution by keywords or text
export function findFastSolution(query: string, lang: 'urdu-roman' | 'urdu' | 'en'): SolutionResponse | null {
  const q = query.toLowerCase().trim();
  for (const sol of PRECOMPUTED_SOLUTIONS) {
    const matched = sol.keywords.some(k => q.includes(k));
    if (matched) {
      if (lang === 'urdu') return sol.urdu;
      if (lang === 'en') return sol.en;
      return sol.urduRoman;
    }
  }
  return null;
}

// 2. Instant Precomputed Masterclasses
export const PRECOMPUTED_MASTERCLASSES: PrecomputedMasterclass[] = [
  // 1. Marcus Aurelius
  {
    keywords: ['marcus', 'aurelius', 'meditations', 'stoic', 'control', 'dichotomy', 'inner citadel'],
    urduRoman: {
      topic: 'Marcus Aurelius: Dichotomy of Control & Dimaghi Sakoon',
      authorOrBook: 'Meditations (Ta\'ammulat) by Roman Emperor Marcus Aurelius',
      overview: 'Marcus Aurelius dunya ki sab se taqatwar saltanat ka badshah tha, lekin har raat tanhai me apni diary me yeh likhta tha ke badshahat, maut, aur dunya ki buraaiyan uske ikhtiyar me nahi hain, sirf uska apna zehan uske ikhtiyar me hai.',
      keyPrinciples: [
        {
          title: 'Dichotomy of Control (Ikhtiyar Ka Do-Tarfah Usul)',
          explanation: 'Dunya do cheezon me bati hai: Jo cheezein aapke bas me hain (aapke khayalat, aapki koshish, aapki niyat) aur jo aapke bas me nahi hain (doosron ki raye, mausam, maut, maazi). Jo shakhs doosri qisam par ghussa ya pareshan hota hai woh hamesha be-sukoon rehta hai.',
          historicalContext: 'Marcus ne yeh asool tub likha jab Rome me shadeed waba pheli hui thi aur Germanic qabayil ne jang chher di thi.'
        },
        {
          title: 'The Inner Citadel (Andar Ka Na-Qabil-e-Taskheer Qila)',
          explanation: 'Aapka dimagh ek aisa qila hai jis me koi dushman dakhil nahi ho sakta jab tak aap khud darwaza na kholein. Koi aapko zaleel nahi kar sakta jab tak aap uski baat ko apni be-izzati na maan lein.',
          historicalContext: 'Apne hi qareebi general Avidius Cassius ki baghawat ke waqt Marcus ne baghair intiqam ke use maaf karne ka irada zahir kiya.'
        },
        {
          title: 'Memento Mori (Maut Ko Yaad Rakhna)',
          explanation: 'Har lamha socho ke shayad yeh tumhara aakhri din ho. Yeh khayal insani ana, be-fuzool jhagray aur laalach ko foran khatam kar deta hai.',
          historicalContext: 'Marcus ne apne 13 me se 8 bache shadeed bimariyon me kho diye the, is asool ne use tootan se bachaya.'
        }
      ],
      socraticQuestion: 'Agar aaj raat aapki saansein tham jayein, toh kya aapka yeh mojooda gussa aur fuzool pareshani waqai ahmiyat rakhti thi?',
      practicalExercise: 'Abhi kaghaz par 2 columns banayein: "Mere bas me kya hai" aur "Mere bas me kya nahi hai". Apni mojooda pareshani ko doosre column se kaat kar pehle column par kaam shuru karein.'
    },
    urdu: {
      topic: 'مارکس اوریلیس: سوچ کا کنٹرول اور اندرونی قلعہ',
      authorOrBook: 'تأملات (Meditations) - مارکس اوریلیس',
      overview: 'دنیا کے سب سے بڑے رومی شہنشاہ کے ذاتی نوٹس، جس میں اس نے دنیاوی شور کے درمیان ذہنی سکون پانے کا طریقہ سکھایا۔',
      keyPrinciples: [
        {
          title: 'اختیار کا بنیادی قانون (Dichotomy of Control)',
          explanation: 'کائنات میں کچھ چیزیں آپ کے اختیار میں ہیں (سوچ، کوشش، اخلاق) اور باقی چیزیں آپ کے اختیار سے باہر ہیں (لوگوں کی رائے، قسمت، حالات)۔ سکون صرف اپنے دائرے میں جینے میں ہے۔',
          historicalContext: 'روم میں شدید طاعون اور جنگوں کے دوران شہنشاہ نے یہ اصول اپنائے۔'
        },
        {
          title: 'اندرونی قلعہ (The Inner Citadel)',
          explanation: 'آپ کی روح ایک قلعہ ہے؛ جب تک آپ خود اجازت نہ دیں کوئی دوسرا آپ کو دکھی نہیں کر سکتا۔',
          historicalContext: 'اپنے قریبی جرنیل کی بغاوت کے وقت بھی مارکس نے انتقام کی بجائے عفو و درگزر کا مظاہرہ کیا۔'
        }
      ],
      socraticQuestion: 'کیا آپ ان چیزوں پر توانائیاں ضائع کر رہے ہیں جو سرے سے آپ کے بس میں ہی نہیں؟',
      practicalExercise: 'ایک کاغذ پر اپنی پریشانی لکھیں اور اس حصے کو کاٹ دیں جس پر آپ کا بس نہیں چلتا۔'
    },
    en: {
      topic: 'Marcus Aurelius: The Dichotomy of Control & The Inner Citadel',
      authorOrBook: 'Meditations by Marcus Aurelius (Roman Emperor)',
      overview: 'Written on the battlefronts of the Danube, Meditations is humanity\'s supreme personal handbook on emotional sovereign control and psychological resilience.',
      keyPrinciples: [
        {
          title: 'The Dichotomy of Control',
          explanation: 'Some things are in our control (our beliefs, impulses, desires, aversions) and whatever are our own actions; other things are not in our control (body, property, reputation, external outcomes).',
          historicalContext: 'Penned during the Antonine Plague and catastrophic frontier invasions.'
        },
        {
          title: 'The Unconquerable Inner Citadel',
          explanation: 'The mind can remain an inviolate sanctuary. Harm only occurs when you assent to the belief that you have been harmed.',
          historicalContext: 'Maintained composure even when his general Avidius Cassius attempted a coup.'
        }
      ],
      socraticQuestion: 'Are you bleeding emotional vitality over circumstances that lie entirely outside your sphere of power?',
      practicalExercise: 'Draw a circle of sovereignty on paper. Place external opinions outside it, and commit 100% of your current focus only to what is inside.'
    }
  },

  // 2. Ibn Khaldun
  {
    keywords: ['ibn khaldun', 'khaldun', 'muqaddimah', 'asabiyyah', 'urooj', 'zawal', 'civilization'],
    urduRoman: {
      topic: 'Ibn Khaldun: Asabiyyah aur Qoumon/Idaron ka Urooj o Zawal',
      authorOrBook: 'Al-Muqaddimah by Ibn Khaldun (Father of Sociology & Economics)',
      overview: '14th sadi ke azeem faleesof Ibn Khaldun ne dunya ko pehli baar bataya ke saltanatein, qoumein aur karobar kaisay bante hain aur kaisay 120 saal ke doraniye me khud-bakhud zawal-pazeer ho jate hain.',
      keyPrinciples: [
        {
          title: 'Falsafa-e-Asabiyyah (Social Cohesion & Shared Mission)',
          explanation: 'Asabiyyah ka matlab hai mushtarka qurbani aur yakjehti ka jazba. Jab tak ek groh ya team me asabiyyah rehti hai, woh dunya ki sab se bari quwwat ko shikast de sakti hai.',
          historicalContext: 'Badvi qabayil ne jab shehron par hamla kiya toh shehri aish-o-ishrat ke mutabiq unki asabiyyah ghalib aayi.'
        },
        {
          title: 'Aish-o-Ishrat Ka Zawal (The Luxury Trap)',
          explanation: 'Jab kisi qoum ya company ko asaaniyan milti hain, toh doosri nasal sust aur aasaish-pasand ho jati hai, aur teesri nasal aate aate idara tabah ho jata hai.',
          historicalContext: 'Andalusia (Spain) ke Islami zawal ko Ibn Khaldun ne apni ankhon se dekha tha.'
        }
      ],
      socraticQuestion: 'Kya aapki team ya khandan me abhi bhi mushtarka maqsad (Asabiyyah) bacha hai ya har shakhs sirf apne faiday ki soch raha hai?',
      practicalExercise: 'Apne idaray ya khandan me kisi aise shakhs ke sath beth kar mushtarka maqsad daryaft karein jiske sath taaluqat me doori aachuki ho.'
    },
    urdu: {
      topic: 'ابن خلدون: عصبیت اور عروج و زوال کے ادوار',
      authorOrBook: 'مقدمہ ابن خلدون',
      overview: 'عمرانیات اور تاریخ کا شاہکار، جس میں قوموں، حکومتوں اور کاروباری اداروں کی بقا کے راز کھولے گئے ہیں۔',
      keyPrinciples: [
        {
          title: 'نظریہ عصبیت (Social Cohesion)',
          explanation: 'اجتماعی اتحاد اور باہمی قربانی کا جذبہ ہی قوموں کو عروج بخشتا ہے۔ جب اتحاد ختم ہو جائے تو زوال یقینی ہے۔',
          historicalContext: 'مختلف سلطنتوں کے مطالعے کے بعد ابن خلدون نے یہ اصول دریافت کیا۔'
        }
      ],
      socraticQuestion: 'کیا آپ کا خاندان یا ادارہ مشترکہ نصب العین سے جڑا ہے؟',
      practicalExercise: 'آج اپنی ٹیم کے لیے ذاتی فائدے سے بالاتر ہو کر ایک اجتماعی قربانی دیں۔'
    },
    en: {
      topic: 'Ibn Khaldun: Asabiyyah and the Cycles of Civilizations',
      authorOrBook: 'The Muqaddimah by Ibn Khaldun',
      overview: 'The founding masterpiece of sociology, economic theory, and historical dynamics, explaining why dynasties and organizations inevitably rise, stagnate, and collapse.',
      keyPrinciples: [
        {
          title: 'Asabiyyah (Collective Cohesion)',
          explanation: 'The fundamental social glue and tribal solidarity that empowers groups to act with singular, sacrificial willpower.',
          historicalContext: 'Formulated after observing the collapse of Moorish Spain and North African dynasties.'
        }
      ],
      socraticQuestion: 'Has your enterprise surrendered its foundational discipline to comfortable mediocrity?',
      practicalExercise: 'Identify one internal friction dividing your team and resolve it through transparent alignment on your core mission.'
    }
  },

  // 3. Viktor Frankl
  {
    keywords: ['frankl', 'viktor', 'meaning', 'search for meaning', 'logotherapy', 'suffering', 'takleef'],
    urduRoman: {
      topic: 'Viktor Frankl: Shadeed Tareen Takleef me Maqsad Talash Karna',
      authorOrBook: 'Man\'s Search for Meaning by Viktor Frankl (Neurologist & Psychiatrist)',
      overview: 'Auschwitz ke concentration camp me nazis ke hathon apne ahl-e-khana ko khone ke bawajood Frankl ne sabit kiya ke insan se har azaadi chheeni ja sakti hai siwaye ek azaadi ke: Apne halat par apne radde-amal (attitude) ka faisla karna.',
      keyPrinciples: [
        {
          title: 'The Last Human Freedom',
          explanation: 'Halaat chahe kitne hi tareek hon, do cheezon ke darmiyan ek waqfa hota hai: "Jo aapke sath hua" aur "Aapne uska kya jawab diya". Is waqfay me aapki azaadi aur shaan chupi hai.',
          historicalContext: 'Camp me roti ka aakhri tukra kisi aur ko dene wale qaidiyon ne is azadi ka muzahira kiya.'
        },
        {
          title: 'Will to Meaning (Maqsad Ki Pyaas)',
          explanation: 'Insan daulat ya maze ke peechay nahi bhagta, balkay kisi aise maqsad ke peechay bhagta hai jiske liye woh jaan bhi de sake.',
          historicalContext: 'Jin qaidiyon ne aainda zindagi me kisi kitab ko mukammal karne ya apne bache ko dhoondne ka ehd kiya, wahi zinda bachay.'
        }
      ],
      socraticQuestion: 'Aapki mojooda takleef aapse kya sabaq aur kaunsi zimmedari mang rahi hai?',
      practicalExercise: 'Likhein: "Meri takleef ka kaffara yeh hai ke main aainda kisi doosre insan ko is dard se bachaoon ga."'
    },
    urdu: {
      topic: 'وکٹر فرینکل: شدید تکلیف میں مقصدِ حیات کی تلاش',
      authorOrBook: 'انسان کی تلاش برائے معنی - وکٹر فرینکل',
      overview: 'نازی کیمپوں کے ہولناک مظالم سہنے کے بعد نفسیات کے عظیم ماہر کا دریافت کردہ فلسفۂ حیات۔',
      keyPrinciples: [
        {
          title: 'انسان کی آخری آزادی',
          explanation: 'حالات انسان سے سب کچھ چھین سکتے ہیں سوائے ایک چیز کے: اپنے رویے کے انتخاب کی آزادی۔',
          historicalContext: 'موت کے سائے میں بھی دوسروں کو سہارا دینے والوں نے اس کا عملی ثبوت دیا۔'
        }
      ],
      socraticQuestion: 'آپ کے دکھ کا پوشیدہ مقصد کیا ہے؟',
      practicalExercise: 'آج کسی اور دکھی انسان کے کام آئیں تاکہ آپ کے دکھ کو معنی مل سکیں۔'
    },
    en: {
      topic: 'Viktor Frankl: Finding Meaning in Deep Suffering',
      authorOrBook: 'Man\'s Search for Meaning by Viktor Frankl',
      overview: 'Written after surviving the Holocaust concentration camps, this work established Logotherapy: the discovery that human existence is driven by the quest for meaning.',
      keyPrinciples: [
        {
          title: 'The Ultimate Human Freedom',
          explanation: 'Between stimulus and response there is a space. In that space is our power to choose our response. In our response lies our growth and our freedom.',
          historicalContext: 'Observed among comrades in Auschwitz and Dachau who walked through huts comforting others.'
        }
      ],
      socraticQuestion: 'What unresolved responsibility is waiting for your awakening?',
      practicalExercise: 'Reframe your current adversary from an obstacle into a spiritual test demanding your highest character.'
    }
  },

  // 4. Sun Tzu
  {
    keywords: ['sun tzu', 'art of war', 'jang', 'strategy', 'hikmat', 'fatah', 'conquer'],
    urduRoman: {
      topic: 'Sun Tzu: Baghair Lare Fatah Hasil Karna (Master Strategy)',
      authorOrBook: 'The Art of War by Sun Tzu (Ancient Chinese General)',
      overview: '2500 saal qadeem yeh kitaab fauji jang se zyada zehni aur nafsiati fatah ka nuskha hai. Iska asool hai: Jo sipah-salar talwar nikal kar larta hai woh pehle hi haar chuka hai.',
      keyPrinciples: [
        {
          title: 'Baghair Lare Fatah (Supreme Excellence)',
          explanation: 'Asal jeet dushman ko jism ya lafzon se toarna nahi, balkay uski hikmat-e-amli ko pehle se be-asar bana dena hai.',
          historicalContext: 'China ke Warring States doran Sun Tzu ne kam fauj ke sath baray lashkaron ko baghair khoon-rezi ke jhuka diya.'
        },
        {
          title: 'Knowing Yourself and the Other',
          explanation: 'Agar aap apne aib aur khubiyan jante hain, aur samne wale ki kamzori samajhte hain, toh 100 laraiyon me bhi fatah aapki hogi.',
          historicalContext: 'Khabar-rasani (Intelligence) aur khamoshi jang ka ahem tareen juzv hain.'
        }
      ],
      socraticQuestion: 'Kya aap samnay wale ke sath uske maidan me lar rahay hain ya apna maidan khud tayar kar rahay hain?',
      practicalExercise: 'Apne dushman ya harif ke gusse par foran jawab na dein; 48 ghantay khamosh reh kar uski hikmat ko khud bikharnay dein.'
    },
    urdu: {
      topic: 'سن زو: بغیر لڑے فتح حاصل کرنے کی حکمتِ عملی',
      authorOrBook: 'دی آرٹ آف وار (The Art of War) - سن زو',
      overview: 'دنیا کی تاریخ کی سب سے جامع تزویراتی کتاب جس نے صدیوں کے جرنیلوں اور مصلحین کی رہنمائی کی۔',
      keyPrinciples: [
        {
          title: 'اعلیٰ ترین فتح',
          explanation: 'تلوار چلائے بغیر اور زبان کو گندا کیے بغیر دشمن کے منصوبے کو مات دینا ہی اصل دانائی ہے۔',
          historicalContext: 'قدیم چین کی جنگوں میں سن زو نے یہ اصول نافذ کیے۔'
        }
      ],
      socraticQuestion: 'کیا آپ جذبات میں آ کر دشمن کے بچھائے جال میں پھنس رہے ہیں؟',
      practicalExercise: 'آج کسی مخالفت کا جواب دینے کی بجائے خاموشی سے اپنی پوزیشن کو ناقابلِ تسخیر بنائیں۔'
    },
    en: {
      topic: 'Sun Tzu: The Supreme Art of Conquering Without War',
      authorOrBook: 'The Art of War by Sun Tzu',
      overview: 'The immortal treatise establishing that true strategic mastery is the calculation and positioning that makes open battle entirely unnecessary.',
      keyPrinciples: [
        {
          title: 'Subduing the Enemy Without Battle',
          explanation: 'To win one hundred victories in one hundred battles is not the acme of skill. To subdue the enemy without fighting is supreme.',
          historicalContext: 'Applied across Chinese statecraft to preserve blood and treasure.'
        }
      ],
      socraticQuestion: 'Are you fighting on your adversary\'s battlefield, or commanding your own ground?',
      practicalExercise: 'Decline to engage in a minor conflict today. Conserve your energy to build undisputed leverage.'
    }
  }
];

// Helper to find instant masterclass by topic or book
export function findFastMasterclass(topic: string, lang: 'urdu-roman' | 'urdu' | 'en'): TeachModule | null {
  const q = topic.toLowerCase().trim();
  for (const mc of PRECOMPUTED_MASTERCLASSES) {
    const matched = mc.keywords.some(k => q.includes(k));
    if (matched) {
      if (lang === 'urdu') return mc.urdu;
      if (lang === 'en') return mc.en;
      return mc.urduRoman;
    }
  }
  return null;
}

