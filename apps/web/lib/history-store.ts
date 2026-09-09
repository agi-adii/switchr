export interface HistoryItem {
  id: string;
  fileName: string;
  fromFormat: string;
  toFormat: string;
  originalSize: number;
  convertedSize?: number;
  timestamp: number;
  downloadUrl?: string;
  category: string;
}

const STORAGE_KEY = "switchr_conversion_history";

export function getHistory(): HistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveHistoryItem(item: Omit<HistoryItem, "id" | "timestamp">): HistoryItem {
  if (typeof window === "undefined") {
    return { ...item, id: Math.random().toString(), timestamp: Date.now() };
  }

  const current = getHistory();
  const newItem: HistoryItem = {
    ...item,
    id: Math.random().toString(36).substring(2, 9),
    timestamp: Date.now(),
  };

  // Keep last 30 conversions
  const updated = [newItem, ...current].slice(0, 30);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn("Local storage full or disabled", e);
  }

  return newItem;
}

export function deleteHistoryItem(id: string): void {
  if (typeof window === "undefined") return;
  const current = getHistory();
  const updated = current.filter((item) => item.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function clearHistory(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}
