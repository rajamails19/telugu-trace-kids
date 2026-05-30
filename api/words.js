import { words } from '../src/data/words.js'

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.json(words)
}
