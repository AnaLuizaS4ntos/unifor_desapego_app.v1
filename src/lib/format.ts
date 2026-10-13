/** Funções puras de formatação (sem React, fáceis de testar). */

export function formatPrice(price: number): string {
  const hasCents = !Number.isInteger(price);
  return `R$ ${price.toLocaleString('pt-BR', {
    minimumFractionDigits: hasCents ? 2 : 0,
    maximumFractionDigits: 2,
  })}`;
}

/** Converte um timestamp em texto relativo: "Agora mesmo", "Há 2 horas", "Ontem"... */
export function formatRelativeTime(timestamp: number, now: number = Date.now()): string {
  const diff = Math.max(0, now - timestamp);
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return 'Agora mesmo';
  if (minutes < 60) return `Há ${minutes} min`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Há ${hours} ${hours === 1 ? 'hora' : 'horas'}`;

  const days = Math.floor(hours / 24);
  if (days === 1) return 'Ontem';
  if (days < 30) return `Há ${days} dias`;

  return new Date(timestamp).toLocaleDateString('pt-BR');
}

export function getAvatarUrl(name: string, avatarUrl?: string): string {
  return avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`;
}

