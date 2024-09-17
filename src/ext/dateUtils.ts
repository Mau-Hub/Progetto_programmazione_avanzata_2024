export const isValidISODate = (dateStr: string): boolean => {
  // Controlla se la stringa corrisponde al formato ISO 8601
  const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/;
  return isoDateRegex.test(dateStr) && !isNaN(Date.parse(dateStr));
};
