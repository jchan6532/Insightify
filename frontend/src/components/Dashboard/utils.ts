export const getAverage = (marks: number[]) => {
  let sum: number = 0;
  marks.forEach((mark) => {
    sum += mark;
  });
  if (marks.length === 0) return 0;
  const avg = sum / marks.length;
  return parseInt(String(avg));
};

export const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  if (minutes < 10 && remainingSeconds < 10)
    return `0${minutes} : 0${remainingSeconds}`;
  if (remainingSeconds < 10) return `${minutes} : 0${remainingSeconds}`;
  if (minutes < 10) return `0${minutes} : ${remainingSeconds}`;
  return `${minutes} : ${remainingSeconds}`;
};
