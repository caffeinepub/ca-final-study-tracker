import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface UserProfile {
    name: string;
}
export interface Goal {
    actual: bigint;
    dailyGoal: bigint;
}
export type Time = bigint;
export interface Reward {
    id: string;
    unlockDate?: Time;
    name: string;
    description: string;
    unlockCondition: string;
    progress?: bigint;
    target?: bigint;
    isUnlocked: boolean;
    bonusXp: bigint;
}
export interface Test {
    totalMarks: bigint;
    subject: string;
    scoredMarks?: bigint;
    isCompleted: boolean;
    date: Time;
    name: string;
    chapters: Array<string>;
}
export interface QuestionPaper {
    pdfBlob: Uint8Array;
    name: string;
    uploadDate: Time;
}
export interface UserProgress {
    xp: bigint;
    level: bigint;
    lastStudyDate: Time;
    currentStreak: bigint;
}
export interface RevisionTopic {
    topic: string;
    subject: string;
    scheduledDate: Time;
    isComplete: boolean;
}
export interface Chapter {
    isCompleted: boolean;
    subjectName: string;
    totalTopics: bigint;
    chapterId: string;
    chaptersCompleted: bigint;
    notesPdf?: Uint8Array;
    completedTopics: bigint;
    chapterName: string;
}
export interface StudySession {
    topicsCovered: string;
    subject: string;
    date: Time;
    hoursStudied: bigint;
    errorLog?: string;
}
export interface Subject {
    name: string;
    totalChapters: bigint;
}
export interface XPResponse {
    xp: bigint;
    level: bigint;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addChapter(chapter: Chapter): Promise<void>;
    addRevisionTopic(topic: RevisionTopic): Promise<void>;
    addReward(reward: Reward): Promise<void>;
    addStudySession(session: StudySession): Promise<void>;
    addSubject(name: string, totalChapters: bigint): Promise<void>;
    addTest(test: Test): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteChapter(id: string): Promise<void>;
    deleteSubject(name: string): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getChapters(): Promise<Array<Chapter>>;
    getCompletedTests(): Promise<Array<Test>>;
    getNonCompletedTests(): Promise<Array<Test>>;
    getQuestionPapers(): Promise<Array<QuestionPaper>>;
    getRevisionTopics(): Promise<Array<RevisionTopic>>;
    getRewards(): Promise<Array<Reward>>;
    getSessionsWithErrors(): Promise<Array<StudySession>>;
    getStudySessions(): Promise<Array<StudySession>>;
    getSubjects(): Promise<Array<Subject>>;
    getTodayGoal(): Promise<Goal>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getUserProgress(): Promise<UserProgress>;
    getXP(): Promise<XPResponse>;
    incrementTodayHours(hours: bigint): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    markRevisionComplete(subject: string, topic: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setTodayGoal(goal: bigint): Promise<void>;
    updateChapterCompletion(id: string, isCompleted: boolean): Promise<void>;
    updateChapterName(id: string, newName: string): Promise<void>;
    updateUserProgress(progress: UserProgress): Promise<void>;
    uploadPdf(id: string, pdf: Uint8Array): Promise<void>;
    uploadQuestionPaper(paper: QuestionPaper): Promise<void>;
}
