/**
 * Acesso seguro ao localStorage.
 * Nunca lança erro: modo anônimo, cota cheia ou JSON corrompido viram "sem dado" / false.
 */

export function readJSON(key: string): unknown | null {
  try {
    const raw = window.localStorage.getItem(key);
    return raw === null ? null : JSON.parse(raw);
  } catch (error) {
    console.warn(`[storage] não foi possível ler "${key}"`, error);
    return null;
  }
}

export function writeJSON(key: string, value: unknown): boolean {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.warn(`[storage] não foi possível salvar "${key}"`, error);
    return false;
  }
}

export function removeKey(key: string): void {
  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.warn(`[storage] não foi possível remover "${key}"`, error);
  }
}

