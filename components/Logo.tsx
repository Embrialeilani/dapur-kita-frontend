export default function Logo({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className="logo-icon">
      <path d="M5 13 L27 13 L25 27 Q25 29 23 29 L9 29 Q7 29 7 27 Z" fill="#c8985a" />
      <circle cx="5" cy="16" r="2" fill="none" stroke="#8b5a2b" strokeWidth="2" />
      <circle cx="27" cy="16" r="2" fill="none" stroke="#8b5a2b" strokeWidth="2" />
      <rect x="4" y="11" width="24" height="3" fill="#8b5a2b" rx="1" />
      <path
        d="M11 6 Q11 3 13 3 Q15 3 15 6 Q15 8 13 8"
        stroke="#c8985a"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M16 4 Q16 1 18 1 Q20 1 20 4 Q20 6 18 6"
        stroke="#c8985a"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}
