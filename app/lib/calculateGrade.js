export function calculateGrade(studentPoints, totalPoints, totalQuestions) {
  if (totalPoints === 0 || totalQuestions === 0) {
    return "N/A";
  }

  const percentage = (studentPoints * 100) / totalQuestions;
  console.log(percentage);

  if (percentage >= 90) {
    return "A";
  } else if (percentage >= 80) {
    return "B";
  } else if (percentage >= 70) {
    return "C";
  } else if (percentage >= 60) {
    return "D";
  } else {
    return "F";
  }
}
