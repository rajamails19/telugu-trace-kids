import { shlokas } from '../src/data/shlokas.js'

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.json(shlokas)
}
