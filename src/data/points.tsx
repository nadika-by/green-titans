export type Fraction = { name: string; price: number; unit: 'kg' | 'unit' };
export type CollectionPoint = {
  id: string;
  name: string;
  address: string;
  landmark?: string;
  phone: string;
  latitude: number;
  longitude: number;
  hours: string;
  status: 'open' | 'break' | 'closed';
  fractions: Fraction[];
};

// Mock data standing in for the backend. Coordinates are around central Almaty.
export const MOCK_POINTS: CollectionPoint[] = [
  {
    id: '1', name: 'Collection Point #14', address: 'Rozybakiyev St 247',
    landmark: 'Next to Mega Mall', phone: '+7 727 000 1414',
    latitude: 43.2280, longitude: 76.9290, hours: 'Open until 20:00', status: 'closed',
    fractions: [
      { name: 'Plastic (PET)', price: 45, unit: 'kg' },
      { name: 'Paper, cardboard', price: 20, unit: 'kg' },
      { name: 'Glass', price: 10, unit: 'kg' },
    ],
  },
  {
    id: '2', name: 'Collection Point #7', address: 'Dostyk Ave 89',
    landmark: 'Near Koktobe cable car', phone: '+7 727 000 1407',
    latitude: 43.2380, longitude: 76.9530, hours: 'Break 13:00–14:00', status: 'break',
    fractions: [
      { name: 'Plastic (PET)', price: 42, unit: 'kg' },
      { name: 'Aluminum cans', price: 180, unit: 'kg' },
      { name: 'Cardboard', price: 18, unit: 'kg' },
    ],
  },
  {
    id: '3', name: 'Collection Point #22', address: 'Abay Ave 150',
    landmark: 'Behind Central Stadium', phone: '+7 727 000 1422',
    latitude: 43.2180, longitude: 76.9020, hours: 'Closed today', status: 'closed',
    fractions: [
      { name: 'Plastic (PET)', price: 45, unit: 'kg' },
      { name: 'Paper, cardboard', price: 20, unit: 'kg' },
      { name: 'E-waste', price: 250, unit: 'kg' },
    ],
  },
  {
    id: '4', name: 'Collection Point #31', address: 'Seifullin St 512',
    landmark: 'Next to Green Bazaar', phone: '+7 727 000 1431',
    latitude: 43.2600, longitude: 76.9400, hours: 'Open until 19:00', status: 'open',
    fractions: [
      { name: 'Glass', price: 10, unit: 'kg' },
      { name: 'Plastic (PET)', price: 45, unit: 'kg' },
      { name: 'Textiles', price: 15, unit: 'kg' },
    ],
  },
];
