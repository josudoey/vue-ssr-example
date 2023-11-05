import { pack } from 'msgpackr/pack'

export function stringify (state: any): string {
  return pack(state).toString('base64')
}
