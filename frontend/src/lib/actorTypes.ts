// Extended actor interface with all backend methods used by the frontend.
// The auto-generated backend.d.ts only exposes a subset; we extend it here
// so TypeScript is satisfied without modifying the generated file.

export interface Subject {
  name: string;
  totalTopics: bigint;
  completedTopics: bigint;
  targetCompletionDate: bigint;
}

export interface Chapter {
  name: string;
  subjectName: string;
  totalTopics: bigint;
  completedTopics: bigint;
  notesPdf: [] | [Uint8Array];
}

export interface StudySession {
  date: bigint;
  subject: string;
  hoursStudied: bigint;
  topicsCovered: string;
}

export interface Test {
  name: string;
  subject: string;
  date: bigint;
  totalMarks: bigint;
  scoredMarks: [] | [bigint];
  chapters: string[];
  isCompleted: boolean;
}

export interface RevisionTopic {
  subject: string;
  topic: string;
  scheduledDate: bigint;
  isComplete: boolean;
}

export interface Goal {
  dailyGoal: bigint;
  actual: bigint;
}

export interface UserProgress {
  xp: bigint;
  level: bigint;
  currentStreak: bigint;
  lastStudyDate: bigint;
}

export interface XPResponse {
  xp: bigint;
  level: bigint;
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  unlockCondition: string;
  isUnlocked: boolean;
  unlockDate: [] | [bigint];
  progress: [] | [bigint];
  target: [] | [bigint];
  bonusXp: bigint;
}

export interface QuestionPaperMeta {
  name: string;
  uploadDate: bigint;
}

export interface ExtendedActor {
  // Subjects
  getSubjects(): Promise<Subject[]>;
  addSubject(name: string, totalTopics: bigint, targetDate: bigint): Promise<void>;
  updateCompletedTopics(name: string, completedTopics: bigint): Promise<void>;
  deleteSubject(name: string): Promise<void>;

  // Chapters
  addChapter(subjectName: string, chapterName: string, totalTopics: bigint): Promise<void>;
  updateChapterTopics(chapterName: string, completedTopics: bigint): Promise<void>;
  getArchivedChapters(): Promise<Chapter[]>;
  uploadPdf(pdfData: Uint8Array, chapterName: string): Promise<void>;
  getPdfBlobs(chapterName: string): Promise<Uint8Array>;

  // Study Sessions
  getStudySessions(): Promise<StudySession[]>;
  addStudySession(
    date: bigint,
    subject: string,
    hoursStudied: bigint,
    topicsCovered: string
  ): Promise<XPResponse>;

  // Session Summaries
  getSessionSummaries(): Promise<Array<{ key: string; value: { content: string } }>>;
  saveSessionSummary(id: string, content: string): Promise<void>;

  // Tests
  getTests(): Promise<Test[]>;
  getPendingTests(): Promise<Test[]>;
  getCompletedTests(): Promise<Test[]>;
  addTest(
    name: string,
    subject: string,
    date: bigint,
    totalMarks: bigint,
    chapters: string[]
  ): Promise<void>;
  updateTestScore(testName: string, scoredMarks: bigint): Promise<XPResponse>;

  // Revision
  getRevisionSchedule(): Promise<RevisionTopic[]>;
  addRevisionTopic(subject: string, topic: string, scheduledDate: bigint): Promise<void>;
  markRevisionComplete(subject: string, topic: string): Promise<void>;
  getRevisionSuggestions(): Promise<string[]>;

  // Goals
  getTodayGoal(): Promise<Goal>;
  setTodayGoal(goal: bigint): Promise<void>;
  incrementTodayGoal(): Promise<void>;

  // User Progress
  getUserProgress(): Promise<UserProgress>;

  // Rewards
  getAllRewards(): Promise<Reward[]>;
  evaluateRewards(): Promise<Reward[]>;

  // Question Papers
  getAllQuestionPapers(): Promise<QuestionPaperMeta[]>;
  getQuestionPaperPdf(name: string): Promise<Uint8Array>;
  uploadQuestionPaper(name: string, pdfBlob: Uint8Array): Promise<void>;

  // AI Suggestions
  getSuggestedSubjects(): Promise<string[]>;
}
