export const generateUID = (length = 10): string => {
  const characters =
    "AaBb012CcDd345EeFf678GgHh901IiJj234KkLl568MmNn901OoPp234QqRr567SsTt890UuVv123WwXx456YyZz789";
  let uid = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    uid += characters.charAt(randomIndex);
  }

  return uid;
};

/**
 * Second to HH:MM:SS
 *
 * @param {number} seconds
 * @returns {string}
 */
export const secondsToHMS = (seconds: number): string => {
  const hours: number = Math.floor(seconds / 3600);
  const minutes: number = Math.floor((seconds % 3600) / 60);
  const remainingSeconds: number = seconds % 60;

  const formattedHours: string = String(hours).padStart(2, "0");
  const formattedMinutes: string = String(minutes).padStart(2, "0");
  const formattedSeconds: string = String(remainingSeconds).padStart(2, "0");

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
};
