// Elegant Lord Ganesha line-art emblem for Gujarati Kankotri
export function GaneshaEmblem({ className = 'w-14 h-14', color = '#D4AF37' }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Crown / Mukut */}
      <path
        d="M50 12L53 22H47L50 12Z"
        fill={color}
      />
      <path
        d="M44 22C44 22 47 17 50 17C53 17 56 22 56 22"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      {/* Forehead Tilak & Trishul */}
      <path
        d="M50 25V35M47 28C47 31 50 33 50 33C50 33 53 31 53 28"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="50" cy="27" r="1.5" fill="#B91C1C" />
      {/* Ears */}
      <path
        d="M41 33C33 33 26 38 28 48C30 57 39 56 42 50"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M59 33C67 33 74 38 72 48C70 57 61 56 58 50"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Trunk (Sondh) with Modak */}
      <path
        d="M44 42C44 55 42 68 52 74C60 78 66 70 63 64C60 60 55 63 56 67"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      {/* Tusk */}
      <path
        d="M42 48L38 50"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Auspicious Modak / Ladoo */}
      <circle cx="68" cy="55" r="3" fill={color} />
    </svg>
  );
}
