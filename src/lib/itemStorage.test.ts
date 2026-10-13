import { beforeEach, describe, expect, it, vi } from 'vitest';
import { STORAGE_KEYS } from '../constants';

/** localStorage falso em memória (os testes rodam em Node, onde ele não existe). */
function installFakeLocalStorage(initial: Record<string, string> = {}) {
  const store = new Map<string, string>(Object.entries(initial));
  const fake = {
    getItem: (key: string) => (store.has(key) ? (store.get(key) as string) : null),
    setItem: (key: string, value: string) => void store.set(key, value),
    removeItem: (key: string) => void store.delete(key),
  };
  vi.stubGlobal('window', { localStorage: fake });
  return store;
}

async function importStorage() {
  vi.resetModules();
  return import('./itemStorage');
}

beforeEach(() => {
  vi.unstubAllGlobals();
});

describe('loadUserItems', () => {
  it('não quebra com JSON corrompido nem com "null"', async () => {
    installFakeLocalStorage({ [STORAGE_KEYS.userItems]: '{quebrado' });
    expect((await importStorage()).loadUserItems()).toEqual([]);

    installFakeLocalStorage({ [STORAGE_KEYS.userItems]: 'null' });
    expect((await importStorage()).loadUserItems()).toEqual([]);
  });

  it('descarta itens inválidos e conserta campos faltando', async () => {
    installFakeLocalStorage({
      [STORAGE_KEYS.userItems]: JSON.stringify([{ foo: 1 }, 'x', { id: 'a', title: 'Ok', price: 10 }]),
    });
    const items = (await importStorage()).loadUserItems();
    expect(items).toHaveLength(1);
    expect(items[0].title).toBe('Ok');
    expect(items[0].images.length).toBeGreaterThan(0);
    expect(items[0].tags).toEqual([]);
  });

  it('migra a chave antiga: remove os exemplos e converte o formato antigo', async () => {
    const legacy = [
      { id: 'unifor-item-1', title: 'Exemplo antigo', price: 5 },
      {
        id: 'unifor-item-1760000000000',
        title: 'Meu livro',
        description: 'bom',
        price: 0,
        isDonation: true,
        category: 'Doação',
        condition: 'Doação',
        location: 'Bloco N (CCT)',
        images: ['https://x.com/a.png'],
        seller: { name: 'Ana', course: 'Direito', whatsapp: '5585999887766', verifiedStudent: true },
        createdAt: 'Agora mesmo',
        views: 1,
        favoritesCount: 0,
        tags: ['doacao'],
      },
    ];
    const store = installFakeLocalStorage({ [STORAGE_KEYS.legacyItems]: JSON.stringify(legacy) });

    const items = (await importStorage()).loadUserItems();

    expect(items).toHaveLength(1);
    expect(items[0].title).toBe('Meu livro');
    expect(items[0].isDonation).toBe(true);
    expect(items[0].category).toBe('Outros'); // "Doação" deixou de ser categoria
    expect(items[0].condition).toBe('Usado - Bom Estado'); // nem condição
    expect(items[0].publishedAt).toBe(1760000000000); // recuperado do id antigo
    expect(store.has(STORAGE_KEYS.legacyItems)).toBe(false);
    expect(store.has(STORAGE_KEYS.userItems)).toBe(true);
  });
});

describe('favoritos e perfil', () => {
  it('usa os favoritos padrão só quando nunca salvou nada', async () => {
    installFakeLocalStorage();
    expect((await importStorage()).loadFavorites()).toEqual(['unifor-item-2', 'unifor-item-1']);

    installFakeLocalStorage({ [STORAGE_KEYS.favorites]: '[]' });
    expect((await importStorage()).loadFavorites()).toEqual([]);
  });

  it('ignora favoritos que não são texto', async () => {
    installFakeLocalStorage({ [STORAGE_KEYS.favorites]: JSON.stringify(['a', 1, null, 'b']) });
    expect((await importStorage()).loadFavorites()).toEqual(['a', 'b']);
  });

  it('perfil do vendedor vazio por padrão (sem número de terceiros)', async () => {
    installFakeLocalStorage();
    expect((await importStorage()).loadSellerProfile()).toEqual({ name: '', course: '', whatsapp: '' });
  });
});

