import { pack } from 'msgpackr/pack'

export default function stringify (state) {
  return pack(state).toString('base64')
}
