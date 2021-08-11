import { Note, Key } from '@tonaljs/tonal'
import { getNaturalNoteInKey } from '../utils.mjs'

import { cartesian, isNoteGreaterOrEqThan } from '../utils.mjs'

let NOTES = ['C', 'D', 'E', 'F', 'G', 'A', 'B']
NOTES = [
  ...NOTES.map(n => n + 2),
  ...NOTES.map(n => n + 3),
  ...NOTES.map(n => n + 4),
  ...NOTES.map(n => n + 5),
]

const MAJOR_TONICS = [
  ...[1, 2, 3, 4, 5, 6, 7].map(n => Note.transposeFifths('C', n)),
  ...[-1, -2, -3, -4, -5, -6, -7].map(n => Note.transposeFifths('C', n)),
]
const MINOR_TONICS = MAJOR_TONICS.map(n => Note.transpose(n, '-3m'))

export const getNaturalInKeyData = () =>
  cartesian(NOTES, [
    ...MAJOR_TONICS.map(t => [t, 'major']),
    ...MINOR_TONICS.map(t => [t, 'minor']),
  ])

export const processNaturalInKeyRecord = (
  [natural, tonicNote, mode],
  lilypondFile,
) => {
  console.log(`${natural} in ${tonicNote} ${mode}`)

  const clef = isNoteGreaterOrEqThan(natural, 'C4') ? 'treble' : 'bass'
  const noteInKey = getNaturalNoteInKey(natural, tonicNote, mode)

  const imageWithoutKey = lilypondFile.addNote(clef, natural)
  const imageWithKey = lilypondFile.addNoteInKey(
    clef,
    noteInKey,
    tonicNote,
    mode,
  )

  return `${natural}\t${tonicNote}\t${mode}\t${noteInKey}\t<img src="${imageWithoutKey}" />\t<img src="${imageWithKey}" />`
}
