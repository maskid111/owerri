import { cn } from "@/lib/utils";

export type ArtKind = "home" | "restaurants" | "dishes" | "markets" | "culture" | "stays" | "shops" | "nearby" | "places" | "discover" | "mask";

/* Shared palette — warm, earthy and green, matching Native (no flat yellow). */
const C = {
  shadow: "#1d2b22",
  brown: "#8a4b2a",
  darkBrown: "#5c3218",
  tan: "#e0a85f",
  tanDark: "#c98a45",
  cream: "#f6e6c8",
  red: "#d6402b",
  tomato: "#e24b33",
  orange: "#f1a10c",
  rice: "#e2722f",
  green: "#3f8f4a",
  deepGreen: "#1f5b33",
  leaf: "#6cbf5a",
  pale: "#cfe3a3",
  blue: "#4f8fc0",
};

const Shadow = () => <ellipse cx="32" cy="57" rx="19" ry="2.6" fill={C.shadow} opacity=".1" />;

const Steam = ({ y = 12 }: { y?: number }) => (
  <path
    d={`M25 ${y + 2}c-2-2 2-4 0-6M32 ${y}c-2-2 2-4 0-6M39 ${y + 2}c-2-2 2-4 0-6`}
    fill="none"
    stroke="#8d9a90"
    strokeOpacity=".55"
    strokeWidth="1.6"
    strokeLinecap="round"
  />
);

const art: Record<ArtKind, React.ReactNode> = {
  /* Bowl of jollof with grilled chicken */
  restaurants: (
    <>
      <Shadow />
      <Steam y={11} />
      <path d="M11 32c2-8 10-13 21-13s19 5 21 13Z" fill={C.rice} />
      {[
        [18, 28],
        [23, 25],
        [27, 29],
        [34, 26],
        [40, 29],
        [46, 28],
        [21, 30],
      ].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="1.1" fill="#f6a35f" />
      ))}
      <path d="M30 22c4-5 12-5 15 0 2 4-1 9-6 9-4 0-6-2-9-4-2-1-2-3 0-5Z" fill="#9a4a22" />
      <path d="M34 23c3-2 7-2 9 1" fill="none" stroke="#c46a35" strokeWidth="2" strokeLinecap="round" />
      <path d="M45 22l5-4" stroke={C.cream} strokeWidth="3" strokeLinecap="round" />
      <path d="M17 25c3-4 8-4 10-1-3 3-7 3-10 1Z" fill={C.leaf} />
      <path d="M10 32h44c0 11-9.8 19-22 19S10 43 10 32Z" fill={C.deepGreen} />
      <path d="M15 40l3-3 3 3 3-3 3 3 3-3 3 3 3-3 3 3 3-3 3 3 3-3 3 3" fill="none" stroke={C.cream} strokeOpacity=".75" strokeWidth="1.4" strokeLinejoin="round" />
    </>
  ),

  /* Clay pot of soup */
  dishes: (
    <>
      <Shadow />
      <Steam y={13} />
      <path d="M11 33c-4 0-5 5-1 6M53 33c4 0 5 5 1 6" fill="none" stroke="#9c4325" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M14 30h36l-3 17c-1 5-6 8-15 8s-14-3-15-8Z" fill="#b5532f" />
      <path d="M15.5 38h33" stroke="#8a3a1f" strokeWidth="2.2" />
      {[20, 26, 32, 38, 44].map((x) => (
        <circle key={x} cx={x} cy="43" r="1.2" fill={C.cream} opacity=".85" />
      ))}
      <rect x="12" y="26" width="40" height="6" rx="3" fill="#9c4325" />
      <ellipse cx="32" cy="27" rx="17" ry="3.4" fill={C.green} />
      <circle cx="25" cy="27" r="1.3" fill={C.orange} />
      <circle cx="37" cy="26.5" r="1.1" fill={C.orange} />
      <ellipse cx="31" cy="27.2" rx="3" ry="1.2" fill={C.leaf} />
      <ellipse cx="42" cy="27.4" rx="2.4" ry="1" fill={C.leaf} />
    </>
  ),

  /* Woven basket of fresh produce */
  markets: (
    <>
      <Shadow />
      <path d="M14 34C14 14 50 14 50 34" fill="none" stroke={C.tanDark} strokeWidth="3.2" strokeLinecap="round" />
      <path d="M15 33c-2-9 2-15 7-17 1 7-1 13-7 17Z" fill={C.green} />
      <path d="M48 33c3-8 0-15-5-17-2 7 0 13 5 17Z" fill={C.deepGreen} />
      <circle cx="27" cy="27" r="8.5" fill={C.pale} />
      <path d="M27 20v14M27 25l-4-3M27 28l4-3M27 31l-4-3" fill="none" stroke="#9cbc6a" strokeWidth="1.1" strokeLinecap="round" />
      <path d="M34 25l9-6c1 1 1 2 0 3l-8 6Z" fill={C.rice} />
      <path d="M43 19l2-3M43 19l3-1" stroke={C.green} strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="38" cy="30" r="5" fill={C.tomato} />
      <circle cx="46" cy="31" r="4.4" fill={C.red} />
      <path d="M37 25.5l1.5 1 1.5-1" fill="none" stroke={C.green} strokeWidth="1.3" strokeLinecap="round" />
      <rect x="10" y="32" width="44" height="6" rx="3" fill={C.tanDark} />
      <path d="M12 38h40l-4 15H16Z" fill={C.tan} />
      <path d="M17 42.5h7M28 42.5h8M40 42.5h7M19 47h6M29 47h7M40 47h6M21 51h5M30 51h5M39 51h5" stroke={C.tanDark} strokeWidth="1.3" strokeLinecap="round" />
    </>
  ),

  /* Carved drum with sticks */
  culture: (
    <>
      <Shadow />
      <path d="M41 13l9-7M46 15l8-5" stroke={C.darkBrown} strokeWidth="2" strokeLinecap="round" />
      <circle cx="50.5" cy="5.6" r="1.8" fill={C.cream} />
      <circle cx="54.5" cy="9.6" r="1.8" fill={C.cream} />
      <path d="M20 22h24l-4 30H24Z" fill={C.brown} />
      <path d="M22 25l4 7M30 25l-4 7M30 25l4 7M38 25l-4 7M38 25l4 7" stroke={C.cream} strokeOpacity=".85" strokeWidth="1" />
      <path d="M21.6 34h20.8" stroke={C.darkBrown} strokeWidth="2.4" />
      <path d="M22.5 41l3 4 3-4 3 4 3-4 3 4 3-4" fill="none" stroke={C.orange} strokeWidth="1.8" strokeLinejoin="round" />
      <ellipse cx="32" cy="22" rx="12" ry="4" fill="#f3dcb0" stroke={C.darkBrown} strokeWidth="1.6" />
      <rect x="23" y="50" width="18" height="4" rx="2" fill={C.darkBrown} />
    </>
  ),

  /* Thatched lodge with a palm */
  stays: (
    <>
      <Shadow />
      <path d="M49 54c-1-10 0-19 3-27" fill="none" stroke={C.brown} strokeWidth="2.4" strokeLinecap="round" />
      <path d="M52 27c-6-4-11-2-13 1 5-1 9 0 13-1ZM52 27c4-6 9-6 11-4-4 0-8 2-11 4ZM52 27c-1-6 1-10 4-11-1 4-2 8-4 11Z" fill={C.green} />
      <rect x="13" y="31" width="30" height="21" rx="2" fill="#f3c98b" />
      <path d="M14 36.5l3-2.5 3 2.5 3-2.5 3 2.5 3-2.5 3 2.5 3-2.5 3 2.5 3-2.5 3 2.5" fill="none" stroke={C.red} strokeWidth="1.3" strokeLinejoin="round" />
      <rect x="24" y="40" width="8" height="12" rx="4" fill={C.deepGreen} />
      <rect x="16" y="40" width="5" height="5" rx="1" fill={C.blue} />
      <rect x="35" y="40" width="5" height="5" rx="1" fill={C.blue} />
      <path d="M9 33 28 15l19 18Z" fill={C.brown} />
      <path d="M17 27l-3 4M23 22l-4 7M28 18l-2 9M33 22l1 7M39 27l2 4" stroke="#b06a3a" strokeWidth="1.3" strokeLinecap="round" />
    </>
  ),

  /* Shopping bag in an ankara-style print */
  shops: (
    <>
      <Shadow />
      <path d="M24 25v-5a8 8 0 0 1 16 0v5" fill="none" stroke={C.darkBrown} strokeWidth="2.6" strokeLinecap="round" />
      <path d="M15 24h34l-3 29H18Z" fill={C.rice} />
      <rect x="15" y="24" width="34" height="4.5" fill="#c75e22" />
      <path d="M19 34l4 6 4-6 4 6 4-6 4 6 4-6 4 6" fill="none" stroke={C.deepGreen} strokeWidth="2" strokeLinejoin="round" />
      <path d="M24 45l3-3 3 3-3 3ZM34 45l3-3 3 3-3 3Z" fill={C.cream} />
      <circle cx="21" cy="46" r="1.1" fill={C.cream} />
      <circle cx="32" cy="50" r="1.1" fill={C.cream} />
      <circle cx="43" cy="46" r="1.1" fill={C.cream} />
    </>
  ),

  /* Location pin over a folded map */
  nearby: (
    <>
      <Shadow />
      <path d="M9 36l14-4v22l-14 4Z" fill="#b9d68a" />
      <path d="M23 32l18 4v22l-18-4Z" fill="#d7e8a8" />
      <path d="M41 36l14-4v22l-14 4Z" fill="#b9d68a" />
      <path d="M9 50c8-2 12 2 20-1s14 1 26-3" fill="none" stroke={C.blue} strokeWidth="2.2" strokeLinecap="round" />
      <path d="M14 40l8 4M34 41l3 10" stroke="#fff" strokeOpacity=".8" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M32 6c-7 0-12 5-12 12 0 9 12 21 12 21s12-12 12-21c0-7-5-12-12-12Z" fill={C.red} />
      <circle cx="32" cy="18" r="4.6" fill="#fff" />
    </>
  ),

  /* Hills, lake, sun and a palm */
  places: (
    <>
      <Shadow />
      <circle cx="45" cy="17" r="6.5" fill={C.orange} />
      <path d="M6 44c7-12 15-17 23-9 6-9 14-12 22-4 4 4 6 8 7 13Z" fill={C.leaf} />
      <path d="M6 44c9-7 18-8 26-3 7-5 16-5 26 3v8H6Z" fill={C.green} />
      <path d="M10 51c8-3 14-3 22-1s14 2 22-1v4H10Z" fill={C.blue} />
      <path d="M17 44c0-8 1-14 4-19" fill="none" stroke={C.brown} strokeWidth="2.2" strokeLinecap="round" />
      <path d="M21 25c-5-3-10-1-11 2 4-1 7 0 11-2ZM21 25c3-5 8-5 10-3-4 0-7 1-10 3ZM21 25c0-5 2-8 5-9-1 3-2 6-5 9Z" fill={C.deepGreen} />
    </>
  ),

  /* Carved wooden mask with a raffia fringe (culture & heritage) */
  mask: (
    <>
      <Shadow />
      <path d="M17 44c-2 6-1 10 1 12M22 46c-1 5 0 8 1 10M42 46c1 5 0 8-1 10M47 44c2 6 1 10-1 12" fill="none" stroke={C.tanDark} strokeWidth="2" strokeLinecap="round" />
      <path d="M32 6c-11 0-17 9-17 21 0 13 7 25 17 25s17-12 17-25C49 15 43 6 32 6Z" fill={C.brown} />
      <path d="M32 6c-5 3-7 8-7 14M32 6c5 3 7 8 7 14" fill="none" stroke={C.darkBrown} strokeWidth="1.6" strokeLinecap="round" />
      <path d="M22 26c2-2 6-2 8 0-2 2-6 2-8 0ZM34 26c2-2 6-2 8 0-2 2-6 2-8 0Z" fill={C.cream} />
      <path d="M32 27v12" stroke={C.darkBrown} strokeWidth="2" strokeLinecap="round" />
      <path d="M27 44c3 2 7 2 10 0" fill="none" stroke={C.cream} strokeWidth="2" strokeLinecap="round" />
      <path d="M19 33l2 3 2-3M41 33l2 3 2-3" fill="none" stroke={C.orange} strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="32" cy="14" r="1.6" fill={C.cream} />
    </>
  ),

  /* Home: a simple house */
  home: (
    <>
      <Shadow />
      <rect x="40" y="16" width="5" height="10" rx="1" fill={C.darkBrown} />
      <rect x="16" y="30" width="32" height="23" rx="2.5" fill={C.tan} />
      <path d="M10 32 32 13l22 19Z" fill={C.deepGreen} />
      <path d="M10 32 32 13l22 19" fill="none" stroke={C.green} strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round" />
      <rect x="27" y="40" width="10" height="13" rx="1.5" fill={C.brown} />
      <rect x="19" y="36" width="6" height="6" rx="1" fill={C.cream} />
      <rect x="39" y="36" width="6" height="6" rx="1" fill={C.cream} />
      <circle cx="34.5" cy="47" r=".9" fill={C.cream} />
    </>
  ),

  /* Discover: an open book with a leaf */
  discover: (
    <>
      <Shadow />
      <path d="M32 22c-6-4-14-5-21-4v31c7-1 15 0 21 4Z" fill={C.cream} />
      <path d="M32 22c6-4 14-5 21-4v31c-7-1-15 0-21 4Z" fill="#fbf1de" />
      <path d="M32 22v31" stroke={C.tanDark} strokeWidth="1.4" />
      <path d="M15 27c4-.5 9 0 13 2M15 32c4-.5 9 0 13 2M15 37c4-.5 9 0 13 2M36 29c4-2 9-2.5 13-2M36 34c4-2 9-2.5 13-2" stroke={C.tanDark} strokeOpacity=".7" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M9 49c8-1 16 0 23 4 7-4 15-5 23-4v3c-8-1-16 0-23 4-7-4-15-5-23-4Z" fill={C.deepGreen} />
      <path d="M45 41c2-7 8-10 12-9-1 5-6 9-12 9Z" fill={C.leaf} />
      <path d="M45 41c3-3 6-5 9-6" stroke={C.deepGreen} strokeWidth="1" strokeLinecap="round" />
    </>
  ),
};

/** Small flat illustration for a Native service (homepage tiles and the site menu). */
export function ServiceArt({ kind, className }: { kind: ArtKind; className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={cn("shrink-0", className)} aria-hidden>
      {art[kind]}
    </svg>
  );
}
