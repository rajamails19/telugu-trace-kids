const PALETTE = [
  { color: '#E11D48', light: '#FFF1F2', glow: '#FDA4AF' },
  { color: '#EA580C', light: '#FFF7ED', glow: '#FDBA74' },
  { color: '#D97706', light: '#FFFBEB', glow: '#FCD34D' },
  { color: '#16A34A', light: '#F0FDF4', glow: '#86EFAC' },
  { color: '#0891B2', light: '#ECFEFF', glow: '#67E8F9' },
  { color: '#2563EB', light: '#EFF6FF', glow: '#93C5FD' },
  { color: '#7C3AED', light: '#F5F3FF', glow: '#C4B5FD' },
  { color: '#C026D3', light: '#FDF4FF', glow: '#E879F9' },
  { color: '#DB2777', light: '#FDF2F8', glow: '#F9A8D4' },
  { color: '#059669', light: '#ECFDF5', glow: '#6EE7B7' },
]

const RAW_VOWELS = [
  ['అ',  'a',   'as in "come"'],
  ['ఆ',  'ā',   'as in "far"'],
  ['ఇ',  'i',   'as in "bit"'],
  ['ఈ',  'ī',   'as in "feel"'],
  ['ఉ',  'u',   'as in "wood"'],
  ['ఊ',  'ū',   'as in "cool"'],
  ['ఎ',  'e',   'as in "get"'],
  ['ఏ',  'ē',   'as in "stake"'],
  ['ఐ',  'ai',  'as in "mite"'],
  ['ఒ',  'o',   'as in "rotate"'],
  ['ఓ',  'ō',   'as in "oat"'],
  ['ఔ',  'au',  'as in "out"'],
  ['అం', 'aṃ',  'nasal vowel'],
  ['అః', 'aḥ',  'aspirate vowel'],
]

const RAW_CONSONANTS = [
  ['క',  'k',   'as in "silk"'],
  ['ఖ',  'kh',  'as in "khāki"'],
  ['గ',  'g',   'as in "go"'],
  ['ఘ',  'gh',  'as in "ghost"'],
  ['చ',  'c',   'as in "church"'],
  ['ఛ',  'ch',  'as in "witch"'],
  ['జ',  'j',   'as in "jug"'],
  ['ఝ',  'jh',  'as in "jhānsi"'],
  ['ట',  'ṭ',   'as in "take"'],
  ['డ',  'ḍ',   'retroflex "d"'],
  ['ణ',  'ṇ',   'retroflex "n"'],
  ['త',  't',   'as in "tabala"'],
  ['థ',  'th',  'as in "thumb"'],
  ['ద',  'd',   'as in "though"'],
  ['ధ',  'dh',  'as in "dhōti"'],
  ['న',  'n',   'as in "nature"'],
  ['ప',  'p',   'as in "cup"'],
  ['ఫ',  'ph',  'as in "phone"'],
  ['బ',  'b',   'as in "bat"'],
  ['భ',  'bh',  'as in "bharat"'],
  ['మ',  'm',   'as in "month"'],
  ['య',  'y',   'as in "young"'],
  ['ర',  'r',   'as in "rust"'],
  ['ల',  'l',   'as in "lump"'],
  ['ళ',  'ḷ',   'retroflex "l"'],
  ['వ',  'v',   'as in "levy"'],
  ['శ',  'ś',   'as in "shastry"'],
  ['ష',  'ṣ',   'retroflex "sh"'],
  ['స',  's',   'as in "sun"'],
  ['హ',  'h',   'as in "hat"'],
]

function build(raw, category) {
  return raw.map(([telugu, roman, hint], i) => ({
    id: `${category[0]}${i + 1}`,
    telugu,
    roman,
    hint,
    category,
    ...PALETTE[i % PALETTE.length],
  }))
}

export const vowels     = build(RAW_VOWELS,     'vowel')
export const consonants = build(RAW_CONSONANTS, 'consonant')
