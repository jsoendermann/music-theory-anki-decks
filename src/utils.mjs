import { Note, Interval, Key } from '@tonaljs/tonal'

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

  switch (Math.abs(i.num)) {
    case 1:
      out += 'unison'
      break
    case 2:
      out += 'second'
      break
    case 3:
      out += 'third'
      break
    case 4:
      out += 'fourth'
      break
    case 5:
      out += 'fifth'
      break
    case 6:
      out += 'sixth'
      break
    case 7:
      out += 'seventh'
      break
    case 8:
      out += 'octave'
      break
  }

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
