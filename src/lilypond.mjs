import { promisify } from 'util'
import { exec as exec_callback } from 'child_process'
import { writeFileSync } from 'fs'
import { join } from 'path'
import { Note } from '@tonaljs/tonal'

const exec = promisify(exec_callback)

const preludeLy = (width, height) => `
\\version "2.20.0"

#(set! paper-alist (cons '("my size" . (cons (* ${width} in) (* ${height} in))) paper-alist))

\\header {
  tagline = ##f  % removed
}

\\paper {
  #(set-paper-size "my size")
}
`

const keySignatureLy = (german, mode) => `
${preludeLy(1, 0.75)}

{
  \\override Staff.TimeSignature #'stencil = ##f

  \\key ${german} \\${mode}
  \\skip 1
  \\bar "|."
}
`

const intervalLy = (clef, german1, german2) => `
${preludeLy(1, 1)}

{
  \\clef ${clef}
  \\override Staff.TimeSignature #'stencil = ##f
  
  <  ${german1} ${german2} >1
}
`
const noteLy = (clef, noteDE) => `
${preludeLy(1, 1)}

{
  \\clef ${clef}
  \\override Staff.TimeSignature #'stencil = ##f
  
  <  ${noteDE} >1
}
`

const noteInKey = (clef, noteDE, tonicNoteDE, mode) => `
${preludeLy(2.5, 1)}

{
  \\clef ${clef}
  \\key ${tonicNoteDE} \\${mode}
  \\override Staff.TimeSignature #'stencil = ##f
  
  <  ${noteDE} >1
}
`

const fourNotesInGrandStaff = (tonicNoteDE, mode, notesDE) => `
${preludeLy(1.8, 1.5)}

{
  \\new GrandStaff <<
    \\new Staff {  
      \\override Staff.TimeSignature #'stencil = ##f 
      \\key ${tonicNoteDE} \\${mode}
      <${notesDE[3]} ${notesDE[2]}>1
    }
    \\new Staff {  
      \\override Staff.TimeSignature #'stencil = ##f 
      \\clef bass
      \\key ${tonicNoteDE} \\${mode}
      <${notesDE[1]}  ${notesDE[0]}>1
    }
  >>
       
 %\\bar "|."
}


`

const noteStrToGerman = note => {
  const n = Note.get(note)

  if (!n.letter) {
    throw new Error(`Can't process note ${note}`)
  }

  let german = n.letter.toLowerCase()
  if (n.alt === -2) {
    german += 'eses'
  }
  if (n.alt === -1) {
    german += 'es'
  }
  if (n.alt === 1) {
    german += 'is'
  }
  if (n.alt === 2) {
    german += 'isis'
  }

  if (n.oct >= 3) german += "'".repeat(n.oct - 3)
  else german += ','.repeat(Math.abs(n.oct - 3))

  return german
}

export class LilypondFile {
  constructor(filenamePrefix) {
    this.filenamePrefix = filenamePrefix
    this.counter = 0
    this.fileContent = ''
  }

  addSvg(lilypondCode) {
    this.fileContent += '\\book {\n'
    this.fileContent += lilypondCode
    this.fileContent += '}\n\n'

    let filename = this.filenamePrefix
    if (this.counter > 0) {
      filename += '-' + this.counter
    }
    filename += '.svg'

    this.counter++

    return filename
  }

  addKeySignature(note, mode) {
    return this.addSvg(keySignatureLy(noteStrToGerman(note), mode))
  }

  addNote(clef, note) {
    return this.addSvg(noteLy(clef, noteStrToGerman(note)))
  }

  addNoteInKey(clef, note, tonicNote, mode) {
    return this.addSvg(
      noteInKey(clef, noteStrToGerman(note), noteStrToGerman(tonicNote), mode),
    )
  }

  addIntervalWithTwoNotes(clef, note1, note2) {
    return this.addSvg(
      intervalLy(clef, noteStrToGerman(note1), noteStrToGerman(note2)),
    )
  }

  addIntervalWithNoteAndInterval(clef, note, interval) {
    return this.addIntervalWithTwoNotes(
      clef,
      note,
      Note.transpose(note, interval),
    )
  }

  addFourNotesInGrandStaff(keyTonic, mode, notes) {
    // console.log(keyTonic, notes)
    const keyTonicDE = noteStrToGerman(keyTonic)

    return this.addSvg(
      fourNotesInGrandStaff(keyTonicDE, mode, notes.map(noteStrToGerman)),
    )
  }

  async createFiles() {
    console.log(`${this.counter} files`)
    const tmpFilename = Math.random().toFixed(10).slice(2) + '.ly'
    writeFileSync(join('tmp', tmpFilename), this.fileContent, {
      encoding: 'utf8',
    })

    await exec(
      `lilypond -fsvg -dbackend=svg -o out/media/${this.filenamePrefix} tmp/${tmpFilename}`,
    )
  }
}
