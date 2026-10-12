// Change ACTIVE to: 'civic' | 'token' | 'warm'
export type Palette = {
    bg: string; surface: string; border: string; text: string; muted: string;
    primary: string; onPrimary: string; accent: string; danger: string;
    radius: number; dark: boolean;
  };
  
  export const palettes: Record<string, Palette> = {
    civic: {
      bg: '#F7F8F4', surface: '#FFFFFF', border: '#DCE3DA', text: '#1D2A22', muted: '#6B7267',
      primary: '#2F7D5A', onPrimary: '#FFFFFF', accent: '#1A73A6', danger: '#B3261E',
      radius: 12, dark: false,
    },
    token: {
      bg: '#12140F', surface: '#1F2318', border: '#2C3123', text: '#EDEFE6', muted: '#8B9184',
      primary: '#8FE388', onPrimary: '#0F150C', accent: '#C8FF4D', danger: '#FF7A70',
      radius: 16, dark: true,
    },
    warm: {
      bg: '#F3EEE3', surface: '#FFFDF7', border: '#E3D9C1', text: '#33301F', muted: '#7A7458',
      primary: '#5C7A52', onPrimary: '#FFFFFF', accent: '#C76B4A', danger: '#B3261E',
      radius: 18, dark: false,
    },
  };
  
  export const ACTIVE: keyof typeof palettes = 'civic';
  export const theme = palettes[ACTIVE];
  