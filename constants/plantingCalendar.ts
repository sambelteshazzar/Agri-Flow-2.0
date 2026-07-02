export type ClimateZone = 'sahel' | 'sudan_savanna' | 'guinea_savanna' | 'tropical_wet_dry' | 'tropical_rainforest';

export interface PlantingWindow {
  startMonth: number;
  endMonth: number;
  label: string;
}

export interface CropCalendarEntry {
  crop: string;
  emoji: string;
  climateZones: ClimateZone[];
  plantingWindows: PlantingWindow[];
  growthDurationWeeks: number;
  harvestWindow: PlantingWindow;
  keyActivities: Record<number, string[]>;
  waterNeed: 'Low' | 'Moderate' | 'High';
  soilPreference: string;
  tips: string[];
  varieties: string[];
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export { MONTHS };

export const CROP_CALENDAR: CropCalendarEntry[] = [
  {
    crop: 'Maize',
    emoji: '🌽',
    climateZones: ['sahel', 'sudan_savanna', 'guinea_savanna', 'tropical_wet_dry'],
    plantingWindows: [
      { startMonth: 6, endMonth: 7, label: 'Early (Main Season)' },
      { startMonth: 9, endMonth: 10, label: 'Late (Dry Season Irrigated)' },
    ],
    growthDurationWeeks: 16,
    harvestWindow: { startMonth: 10, endMonth: 11, label: 'Main Harvest' },
    keyActivities: {
      5: ['Land preparation', 'Basal fertilizer application', 'Seed treatment'],
      6: ['Planting', 'Thinning (2 weeks after emergence)', 'First weeding'],
      7: ['Second weeding', 'Top-dressing (urea)', 'Scout for Fall Armyworm'],
      8: ['Side-dress N if needed', 'Monitor for Striga', 'Bird scaring at tasseling'],
      9: ['Pre-harvest assessment', 'Drying preparations'],
      10: ['Harvest', 'Drying on tarpaulins', 'Shelling'],
      11: ['Storage (hermetic bags)', 'Marketing'],
    },
    waterNeed: 'Moderate',
    soilPreference: 'Well-drained loamy soils, pH 5.5-7.0',
    tips: [
      'Plant within 2 weeks of rain onset for best yields',
      'Use SAMMAZ or Oba Super varieties for Sahel zone',
      'Apply NPK 15:15:15 at planting, urea at 4-6 weeks',
      'Push-pull technology controls Fall Armyworm and Striga simultaneously',
      'Harvest when kernels are hard and black layer forms',
    ],
    varieties: ['SAMMAZ 35', 'Oba Super 1', 'TZB-SR', 'EVDT-W', 'Ikenne 8328-21'],
  },
  {
    crop: 'Rice',
    emoji: '🍚',
    climateZones: ['sahel', 'sudan_savanna', 'guinea_savanna', 'tropical_wet_dry', 'tropical_rainforest'],
    plantingWindows: [
      { startMonth: 6, endMonth: 7, label: 'Main (Rainfed Upland)' },
      { startMonth: 1, endMonth: 2, label: 'Dry Season (Irrigated Lowland)' },
    ],
    growthDurationWeeks: 18,
    harvestWindow: { startMonth: 10, endMonth: 11, label: 'Main Harvest' },
    keyActivities: {
      5: ['Nursery bed preparation', 'Land leveling (lowland)', 'Seed soaking/pre-germination'],
      6: ['Transplanting (21-day seedlings)', 'Direct seeding (upland)', 'First fertilizer application'],
      7: ['Weeding', 'Nitrogen top-dressing at tillering', 'Scout for African Rice Gall Midge'],
      8: ['Second weeding', 'Water management', 'Bird scaring at heading'],
      9: ['Drain fields 2 weeks before harvest', 'Monitor ripening'],
      10: ['Harvest when 80% grains golden', 'Threshing', 'Drying to 14% moisture'],
      11: ['Parboiling (if processing)', 'Storage in PICS bags', 'Marketing'],
    },
    waterNeed: 'High',
    soilPreference: 'Clay to clay-loam for lowland; loam for upland',
    tips: [
      'Transplant at 21 days — older seedlings reduce yield',
      'Apply N at tillering and panicle initiation stages',
      'Critical weed-free period: first 30 days after transplanting',
      'Tie bundle and hang to dry — reduces cracking',
      'NERICA varieties handle drought in upland conditions',
    ],
    varieties: ['NERICA L-34', 'FARO 44 (Sippi)', 'WITA 9', 'IR 841 (Sahel)', 'Gambiaka'],
  },
  {
    crop: 'Cassava',
    emoji: '🥔',
    climateZones: ['sudan_savanna', 'guinea_savanna', 'tropical_wet_dry', 'tropical_rainforest'],
    plantingWindows: [
      { startMonth: 6, endMonth: 8, label: 'Main Season' },
    ],
    growthDurationWeeks: 44,
    harvestWindow: { startMonth: 11, endMonth: 4, label: 'Flexible (10-18 months)' },
    keyActivities: {
      5: ['Select healthy stems for planting material', 'Land preparation (ridges/mounds)'],
      6: ['Planting (stem cuttings 25cm)', 'First weeding at 4 weeks'],
      7: ['Second weeding', 'Scout for cassava mosaic disease (CMD)'],
      8: ['Hilling up', 'Monitor for mealybug and green mite'],
      9: ['Third weeding (if needed)'],
      10: ['Intercrop harvest (if intercropped with maize)'],
      11: ['Can begin piecemeal harvest at 10 months'],
      1: ['Peak harvest (12-14 months)', 'Processing into gari/fufu'],
      3: ['Root quality check', 'Extended storage in ground'],
    },
    waterNeed: 'Low',
    soilPreference: 'Sandy loam to loam, tolerates poor acidic soils',
    tips: [
      'Plant stems at 45° angle, 2/3 buried in soil',
      'CMD-resistant varieties: TMS 30572, TME 419',
      'Can stay in ground 18-24 months — harvest as needed',
      'Intercrop with maize/cowpea for first 3-4 months',
      'Process within 48 hours of harvest to avoid post-harvest loss',
    ],
    varieties: ['TMS 30572', 'TME 419', 'TMS 01/1368', 'TMS 98/0505', 'Farmer selection local'],
  },
  {
    crop: 'Cowpea',
    emoji: '🫘',
    climateZones: ['sahel', 'sudan_savanna', 'guinea_savanna', 'tropical_wet_dry'],
    plantingWindows: [
      { startMonth: 7, endMonth: 8, label: 'Main Season' },
    ],
    growthDurationWeeks: 12,
    harvestWindow: { startMonth: 10, endMonth: 11, label: 'Main Harvest' },
    keyActivities: {
      6: ['Land preparation (minimal tillage OK)', 'Seed treatment with Rhizobium'],
      7: ['Planting (2 seeds/hole, 20×75cm)', 'Scout for aphids at emergence'],
      8: ['First weeding (3 weeks after planting)', 'Scout for Maruca pod borer'],
      9: ['Second weeding', 'Spray for legume pod borer if threshold reached'],
      10: ['Harvest green pods (if selling fresh)', 'Begin dry pod harvest'],
      11: ['Complete harvest', 'Threshing', 'Storage in hermetic bags'],
    },
    waterNeed: 'Low',
    soilPreference: 'Well-drained sandy loam, pH 5.5-6.5',
    tips: [
      'Most drought-tolerant grain legume for Sahel',
      'Dual-purpose varieties give grain + fodder',
      'Plant in same hole as sorghum/millet for intercrop',
      'Spray insecticide at flowering for Maruca control',
      'Triple-bag storage prevents bruchid weevil damage',
    ],
    varieties: ['IT98K-205-8', 'IT90K-277-2', 'SAMPEA 11', 'Kanannado', 'Baadara'],
  },
  {
    crop: 'Sorghum',
    emoji: '🌾',
    climateZones: ['sahel', 'sudan_savanna', 'guinea_savanna'],
    plantingWindows: [
      { startMonth: 6, endMonth: 7, label: 'Main Season' },
    ],
    growthDurationWeeks: 18,
    harvestWindow: { startMonth: 10, endMonth: 12, label: 'Main Harvest' },
    keyActivities: {
      5: ['Land preparation', 'Seed selection (Striga-resistant if applicable)'],
      6: ['Planting (5cm depth)', 'Thinning at 2 weeks'],
      7: ['First weeding', 'Scout for Striga', 'Side-dress N if needed'],
      8: ['Second weeding', 'Bird scaring at grain fill', 'Monitor for grain mold'],
      9: ['Pre-harvest assessment', 'Head blight watch'],
      10: ['Harvest when grains are hard', 'Drying on heads', 'Threshing'],
      11: ['Storage in improved granaries', 'Marketing'],
    },
    waterNeed: 'Low',
    soilPreference: 'Wide adaptation — sandy to clay soils',
    tips: [
      'Most drought-tolerant cereal for Sahel and Sudan savanna',
      'Striga-resistant varieties reduce losses up to 50%',
      'Intercrop with cowpea for soil fertility and extra income',
      'Bird scaring critical from soft dough to hard dough stage',
      'Guinea race sorghum preferred for local brewing (pito/burukutu)',
    ],
    varieties: ['KSV 8', 'ICSV 400', 'S35', 'CSR-01', 'Local Guinea race'],
  },
  {
    crop: 'Millet',
    emoji: '🌾',
    climateZones: ['sahel', 'sudan_savanna'],
    plantingWindows: [
      { startMonth: 6, endMonth: 7, label: 'Main Season' },
    ],
    growthDurationWeeks: 15,
    harvestWindow: { startMonth: 10, endMonth: 11, label: 'Main Harvest' },
    keyActivities: {
      5: ['Land preparation (potholing for Sahel)', 'Seed selection'],
      6: ['Planting in stations (3-5 seeds)', 'First weeding at 2-3 weeks'],
      7: ['Thinning to 2 plants/station', 'Scout for downy mildew', 'Second weeding'],
      8: ['Bird scaring at heading', 'Monitor for ergot'],
      9: ['Pre-harvest field drying'],
      10: ['Harvest', 'Threshing', 'Winnowing and storage'],
    },
    waterNeed: 'Low',
    soilPreference: 'Sandy to sandy-loam, tolerates low fertility',
    tips: [
      'Most resilient cereal for Sahel — survives <400mm rainfall',
      'Pearl millet deeper root system than sorghum',
      'Downy mildew: use resistant varieties, avoid planting in cold soils',
      'Store in mud granaries or hermetic bags',
      'Pearl millet grain excellent for fura/tnu preparation',
    ],
    varieties: ['SOSAT C88', 'LCIC 9702', 'GB 8735', 'ICTP 8201', 'Local pearl millet'],
  },
  {
    crop: 'Groundnut',
    emoji: '🥜',
    climateZones: ['sahel', 'sudan_savanna', 'guinea_savanna', 'tropical_wet_dry'],
    plantingWindows: [
      { startMonth: 6, endMonth: 7, label: 'Main Season' },
    ],
    growthDurationWeeks: 16,
    harvestWindow: { startMonth: 10, endMonth: 11, label: 'Main Harvest' },
    keyActivities: {
      5: ['Land preparation (fine seedbed needed)', 'Gypsum procurement if available'],
      6: ['Planting (2 seeds/hole)', 'Inoculate with Rhizobium'],
      7: ['First weeding at 3 weeks', 'Scout for rosette disease', 'Aphid monitoring'],
      8: ['Second weeding', 'Gypsum application at pegging', 'Hilling for pod development'],
      9: ['Pre-harvest vine lifting check', 'Monitor for Aflaflatoxin risk (drought = high risk)'],
      10: ['Harvest (lift vines when 70% pods mature)', 'Field curing (upside down on rows)', 'Stripping'],
      11: ['Drying to 8% moisture', 'Aflasafe treatment awareness', 'Storage in shell for better shelf life'],
    },
    waterNeed: 'Moderate',
    soilPreference: 'Sandy loam, well-drained, calcium-rich',
    tips: [
      'Aflatoxin is #1 quality risk — dry rapidly, avoid ground contact',
      'Spanish types (3-month) for Sahel, Virginia (4-month) for savanna',
      'Apply gypsum at flowering to improve pod fill',
      'Rosette-resistant varieties: SAMNUT 22, 23, 24',
      'Critical drought at pegging = high aflatoxin risk',
    ],
    varieties: ['SAMNUT 22', 'SAMNUT 23', 'SAMNUT 24', '5045/Ex-Dakar', 'RMP 12'],
  },
  {
    crop: 'Yam',
    emoji: '🥔',
    climateZones: ['guinea_savanna', 'tropical_wet_dry', 'tropical_rainforest'],
    plantingWindows: [
      { startMonth: 3, endMonth: 5, label: 'Main Season (Pre-rains)' },
    ],
    growthDurationWeeks: 32,
    harvestWindow: { startMonth: 11, endMonth: 1, label: 'Main Harvest' },
    keyActivities: {
      2: ['Seed yam selection and treatment', 'Mound/ridge preparation'],
      3: ['Planting on mounds (setts 200-300g)', 'Mulching'],
      4: ['Staking (where needed)', 'First weeding'],
      5: ['Second weeding', 'Scout for yam beetles', 'Hilling up mounds'],
      6: ['Third weeding', 'Foliage management'],
      7: ['Vine management', 'Monitor for nematodes'],
      8: ['Continue weed management'],
      9: ['Pre-harvest senescence check'],
      10: ['Early varieties ready'],
      11: ['Main harvest', 'Curing (wound healing at 25-30°C)'],
      12: ['Barn storage — vertical on shelves', 'Marketing'],
    },
    waterNeed: 'Moderate',
    soilPreference: 'Loose, deep loamy soils — ridges/mounds essential',
    tips: [
      'Plant minisetts for seed yam production (cheaper than whole tubers)',
      'Treat setts with fungicide + insecticide before planting',
      'Yam barns — store vertically, inspect weekly',
      'Dioscorea rotundata (white yam) = most prized in Nigerian market',
      'Successfully stored yams can last 4-6 months in barns',
    ],
    varieties: ['D. rotundata (White Yam)', 'D. alata (Water Yam)', 'D. cayenensis (Yellow Yam)', 'Adako Bayere', 'Abi'],
  },
  {
    crop: 'Sesame',
    emoji: '🫘',
    climateZones: ['sahel', 'sudan_savanna', 'guinea_savanna'],
    plantingWindows: [
      { startMonth: 6, endMonth: 7, label: 'Main Season' },
    ],
    growthDurationWeeks: 14,
    harvestWindow: { startMonth: 10, endMonth: 11, label: 'Main Harvest' },
    keyActivities: {
      6: ['Seedbed preparation (fine tilth needed)', 'Planting (broadcast or rows)'],
      7: ['Thinning at 3 weeks', 'First weeding'],
      8: ['Second weeding', 'Scout for gall midge', 'Monitor Cercospora leaf spot'],
      9: ['Pre-harvest — stop weeding as pods mature'],
      10: ['Harvest when lower capsules turn brown', 'Cut stems, shock in field', 'Dry on tarpaulins'],
      11: ['Threshing by beating on clean surface', 'Winnowing', 'Storage in clean bags'],
    },
    waterNeed: 'Low',
    soilPreference: 'Well-drained sandy loam, pH 5.5-7.5',
    tips: [
      'One of the most profitable crops per hectare in the Sahel',
      'High export demand from Japan/China for white seed',
      'Needs weed-free field at establishment — very poor competitor',
      'Harvest before full shatter — cut when 50% capsules brown',
      'Avoid waterlogged fields — kills sesame quickly',
    ],
    varieties: ['Ex-Sudan', 'Yandev 55', 'E8', 'Ncri Beni-3M', 'Kenana 4'],
  },
  {
    crop: 'Tomato',
    emoji: '🍅',
    climateZones: ['guinea_savanna', 'tropical_wet_dry', 'tropical_rainforest'],
    plantingWindows: [
      { startMonth: 8, endMonth: 9, label: 'Dry Season (Irrigated)' },
      { startMonth: 4, endMonth: 5, label: 'Rainy Season (Open field)' },
    ],
    growthDurationWeeks: 16,
    harvestWindow: { startMonth: 12, endMonth: 2, label: 'Dry Season Peak' },
    keyActivities: {
      7: ['Nursery seedbed preparation', 'Seedling production (3-4 weeks)'],
      8: ['Transplanting (4-5 true leaves)', 'Staking setup', 'Basal fertilizer'],
      9: ['First weeding', 'Side-dressing at flowering', 'Scout for Tuta Absoluta'],
      10: ['Staking and tying', 'Pest management (Tuta, whitefly)', 'Disease watch (bacterial wilt, early blight)'],
      11: ['Harvesting begins', 'Grading and packing'],
      12: ['Peak harvest', 'Post-harvest processing (paste/drying)', 'Marketing to urban markets'],
    },
    waterNeed: 'High',
    soilPreference: 'Fertile loam, pH 6.0-6.8, good organic matter',
    tips: [
      'Dry season tomato is far more profitable than rainy season',
      'Tuta Absoluta is #1 threat — pheromone traps + targeted sprays',
      'Roma types preferred for processing; beefsteak for fresh market',
      'Mulch heavily to conserve water and reduce blossom end rot',
      'Harvest at breaker stage (pink shoulder) for better transport',
    ],
    varieties: ['Roma VF', 'UC82B', 'Tima', 'Ronita', 'Chibli F1'],
  },
  {
    crop: 'Cocoa',
    emoji: '🍫',
    climateZones: ['tropical_wet_dry', 'tropical_rainforest'],
    plantingWindows: [
      { startMonth: 4, endMonth: 6, label: 'Main Planting (Rainy Season)' },
    ],
    growthDurationWeeks: 156,
    harvestWindow: { startMonth: 10, endMonth: 12, label: 'Main Crop Season' },
    keyActivities: {
      3: ['Nursery preparation (if new planting)', 'Pruning of established trees'],
      4: ['Planting of seedlings (under shade)', 'Weed management', 'Mulching'],
      5: ['Fertilizer application', 'Chupons removal', 'Shade regulation'],
      6: ['Continue weed management', 'Black pod monitoring (wet season)'],
      7: ['Phytophthora control — copper sprays', 'CSSD scouting (cut out infected trees immediately)'],
      8: ['Black pod management continues', 'Harvest of mid-crop (if any)'],
      9: ['Preparation for main crop harvest', 'Fermentation box readiness'],
      10: ['Main crop harvest begins', 'Pod breaking', 'Fermentation (5-7 days)'],
      11: ['Peak harvest', 'Drying (7-14 days to 7% moisture)', 'Grading and bagging'],
      12: ['Second harvest wave', 'Marketing', 'Post-harvest pruning'],
    },
    waterNeed: 'High',
    soilPreference: 'Deep well-drained forest soils, pH 5.0-7.5, high organic matter',
    tips: [
      'CSSD (Cocoa Swollen Shoot Disease) — remove infected trees + contact trees immediately',
      'Fermentation quality determines price — 5-7 days, turn every 48 hours',
      'Shade trees essential for young cocoa — plant plantain/banana first',
      'Drying is critical: 7% moisture for export, avoid smoke contamination',
      'Rehabilitate aged farms: coppice rundown trees, replant with hybrids',
    ],
    varieties: ['Amazónica × Trinitario', 'C9', 'C14', 'TSH 575', 'PA 150 Series'],
  },
  {
    crop: 'Okra',
    emoji: '🫒',
    climateZones: ['sahel', 'sudan_savanna', 'guinea_savanna', 'tropical_wet_dry', 'tropical_rainforest'],
    plantingWindows: [
      { startMonth: 4, endMonth: 8, label: 'Wet Season (Multi-cycle)' },
      { startMonth: 10, endMonth: 11, label: 'Dry Season (Irrigated)' },
    ],
    growthDurationWeeks: 12,
    harvestWindow: { startMonth: 7, endMonth: 11, label: 'Continuous (pick every 2-3 days)' },
    keyActivities: {
      4: ['Direct seeding (soak seeds overnight first)', 'First sowing for early crop'],
      5: ['Thinning to 30cm spacing', 'First weeding'],
      6: ['Succession planting for continuous harvest', 'Side-dress with NPK'],
      7: ['Begin harvesting (50-60 days)', 'Pick every 2-3 days for tenderness', 'Second weeding'],
      8: ['Peak harvest', 'Scout for jassids and aphids', 'Continue succession planting'],
      9: ['Harvest continues', 'Powdery mildew watch', 'Scout for fruit borers'],
      10: ['Late harvest', 'Seed saving from mature pods'],
      11: ['Final harvest', 'Field cleanup'],
    },
    waterNeed: 'Moderate',
    soilPreference: 'Well-drained loam, pH 6.0-6.8',
    tips: [
      'Harvest every 2-3 days — over-mature pods become fibrous',
      'Soak seeds overnight before planting for faster germination',
      'Very profitable for market gardeners near urban centers',
      'Dry season irrigated okra commands premium prices',
      'Cut (don\'t pull) pods to avoid damaging the plant',
    ],
    varieties: ['Clemson Spineless', 'Emerald', 'Pusa Sawani', 'Lake', 'Local Kano variety'],
  },
];

export const CLIMATE_ZONE_INFO: Record<ClimateZone, { name: string; rainfall: string; countries: string[] }> = {
  sahel: { name: 'Sahel', rainfall: '200-600mm', countries: ['Niger (southern)', 'Nigeria (far north)', 'Senegal (north)', 'Burkina Faso (north)', 'Mali (north)'] },
  sudan_savanna: { name: 'Sudan Savanna', rainfall: '600-1000mm', countries: ['Nigeria (north)', 'Ghana (north)', 'Burkina Faso (south)', 'Mali (south)', 'Senegal (south)'] },
  guinea_savanna: { name: 'Guinea Savanna', rainfall: '1000-1400mm', countries: ['Nigeria (middle belt)', 'Ghana (transition)', 'Benin', 'Togo', 'Cameroon (north)'] },
  tropical_wet_dry: { name: 'Tropical Wet-Dry', rainfall: '1000-2000mm', countries: ['Nigeria (southwest)', 'Ghana (south)', 'Côte d\'Ivoire', 'Sierra Leone'] },
  tropical_rainforest: { name: 'Tropical Rainforest', rainfall: '2000-4000mm', countries: ['Nigeria (south-south)', 'Liberia', 'Côte d\'Ivoire (south)', 'Cameroon (south)'] },
};
