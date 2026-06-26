const getCropImage = (cropName: string) => {
  const lower = cropName?.toLowerCase() || '';

  if (lower.includes('maize') || lower.includes('corn')) return 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?q=80&w=1000&auto=format&fit=crop';
  if (lower.includes('wheat') || lower.includes('barley') || lower.includes('rye') || lower.includes('oat')) return 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=1000&auto=format&fit=crop';
  if (lower.includes('rice') || lower.includes('paddy')) return 'https://images.unsplash.com/photo-1536630596251-245f32a537be?q=80&w=1000&auto=format&fit=crop';
  if (lower.includes('sorghum') || lower.includes('millet')) return 'https://images.unsplash.com/photo-1628151015968-3a4429e9ef04?q=80&w=1000&auto=format&fit=crop';

  if (lower.includes('soy')) return 'https://images.unsplash.com/photo-1599940824399-b87987ced72a?q=80&w=1000&auto=format&fit=crop';
  if (lower.includes('bean') || lower.includes('legume') || lower.includes('pea')) return 'https://images.unsplash.com/photo-1591466068305-64906f363065?q=80&w=1000&auto=format&fit=crop';
  if (lower.includes('peanut') || lower.includes('groundnut')) return 'https://images.unsplash.com/photo-1564856627670-34907a972dd4?q=80&w=1000&auto=format&fit=crop';

  if (lower.includes('coffee')) return 'https://images.unsplash.com/photo-1584345604325-f5091269a0d1?q=80&w=1000&auto=format&fit=crop';
  if (lower.includes('cotton')) return 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?q=80&w=1000&auto=format&fit=crop';
  if (lower.includes('tea')) return 'https://images.unsplash.com/photo-1563205764-647629681bb9?q=80&w=1000&auto=format&fit=crop';
  if (lower.includes('cane') || lower.includes('sugar')) return 'https://images.unsplash.com/photo-1629814596319-21623fb04771?q=80&w=1000&auto=format&fit=crop';

  if (lower.includes('potato') || lower.includes('tuber')) return 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?q=80&w=1000&auto=format&fit=crop';
  if (lower.includes('tomato')) return 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=1000&auto=format&fit=crop';
  if (lower.includes('onion') || lower.includes('garlic')) return 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?q=80&w=1000&auto=format&fit=crop';
  if (lower.includes('carrot')) return 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?q=80&w=1000&auto=format&fit=crop';
  if (lower.includes('lettuce') || lower.includes('leaf') || lower.includes('spinach')) return 'https://images.unsplash.com/photo-1626202378907-d4fa249ebc90?q=80&w=1000&auto=format&fit=crop';
  if (lower.includes('pepper') || lower.includes('chili')) return 'https://images.unsplash.com/photo-1563514227149-561c2c018c16?q=80&w=1000&auto=format&fit=crop';

  if (lower.includes('fruit') || lower.includes('apple') || lower.includes('orchard')) return 'https://images.unsplash.com/photo-1523301346795-8afc46477f61?q=80&w=1000&auto=format&fit=crop';
  if (lower.includes('grape') || lower.includes('vine')) return 'https://images.unsplash.com/photo-1596363824257-4a743787729d?q=80&w=1000&auto=format&fit=crop';
  if (lower.includes('banana')) return 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?q=80&w=1000&auto=format&fit=crop';

  return 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1000&auto=format&fit=crop';
};

export default getCropImage;
