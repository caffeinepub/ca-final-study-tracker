import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import List "mo:core/List";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Blob "mo:core/Blob";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";

import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  include MixinStorage();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Types
  public type UserProfile = {
    name : Text;
  };

  public type Subject = {
    name : Text;
    totalChapters : Nat;
  };

  public type Chapter = {
    chapterId : Text;
    chapterName : Text;
    chaptersCompleted : Nat;
    subjectName : Text;
    totalTopics : Nat;
    completedTopics : Nat;
    notesPdf : ?Blob;
    isCompleted : Bool;
  };

  type StudySession = {
    date : Time.Time;
    subject : Text;
    hoursStudied : Nat;
    topicsCovered : Text;
    errorLog : ?Text;
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

  // State
  let userProfiles = Map.empty<Principal, UserProfile>();
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

  // User Profiles
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get their profile");
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
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Subject Management
  public shared ({ caller }) func addSubject(name : Text, totalChapters : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add subjects");
    };
    let subject = {
      name;
      totalChapters;
    };
    subjects.add(subject.name, subject);
  };

  public shared ({ caller }) func deleteSubject(name : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete subjects");
    };
    subjects.remove(name);
  };

  public query ({ caller }) func getSubjects() : async [Subject] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view subjects");
    };
    subjects.values().toArray();
  };

  // Chapter Management
  public query ({ caller }) func getChapters() : async [Chapter] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view chapters");
    };
    chapters.values().toArray();
  };

  public shared ({ caller }) func addChapter(chapter : Chapter) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add chapters");
    };
    chapters.add(chapter.chapterId, chapter);
  };

  public shared ({ caller }) func deleteChapter(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete chapters");
    };
    chapters.remove(id);
  };

  public shared ({ caller }) func updateChapterName(id : Text, newName : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update chapter names");
    };
    switch (chapters.get(id)) {
      case (?chapter) {
        chapters.add(id, { chapter with chapterName = newName });
      };
      case (null) {};
    };
  };

  public shared ({ caller }) func updateChapterCompletion(id : Text, isCompleted : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update chapter completion");
    };
    switch (chapters.get(id)) {
      case (?chapter) {
        chapters.add(id, { chapter with isCompleted });
      };
      case (null) {};
    };
  };

  // Study Sessions
  public shared ({ caller }) func addStudySession(session : StudySession) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add study sessions");
    };
    studySessions.add(session);
  };

  public query ({ caller }) func getStudySessions() : async [StudySession] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view study sessions");
    };
    studySessions.toArray();
  };

  public query ({ caller }) func getSessionsWithErrors() : async [StudySession] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view sessions with errors");
    };
    studySessions.toArray().filter(
      func(session) {
        switch (session.errorLog) {
          case (null) { false };
          case (?_) { true };
        };
      }
    );
  };

  // Test Management
  public shared ({ caller }) func addTest(test : Test) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add tests");
    };
    if (test.isCompleted) {
      completedTests.add(test.name, test);
    } else {
      nonCompletedTests.add(test.name, test);
    };
  };

  public query ({ caller }) func getCompletedTests() : async [Test] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view completed tests");
    };
    completedTests.values().toArray();
  };

  public query ({ caller }) func getNonCompletedTests() : async [Test] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view non-completed tests");
    };
    nonCompletedTests.values().toArray();
  };

  // Revision Topic Methods
  public shared ({ caller }) func addRevisionTopic(topic : RevisionTopic) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add revision topics");
    };
    revisionTopics.add(topic);
  };

  public shared ({ caller }) func markRevisionComplete(subject : Text, topic : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can mark revision topics complete");
    };
    let updated = revisionTopics.toArray().map(
      func(t : RevisionTopic) : RevisionTopic {
        if (t.subject == subject and t.topic == topic) {
          { t with isComplete = true };
        } else {
          t;
        };
      }
    );
    revisionTopics.clear();
    for (t in updated.vals()) {
      revisionTopics.add(t);
    };
  };

  public query ({ caller }) func getRevisionTopics() : async [RevisionTopic] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view revision topics");
    };
    revisionTopics.toArray();
  };

  // Daily Goal Methods
  public shared ({ caller }) func setTodayGoal(goal : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can set daily goals");
    };
    dailyGoal := goal;
  };

  public shared ({ caller }) func incrementTodayHours(hours : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can increment today's hours");
    };
    dailyActual := dailyActual + hours;
  };

  public query ({ caller }) func getTodayGoal() : async Goal {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view daily goals");
    };
    { dailyGoal = dailyGoal; actual = dailyActual };
  };

  // PDF / Question Paper Upload
  public shared ({ caller }) func uploadPdf(id : Text, pdf : Blob) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can upload PDFs");
    };
    switch (chapters.get(id)) {
      case (?chapter) {
        chapters.add(id, { chapter with notesPdf = ?pdf });
      };
      case (null) {};
    };
  };

  public shared ({ caller }) func uploadQuestionPaper(paper : QuestionPaper) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can upload question papers");
    };
    let qp = getQuestionPapersMap();
    qp.add(paper.name, paper);
  };

  public query ({ caller }) func getQuestionPapers() : async [QuestionPaper] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view question papers");
    };
    let qp = getQuestionPapersMap();
    qp.values().toArray();
  };

  // Rewards
  public query ({ caller }) func getRewards() : async [Reward] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view rewards");
    };
    let r = getRewardsMap();
    r.values().toArray();
  };

  public shared ({ caller }) func addReward(reward : Reward) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add rewards");
    };
    let r = getRewardsMap();
    r.add(reward.id, reward);
  };

  // User Progress
  public query ({ caller }) func getUserProgress() : async UserProgress {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view progress");
    };
    userProgress;
  };

  public shared ({ caller }) func updateUserProgress(progress : UserProgress) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update progress");
    };
    userProgress := progress;
  };

  public query ({ caller }) func getXP() : async XPResponse {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view XP");
    };
    { xp = userProgress.xp; level = userProgress.level };
  };
};
