import { Language, QuizType } from "../types";

interface UIStrings {
  appTitle: string;
  selectLanguage: string;
  chooseLanguageHint: string;
  english: string;
  arabic: string;
  username: string;
  usernamePlaceholder: string;
  avatarEmoji: string;
  saveProfile: string;
  startGame: string;
  settings: string;
  leaderboard: string;
  pickQuizType: string;
  questionOfDay: string;
  score: string;
  nextQuestion: string;
  finishQuiz: string;
  backHome: string;
  correct: string;
  wrong: string;
  pickWrongRule: string;
  timer: string;
  pointsEarned: string;
  finalScore: string;
  playAgain: string;
  language: string;
  theme: string;
  lightMode: string;
  darkMode: string;
  randomOrderEnabled: string;
  noLeaderboardYet: string;
  developedBy: string;
  dailyChallenge: string;
  saveSettings: string;
  profileColor: string;
  multiplayer: string;
  createRoom: string;
  joinRoom: string;
  roomCode: string;
  roomCodePlaceholder: string;
  connect: string;
  leaveRoom: string;
  startMatch: string;
  waitingPlayers: string;
  lobby: string;
  liveScores: string;
  emojiReaction: string;
  daily: string;
  weekly: string;
  allTime: string;
}

interface Dictionary {
  ui: UIStrings;
  quizTypeNames: Record<QuizType, string>;
}

export const dictionary: Record<Language, Dictionary> = {
  en: {
    ui: {
      appTitle: "GlowQuiz",
      selectLanguage: "Choose Your Language",
      chooseLanguageHint: "You can switch it anytime in Settings.",
      english: "English",
      arabic: "Arabic",
      username: "Username",
      usernamePlaceholder: "Enter a cool name",
      avatarEmoji: "Avatar Emoji",
      saveProfile: "Save Profile",
      startGame: "Start Quiz",
      settings: "Settings",
      leaderboard: "Leaderboard",
      pickQuizType: "Pick a Quiz Type",
      questionOfDay: "Question of the Day",
      score: "Score",
      nextQuestion: "Next",
      finishQuiz: "Finish",
      backHome: "Back to Home",
      correct: "Correct! Great job.",
      wrong: "Oops, not this one.",
      pickWrongRule: "Wrong Answer Only: pick the incorrect option!",
      timer: "Time",
      pointsEarned: "Points",
      finalScore: "Final Score",
      playAgain: "Play Again",
      language: "Language",
      theme: "Theme",
      lightMode: "Light Mode",
      darkMode: "Dark Mode",
      randomOrderEnabled: "Questions are shuffled every run",
      noLeaderboardYet: "No scores yet. Play a quiz to appear here!",
      developedBy: "Developed by ZaydSouili-ESISA",
      dailyChallenge: "Daily Challenge",
      saveSettings: "Saved automatically",
      profileColor: "Profile Color",
      multiplayer: "Online Multiplayer",
      createRoom: "Create Room",
      joinRoom: "Join Room",
      roomCode: "Room Code",
      roomCodePlaceholder: "Enter room code",
      connect: "Connect",
      leaveRoom: "Leave Room",
      startMatch: "Start Match",
      waitingPlayers: "Waiting for players...",
      lobby: "Lobby",
      liveScores: "Live Scores",
      emojiReaction: "Emoji Reaction",
      daily: "Daily",
      weekly: "Weekly",
      allTime: "All-time"
    },
    quizTypeNames: {
      emoji: "Guess the Emoji",
      movie_series: "Movie & Series Quiz",
      gaming: "Gaming Quiz",
      trick: "Trick Question Quiz",
      country: "Guess the Country",
      pop_culture: "Pop Culture Quiz",
      reverse: "Reverse Quiz",
      life_sim: "Mini Life Simulator",
      rapid_fire: "Rapid Fire Quiz"
    }
  },
  ar: {
    ui: {
      appTitle: "GlowQuiz",
      selectLanguage: "اختر اللغة",
      chooseLanguageHint: "يمكنك تغييرها في أي وقت من الإعدادات.",
      english: "English",
      arabic: "العربية",
      username: "اسم المستخدم",
      usernamePlaceholder: "اكتب اسم مميز",
      avatarEmoji: "إيموجي الصورة",
      saveProfile: "حفظ الملف",
      startGame: "ابدأ الاختبار",
      settings: "الإعدادات",
      leaderboard: "لوحة المتصدرين",
      pickQuizType: "اختر نوع الاختبار",
      questionOfDay: "سؤال اليوم",
      score: "النقاط",
      nextQuestion: "التالي",
      finishQuiz: "إنهاء",
      backHome: "العودة للرئيسية",
      correct: "إجابة صحيحة! رائع.",
      wrong: "ليست الإجابة الصحيحة.",
      pickWrongRule: "اختبار الإجابة الخاطئة: اختر الخيار غير الصحيح!",
      timer: "الوقت",
      pointsEarned: "النقاط",
      finalScore: "النتيجة النهائية",
      playAgain: "العب مرة أخرى",
      language: "اللغة",
      theme: "المظهر",
      lightMode: "الوضع الفاتح",
      darkMode: "الوضع الداكن",
      randomOrderEnabled: "الأسئلة تتبدل عشوائيا في كل مرة",
      noLeaderboardYet: "لا توجد نتائج بعد. العب لتظهر هنا!",
      developedBy: "Developed by ZaydSouili-ESISA",
      dailyChallenge: "تحدي اليوم",
      saveSettings: "يتم الحفظ تلقائيا",
      profileColor: "لون الملف الشخصي",
      multiplayer: "طور اللعب الجماعي",
      createRoom: "إنشاء غرفة",
      joinRoom: "الانضمام لغرفة",
      roomCode: "رمز الغرفة",
      roomCodePlaceholder: "أدخل رمز الغرفة",
      connect: "اتصال",
      leaveRoom: "مغادرة الغرفة",
      startMatch: "ابدأ المباراة",
      waitingPlayers: "في انتظار اللاعبين...",
      lobby: "الردهة",
      liveScores: "النتائج المباشرة",
      emojiReaction: "رد فعل إيموجي",
      daily: "يومي",
      weekly: "أسبوعي",
      allTime: "كل الوقت"
    },
    quizTypeNames: {
      emoji: "خمن الإيموجي",
      movie_series: "اختبار الأفلام والمسلسلات",
      gaming: "اختبار الألعاب",
      trick: "اختبار الأسئلة المخادعة",
      country: "خمن الدولة",
      pop_culture: "اختبار الثقافة الشعبية",
      reverse: "اختبار العكس",
      life_sim: "محاكي الحياة المصغر",
      rapid_fire: "الأسئلة السريعة"
    }
  }
};
