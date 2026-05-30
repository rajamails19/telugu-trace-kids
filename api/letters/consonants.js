import { consonants } from '../../src/data/letters.js'

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.json(consonants)
}
