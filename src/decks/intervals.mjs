import {
  cartesian,
  isNoteGreaterOrEqThan,
  isNoteLessOrEqThan,
  interavlToStr,
  intervalDirectionToStr,
} from '../utils.mjs'
import _ from 'lodash'
import { Note } from '@tonaljs/tonal'

let NOTES = ['C', 'D', 'E', 'F', 'G', 'A', 'B']
NOTES = [...NOTES, ...NOTES.map(n => `${n}#`), ...NOTES.map(n => `${n}b`)]
NOTES = [
  ...NOTES.map(n => n + 3),
  ...NOTES.map(n => n + 4),
  ...NOTES.map(n => n + 5),
]

let INTERVALS = [
  // '1d',
  // '1P',
  // '1A',
  '2d',
  '2m',
  '2M',
  '2A',
  '3d',
  '3m',
  '3M',
  '3A',
  '4d',
  '4P',
  '4A',
  '5d',
  '5P',
  '5A',
  '6d',
  '6m',
  '6M',
  '6A',
  '7d',
  '7m',
  '7M',
  '7A',
  '8d',
  '8P',
  '8A',
]

INTERVALS = [...INTERVALS, ...INTERVALS.map(i => '-' + i)]

export const getIntervalsData = () => {
  const data = cartesian(NOTES, INTERVALS, ['treble', 'bass'])

  const filtered = data.filter(([note, interval, clef]) => {
    const otherNote = Note.transpose(note, interval)
    if (
      Math.abs(Note.get(note).alt) >= 2 ||
      Math.abs(Note.get(otherNote).alt) >= 2
    ) {
      return false
    }

    if (
      clef === 'treble' &&
      isNoteGreaterOrEqThan(note, 'A3') &&
      isNoteGreaterOrEqThan(otherNote, 'A3') &&
      isNoteLessOrEqThan(note, 'C5') &&
      isNoteLessOrEqThan(otherNote, 'C5')
    ) {
      return true
    }
    if (
      clef === 'bass' &&
      isNoteGreaterOrEqThan(note, 'C2') &&
      isNoteGreaterOrEqThan(otherNote, 'C2') &&
      isNoteLessOrEqThan(note, 'E4') &&
      isNoteLessOrEqThan(otherNote, 'E4')
    ) {
      return true
    }
    return false
  })

  return filtered
}
export const processIntervalsRecord = (
  [note, interval, clef],
  lilypondFile,
) => {
  console.log(`Note ${note} plus ${interval} in ${clef}`)

  const otherNote = Note.transpose(note, interval)
  const humanReadableInterval = interavlToStr(interval)
  const intervalDirection = intervalDirectionToStr(interval)
  const filename = lilypondFile.addIntervalWithNoteAndInterval(
    clef,
    note,
    interval,
  )

  return `${note}\t${otherNote}\t${interval}\t${humanReadableInterval}\t${intervalDirection}\t${clef}\t<img class="interval" src="${filename}" />`
}
