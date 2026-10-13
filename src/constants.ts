/**
 * Constantes compartilhadas do app.
 * Antes, essas listas estavam duplicadas em NewItemModal, FilterBar e CategoryBar.
 * Agora existe UMA fonte da verdade e os tipos (types.ts) são derivados daqui.
 */

export const ITEM_CATEGORIES = [
  'Eletrônicos & Hardware',
  'Livros & Apostilas',
  'Saúde & Jalecos',
  'Móveis & Kitnet',
  'Jogos & Lazer',
  'Outros',
] as const;

export const ITEM_CONDITIONS = ['Novo', 'Seminovo', 'Usado - Bom Estado'] as const;

/** Blocos que o usuário pode escolher nos selects. */
export const UNIFOR_BLOCOS = [
  'Bloco N (CCT)',
  'Bloco M (CCT)',
  'Bloco D (CCG)',
  'Bloco T (CCS)',
  'Bloco Z (CCJ)',
  'Biblioteca Central',
  'Praça de Convivência',
  'Centro de Convivência',
] as const;

/** Valor de reserva usado quando um dado salvo traz um local desconhecido. */
export const OTHER_BLOCO = 'Outro Loteamento' as const;

export const DEFAULT_ITEM_IMAGE =
  'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80';

export const STORAGE_KEYS = {
  /** v2: guarda SÓ os anúncios criados pelo usuário (os de exemplo vêm do código). */
  userItems: 'unifor_marketplace_user_items_v2',
  /** Chave antiga (guardava exemplos + anúncios do usuário). Usada só na migração. */
  legacyItems: 'unifor_marketplace_items',
  favorites: 'unifor_marketplace_favs',
  sellerProfile: 'unifor_marketplace_seller_v1',
} as const;

/** Favoritos iniciais de quem abre o app pela primeira vez (comportamento original). */
export const DEFAULT_FAVORITE_IDS: string[] = ['unifor-item-2', 'unifor-item-1'];

export const DEFAULT_COUNTRY_CODE = '55';

