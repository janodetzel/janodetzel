import { ExtendedRecordMap } from 'notion-types'

export function getPageFont(recordMap: ExtendedRecordMap): string | undefined {
  return recordMap.block[Object.keys(recordMap.block)[0]]?.value?.format
    ?.page_font
}
