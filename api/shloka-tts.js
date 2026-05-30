export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { text, shloka_id, line_index } = req.body
  if (!text || shloka_id == null || line_index == null) {
    return res.status(400).json({ error: 'Missing required fields: text, shloka_id, line_index' })
  }

  const apiKey = process.env.SARVAM_API_KEY
  if (!apiKey) {
    return res.status(503).json({ error: 'SARVAM_API_KEY is not configured' })
  }

  const response = await fetch('https://api.sarvam.ai/text-to-speech', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'api-subscription-key': apiKey },
    body: JSON.stringify({
      inputs: [text],
      target_language_code: 'te-IN',
      speaker: 'roopa',
      pace: 0.75,
      model: 'bulbul:v3',
      enable_preprocessing: false,
    }),
  })

  if (!response.ok) {
    const errText = await response.text()
    return res.status(response.status).json({ error: errText })
  }

  const data = await response.json()
  const audio = data.audios?.[0]
  if (!audio) return res.status(500).json({ error: 'No audio returned' })

  res.json({ audio })
}
