import { writeFileSync } from 'fs'

import { LilypondFile } from './lilypond.mjs'

export async function writeDeck(getData, processRecord, filename) {
  console.log(`Creating ${filename}`)
  const data = getData()
  console.log(`${data.length} records`)

  const lilypondFile = new LilypondFile('18mpp-' + filename)
  let out = ''

  for (const record of data) {
    const ankiNote = processRecord(record, lilypondFile)
    if (ankiNote) {
      out += ankiNote + '\n'
    }
  }

  console.log('Creating lilypond files...')
  await lilypondFile.createFiles()

  console.log('Creating Anki tsv')
  writeFileSync(`out/${filename}.tsv`, out, { encoding: 'utf8' })
}
