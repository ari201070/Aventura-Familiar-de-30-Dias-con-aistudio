
// Utilidades para parsing de markdown y otras funciones helper

export const parseMarkdownBasic = (text: string): string => {
  // Conversión básica de markdown a HTML
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br>')
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>');
};

export const formatCurrency = (amount: number, currency: string): string => {
  const currencySymbols: Record<string, string> = {
    ARS: '$',
    USD: 'US$',
    EUR: '€',
    ILS: '₪'
  };
  
  return `${currencySymbols[currency] || currency} ${amount.toLocaleString()}`;
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};
