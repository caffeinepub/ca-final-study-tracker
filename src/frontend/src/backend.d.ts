import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Goal {
    actual: bigint;
    dailyGoal: bigint;
}
export interface Chapter {
    subjectName: string;
    name: string;
    totalTopics: bigint;
    notesPdf?: Uint8Array;
    completedTopics: bigint;
}
export type Time = bigint;
export interface Test {
    totalMarks: bigint;
    subject: string;
    scoredMarks?: bigint;
    isCompleted: boolean;
    date: Time;
    name: string;
    chapters: Array<string>;
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
export interface RevisionTopic {
    topic: string;
    subject: string;
    scheduledDate: Time;
    isComplete: boolean;
}
export interface backendInterface {
    addChapter(subjectName: string, chapterName: string, totalTopics: bigint): Promise<void>;
    addRevisionTopic(subject: string, topic: string, scheduledDate: Time): Promise<void>;
    addStudySession(date: Time, subject: string, hours: bigint, topics: string): Promise<void>;
    addSubject(name: string, totalTopics: bigint, targetDate: Time): Promise<void>;
    addTest(name: string, subject: string, date: Time, totalMarks: bigint, chapters: Array<string>): Promise<void>;
    deleteSubject(subjectName: string): Promise<void>;
    getAllChapters(): Promise<Array<Chapter>>;
    getArchivedChapters(): Promise<Array<Chapter>>;
    getChaptersBySubject(subjectName: string): Promise<Array<Chapter>>;
    getCompletedTests(): Promise<Array<Test>>;
    getPdfBlobs(chapterName: string): Promise<Uint8Array | null>;
    getPdfPath(chapterName: string): Promise<Uint8Array | null>;
    getPendingTests(): Promise<Array<Test>>;
    getRevisionSchedule(): Promise<Array<RevisionTopic>>;
    getRevisionSuggestions(): Promise<Array<string>>;
    getSessionSummaries(): Promise<Array<string>>;
    getStudySessions(): Promise<Array<StudySession>>;
    getSubjects(): Promise<Array<Subject>>;
    getSuggestedSubjects(): Promise<Array<string>>;
    getTests(): Promise<Array<Test>>;
    getTodayGoal(): Promise<Goal>;
    incrementTodayGoal(): Promise<void>;
    markRevisionComplete(subject: string, topic: string): Promise<void>;
    saveSessionSummary(sessionId: string, summaryText: string): Promise<void>;
    setTodayGoal(goal: bigint): Promise<void>;
    updateChapterTopics(chapterName: string, completed: bigint): Promise<void>;
    updateCompletedTopics(subjectName: string, completed: bigint): Promise<void>;
    updateTestScore(name: string, scoredMarks: bigint): Promise<void>;
    uploadPdf(file: Uint8Array, chapterName: string): Promise<void>;
}
