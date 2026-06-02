// ============================================
// HELPERS - Format & Status
// ============================================

export function formatRupiah(n: number): string {
  return 'Rp ' + (n || 0).toLocaleString('id-ID');
}

export function formatDate(d: string | Date): string {
  if (!d) return '-';
  return new Date(d).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function formatDateTime(d: string | Date): string {
  if (!d) return '-';
  return new Date(d).toLocaleString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function statusLabel(s: string): string {
  const map: Record<string, string> = {
    PENDING: 'Menunggu Konfirmasi',
    WAITING_PAYMENT: 'Tunggu Pembayaran',
    PAYMENT_REVIEW: 'Verifikasi Pembayaran',
    PAID: 'Lunas',
    CONFIRMED: 'Dikonfirmasi',
    DELIVERING: 'Sedang Diantar',
    DELIVERED: 'Sudah Sampai',
    COMPLETED: 'Selesai',
    CANCELLED: 'Dibatalkan',
  };
  return map[s] || s;
}

export function statusBadge(s: string): string {
  const map: Record<string, string> = {
    PENDING: 'warning',
    WAITING_PAYMENT: 'info',
    PAYMENT_REVIEW: 'info',
    PAID: 'success',
    CONFIRMED: 'success',
    DELIVERING: 'info',
    DELIVERED: 'success',
    COMPLETED: 'success',
    CANCELLED: 'danger',
  };
  return map[s] || 'default';
}

// Cart helpers (localStorage)
const CART_KEY = 'dk_cart';

export interface CartItem {
  packageId: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

export function getCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
}

export function saveCart(items: CartItem[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

export function addToCart(item: CartItem): void {
  const cart = getCart();
  const idx = cart.findIndex((i) => i.packageId === item.packageId);
  if (idx >= 0) {
    cart[idx].quantity += item.quantity;
  } else {
    cart.push(item);
  }
  saveCart(cart);
}

export function clearCart(): void {
  saveCart([]);
}

export function cartTotal(items: CartItem[]): number {
  return items.reduce((s, i) => s + i.price * i.quantity, 0);
}
