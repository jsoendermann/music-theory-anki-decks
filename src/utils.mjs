import { Note, Interval, Key } from '@tonaljs/tonal'
import _ from 'lodash'

export const intervalToStrWithoutQuality = interval => {
  const i = Interval.get(interval)

  switch (Math.abs(i.num)) {
    case 1:
      return 'unison'
    case 2:
      return 'second'
    case 3:
      return 'third'
    case 4:
      return 'fourth'
    case 5:
      return 'fifth'
    case 6:
      return 'sixth'
    case 7:
      return 'seventh'
    case 8:
      return 'octave'
  }
}

export const interavlToStr = interval => {
  const i = Interval.get(interval)

  let out = ''

  switch (i.q) {
    case 'd':
      out += 'diminished'
      break
    case 'm':
      out += 'minor'
      break
    case 'P':
      out += 'perfect'
      break
    case 'M':
      out += 'major'
      break
    case 'A':
      out += 'augmented'
      break
  }

  out += ' '

  out += intervalToStrWithoutQuality(interval)

  return out
}

export const intervalDirectionToStr = interval => {
  const i = Interval.get(interval)

  if (i.dir === 1) return 'up'
  if (i.dir === -1) return 'down'

  throw new Error('Interval ' + interval)
}

let f = (a, b) => [].concat(...a.map(a => b.map(b => [].concat(a, b))))
export let cartesian = (a, b, ...c) => (b ? cartesian(f(a, b), ...c) : a)

export const isNoteGreaterOrEqThan = (n1, n2) =>
  Note.sortedNames([n1, n2])[0] === n2
export const isNoteLessOrEqThan = (n1, n2) =>
  Note.sortedNames([n1, n2])[0] === n1

export const getNaturalNoteInKey = (natural, tonicNote, mode) => {
  let scale
  if (mode === 'major') {
    scale = Key.majorKey(tonicNote).scale
  } else if (mode === 'minor') {
    scale = Key.minorKey(tonicNote).natural.scale
  } else {
    throw new Error(mode)
  }

  const n = Note.get(natural)
  const pitchClass = n.pc
  if (scale.includes(pitchClass)) return natural
  if (scale.includes(pitchClass + '#')) return pitchClass + '#' + n.oct
  if (scale.includes(pitchClass + 'b')) return pitchClass + 'b' + n.oct
  throw new Error(
    `${scale} doesn't include ${pitchClass} for ${tonicNote} ${mode}`,
  )
}

export const getNotesInTriad = (root, thirds) => {
  return [
    root,
    Note.transpose(root, thirds[0]),
    Note.transpose(Note.transpose(root, thirds[0]), thirds[1]),
  ]
}

export const take = (gen, num) => {
  const arr = []
  for (let i = 0; i < num; i++) {
    const { done, value } = gen.next()
    if (done) {
      return arr
    }
    arr.push(value)
  }
  return arr
}

export const getNotesInPitchClassBetween = (pc, inclLow, inclHigh) => {
  return [1, 2, 3, 4, 5, 6, 7]
    .map(oct => pc + oct)
    .filter(note => isNoteGreaterOrEqThan(note, inclLow))
    .filter(note => isNoteLessOrEqThan(note, inclHigh))
}

export const getRandomNoteInPitchClassBetween = (pc, inclLow, inclHigh) =>
  _.sample(getNotesInPitchClassBetween(pc, inclLow, inclHigh))

export const numToRoman = num => {
  switch (num) {
    case 1:
      return 'i'
    case 2:
      return 'ii'
    case 3:
      return 'iii'
    case 4:
      return 'iv'
    case 5:
      return 'v'
    case 6:
      return 'vi'
    case 7:
      return 'vii'
    default:
      throw new Error(`Can't convert ${num} to roman`)
  }
}

export const triadToRomanHTML = (scaleDegree, quality, position) => {
  if (quality === 'AUGMENTED') {
    throw new Error('Augmented triad')
  }
  let html =
    '<div style="display:flex;align-items: center;font-family: monospace;"><span style="font-size: 190%; margin-right: 6px;">'

  let num = numToRoman(scaleDegree)

  if (quality === 'MAJOR') {
    num = num.toLocaleUpperCase()
  }
  html += num

  if (quality === 'DIMINISHED') {
    html += '<sup>o</sup>'
  }

  html += '</span>'

  if (position !== 'ROOT_POSITION') {
    html +=
      '<div style="display: flex; flex-direction: column;"><span>6</span><span>'

    if (position === 'SECOND_INVERSION') {
      html += '4'
    } else {
      html += '&nbsp;'
    }

    html += '</span></div>'
  }

  html += '</div>'

  return html
}
