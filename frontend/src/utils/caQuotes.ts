export const caQuotes: string[] = [
  "The late nights you put in today are the success story you'll tell tomorrow. Keep going — Your Future CA Self",
  "Every practice problem you solve now is a client you'll confidently serve later. Trust the process — Your Future CA Self",
  "The discipline you build during articles becomes the excellence you deliver as a CA. You're building character — Your Future CA Self",
  "I know it feels endless right now, but I promise — the day you sign your first audit report makes every sleepless night worth it — Your Future CA Self",
  "You are not just studying for an exam. You are building the foundation of a career that will change lives — Your Future CA Self",
  "The concepts you're struggling with today will become your expertise tomorrow. Don't give up — Your Future CA Self",
  "Every mock test you attempt, every revision you do — it's all compounding into the CA you're becoming — Your Future CA Self",
  "I remember sitting exactly where you are, doubting everything. But you make it. I am proof — Your Future CA Self",
  "The CA Final is not just a test of knowledge — it's a test of character. You have both — Your Future CA Self",
  "When you feel like quitting, remember why you started. That dream is still valid — Your Future CA Self",
  "Your consistency today is your competitive advantage tomorrow. Keep showing up — Your Future CA Self",
  "The standards you set for yourself now will define the professional you become. Aim high — Your Future CA Self",
  "Every hour of focused study is an investment that pays dividends for your entire career — Your Future CA Self",
  "You are closer than you think. The finish line is just beyond the next revision — Your Future CA Self",
  "The CA designation is not given — it is earned. And you are earning it, one chapter at a time — Your Future CA Self",
  "Difficult roads lead to beautiful destinations. Your CA journey is proof of that — Your Future CA Self",
  "The pressure you feel right now is shaping you into someone extraordinary — Your Future CA Self",
  "I look back at your dedication and feel immense pride. You never stopped, even when it was hard — Your Future CA Self",
  "Your future clients, your future team, your future self — they are all counting on the work you do today — Your Future CA Self",
  "Success in CA Final is not about being the smartest in the room. It's about being the most consistent — Your Future CA Self",
  "Every subject you master is a weapon in your professional arsenal. Keep sharpening — Your Future CA Self",
  "The sacrifices you make today are the stories you'll share with pride at your convocation — Your Future CA Self",
  "You chose the hardest path because you knew you were capable of the greatest reward — Your Future CA Self",
  "On the days you feel lost, remember: every CA you admire once sat exactly where you sit now — Your Future CA Self",
  "Your dedication to excellence today is what separates good from great. You are great — Your Future CA Self",
];

export function getRandomQuote(): string {
  const index = Math.floor(Math.random() * caQuotes.length);
  return caQuotes[index];
}

export function getRandomQuoteExcluding(current: string): string {
  if (caQuotes.length <= 1) return caQuotes[0];
  let quote = current;
  while (quote === current) {
    quote = caQuotes[Math.floor(Math.random() * caQuotes.length)];
  }
  return quote;
}
