const kanpurAreas = [
  { id: 'govind', name: 'Govind Nagar', lat: 26.450, lng: 80.305, households: 420, gap: 90, critical: 100, cost: 4.2, project: 'School Corridor Road & Storm Drainage Overhaul', detail: 'Reconstruct 320 m of arterial road and install covered storm drain to secure primary school access.', reports: 18 },
  { id: 'kidwai', name: 'Kidwai Nagar', lat: 26.437, lng: 80.331, households: 360, gap: 80, critical: 75, cost: 3.6, project: 'Primary Health Centre Access Road & Outfall', detail: 'Clear arterial water bottleneck and construct covered roadside utility duct connecting the local PHC.', reports: 14 },
  { id: 'kakadeo', name: 'Kakadeo', lat: 26.482, lng: 80.285, households: 280, gap: 65, critical: 50, cost: 2.8, project: 'Market Commercial Corridor Road & Solar Lighting', detail: 'Resurface 280 m market access lane and install community solar street lighting fixtures.', reports: 11 },
  { id: 'swaroop', name: 'Swaroop Nagar', lat: 26.485, lng: 80.316, households: 190, gap: 45, critical: 40, cost: 2.4, project: 'Pedestrian Safety & Covered Utility Ducts', detail: 'Replace damaged slab covers and rehabilitate junction walkways to restore safe resident mobility.', reports: 8 },
  { id: 'jajmau', name: 'Jajmau', lat: 26.432, lng: 80.402, households: 510, gap: 95, critical: 80, cost: 5.8, project: 'Drinking Water Supply Pipeline & Drainage Link', detail: 'Rehabilitate 360 m utility link to protect residential drinking water from contamination.', reports: 7 },
  { id: 'civil', name: 'Civil Lines', lat: 26.477, lng: 80.350, households: 140, gap: 35, critical: 30, cost: 1.8, project: 'Distribution Transformer Shielding & Lane Resurfacing', detail: 'Install protective barricades around exposed distribution transformer and repave 140 m access lane.', reports: 6 }
];

export const districts = 'Agra|Aligarh|Ambedkar Nagar|Amethi|Amroha|Auraiya|Ayodhya|Azamgarh|Baghpat|Bahraich|Ballia|Balrampur|Banda|Barabanki|Bareilly|Basti|Bhadohi|Bijnor|Budaun|Bulandshahr|Chandauli|Chitrakoot|Deoria|Etah|Etawah|Farrukhabad|Fatehpur|Firozabad|Gautam Buddha Nagar|Ghaziabad|Ghazipur|Gonda|Gorakhpur|Hamirpur|Hapur|Hardoi|Hathras|Jalaun|Jaunpur|Jhansi|Kannauj|Kanpur Dehat|Kanpur Nagar|Kasganj|Kaushambi|Kheri|Kushinagar|Lalitpur|Lucknow|Maharajganj|Mahoba|Mainpuri|Mathura|Mau|Meerut|Mirzapur|Moradabad|Muzaffarnagar|Pilibhit|Pratapgarh|Prayagraj|Raebareli|Rampur|Saharanpur|Sambhal|Sant Kabir Nagar|Shahjahanpur|Shamli|Shravasti|Siddharthnagar|Sitapur|Sonbhadra|Sultanpur|Unnao|Varanasi'.split('|');

const regionalDemos = [
  { id: 'lucknow', district: 'Lucknow', name: 'Alambagh', lat: 26.812, lng: 80.901, project: 'Inter-Modal Transit Corridor Paving & Drainage', detail: 'Pave 400 m bus station approach and expand runoff collection capacity.' },
  { id: 'varanasi', district: 'Varanasi', name: 'Lanka', lat: 25.282, lng: 83.002, project: 'Hospital Approach Lane & High-Capacity Drain Line', detail: 'Upgrade university & hospital corridor road with segregated pedestrian walkways.' },
  { id: 'agra', district: 'Agra', name: 'Kamla Nagar', lat: 27.214, lng: 78.019, project: 'Heritage Suburb Waste Management & Road Resurfacing', detail: 'Construct integrated solid-waste sorting point and repair cratered community link road.' },
  { id: 'gorakhpur', district: 'Gorakhpur', name: 'Rustampur', lat: 26.731, lng: 83.374, project: 'Flood-Resilient Embankment & School Approach Road', detail: 'Raise 300 m flood-prone access pathway and reinforce culvert structure.' },
  { id: 'meerut', district: 'Meerut', name: 'Shastri Nagar', lat: 28.962, lng: 77.733, project: 'Industrial Zone Buffer Road & Power Line Relocation', detail: 'Underground low-hanging utility cables and resurface market arterial link.' }
].map((a, i) => ({
  ...a,
  households: 200 + i * 40,
  gap: 60 + i * 5,
  critical: 50 + i * 5,
  cost: 2.5 + i * 0.5,
  reports: 5 + i
}));

const indiaAreas = [
  ...kanpurAreas.map(a => ({ ...a, district: 'Kanpur Nagar' })),
  ...regionalDemos,
  ...districts.map((district, i) => ({
    id: 'district-' + i,
    district,
    name: district + ' · Other locality',
    lat: 0,
    lng: 0,
    households: 0,
    gap: 0,
    critical: 0,
    cost: 0,
    project: 'Field assessment required',
    detail: 'This district accepts multi-channel citizen reports. Mapping, demographic exposure and cost estimates require a local field assessment.',
    reports: 0
  }))
];

// Membership reference: https://brics.br/en/about-the-brics (11-country list).
export const countries = ['India', 'Brazil', 'Russia', 'China', 'South Africa', 'Egypt', 'Ethiopia', 'Indonesia', 'Iran', 'Saudi Arabia', 'United Arab Emirates'];
const internationalLocations = [
  ['br-rio', 'Brazil', 'Rio de Janeiro', 'Madureira', -22.873, -43.336],
  ['ru-moscow', 'Russia', 'Moscow', 'Sokolniki', 55.789, 37.679],
  ['cn-beijing', 'China', 'Beijing', 'Chaoyang', 39.921, 116.443],
  ['za-johannesburg', 'South Africa', 'Johannesburg', 'Soweto', -26.248, 27.855],
  ['eg-cairo', 'Egypt', 'Cairo', 'Shubra', 30.073, 31.242],
  ['et-addis', 'Ethiopia', 'Addis Ababa', 'Bole', 8.993, 38.789],
  ['id-jakarta', 'Indonesia', 'Jakarta', 'Tebet', -6.226, 106.858],
  ['ir-tehran', 'Iran', 'Tehran', 'Narmak', 35.731, 51.506],
  ['sa-riyadh', 'Saudi Arabia', 'Riyadh', 'Al Malaz', 24.666, 46.736],
  ['ae-dubai', 'United Arab Emirates', 'Dubai', 'Al Karama', 25.245, 55.305],
] as const;
export const areas = [
  ...indiaAreas.map(a => ({...a, country: 'India'})),
  ...internationalLocations.map(([id, country, district, name, lat, lng], i) => ({
    id, country, district, name, lat, lng, households: 220 + i * 25,
    gap: 50 + (i % 5) * 10, critical: 45 + (i % 4) * 15,
    cost: 2.5 + (i % 6) * 0.5, reports: 6 + (i % 5),
    project: ['Safe School Access & Road Rehabilitation', 'Community Water Supply & Drainage Renewal', 'Neighbourhood Lighting & Pedestrian Safety'][i % 3],
    detail: 'Illustrative neighbourhood infrastructure project. Scope, household exposure and cost require local field verification; no government dataset is connected.'
  }))
];
export function districtsFor(country: string) {
  return [...new Set(areas.filter(a => country === 'All BRICS' || a.country === country).map(a => a.district))].sort();
}

export const INTAKE_CHANNELS = [
  'WhatsApp Bot',
  'IVR Helpline (1905)',
  'SMS Gateway',
  'Citizen Web Portal'
] as const;

export const CATEGORIES = [
  'Roads & Connectivity',
  'Water & Drainage',
  'Power & Electrification',
  'Public Health & Sanitation',
  'School & Community Access'
] as const;

export type Report = {
  id: string;
  area: string;
  description: string;
  category: string;
  severity: number;
  status: string;
  created: string;
  language: string;
  source: string;
};

export type Decision = {
  id: string;
  area: string;
  status: string;
  note: string;
  created: string;
};

const sampleTemplates = [
  { hi: 'मुख्य सड़क पर गहरे गड्ढे हैं जिससे स्कूल की बसें और एम्बुलेंस फंस रही हैं।', en: 'Main arterial road has dangerous craters causing school bus delays and ambulance blockage.', cat: 'Roads & Connectivity', sev: 3 },
  { hi: 'बारिश के बाद नाली और सड़क का पानी घरों के सामने भर जाता है। त्वरित निकासी चाहिए।', en: 'Monsoon runoff floods residential lanes due to blocked arterial outfall. Desilting needed.', cat: 'Water & Drainage', sev: 2 },
  { hi: 'ट्रांसफार्मर के पास खुले बिजली के तार लटक रहे हैं, तुरंत मरम्मत की आवश्यकता है।', en: 'Exposed high-voltage transformer wiring near pedestrian walkway poses electrocution hazard.', cat: 'Power & Electrification', sev: 3 },
  { hi: 'प्राथमिक स्वास्थ्य केंद्र के सामने कचरे का ढेर लगा है जिससे दुर्गंध और संक्रमण का खतरा है।', en: 'Heavy solid waste accumulation directly opposite Primary Health Centre creating bio-hazard.', cat: 'Public Health & Sanitation', sev: 2 },
  { hi: 'कन्या विद्यालय जाने वाला मार्ग टूटा हुआ है, बरसात में बच्चियां स्कूल नहीं पहुँच पाती हैं।', en: 'Washed-out culvert and unpaved path completely disconnect access to the girls secondary school.', cat: 'School & Community Access', sev: 3 },
  { hi: 'पेयजल आपूर्ति पाइपलाइन फट गई है और मुख्य मार्ग पर हजारों लीटर साफ पानी बह रहा है।', en: 'Main municipal water supply conduit ruptured, flooding road and causing severe tap contamination.', cat: 'Water & Drainage', sev: 2 },
  { hi: 'गली में स्ट्रीट लाइटें हफ्तों से बंद हैं, रात में महिलाओं और बुजुर्गों को आने-जाने में डर लगता है।', en: 'Entire residential sector dark for 3 weeks due to failed streetlights, leading to public safety risks.', cat: 'Power & Electrification', sev: 1 }
];

export const seed: Report[] = areas.flatMap((a, i) =>
  Array.from({ length: a.reports }, (_, j) => {
    const tpl = sampleTemplates[(i + j) % sampleTemplates.length];
    const isHindi = a.country === 'India' && j % 2 === 0;
    const channel = a.country === 'India' ? INTAKE_CHANNELS[(i + j) % INTAKE_CHANNELS.length] : 'Citizen Web Portal';
    return {
      id: `DEMO-${i + 1}-${String(j + 1).padStart(2, '0')}`,
      area: a.id,
      description: isHindi ? tpl.hi : tpl.en,
      category: tpl.cat,
      severity: tpl.sev,
      status: j === 0 ? 'Resolved' : j === 1 ? 'In review' : 'Received',
      created: new Date(Date.UTC(2026, 8, 28 - (j % 7), 8 + i, j * 5)).toISOString(),
      language: isHindi ? 'Hindi' : 'English',
      source: channel
    };
  })
);

export function analyse(text: string) {
  const critical = /school|hospital|clinic|ambulance|electric|transformer|hazard|wire|collapse|electrocution|accident|दुर्घटना|स्कूल|विद्यालय|अस्पताल|क्लिनिक|बिजली|तार|खंभा|जान|खतरा|बच्चे|children/i.test(text);
  const isPower = /electric|transformer|light|pole|blackout|power|wire|voltage|streetlight|बिजली|तार|ट्रांसफार्मर|बत्ती|अंधेरा|खंभा|वोल्टेज/i.test(text);
  const isRoad = /road|pothole|bridge|street|pavement|traffic|lane|culvert|highway|सड़क|रास्ता|गड्ढा|पुल|मार्ग|पैदल|ट्रैफिक/i.test(text);
  const isHealth = /garbage|waste|dump|sanitation|sewage|stink|filth|hospital|clinic|drainage|कचरा|कूड़ा|गंदगी|सफाई|बदबू|मच्छर|अस्पताल|दवाखाना/i.test(text);
  const isSchool = /school|college|children|student|approach|pedestrian|education|विद्यालय|स्कूल|कॉलेज|छात्र|बच्चे|शिक्षा/i.test(text);
  const isWater = /drain|water|flood|waterlog|overflow|pipe|leak|tap|drinking water|नाली|पानी|जलभराव|सीवर|पाइप|नल|बहाव/i.test(text);

  let category = 'Water & Drainage';
  if (isPower) category = 'Power & Electrification';
  else if (isRoad) category = 'Roads & Connectivity';
  else if (isHealth) category = 'Public Health & Sanitation';
  else if (isSchool) category = 'School & Community Access';
  else if (isWater) category = 'Water & Drainage';

  const known = isPower || isRoad || isHealth || isSchool || isWater;
  return {
    category,
    severity: critical ? 3 : known ? 2 : 1,
    summary: text,
    engine: 'Built-in rules · No AI summary',
    review: !known ? 'Needs clarification' : critical ? 'Priority field verification' : 'Routine municipal review'
  };
}

export function ranked(reports: Report[]) {
  return areas
    .filter(a => a.cost > 0)
    .map(a => {
      const rs = reports.filter(r => r.area === a.id && r.status !== 'Resolved');
      const demand = Math.min(100, rs.length * 5);
      const urgency = rs.length ? (Math.max(...rs.map(r => r.severity)) / 3) * 100 : 0;
      const score = Math.round(demand * 0.25 + urgency * 0.3 + a.gap * 0.25 + a.critical * 0.2);
      return { ...a, count: rs.length, score, demand, urgency };
    })
    .sort((a, b) => b.score - a.score);
}

export function plan(projects: ReturnType<typeof ranked>, budget: number) {
  // Integer hundredths keep decimal costs exact; O(projects × budget).
  const capacity = Math.max(0, Math.round(budget * 100));
  const dp: { score: number; items: typeof projects }[] = Array.from({length: capacity + 1}, () => ({score: 0, items: []}));
  for (const project of projects) {
    const cost = Math.round(project.cost * 100);
    if (cost <= 0) continue;
    for (let b = capacity; b >= cost; b--) {
      const previous = dp[b - cost];
      if (previous.score + project.score > dp[b].score) {
        dp[b] = {score: previous.score + project.score, items: [...previous.items, project]};
      }
    }
  }
  return dp[capacity].items;
}
