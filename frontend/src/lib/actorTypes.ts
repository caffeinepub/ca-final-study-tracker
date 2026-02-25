import type { backendInterface } from '../backend';

export type Subject = {
  name: string;
  totalChapters: bigint;
};

export type Chapter = {
  chapterId: string;
  chapterName: string;
  chaptersCompleted: bigint;
  subjectName: string;
  totalTopics: bigint;
  completedTopics: bigint;
  notesPdf?: Uint8Array;
  isCompleted: boolean;
};

export type StudySession = {
  date: bigint;
  subject: string;
  hoursStudied: bigint;
  topicsCovered: string;
  errorLog?: string;
};

export type Test = {
  name: string;
  subject: string;
  date: bigint;
  totalMarks: bigint;
  scoredMarks?: bigint;
  chapters: string[];
  isCompleted: boolean;
};

export type RevisionTopic = {
  subject: string;
  topic: string;
  scheduledDate: bigint;
  isComplete: boolean;
};

export type Goal = {
  dailyGoal: bigint;
  actual: bigint;
};

export type UserProgress = {
  xp: bigint;
  level: bigint;
  currentStreak: bigint;
  lastStudyDate: bigint;
};

export type Reward = {
  id: string;
  name: string;
  description: string;
  unlockCondition: string;
  isUnlocked: boolean;
  unlockDate?: bigint;
  progress?: bigint;
  target?: bigint;
  bonusXp: bigint;
};

export type QuestionPaperMeta = {
  name: string;
  uploadDate: bigint;
};

export type QuestionPaper = {
  name: string;
  uploadDate: bigint;
  pdfBlob: Uint8Array;
};

export type ExtendedActor = backendInterface & {
  addSubject(name: string, totalChapters: bigint): Promise<void>;
  getSubjects(): Promise<Subject[]>;
  deleteSubject(name: string): Promise<void>;
  getChapters(): Promise<Chapter[]>;
  addChapter(chapter: Chapter): Promise<void>;
  deleteChapter(id: string): Promise<void>;
  updateChapterName(id: string, newName: string): Promise<void>;
  updateChapterCompletion(id: string, isCompleted: boolean): Promise<void>;
  uploadPdf(id: string, pdf: Uint8Array): Promise<void>;
  addStudySession(session: StudySession): Promise<void>;
  getStudySessions(): Promise<StudySession[]>;
  getSessionsWithErrors(): Promise<StudySession[]>;
  addTest(test: Test): Promise<void>;
  getCompletedTests(): Promise<Test[]>;
  getNonCompletedTests(): Promise<Test[]>;
  addRevisionTopic(topic: RevisionTopic): Promise<void>;
  markRevisionComplete(subject: string, topic: string): Promise<void>;
  getRevisionTopics(): Promise<RevisionTopic[]>;
  setTodayGoal(goal: bigint): Promise<void>;
  incrementTodayHours(hours: bigint): Promise<void>;
  getTodayGoal(): Promise<Goal>;
  getUserProgress(): Promise<UserProgress>;
  updateUserProgress(progress: UserProgress): Promise<void>;
  getRewards(): Promise<Reward[]>;
  addReward(reward: Reward): Promise<void>;
  getQuestionPapers(): Promise<QuestionPaper[]>;
  uploadQuestionPaper(paper: QuestionPaper): Promise<void>;
};
