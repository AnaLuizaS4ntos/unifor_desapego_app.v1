import { DEFAULT_COUNTRY_CODE } from '../constants';
import { MarketplaceItem } from '../types';
import { formatPrice } from './format';

/**
 * Normaliza um número brasileiro para o formato do wa.me (apenas dígitos, com DDI 55).
 * Aceita "85999887766", "(85) 99988-7766" ou "5585999887766".
 * Retorna null se o número não parecer válido.
 */
export function normalizeWhatsapp(input: string): string | null {
  const digits = input.replace(/\D/g, '');
  if (digits.length === 10 || digits.length === 11) return DEFAULT_COUNTRY_CODE + digits;
  if ((digits.length === 12 || digits.length === 13) && digits.startsWith(DEFAULT_COUNTRY_CODE)) {
    return digits;
  }
  return null;
}

export function buildContactMessage(item: MarketplaceItem): string {
  const priceText = item.isDonation ? 'Doação Grátis 🎁' : formatPrice(item.price);
  return `Olá ${item.seller.name}! Vi seu anúncio no UniDesapego UNIFOR: *${item.title}* (${priceText}). Ainda está disponível? Gostaria de combinar no ${item.location}!`;
}

/** Monta o link do WhatsApp do vendedor. Retorna null se o número for inválido. */
export function buildWhatsAppUrl(item: MarketplaceItem): string | null {
  const number = normalizeWhatsapp(item.seller.whatsapp);
  if (!number) return null;
  return `https://wa.me/${number}?text=${encodeURIComponent(buildContactMessage(item))}`;
}

