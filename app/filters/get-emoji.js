import { VALUES, EMOJIS } from '../constants.js'

export function getEmoji (cell) {
  if (!cell.reveal && cell.flag) return EMOJIS.FLAG

  if (cell.reveal && cell.value !== VALUES.EMPTY) {
    return cell.value === VALUES.BOMB
      ? EMOJIS.BOMB
      : getNumberUnicode(cell.value)
  }
}

function getNumberUnicode (number) {
  return String.fromCodePoint(EMOJIS.ONE.codePointAt(0) + (number - 1)) + EMOJIS.ONE.slice(1)
}
