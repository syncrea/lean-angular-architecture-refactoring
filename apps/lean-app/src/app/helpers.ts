export const generateRandomId = (length = 10): string =>
  Math.random()
    .toString(36)
    .substring(2, 2 + length);
