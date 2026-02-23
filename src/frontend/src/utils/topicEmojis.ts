const emojiList = [
  '📚', '📝', '🎯', '✨', '💡', '🔥', '🌟', '🚀', 
  '⚡', '🎓', '📖', '✏️', '🧠', '💪', '🏆', '🎨',
  '🔬', '📊', '💼', '📈', '🎪', '🌈', '🎭', '🎬'
];

export function getTopicEmoji(topicName: string): string {
  // Generate a consistent emoji based on the topic name
  const hash = topicName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return emojiList[hash % emojiList.length];
}
