import { unpack } from 'msgpackr/unpack'
import Base64 from 'base64-js'

export function parse (base64: string): any {
  const data = Base64.toByteArray(base64)
  return unpack(data)
}
