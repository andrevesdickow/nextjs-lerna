import { floor, padStart, toString } from 'lodash'

export function convertDurationToTimeString(duration: number): string {
  const hours = floor(duration / 3600)
  const minutes = floor((duration % 3600) / 60)
  const seconds = duration % 60

  return `${padStart(toString(hours), 2, '0')}:${padStart(toString(minutes), 2, '0')}:${padStart(toString(seconds), 2, '0')}`
}
