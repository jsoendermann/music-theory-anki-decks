import { emptyDirSync } from 'fs-extra'

import {
  getKeySignaturesData,
  processKeySignaturesRecord,
} from './decks/keySignatures.mjs'
import { getIntervalsData, processIntervalsRecord } from './decks/intervals.mjs'
import {
  getNaturalInKeyData,
  processNaturalInKeyRecord,
} from './decks/naturalInKey.mjs'
import { writeDeck } from './writeDeck.mjs'

await emptyDirSync('./tmp')
await emptyDirSync('./out/media')

// await writeDeck(
//   getKeySignaturesData,
//   processKeySignaturesRecord,
//   'key-signatures-deck',
// )

// await writeDeck(getIntervalsData, processIntervalsRecord, 'intervals')

await writeDeck(
  getNaturalInKeyData,
  processNaturalInKeyRecord,
  'natural-in-key',
)
