import Map "mo:core/Map";
import Text "mo:core/Text";
import Time "mo:core/Time";
import List "mo:core/List";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import MixinStorage "blob-storage/Mixin";

actor {
  include MixinStorage();

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

  public query ({ caller }) func getTodayGoal() : async Goal {
    { dailyGoal; actual = dailyActual };
  };

  public query ({ caller }) func getSubjects() : async [Subject] {
    subjects.values().toArray().sort();
  };

  public query ({ caller }) func getStudySessions() : async [StudySession] {
    studySessions.toArray();
  };

  public query ({ caller }) func getTests() : async [Test] {
    let completedTestsArray = completedTests.values().toArray();
    let nonCompletedTestsArray = nonCompletedTests.values().toArray();
    nonCompletedTestsArray.concat(completedTestsArray);
  };

  public query ({ caller }) func getRevisionSchedule() : async [RevisionTopic] {
    revisionTopics.toArray();
  };

  public shared ({ caller }) func addSubject(name : Text, totalTopics : Nat, targetDate : Time.Time) : async () {
    if (subjects.containsKey(name)) { Runtime.trap("Subject already exists") };
    let newSubject : Subject = {
      name;
      totalTopics;
      completedTopics = 0;
      targetCompletionDate = targetDate;
    };
    subjects.add(name, newSubject);
  };

  public shared ({ caller }) func updateCompletedTopics(subjectName : Text, completed : Nat) : async () {
    switch (subjects.get(subjectName)) {
      case (null) { Runtime.trap("Subject not found") };
      case (?subject) {
        if (completed > subject.totalTopics) {
          Runtime.trap("Completed topics cannot exceed total topics");
        };
        let updatedSubject = {
          subject with
          completedTopics = completed;
        };
        subjects.add(subjectName, updatedSubject);
      };
    };
  };

  public shared ({ caller }) func addChapter(subjectName : Text, chapterName : Text, totalTopics : Nat) : async () {
    switch (subjects.get(subjectName)) {
      case (null) { Runtime.trap("Subject not found") };
      case (?_) {
        let newChapter : Chapter = {
          name = chapterName;
          subjectName;
          totalTopics;
          completedTopics = 0;
          notesPdf = null;
        };
        chapters.add(chapterName, newChapter);
      };
    };
  };

  public query ({ caller }) func getChaptersBySubject(subjectName : Text) : async [Chapter] {
    let filteredChapters = chapters.filter(
      func(_chapterName, chapter) {
        chapter.subjectName == subjectName;
      }
    );
    filteredChapters.values().toArray();
  };

  public query ({ caller }) func getAllChapters() : async [Chapter] {
    chapters.values().toArray();
  };

  public shared ({ caller }) func updateChapterTopics(chapterName : Text, completed : Nat) : async () {
    switch (chapters.get(chapterName)) {
      case (null) { Runtime.trap("Chapter not found") };
      case (?chapter) {
        if (completed > chapter.totalTopics) {
          Runtime.trap("Completed topics cannot exceed total topics");
        };
        let updatedChapter = {
          chapter with
          completedTopics = completed;
        };
        chapters.add(chapterName, updatedChapter);
      };
    };
  };

  public shared ({ caller }) func addStudySession(date : Time.Time, subject : Text, hours : Nat, topics : Text) : async () {
    let session : StudySession = {
      date;
      subject;
      hoursStudied = hours;
      topicsCovered = topics;
    };
    studySessions.add(session);
  };

  public shared ({ caller }) func addTest(name : Text, subject : Text, date : Time.Time, totalMarks : Nat, chapters : [Text]) : async () {
    switch (subjects.get(subject)) {
      case (null) { Runtime.trap("Subject not found") };
      case (?_) {
        let test : Test = {
          name;
          subject;
          date;
          totalMarks;
          scoredMarks = null;
          chapters;
          isCompleted = false;
        };
        nonCompletedTests.add(name, test);
      };
    };
  };

  public shared ({ caller }) func updateTestScore(name : Text, scoredMarks : Nat) : async () {
    switch (nonCompletedTests.get(name)) {
      case (null) {
        switch (completedTests.get(name)) {
          case (null) {
            Runtime.trap("Test not found");
          };
          case (?_) { Runtime.trap("Test already has score") };
        };
      };
      case (?test) {
        if (scoredMarks > test.totalMarks) {
          Runtime.trap("Scored marks cannot exceed total marks");
        };
        let updatedTest = {
          test with
          scoredMarks = ?scoredMarks;
          isCompleted = true;
        };
        nonCompletedTests.remove(name);
        completedTests.add(name, updatedTest);
      };
    };
  };

  public shared ({ caller }) func addRevisionTopic(subject : Text, topic : Text, scheduledDate : Time.Time) : async () {
    let revision : RevisionTopic = {
      subject;
      topic;
      scheduledDate;
      isComplete = false;
    };
    revisionTopics.add(revision);
  };

  public shared ({ caller }) func markRevisionComplete(subject : Text, topic : Text) : async () {
    for ((index, revision) in revisionTopics.enumerate()) {
      if (revision.subject == subject and revision.topic == topic) {
        let updatedRevision = {
          revision with
          isComplete = true;
        };
        revisionTopics.put(index, updatedRevision);
        return;
      };
    };
    Runtime.trap("Revision topic not found");
  };

  public shared ({ caller }) func setTodayGoal(goal : Nat) : async () {
    dailyGoal := goal;
    dailyActual := 0;
  };

  public shared ({ caller }) func incrementTodayGoal() : async () {
    if (hasGoal()) {
      let nextActual = dailyActual + 1;
      dailyActual := nextActual;
      if (dailyActual > dailyGoal) {
        dailyGoal := 0;
        dailyActual := 0;
      };
    } else {
      Runtime.trap("Today's goal not set or already completed");
    };
  };

  public shared ({ caller }) func uploadPdf(file : Blob, chapterName : Text) : async () {
    switch (chapters.get(chapterName)) {
      case (null) { Runtime.trap("Chapter not found") };
      case (?chapter) {
        let updatedChapter = {
          chapter with
          notesPdf = ?file;
        };
        chapters.add(chapterName, updatedChapter);
      };
    };
  };

  public query ({ caller }) func getPdfPath(chapterName : Text) : async ?Blob {
    switch (chapters.get(chapterName)) {
      case (null) { null };
      case (?chapter) { chapter.notesPdf };
    };
  };

  public query ({ caller }) func getPdfBlobs(chapterName : Text) : async ?Blob {
    switch (chapters.get(chapterName)) {
      case (null) { null };
      case (?chapter) { chapter.notesPdf };
    };
  };

  public query ({ caller }) func getRevisionSuggestions() : async [Text] {
    let nonCompleteRevisions = revisionTopics.filter(func(revision) { not revision.isComplete });
    if (nonCompleteRevisions.isEmpty()) { return [] };

    // Build the suggestions array directly with the correct values
    let nonCompleteRevisionsArray = nonCompleteRevisions.toArray();
    let len = nonCompleteRevisionsArray.size();

    Array.tabulate<Text>(
      3,
      func(i) { if (i < len) { nonCompleteRevisionsArray[i].topic } else { "" } },
    );
  };

  public query ({ caller }) func getPendingTests() : async [Test] {
    nonCompletedTests.values().toArray();
  };

  public query ({ caller }) func getCompletedTests() : async [Test] {
    completedTests.values().toArray();
  };

  func markTestCompleted(testName : Text) {
    switch (nonCompletedTests.get(testName)) {
      case (null) {
        Runtime.trap("There is no test with this name.");
      };
      case (?test) {
        nonCompletedTests.remove(testName);
        completedTests.add(testName, test);
      };
    };
  };

  public shared ({ caller }) func deleteSubject(subjectName : Text) : async () {
    if (not subjects.containsKey(subjectName)) {
      Runtime.trap("Subject not found");
    };

    let filteredChapters = chapters.filter(
      func(_chapterName, chapter) { chapter.subjectName == subjectName }
    );

    for ((chapterName, chapter) in filteredChapters.entries()) {
      archivedChapters.add(chapterName, chapter);
    };

    for ((chapterName, _) in filteredChapters.entries()) {
      chapters.remove(chapterName);
    };

    subjects.remove(subjectName);
  };

  public query ({ caller }) func getArchivedChapters() : async [Chapter] {
    archivedChapters.values().toArray();
  };

  func hasGoal() : Bool {
    dailyGoal > 0 and dailyActual < dailyGoal;
  };

  public query ({ caller }) func getSuggestedSubjects() : async [Text] {
    let currentTime = Time.now();
    let sortedSubjects = subjects.values().toArray();

    let sortedByUrgency = sortedSubjects.sort(
      func(a, b) {
        if (a.completedTopics < b.completedTopics) {
          #less;
        } else if (a.completedTopics > b.completedTopics) {
          #greater;
        } else {
          if (a.targetCompletionDate < b.targetCompletionDate) {
            #less;
          } else if (a.targetCompletionDate > b.targetCompletionDate) {
            #greater;
          } else {
            #equal;
          };
        };
      }
    );

    let filteredByDeadline = sortedByUrgency.filter(
      func(subject) {
        let daysDiff = (subject.targetCompletionDate - currentTime) / (24 * 3600 * 1_000_000_000);
        daysDiff <= 20;
      }
    );

    let suggestionSize = if (filteredByDeadline.size() >= 3) { 3 } else {
      filteredByDeadline.size();
    };
    filteredByDeadline.sliceToArray(0, suggestionSize).map(
      func(subject) { subject.name }
    );
  };

  public shared ({ caller }) func saveSessionSummary(sessionId : Text, summaryText : Text) : async () {
    let summary : SessionSummary = {
      content = summaryText;
    };
    sessionSummaries.add(sessionId, summary);
  };

  public query ({ caller }) func getSessionSummaries() : async [Text] {
    sessionSummaries.values().toArray().map(func(s) { s.content });
  };
};
