'use client';

interface OrderProgressProps {
  status: string;
  variant?: 'user' | 'admin';
}

const USER_STEPS = [
  { label: 'Pesan', icon: '📝' },
  { label: 'Konfirmasi', icon: '✅' },
  { label: 'Bayar', icon: '💳' },
  { label: 'Lunas', icon: '💰' },
  { label: 'Diantar', icon: '🚚' },
  { label: 'Sampai', icon: '🎉' },
];

const ADMIN_STEPS = [
  { label: 'Masuk', icon: '📥' },
  { label: 'Dikonfirmasi', icon: '✅' },
  { label: 'Verifikasi', icon: '🔍' },
  { label: 'Lunas', icon: '💰' },
  { label: 'Dikirim', icon: '🚚' },
  { label: 'Selesai', icon: '🏁' },
];

function getStepIndex(status: string): number {
  const map: Record<string, number> = {
    PENDING: 0,
    WAITING_PAYMENT: 1,
    PAYMENT_REVIEW: 2,
    PAID: 3,
    DELIVERING: 4,
    DELIVERED: 5,
    COMPLETED: 5,
  };
  return map[status] ?? 0;
}

export default function OrderProgress({ status, variant = 'user' }: OrderProgressProps) {
  if (status === 'CANCELLED') {
    return (
      <div className="order-cancelled-banner">
        <span style={{ fontSize: 22 }}>🚫</span>
        <span>Pesanan ini telah dibatalkan</span>
      </div>
    );
  }

  const steps = variant === 'admin' ? ADMIN_STEPS : USER_STEPS;
  const current = getStepIndex(status);

  return (
    <div className={`order-progress order-progress-${variant}`}>
      {steps.map((step, idx) => {
        const done = idx <= current;
        const isActive = idx === current;
        return (
          <div key={idx} className="op-step">
            {idx > 0 && (
              <div className={`op-line ${idx <= current ? 'op-line-done' : ''}`} />
            )}
            <div className={`op-circle ${done ? 'op-circle-done' : ''} ${isActive ? 'op-circle-active' : ''}`}>
              <span>{step.icon}</span>
            </div>
            <div className={`op-label ${done ? 'op-label-done' : ''}`}>{step.label}</div>
          </div>
        );
      })}
    </div>
  );
}