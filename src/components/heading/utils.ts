export function getGreetingText(username: string): string {
  const date = new Date();
  const hour = date.getHours();
  let greetingText: string;

  if (hour >= 5 && hour < 12) {
    greetingText = `Good Morning, ${username}! 🌅`;
  } else if (hour >= 12 && hour < 17) {
    greetingText = `Good Afternoon, ${username}! 🌞`;
  } else if (hour >= 17 && hour < 21) {
    greetingText = `Good Evening, ${username}! 🌇`;
  } else {
    greetingText = `Good Night, ${username}! 🌙`;
  }

  return greetingText;
}
