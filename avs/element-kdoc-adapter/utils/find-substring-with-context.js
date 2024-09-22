function findSubstringWithContext(str, substring, n) {
  const index = str.indexOf(substring);
  if (index === -1) {
    return null; // Подстрока не найдена
  }

  const start = Math.max(0, index - n);
  const end = Math.min(str.length, index + substring.length + n);
  return str.slice(start, end);
}

module.exports = findSubstringWithContext;