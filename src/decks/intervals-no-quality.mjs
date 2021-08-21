import { Interval } from '@tonaljs/tonal'
import { cartesian, intervalToStrWithoutQuality } from '../utils.mjs'

const NOTES = ['C', 'D', 'E', 'F', 'G', 'A', 'B']
export const getIntervalsNoQualityData = () =>
  cartesian(
    cartesian(NOTES, NOTES).filter(([from, to]) => from !== to),
    ['up', 'down'],
  )

export const processIntervalsNoQualityRecord = ([from, to, dir]) => {
  console.log(`Interval from ${from} ${dir} to ${to}`)

  const interval =
    dir === 'up' ? Interval.distance(from, to) : Interval.distance(to, from)

  const id = `${from}-${dir}-${to}`
  return [id, from, to, dir, intervalToStrWithoutQuality(interval)].join('\t')
}
