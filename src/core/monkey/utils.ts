export function isLetter(ch: string) {
  return ('a' <= ch && ch <= 'z') ||
        ('A' <= ch && ch <= 'Z') ||
        (ch === '_');
}

export function isDigit(ch: string) {
  return '0' <= ch && ch <= '9';
}