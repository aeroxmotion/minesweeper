import { setup } from 'https://cdn.jsdelivr.net/gh/LosMaquios/GalaxyJS@b1bf99b9134ae379415c77738a1c411bd304ef03/dist/galaxy.esm.js'

import MineSweeper from './elements/mine-sweeper.js'

setup({
  debug: false,

  elements: [
    MineSweeper
  ]
})
