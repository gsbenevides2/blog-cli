import { SemanticString } from 'notionapi-agent/dist/interfaces/notion-models/semantic_string'

export function parseSemanticStringDateTimeToObject(
  dateTime: SemanticString.DateTime
): Date {
  const splitDate = dateTime.start_date.split('-').map(Number)
  const dateObject = new Date()
  dateObject.setHours(0)
  dateObject.setMinutes(0)
  dateObject.setSeconds(0)
  dateObject.setMilliseconds(0)
  dateObject.setDate(splitDate[2])
  dateObject.setMonth(splitDate[1] - 1)
  dateObject.setFullYear(splitDate[0])
  return dateObject
}
