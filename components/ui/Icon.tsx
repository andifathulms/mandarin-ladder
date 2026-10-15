type P = { size?: number; className?: string };
const base = (size: number, className?: string) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  focusable: false,
  className,
});

export const IconArrowRight = ({ size = 20, className }: P) => (
  <svg {...base(size, className)}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);
export const IconArrowLeft = ({ size = 20, className }: P) => (
  <svg {...base(size, className)}>
    <path d="M19 12H5M11 6l-6 6 6 6" />
  </svg>
);
export const IconClose = ({ size = 20, className }: P) => (
  <svg {...base(size, className)}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);
export const IconCheck = ({ size = 20, className, draw }: P & { draw?: boolean }) => (
  <svg {...base(size, className)} strokeWidth={2.5}>
    <path d="M5 12.5l4.5 4.5L19 7.5" className={draw ? 'check-draw' : undefined} />
  </svg>
);
export const IconPlay = ({ size = 20, className }: P) => (
  <svg {...base(size, className)} fill="currentColor" stroke="none">
    <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z" />
  </svg>
);
export const IconSettings = ({ size = 22, className }: P) => (
  <svg {...base(size, className)}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);
export const IconBook = ({ size = 22, className }: P) => (
  <svg {...base(size, className)}>
    <path d="M5 4.5h10a3 3 0 0 1 3 3V20H8a3 3 0 0 1-3-3zM5 17a3 3 0 0 1 3-3h10" />
  </svg>
);
export const IconChat = ({ size = 22, className }: P) => (
  <svg {...base(size, className)}>
    <path d="M4 5.5h16v10H9l-5 4z" />
    <path d="M8 9.5h8M8 12.5h5" />
  </svg>
);
export const IconCards = ({ size = 22, className }: P) => (
  <svg {...base(size, className)}>
    <rect x="6" y="7" width="12" height="14" rx="2" />
    <path d="M9 4h10a2 2 0 0 1 2 2v12" />
  </svg>
);
export const IconLadder = ({ size = 22, className }: P) => (
  <svg {...base(size, className)}>
    <path d="M7 3v18M17 3v18M7 7.5h10M7 12h10M7 16.5h10" />
  </svg>
);
export const IconReview = ({ size = 22, className }: P) => (
  <svg {...base(size, className)}>
    <path d="M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3M18 3v4h-4M6 21v-4h4" />
  </svg>
);
export const IconUser = ({ size = 22, className }: P) => (
  <svg {...base(size, className)}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21a8 8 0 0 1 16 0" />
  </svg>
);
export const IconFlag = ({ size = 20, className }: P) => (
  <svg {...base(size, className)}>
    <path d="M6 21V4M6 4h11l-2 4 2 4H6" />
  </svg>
);
export const IconSearch = ({ size = 18, className }: P) => (
  <svg {...base(size, className)}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="M16 16l4 4" />
  </svg>
);
export const IconInfo = ({ size = 20, className }: P) => (
  <svg {...base(size, className)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v6M12 7.5v.5" />
  </svg>
);
export const IconChevron = ({ size = 18, className }: P) => (
  <svg {...base(size, className)}>
    <path d="M9 6l6 6-6 6" />
  </svg>
);
export const IconHalf = ({ size = 18, className }: P) => (
  <svg {...base(size, className)}>
    <circle cx="12" cy="12" r="8" />
    <path d="M12 4a8 8 0 0 1 0 16z" fill="currentColor" stroke="none" />
  </svg>
);
export const IconCircle = ({ size = 18, className }: P) => (
  <svg {...base(size, className)}>
    <circle cx="12" cy="12" r="8" />
  </svg>
);
export const IconDot = ({ size = 18, className }: P) => (
  <svg {...base(size, className)}>
    <circle cx="12" cy="12" r="8" />
    <circle cx="12" cy="12" r="2.5" fill="currentColor" stroke="none" />
  </svg>
);
