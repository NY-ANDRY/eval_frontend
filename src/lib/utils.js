export const formatDateFr = (str) => {
  return new Date(str).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const formatDateTimeFr = (str) => {
  return new Date(str).toLocaleString("fr-FR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

export const formatDate = (str) => {
  let result = new Date(str).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  return result.replace(/\//g, "-");
};

export const datePicktoDateTime = (datePickerValue) => {
  return new Date(datePickerValue).toISOString().slice(0, 19);
};

export const datePicktoDate = (datePickerValue) => {
  const y = datePickerValue.getFullYear();
  const m = String(datePickerValue.getMonth() + 1).padStart(2, "0");
  const d = String(datePickerValue.getDate()).padStart(2, "0");

  return `${y}-${m}-${d}`;
};
