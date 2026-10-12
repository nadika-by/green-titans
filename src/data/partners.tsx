export type PartnerCategory = {
    id: string;
    icon: string;         // Ionicons name
    titleKey: 'catUtility' | 'catElectricity' | 'catKindergarten' | 'catEducation';
    ratePerToken: number; // tenge value of 1 token, for the mock cost preview
  };
  
  export const PARTNER_CATEGORIES: PartnerCategory[] = [
    { id: 'utility', icon: 'water-outline', titleKey: 'catUtility', ratePerToken: 5 },
    { id: 'electricity', icon: 'flash-outline', titleKey: 'catElectricity', ratePerToken: 5 },
    { id: 'kindergarten', icon: 'happy-outline', titleKey: 'catKindergarten', ratePerToken: 5 },
    { id: 'education', icon: 'school-outline', titleKey: 'catEducation', ratePerToken: 5 },
  ];
  