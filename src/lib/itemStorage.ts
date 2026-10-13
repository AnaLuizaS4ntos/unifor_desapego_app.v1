import {
  DEFAULT_FAVORITE_IDS,
  DEFAULT_ITEM_IMAGE,
  ITEM_CATEGORIES,
  ITEM_CONDITIONS,
  OTHER_BLOCO,
  STORAGE_KEYS,
  UNIFOR_BLOCOS,
} from '../constants';
import { INITIAL_MARKETPLACE_ITEMS } from '../data/mockItems';
import { MarketplaceItem, UniforBloco } from '../types';
import { readJSON, removeKey, writeJSON } from './storage';

/**
 * Persistência dos anúncios do usuário, favoritos e perfil do vendedor.
 * Tudo que vem do localStorage é tratado como "não confiável": é validado e
 * normalizado antes de chegar ao React (antes, um JSON estranho derrubava a tela).
 */

type UnknownRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is UnknownRecord =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const asString = (value: unknown, fallback = ''): string =>
  typeof value === 'string' ? value : fallback;

const asNumber = (value: unknown, fallback = 0): number =>
  typeof value === 'number' && Number.isFinite(value) ? value : fallback;

const asStringArray = (value: unknown): string[] =>
  Array.isArray(value) ? value.filter((v): v is string => typeof v === 'string') : [];

function oneOf<T extends string>(allowed: readonly T[], value: unknown, fallback: T): T {
  return typeof value === 'string' && (allowed as readonly string[]).includes(value)
    ? (value as T)
    : fallback;
}

const ALL_BLOCOS: readonly UniforBloco[] = [...UNIFOR_BLOCOS, OTHER_BLOCO];

/** Ids antigos eram "unifor-item-<timestamp>": dá para recuperar a data de publicação. */
function legacyPublishedAt(raw: UnknownRecord): number {
  const fromField = asNumber(raw.publishedAt, NaN);
  if (Number.isFinite(fromField)) return fromField;

  const match = /(\d{12,})$/.exec(asString(raw.id));
  return match ? Number(match[1]) : Date.now();
}

/**
 * Converte qualquer objeto salvo (inclusive no formato antigo) em um MarketplaceItem válido.
 * Formato antigo: category/condition "Doação" e createdAt em texto.
 */
export function normalizeStoredItem(raw: unknown): MarketplaceItem | null {
  if (!isRecord(raw)) return null;

  const id = asString(raw.id);
  const title = asString(raw.title).trim();
  if (!id || !title) return null;

  const seller = isRecord(raw.seller) ? raw.seller : {};
  const price = Math.max(0, asNumber(raw.price));
  const images = asStringArray(raw.images);

  return {
    id,
    title,
    description: asString(raw.description),
    price,
    isDonation: raw.isDonation === true || price === 0,
    category: oneOf(ITEM_CATEGORIES, raw.category, 'Outros'),
    condition: oneOf(ITEM_CONDITIONS, raw.condition, 'Usado - Bom Estado'),
    location: oneOf(ALL_BLOCOS, raw.location, OTHER_BLOCO),
    images: images.length > 0 ? images : [DEFAULT_ITEM_IMAGE],
    seller: {
      name: asString(seller.name, 'Estudante UNIFOR'),
      course: asString(seller.course),
      semester: asString(seller.semester, 'Ativo'),
      whatsapp: asString(seller.whatsapp).replace(/\D/g, ''),
      avatarUrl: typeof seller.avatarUrl === 'string' ? seller.avatarUrl : undefined,
      verifiedStudent: seller.verifiedStudent === true,
    },
    publishedAt: legacyPublishedAt(raw),
    views: asNumber(raw.views),
    favoritesCount: asNumber(raw.favoritesCount),
    featured: raw.featured === true ? true : undefined,
    tags: asStringArray(raw.tags),
  };
}

function normalizeList(list: unknown[]): MarketplaceItem[] {
  return list.map(normalizeStoredItem).filter((item): item is MarketplaceItem => item !== null);
}

/**
 * Carrega os anúncios criados pelo usuário.
 * Na primeira execução após a atualização, migra a chave antiga: descarta os itens de
 * exemplo (que agora vêm do código) e mantém só o que o usuário publicou.
 */
export function loadUserItems(): MarketplaceItem[] {
  const current = readJSON(STORAGE_KEYS.userItems);
  if (Array.isArray(current)) return normalizeList(current);

  const legacy = readJSON(STORAGE_KEYS.legacyItems);
  if (Array.isArray(legacy)) {
    const sampleIds = new Set(INITIAL_MARKETPLACE_ITEMS.map((item) => item.id));
    const userOnly = legacy.filter(
      (raw) => !(isRecord(raw) && typeof raw.id === 'string' && sampleIds.has(raw.id)),
    );
    const migrated = normalizeList(userOnly);
    if (writeJSON(STORAGE_KEYS.userItems, migrated)) removeKey(STORAGE_KEYS.legacyItems);
    return migrated;
  }

  return [];
}

export function saveUserItems(items: MarketplaceItem[]): boolean {
  return writeJSON(STORAGE_KEYS.userItems, items);
}

export function loadFavorites(): string[] {
  const saved = readJSON(STORAGE_KEYS.favorites);
  return Array.isArray(saved) ? asStringArray(saved) : [...DEFAULT_FAVORITE_IDS];
}

export function saveFavorites(ids: string[]): boolean {
  return writeJSON(STORAGE_KEYS.favorites, ids);
}

export interface SellerProfile {
  name: string;
  course: string;
  whatsapp: string;
}

/** Lembra os dados do vendedor para ele não digitar tudo a cada anúncio. */
export function loadSellerProfile(): SellerProfile {
  const saved = readJSON(STORAGE_KEYS.sellerProfile);
  if (!isRecord(saved)) return { name: '', course: '', whatsapp: '' };
  return {
    name: asString(saved.name),
    course: asString(saved.course),
    whatsapp: asString(saved.whatsapp),
  };
}

export function saveSellerProfile(profile: SellerProfile): boolean {
  return writeJSON(STORAGE_KEYS.sellerProfile, profile);
}

