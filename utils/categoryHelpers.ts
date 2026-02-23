export const categoryIcons: { [key: string]: string } = {
  'technical-skills': 'construct',
  'beauty-wellness': 'sparkles',
  'it-computer-science': 'laptop',
  'travel-tourism': 'airplane',
  'art-design': 'color-palette',
  'healthcare': 'medkit',
  'agriculture': 'leaf',
  'automotive': 'car',
  'fashion-design': 'cut',
  'electrical': 'flash',
  'construction': 'business',
  'photography': 'camera',
  'music': 'musical-notes',
  'business': 'briefcase',
  'carpentry': 'hammer',
  'electronics': 'hardware-chip',
  'retail': 'bag',
  'childcare': 'happy',
  'fitness': 'barbell',
};

export const categoryColors: { [key: string]: string } = {
  'technical-skills': '#FF6B35',
  'beauty-wellness': '#ED64A6',
  'it-computer-science': '#3182CE',
  'travel-tourism': '#4299E1',
  'art-design': '#9F7AEA',
  'healthcare': '#48BB78',
  'agriculture': '#68D391',
  'automotive': '#F56565',
  'fashion-design': '#ED64A6',
  'electrical': '#ECC94B',
  'construction': '#DD6B20',
  'photography': '#4299E1',
  'music': '#805AD5',
  'business': '#4299E1',
  'carpentry': '#DD6B20',
  'electronics': '#38B2AC',
  'retail': '#ED8936',
  'childcare': '#F687B3',
  'fitness': '#F56565',
};

function normalize(name: string) {
  return name
    .toLowerCase()
    .replace(/&/g, '')
    .replace(/\s+/g, '-');
}

export function getCategoryIcon(name: string): string {
  const key = normalize(name);
  return categoryIcons[key] || 'school';
}

export function getCategoryColor(name: string): string {
  const key = normalize(name);
  return categoryColors[key] || '#FF6B35';
}