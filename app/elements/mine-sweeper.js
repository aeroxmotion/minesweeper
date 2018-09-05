import { GalaxyElement, html, css } from 'https://cdn.jsdelivr.net/gh/LosMaquios/GalaxyJS@b1bf99b9134ae379415c77738a1c411bd304ef03/dist/galaxy.esm.js'

import { VALUES } from '../constants.js'

const UNIT_REGEX = /^(?<size>[-.\d]+)(?<unit>[a-zA-Z]+)$/

export default class MineSweeper extends GalaxyElement {

  static get style () {
    return css`
      :host {
        display: flex;
        flex-wrap: wrap;

        --cell-size: 20px;

        --border-size: 2px;
        --border-color-dark: #7b7b7b;
        --border-color-light: #fff;
        --background-color: #bdbdbd;

        --border-dark: var(--border-size) solid var(--border-color-dark);
        --border-light: var(--border-size) solid var(--border-color-light);
      }

      .cell {
        border-top: var(--border-light);
        border-left: var(--border-light);
        border-right: var(--border-dark);
        border-bottom: var(--border-dark);

        background-color: var(--background-color);

        font-size: calc(var(--cell-size) - 5px);
        text-align: center;
        width: var(--cell-size);
        height: var(--cell-size);
        line-height: var(--cell-size);

        box-sizing: border-box;
        user-select: none;
      }

      .cell.revealed,
      .cell:not(.flag):active {
        border: none;
      }
    `
  }

  static get template () {
    return html`
      <div class="cell"
        *for="cell in board"
        :class="{ revealed: cell.reveal, flag: cell.flag }"
        @click="!(cell.reveal || cell.flag) && checkCell($index, cell)"
        @contextmenu.prevent="!cell.reveal && checkBomb(cell)">
        {{ cell | getEmoji }}
      </div>
    `
  }

  constructor () {
    super()

    this.width = 30
    this.height = 16

    this.state = {
      board: this._getBoard()
    }

    const { groups } = UNIT_REGEX.exec(getComputedStyle(this).getPropertyValue('--cell-size').trim())

    this.attributeStyleMap.set('width', CSS[groups.unit](groups.size * this.width))
  }

  _getAdjacents (index) {

    // Get internal offset
    const offset = this.width

    // Offset incremented
    const iOffset = offset + 1

    // Offset decremented
    const dOffset = offset - 1

    // Center
    const adjacents = [-offset, offset]

    const mod = index % offset

    // Left
    mod !== 0 && adjacents.push(-iOffset, -1, dOffset)

    // Right
    mod !== dOffset && adjacents.push(-dOffset, 1, iOffset)

    return adjacents
  }

  _getBoard () {
    const length = this.width * this.height
    const board = new Array(length)
    const bombs = 99

    // 1. Fill with bombs
    for (let i = 0; i < length; i++) {
      board[i] = {
        value: i < bombs ? VALUES.BOMB : VALUES.EMPTY,
        reveal: false,
        flag: false
      }
    }

    // 2. Randomly scramble the bombs
    board.sort(() => Math.random() > .5 ? 1 : -1)

    // 3. Add indicators
    for (let i = 0; i < length; i++) {
      const cell = board[i]

      if (cell.value === VALUES.BOMB) {
        for (const offset of this._getAdjacents(i)) {
          const adjacent = board[offset + i]

          if (adjacent && adjacent.value !== VALUES.BOMB) {
            ++adjacent.value
          }
        }
      }
    }

    return board
  }

  _revealAdjacents (index) {
    for (const offset of this._getAdjacents(index)) {
      const adjacentIndex = offset + index
      const adjacent = this.state.board[adjacentIndex]

      if (adjacent && !adjacent.reveal) {
        adjacent.reveal = true

        if (adjacent.value === VALUES.EMPTY) {
          this._revealAdjacents(adjacentIndex)
        }
      }
    }
  }

  checkCell (index, cell) {
    cell.reveal = true

    switch (cell.value) {
      case VALUES.EMPTY:
        this._revealAdjacents(index)
        break

      case VALUES.BOMB:
        this.state.board.forEach(cell => {
          if (cell.value === VALUES.BOMB) {
            cell.reveal = true
          }
        })
        break
    }
  }

  checkBomb (cell) {
    cell.flag = !cell.flag
  }
}
