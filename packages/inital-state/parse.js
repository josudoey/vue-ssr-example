import { unpack } from 'msgpackr/unpack'
import Base64 from 'base64-js'

export default function parse (base64) {
  const data = Base64.toByteArray(base64)
  return unpack(data)
}
