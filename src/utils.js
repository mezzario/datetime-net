export function isUpperCase(ch) {
  return isAlphaChar(ch) && ch.toUpperCase() === ch
}

export function isAlphaChar(ch) {
  return ch.toLowerCase() !== ch.toUpperCase()
}
