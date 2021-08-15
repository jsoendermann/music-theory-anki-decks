import { Note, Key, Chord } from '@tonaljs/tonal'
import _ from 'lodash'

import {
  triadToRomanHTML,
  getNotesInTriad,
  take,
  getRandomNoteInPitchClassBetween,
} from '../utils.mjs'

const TRIAD_QUALITIES = {
  DIMINISHED: ['3m', '3m'],
  MINOR: ['3m', '3M'],
  MAJOR: ['3M', '3m'],
  AUGMENTED: ['3M', '3M'],
}

const TRIADS = {
  MAJOR_KEY: [
    'MAJOR',
    'MINOR',
    'MINOR',
    'MAJOR',
    'MAJOR',
    'MINOR',
    'DIMINISHED',
  ],
  MINOR_KEY: [
    'MINOR',
    'DIMINISHED',
    'MAJOR',
    'MINOR',
    'MAJOR',
    'MAJOR',
    'DIMINISHED',
  ],
}

const TRIAD_POSITIONS = {
  ROOT_POSITION: null,
  FIRST_INVERSION: null,
  SECOND_INVERSION: null,
}

const MAJOR_KEY_TONICS = [
  ...[0, 0, 1, 1, 2, 2, 3, 3, 4, 5, 6].map(n => Note.transposeFifths('C', n)),
  ...[-1, -1, -2, -2, -3, -4, -5, -6].map(n => Note.transposeFifths('C', n)),
]

function* generateChords() {
  while (true) {
    const keyMajorTonic = _.sample(MAJOR_KEY_TONICS)
    const mode = _.sample(['MAJOR', 'MINOR'])
    const keyTonic =
      mode === 'MAJOR' ? keyMajorTonic : Note.transpose(keyMajorTonic, '-3m')

    const scaleDegree = _.sample([1, 2, 3, 4, 5, 6, 7])
    let scale
    if (mode === 'MAJOR') {
      scale = Key.majorKey(keyTonic).scale
    } else if (mode === 'MINOR') {
      scale = Key.minorKey(keyTonic).harmonic.scale
    } else {
      throw new Error(mode)
    }

    const root = scale[scaleDegree - 1]
    const quality = TRIADS[`${mode}_KEY`][scaleDegree - 1]
    const position = _.sample(Object.keys(TRIAD_POSITIONS))

    const triadPitchClasses = getNotesInTriad(root, TRIAD_QUALITIES[quality])

    let bassPitchClass =
      triadPitchClasses[Object.keys(TRIAD_POSITIONS).indexOf(position)]
    const remainingPitchClasses = triadPitchClasses.filter(
      n => n !== bassPitchClass,
    )

    if (position === 'ROOT_POSITION' || position === 'SECOND_INVERSION') {
      remainingPitchClasses.push(bassPitchClass)
    } else {
      remainingPitchClasses.push(_.sample(triadPitchClasses))
    }

    const [tenorPitchClass, altoPitchClass, sopranoPitchClass] =
      remainingPitchClasses

    const leadingTonePitchClass = scale[scale.length - 1]
    if (
      [
        bassPitchClass,
        tenorPitchClass,
        altoPitchClass,
        sopranoPitchClass,
      ].filter(pc => pc === leadingTonePitchClass).length > 1
    ) {
      console.log('Doubled leading tone. Skipping...')
      continue
    }

    const bassNote = getRandomNoteInPitchClassBetween(
      bassPitchClass,
      'C2',
      'E3',
    )
    const tenorNote = getRandomNoteInPitchClassBetween(
      tenorPitchClass,
      'F3',
      'F4',
    )
    const altoNote = getRandomNoteInPitchClassBetween(
      altoPitchClass,
      Note.transpose(tenorNote, '2m'),
      Note.transpose(tenorNote, '8P'),
    )
    const sopranoNote = getRandomNoteInPitchClassBetween(
      sopranoPitchClass,
      Note.transpose(altoNote, '2m'),
      Note.transpose(altoNote, '8P'),
    )

    yield {
      keyTonic,
      mode: mode.toLocaleLowerCase(),
      scaleDegree,
      triadPitchClasses,
      quality,
      position,
      bassPitchClass,
      tenorPitchClass,
      altoPitchClass,
      sopranoPitchClass,
      bassNote,
      tenorNote,
      altoNote,
      sopranoNote,
    }
  }
}

export const getChordsData = () => take(generateChords(), 50)

export const processChordsRecord = (record, lilypondFile) => {
  console.log(`${JSON.stringify(record, null, 2)}`)

  const image = lilypondFile.addFourNotesInGrandStaff(
    record.keyTonic,
    record.mode,
    [record.bassNote, record.tenorNote, record.altoNote, record.sopranoNote],
  )

  return [
    record.keyTonic,
    record.mode,
    triadToRomanHTML(record.scaleDegree, record.quality, record.position),
    image,
  ].join('\t')

  // const imageWithoutKey = lilypondFile.addNote(clef, natural)
  // const imageWithKey = lilypondFile.addNoteInKey(
  //   clef,
  //   noteInKey,
  //   tonicNote,
  //   mode,
  // )

  // return `${natural}\t${tonicNote}\t${mode}\t${noteInKey}\t<img src="${imageWithoutKey}" />\t<img src="${imageWithKey}" />`
}
