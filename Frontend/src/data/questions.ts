import { QuizQuestion, QuizType } from "../types";

interface Localized {
  en: string;
  ar: string;
}

interface CorrectSeed {
  question: Localized;
  answer: Localized;
  distractors: [Localized, Localized, Localized];
  timerSeconds?: number;
  explanation?: Localized;
}

interface ReverseSeed {
  question: Localized;
  options: [Localized, Localized, Localized, Localized];
  wrongIndex: number;
}

interface LifeSeed {
  question: Localized;
  options: [Localized, Localized, Localized];
  correctIndex: number;
  explanation?: Localized;
}

const OPTION_IDS = ["a", "b", "c", "d"];

function rotate<T>(arr: T[], by: number): T[] {
  const shift = by % arr.length;
  return [...arr.slice(shift), ...arr.slice(0, shift)];
}

function buildCorrectQuestions(type: QuizType, prefix: string, seeds: CorrectSeed[]): QuizQuestion[] {
  return seeds.map((seed, index) => {
    const baseOptions = [seed.answer, ...seed.distractors];
    const rotated = rotate(baseOptions, index);

    return {
      id: `${prefix}-${index + 1}`,
      type,
      rule: "pick_correct",
      question: seed.question,
      timerSeconds: seed.timerSeconds,
      explanation: seed.explanation,
      options: rotated.map((choice, optionIndex) => ({
        id: OPTION_IDS[optionIndex],
        text: choice,
        isCorrect: choice.en === seed.answer.en
      }))
    };
  });
}

function buildReverseQuestions(prefix: string, seeds: ReverseSeed[]): QuizQuestion[] {
  return seeds.map((seed, index) => ({
    id: `${prefix}-${index + 1}`,
    type: "reverse",
    rule: "pick_wrong",
    question: seed.question,
    options: seed.options.map((choice, optionIndex) => ({
      id: OPTION_IDS[optionIndex],
      text: choice,
      isCorrect: optionIndex === seed.wrongIndex
    }))
  }));
}

function buildLifeQuestions(prefix: string, seeds: LifeSeed[]): QuizQuestion[] {
  return seeds.map((seed, index) => ({
    id: `${prefix}-${index + 1}`,
    type: "life_sim",
    rule: "pick_correct",
    question: seed.question,
    explanation: seed.explanation,
    options: seed.options.map((choice, optionIndex) => ({
      id: OPTION_IDS[optionIndex],
      text: choice,
      isCorrect: optionIndex === seed.correctIndex
    }))
  }));
}

const EMOJI_SEEDS: CorrectSeed[] = [
  {
    question: { en: "What does this emoji combo mean? ❄️ + 👨", ar: "ماذا يعني هذا المزيج؟ ❄️ + 👨" },
    answer: { en: "Snowman", ar: "رجل ثلج" },
    distractors: [
      { en: "Ice King", ar: "ملك الجليد" },
      { en: "Cold Hero", ar: "بطل البرد" },
      { en: "Frozen Dad", ar: "أب متجمد" }
    ]
  },
  {
    question: { en: "Decode this: 🌧️ + 🌈", ar: "فك الشفرة: 🌧️ + 🌈" },
    answer: { en: "After the rain", ar: "بعد المطر" },
    distractors: [
      { en: "Cloud game", ar: "لعبة الغيوم" },
      { en: "Weather war", ar: "حرب الطقس" },
      { en: "Rainbow cake", ar: "كيكة قوس قزح" }
    ]
  },
  {
    question: { en: "What is this? 👀 + 🌙", ar: "ما معنى هذا؟ 👀 + 🌙" },
    answer: { en: "Night watch", ar: "مراقبة ليلية" },
    distractors: [
      { en: "Moon party", ar: "حفلة القمر" },
      { en: "Sleep time", ar: "وقت النوم" },
      { en: "Dark mode", ar: "الوضع الداكن" }
    ]
  },
  {
    question: { en: "Guess the phrase: ❤️ + 🎵", ar: "خمن العبارة: ❤️ + 🎵" },
    answer: { en: "Love song", ar: "أغنية حب" },
    distractors: [
      { en: "Sad melody", ar: "لحن حزين" },
      { en: "Heart beat", ar: "نبض القلب" },
      { en: "Music app", ar: "تطبيق موسيقى" }
    ]
  },
  {
    question: { en: "What does 🍎 + 👨‍🏫 mean?", ar: "ماذا يعني 🍎 + 👨‍🏫؟" },
    answer: { en: "Teacher's gift", ar: "هدية للمعلم" },
    distractors: [
      { en: "Fruit class", ar: "حصة فواكه" },
      { en: "School lunch", ar: "غداء المدرسة" },
      { en: "Smart apple", ar: "تفاحة ذكية" }
    ]
  },
  {
    question: { en: "Decode: 🐱 + 🐟", ar: "فك الشفرة: 🐱 + 🐟" },
    answer: { en: "Cat food", ar: "طعام القطط" },
    distractors: [
      { en: "Ocean pet", ar: "حيوان أليف بحري" },
      { en: "Fish market", ar: "سوق السمك" },
      { en: "Cute dinner", ar: "عشاء لطيف" }
    ]
  },
  {
    question: { en: "What phrase is 🧠 + ⚡ ?", ar: "ما العبارة التي يمثلها 🧠 + ⚡ ؟" },
    answer: { en: "Brainstorm", ar: "عصف ذهني" },
    distractors: [
      { en: "Electric head", ar: "رأس كهربائي" },
      { en: "Smart power", ar: "قوة ذكية" },
      { en: "Fast think", ar: "تفكير سريع" }
    ]
  },
  {
    question: { en: "Guess this combo: ☕ + 🌅", ar: "خمن هذا المزيج: ☕ + 🌅" },
    answer: { en: "Morning coffee", ar: "قهوة الصباح" },
    distractors: [
      { en: "Beach cafe", ar: "مقهى الشاطئ" },
      { en: "Sun tea", ar: "شاي الشمس" },
      { en: "Late breakfast", ar: "فطور متأخر" }
    ]
  },
  {
    question: { en: "What does 🏠 + ❤️ mean?", ar: "ماذا يعني 🏠 + ❤️؟" },
    answer: { en: "Home sweet home", ar: "البيت بيتي" },
    distractors: [
      { en: "House party", ar: "حفلة منزلية" },
      { en: "Family game", ar: "لعبة عائلية" },
      { en: "Love building", ar: "مبنى الحب" }
    ]
  },
  {
    question: { en: "Decode this: 🔥 + 📱", ar: "فك الشفرة: 🔥 + 📱" },
    answer: { en: "Trending app", ar: "تطبيق ترند" },
    distractors: [
      { en: "Hot battery", ar: "بطارية ساخنة" },
      { en: "Phone danger", ar: "خطر الهاتف" },
      { en: "Burn call", ar: "مكالمة محترقة" }
    ]
  },
  {
    question: { en: "What is 🎬 + 🍿 ?", ar: "ما معنى 🎬 + 🍿 ؟" },
    answer: { en: "Movie night", ar: "ليلة فيلم" },
    distractors: [
      { en: "Cinema snack", ar: "وجبة سينما" },
      { en: "Popcorn party", ar: "حفلة فشار" },
      { en: "Director meal", ar: "وجبة المخرج" }
    ]
  },
  {
    question: { en: "Guess: 🏃 + ⏰", ar: "خمن: 🏃 + ⏰" },
    answer: { en: "Running late", ar: "متأخر" },
    distractors: [
      { en: "Workout timer", ar: "مؤقت تمرين" },
      { en: "Race clock", ar: "ساعة سباق" },
      { en: "Morning jog", ar: "جري صباحي" }
    ]
  },
  {
    question: { en: "Decode: 📚 + ☕", ar: "فك الشفرة: 📚 + ☕" },
    answer: { en: "Study session", ar: "جلسة مذاكرة" },
    distractors: [
      { en: "Library cafe", ar: "مقهى المكتبة" },
      { en: "Book store", ar: "متجر كتب" },
      { en: "Coffee break", ar: "استراحة قهوة" }
    ]
  },
  {
    question: { en: "What does 🌍 + ✈️ mean?", ar: "ماذا يعني 🌍 + ✈️؟" },
    answer: { en: "World travel", ar: "سفر حول العالم" },
    distractors: [
      { en: "Airport map", ar: "خريطة المطار" },
      { en: "Pilot school", ar: "مدرسة طيران" },
      { en: "Flight mode", ar: "وضع الطيران" }
    ]
  },
  {
    question: { en: "What phrase is 👑 + 💬 ?", ar: "ما العبارة التي يمثلها 👑 + 💬 ؟" },
    answer: { en: "Speak like a king", ar: "تحدث كملك" },
    distractors: [
      { en: "Royal chat", ar: "دردشة ملكية" },
      { en: "Queen message", ar: "رسالة الملكة" },
      { en: "Golden words", ar: "كلمات ذهبية" }
    ]
  },
  {
    question: { en: "Decode this: 🎮 + 🏆", ar: "فك الشفرة: 🎮 + 🏆" },
    answer: { en: "Gaming champion", ar: "بطل الألعاب" },
    distractors: [
      { en: "Arcade room", ar: "غرفة أركيد" },
      { en: "Pro controller", ar: "يد احترافية" },
      { en: "Esports team", ar: "فريق رياضات إلكترونية" }
    ]
  },
  {
    question: { en: "What does 😴 + 📱 mean?", ar: "ماذا يعني 😴 + 📱؟" },
    answer: { en: "Sleep scrolling", ar: "تصفح قبل النوم" },
    distractors: [
      { en: "Phone off", ar: "إغلاق الهاتف" },
      { en: "Lazy call", ar: "مكالمة كسولة" },
      { en: "Dream app", ar: "تطبيق الأحلام" }
    ]
  },
  {
    question: { en: "Guess: 🚿 + 🎤", ar: "خمن: 🚿 + 🎤" },
    answer: { en: "Shower singer", ar: "مغني الحمام" },
    distractors: [
      { en: "Bathroom podcast", ar: "بودكاست الحمام" },
      { en: "Water concert", ar: "حفل مائي" },
      { en: "Wet voice", ar: "صوت مبلل" }
    ]
  },
  {
    question: { en: "Decode: 📷 + 🌟", ar: "فك الشفرة: 📷 + 🌟" },
    answer: { en: "Star photo", ar: "صورة نجم" },
    distractors: [
      { en: "Flash mode", ar: "وضع الفلاش" },
      { en: "Viral selfie", ar: "سيلفي ترند" },
      { en: "Night camera", ar: "كاميرا ليلية" }
    ]
  },
  {
    question: { en: "What does 🔑 + ❤️ mean?", ar: "ماذا يعني 🔑 + ❤️؟" },
    answer: { en: "Key to my heart", ar: "مفتاح قلبي" },
    distractors: [
      { en: "Locked feelings", ar: "مشاعر مقفلة" },
      { en: "Secret romance", ar: "رومانسية سرية" },
      { en: "Heart password", ar: "كلمة سر القلب" }
    ]
  }
];

const MOVIE_SEEDS: CorrectSeed[] = [
  {
    question: { en: "Jack Sparrow belongs to which franchise?", ar: "جاك سبارو ينتمي لأي سلسلة؟" },
    answer: { en: "Pirates of the Caribbean", ar: "قراصنة الكاريبي" },
    distractors: [
      { en: "The Witcher", ar: "ذا ويتشر" },
      { en: "Sherlock", ar: "شيرلوك" },
      { en: "The Mummy", ar: "المومياء" }
    ]
  },
  {
    question: { en: "Who says 'I am Iron Man'?", ar: "من قال: أنا آيرون مان؟" },
    answer: { en: "Tony Stark", ar: "توني ستارك" },
    distractors: [
      { en: "Steve Rogers", ar: "ستيف روجرز" },
      { en: "Bruce Wayne", ar: "بروس واين" },
      { en: "Clark Kent", ar: "كلارك كينت" }
    ]
  },
  {
    question: { en: "A school of magic and houses. Which series?", ar: "مدرسة سحر ومنازل. أي سلسلة؟" },
    answer: { en: "Harry Potter", ar: "هاري بوتر" },
    distractors: [
      { en: "Narnia", ar: "نارنيا" },
      { en: "Shadowhunters", ar: "شادوهنترز" },
      { en: "Merlin", ar: "ميرلين" }
    ]
  },
  {
    question: { en: "'Winter is coming' belongs to?", ar: "عبارة الشتاء قادم من أي عمل؟" },
    answer: { en: "Game of Thrones", ar: "صراع العروش" },
    distractors: [
      { en: "Vikings", ar: "فايكنغز" },
      { en: "The Last Kingdom", ar: "ذا لاست كينغدوم" },
      { en: "The Witcher", ar: "ذا ويتشر" }
    ]
  },
  {
    question: { en: "Blue aliens on Pandora appear in?", ar: "كائنات زرقاء على باندورا في أي فيلم؟" },
    answer: { en: "Avatar", ar: "أفاتار" },
    distractors: [
      { en: "Dune", ar: "ديون" },
      { en: "Star Wars", ar: "حرب النجوم" },
      { en: "Prometheus", ar: "بروميثيوس" }
    ]
  },
  {
    question: { en: "Walter White is from which show?", ar: "والتر وايت من أي مسلسل؟" },
    answer: { en: "Breaking Bad", ar: "بريكنغ باد" },
    distractors: [
      { en: "Better Call Saul", ar: "بيتر كول سول" },
      { en: "Ozark", ar: "أوزارك" },
      { en: "Narcos", ar: "ناركوس" }
    ]
  },
  {
    question: { en: "Who lives in a pineapple under the sea?", ar: "من يعيش في أناناس تحت البحر؟" },
    answer: { en: "SpongeBob", ar: "سبونج بوب" },
    distractors: [
      { en: "Patrick", ar: "باتريك" },
      { en: "Nemo", ar: "نيمو" },
      { en: "Ariel", ar: "أرييل" }
    ]
  },
  {
    question: { en: "A giant ring must be destroyed in?", ar: "تدمير الخاتم في أي سلسلة؟" },
    answer: { en: "The Lord of the Rings", ar: "سيد الخواتم" },
    distractors: [
      { en: "The Hobbit", ar: "الهوبيت" },
      { en: "Eragon", ar: "إيراغون" },
      { en: "Willow", ar: "ويلو" }
    ]
  },
  {
    question: { en: "A toymaker cowboy named Woody appears in?", ar: "شخصية وودي تظهر في؟" },
    answer: { en: "Toy Story", ar: "قصة لعبة" },
    distractors: [
      { en: "Cars", ar: "سيارات" },
      { en: "Up", ar: "فوق" },
      { en: "Coco", ar: "كوكو" }
    ]
  },
  {
    question: { en: "Which series follows Eleven and the Upside Down?", ar: "أي مسلسل فيه إلفن والعالم المقلوب؟" },
    answer: { en: "Stranger Things", ar: "سترينجر ثينغز" },
    distractors: [
      { en: "Dark", ar: "دارك" },
      { en: "The OA", ar: "ذا أو إيه" },
      { en: "Wednesday", ar: "وينزداي" }
    ]
  },
  {
    question: { en: "Who is the caped crusader of Gotham?", ar: "من هو فارس جوثام المقنع؟" },
    answer: { en: "Batman", ar: "باتمان" },
    distractors: [
      { en: "Superman", ar: "سوبرمان" },
      { en: "Daredevil", ar: "ديرديفل" },
      { en: "The Flash", ar: "ذا فلاش" }
    ]
  },
  {
    question: { en: "A giant shark attacks a beach town in?", ar: "قرش عملاق يهاجم بلدة شاطئية في؟" },
    answer: { en: "Jaws", ar: "الفك المفترس" },
    distractors: [
      { en: "Deep Blue Sea", ar: "البحر الأزرق العميق" },
      { en: "The Meg", ar: "ذا ميغ" },
      { en: "Sharknado", ar: "شارك نادو" }
    ]
  },
  {
    question: { en: "Who says 'I'll be back'?", ar: "من قال سأعود؟" },
    answer: { en: "The Terminator", ar: "المدمر" },
    distractors: [
      { en: "RoboCop", ar: "روبوكوب" },
      { en: "Predator", ar: "بريداتور" },
      { en: "Judge Dredd", ar: "جادج دريد" }
    ]
  },
  {
    question: { en: "A yellow family from Springfield is?", ar: "العائلة الصفراء من سبرينغفيلد هي؟" },
    answer: { en: "The Simpsons", ar: "عائلة سمبسون" },
    distractors: [
      { en: "Family Guy", ar: "فاميلي غاي" },
      { en: "Futurama", ar: "فيوتشراما" },
      { en: "South Park", ar: "ساوث بارك" }
    ]
  },
  {
    question: { en: "A heist with red suits and a professor?", ar: "سطو مع بدلات حمراء وبروفيسور؟" },
    answer: { en: "Money Heist", ar: "لا كاسا دي بابيل" },
    distractors: [
      { en: "Lupin", ar: "لوبان" },
      { en: "Inside Man", ar: "إنسايد مان" },
      { en: "Prison Break", ar: "بريزون بريك" }
    ]
  },
  {
    question: { en: "Which movie features a sinking ship and Jack/Rose?", ar: "أي فيلم فيه سفينة غارقة وجاك وروز؟" },
    answer: { en: "Titanic", ar: "تايتانيك" },
    distractors: [
      { en: "Poseidon", ar: "بوسايدون" },
      { en: "Pearl Harbor", ar: "بيرل هاربور" },
      { en: "The Abyss", ar: "ذا أبيس" }
    ]
  },
  {
    question: { en: "A masked killer called Ghostface appears in?", ar: "القاتل المقنع غوست فيس يظهر في؟" },
    answer: { en: "Scream", ar: "سكريم" },
    distractors: [
      { en: "Halloween", ar: "هالوين" },
      { en: "Saw", ar: "سو" },
      { en: "The Conjuring", ar: "ذا كونجورينغ" }
    ]
  },
  {
    question: { en: "Who trains dragons with Toothless?", ar: "من يدرب التنانين مع توثلس؟" },
    answer: { en: "Hiccup", ar: "هيكاب" },
    distractors: [
      { en: "Shrek", ar: "شريك" },
      { en: "Merida", ar: "ميريدا" },
      { en: "Moana", ar: "موانا" }
    ]
  },
  {
    question: { en: "A detective with a pipe and violin is?", ar: "محقق مع غليون وكمان هو؟" },
    answer: { en: "Sherlock Holmes", ar: "شيرلوك هولمز" },
    distractors: [
      { en: "Hercule Poirot", ar: "هيركيول بوارو" },
      { en: "Benoit Blanc", ar: "بينوا بلانك" },
      { en: "Columbo", ar: "كولومبو" }
    ]
  },
  {
    question: { en: "Which show has friends at Central Perk?", ar: "أي مسلسل فيه أصدقاء في سنترال بيرك؟" },
    answer: { en: "Friends", ar: "فريندز" },
    distractors: [
      { en: "How I Met Your Mother", ar: "هاو آي ميت يور ماذر" },
      { en: "New Girl", ar: "نيو غيرل" },
      { en: "The Office", ar: "ذا أوفيس" }
    ]
  }
];

const GAMING_SEEDS: CorrectSeed[] = [
  {
    question: { en: "Which game series features Mario?", ar: "أي سلسلة ألعاب تضم ماريو؟" },
    answer: { en: "Super Mario Bros", ar: "سوبر ماريو" },
    distractors: [
      { en: "Sonic", ar: "سونيك" },
      { en: "Crash Bandicoot", ar: "كراش بانديكوت" },
      { en: "Rayman", ar: "رايمان" }
    ]
  },
  {
    question: { en: "Where do players jump from a bus to an island?", ar: "في أي لعبة يقفز اللاعبون من حافلة؟" },
    answer: { en: "Fortnite", ar: "فورتنايت" },
    distractors: [
      { en: "PUBG", ar: "ببجي" },
      { en: "Apex Legends", ar: "أبيكس ليجندز" },
      { en: "Warzone", ar: "وارزون" }
    ]
  },
  {
    question: { en: "Which game has creepers and blocks?", ar: "أي لعبة فيها كريبر وبلوكات؟" },
    answer: { en: "Minecraft", ar: "ماينكرافت" },
    distractors: [
      { en: "Terraria", ar: "تيراريا" },
      { en: "Roblox", ar: "روبلوكس" },
      { en: "No Man's Sky", ar: "نو مانز سكاي" }
    ]
  },
  {
    question: { en: "Kratos is the hero of?", ar: "كراتوس بطل أي لعبة؟" },
    answer: { en: "God of War", ar: "غود أوف وور" },
    distractors: [
      { en: "Hades", ar: "هاديس" },
      { en: "Assassin's Creed", ar: "أساسنز كريد" },
      { en: "Dark Souls", ar: "دارك سولز" }
    ]
  },
  {
    question: { en: "Which game includes agents like Jett and Sage?", ar: "أي لعبة فيها عملاء مثل جيت وسيج؟" },
    answer: { en: "Valorant", ar: "فالورانت" },
    distractors: [
      { en: "Overwatch", ar: "أوفرواتش" },
      { en: "CS2", ar: "كاونتر سترايك 2" },
      { en: "Rainbow Six Siege", ar: "رينبو سيكس سيج" }
    ]
  },
  {
    question: { en: "Master Chief is from?", ar: "ماستر تشيف من أي لعبة؟" },
    answer: { en: "Halo", ar: "هالو" },
    distractors: [
      { en: "Destiny", ar: "ديستني" },
      { en: "Doom", ar: "دوم" },
      { en: "Titanfall", ar: "تايتان فول" }
    ]
  },
  {
    question: { en: "A social deduction game with impostors is?", ar: "لعبة استنتاج اجتماعي فيها المحتالون هي؟" },
    answer: { en: "Among Us", ar: "أمونغ أس" },
    distractors: [
      { en: "Goose Goose Duck", ar: "غوس غوس داك" },
      { en: "Town of Salem", ar: "تاون أوف سايلم" },
      { en: "Project Winter", ar: "بروجكت وينتر" }
    ]
  },
  {
    question: { en: "Link and Zelda belong to which series?", ar: "لينك وزيلدا من أي سلسلة؟" },
    answer: { en: "The Legend of Zelda", ar: "أسطورة زيلدا" },
    distractors: [
      { en: "Fire Emblem", ar: "فاير إمبلم" },
      { en: "Final Fantasy", ar: "فاينل فانتسي" },
      { en: "Dragon Quest", ar: "دراغون كويست" }
    ]
  },
  {
    question: { en: "Pac-Man's goal is to eat?", ar: "هدف باك مان هو أكل؟" },
    answer: { en: "Dots", ar: "النقاط" },
    distractors: [
      { en: "Coins", ar: "العملات" },
      { en: "Stars", ar: "النجوم" },
      { en: "Keys", ar: "المفاتيح" }
    ]
  },
  {
    question: { en: "A football game released yearly by EA is?", ar: "لعبة كرة قدم تصدر سنويا من EA هي؟" },
    answer: { en: "EA Sports FC", ar: "إي أيه سبورتس إف سي" },
    distractors: [
      { en: "eFootball", ar: "إي فوتبول" },
      { en: "Rocket League", ar: "روكيت ليغ" },
      { en: "Football Manager", ar: "فوتبول مانجر" }
    ]
  },
  {
    question: { en: "Which game has a battle with Ender Dragon?", ar: "أي لعبة فيها قتال تنين الإندر؟" },
    answer: { en: "Minecraft", ar: "ماينكرافت" },
    distractors: [
      { en: "Skyrim", ar: "سكايرم" },
      { en: "Dragon Age", ar: "دراغون إيج" },
      { en: "Elden Ring", ar: "إلدن رينغ" }
    ]
  },
  {
    question: { en: "Which game has champions on Summoner's Rift?", ar: "أي لعبة فيها أبطال في سامونرز ريفت؟" },
    answer: { en: "League of Legends", ar: "ليغ أوف ليجندز" },
    distractors: [
      { en: "Dota 2", ar: "دوتا 2" },
      { en: "Smite", ar: "سمايت" },
      { en: "Heroes of the Storm", ar: "هيروز أوف ذا ستورم" }
    ]
  },
  {
    question: { en: "What game lets you steal cars in Los Santos?", ar: "أي لعبة تسرق فيها سيارات في لوس سانتوس؟" },
    answer: { en: "Grand Theft Auto V", ar: "جراند ثفت أوتو 5" },
    distractors: [
      { en: "Watch Dogs", ar: "واتش دوغز" },
      { en: "Mafia", ar: "مافيا" },
      { en: "Saints Row", ar: "سينتس رو" }
    ]
  },
  {
    question: { en: "Which game features Steve as a guest fighter in Smash?", ar: "أي لعبة ظهر فيها ستيف كمقاتل ضيف في سماش؟" },
    answer: { en: "Super Smash Bros", ar: "سوبر سماش بروس" },
    distractors: [
      { en: "Brawlhalla", ar: "براولهالا" },
      { en: "Multiversus", ar: "مالتي فيرسس" },
      { en: "Tekken", ar: "تيكن" }
    ]
  },
  {
    question: { en: "A game known for rage and 'You Died' text is?", ar: "لعبة معروفة بعبارة أنت ميت هي؟" },
    answer: { en: "Dark Souls", ar: "دارك سولز" },
    distractors: [
      { en: "Sekiro", ar: "سيكيرو" },
      { en: "Bloodborne", ar: "بلودبورن" },
      { en: "Nioh", ar: "نيوه" }
    ]
  },
  {
    question: { en: "Which game has a yellow electric mouse mascot?", ar: "أي لعبة لها فأر كهربائي أصفر؟" },
    answer: { en: "Pokemon", ar: "بوكيمون" },
    distractors: [
      { en: "Digimon", ar: "ديجيمون" },
      { en: "Yo-kai Watch", ar: "يوكاي ووتش" },
      { en: "Temtem", ar: "تمتم" }
    ]
  },
  {
    question: { en: "A game where you solve portals with a gun is?", ar: "لعبة تحل فيها ألغاز البوابات بمسدس؟" },
    answer: { en: "Portal", ar: "بورتال" },
    distractors: [
      { en: "Half-Life", ar: "هاف لايف" },
      { en: "Quantum Conundrum", ar: "كوانتم كوندورم" },
      { en: "The Talos Principle", ar: "تالوس برينسيبل" }
    ]
  },
  {
    question: { en: "Nook and island debt are from?", ar: "نوك وديون الجزيرة من أي لعبة؟" },
    answer: { en: "Animal Crossing", ar: "أنيمال كروسينغ" },
    distractors: [
      { en: "Stardew Valley", ar: "ستارديو فالي" },
      { en: "The Sims", ar: "ذا سيمز" },
      { en: "Harvest Moon", ar: "هارفست مون" }
    ]
  },
  {
    question: { en: "Which game has tactical terrorists vs counter-terrorists?", ar: "أي لعبة فيها إرهابيون ضد مكافحة الإرهاب؟" },
    answer: { en: "Counter-Strike", ar: "كاونتر سترايك" },
    distractors: [
      { en: "Call of Duty", ar: "كول أوف ديوتي" },
      { en: "Battlefield", ar: "باتلفيلد" },
      { en: "Insurgency", ar: "إنسيرجنسي" }
    ]
  },
  {
    question: { en: "A game where cars play soccer is?", ar: "لعبة تلعب فيها السيارات كرة القدم هي؟" },
    answer: { en: "Rocket League", ar: "روكيت ليغ" },
    distractors: [
      { en: "Trackmania", ar: "تراكمانيا" },
      { en: "Burnout", ar: "بيرن آوت" },
      { en: "Need for Speed", ar: "نيد فور سبيد" }
    ]
  }
];

const TRICK_SEEDS: CorrectSeed[] = [
  {
    question: { en: "How many months have 28 days?", ar: "كم شهرا فيه 28 يوما؟" },
    answer: { en: "12", ar: "12" },
    distractors: [
      { en: "1", ar: "1" },
      { en: "2", ar: "2" },
      { en: "6", ar: "6" }
    ],
    timerSeconds: 12
  },
  {
    question: { en: "What gets wetter while drying?", ar: "ما الشيء الذي يزداد بللا أثناء التجفيف؟" },
    answer: { en: "A towel", ar: "المنشفة" },
    distractors: [
      { en: "A sponge", ar: "إسفنجة" },
      { en: "Sunlight", ar: "ضوء الشمس" },
      { en: "A fan", ar: "مروحة" }
    ],
    timerSeconds: 12
  },
  {
    question: { en: "I speak without a mouth. What am I?", ar: "أتكلم بلا فم. ما أنا؟" },
    answer: { en: "An echo", ar: "الصدى" },
    distractors: [
      { en: "A phone", ar: "هاتف" },
      { en: "A radio", ar: "راديو" },
      { en: "A ghost", ar: "شبح" }
    ],
    timerSeconds: 12
  },
  {
    question: { en: "What has keys but can't open locks?", ar: "ما الشيء الذي له مفاتيح ولا يفتح الأقفال؟" },
    answer: { en: "A piano", ar: "البيانو" },
    distractors: [
      { en: "A map", ar: "خريطة" },
      { en: "A keyboard lock", ar: "قفل لوحة مفاتيح" },
      { en: "A treasure chest", ar: "صندوق كنز" }
    ],
    timerSeconds: 10
  },
  {
    question: { en: "The more you take, the more you leave behind. What?", ar: "كلما أخذت أكثر، تركت أكثر. ما هو؟" },
    answer: { en: "Footsteps", ar: "الخطوات" },
    distractors: [
      { en: "Money", ar: "المال" },
      { en: "Time", ar: "الوقت" },
      { en: "Food", ar: "الطعام" }
    ],
    timerSeconds: 10
  },
  {
    question: { en: "Which word is spelled wrong in every dictionary?", ar: "أي كلمة مكتوبة خطأ في كل قاموس؟" },
    answer: { en: "Wrong", ar: "خطأ" },
    distractors: [
      { en: "Dictionary", ar: "قاموس" },
      { en: "Spelling", ar: "إملاء" },
      { en: "Word", ar: "كلمة" }
    ],
    timerSeconds: 9
  },
  {
    question: { en: "What can run but never walks?", ar: "ما الذي يجري ولا يمشي؟" },
    answer: { en: "Water", ar: "الماء" },
    distractors: [
      { en: "A cheetah", ar: "فهد" },
      { en: "A robot", ar: "روبوت" },
      { en: "Wind", ar: "الريح" }
    ],
    timerSeconds: 10
  },
  {
    question: { en: "If a plane crashes on a border, where do survivors get buried?", ar: "إذا سقطت طائرة على الحدود، أين يدفنون الناجين؟" },
    answer: { en: "Nowhere", ar: "لا يدفنون" },
    distractors: [
      { en: "In both countries", ar: "في البلدين" },
      { en: "At sea", ar: "في البحر" },
      { en: "Nearest city", ar: "أقرب مدينة" }
    ],
    timerSeconds: 11
  },
  {
    question: { en: "What has a neck but no head?", ar: "ما الذي له رقبة وليس له رأس؟" },
    answer: { en: "A bottle", ar: "زجاجة" },
    distractors: [
      { en: "A shirt", ar: "قميص" },
      { en: "A snake", ar: "ثعبان" },
      { en: "A spoon", ar: "ملعقة" }
    ]
  },
  {
    question: { en: "What comes once in a minute, twice in a moment, never in a thousand years?", ar: "ما الذي يأتي مرة في دقيقة، مرتين في لحظة، ولا يأتي في ألف سنة؟" },
    answer: { en: "The letter M", ar: "حرف م" },
    distractors: [
      { en: "The letter A", ar: "حرف أ" },
      { en: "The number 1", ar: "الرقم 1" },
      { en: "The moon", ar: "القمر" }
    ],
    timerSeconds: 13
  },
  {
    question: { en: "What has one eye but cannot see?", ar: "ما الذي له عين واحدة ولا يرى؟" },
    answer: { en: "A needle", ar: "إبرة" },
    distractors: [
      { en: "A cyclone", ar: "إعصار" },
      { en: "A pirate", ar: "قرصان" },
      { en: "A camera", ar: "كاميرا" }
    ]
  },
  {
    question: { en: "What goes up but never comes down?", ar: "ما الذي يصعد ولا ينزل؟" },
    answer: { en: "Your age", ar: "عمرك" },
    distractors: [
      { en: "A balloon", ar: "بالون" },
      { en: "Smoke", ar: "دخان" },
      { en: "A kite", ar: "طائرة ورقية" }
    ]
  },
  {
    question: { en: "How many animals did Moses take on the ark?", ar: "كم حيوانا أخذ موسى في السفينة؟" },
    answer: { en: "Zero", ar: "صفر" },
    distractors: [
      { en: "Two", ar: "اثنان" },
      { en: "All pairs", ar: "كل الأزواج" },
      { en: "Seven", ar: "سبعة" }
    ]
  },
  {
    question: { en: "What has hands but cannot clap?", ar: "ما الذي له يدان ولا يصفق؟" },
    answer: { en: "A clock", ar: "الساعة" },
    distractors: [
      { en: "A statue", ar: "تمثال" },
      { en: "A doll", ar: "دمية" },
      { en: "A robot", ar: "روبوت" }
    ]
  },
  {
    question: { en: "What can fill a room but takes no space?", ar: "ما الذي يملأ الغرفة ولا يشغل مساحة؟" },
    answer: { en: "Light", ar: "الضوء" },
    distractors: [
      { en: "Air", ar: "الهواء" },
      { en: "Music", ar: "الموسيقى" },
      { en: "Heat", ar: "الحرارة" }
    ]
  },
  {
    question: { en: "What has many teeth but cannot bite?", ar: "ما الذي له أسنان كثيرة ولا يعض؟" },
    answer: { en: "A comb", ar: "مشط" },
    distractors: [
      { en: "A zipper", ar: "سحاب" },
      { en: "A saw", ar: "منشار" },
      { en: "A shark", ar: "قرش" }
    ]
  },
  {
    question: { en: "What can you hold without touching?", ar: "ما الذي تستطيع حمله دون لمسه؟" },
    answer: { en: "Your breath", ar: "أنفاسك" },
    distractors: [
      { en: "A thought", ar: "فكرة" },
      { en: "A shadow", ar: "ظل" },
      { en: "A promise", ar: "وعد" }
    ]
  },
  {
    question: { en: "What belongs to you but other people use it more?", ar: "ما الذي يخصك لكن الآخرين يستخدمونه أكثر؟" },
    answer: { en: "Your name", ar: "اسمك" },
    distractors: [
      { en: "Your phone", ar: "هاتفك" },
      { en: "Your chair", ar: "كرسيك" },
      { en: "Your shoes", ar: "حذاؤك" }
    ]
  },
  {
    question: { en: "What breaks when you say its name?", ar: "ما الذي ينكسر عندما تقول اسمه؟" },
    answer: { en: "Silence", ar: "الصمت" },
    distractors: [
      { en: "Glass", ar: "الزجاج" },
      { en: "Ice", ar: "الثلج" },
      { en: "Mirror", ar: "المرآة" }
    ]
  },
  {
    question: { en: "If you pass the person in second place, what place are you in?", ar: "إذا تجاوزت صاحب المركز الثاني، في أي مركز تصبح؟" },
    answer: { en: "Second place", ar: "المركز الثاني" },
    distractors: [
      { en: "First place", ar: "المركز الأول" },
      { en: "Third place", ar: "المركز الثالث" },
      { en: "Fourth place", ar: "المركز الرابع" }
    ],
    timerSeconds: 10
  }
];

const COUNTRY_SEEDS: CorrectSeed[] = [
  {
    question: {
      en: "Famous for pizza, Rome, and boot shape. Which country?",
      ar: "مشهورة بالبيتزا وروما وشكل الحذاء. ما الدولة؟"
    },
    answer: { en: "Italy", ar: "إيطاليا" },
    distractors: [
      { en: "Spain", ar: "إسبانيا" },
      { en: "Greece", ar: "اليونان" },
      { en: "France", ar: "فرنسا" }
    ]
  },
  {
    question: { en: "Land of pyramids and the Nile.", ar: "أرض الأهرامات والنيل." },
    answer: { en: "Egypt", ar: "مصر" },
    distractors: [
      { en: "Morocco", ar: "المغرب" },
      { en: "Jordan", ar: "الأردن" },
      { en: "Tunisia", ar: "تونس" }
    ]
  },
  {
    question: { en: "Samba, Amazon rainforest, and Rio.", ar: "السامبا والأمازون وريو." },
    answer: { en: "Brazil", ar: "البرازيل" },
    distractors: [
      { en: "Argentina", ar: "الأرجنتين" },
      { en: "Colombia", ar: "كولومبيا" },
      { en: "Peru", ar: "بيرو" }
    ]
  },
  {
    question: { en: "Eiffel Tower and croissants.", ar: "برج إيفل والكرواسون." },
    answer: { en: "France", ar: "فرنسا" },
    distractors: [
      { en: "Belgium", ar: "بلجيكا" },
      { en: "Switzerland", ar: "سويسرا" },
      { en: "Portugal", ar: "البرتغال" }
    ]
  },
  {
    question: { en: "Land of sushi, anime, and Tokyo.", ar: "بلد السوشي والأنمي وطوكيو." },
    answer: { en: "Japan", ar: "اليابان" },
    distractors: [
      { en: "South Korea", ar: "كوريا الجنوبية" },
      { en: "China", ar: "الصين" },
      { en: "Thailand", ar: "تايلاند" }
    ]
  },
  {
    question: { en: "Maple leaf flag and hockey.", ar: "علم ورقة القيقب والهوكي." },
    answer: { en: "Canada", ar: "كندا" },
    distractors: [
      { en: "USA", ar: "الولايات المتحدة" },
      { en: "Norway", ar: "النرويج" },
      { en: "Finland", ar: "فنلندا" }
    ]
  },
  {
    question: { en: "Kangaroos, koalas, and Sydney Opera House.", ar: "الكنغر والكوالا وأوبرا سيدني." },
    answer: { en: "Australia", ar: "أستراليا" },
    distractors: [
      { en: "New Zealand", ar: "نيوزيلندا" },
      { en: "South Africa", ar: "جنوب إفريقيا" },
      { en: "Chile", ar: "تشيلي" }
    ]
  },
  {
    question: { en: "Big Ben and fish and chips.", ar: "بيغ بن وطبق السمك والبطاطس." },
    answer: { en: "United Kingdom", ar: "المملكة المتحدة" },
    distractors: [
      { en: "Ireland", ar: "إيرلندا" },
      { en: "Netherlands", ar: "هولندا" },
      { en: "Germany", ar: "ألمانيا" }
    ]
  },
  {
    question: { en: "Tacos, mariachi, and Cancun.", ar: "التاكو والمارياتشي وكانكون." },
    answer: { en: "Mexico", ar: "المكسيك" },
    distractors: [
      { en: "Spain", ar: "إسبانيا" },
      { en: "Cuba", ar: "كوبا" },
      { en: "Peru", ar: "بيرو" }
    ]
  },
  {
    question: { en: "Taj Mahal is in which country?", ar: "تاج محل في أي دولة؟" },
    answer: { en: "India", ar: "الهند" },
    distractors: [
      { en: "Pakistan", ar: "باكستان" },
      { en: "Bangladesh", ar: "بنغلاديش" },
      { en: "Nepal", ar: "نيبال" }
    ]
  },
  {
    question: { en: "Mount Fuji and bullet trains.", ar: "جبل فوجي والقطارات السريعة." },
    answer: { en: "Japan", ar: "اليابان" },
    distractors: [
      { en: "China", ar: "الصين" },
      { en: "Taiwan", ar: "تايوان" },
      { en: "South Korea", ar: "كوريا الجنوبية" }
    ]
  },
  {
    question: { en: "Desert, oil, and Riyadh.", ar: "الصحراء والنفط والرياض." },
    answer: { en: "Saudi Arabia", ar: "السعودية" },
    distractors: [
      { en: "UAE", ar: "الإمارات" },
      { en: "Qatar", ar: "قطر" },
      { en: "Kuwait", ar: "الكويت" }
    ]
  },
  {
    question: { en: "Alps, chocolate, and neutral politics.", ar: "جبال الألب والشوكولاتة والحياد." },
    answer: { en: "Switzerland", ar: "سويسرا" },
    distractors: [
      { en: "Austria", ar: "النمسا" },
      { en: "Belgium", ar: "بلجيكا" },
      { en: "Sweden", ar: "السويد" }
    ]
  },
  {
    question: { en: "Machu Picchu belongs to?", ar: "ماتشو بيتشو تتبع لأي دولة؟" },
    answer: { en: "Peru", ar: "بيرو" },
    distractors: [
      { en: "Bolivia", ar: "بوليفيا" },
      { en: "Ecuador", ar: "الإكوادور" },
      { en: "Chile", ar: "تشيلي" }
    ]
  },
  {
    question: { en: "Paella and flamenco.", ar: "الباييلا والفلامنكو." },
    answer: { en: "Spain", ar: "إسبانيا" },
    distractors: [
      { en: "Portugal", ar: "البرتغال" },
      { en: "Italy", ar: "إيطاليا" },
      { en: "Argentina", ar: "الأرجنتين" }
    ]
  },
  {
    question: { en: "The Great Wall is in?", ar: "سور الصين العظيم في؟" },
    answer: { en: "China", ar: "الصين" },
    distractors: [
      { en: "Mongolia", ar: "منغوليا" },
      { en: "Japan", ar: "اليابان" },
      { en: "Vietnam", ar: "فيتنام" }
    ]
  },
  {
    question: { en: "Tulips, windmills, and Amsterdam.", ar: "التوليب والطواحين وأمستردام." },
    answer: { en: "Netherlands", ar: "هولندا" },
    distractors: [
      { en: "Denmark", ar: "الدنمارك" },
      { en: "Belgium", ar: "بلجيكا" },
      { en: "Germany", ar: "ألمانيا" }
    ]
  },
  {
    question: { en: "Pyramids of Chichen Itza are in?", ar: "أهرامات تشيتشن إيتزا في؟" },
    answer: { en: "Mexico", ar: "المكسيك" },
    distractors: [
      { en: "Peru", ar: "بيرو" },
      { en: "Guatemala", ar: "غواتيمالا" },
      { en: "Brazil", ar: "البرازيل" }
    ]
  },
  {
    question: { en: "Moai statues are from which country territory?", ar: "تماثيل المواي تتبع لأي دولة؟" },
    answer: { en: "Chile", ar: "تشيلي" },
    distractors: [
      { en: "Peru", ar: "بيرو" },
      { en: "Argentina", ar: "الأرجنتين" },
      { en: "Ecuador", ar: "الإكوادور" }
    ]
  },
  {
    question: { en: "Home of K-pop and Seoul.", ar: "موطن الكيبوب وسيول." },
    answer: { en: "South Korea", ar: "كوريا الجنوبية" },
    distractors: [
      { en: "Japan", ar: "اليابان" },
      { en: "China", ar: "الصين" },
      { en: "Singapore", ar: "سنغافورة" }
    ]
  }
];

const POP_SEEDS: CorrectSeed[] = [
  {
    question: { en: "Who sings 'Never Gonna Give You Up'?", ar: "من يغني Never Gonna Give You Up؟" },
    answer: { en: "Rick Astley", ar: "ريك أستلي" },
    distractors: [
      { en: "Bruno Mars", ar: "برونو مارس" },
      { en: "The Weeknd", ar: "ذا ويكند" },
      { en: "Ed Sheeran", ar: "إد شيران" }
    ]
  },
  {
    question: { en: "Which app is famous for short dance trends?", ar: "أي تطبيق مشهور برقصة الترند القصيرة؟" },
    answer: { en: "TikTok", ar: "تيك توك" },
    distractors: [
      { en: "LinkedIn", ar: "لينكدإن" },
      { en: "Reddit", ar: "ريديت" },
      { en: "Telegram", ar: "تيليجرام" }
    ]
  },
  {
    question: { en: "The meme phrase 'One does not simply...' comes from?", ar: "ميم One does not simply جاء من؟" },
    answer: { en: "The Lord of the Rings", ar: "سيد الخواتم" },
    distractors: [
      { en: "Game of Thrones", ar: "صراع العروش" },
      { en: "Harry Potter", ar: "هاري بوتر" },
      { en: "Star Wars", ar: "حرب النجوم" }
    ]
  },
  {
    question: { en: "Who is known as the 'King of Pop'?", ar: "من يُعرف بملك البوب؟" },
    answer: { en: "Michael Jackson", ar: "مايكل جاكسون" },
    distractors: [
      { en: "Elvis Presley", ar: "إلفيس بريسلي" },
      { en: "Prince", ar: "برنس" },
      { en: "Justin Bieber", ar: "جاستن بيبر" }
    ]
  },
  {
    question: { en: "The song 'Blinding Lights' is by?", ar: "أغنية Blinding Lights للمغني؟" },
    answer: { en: "The Weeknd", ar: "ذا ويكند" },
    distractors: [
      { en: "Drake", ar: "دريك" },
      { en: "Post Malone", ar: "بوست مالون" },
      { en: "Shawn Mendes", ar: "شون مينديز" }
    ]
  },
  {
    question: { en: "'Baby Shark' became viral on which platform first?", ar: "أغنية Baby Shark انتشرت أولا على أي منصة؟" },
    answer: { en: "YouTube", ar: "يوتيوب" },
    distractors: [
      { en: "Facebook", ar: "فيسبوك" },
      { en: "TikTok", ar: "تيك توك" },
      { en: "Instagram", ar: "إنستغرام" }
    ]
  },
  {
    question: { en: "Who is the singer of 'Shape of You'?", ar: "من مغني Shape of You؟" },
    answer: { en: "Ed Sheeran", ar: "إد شيران" },
    distractors: [
      { en: "Sam Smith", ar: "سام سميث" },
      { en: "Harry Styles", ar: "هاري ستايلز" },
      { en: "Charlie Puth", ar: "تشارلي بوث" }
    ]
  },
  {
    question: { en: "'Wednesday dance' trend started from which show?", ar: "ترند رقصة وينزداي من أي مسلسل؟" },
    answer: { en: "Wednesday", ar: "وينزداي" },
    distractors: [
      { en: "Stranger Things", ar: "سترينجر ثينغز" },
      { en: "Riverdale", ar: "ريفرديل" },
      { en: "Euphoria", ar: "يوفوريا" }
    ]
  },
  {
    question: { en: "The phrase 'Winter is coming' became viral from?", ar: "عبارة الشتاء قادم انتشرت من؟" },
    answer: { en: "Game of Thrones", ar: "صراع العروش" },
    distractors: [
      { en: "Vikings", ar: "فايكنغز" },
      { en: "The Witcher", ar: "ذا ويتشر" },
      { en: "House of the Dragon", ar: "هاوس أوف ذا دراغون" }
    ]
  },
  {
    question: { en: "Who sings 'Bad Guy'?", ar: "من يغني Bad Guy؟" },
    answer: { en: "Billie Eilish", ar: "بيلي آيليش" },
    distractors: [
      { en: "Ariana Grande", ar: "أريانا غراندي" },
      { en: "Dua Lipa", ar: "دوا ليبا" },
      { en: "Lorde", ar: "لورد" }
    ]
  },
  {
    question: { en: "'Barbie' movie stars which actress as Barbie?", ar: "فيلم Barbie من بطولة أي ممثلة بدور باربي؟" },
    answer: { en: "Margot Robbie", ar: "مارغو روبي" },
    distractors: [
      { en: "Emma Stone", ar: "إيما ستون" },
      { en: "Jennifer Lawrence", ar: "جينيفر لورنس" },
      { en: "Anne Hathaway", ar: "آن هاثاواي" }
    ]
  },
  {
    question: { en: "The dance challenge 'Renegade' was viral on?", ar: "تحدي رقصة Renegade انتشر على؟" },
    answer: { en: "TikTok", ar: "تيك توك" },
    distractors: [
      { en: "Snapchat", ar: "سناب شات" },
      { en: "X", ar: "إكس" },
      { en: "Discord", ar: "ديسكورد" }
    ]
  },
  {
    question: { en: "Who is often called 'Queen Bey'?", ar: "من تُعرف بلقب Queen Bey؟" },
    answer: { en: "Beyonce", ar: "بيونسيه" },
    distractors: [
      { en: "Rihanna", ar: "ريهانا" },
      { en: "Adele", ar: "أديل" },
      { en: "Lady Gaga", ar: "ليدي غاغا" }
    ]
  },
  {
    question: { en: "The meme 'Distracted Boyfriend' is a?", ar: "ميم Distracted Boyfriend هو؟" },
    answer: { en: "Stock photo", ar: "صورة مخزنة" },
    distractors: [
      { en: "Movie scene", ar: "مشهد فيلم" },
      { en: "Music video", ar: "فيديو كليب" },
      { en: "Game screenshot", ar: "لقطة لعبة" }
    ]
  },
  {
    question: { en: "Who made the song 'As It Was'?", ar: "من غنى As It Was؟" },
    answer: { en: "Harry Styles", ar: "هاري ستايلز" },
    distractors: [
      { en: "Niall Horan", ar: "نايل هوران" },
      { en: "Zayn", ar: "زين" },
      { en: "Liam Payne", ar: "ليام باين" }
    ]
  },
  {
    question: { en: "Which platform is known for streamers and gaming chat?", ar: "أي منصة معروفة بالبث المباشر للألعاب؟" },
    answer: { en: "Twitch", ar: "تويتش" },
    distractors: [
      { en: "Pinterest", ar: "بينتريست" },
      { en: "Behance", ar: "بيهانس" },
      { en: "Vimeo", ar: "فيميو" }
    ]
  },
  {
    question: { en: "Who sings 'Levitating'?", ar: "من يغني Levitating؟" },
    answer: { en: "Dua Lipa", ar: "دوا ليبا" },
    distractors: [
      { en: "Ava Max", ar: "آفا ماكس" },
      { en: "Sia", ar: "سيا" },
      { en: "Selena Gomez", ar: "سيلينا غوميز" }
    ]
  },
  {
    question: { en: "What does 'POV' often mean in social media videos?", ar: "ماذا يعني POV غالبا في فيديوهات السوشيال؟" },
    answer: { en: "Point of view", ar: "وجهة نظر" },
    distractors: [
      { en: "Proof of video", ar: "إثبات الفيديو" },
      { en: "People on view", ar: "ناس على الشاشة" },
      { en: "Part of vlog", ar: "جزء من فلوق" }
    ]
  },
  {
    question: { en: "The meme 'This is fine' features which animal?", ar: "ميم This is fine فيه أي حيوان؟" },
    answer: { en: "Dog", ar: "كلب" },
    distractors: [
      { en: "Cat", ar: "قط" },
      { en: "Fox", ar: "ثعلب" },
      { en: "Rabbit", ar: "أرنب" }
    ]
  },
  {
    question: { en: "Who sings 'Flowers'?", ar: "من يغني Flowers؟" },
    answer: { en: "Miley Cyrus", ar: "مايلي سايرس" },
    distractors: [
      { en: "Katy Perry", ar: "كاتي بيري" },
      { en: "Olivia Rodrigo", ar: "أوليفيا رودريغو" },
      { en: "Halsey", ar: "هالسي" }
    ]
  }
];

const RAPID_FIRE_SEEDS: CorrectSeed[] = [
  {
    question: { en: "Which language styles web pages?", ar: "أي لغة تنسق صفحات الويب؟" },
    answer: { en: "CSS", ar: "CSS" },
    distractors: [
      { en: "HTML", ar: "HTML" },
      { en: "Python", ar: "Python" },
      { en: "SQL", ar: "SQL" }
    ],
    timerSeconds: 8
  },
  {
    question: { en: "Red Planet?", ar: "الكوكب الأحمر؟" },
    answer: { en: "Mars", ar: "المريخ" },
    distractors: [
      { en: "Venus", ar: "الزهرة" },
      { en: "Jupiter", ar: "المشتري" },
      { en: "Mercury", ar: "عطارد" }
    ],
    timerSeconds: 8
  },
  {
    question: { en: "2 + 2 = ?", ar: "2 + 2 = ؟" },
    answer: { en: "4", ar: "4" },
    distractors: [
      { en: "3", ar: "3" },
      { en: "5", ar: "5" },
      { en: "22", ar: "22" }
    ],
    timerSeconds: 7
  },
  {
    question: { en: "Largest ocean?", ar: "أكبر محيط؟" },
    answer: { en: "Pacific", ar: "الهادئ" },
    distractors: [
      { en: "Atlantic", ar: "الأطلسي" },
      { en: "Indian", ar: "الهندي" },
      { en: "Arctic", ar: "القطبي" }
    ],
    timerSeconds: 8
  },
  {
    question: { en: "Primary color among these?", ar: "أي لون أساسي من هذه؟" },
    answer: { en: "Blue", ar: "أزرق" },
    distractors: [
      { en: "Green", ar: "أخضر" },
      { en: "Purple", ar: "بنفسجي" },
      { en: "Pink", ar: "وردي" }
    ],
    timerSeconds: 7
  },
  {
    question: { en: "Fastest land animal?", ar: "أسرع حيوان بري؟" },
    answer: { en: "Cheetah", ar: "الفهد" },
    distractors: [
      { en: "Lion", ar: "الأسد" },
      { en: "Horse", ar: "الحصان" },
      { en: "Wolf", ar: "الذئب" }
    ],
    timerSeconds: 8
  },
  {
    question: { en: "Who wrote Romeo and Juliet?", ar: "من كتب روميو وجولييت؟" },
    answer: { en: "Shakespeare", ar: "شكسبير" },
    distractors: [
      { en: "Homer", ar: "هوميروس" },
      { en: "Dante", ar: "دانتي" },
      { en: "Tolstoy", ar: "تولستوي" }
    ],
    timerSeconds: 8
  },
  {
    question: { en: "How many days in a week?", ar: "كم يوما في الأسبوع؟" },
    answer: { en: "7", ar: "7" },
    distractors: [
      { en: "5", ar: "5" },
      { en: "6", ar: "6" },
      { en: "8", ar: "8" }
    ],
    timerSeconds: 7
  },
  {
    question: { en: "Opposite of hot?", ar: "عكس حار؟" },
    answer: { en: "Cold", ar: "بارد" },
    distractors: [
      { en: "Warm", ar: "دافئ" },
      { en: "Dry", ar: "جاف" },
      { en: "Mild", ar: "معتدل" }
    ],
    timerSeconds: 6
  },
  {
    question: { en: "HTML stands for?", ar: "اختصار HTML يعني؟" },
    answer: { en: "HyperText Markup Language", ar: "لغة ترميز النص التشعبي" },
    distractors: [
      { en: "HighText Markdown Language", ar: "لغة ماركداون عالية" },
      { en: "Home Tool Mark Language", ar: "لغة أدوات المنزل" },
      { en: "Hyper Tool Main Logic", ar: "منطق الأدوات" }
    ],
    timerSeconds: 9
  },
  {
    question: { en: "Capital of Morocco?", ar: "عاصمة المغرب؟" },
    answer: { en: "Rabat", ar: "الرباط" },
    distractors: [
      { en: "Casablanca", ar: "الدار البيضاء" },
      { en: "Marrakesh", ar: "مراكش" },
      { en: "Fes", ar: "فاس" }
    ],
    timerSeconds: 8
  },
  {
    question: { en: "Which one is a programming language?", ar: "أي واحد لغة برمجة؟" },
    answer: { en: "JavaScript", ar: "جافاسكربت" },
    distractors: [
      { en: "Photoshop", ar: "فوتوشوب" },
      { en: "Chrome", ar: "كروم" },
      { en: "Figma", ar: "فيغما" }
    ],
    timerSeconds: 8
  },
  {
    question: { en: "What gas do humans need to breathe?", ar: "أي غاز يحتاجه الإنسان للتنفس؟" },
    answer: { en: "Oxygen", ar: "الأكسجين" },
    distractors: [
      { en: "Carbon dioxide", ar: "ثاني أكسيد الكربون" },
      { en: "Nitrogen", ar: "النيتروجين" },
      { en: "Helium", ar: "الهيليوم" }
    ],
    timerSeconds: 8
  },
  {
    question: { en: "Which continent is Egypt in?", ar: "في أي قارة تقع مصر؟" },
    answer: { en: "Africa", ar: "إفريقيا" },
    distractors: [
      { en: "Asia", ar: "آسيا" },
      { en: "Europe", ar: "أوروبا" },
      { en: "South America", ar: "أمريكا الجنوبية" }
    ],
    timerSeconds: 8
  },
  {
    question: { en: "7 x 8 = ?", ar: "7 × 8 = ؟" },
    answer: { en: "56", ar: "56" },
    distractors: [
      { en: "54", ar: "54" },
      { en: "48", ar: "48" },
      { en: "64", ar: "64" }
    ],
    timerSeconds: 7
  },
  {
    question: { en: "Most used planet for life currently?", ar: "الكوكب المعروف بوجود الحياة حاليا؟" },
    answer: { en: "Earth", ar: "الأرض" },
    distractors: [
      { en: "Mars", ar: "المريخ" },
      { en: "Venus", ar: "الزهرة" },
      { en: "Saturn", ar: "زحل" }
    ],
    timerSeconds: 7
  },
  {
    question: { en: "A shape with 3 sides is?", ar: "شكل له 3 أضلاع هو؟" },
    answer: { en: "Triangle", ar: "مثلث" },
    distractors: [
      { en: "Square", ar: "مربع" },
      { en: "Circle", ar: "دائرة" },
      { en: "Rectangle", ar: "مستطيل" }
    ],
    timerSeconds: 7
  },
  {
    question: { en: "Which one is a browser?", ar: "أي واحد متصفح؟" },
    answer: { en: "Firefox", ar: "فايرفوكس" },
    distractors: [
      { en: "Linux", ar: "لينكس" },
      { en: "Windows", ar: "ويندوز" },
      { en: "Android", ar: "أندرويد" }
    ],
    timerSeconds: 8
  },
  {
    question: { en: "How many hours in a day?", ar: "كم ساعة في اليوم؟" },
    answer: { en: "24", ar: "24" },
    distractors: [
      { en: "12", ar: "12" },
      { en: "18", ar: "18" },
      { en: "30", ar: "30" }
    ],
    timerSeconds: 6
  },
  {
    question: { en: "Emoji for laughter with tears is called?", ar: "إيموجي الضحك بالدموع يسمى؟" },
    answer: { en: "Face with Tears of Joy", ar: "وجه بدموع الفرح" },
    distractors: [
      { en: "Rolling on floor laughing", ar: "يتدحرج من الضحك" },
      { en: "Smiling face", ar: "وجه مبتسم" },
      { en: "Winking face", ar: "وجه يغمز" }
    ],
    timerSeconds: 9
  }
];

const REVERSE_SEEDS: ReverseSeed[] = [
  {
    question: { en: "Pick the WRONG answer: How many months have 28 days?", ar: "اختر الإجابة الخاطئة: كم شهرا فيه 28 يوما؟" },
    options: [
      { en: "1", ar: "1" },
      { en: "12", ar: "12" },
      { en: "All months", ar: "كل الشهور" },
      { en: "Every month", ar: "كل شهر" }
    ],
    wrongIndex: 0
  },
  {
    question: { en: "Pick the WRONG planet fact.", ar: "اختر المعلومة الخاطئة عن الكواكب." },
    options: [
      { en: "Mars is known as the red planet", ar: "المريخ يعرف بالكوكب الأحمر" },
      { en: "Earth has one moon", ar: "للأرض قمر واحد" },
      { en: "The Sun is a planet", ar: "الشمس كوكب" },
      { en: "Jupiter is huge", ar: "المشتري ضخم" }
    ],
    wrongIndex: 2
  },
  {
    question: { en: "Pick the WRONG coding statement.", ar: "اختر العبارة الخاطئة في البرمجة." },
    options: [
      { en: "CSS styles pages", ar: "CSS تنسق الصفحات" },
      { en: "HTML is a database", ar: "HTML قاعدة بيانات" },
      { en: "JavaScript can run in browsers", ar: "جافاسكربت تعمل في المتصفح" },
      { en: "Variables store values", ar: "المتغيرات تخزن القيم" }
    ],
    wrongIndex: 1
  },
  {
    question: { en: "Pick the WRONG sports statement.", ar: "اختر العبارة الخاطئة في الرياضة." },
    options: [
      { en: "Football teams often have 11 players", ar: "فرق كرة القدم غالبا 11 لاعبا" },
      { en: "Basketball uses a net", ar: "كرة السلة تستخدم شبكة" },
      { en: "Tennis is played with bats", ar: "التنس يلعب بمضارب كريكيت" },
      { en: "A marathon is long distance", ar: "الماراثون مسافة طويلة" }
    ],
    wrongIndex: 2
  },
  {
    question: { en: "Pick the WRONG food fact.", ar: "اختر المعلومة الخاطئة عن الطعام." },
    options: [
      { en: "Pizza usually includes dough", ar: "البيتزا عادة فيها عجين" },
      { en: "Ice cream is usually hot", ar: "الآيس كريم عادة ساخن" },
      { en: "Sushi can include rice", ar: "السوشي قد يحتوي أرزا" },
      { en: "Bread is baked", ar: "الخبز يخبز" }
    ],
    wrongIndex: 1
  },
  {
    question: { en: "Pick the WRONG movie statement.", ar: "اختر العبارة الخاطئة عن الأفلام." },
    options: [
      { en: "Jack Sparrow is in Pirates of the Caribbean", ar: "جاك سبارو في قراصنة الكاريبي" },
      { en: "Harry Potter studies at Hogwarts", ar: "هاري بوتر يدرس في هوغوورتس" },
      { en: "Iron Man is from DC", ar: "آيرون مان من دي سي" },
      { en: "Avatar has Pandora", ar: "أفاتار فيه باندورا" }
    ],
    wrongIndex: 2
  },
  {
    question: { en: "Pick the WRONG country clue.", ar: "اختر الدليل الخاطئ للدولة." },
    options: [
      { en: "Japan has Tokyo", ar: "اليابان فيها طوكيو" },
      { en: "France has Eiffel Tower", ar: "فرنسا فيها برج إيفل" },
      { en: "Brazil's capital is Buenos Aires", ar: "عاصمة البرازيل بوينس آيرس" },
      { en: "Egypt has pyramids", ar: "مصر فيها أهرامات" }
    ],
    wrongIndex: 2
  },
  {
    question: { en: "Pick the WRONG social media fact.", ar: "اختر المعلومة الخاطئة عن السوشيال." },
    options: [
      { en: "TikTok is for short videos", ar: "تيك توك للفيديوهات القصيرة" },
      { en: "YouTube is a search engine", ar: "يوتيوب محرك بحث" },
      { en: "Twitch has live streams", ar: "تويتش فيه بث مباشر" },
      { en: "Instagram supports reels", ar: "إنستغرام يدعم الريلز" }
    ],
    wrongIndex: 1
  },
  {
    question: { en: "Pick the WRONG math statement.", ar: "اختر العبارة الخاطئة في الرياضيات." },
    options: [
      { en: "2 + 2 = 4", ar: "2 + 2 = 4" },
      { en: "10 / 2 = 5", ar: "10 / 2 = 5" },
      { en: "7 x 8 = 54", ar: "7 × 8 = 54" },
      { en: "9 - 3 = 6", ar: "9 - 3 = 6" }
    ],
    wrongIndex: 2
  },
  {
    question: { en: "Pick the WRONG weather statement.", ar: "اختر العبارة الخاطئة عن الطقس." },
    options: [
      { en: "Rain comes from clouds", ar: "المطر يأتي من الغيوم" },
      { en: "Snow is frozen water", ar: "الثلج ماء متجمد" },
      { en: "Thunder is silent", ar: "الرعد صامت" },
      { en: "Wind can be strong", ar: "الرياح قد تكون قوية" }
    ],
    wrongIndex: 2
  },
  {
    question: { en: "Pick the WRONG animal fact.", ar: "اختر المعلومة الخاطئة عن الحيوانات." },
    options: [
      { en: "Cheetah is fast", ar: "الفهد سريع" },
      { en: "Fish can breathe underwater", ar: "السمك يتنفس تحت الماء" },
      { en: "Birds are mammals", ar: "الطيور ثدييات" },
      { en: "Bees make honey", ar: "النحل يصنع العسل" }
    ],
    wrongIndex: 2
  },
  {
    question: { en: "Pick the WRONG music statement.", ar: "اختر العبارة الخاطئة عن الموسيقى." },
    options: [
      { en: "A piano has keys", ar: "البيانو له مفاتيح" },
      { en: "Drums are string instruments", ar: "الطبول آلات وترية" },
      { en: "Guitar can be acoustic", ar: "الجيتار قد يكون أكوستيك" },
      { en: "Songs have rhythm", ar: "الأغاني لها إيقاع" }
    ],
    wrongIndex: 1
  },
  {
    question: { en: "Pick the WRONG school statement.", ar: "اختر العبارة الخاطئة عن المدرسة." },
    options: [
      { en: "Teachers explain lessons", ar: "المعلمون يشرحون الدروس" },
      { en: "Pens are used to write", ar: "الأقلام تستخدم للكتابة" },
      { en: "Classrooms are usually underwater", ar: "الفصول عادة تحت الماء" },
      { en: "Students do homework", ar: "الطلاب يعملون الواجب" }
    ],
    wrongIndex: 2
  },
  {
    question: { en: "Pick the WRONG phone statement.", ar: "اختر العبارة الخاطئة عن الهاتف." },
    options: [
      { en: "Phones can send messages", ar: "الهواتف ترسل رسائل" },
      { en: "Phones never need charging", ar: "الهواتف لا تحتاج شحنا" },
      { en: "Phones can take photos", ar: "الهواتف تلتقط صورا" },
      { en: "Apps run on phones", ar: "التطبيقات تعمل على الهواتف" }
    ],
    wrongIndex: 1
  },
  {
    question: { en: "Pick the WRONG sea statement.", ar: "اختر العبارة الخاطئة عن البحر." },
    options: [
      { en: "Sea water is usually salty", ar: "ماء البحر عادة مالح" },
      { en: "Whales are tiny insects", ar: "الحيتان حشرات صغيرة" },
      { en: "Coral reefs exist", ar: "توجد شعاب مرجانية" },
      { en: "Tides rise and fall", ar: "المد والجزر يرتفعان وينخفضان" }
    ],
    wrongIndex: 1
  },
  {
    question: { en: "Pick the WRONG fitness statement.", ar: "اختر العبارة الخاطئة عن اللياقة." },
    options: [
      { en: "Running can improve endurance", ar: "الجري يحسن التحمل" },
      { en: "Water helps hydration", ar: "الماء يساعد على الترطيب" },
      { en: "Exercise means sleeping all day", ar: "التمرين يعني النوم طوال اليوم" },
      { en: "Stretching can increase flexibility", ar: "التمدد يزيد المرونة" }
    ],
    wrongIndex: 2
  },
  {
    question: { en: "Pick the WRONG internet statement.", ar: "اختر العبارة الخاطئة عن الإنترنت." },
    options: [
      { en: "Websites can have domains", ar: "المواقع لها نطاقات" },
      { en: "Wi-Fi is a fruit", ar: "الواي فاي فاكهة" },
      { en: "Emails can be sent online", ar: "الإيميلات ترسل عبر الإنترنت" },
      { en: "Browsers open web pages", ar: "المتصفحات تفتح صفحات الويب" }
    ],
    wrongIndex: 1
  },
  {
    question: { en: "Pick the WRONG city statement.", ar: "اختر العبارة الخاطئة عن المدن." },
    options: [
      { en: "Cities can have traffic", ar: "المدن قد يكون فيها ازدحام" },
      { en: "Cities have buildings", ar: "المدن فيها مبان" },
      { en: "Cities are always empty of people", ar: "المدن دائما بلا ناس" },
      { en: "Cities can have parks", ar: "المدن قد يكون فيها حدائق" }
    ],
    wrongIndex: 2
  },
  {
    question: { en: "Pick the WRONG technology statement.", ar: "اختر العبارة الخاطئة عن التقنية." },
    options: [
      { en: "AI can analyze data", ar: "الذكاء الاصطناعي يحلل البيانات" },
      { en: "Computers use electricity", ar: "الحواسيب تستخدم الكهرباء" },
      { en: "USB stands for Universal Singing Bus", ar: "USB تعني ناقلة الغناء" },
      { en: "Files can be stored digitally", ar: "الملفات تخزن رقميا" }
    ],
    wrongIndex: 2
  },
  {
    question: { en: "Pick the WRONG celebration statement.", ar: "اختر العبارة الخاطئة عن الاحتفالات." },
    options: [
      { en: "Birthdays can include cake", ar: "أعياد الميلاد قد تشمل كعكة" },
      { en: "People may give gifts", ar: "قد يعطي الناس هدايا" },
      { en: "Candles are always frozen in ice", ar: "الشموع دائما مجمدة بالثلج" },
      { en: "Music can play at parties", ar: "الموسيقى قد تعمل في الحفلات" }
    ],
    wrongIndex: 2
  }
];

const LIFE_SEEDS: LifeSeed[] = [
  {
    question: { en: "You find $100 on the street. What do you do?", ar: "وجدت 100 دولار في الشارع. ماذا تفعل؟" },
    options: [
      { en: "Keep it", ar: "أحتفظ به" },
      { en: "Look for the owner", ar: "أبحث عن صاحبه" },
      { en: "Give it to police", ar: "أسلمه للشرطة" }
    ],
    correctIndex: 1,
    explanation: {
      en: "Your avatar gains trust points for honesty.",
      ar: "شخصيتك تكسب نقاط ثقة بسبب الأمانة."
    }
  },
  {
    question: { en: "A friend is sad before an exam. You...", ar: "صديقك حزين قبل اختبار. أنت..." },
    options: [
      { en: "Ignore and scroll", ar: "أتجاهل وأتصفح" },
      { en: "Send encouragement", ar: "أرسل تشجيعا" },
      { en: "Laugh at them", ar: "أضحك عليه" }
    ],
    correctIndex: 1
  },
  {
    question: { en: "You are late and see an elder crossing road.", ar: "أنت متأخر وترى كبير سن يعبر الطريق." },
    options: [
      { en: "Help quickly", ar: "أساعد بسرعة" },
      { en: "Run away", ar: "أركض بعيدا" },
      { en: "Film for views", ar: "أصور للمشاهدات" }
    ],
    correctIndex: 0
  },
  {
    question: { en: "Your team project is failing. You choose to...", ar: "مشروع الفريق يفشل. تختار أن..." },
    options: [
      { en: "Blame everyone", ar: "ألوم الجميع" },
      { en: "Propose a clear plan", ar: "أقترح خطة واضحة" },
      { en: "Disappear", ar: "أختفي" }
    ],
    correctIndex: 1
  },
  {
    question: { en: "Someone drops groceries. Your move?", ar: "شخص أسقط حاجياته. ماذا تفعل؟" },
    options: [
      { en: "Help pick them up", ar: "أساعده في جمعها" },
      { en: "Step over them", ar: "أتجاوزها" },
      { en: "Take a photo", ar: "ألتقط صورة" }
    ],
    correctIndex: 0
  },
  {
    question: { en: "You can spend evening on growth or endless scrolling.", ar: "يمكنك قضاء المساء في التطور أو التصفح بلا نهاية." },
    options: [
      { en: "Learn one new skill", ar: "أتعلم مهارة جديدة" },
      { en: "Scroll all night", ar: "أتصفح طوال الليل" },
      { en: "Complain online", ar: "أشتكي أونلاين" }
    ],
    correctIndex: 0
  },
  {
    question: { en: "A rumor starts in class. You...", ar: "بدأت إشاعة في الفصل. أنت..." },
    options: [
      { en: "Spread it", ar: "أنشرها" },
      { en: "Stop it and verify facts", ar: "أوقفها وأتأكد من الحقيقة" },
      { en: "Add fake details", ar: "أضيف تفاصيل كاذبة" }
    ],
    correctIndex: 1
  },
  {
    question: { en: "You forgot homework. Best action?", ar: "نسيت الواجب. أفضل تصرف؟" },
    options: [
      { en: "Make excuses", ar: "أخترع أعذار" },
      { en: "Be honest and fix it", ar: "أكون صادقا وأصلحه" },
      { en: "Copy from someone", ar: "أنسخ من شخص" }
    ],
    correctIndex: 1
  },
  {
    question: { en: "You get extra change by mistake at shop.", ar: "أعطاك البائع باقي أكثر بالخطأ." },
    options: [
      { en: "Return the extra", ar: "أعيد الزيادة" },
      { en: "Keep quiet", ar: "أصمت" },
      { en: "Brag to friends", ar: "أتباهى للأصدقاء" }
    ],
    correctIndex: 0
  },
  {
    question: { en: "You promised to call home at 8pm.", ar: "وعدت بالاتصال بالبيت الساعة 8." },
    options: [
      { en: "Forget and sleep", ar: "أنسى وأنام" },
      { en: "Call on time", ar: "أتصل في الوقت" },
      { en: "Text 'later' every hour", ar: "أرسل لاحقا كل ساعة" }
    ],
    correctIndex: 1
  },
  {
    question: { en: "A teammate did great work. You...", ar: "زميلك أنجز عملا رائعا. أنت..." },
    options: [
      { en: "Take all credit", ar: "آخذ كل الفضل" },
      { en: "Celebrate and credit them", ar: "أشكره وأعطيه حقه" },
      { en: "Stay silent", ar: "أبقى صامتا" }
    ],
    correctIndex: 1
  },
  {
    question: { en: "Your battery is low and you need maps.", ar: "بطارية هاتفك ضعيفة وتحتاج الخرائط." },
    options: [
      { en: "Use power saving wisely", ar: "أستخدم وضع توفير الطاقة" },
      { en: "Watch videos", ar: "أشاهد فيديوهات" },
      { en: "Play games", ar: "ألعب ألعاب" }
    ],
    correctIndex: 0
  },
  {
    question: { en: "You can insult or give feedback in game chat.", ar: "يمكنك الإساءة أو تقديم ملاحظة في دردشة اللعبة." },
    options: [
      { en: "Flame everyone", ar: "أهاجم الجميع" },
      { en: "Give respectful feedback", ar: "أعطي ملاحظة محترمة" },
      { en: "Spam emojis", ar: "أزعج بالإيموجي" }
    ],
    correctIndex: 1
  },
  {
    question: { en: "You have free weekend time.", ar: "لديك وقت فراغ في عطلة نهاية الأسبوع." },
    options: [
      { en: "Plan rest and one productive task", ar: "أخطط للراحة ومهمة مفيدة" },
      { en: "Do nothing, panic Sunday", ar: "لا أفعل شيئا ثم أتوتر الأحد" },
      { en: "Cancel everyone", ar: "ألغي الجميع" }
    ],
    correctIndex: 0
  },
  {
    question: { en: "A classmate is bullied online.", ar: "زميلك يتعرض للتنمر أونلاين." },
    options: [
      { en: "Join jokes", ar: "أنضم للسخرية" },
      { en: "Report and support them", ar: "أبلغ وأدعمه" },
      { en: "Forward screenshots", ar: "أرسل لقطات الشاشة" }
    ],
    correctIndex: 1
  },
  {
    question: { en: "You are angry in a group chat.", ar: "أنت غاضب في دردشة جماعية." },
    options: [
      { en: "Send hurtful message", ar: "أرسل رسالة مؤذية" },
      { en: "Pause, then reply calmly", ar: "أتوقف ثم أرد بهدوء" },
      { en: "Exit dramatically", ar: "أغادر بشكل درامي" }
    ],
    correctIndex: 1
  },
  {
    question: { en: "You can save money or buy random skins.", ar: "يمكنك ادخار المال أو شراء أشياء عشوائية." },
    options: [
      { en: "Set a small savings goal", ar: "أضع هدف ادخار صغير" },
      { en: "Spend all now", ar: "أصرف الكل الآن" },
      { en: "Borrow from friends", ar: "أستلف من الأصدقاء" }
    ],
    correctIndex: 0
  },
  {
    question: { en: "You receive private info by mistake.", ar: "وصلتك معلومة خاصة بالخطأ." },
    options: [
      { en: "Share it", ar: "أنشرها" },
      { en: "Delete and inform sender", ar: "أحذفها وأخبر المرسل" },
      { en: "Keep screenshots", ar: "أحتفظ بالصور" }
    ],
    correctIndex: 1
  },
  {
    question: { en: "Your goal is better health this month.", ar: "هدفك صحة أفضل هذا الشهر." },
    options: [
      { en: "Start with daily 20-min walk", ar: "أبدأ بمشي 20 دقيقة يوميا" },
      { en: "Wait for perfect Monday", ar: "أنتظر الاثنين المثالي" },
      { en: "Crash diet for two days", ar: "رجيم قاس يومين" }
    ],
    correctIndex: 0
  },
  {
    question: { en: "You can mentor a younger player/student.", ar: "يمكنك مساعدة لاعب أو طالب أصغر." },
    options: [
      { en: "Mock them", ar: "أسخر منه" },
      { en: "Teach basics patiently", ar: "أعلمه الأساسيات بصبر" },
      { en: "Ignore all questions", ar: "أتجاهل الأسئلة" }
    ],
    correctIndex: 1
  }
];

const MOVIE_QUESTIONS = buildCorrectQuestions("movie_series", "movie", MOVIE_SEEDS);
const GAMING_QUESTIONS = buildCorrectQuestions("gaming", "gaming", GAMING_SEEDS);
const EMOJI_QUESTIONS = buildCorrectQuestions("emoji", "emoji", EMOJI_SEEDS);
const TRICK_QUESTIONS = buildCorrectQuestions("trick", "trick", TRICK_SEEDS);
const COUNTRY_QUESTIONS = buildCorrectQuestions("country", "country", COUNTRY_SEEDS);
const POP_QUESTIONS = buildCorrectQuestions("pop_culture", "pop", POP_SEEDS);
const RAPID_QUESTIONS = buildCorrectQuestions("rapid_fire", "rapid", RAPID_FIRE_SEEDS);
const REVERSE_QUESTIONS = buildReverseQuestions("reverse", REVERSE_SEEDS);
const LIFE_QUESTIONS = buildLifeQuestions("life", LIFE_SEEDS);

export const QUESTIONS: QuizQuestion[] = [
  ...EMOJI_QUESTIONS,
  ...MOVIE_QUESTIONS,
  ...GAMING_QUESTIONS,
  ...TRICK_QUESTIONS,
  ...COUNTRY_QUESTIONS,
  ...POP_QUESTIONS,
  ...REVERSE_QUESTIONS,
  ...LIFE_QUESTIONS,
  ...RAPID_QUESTIONS
];
