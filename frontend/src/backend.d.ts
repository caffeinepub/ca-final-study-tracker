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
    email?: string;
    avatarUrl?: string;
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
    subjectName: string;
    name: string;
    totalTopics: bigint;
    notesPdf?: Uint8Array;
    completedTopics: bigint;
}
export interface SessionSummary {
    content: string;
}
export interface StudySession {
    topicsCovered: string;
    subject: string;
    date: Time;
    hoursStudied: bigint;
}
export interface Subject {
    targetCompletionDate: Time;
    name: string;
    totalTopics: bigint;
    completedTopics: bigint;
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
    addQuestionPaper(paper: QuestionPaper): Promise<void>;
    addRevisionTopic(topic: RevisionTopic): Promise<void>;
    addReward(reward: Reward): Promise<void>;
    addStudySession(session: StudySession): Promise<void>;
    addSubject(subject: Subject): Promise<void>;
    addTest(test: Test): Promise<void>;
    addXP(amount: bigint): Promise<XPResponse>;
    archiveChapter(chapterName: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteQuestionPaper(paperName: string): Promise<void>;
    deleteSubject(subjectName: string): Promise<void>;
    deleteTest(testName: string): Promise<void>;
    getArchivedChapters(): Promise<Array<Chapter>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getChapters(): Promise<Array<Chapter>>;
    getCompletedTests(): Promise<Array<Test>>;
    getDailyGoal(): Promise<Goal>;
    getNonCompletedTests(): Promise<Array<Test>>;
    getQuestionPapers(): Promise<Array<QuestionPaper>>;
    getRevisionTopics(): Promise<Array<RevisionTopic>>;
    getRewards(): Promise<Array<Reward>>;
    getSessionSummary(key: string): Promise<SessionSummary | null>;
    getStudySessions(): Promise<Array<StudySession>>;
    getSubjects(): Promise<Array<Subject>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getUserProgress(): Promise<UserProgress>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    saveSessionSummary(key: string, summary: SessionSummary): Promise<void>;
    setDailyGoal(goal: bigint): Promise<void>;
    updateChapter(chapter: Chapter): Promise<void>;
    updateDailyActual(actual: bigint): Promise<void>;
    updateReward(reward: Reward): Promise<void>;
    updateSubject(subject: Subject): Promise<void>;
    updateTest(test: Test): Promise<void>;
    updateUserProgress(progress: UserProgress): Promise<void>;
}
