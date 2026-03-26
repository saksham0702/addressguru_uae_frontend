export const formatDateTime = (dateString, timeString) => {
  if (!dateString) return "";

  const date = new Date(dateString);

  const formattedDate = date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const formattedTime =
    timeString ||
    date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

  return `${formattedDate}${formattedTime ? ` · ${formattedTime}` : ""}`;
};
