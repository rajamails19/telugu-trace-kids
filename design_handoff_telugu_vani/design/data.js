// data.js — content + theme tokens for Telugu Vani. Plain JS (window globals).

window.T = {
  cream:    '#FBF4E4',   // page background
  creamCard:'#FFFDF8',   // warm white cards / nav
  white:    '#FFFFFF',
  ink:      '#3A1E9C',   // primary indigo (headings, brand)
  inkDeep:  '#241A55',   // deity panel / darkest
  inkSoft:  '#8E89A8',   // muted body text (lavender-grey)
  orange:   '#F0560E',   // primary accent
  orangeDk: '#D2480A',
  gold:     '#F5B62B',
  peach:    '#FCE6D6',   // active nav pill
  petal:    '#F8D9A0',   // soft decorative blob
  border:   'rgba(58,30,156,0.10)',
  serif:    "'Playfair Display', Georgia, 'Times New Roman', serif",
  sans:     "'Mulish', system-ui, -apple-system, sans-serif",
  te:       "'Noto Sans Telugu', sans-serif",
  teSerif:  "'Ramaraja', 'Noto Serif Telugu', serif",
};

// Per-deity jewel-tone panel tint (dark base behind the gold mandala).
window.DEITY_TINT = {
  ganesha:'#241A55', saraswati:'#2E1B57', guru:'#142A4E', gayatri:'#3A2350',
  hanuman:'#4A1730', karagre:'#4A1838', shanti:'#0F3A38', annapurna:'#14392A',
  vishnu:'#16285C', rivers:'#0D3548', deepam:'#3E2613', shani:'#221C52',
  surya:'#4A2613', hayagriva:'#321552',
};

// Telugu vowels (అచ్చులు) with transliteration
window.VOWELS = [
  { g:'అ', r:'a' },  { g:'ఆ', r:'ā' },  { g:'ఇ', r:'i' },
  { g:'ఈ', r:'ī' },  { g:'ఉ', r:'u' },  { g:'ఊ', r:'ū' },
  { g:'ఋ', r:'ru' }, { g:'ఎ', r:'e' },  { g:'ఏ', r:'ē' },
  { g:'ఐ', r:'ai' }, { g:'ఒ', r:'o' },  { g:'ఓ', r:'ō' },
];
window.CONSONANTS = [
  { g:'క', r:'ka' }, { g:'ఖ', r:'kha' }, { g:'గ', r:'ga' },
  { g:'ఘ', r:'gha' },{ g:'చ', r:'cha' }, { g:'జ', r:'ja' },
];

// Shloka deities (tabs) + the featured Ganesha verse
window.DEITIES = [
  { key:'ganesha',   en:'Ganesha',   te:'గణేశ',     icon:'🐘' },
  { key:'saraswati', en:'Saraswati', te:'సరస్వతి',  icon:'📚' },
  { key:'guru',      en:'Guru',      te:'గురు',     icon:'🙏' },
  { key:'gayatri',   en:'Gayatri',   te:'గాయత్రి',  icon:'☀️' },
  { key:'hanuman',   en:'Hanuman',   te:'హనుమ',     icon:'💪' },
  { key:'karagre',   en:'Karagre',   te:'కరాగ్రే',  icon:'🌅' },
  { key:'shanti',    en:'Shanti',    te:'శాంతి',    icon:'🌍' },
  { key:'annapurna', en:'Annapurna', te:'అన్నపూర్ణ', icon:'🍚' },
  { key:'vishnu',    en:'Vishnu',    te:'విష్ణు',    icon:'🩺' },
  { key:'rivers',    en:'Rivers',    te:'నదులు',    icon:'🚿' },
  { key:'deepam',    en:'Deepam',    te:'దీపం',     icon:'🪔' },
  { key:'shani',     en:'Shani',     te:'శని',      icon:'🪐' },
  { key:'surya',     en:'Surya',     te:'సూర్య',     icon:'🌞' },
  { key:'hayagriva', en:'Hayagriva', te:'హయగ్రీవ',  icon:'🎓' },
];
window.SHLOKAS = {
  ganesha: { label:'Ganesha Shloka', dur:'0:45 mins',
    lines:['వక్రతుండ మహాకాయ','సూర్యకోటి సమప్రభ','నిర్విఘ్నం కురు మే దేవ','సర్వకార్యేషు సర్వదా'],
    roman:['Vakra-tunda Mahaa-kaaya','Surya-koti Sama-prabha','Nir-vighnam Kuru Me Deva','Sarva-kaaryeshu Sarva-daa'],
    meaning:'O Lord Ganesha, remove all obstacles and bless all my work.' },
  saraswati: { label:'Saraswati Shloka', dur:'0:40 mins',
    lines:['సరస్వతి నమస్తుభ్యం','వరదే కామరూపిణీ','విద్యారంభం కరిష్యామి','సిద్ధిర్భవతు మే సదా'],
    roman:['Saraswati Namas-tubhyam','Varade Kaama-rupini','Vidyaa-aarambham Karishyaami','Siddhir-bhavatu Me Sadaa'],
    meaning:'O Saraswati, bless my studies and help me succeed.' },
  guru: { label:'Guru Shloka', dur:'0:42 mins',
    lines:['గురుర్బ్రహ్మా గురుర్విష్ణుః','గురుర్దేవో మహేశ్వరః','గురుస్సాక్షాత్ పరంబ్రహ్మ','తస్మై శ్రీగురవే నమః'],
    roman:['Gurur-Brahmaa Gurur-Vishnuh','Gurur-Devo Maheshwarah','Gurus-Saakshaat Param-Brahma','Tasmai Shri-Gurave Namah'],
    meaning:'I bow to the Guru, who represents the divine.' },
  gayatri: { label:'Gayatri Mantra', dur:'0:50 mins',
    lines:['ఓం భూర్భువస్సువః','తత్సవితుర్వరేణ్యం','భర్గో దేవస్య ధీమహి','ధియో యో నః ప్రచోదయాత్'],
    roman:['Om Bhoor Bhuvah Svah','Tat Savitur Varenyam','Bhargo Devasya Dheemahi','Dhiyo Yo Nah Prachodayaat'],
    meaning:'May the divine light guide our intellect.' },
  hanuman: { label:'Hanuman Shloka', dur:'0:44 mins',
    lines:['బుద్ధిర్బలం యశోధైర్యం','నిర్భయత్వమరోగతా','అజాడ్యం వాక్పటుత్వం చ','హనుమత్స్మరణాద్భవేత్'],
    roman:['Buddhir-Balam Yasho-Dhairyam','Nirbhayatvam Arogataa','Ajaadyam Vaak-Patutvam Cha','Hanumat-Smaranaat Bhavet'],
    meaning:'Remembering Hanuman gives wisdom, courage, health, and confidence.' },
  karagre: { label:'Karagre Vasate', dur:'0:38 mins',
    lines:['కరాగ్రే వసతే లక్ష్మీః','కరమధ్యే సరస్వతీ','కరమూలే స్థితా గౌరీ','ప్రభాతే కరదర్శనం'],
    roman:['Karaagre Vasate Lakshmih','Kara-madhye Saraswati','Kara-moole Sthitaa Gauri','Prabhaate Kara-darshanam'],
    meaning:'Lakshmi, Saraswati, and Gauri reside in my hands.' },
  shanti: { label:'Shanti Mantra', dur:'0:42 mins',
    lines:['సర్వే భవంతు సుఖినః','సర్వే సంతు నిరామయాః','సర్వే భద్రాణి పశ్యంతు','మా కశ్చిద్దుఃఖభాగ్భవేత్','ఓం శాంతిః శాంతిః శాంతిః'],
    roman:['Sarve Bhavantu Sukhinah','Sarve Santu Niraamayaah','Sarve Bhadraani Pashyantu','Maa Kashchid Duhkha-bhaag Bhavet','Om Shaantih Shaantih Shaantih'],
    meaning:'May everyone be happy, healthy, and peaceful.' },
  annapurna: { label:'Annapurna Shloka', dur:'0:42 mins',
    lines:['అన్నపూర్ణే సదాపూర్ణే','శంకరప్రాణవల్లభే','జ్ఞానవైరాగ్య సిద్ధ్యర్థం','భిక్షాం దేహి చ పార్వతి'],
    roman:['Annapoorne Sadaa-poorne','Shankara-Praana-Vallabhe','Jnaana-Vairaagya Siddhyartham','Bhikshaam Dehi Cha Paarvati'],
    meaning:'Bless us with food, knowledge, and wisdom.' },
  vishnu: { label:'Vishnu Health Shloka', dur:'0:40 mins',
    lines:['అచ్యుతానంద గోవింద','నామోచ్చారణ భేషజాత్','నశ్యంతి సకలా రోగాః','సత్యం సత్యం వదామ్యహం'],
    roman:['Achyutaananda Govinda','Naamochchaarana Bheshajaat','Nashyanti Sakalaa Rogaah','Satyam Satyam Vadaamyaham'],
    meaning:"Chanting the Lord's names brings healing and well-being." },
  rivers: { label:'Bath Time Shloka', dur:'0:38 mins',
    lines:['గంగే చ యమునే చైవ','గోదావరి సరస్వతి','నర్మదే సింధు కావేరి','జలేస్మిన్ సన్నిధిం కురు'],
    roman:['Gange Cha Yamune Chaiva','Godaavari Saraswati','Narmade Sindhu Kaaveri','Jalesmin Sannidhim Kuru'],
    meaning:'May all sacred rivers bless this water.' },
  deepam: { label:'Evening Lamp Shloka', dur:'0:40 mins',
    lines:['దీపజ్యోతిః పరబ్రహ్మ','దీపజ్యోతిర్జనార్దనః','దీపో హరతు మే పాపం','సంధ్యాదీప నమోస్తుతే'],
    roman:['Deepa-Jyotih Para-Brahma','Deepa-Jyotir Janaardanah','Deepo Haratu Me Paapam','Sandhyaa-Deepa Namostute'],
    meaning:'May the lamp remove darkness and negativity.' },
  shani: { label:'Shani Shloka', dur:'0:42 mins',
    lines:['నీలాంజన సమాభాసం','రవిపుత్రం యమాగ్రజం','ఛాయామార్తాండ సంభూతం','తం నమామి శనైశ్చరం'],
    roman:['Neelaanjana Samaabhaasam','Ravi-putram Yamaagrajam','Chaayaa-Maartanda Sambhootam','Tam Namaami Shanaishcharam'],
    meaning:'I bow to Lord Shani for protection and discipline.' },
  surya: { label:'Surya Energy Mantra', dur:'0:48 mins',
    lines:['ఓం మిత్రాయ నమః','ఓం రవయే నమః','ఓం సూర్యాయ నమః','ఓం భానవే నమః','ఓం ఖగాయ నమః','ఓం పూష్ణే నమః'],
    roman:['Om Mitraaya Namah','Om Ravaye Namah','Om Suryaaya Namah','Om Bhaanave Namah','Om Khagaaya Namah','Om Pooshne Namah'],
    meaning:'Salutations to the Sun God who gives life, energy, and strength.' },
  hayagriva: { label:'Hayagriva Shloka', dur:'0:42 mins',
    lines:['జ్ఞానానందమయం దేవం','నిర్మలస్ఫటికాకృతిం','ఆధారం సర్వవిద్యానాం','హయగ్రీవమ్ ఉపాస్మహే'],
    roman:['Jnaanaananda-mayam Devam','Nirmala-Sphatika-aakritim','Aadhaaram Sarva-Vidyaanaam','Hayagreevam Upaasmahe'],
    meaning:'We meditate on Hayagriva, the source of all knowledge and learning.' },
};

// Progress + milestones
window.STATS = [
  { icon:'🔥', n:'12', label:'Day streak' },
  { icon:'✍️', n:'28', label:'Letters mastered' },
  { icon:'🕉️', n:'6',  label:'Shlokas learned' },
  { icon:'🏆', n:'4',  label:'Trophies earned' },
];
window.MILESTONES = [
  { t:'First letter traced',     when:'Day 1',  done:true },
  { t:'10 letters mastered',     when:'Day 4',  done:true },
  { t:'First shloka recited',    when:'Day 7',  done:true },
  { t:'All vowels complete',     when:'Day 12', done:false },
  { t:'Ganesha shloka mastered', when:'Soon',   done:false },
];

// Admin learners
window.LEARNERS = [
  { initial:'S', name:'Saanvi J.', streak:12, letters:28, shlokas:6 },
  { initial:'A', name:'Arjun R.',  streak:5,  letters:14, shlokas:2 },
  { initial:'M', name:'Meera P.',  streak:21, letters:42, shlokas:9 },
];

// Geometric golden mandala (ornament) as an SVG data-URI — used as the
// deity-panel fallback until the user drops their own art.
window.mandalaDataURI = function () {
  const gold = '#F6C25A', gold2 = '#E89A2B', glow = '#FBD98A';
  let petals = '';
  const cx = 200, cy = 200;
  // outer petal ring
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * 360;
    petals += `<g transform="rotate(${a} ${cx} ${cy})">
      <path d="M${cx} ${cy-150} q22 30 0 70 q-22-40 0-70 z" fill="${gold}" opacity="0.9"/>
      <circle cx="${cx}" cy="${cy-158}" r="5" fill="${glow}"/>
    </g>`;
  }
  // mid petal ring
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * 360 + 15;
    petals += `<g transform="rotate(${a} ${cx} ${cy})">
      <path d="M${cx} ${cy-110} q16 24 0 52 q-16-28 0-52 z" fill="${gold2}" opacity="0.95"/>
    </g>`;
  }
  const rings = [150,128,98,74,52].map((r,i)=>
    `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${gold}" stroke-width="${i%2?1:2}" stroke-dasharray="${i%2?'3 6':'8 5'}" opacity="${0.65-i*0.07}"/>`
  ).join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
    <defs><radialGradient id="cgl" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${glow}" stop-opacity="0.55"/>
      <stop offset="60%" stop-color="${gold2}" stop-opacity="0.12"/>
      <stop offset="100%" stop-color="${gold2}" stop-opacity="0"/>
    </radialGradient></defs>
    <circle cx="${cx}" cy="${cy}" r="170" fill="url(#cgl)"/>
    ${petals}${rings}
    <circle cx="${cx}" cy="${cy}" r="40" fill="#2A1F63" stroke="${gold}" stroke-width="2"/>
    <text x="${cx}" y="${cy+18}" font-family="'Noto Sans Telugu',sans-serif" font-size="46" font-weight="700" fill="${glow}" text-anchor="middle">ఓం</text>
  </svg>`;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
};
