// Category icon mapping

export const categoryIcons: { [key: string]: string } = {
  'technical-skills': 'construct',
  'technical': 'construct',

  'computer-it': 'desktop',
  'it-computer-science': 'laptop',
  'computer-science': 'laptop',

  'beauty-wellness': 'sparkles',

  'hospitality': 'restaurant',
  'healthcare': 'medical',
  'agriculture': 'leaf',
  'automotive': 'car',
  'fashion-design': 'cut',
  'electrical': 'flash',
  'construction': 'business',

  'art-design': 'color-palette',

  'photography': 'camera',
  'music': 'musical-notes',
  'business': 'briefcase',
  'carpentry': 'hammer',
  'electronics': 'hardware-chip',
  'travel-tourism': 'airplane',
  'retail': 'bag',
  'childcare': 'happy',
  'fitness': 'barbell',
};

export const categoryColors: { [key: string]: string } = {
  'technical-skills': '#FF6B35',
  'technical': '#FF6B35',

  'computer-it': '#4299E1',
  'it-computer-science': '#3182CE',
  'computer-science': '#3182CE',

  'beauty-wellness': '#ED64A6',

  'hospitality': '#F6AD55',
  'healthcare': '#48BB78',
  'agriculture': '#68D391',
  'automotive': '#F56565',
  'fashion-design': '#ED64A6',
  'electrical': '#ECC94B',
  'construction': '#DD6B20',

  'art-design': '#9F7AEA',

  'photography': '#4299E1',
  'music': '#805AD5',
  'business': '#4299E1',
  'carpentry': '#DD6B20',
  'electronics': '#38B2AC',
  'travel-tourism': '#4299E1',
  'retail': '#ED8936',
  'childcare': '#F687B3',
  'fitness': '#F56565',
};

function normalizeCategoryName(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

export function getCategoryIcon(categoryName: string): string {
  const key = normalizeCategoryName(categoryName);
  return categoryIcons[key] || 'school';
}

export function getCategoryColor(categoryName: string): string {
  const key = normalizeCategoryName(categoryName);
  return categoryColors[key] || '#FF6B35';
}