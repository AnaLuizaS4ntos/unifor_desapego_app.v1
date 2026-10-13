import { describe, expect, it } from 'vitest';
import { INITIAL_MARKETPLACE_ITEMS } from '../data/mockItems';
import { formatPrice, formatRelativeTime } from './format';
import { buildWhatsAppUrl, normalizeWhatsapp } from './whatsapp';
import {
  buildItemFromForm,
  isValidHttpUrl,
  NewItemFormValues,
  parsePrice,
  validateNewItemForm,
} from './newItemForm';

describe('normalizeWhatsapp', () => {
  it('adiciona o DDI 55 quando o número vem só com DDD', () => {
    expect(normalizeWhatsapp('85999887766')).toBe('5585999887766');
    expect(normalizeWhatsapp('(85) 99988-7766')).toBe('5585999887766');
  });

  it('mantém números que já têm 55', () => {
    expect(normalizeWhatsapp('5585999887766')).toBe('5585999887766');
  });

  it('rejeita números inválidos', () => {
    expect(normalizeWhatsapp('')).toBeNull();
    expect(normalizeWhatsapp('12345')).toBeNull();
    expect(normalizeWhatsapp('1585999887766')).toBeNull();
  });
});

describe('buildWhatsAppUrl', () => {
  it('gera link wa.me com a mensagem codificada', () => {
    const url = buildWhatsAppUrl(INITIAL_MARKETPLACE_ITEMS[0]);
    expect(url).toContain('https://wa.me/5585988776655?text=');
    expect(url).toContain(encodeURIComponent('Lucas Ferreira'));
  });

  it('retorna null se o vendedor tem número inválido', () => {
    const item = { ...INITIAL_MARKETPLACE_ITEMS[0], seller: { ...INITIAL_MARKETPLACE_ITEMS[0].seller, whatsapp: '123' } };
    expect(buildWhatsAppUrl(item)).toBeNull();
  });
});

describe('formatRelativeTime / formatPrice', () => {
  const now = 1_000_000_000_000;
  it('formata tempos relativos', () => {
    expect(formatRelativeTime(now - 10_000, now)).toBe('Agora mesmo');
    expect(formatRelativeTime(now - 5 * 60_000, now)).toBe('Há 5 min');
    expect(formatRelativeTime(now - 3_600_000, now)).toBe('Há 1 hora');
    expect(formatRelativeTime(now - 2 * 3_600_000, now)).toBe('Há 2 horas');
    expect(formatRelativeTime(now - 24 * 3_600_000, now)).toBe('Ontem');
    expect(formatRelativeTime(now - 3 * 24 * 3_600_000, now)).toBe('Há 3 dias');
  });

  it('não quebra com datas no futuro', () => {
    expect(formatRelativeTime(now + 99_999, now)).toBe('Agora mesmo');
  });

  it('formata preços inteiros e com centavos', () => {
    expect(formatPrice(110)).toBe('R$ 110');
    expect(formatPrice(45.5)).toBe('R$ 45,50');
  });
});

const validValues: NewItemFormValues = {
  title: '  Livro de Cálculo  ',
  description: '',
  price: '45,50',
  isDonation: false,
  category: 'Livros & Apostilas',
  condition: 'Seminovo',
  location: 'Bloco N (CCT)',
  imageUrl: '',
  sellerName: 'Ana',
  sellerCourse: 'Direito',
  sellerWhatsapp: '85999887766',
};

describe('validateNewItemForm', () => {
  it('aceita um formulário válido', () => {
    expect(validateNewItemForm(validValues)).toEqual({});
  });

  it('exige título, nome, curso e WhatsApp válido', () => {
    const errors = validateNewItemForm({
      ...validValues,
      title: ' ',
      sellerName: '',
      sellerCourse: '',
      sellerWhatsapp: '',
    });
    expect(Object.keys(errors).sort()).toEqual(['sellerCourse', 'sellerName', 'sellerWhatsapp', 'title']);
  });

  it('preço vazio ou zero NÃO vira doação silenciosamente', () => {
    expect(validateNewItemForm({ ...validValues, price: '' }).price).toBeDefined();
    expect(validateNewItemForm({ ...validValues, price: '0' }).price).toBeDefined();
    expect(validateNewItemForm({ ...validValues, price: '-5' }).price).toBeDefined();
  });

  it('doação não exige preço', () => {
    expect(validateNewItemForm({ ...validValues, isDonation: true, price: '' })).toEqual({});
  });

  it('valida a URL da imagem', () => {
    expect(validateNewItemForm({ ...validValues, imageUrl: 'foto.png' }).imageUrl).toBeDefined();
    expect(validateNewItemForm({ ...validValues, imageUrl: 'javascript:alert(1)' }).imageUrl).toBeDefined();
    expect(validateNewItemForm({ ...validValues, imageUrl: 'https://site.com/a.png' })).toEqual({});
    expect(isValidHttpUrl('ftp://x.com')).toBe(false);
  });
});

describe('parsePrice / buildItemFromForm', () => {
  it('aceita vírgula decimal', () => {
    expect(parsePrice('45,50')).toBe(45.5);
    expect(parsePrice('abc')).toBeNull();
    expect(parsePrice('')).toBeNull();
  });

  it('item pago mantém a categoria escolhida (não vira "Doação")', () => {
    const item = buildItemFromForm(validValues, 123);
    expect(item.category).toBe('Livros & Apostilas');
    expect(item.isDonation).toBe(false);
    expect(item.price).toBe(45.5);
    expect(item.title).toBe('Livro de Cálculo');
    expect(item.publishedAt).toBe(123);
    expect(item.seller.whatsapp).toBe('5585999887766');
    expect(item.seller.verifiedStudent).toBe(false);
  });

  it('doação mantém categoria e estado reais e tem preço 0', () => {
    const item = buildItemFromForm({ ...validValues, isDonation: true, price: '99' }, 1);
    expect(item.isDonation).toBe(true);
    expect(item.price).toBe(0);
    expect(item.category).toBe('Livros & Apostilas');
    expect(item.condition).toBe('Seminovo');
  });

  it('gera ids diferentes a cada chamada', () => {
    const ids = new Set(Array.from({ length: 50 }, () => buildItemFromForm(validValues).id));
    expect(ids.size).toBe(50);
  });
});

