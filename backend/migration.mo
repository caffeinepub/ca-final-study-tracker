import Map "mo:core/Map";
import Text "mo:core/Text";
import Time "mo:core/Time";

module {
  // Old domain types (should match with pre-migration actor)
  type OldSubject = {
    name : Text;
    totalTopics : Nat;
    completedTopics : Nat;
    targetCompletionDate : Time.Time;
  };

  type OldActor = {
    subjects : Map.Map<Text, OldSubject>;
  };

  // New domain types (should match with post-migration actor)
  type NewSubject = {
    name : Text;
    totalTopics : Nat;
    completedTopics : Nat;
    targetCompletionDate : Time.Time;
  };

  type NewActor = {
    subjects : Map.Map<Text, NewSubject>;
  };

  // The migration function called by the main actor
  public func run(old : OldActor) : NewActor {
    let newSubjects = old.subjects.map<Text, OldSubject, NewSubject>(
      func(_, oldSubject) {
        oldSubject;
      }
    );
    { subjects = newSubjects };
  };
};
