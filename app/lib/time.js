export const formatTime = (milliseconds) => {
  const hours = Math.floor(milliseconds / 3600000);
  const minutes = Math.floor((milliseconds % 3600000) / 60000);
  const seconds = ((milliseconds % 60000) / 1000).toFixed(0);

  return `${hours}:${minutes < 10 ? "0" : ""}${minutes}:${
    seconds < 10 ? "0" : ""
  }${seconds}`;
};

export function formatDateToIST(inputDate) {
  // Check if inputDate is a valid Date object
  const d = new Date(inputDate);
  if (!(d instanceof Date) || isNaN(d)) {
    return "Invalid Date";
  }

  var options = {
    timeZone: "Asia/Kolkata", // Set the time zone to Indian Standard Time (IST)
    hour12: false, // Use 24-hour format
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
  };

  return d.toLocaleString("en-IN", options);
}
