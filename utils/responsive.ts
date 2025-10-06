import { Dimensions } from 'react-native';

// Obtém as dimensões atuais da tela
export const getScreenDimensions = () => {
  const { width, height } = Dimensions.get('window');
  return { width, height };
};

// Verifica se é um dispositivo pequeno (iPhone SE, etc.)
export const isSmallDevice = () => {
  const { width } = getScreenDimensions();
  return width < 375;
};

// Verifica se é um dispositivo médio (iPhone padrão)
export const isMediumDevice = () => {
  const { width } = getScreenDimensions();
  return width >= 375 && width < 414;
};

// Verifica se é um dispositivo grande (iPhone Plus, etc.)
export const isLargeDevice = () => {
  const { width } = getScreenDimensions();
  return width >= 414;
};

// Verifica se é um tablet
export const isTablet = () => {
  const { width } = getScreenDimensions();
  return width >= 768;
};

// Verifica se é um dispositivo com tela baixa
export const isShortDevice = () => {
  const { height } = getScreenDimensions();
  return height < 700;
};

// Função para obter valores responsivos baseados no tamanho da tela
export const getResponsiveValue = (small: number, medium: number, large?: number) => {
  if (isSmallDevice()) return small;
  if (isMediumDevice()) return medium;
  return large || medium;
};

// Função para obter padding responsivo
export const getResponsivePadding = () => {
  if (isSmallDevice()) return 16;
  if (isMediumDevice()) return 20;
  return 24;
};

// Função para obter tamanho de fonte responsivo
export const getResponsiveFontSize = (baseSize: number) => {
  const ratio = isSmallDevice() ? 0.9 : isMediumDevice() ? 1 : 1.1;
  return Math.round(baseSize * ratio);
};

// Função para obter margin bottom responsivo
export const getResponsiveMargin = (baseMargin: number) => {
  if (isSmallDevice()) return baseMargin * 0.8;
  if (isMediumDevice()) return baseMargin;
  return baseMargin * 1.2;
};

// Função para obter largura de card responsiva
export const getCardWidth = (totalWidth: number, margin: number, columns: number = 2) => {
  const availableWidth = totalWidth - (margin * 2);
  const cardMargin = isSmallDevice() ? 8 : 10;
  return (availableWidth - (cardMargin * (columns - 1))) / columns;
};

// Função para verificar se deve usar layout de coluna única
export const shouldUseColumnLayout = () => {
  return isSmallDevice();
};

// Constantes de breakpoints
export const BREAKPOINTS = {
  SMALL: 375,
  MEDIUM: 414,
  LARGE: 768,
  EXTRA_LARGE: 1024,
};

// Função para obter espaçamento baseado no tamanho da tela
export const getSpacing = {
  xs: () => getResponsiveValue(4, 6, 8),
  sm: () => getResponsiveValue(8, 12, 16),
  md: () => getResponsiveValue(12, 16, 20),
  lg: () => getResponsiveValue(16, 20, 24),
  xl: () => getResponsiveValue(20, 24, 32),
  xxl: () => getResponsiveValue(24, 32, 40),
};