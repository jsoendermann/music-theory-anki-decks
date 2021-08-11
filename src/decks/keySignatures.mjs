import { Note } from '@tonaljs/tonal'

export const getKeySignaturesData = () => [
  ...[0, 1, 2, 3, 4, 5, 6, 7].map(n => Note.transposeFifths('C', n)),
  ...[-1, -2, -3, -4, -5, -6, -7].map(n => Note.transposeFifths('C', n)),
]
export const processKeySignaturesRecord = async note => {
  console.log(`Key: ${note} major`)
  const minor = Note.transpose(note, '-3m')
  const filename = `18mpp-${note}-major-${minor}-minor-key-signature`

  await createKeySignature(filename, note, 'major')

  return `${note}\t${minor}\t<img class="key-signature" src="${filename}.svg" />`
}
