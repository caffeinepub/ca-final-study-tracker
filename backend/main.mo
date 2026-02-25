import Map "mo:core/Map";
import Time "mo:core/Time";
import List "mo:core/List";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Blob "mo:core/Blob";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import MixinStorage "blob-storage/Mixin";
import Migration "migration";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

// Apply migration on upgrade (no permanent change)
(with migration = Migration.run)
actor {
  // Important: Initialize access control state before mixin.
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  // ── Domain types ───────────────────────────────────────────────────────────
  type Subject = {
    name : Text;
    totalTopics : Nat;
    completedTopics : Nat;
    targetCompletionDate : Time.Time;
  };

  module Subject {
    public func compare(a : Subject, b : Subject) : Order.Order {
      Text.compare(a.name, b.name);
    };
  };

  type Chapter = {
    name : Text;
    subjectName : Text;
    totalTopics : Nat;
    completedTopics : Nat;
    notesPdf : ?Blob;
  };

  type StudySession = {
    date : Time.Time;
    subject : Text;
    hoursStudied : Nat;
    topicsCovered : Text;
  };

  type Test = {
    name : Text;
    subject : Text;
    date : Time.Time;
    totalMarks : Nat;
    scoredMarks : ?Nat;
    chapters : [Text];
    isCompleted : Bool;
  };

  type RevisionTopic = {
    subject : Text;
    topic : Text;
    scheduledDate : Time.Time;
    isComplete : Bool;
  };

  type Goal = {
    dailyGoal : Nat;
    actual : Nat;
  };

  type SessionSummary = {
    content : Text;
  };

  type UserProgress = {
    xp : Nat;
    level : Nat;
    currentStreak : Nat;
    lastStudyDate : Time.Time;
  };

  public type XPResponse = {
    xp : Nat;
    level : Nat;
  };

  type Reward = {
    id : Text;
    name : Text;
    description : Text;
    unlockCondition : Text;
    isUnlocked : Bool;
    unlockDate : ?Time.Time;
    progress : ?Nat;
    target : ?Nat;
    bonusXp : Nat;
  };

  type QuestionPaper = {
    name : Text;
    uploadDate : Time.Time;
    pdfBlob : Blob;
  };

  public type UserProfile = {
    name : Text;
    email : ?Text;
    avatarUrl : ?Text;
  };

  // ── Persistent state ───────────────────────────────────────────────────────
  let subjects = Map.empty<Text, Subject>();
  let completedTests = Map.empty<Text, Test>();
  let nonCompletedTests = Map.empty<Text, Test>();
  let chapters = Map.empty<Text, Chapter>();
  let archivedChapters = Map.empty<Text, Chapter>();

  var dailyGoal : Nat = 0;
  var dailyActual : Nat = 0;

  let studySessions = List.empty<StudySession>();
  let revisionTopics = List.empty<RevisionTopic>();
  let sessionSummaries = Map.empty<Text, SessionSummary>();

  var userProgress : UserProgress = {
    xp = 0;
    level = 1;
    currentStreak = 0;
    lastStudyDate = 0;
  };

  var rewards : ?Map.Map<Text, Reward> = null;
  var questionPapers : ?Map.Map<Text, QuestionPaper> = null;

  let userProfiles = Map.empty<Principal, UserProfile>();

  // ── Helper: get or initialise rewards map ─────────────────────────────────
  func getRewardsMap() : Map.Map<Text, Reward> {
    switch (rewards) {
      case (?r) { r };
      case (null) {
        let r = Map.empty<Text, Reward>();
        rewards := ?r;
        r;
      };
    };
  };

  func getQuestionPapersMap() : Map.Map<Text, QuestionPaper> {
    switch (questionPapers) {
      case (?qp) { qp };
      case (null) {
        let qp = Map.empty<Text, QuestionPaper>();
        questionPapers := ?qp;
        qp;
      };
    };
  };

  // ── User Profile methods ──────────────────────────────────────────────────
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // ── Subjects methods ──────────────────────────────────────────────────────
  public query ({ caller }) func getSubjects() : async [Subject] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view subjects");
    };
    subjects.values().toArray().sort();
  };

  public shared ({ caller }) func addSubject(subject : Subject) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can add subjects");
    };
    subjects.add(subject.name, subject);
  };

  public shared ({ caller }) func updateSubject(subject : Subject) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can update subjects");
    };
    subjects.add(subject.name, subject);
  };

  public shared ({ caller }) func deleteSubject(subjectName : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can delete subjects");
    };
    subjects.remove(subjectName);
  };

  // ── Chapters methods ──────────────────────────────────────────────────────
  public query ({ caller }) func getChapters() : async [Chapter] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view chapters");
    };
    chapters.values().toArray();
  };

  public shared ({ caller }) func addChapter(chapter : Chapter) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can add chapters");
    };
    chapters.add(chapter.name, chapter);
  };

  public shared ({ caller }) func updateChapter(chapter : Chapter) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can update chapters");
    };
    chapters.add(chapter.name, chapter);
  };

  public shared ({ caller }) func archiveChapter(chapterName : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can archive chapters");
    };
    switch (chapters.get(chapterName)) {
      case (?chapter) {
        archivedChapters.add(chapterName, chapter);
        chapters.remove(chapterName);
      };
      case (null) { Runtime.trap("Chapter not found") };
    };
  };

  public query ({ caller }) func getArchivedChapters() : async [Chapter] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view archived chapters");
    };
    archivedChapters.values().toArray();
  };

  // ── Study Sessions methods ────────────────────────────────────────────────
  public query ({ caller }) func getStudySessions() : async [StudySession] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view study sessions");
    };
    studySessions.toArray();
  };

  public shared ({ caller }) func addStudySession(session : StudySession) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can add study sessions");
    };
    studySessions.add(session);
  };

  // ── Tests methods ─────────────────────────────────────────────────────────
  public query ({ caller }) func getCompletedTests() : async [Test] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view tests");
    };
    completedTests.values().toArray();
  };

  public query ({ caller }) func getNonCompletedTests() : async [Test] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view tests");
    };
    nonCompletedTests.values().toArray();
  };

  public shared ({ caller }) func addTest(test : Test) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can add tests");
    };
    if (test.isCompleted) {
      completedTests.add(test.name, test);
    } else {
      nonCompletedTests.add(test.name, test);
    };
  };

  public shared ({ caller }) func updateTest(test : Test) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can update tests");
    };
    if (test.isCompleted) {
      completedTests.add(test.name, test);
      nonCompletedTests.remove(test.name);
    } else {
      nonCompletedTests.add(test.name, test);
      completedTests.remove(test.name);
    };
  };

  public shared ({ caller }) func deleteTest(testName : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can delete tests");
    };
    completedTests.remove(testName);
    nonCompletedTests.remove(testName);
  };

  // ── Revision Topics methods ───────────────────────────────────────────────
  public query ({ caller }) func getRevisionTopics() : async [RevisionTopic] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view revision topics");
    };
    revisionTopics.toArray();
  };

  public shared ({ caller }) func addRevisionTopic(topic : RevisionTopic) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can add revision topics");
    };
    revisionTopics.add(topic);
  };

  // ── Daily Goal methods ────────────────────────────────────────────────────
  public query ({ caller }) func getDailyGoal() : async Goal {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view daily goals");
    };
    { dailyGoal = dailyGoal; actual = dailyActual };
  };

  public shared ({ caller }) func setDailyGoal(goal : Nat) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can set daily goals");
    };
    dailyGoal := goal;
  };

  public shared ({ caller }) func updateDailyActual(actual : Nat) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can update daily actual");
    };
    dailyActual := actual;
  };

  // ── Session Summaries methods ─────────────────────────────────────────────
  public query ({ caller }) func getSessionSummary(key : Text) : async ?SessionSummary {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view session summaries");
    };
    sessionSummaries.get(key);
  };

  public shared ({ caller }) func saveSessionSummary(key : Text, summary : SessionSummary) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save session summaries");
    };
    sessionSummaries.add(key, summary);
  };

  // ── User Progress methods ─────────────────────────────────────────────────
  public query ({ caller }) func getUserProgress() : async UserProgress {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view progress");
    };
    userProgress;
  };

  public shared ({ caller }) func updateUserProgress(progress : UserProgress) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can update progress");
    };
    userProgress := progress;
  };

  public shared ({ caller }) func addXP(amount : Nat) : async XPResponse {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can add XP");
    };
    let newXp = userProgress.xp + amount;
    let newLevel = (newXp / 1000) + 1;
    userProgress := {
      userProgress with
      xp = newXp;
      level = newLevel;
    };
    { xp = newXp; level = newLevel };
  };

  // ── Rewards methods ───────────────────────────────────────────────────────
  public query ({ caller }) func getRewards() : async [Reward] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view rewards");
    };
    getRewardsMap().values().toArray();
  };

  public shared ({ caller }) func addReward(reward : Reward) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can add rewards");
    };
    getRewardsMap().add(reward.id, reward);
  };

  public shared ({ caller }) func updateReward(reward : Reward) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can update rewards");
    };
    getRewardsMap().add(reward.id, reward);
  };

  // ── Question Papers methods ───────────────────────────────────────────────
  public query ({ caller }) func getQuestionPapers() : async [QuestionPaper] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view question papers");
    };
    getQuestionPapersMap().values().toArray();
  };

  public shared ({ caller }) func addQuestionPaper(paper : QuestionPaper) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can add question papers");
    };
    getQuestionPapersMap().add(paper.name, paper);
  };

  public shared ({ caller }) func deleteQuestionPaper(paperName : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can delete question papers");
    };
    getQuestionPapersMap().remove(paperName);
  };
};
