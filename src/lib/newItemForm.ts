import { DEFAULT_ITEM_IMAGE } from '../constants';
import { ItemCategory, ItemCondition, MarketplaceItem, UniforBloco } from '../types';
import { normalizeWhatsapp } from './whatsapp';

/** Valores brutos do formulário "Desapegar de um Item". */
export interface NewItemFormValues {
  title: string;
  description: string;
  price: string;
  isDonation: boolean;
  category: ItemCategory;
  condition: ItemCondition;
  location: UniforBloco;
  imageUrl: string;
  sellerName: string;
  sellerCourse: string;
  sellerWhatsapp: string;
}

export type NewItemFormField =
  | 'title'
  | 'price'
  | 'imageUrl'
  | 'sellerName'
  | 'sellerCourse'
  | 'sellerWhatsapp';

export type NewItemFormErrors = Partial<Record<NewItemFormField, string>>;

export const MAX_TITLE_LENGTH = 100;

/** Aceita "45", "45.5" e "45,50". Retorna null se não for número. */
export function parsePrice(raw: string): number | null {
  const trimmed = raw.trim();
  if (trimmed === '') return null;
  const value = Number(trimmed.replace(',', '.'));
  return Number.isFinite(value) ? value : null;
}

export function isValidHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

export function validateNewItemForm(values: NewItemFormValues): NewItemFormErrors {
  const errors: NewItemFormErrors = {};

  if (!values.title.trim()) {
    errors.title = 'Informe um título para o anúncio.';
  } else if (values.title.trim().length > MAX_TITLE_LENGTH) {
    errors.title = `O título pode ter no máximo ${MAX_TITLE_LENGTH} caracteres.`;
  }

  if (!values.isDonation) {
    const price = parsePrice(values.price);
    if (price === null) {
      errors.price = 'Informe o preço ou marque o item como doação.';
    } else if (price <= 0) {
      errors.price = 'O preço deve ser maior que zero. Para item grátis, marque como doação.';
    }
  }

  if (values.imageUrl.trim() && !isValidHttpUrl(values.imageUrl.trim())) {
    errors.imageUrl = 'Cole um link válido, começando com http:// ou https://.';
  }

  if (!values.sellerName.trim()) errors.sellerName = 'Informe seu nome.';
  if (!values.sellerCourse.trim()) errors.sellerCourse = 'Informe seu curso.';

  if (!normalizeWhatsapp(values.sellerWhatsapp)) {
    errors.sellerWhatsapp = 'Informe um WhatsApp válido com DDD (ex: 85999887766).';
  }

  return errors;
}

export function createItemId(): string {
  return `unifor-user-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

/** Converte o formulário (já validado) em um anúncio. */
export function buildItemFromForm(
  values: NewItemFormValues,
  now: number = Date.now(),
): MarketplaceItem {
  const price = values.isDonation ? 0 : (parsePrice(values.price) ?? 0);

  return {
    id: createItemId(),
    title: values.title.trim(),
    description: values.description.trim(),
    price,
    isDonation: values.isDonation,
    category: values.category,
    condition: values.condition,
    location: values.location,
    images: [values.imageUrl.trim() || DEFAULT_ITEM_IMAGE],
    seller: {
      name: values.sellerName.trim(),
      course: values.sellerCourse.trim(),
      semester: 'Ativo',
      whatsapp: normalizeWhatsapp(values.sellerWhatsapp) ?? '',
      // Qualquer pessoa pode digitar qualquer nome: não existe verificação real ainda.
      verifiedStudent: false,
    },
    publishedAt: now,
    views: 1,
    favoritesCount: 0,
    tags: [
      values.category.toLowerCase(),
      values.location.toLowerCase(),
      ...(values.isDonation ? ['doacao'] : []),
    ],
  };
}

